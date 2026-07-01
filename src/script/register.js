/**
 * 用户注册模块 - 重构版本
 */
require(['config', 'jquery', 'ajaxpromise', 'utils'], function (Config, $, ajax, Utils) {
    // DOM 元素缓存
    var $inputs = $('form input');
    var $submitBtn = $('.regi-btn');
    
    // 验证标志
    var validators = {
        username: false,
        email: false,
        password: false,
        repassword: false
    };
    
    /**
     * 用户名验证
     */
    function validateUsername() {
        var $input = $inputs.eq(0);
        var value = $input.val().trim();
        var $msgBox = $('.usename_box');
        
        if (!value) {
            Utils.showMessage($msgBox, '用户名不能为空', 'red');
            validators.username = false;
            return false;
        }
        
        if (!Utils.validateUsername(value)) {
            Utils.showMessage($msgBox, '格式不符，请重试', 'red');
            validators.username = false;
            $input.focus();
            return false;
        }
        
        // 检查用户名是否已存在
        ajax({
            url: Config.API_BASE_URL + 'regjiance.php',
            type: 'post',
            dataType: 'json',
            data: { xingming: value }
        }).done(function (data) {
            if (!data) {
                Utils.showMessage($msgBox, '用户名不能为空', 'red');
                validators.username = false;
            } else {
                Utils.showMessage($msgBox, '√', 'green');
                validators.username = true;
                $inputs.eq(1).focus();
            }
        }).fail(function (err) {
            Utils.showMessage($msgBox, '验证失败，请重试', 'red');
            validators.username = false;
        });
    }
    
    /**
     * 邮箱验证
     */
    function validateEmail() {
        var $input = $inputs.eq(1);
        var value = $input.val().trim();
        var $msgBox = $('.email_box');
        
        if (!value) {
            Utils.showMessage($msgBox, '邮箱不能为空', 'red');
            validators.email = false;
            return false;
        }
        
        if (!Utils.validateEmail(value)) {
            Utils.showMessage($msgBox, '格式不符合要求', 'red');
            validators.email = false;
            return false;
        }
        
        Utils.showMessage($msgBox, '√', 'green');
        validators.email = true;
        
        if (!$('.password-input').val()) {
            $inputs.eq(2).focus();
        }
        return true;
    }
    
    /**
     * 密码验证
     */
    function validatePassword() {
        var $input = $inputs.eq(2);
        var value = $input.val();
        var $msgBox = $('.password_box');
        
        if (!value) {
            Utils.showMessage($msgBox, '密码不能为空', 'red');
            validators.password = false;
            return false;
        }
        
        if (!Utils.validatePassword(value)) {
            Utils.showMessage($msgBox, '密码长度不够', 'red');
            validators.password = false;
            return false;
        }
        
        Utils.showMessage($msgBox, '√', 'green');
        validators.password = true;
        $inputs.eq(3).val('');
        $inputs.eq(3).focus();
        return true;
    }
    
    /**
     * 确认密码验证
     */
    function validateRepassword() {
        var $input = $inputs.eq(3);
        var value = $input.val();
        var password = $inputs.eq(2).val();
        var $msgBox = $('.password_box2');
        
        if (!value) {
            Utils.showMessage($msgBox, '确认密码不能为空', 'red');
            validators.repassword = false;
            return false;
        }
        
        if (value !== password) {
            Utils.showMessage($msgBox, '两次密码不一致', 'red');
            validators.repassword = false;
            return false;
        }
        
        Utils.showMessage($msgBox, '√', 'green');
        validators.repassword = true;
        return true;
    }
    
    /**
     * 提交表单
     */
    function submitForm() {
        // 重新验证所有字段
        validateUsername();
        validateEmail();
        validatePassword();
        validateRepassword();
        
        // 检查所有验证是否通过
        if (!validators.username || !validators.email || !validators.password || !validators.repassword) {
            return false;
        }
        
        // 发送注册请求
        ajax({
            url: Config.API_BASE_URL + 'register.php',
            type: 'post',
            data: {
                usename: $('#username').val(),
                email: $('.email-input').val(),
                pass: $('.password-input').val(),
                submit: $submitBtn.html()
            }
        }).done(function (data) {
            console.log(data);
            if (data == 1) {
                Utils.redirectTo(Config.PAGES.LOGIN);
            }
        }).fail(function (err) {
            console.error('注册失败:', err);
        });
        
        return false;
    }
    
    // 绑定事件
    function bindEvents() {
        // 用户名验证
        $inputs.eq(0).on('blur', validateUsername);
        
        // 邮箱验证
        $inputs.eq(1).on('blur', validateEmail);
        
        // 密码验证
        $inputs.eq(2).on('blur', validatePassword);
        
        // 确认密码验证
        $inputs.eq(3).on('blur', validateRepassword);
        
        // 提交按钮
        $submitBtn.on('click', submitForm);
    }
    
    // 初始化
    function init() {
        bindEvents();
        $inputs.eq(0).focus();
    }
    
    init();
});
