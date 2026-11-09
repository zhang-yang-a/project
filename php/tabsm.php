<?php
/**
 * tabsm.php —— 安全加固版
 * - 复用 conn.php（环境变量凭证 + mysqli_report），不再硬编码 root 空口令
 * - 静态白名单表名：tabsm，无用户输入进入 SQL
 * - 连接/查询失败不回显错误详情
 */
include 'conn.php';
include 'security.php';

try {
    $stmt = db_prepare($conn, 'select sid, url, title, price,turl from tabsm');
    $arrdata = array();
    $res = $stmt->get_result();
    while ($row = $res->fetch_assoc()) {
        $arrdata[] = $row;
    }
    echo json_encode($arrdata, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    error_log('tabsm failed: ' . $e->getMessage());
    json_out([], 500);
}
