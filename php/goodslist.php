<?php
    include "conn.php";
    $result=$conn->query("select * from datails");
    $cartdata=array();
    for($i=0;$i<$result->num_rows;$i++){
        $cartdata[$i]=$result->fetch_assoc();
    }

    echo json_encode($cartdata);