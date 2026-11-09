<?php
/**
 * 商品列表接口（安全加固版）
 * - 只选取必要字段，避免把整表数据无差别暴露
 * - 错误不回显给客户端
 */
include 'conn.php';
include 'security.php';

try {
    $stmt = db_prepare($conn, 'select sid, url, title, price from datails');
    $res = $stmt->get_result();
    $cartdata = [];
    while ($row = $res->fetch_assoc()) {
        $cartdata[] = $row;
    }
    echo json_encode($cartdata, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    error_log('goodslist failed: ' . $e->getMessage());
    json_out([], 500);
}
