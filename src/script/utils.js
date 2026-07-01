/**
 * 通用工具函数模块 - 重构版本
 * 提供项目中常用的工具函数
 */
define(['config'], function (Config) {
    return {
        /**
         * 验证用户名格式
         * @param {string} username - 用户名
         * @returns {boolean} 是否有效
         */
        validateUsername: function (username) {
            if (!username || username.trim() === '') {
                return false;
            }
            return Config.REGEX.USERNAME.test(username);
        },
        
        /**
         * 验证邮箱格式
         * @param {string} email - 邮箱地址
         * @returns {boolean} 是否有效
         */
        validateEmail: function (email) {
            if (!email || email.trim() === '') {
                return false;
            }
            return Config.REGEX.EMAIL.test(email);
        },
        
        /**
         * 验证密码格式
         * @param {string} password - 密码
         * @returns {boolean} 是否有效
         */
        validatePassword: function (password) {
            if (!password || password.length < Config.CONSTANTS.PASSWORD_MIN_LENGTH) {
                return false;
            }
            return password.length <= Config.CONSTANTS.PASSWORD_MAX_LENGTH;
        },
        
        /**
         * 显示提示信息
         * @param {jQuery} $element - 显示提示的元素
         * @param {string} message - 提示信息
         * @param {string} color - 文字颜色
         */
        showMessage: function ($element, message, color) {
            $element.html(message).css({ 'color': color || '#333' });
        },
        
        /**
         * 防抖函数
         * @param {Function} func - 需要防抖的函数
         * @param {number} wait - 等待时间（毫秒）
         * @returns {Function} 防抖后的函数
         */
        debounce: function (func, wait) {
            var timeout;
            return function () {
                var context = this;
                var args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    func.apply(context, args);
                }, wait);
            };
        },
        
        /**
         * 节流函数
         * @param {Function} func - 需要节流的函数
         * @param {number} delay - 延迟时间（毫秒）
         * @returns {Function} 节流后的函数
         */
        throttle: function (func, delay) {
            var lastTime = 0;
            return function () {
                var context = this;
                var args = arguments;
                var now = Date.now();
                if (now - lastTime >= delay) {
                    lastTime = now;
                    func.apply(context, args);
                }
            };
        },
        
        /**
         * 获取 URL 参数
         * @param {string} name - 参数名
         * @returns {string|null} 参数值
         */
        getUrlParam: function (name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return decodeURIComponent(r[2]);
            }
            return null;
        },
        
        /**
         * 页面跳转
         * @param {string} page - 页面路径
         */
        redirectTo: function (page) {
            window.location.href = page;
        }
    };
});
