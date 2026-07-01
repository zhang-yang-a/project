/**
 * Cookie 工具模块 - 重构版本
 * 提供统一的 Cookie 操作方法
 */
define([], function () {
    return {
        /**
         * 添加 Cookie
         * @param {string} key - Cookie 键名
         * @param {string} value - Cookie 值
         * @param {number} day - 过期天数
         */
        addCookie: function (key, value, day) {
            var date = new Date();
            date.setDate(date.getDate() + day);
            document.cookie = key + '=' + encodeURIComponent(value) + ';expires=' + date.toUTCString();
        },
        
        /**
         * 获取 Cookie
         * @param {string} key - Cookie 键名
         * @returns {string|null} Cookie 值，不存在返回 null
         */
        getCookie: function (key) {
            var cookieStr = decodeURIComponent(document.cookie);
            var arr = cookieStr.split('; ');
            for (var i = 0; i < arr.length; i++) {
                var newarr = arr[i].split('=');
                if (key === newarr[0]) {
                    return newarr[1];
                }
            }
            return null;
        },
        
        /**
         * 删除 Cookie
         * @param {string} key - Cookie 键名
         */
        delCookie: function (key) {
            var date = new Date();
            date.setDate(date.getDate() - 1);
            document.cookie = key + '=;expires=' + date.toUTCString();
        }
    };
});
