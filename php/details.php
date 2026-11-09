<?php
/**
 * 商品详情接口（安全加固版）
 * - sid 强制校验为正整数 + 预处理绑定，杜绝 SQL 注入
 * - 输出 JSON_UNESCAPED_UNICODE，前端仍须做 HTML 转义渲染（防 XSS）
 */
include 'conn.php';
include 'security.php';

$sid = clean_id('sid');
if ($sid === null || $sid <= 0) {
    json_out(null); // 非法 id 直接返回空，不再进入 SQL
}

try {
    $stmt = db_prepare($conn, 'select * from datails where sid = ? limit 1', ['i', $sid]);
    $row = $stmt->get_result()->fetch_assoc();
    echo json_encode($row ?: null, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    error_log('details failed: ' . $e->getMessage());
    json_out(null, 500);
}
