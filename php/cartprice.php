<?php
/**
 * 服务器端价格校验接口（安全加固新增）
 * 用途：购物车页面用本接口获取"服务端权威价格"，替代把整张商品表
 * 暴露给前端并由 Cookie 决定数量的旧逻辑。只接受 sid 列表（≤100 个），
 * 返回白名单字段 {sid, price}，防止价格被客户端篡改。
 */
include 'conn.php';
include 'security.php';

$sids = isset($_GET['sids']) ? $_GET['sids'] : (isset($_POST['sids']) ? $_POST['sids'] : '');
if (!is_string($sids)) {
    json_out([], 400);
}

$idList = array_slice(array_filter(explode(',', $sids), function ($v) {
    return preg_match('/^\d{1,10}$/', trim($v));
}), 0, 100);

if (!$idList) {
    json_out([]);
}

try {
    $in      = implode(',', array_fill(0, count($idList), '?'));
    $types   = str_repeat('i', count($idList));
    $params  = [$types];
    foreach ($idList as $id) {
        $params[] = (int)$id;
    }
    $stmt = db_prepare($conn, "select sid, price from datails where sid in ($in)", $params);
    $res = $stmt->get_result();
    $out = [];
    while ($row = $res->fetch_assoc()) {
        $out[] = ['sid' => (int)$row['sid'], 'price' => (float)$row['price']];
    }
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    error_log('cartprice failed: ' . $e->getMessage());
    json_out([], 500);
}
