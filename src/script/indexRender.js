/**
 * 首页数据渲染模块 - 重构版本
 */
require(['config', 'jquery', 'lazyload'], function (Config, $) {
    var API_URL = Config.API_BASE_URL;
    
    /**
     * 渲染轮播图
     */
    function renderCarousel() {
        $.ajax({
            type: 'post',
            url: API_URL + 'project.php',
            dataType: 'json'
        }).done(function (arrdata) {
            var strhtml = '';
            $.each(arrdata, function (index, value) {
                strhtml += '<li><a href="" target="_blank">' +
                    '<img class="lazy" data-original="' + value.url + 
                    '" width="1200" height="460" alt=""></a></li>';
            });
            $('.scroll-content').html(strhtml);
            initLazyLoad();
        }).fail(function (err) {
            console.error('轮播图加载失败:', err);
        });
    }
    
    /**
     * 渲染精品区
     */
    function renderJingpin() {
        $.ajax({
            type: 'post',
            url: API_URL + 'jingpin.php',
            dataType: 'json'
        }).done(function (arrdata) {
            var strhtml = '';
            $.each(arrdata, function (index, value) {
                strhtml += '<a class="back-img" href="">' +
                    '<img class="lazy" data-original="' + value.url + 
                    '" width="198" height="220" alt=""></a>';
            });
            $('.vivw-home div').html(strhtml);
            initLazyLoad();
        }).fail(function (err) {
            console.error('精品区加载失败:', err);
        });
    }
    
    /**
     * 渲染 Tab 切换大图
     */
    function renderTabBig() {
        $.ajax({
            type: 'post',
            url: API_URL + 'tab.php',
            dataType: 'json'
        }).done(function (arrdata) {
            var strhtml = '';
            $.each(arrdata, function (index, value) {
                strhtml += '<img src="' + value.url + '" alt="">';
            });
            $('.big-box-map').html(strhtml);
        }).fail(function (err) {
            console.error('Tab 大图加载失败:', err);
        });
    }
    
    /**
     * 渲染 Tab 切换小图
     */
    function renderTabSmall() {
        $.ajax({
            type: 'post',
            url: API_URL + 'tabsm.php',
            dataType: 'json'
        }).done(function (arrdata) {
            var str1 = '';
            var str2 = '';
            
            $.each(arrdata, function (index, value) {
                var itemHtml = '<div><a href="details.html?sid=' + value.sid + '" target="_blank">' +
                    '<img src="' + value.url + '" alt=""></a>' +
                    '<p>' + value.title + '</p>' +
                    '<p>￥' + value.price + '</p></div>';
                
                if (index < 4) {
                    str1 += itemHtml;
                } else {
                    str2 += itemHtml;
                }
            });
            
            $('.small-box').html('<div>' + str1 + '</div><div>' + str2 + '</div>');
        }).fail(function (err) {
            console.error('Tab 小图加载失败:', err);
        });
    }
    
    /**
     * 初始化懒加载
     */
    function initLazyLoad() {
        $(function () {
            $('img.lazy').lazyload({
                effect: 'fadeIn'
            });
        });
    }
    
    /**
     * 初始化
     */
    function init() {
        renderCarousel();
        renderJingpin();
        renderTabBig();
        renderTabSmall();
    }
    
    init();
});
