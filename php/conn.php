<?php
/**
 * 数据库连接（安全加固版）
 * - 凭证从环境变量读取，不再硬编码 root 空口令
 * - 禁止将数据库错误详情输出给客户端（防信息泄露）
 */
header('content-type:text/html;charset=utf-8'); // 设置编码

// 生产环境请通过环境变量 DB_HOST / DB_USER / DB_PASS / DB_NAME 配置，
// 不要把真实密码写进代码仓库。
define('HOST', getenv('DB_HOST') ?: 'localhost');
define('USERNAME', getenv('DB_USER') ?: 'root');
// 安全：默认不使用空口令；未配置 DB_PASS 环境变量时拒绝以 root 连接
if (getenv('DB_PASS') === false && USERNAME === 'root') {
    error_log('DB_PASS environment variable is not set; refusing insecure default credentials.');
    http_response_code(500);
    die('服务暂时不可用，请稍后重试');
}
define('PASSWORD', getenv('DB_PASS') !== false ? getenv('DB_PASS') : '');
define('DBNAME', getenv('DB_NAME') ?: 'project');

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
try {
    $conn = new mysqli(HOST, USERNAME, PASSWORD, DBNAME);
    $conn->set_charset('utf8mb4');
} catch (Throwable $e) {
    // 记录到服务端日志，客户端只返回通用提示
    error_log('DB connection failed: ' . $e->getMessage());
    http_response_code(500);
    die('服务暂时不可用，请稍后重试');
}

/**
 * 统一的安全查询入口：强制使用预处理语句（参数化查询），
 * 从根本上杜绝 SQL 注入。
 *
 * @param  string $sql    SQL，使用 ? 占位符
 * @param  array  $params [类型串如 'sis', 值1, 值2...] 或直接传值数组（按顺序绑定为字符串）
 * @return mysqli_stmt
 */
function db_prepare(mysqli $conn, string $sql, array $params = []): mysqli_stmt
{
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        error_log('Prepare failed: ' . $conn->error);
        throw new RuntimeException('查询失败');
    }
    if ($params) {
        if (is_string($params[0]) && strlen($params[0]) === count($params) - 1
            && preg_match('/^[bidss]+$/', $params[0])) {
            // 显式类型串
            $types = $params[0];
            $args   = array_slice($params, 1);
        } else {
            // 全部按字符串绑定
            $types = str_repeat('s', count($params));
            $args  = $params;
        }
        $refs = [];
        foreach ($args as $k => $v) {
            $refs[$k] = &$args[$k];
        }
        array_unshift($refs, $types);
        call_user_func_array([$stmt, 'bind_param'], $refs);
    }
    $stmt->execute();
    return $stmt;
}
