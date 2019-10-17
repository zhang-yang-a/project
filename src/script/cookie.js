define([], function () {
    return {
        addcookie: function (key, value, day) {
            let date = new Date();
            date.setDate(date.getDate() + day);
            document.cookie = key + '=' + encodeURIComponent(value) + ';expires=' + date;
        },
        getcookie: function (key) {
            let arr = decodeURIComponent(document.cookie).split('; ');
            for (let value of arr) {
                let newarr = value.split('=');
                if (key === newarr[0]) {
                    return newarr[1];
                }
            }
        },
        delcookie: function delcookie(key) {
            addcookie(key, '', -1);
        }
    }
})
