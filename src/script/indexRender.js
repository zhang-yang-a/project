require(['config'], function () {//调用配置config配置模块
    require(['jquery'], function () {//加载模块
        //渲染轮播图图片
        $.ajax({
            type: 'post',
            url: 'http://localhost/project/php/project.php',
            async: true,
            dataType: 'json',
        }).done(function (arrdata) {
            let strhtml = '';
            $.each(arrdata, function (index, value) {
                strhtml += `<li><a href="" target="_blank"><img src="${value.url}" alt=""></a></li>`
            });
            $('.scroll-content').html(strhtml);
        });
        //渲染精品区图片
        $.ajax({
            type: 'post',
            url: 'http://localhost/project/php/jingpin.php',
            async: true,
            dataType: 'json',
        }).done(function (arrdata) {
            let strhtml = '';
            $.each(arrdata, function (index, value) {
                strhtml += `<a class="back-img" href="">
                <img src="${value.url}" alt="">
            </a>`
            });
            $('.vivw-home div').html(strhtml);
        });

        //渲染tab切换大图 http://localhost/project/php/tab.php
        $.ajax({
            type: 'post',
            url: 'http://localhost/project/php/tab.php',
            async: true,
            dataType: 'json',
        }).done(function (arrdata) {
            let strhtml = '';
            $.each(arrdata, function (index, value) {
                strhtml += `<img src="${value.url}" alt="">`
            });
            $('.big-box-map').html(strhtml);
        });

        //渲染tab切换下面的小图 http://localhost/project/php/tabsm.php
        $.ajax({
            type: 'post',
            url: 'http://localhost/project/php/tabsm.php',
            async: true,
            dataType: 'json',
        }).done(function (arrdata) {
            let strhtml = '';
            let str = '';
            let str2 = '';
            $.each(arrdata, function (index, value) {
                if (index < 4) {
                    str += `<div><a href="${value.turl}" target="_blank">
                <img src="${value.url}"
                    alt="">
            </a>
            <p>${value.title}</p>
            <p>￥${value.price}</p></div>`;
                } else {
                    str2 += `<div><a href="${value.turl}" target="_blank">
                <img src="${value.url}"
                    alt="">
            </a>
            <p>${value.title}</p>
            <p>￥${value.price}</p></div>`;
                }
            });
            strhtml = '<div>' + str + '</div>' + '<div>' + str2 + '</div>'
            $('.small-box').html(strhtml);
        });
    })
})