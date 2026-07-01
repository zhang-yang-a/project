/**
 * Ajax Promise 封装模块 - 重构版本
 * 基于 XMLHttpRequest 和 Promise 的异步请求封装
 */
define([], function () {
    /**
     * 对象转 URL 参数
     * @param {Object} obj - 参数对象
     * @returns {string} URL 参数字符串
     */
    function objToString(obj) {
        var objarr = [];
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                objarr.push(encodeURIComponent(attr) + '=' + encodeURIComponent(obj[attr]));
            }
        }
        return objarr.join('&');
    }

    /**
     * Ajax 请求函数
     * @param {Object} option - 请求配置对象
     * @param {string} option.url - 请求地址（必填）
     * @param {string} [option.type='get'] - 请求类型，默认 get
     * @param {Object|string} [option.data] - 请求数据
     * @param {boolean} [option.async=true] - 是否异步
     * @param {string} [option.dataType] - 数据类型，如'json'
     * @returns {Promise} Promise 对象
     */
    function $ajax(option) {
        return new Promise(function (resolve, reject) {
            var ajax = new XMLHttpRequest();
            var objdata;
            
            // 1. 设置默认值
            option.type = option.type || 'get';
            
            // 2. 验证必填参数
            if (!option.url) {
                throw new Error('接口地址必须添加');
            }
            
            // 3. 处理请求数据
            if (option.data) {
                if (typeof option.data === 'object' && !Array.isArray(option.data)) {
                    option.data = objToString(option.data);
                }
            }
            
            // 4. GET 请求参数拼接到 URL
            if (option.data && option.type === 'get') {
                option.url += (option.url.indexOf('?') === -1 ? '?' : '&') + option.data;
            }
            
            // 5. 设置异步标志
            option.async = (option.async === false || option.async === 'false') ? false : true;
            
            // 6. 初始化请求
            ajax.open(option.type, option.url, option.async);
            
            // 7. 发送请求
            if (option.data && option.type === 'post') {
                ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                ajax.send(option.data);
            } else {
                ajax.send();
            }
            
            // 8. 处理响应
            if (option.async) {
                ajax.onreadystatechange = function () {
                    if (ajax.readyState === 4) {
                        if (ajax.status === 200) {
                            if (option.dataType === 'json') {
                                try {
                                    objdata = JSON.parse(ajax.responseText);
                                } catch (e) {
                                    reject('JSON 解析失败：' + e.message);
                                    return;
                                }
                            } else {
                                objdata = ajax.responseText;
                            }
                            resolve(objdata);
                        } else {
                            reject('接口地址请求失败，状态码：' + ajax.status);
                        }
                    }
                };
            } else {
                // 同步请求（不推荐使用）
                if (ajax.status === 200) {
                    if (option.dataType === 'json') {
                        try {
                            objdata = JSON.parse(ajax.responseText);
                        } catch (e) {
                            reject('JSON 解析失败：' + e.message);
                            return;
                        }
                    } else {
                        objdata = ajax.responseText;
                    }
                    resolve(objdata);
                } else {
                    reject('接口地址请求失败，状态码：' + ajax.status);
                }
            }
        });
    }

    return $ajax;
});
