/**
 * 商品详情页模块 - 重构版本
 */
require(['config', 'jquery', 'cookie'], function (Config, $, Cookie) {
    var API_URL = Config.API_BASE_URL;
    
    // 获取 URL 中的商品 ID
    function getProductId() {
        var search = window.location.search.substring(1);
        var params = search.split('=');
        return params[1] || null;
    }
    
    /**
     * 渲染商品详情
     */
    function renderProductDetail(productId) {
        $.ajax({
            url: API_URL + 'details.php',
            dataType: 'json',
            data: { sid: productId }
        }).done(function (data) {
            // 渲染主图
            $('.sf-pic, .b-pic').attr('src', data.url);
            
            // 渲染标题和价格
            $('h3').html(data.title);
            $('.price-jiage').html(data.price);
            
            // 渲染小图列表
            if (data.urls) {
                var picList = data.urls.split(',');
                var picsHtml = '';
                $.each(picList, function (index, value) {
                    picsHtml += '<li><img src="' + value + '" alt=""></li>';
                });
                $('.s-list').html(picsHtml);
            }
        }).fail(function (err) {
            console.error('商品详情加载失败:', err);
        });
    }
    
    /**
     * 初始化放大镜效果
     */
    function initMagnifier() {
        var $bigPic = $('.b-pic');
        var $smallPic = $('.sf-pic');
        var $wrap = $('.s-pic');
        var $sf = $('.sf');
        
        $sf.on('mouseenter', function () {
            $('.bf').show();
        }).on('mouseleave', function () {
            $('.bf').hide();
        }).on('mousemove', function (e) {
            var wrapOffset = $(this).offset();
            var x = e.pageX - wrapOffset.left;
            var y = e.pageY - wrapOffset.top;
            
            // 计算放大镜位置
            var sfWidth = $(this).width();
            var sfHeight = $(this).height();
            var moveWidth = sfWidth / 2;
            var moveHeight = sfHeight / 2;
            
            var left = x - moveWidth / 2;
            var top = y - moveHeight / 2;
            
            // 边界限制
            left = Math.max(0, Math.min(left, sfWidth - moveWidth));
            top = Math.max(0, Math.min(top, sfHeight - moveHeight));
            
            $('.sf-pic').css({ left: left, top: top });
            
            // 同步大图移动
            var bfWidth = $('.bf').width();
            var bfHeight = $('.bf').height();
            var bigImgLeft = -left * (bfWidth / moveWidth);
            var bigImgTop = -top * (bfHeight / moveHeight);
            
            $bigPic.css({ left: bigImgLeft, top: bigImgTop });
        });
    }
    
    /**
     * 加入购物车功能
     */
    function initAddToCart() {
        var productId = getProductId();
        var sidArr = [];
        var numArr = [];
        
        // 读取已有购物车数据
        if (Cookie.getCookie('cookiesid') && Cookie.getCookie('cookienum')) {
            sidArr = Cookie.getCookie('cookiesid').split(',');
            numArr = Cookie.getCookie('cookienum').split(',');
        }
        
        $('.cart-add').on('click', function () {
            var quantity = parseInt($('.tb-number-input').val()) || 1;
            
            // 检查商品是否已在购物车中
            var index = sidArr.indexOf(productId);
            if (index !== -1) {
                // 数量累加
                numArr[index] = parseInt(numArr[index]) + quantity;
            } else {
                // 添加新商品
                sidArr.push(productId);
                numArr.push(quantity.toString());
            }
            
            // 保存到 Cookie
            Cookie.addCookie('cookiesid', sidArr.join(','), Config.CONSTANTS.COOKIE_EXPIRY_DAYS);
            Cookie.addCookie('cookienum', numArr.join(','), Config.CONSTANTS.COOKIE_EXPIRY_DAYS);
            
            alert('商品添加成功');
        });
    }
    
    /**
     * 初始化
     */
    function init() {
        var productId = getProductId();
        if (productId) {
            renderProductDetail(productId);
            initAddToCart();
        }
    }
    
    init();
});
