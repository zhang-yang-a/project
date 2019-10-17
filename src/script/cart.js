
require(['config'], function () {//调用配置config配置模块
    require(['jquery'], function () {//加载模块
        require(['cookie'], function (cookie) {
            let list = document.querySelector('.goods-wrap');
            return {
                ssss: (function () {
                    if (cookie.getcookie('cookiesid') && cookie.getcookie('cookienum')) {
                        let arrsid = cookie.getcookie('cookiesid').split(',');
                        let arrnum = cookie.getcookie('cookienum').split(',');
                        for (let i = 0; i < arrsid.length; i++) {
                            cartxuanran(arrsid[i], arrnum[i]);
                        }
                    }
                    let strhtml = '';
                     function cartxuanran(sid, num) {
                        $.ajax({
                            url: 'http://10.31.155.15/project/php/goodslist.php',
                            dataType: 'json',
                        }).done(function (datalist) {
                            
                           
                            for (let i = 0; i < datalist.length; i++) {
                               
                                if (datalist[i].sid == sid) {
                                    console.log(2);
                                    strhtml += `<div class="goods-inner">
                                    <!-- 购物车内的商品 -->
                                    <ul>
                                        <!-- 勾选框 -->
                                        <li>
                                            <input type="checkbox">
                                        </li>
                                        <!-- 实例商品 js渲染 -->
                                        <li>
                                            <dl class="fl">
                                                <img src="${datalist[i].url}"
                                                    alt="">
                                            </dl>
                                            <dt class="fl">
                                                <a href="#">${datalist[i].title}</a>
                                            </dt>
                                        </li>
                                        <!-- 原价 现价 -->
                                        <li class="goods-price">
                                            <div class="price">
                                                <em class="price-now">￥${datalist[i].price}</em>
                                            </div>
                                        </li>
                                        <!-- 选择购买数量 -->
                                        <li style="margin-left: 50px;">
                                            <!-- 数量 -->
                                            <div class="goods-amount">
                                                <a href="javascript:;" class="arrow-l">-</a>
                                                <input type="text" value="${num}">
                                                <a href="javascript:;" class="arrow-r">+</a>
                                            </div>
                                            <!-- 限购 -->
                                            <div class="amount-msg">
                                                <em>限购十件</em>
                                            </div>
                                        </li>
                                        <!-- 总价 -->
                                        <li>
                                            <div class="price-sum">
                                                <em>￥${datalist[i].price * num}</em>
                                            </div>
                                        </li>
                                        <!-- 删除 收藏 相似宝贝 -->
                                        <li>
                                            <div class="item-collect">
                                                <a href="javascript:;">删除</a><br>
                                            </div>
                                        </li>
                                    </ul></div>`;
                                    
                                }
                            }
                            list.innerHTML = strhtml;
                            console.log(strhtml);
                        })
                       
                    }
                })(),
            }
        })
    })
})
