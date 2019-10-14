
<?php
//1.数据库连接
header('content-type:text/html;charset=utf-8');//设置编码
define('HOST','localhost');//设置主机名
define('USERNAME','root');//设置用户名
define('PASSWORD','');//设置密码
define('DBNAME','project');//设置数据库名称

$conn=@new mysqli(HOST,USERNAME,PASSWORD,DBNAME);//连接数据库的对象
if($conn->connect_error){
    die('数据库连接失败'.$conn->connect_error);//输出错误信息并退出。
}