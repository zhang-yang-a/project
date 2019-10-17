//命名空间的方式：
const cookie = {
    addcookie: function (key, value, day) {
        var d = new Date();
        d.setDate(d.getDate() + day);
        document.cookie = key + '=' + value + ';expires=' + d;
    },
    getcookie: function (key) {
        var arr = document.cookie.split('; ');
        for (var i = 0; i < arr.length; i++) {
            var newarr = arr[i].split('=');
            if (newarr[0] === key) {
                return newarr[1];
            }
        }
    },
    delcookie: function (key) {
        addcookie(key, '', -1);
    }
}

function addcookie(key, value, day) {
    var d = new Date();
    d.setDate(d.getDate() + day);
    document.cookie = key + '=' + value + ';expires=' + d;
}

function getcookie(key) {
    var arr = document.cookie.split('; ');
    for (var i = 0; i < arr.length; i++) {
        var newarr = arr[i].split('=');
        if (newarr[0] === key) {
            return newarr[1];
        }
    }
}

function delcookie(key) {
    addcookie(key, '', -1);
}