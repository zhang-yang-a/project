//配置模块
require.config({ 
    baseUrl:'https://cdnjs.cloudflare.com/ajax/libs/',//公有的路径
    paths:{
        'jquery':'jquery/1.12.4/jquery.min',  //插件名称必须交jquery
        'jqcookie':'jquery-cookie/1.4.1/jquery.cookie.min'
    }
});