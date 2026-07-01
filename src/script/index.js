/**
 * 首页交互模块 - 重构版本
 */
require(['config', 'jquery'], function (Config, $) {
    var $window = $(window);
    
    /**
     * 顶部搜索框悬浮效果
     */
    function initSearchScroll() {
        var $searchTop = $(Config.SELECTORS.SEARCH_TOP || '.search-top');
        
        $window.on('scroll', Utils.throttle(function () {
            var scrollTop = $window.scrollTop();
            
            if (scrollTop >= Config.CONSTANTS.SCROLL_THRESHOLD) {
                $searchTop.stop(true).animate({ top: 0 });
            } else {
                $searchTop.stop(true).animate({ top: -60 });
            }
        }, 100));
    }
    
    /**
     * 楼层导航效果
     */
    function initFloorNav() {
        var $loutiNav = $('#loutinav');
        var $loutiList = $('#loutinav ul li').not('.loutilast');
        var $louceng = $('.louceng');
        var $last = $('.loutilast');
        
        // 滚动时显示/隐藏楼梯
        $window.on('scroll', Utils.throttle(function () {
            var scrollTop = $window.scrollTop();
            
            // 显示/隐藏楼梯
            if (scrollTop >= Config.CONSTANTS.SCROLL_THRESHOLD) {
                $loutiNav.show();
            } else {
                $loutiNav.hide();
            }
            
            // 高亮当前楼层
            $louceng.each(function (index, element) {
                var loucengTop = $louceng.eq(index).offset().top + $(element).height();
                if (loucengTop > scrollTop) {
                    $loutiList.removeClass('active');
                    $loutiList.eq(index).addClass('active');
                    return false;
                }
            });
        }, 100));
        
        // 点击楼梯跳转到对应楼层
        $loutiList.on('click', function () {
            $(this).addClass('active').siblings('li').removeClass('active');
            var targetTop = $louceng.eq($(this).index()).offset().top;
            $('html,body').animate({ scrollTop: targetTop });
        });
        
        // 回到顶部
        $last.on('click', function () {
            $('html,body').stop().animate({ scrollTop: 0 });
        });
    }
    
    /**
     * 轮播图效果
     */
    function initCarousel() {
        var $imgs = $('.scroll-content li');
        var $btns = $('.scroll-btn span');
        var timer = null;
        var currentIndex = 0;
        
        // 鼠标悬停切换
        $btns.on('mouseover', function () {
            currentIndex = $(this).index();
            updateCarousel();
        });
        
        function updateCarousel() {
            $btns.eq(currentIndex).addClass('active').siblings('span').removeClass('active');
            $imgs.eq(currentIndex).show().siblings('li').hide();
        }
        
        // 自动播放（可选）
        function autoPlay() {
            timer = setInterval(function () {
                currentIndex = (currentIndex + 1) % $imgs.length;
                updateCarousel();
            }, 3000);
        }
        
        // 暂停播放
        $('.scroll-content, .scroll-btn').on('mouseenter', function () {
            clearInterval(timer);
        }).on('mouseleave', function () {
            autoPlay();
        });
        
        autoPlay();
    }
    
    /**
     * 工具函数（局部）
     */
    var Utils = {
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
        }
    };
    
    /**
     * 初始化
     */
    function init() {
        initSearchScroll();
        initFloorNav();
        initCarousel();
    }
    
    init();
});
