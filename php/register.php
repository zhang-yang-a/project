<?php
/**
 * 注册接口（安全加固版）
 * - 预处理语句杜绝 SQL 注入
 * - password_hash 加盐哈希替代无盐 SHA1
 * - 服务端校验用户名/邮箱格式；唯一性由数据库约束+查重保证
 * - CSRF + 限流
 */
include 'conn.php';
include 'security.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify()) {
        json_out(['ok' => false, 'msg' => '请求校验失败，请刷新页面重试'], 403);
    }
    if (!rate_limit('register', 5, 900)) { // 防批量注册
        json_out(['ok' => false, 'msg' => '操作过于频繁，请稍后再试'], 429);
    }

    $username = clean_input('usename', 50);
    $password = (string)($_POST['pass'] ?? '');
    $email    = clean_input('email', 100);

    // —— 服务端强校验（不信任前端校验）——
    if (!preg_match('/^[A-Za-z0-9_\x{4e00}-\x{9fa5}]{3,50}$/u', $username)) {
        echo 0; exit; // 用户名格式非法
    }
    if (strlen($password) < 6 || strlen($password) > 255) {
        echo 0; exit; // 密码强度不足
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo 0; exit; // 邮箱格式非法
    }

    try {
        // 查重
        $stmt = db_prepare($conn, 'select username from registry where username = ? limit 1', ['s', $username]);
        if ($stmt->get_result()->fetch_assoc()) {
            echo 0; exit; // 用户名已存在
        }

        // 加盐哈希（bcrypt/argon2，由 PHP 默认算法决定）
        $hash = password_hash($password, PASSWORD_DEFAULT);

        $ins = db_prepare(
            $conn,
            'insert into registry (username, password, email) values (?, ?, ?)',
            ['sss', $username, $hash, $email]
        );
        echo $ins->affected_rows > 0 ? 1 : 0;
    } catch (Throwable $e) {
        error_log('register failed: ' . $e->getMessage());
        echo 0;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_out(['ok' => true, 'csrf_token' => csrf_token()]);
} else {
    json_out(['ok' => false, 'msg' => '非法操作'], 405);
}
