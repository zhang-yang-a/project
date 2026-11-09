require(['config'], function () {//调用配置config配置模块
    require(['jquery'], function () {//加载模块
        require(['cookie'], function (cookie) {
            let phpurl = 'http://10.31.155.15/project/php/';
            const $sid = location.search.substring(1).split('=')[1];//获取地址栏的sid
            const $bpic = $('.b-pic');//定义大放图
            const $bf = $('.bf');//定义大放区域
            const $wrap = $('.s-pic');//小放移动的盒子大小
            const $spic = $('.sf-pic');//定义小放图
            const $sf = $('.sf');//定义小放
            const $listul = $('s-list');//定义小图列表 
            const $btnleft = $('#left');//列表图片的左箭头
            const $btnright = $('#right');//列表图片的右箭头
            const $cartbtn = $('.cart-add')//定义转跳到购物车页面按钮
            const $goodsnum = $('.tb-number-input')//购物车数量输入框
            return {
                detailsxuanran: (function () {
                    $.ajax({
                        url: phpurl + 'details.php',
                        dataType: 'json',
                        data: {
                            sid: $sid,//把sid传给后端，后端再返回给sid对应的数据
                        }
                    }).done(function (arrdata) {
                        if (!arrdata) { return; }
                        // XSS 防护：文本一律用 text()，URL 校验协议后再写入属性
                        const escapeHtml = (s) => $('<i/>').text(s == null ? '' : String(s)).html();
                        const safeUrl = (u) => {
                            u = String(u || '').trim();
                            return /^(https?:\/\/|\/|\.{1,2}\/)/i.test(u) ? u : '';
                        };
                        $('.sf-pic').attr('src', safeUrl(arrdata.url));
                        $('.b-pic').attr('src', safeUrl(arrdata.url));
                        $('h3').text(arrdata.title);
                        $('.price-jiage').text(String(arrdata.price).replace(/[^\d.]/g, ''));
                        //渲染小图下面的产品列表
                        let piclist = String(arrdata.urls || '').split(',');//数组
                        $picshtml = '';
                        $.each(piclist, function (index, value) {
                            const src = safeUrl(value);
                            if (src) {
                                $picshtml += `<li><img src="${escapeHtml(src)}" alt=""></li>`;
                            }
                        });
                        $('.s-list').html($picshtml);
                    });
                })(),

                setcookie: (function () {

                    let sidarr = [];//存放sid
                    let numarr = [];//存放数量
                    const cartbtn = document.querySelector('.cart-add')//加入购物车按钮
                    const goodsnum = document.querySelector('.tb-number-input')//购物车数量输入框
                    let sid = location.search.substring(1).split('=')[1];
                    //提前预定cookie的key值，才能应用判断
                    if (cookie.getcookie('cookiesid') && cookie.getcookie('cookienum')) {
                        sidarr = cookie.getcookie('cookiesid').split(',');
                        numarr = cookie.getcookie('cookienum').split(',');
                    }
                    //第一次加入购物车，创建商品列表，第二次只需要数量累加，提前获取cookie来验证
                    //点击加入购物车按钮，将当前页面商品的sid存放到sidarr数组中，一起存入cookie
                    cartbtn.onclick = function () {
                        // 数量服务端/前端双重限制：只允许 1~10 的整数，防篡改与注入 Cookie
                        let addnum = parseInt(goodsnum.value, 10);
                        if (!Number.isInteger(addnum) || addnum < 1) { addnum = 1; }
                        if (addnum > 10) { addnum = 10; }
                        goodsnum.value = addnum;
                        if (!/^\d+$/.test(String(sid))) { return; } // sid 必须是数字
                        alert('商品添加成功');
                        //当前取出的cookie里面存放sid的数组
                        if (sidarr.indexOf(sid) !== -1) {//第二次只需要数量累加
                            //获取当前sid对应的数量，取出数量，和当前的新的数量进行累加
                            //sidarr.indexOf(sid)//当前的sid在存入cooki数组的索引位置
                            let index = sidarr.indexOf(sid);
                           numarr[index] = parseInt(numarr[index]) + parseInt(goodsnum.value);
                            console.log(numarr[index]);
                            console.log(goodsnum.value);
                            cookie.addcookie('cookienum', numarr.toString(), 10);
                        } else {//第一次加入购物车，创建商品列表
                            sidarr.push(sid);
                            cookie.addcookie('cookiesid', sidarr.toString(), 10);
                            numarr.push(goodsnum.value);
                            cookie.addcookie('cookienum', numarr.toString(), 10);
                        }
                    }
                })()

            }

        })
    })
})