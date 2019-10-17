require(['config'], function () {//调用配置config配置模块
    require(['jquery'], function () {//加载模块

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
        })();

        //点击左侧楼层到达对应区域 楼梯效果

        (function louti() {
            let loutinav = $('#loutinav');
            let loutili = $('#loutinav ul li').not('.loutilast');
            let louceng = $('.louceng');
            let last = $('.loutilast');
            // 1.拖动滚动条显示隐藏的楼梯
            $(window).on('scroll', function () {
                let $top = $(window).scrollTop();
                if ($top >= 700) {
                    loutinav.show();
                } else {
                    loutinav.hide();
                }
                //4.拖动滚轮，楼梯和楼层对应 利用楼层的top值进行判断
                louceng.each(function (index, element) {
                    //每一个楼层的top值，固定的值。
                    let $loucengtop = louceng.eq(index).offset().top + $(element).height();
                    if ($loucengtop > $top) {
                        loutili.removeClass('active');
                        loutili.eq(index).addClass('active');
                        return false;
                    }
                });
            });
            //2.点击左侧楼梯，显示右侧对应的图层
            loutili.on('click', function () {
                let louceng = $('.louceng');
                $(this).addClass('active').siblings('li').removeClass('active');
                //获取每一个楼层的top值
                let $loucengtop = louceng.eq($(this).index()).offset().top;
                $('html,body').animate({
                    scrollTop: $loucengtop
                });
            });
            //3.回到顶部
            last.on('click', function () {
                $('html,body').stop().animate({
                    scrollTop: 0
                });
            });
        })();

        //轮播图效果

        (function lunbo() {
            let imgs = $('.scroll-content li');
            let btns = $('.scroll-btn span');
            //给当前点击的span按钮添加点击类           
            btns.on('mouseover', function () {
                $(this).addClass('active').siblings('span').removeClass('active');
                $('.scroll-content li').eq($(this).index()).show().siblings('li').hide();
            })

        })();
    })
})