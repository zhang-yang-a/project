<?php
/**
 * 登录接口（安全加固版）
 * - 预处理语句杜绝 SQL 注入
 * - password_verify 校验新哈希，兼容旧 SHA1 数据并自动升级
 * - 限流防暴力破解；统一失败响应防用户名枚举
 */
include 'conn.php';
include 'security.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CSRF 防护（若前端未带 token，可先请求本接口 GET 获取）
    if (!csrf_verify()) {
        json_out(['ok' => false, 'msg' => '请求校验失败，请刷新页面重试'], 403);
    }
    // 限流：15 分钟内最多 10 次尝试
    if (!rate_limit('login', 10, 900)) {
        json_out(['ok' => false, 'msg' => '尝试次数过多，请稍后再试'], 429);
    }

    $user = clean_input('username', 50);
    $pass = (string)($_POST['password'] ?? '');

    if ($user === '' || $pass === '' || strlen($pass) > 255) {
        json_out(['ok' => false, 'msg' => '用户名或密码错误'], 401);
    }

    try {
        $stmt = db_prepare($conn, 'select username, password from registry where username = ? limit 1', ['s', $user]);
        $row = $stmt->get_result()->fetch_assoc();
    } catch (Throwable $e) {
        error_log('login query failed: ' . $e->getMessage());
        json_out(['ok' => false, 'msg' => '服务暂时不可用'], 500);
    }

    $ok = false;
    if ($row) {
        $stored = $row['password'];
        if (strlen($stored) === 40 && preg_match('/^[0-9a-f]{40}$/i', $stored)) {
            // 兼容历史 SHA1 数据：校验通过后升级为强哈希
            if (hash_equals(strtolower($stored), sha1($pass))) {
                $ok = true;
                $newHash = password_hash($pass, PASSWORD_DEFAULT);
                $up = db_prepare($conn, 'update registry set password = ? where username = ?', ['s', $newHash, $user]);
            }
        } elseif (password_verify($pass, $stored)) {
            $ok = true;
            if (password_needs_rehash($stored, PASSWORD_DEFAULT)) {
                $newHash = password_hash($pass, PASSWORD_DEFAULT);
                $up = db_prepare($conn, 'update registry set password = ? where username = ?', ['s', $newHash, $user]);
            }
        }
    }

    if ($ok) {
        session_regenerate_id(true); // 防会话固定
        $_SESSION['logged_in'] = true;
        $_SESSION['username']  = $user;
        echo 'true';
    } else {
        // 统一提示，不暴露用户是否存在
        echo 'false';
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // 下发 CSRF token 供前端登录后使用
    json_out(['ok' => true, 'csrf_token' => csrf_token()]);
} else {
    json_out(['ok' => false, 'msg' => '非法操作'], 405);
}
