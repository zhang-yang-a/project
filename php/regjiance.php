<?php
/**
 * 用户名检测接口（安全加固版）
 * - 预处理语句杜绝 SQL 注入
 * - GET 下发 csrf_token，POST 校验 token + 限流
 */
include 'conn.php';
include 'security.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_verify()) {
        json_out(['ok' => false, 'msg' => '请求校验失败，请刷新页面重试'], 403);
    }
    if (!rate_limit('regjiance', 30, 900)) { // 防止被用来枚举用户名
        json_out(['ok' => false, 'msg' => '操作过于频繁，请稍后再试'], 429);
    }

    $newname = clean_input('xingming', 50);
    if ($newname === '') {
        echo false;
        exit;
    }

    try {
        $stmt = db_prepare($conn, 'select 1 from registry where username = ? limit 1', ['s', $newname]);
        echo $stmt->get_result()->fetch_assoc() ? 'true' : 'false';
    } catch (Throwable $e) {
        error_log('regjiance failed: ' . $e->getMessage());
        echo 'false';
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    json_out(['ok' => true, 'csrf_token' => csrf_token()]);
} else {
    json_out(['ok' => false, 'msg' => '非法操作'], 405);
}
