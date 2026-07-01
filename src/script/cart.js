/**
 * 购物车模块 - 重构版本
 */
require(['config', 'jquery', 'cookie', 'ajaxpromise'], function (Config, $, Cookie, ajax) {
    var API_URL = Config.API_BASE_URL;
    
    // DOM 元素
    var $goodsWrap = $('.goods-wrap');
    
    /**
     * 获取购物车商品列表
     */
    function getCartItems() {
        var cookiesid = Cookie.getCookie('cookiesid');
        var cookienum = Cookie.getCookie('cookienum');
        
        if (!cookiesid || !cookienum) {
            return [];
        }
        
        var sidArr = cookiesid.split(',');
        var numArr = cookienum.split(',');
        
        var items = [];
        for (var i = 0; i < sidArr.length; i++) {
            items.push({
                sid: sidArr[i],
                num: parseInt(numArr[i]) || 1
            });
        }
        
        return items;
    }
    
    /**
     * 渲染单个商品
     */
    function renderCartItem(product) {
        return '<div class="goods-inner">' +
            '<ul>' +
            '<li><input type="checkbox" data-sid="' + product.sid + '"></li>' +
            '<li>' +
            '<dl class="fl"><img src="' + product.url + '" alt=""></dl>' +
            '<dt class="fl"><a href="#">' + product.title + '</a></dt>' +
            '</li>' +
            '<li class="goods-price">' +
            '<div class="price"><em class="price-now">￥' + product.price + '</em></div>' +
            '</li>' +
            '<li style="margin-left: 50px;">' +
            '<div class="goods-amount">' +
            '<a href="javascript:;" class="arrow-l" data-action="decrease">-</a>' +
            '<input type="text" value="' + product.num + '" data-sid="' + product.sid + '">' +
            '<a href="javascript:;" class="arrow-r" data-action="increase">+</a>' +
            '</div>' +
            '<div class="amount-msg"><em>限购十件</em></div>' +
            '</li>' +
            '<li>' +
            '<div class="price-sum"><em>￥' + (product.price * product.num) + '</em></div>' +
            '</li>' +
            '<li>' +
            '<div class="item-collect"><a href="javascript:;" data-action="delete">删除</a></div>' +
            '</li>' +
            '</ul>' +
            '</div>';
    }
    
    /**
     * 加载并渲染购物车商品
     */
    function loadCartProducts() {
        var items = getCartItems();
        
        if (items.length === 0) {
            $goodsWrap.html('<p class="empty-cart">购物车为空</p>');
            return;
        }
        
        ajax({
            url: API_URL + 'goodslist.php',
            dataType: 'json'
        }).done(function (dataList) {
            var html = '';
            
            $.each(items, function (index, item) {
                $.each(dataList, function (i, product) {
                    if (product.sid == item.sid) {
                        item.url = product.url;
                        item.title = product.title;
                        item.price = parseFloat(product.price);
                        html += renderCartItem(item);
                        return false;
                    }
                });
            });
            
            $goodsWrap.html(html);
            bindEvents();
        }).fail(function (err) {
            console.error('购物车商品加载失败:', err);
            $goodsWrap.html('<p class="error">加载失败，请重试</p>');
        });
    }
    
    /**
     * 更新 Cookie 中的商品数量
     */
    function updateCookie(sid, newNum) {
        var cookiesid = Cookie.getCookie('cookiesid');
        var cookienum = Cookie.getCookie('cookienum');
        
        if (!cookiesid || !cookienum) {
            return;
        }
        
        var sidArr = cookiesid.split(',');
        var numArr = cookienum.split(',');
        
        var index = sidArr.indexOf(sid);
        if (index !== -1) {
            numArr[index] = newNum.toString();
            
            Cookie.addCookie('cookiesid', sidArr.join(','), Config.CONSTANTS.COOKIE_EXPIRY_DAYS);
            Cookie.addCookie('cookienum', numArr.join(','), Config.CONSTANTS.COOKIE_EXPIRY_DAYS);
        }
    }
    
    /**
     * 从购物车删除商品
     */
    function removeCartItem(sid) {
        var cookiesid = Cookie.getCookie('cookiesid');
        var cookienum = Cookie.getCookie('cookienum');
        
        if (!cookiesid || !cookienum) {
            return;
        }
        
        var sidArr = cookiesid.split(',');
        var numArr = cookienum.split(',');
        
        var index = sidArr.indexOf(sid);
        if (index !== -1) {
            sidArr.splice(index, 1);
            numArr.splice(index, 1);
            
            if (sidArr.length === 0) {
                Cookie.delCookie('cookiesid');
                Cookie.delCookie('cookienum');
            } else {
                Cookie.addCookie('cookiesid', sidArr.join(','), Config.CONSTANTS.COOKIE_EXPIRY_DAYS);
                Cookie.addCookie('cookienum', numArr.join(','), Config.CONSTANTS.COOKIE_EXPIRY_DAYS);
            }
            
            loadCartProducts();
        }
    }
    
    /**
     * 绑定事件
     */
    function bindEvents() {
        // 数量增减
        $goodsWrap.on('click', '.arrow-l, .arrow-r', function () {
            var $btn = $(this);
            var $input = $btn.siblings('input');
            var currentNum = parseInt($input.val()) || 1;
            var action = $btn.data('action');
            var sid = $input.data('sid');
            
            if (action === 'increase') {
                if (currentNum < Config.CONSTANTS.MAX_PURCHASE_QUANTITY) {
                    currentNum++;
                }
            } else if (action === 'decrease') {
                if (currentNum > 1) {
                    currentNum--;
                }
            }
            
            $input.val(currentNum);
            updateCookie(sid, currentNum);
            
            // 更新总价
            var $priceItem = $btn.closest('.goods-inner');
            var price = parseFloat($priceItem.find('.price-now').text().replace('￥', ''));
            $priceItem.find('.price-sum em').text('￥' + (price * currentNum));
        });
        
        // 输入框直接修改数量
        $goodsWrap.on('change', '.goods-amount input', function () {
            var $input = $(this);
            var newNum = parseInt($input.val()) || 1;
            var sid = $input.data('sid');
            
            // 限制范围
            newNum = Math.max(1, Math.min(newNum, Config.CONSTANTS.MAX_PURCHASE_QUANTITY));
            $input.val(newNum);
            
            updateCookie(sid, newNum);
            
            // 更新总价
            var $priceItem = $input.closest('.goods-inner');
            var price = parseFloat($priceItem.find('.price-now').text().replace('￥', ''));
            $priceItem.find('.price-sum em').text('￥' + (price * newNum));
        });
        
        // 删除商品
        $goodsWrap.on('click', '[data-action="delete"]', function () {
            var $item = $(this).closest('.goods-inner');
            var $checkbox = $item.find('input[type="checkbox"]');
            var sid = $checkbox.data('sid');
            
            if (confirm('确定要删除该商品吗？')) {
                removeCartItem(sid);
            }
        });
        
        // 全选/取消全选
        $goodsWrap.on('change', '.selectAll', function () {
            var checked = $(this).prop('checked');
            $goodsWrap.find('input[type="checkbox"]').prop('checked', checked);
        });
    }
    
    /**
     * 初始化
     */
    function init() {
        loadCartProducts();
    }
    
    init();
});
