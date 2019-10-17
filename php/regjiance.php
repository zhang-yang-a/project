<?php
include "conn.php";
if (isset($_POST['xingming'])) {
    $newname = $_POST['xingming'];
    //通过查询方式来测试是否存在用户名。
    $result = $conn->query("select * from registry where username='$newname'");
    if ($result->fetch_assoc()) { //存在
        echo true; //1
    } else { //不存在
        echo false; //空隙
    }
}
//http://10.31.155.15/project/php/regjiance.php