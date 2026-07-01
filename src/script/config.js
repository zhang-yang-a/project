// 全局配置模块 - 重构版本
define(function () {
    return {
        // API 基础地址 - 便于环境切换
        API_BASE_URL: 'http://10.31.155.15/project/php/',
        
        // 页面路径配置
        PAGES: {
            LOGIN: 'login.html',
            REGISTER: 'register.html',
            DETAILS: 'details.html',
            CART: 'cart.html',
            INDEX: 'index.html'
        },
        
        // 通用常量
        CONSTANTS: {
            SCROLL_THRESHOLD: 700,
            COOKIE_EXPIRY_DAYS: 10,
            MAX_PURCHASE_QUANTITY: 10,
            PASSWORD_MIN_LENGTH: 6,
            PASSWORD_MAX_LENGTH: 20,
            USERNAME_MIN_LENGTH: 4,
            USERNAME_MAX_LENGTH: 20
        },
        
        // 正则表达式配置
        REGEX: {
            USERNAME: /^[\u4e00-\u9fa5a-zA-Z0-9\-]{4,20}$/,
            EMAIL: /^(\w+[+-._]*\w+)\@(\w+[+-.]*\w+)\.(\w+[+-.]*\w+)$/
        }
    };
});
