
require(['config'], function () {//调用配置config配置模块
    require(['jquery'], function () {//加载模块
        require(['cookie'], function (cookie) {
            let list = document.querySelector('.goods-wrap');
            return {
                ssss: (function () {
                    if (cookie.getcookie('cookiesid') && cookie.getcookie('cookienum')) {
                        let arrsid = cookie.getcookie('cookiesid').split(',');
                        let arrnum = cookie.getcookie('cookienum').split(',');
                        // 只接受纯数字的 sid，防止把恶意内容带入渲染与计算
                        arrsid = arrsid.filter(s => /^\d+$/.test(s));
                        for (let i = 0; i < arrsid.length; i++) {
                            cartxuanran(arrsid[i], arrnum[i]);
                        }
                    }
                    let strhtml = '';
                     function cartxuanran(sid, num) {
                        // 数量安全处理：仅允许 1~10 的整数（限购十件），防 Cookie 篡改
                        num = parseInt(num, 10);
                        if (!Number.isInteger(num) || num < 1) { num = 1; }
                        if (num > 10) { num = 10; }
                        $.ajax({
                            url: 'http://10.31.155.15/project/php/goodslist.php',
                            dataType: 'json',
                        }).done(function (datalist) {
                            
                           
                            for (let i = 0; i < datalist.length; i++) {
                               
                                if (String(datalist[i].sid) === String(sid)) {
                                    // XSS 防护：文本转义 + URL 协议白名单；价格以服务端为准并强制数值化
                                    const escapeHtml = (s) => String(s == null ? '' : s)
                                        .replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
                                    const safeUrl = (u) => {
                                        u = String(u || '').trim();
                                        return /^(https?:\/\/|\/|\.{1,2}\/)/i.test(u) ? u : '';
                                    };
                                    const title = escapeHtml(datalist[i].title);
                                    const img   = escapeHtml(safeUrl(datalist[i].url));
                                    const price = Number(datalist[i].price) || 0;
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
                                                <img src="${img}"
                                                    alt="">
                                            </dl>
                                            <dt class="fl">
                                                <a href="#">${title}</a>
                                            </dt>
                                        </li>
                                        <!-- 原价 现价 -->
                                        <li class="goods-price">
                                            <div class="price">
                                                <em class="price-now">￥${price.toFixed(2)}</em>
                                            </div>
                                        </li>
                                        <!-- 选择购买数量 -->
                                        <li style="margin-left: 50px;">
                                            <!-- 数量 -->
                                            <div class="goods-amount">
                                                <a href="javascript:;" class="arrow-l">-</a>
                                                <input type="text" value="${num}" data-price="${price}" maxlength="2">
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
                                                <em>￥${(price * num).toFixed(2)}</em>
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
