require(['config'], function () {//调用配置config配置模块
    require(['jquery'], function () {//加载模块
        (function () {
            alert('1');
        }());


        // 顶部悬浮下拉出现搜索框
        (function () {
            $(window).on('scroll', function () {
                let $top = $(window).scrollTop();
                $('title').html($top);
                if ($top >= 700) {
                    $('.search-top').stop(true).animate({
                        top: 0
                    });
                } else {
                    $('.search-top').stop(true).animate({
                        top: -60
                    });
                }
            });
        }());


        
    })
})