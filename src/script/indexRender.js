require(['config'], function () {//调用配置config配置模块
    require(['jquery'], function () {//加载模块
        // XSS 防护：模板插值一律转义；URL 只允许 http(s)/相对路径
        const escapeHtml = (s) => String(s == null ? '' : s)
            .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        const safeUrl = (u) => {
            u = String(u || '').trim();
            return /^(https?:\/\/|\/|\.{1,2}\/)/i.test(u) ? u : '';
        };
        let phpurl = 'http://10.31.155.15/project/php/';
        require(['lazyload'], function () {
            //渲染轮播图图片
            $.ajax({
                type: 'post',
                url: phpurl + 'project.php',
                async: true,
                dataType: 'json',
            }).done(function (arrdata) {
                let strhtml = '';
                $.each(arrdata, function (index, value) {//
                    strhtml += `<li><a href="" target="_blank"><img class="lazy" data-original="${escapeHtml(safeUrl(value.url))}"  width="1200" height="460" alt=""></a></li>`
                });
                $('.scroll-content').html(strhtml);
                //懒加载
                $(function () { //页面加载完成
                    $("img.lazy").lazyload({
                        effect: "fadeIn" //效果方式
                    });
                });
            });
            //渲染精品区图片
            $.ajax({
                type: 'post',
                url: phpurl + 'jingpin.php',
                async: true,
                dataType: 'json',
            }).done(function (arrdata) {
                let strhtml = '';
                $.each(arrdata, function (index, value) {
                    strhtml += `<a class="back-img" href="">
                    <img class="lazy" data-original="${escapeHtml(safeUrl(value.url))}" width="198" height="220" alt="">
                </a>`
                });
                $('.vivw-home div').html(strhtml);
                //懒加载
                $(function () { //页面加载完成
                    $("img.lazy").lazyload({
                        effect: "fadeIn" //效果方式
                    });
                });
            });

            //渲染tab切换大图 http://localhost/project/php/tab.php
            $.ajax({
                type: 'post',
                url: phpurl + 'tab.php',
                async: true,
                dataType: 'json',
            }).done(function (arrdata) {
                let strhtml = '';
                $.each(arrdata, function (index, value) {
                    strhtml += `<img src="${escapeHtml(safeUrl(value.url))}" alt="">`
                });
                $('.big-box-map').html(strhtml);
                 //懒加载
                $(function () { //页面加载完成
                    $("img.lazy").lazyload({
                        effect: "fadeIn" //效果方式
                    });
                });
            });

            //渲染tab切换下面的小图 http://10.31.155.15/project/php/tabsm.php
            $.ajax({
                type: 'post',
                url: phpurl + 'tabsm.php',
                async: true,
                dataType: 'json',
            }).done(function (arrdata) {
                let strhtml = '';
                let str = '';
                let str2 = '';
                //http://10.31.155.15/project/src/details.html
                $.each(arrdata, function (index, value) {
                    if (index < 4) {
                        str += `<div><a href="details.html?sid=${encodeURIComponent(String(Number(value.sid)||0))}" target="_blank">
                    <img src="${escapeHtml(safeUrl(value.url))}"
                        alt="">
                </a>
                <p>${escapeHtml(value.title)}</p>
                <p>￥${escapeHtml(String(Number(value.price)||0))}</p></div>`;
                    } else {
                        str2 += `<div><a href="details.html?sid=${encodeURIComponent(String(Number(value.sid)||0))}" target="_blank">
                    <img src="${escapeHtml(safeUrl(value.url))}"
                        alt="">
                </a>
                <p>${escapeHtml(value.title)}</p>
                <p>￥${escapeHtml(String(Number(value.price)||0))}</p></div>`;
                    }
                });
                strhtml = '<div>' + str + '</div>' + '<div>' + str2 + '</div>'
                $('.small-box').html(strhtml);
                 //懒加载
                 $(function () { //页面加载完成
                    $("img.lazy").lazyload({
                        effect: "fadeIn" //效果方式
                    });
                });
            });
        });
    })
})