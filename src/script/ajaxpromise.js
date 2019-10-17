function $ajax(option) { //对象做参数
    let promise = new Promise(function (resolve, reject) {
        let ajax = new XMLHttpRequest();
        //1.type设置默认值,默认get
        option.type = option.type || 'get';

        //2.设置option.url.必填参数
        if (!option.url) {
            throw new Error('接口地址必须添加'); //创建错误对象，抛出错误，显示在控制台
        }

        //3.数据传输。
        //判断数据是否存在。
        //3.1判断数据的格式。
        function objToString(obj) {
            let objarr = [];
            for (var attr in obj) {
                objarr.push(attr + '=' + obj[attr]);
            }
            return objarr.join('&'); //name=zhangsna&age=100&sex=男
        }

        if (option.data) {
            if (typeof option.data === 'object' && !Array.isArray(option.data)) { //数据格式：对象
                option.data = objToString(option.data);
            } else {
                option.data = option.data;
            }
        }
        //3.2判断传输的方式--get
        if (option.data && option.type === 'get') {
            option.url += '?' + option.data;
        }

        //4.判断是否异步
        if (option.async === 'false' || option.async === false) {
            option.async = false;
        } else {
            option.async = true;
        }


        ajax.open(option.type, option.url, option.async);

        //3.3判断传输的方式--post
        if (option.data && option.type === 'post') {
            ajax.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
            ajax.send(option.data);
        } else {
            ajax.send();
        }
        //5.判断是否异步
        if (option.async) {
            ajax.onreadystatechange = function () {
                if (ajax.readyState === 4) { //ajax.send发送解析完成
                    if (ajax.status === 200) { //接口地址请求成功
                        //8.判断是否设置数据类型
                        if (option.dataType === 'json') {
                            objdata = JSON.parse(ajax.responseText);
                        } else {
                            objdata = ajax.responseText;
                        }
                        //6.设置请求成功状态
                        resolve(objdata); //objdata传给then里面函数。
                    } else {
                        //7.设置请求失败状态
                        reject('接口地址请求失败' + ajax.status);
                    }
                }
            }
        } else {
            if (ajax.status === 200) { //接口地址请求成功
                resolve(objdata); //objdata传给then里面函数。
            } else { //请求失败
                reject('接口地址请求失败' + ajax.status);
            }
        }
    });
    return promise;
}