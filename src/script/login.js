/**
 * 用户登录模块 - 重构版本
 */
require(['config', 'jquery', 'ajaxpromise', 'utils', 'cookie'], function (Config, $, ajax, Utils, Cookie) {
    
    /**
     * 处理登录表单提交
     */
    function handleLogin(username, password, rememberMe) {
        // 验证输入
        if (!username || !password) {
            alert('请输入用户名和密码');
            return false;
        }
        
        // 发送登录请求
        ajax({
            url: Config.API_BASE_URL + 'login.php',
            type: 'post',
            dataType: 'json',
            data: {
                username: username,
                password: password
            }
        }).done(function (data) {
            console.log(data);
            if (data && data.success) {
                // 记住登录状态
                if (rememberMe) {
                    Cookie.addCookie('username', username, 7);
                }
                
                // 跳转到首页
                Utils.redirectTo(Config.PAGES.INDEX);
            } else {
                alert('用户名或密码错误');
            }
        }).fail(function (err) {
            console.error('登录失败:', err);
            alert('登录失败，请重试');
        });
        
        return false;
    }
    
    /**
     * 初始化
     */
    function init() {
        // 绑定登录表单提交事件
        $('.login-form').on('submit', function (e) {
            e.preventDefault();
            
            var username = $(this).find('[name="username"]').val();
            var password = $(this).find('[name="password"]').val();
            var rememberMe = $(this).find('[name="remember"]').is(':checked');
            
            handleLogin(username, password, rememberMe);
        });
        
        // 记住用户名
        var savedUsername = Cookie.getCookie('username');
        if (savedUsername) {
            $('[name="username"]').val(savedUsername);
            $('[name="remember"]').prop('checked', true);
        }
    }
    
    init();
});
