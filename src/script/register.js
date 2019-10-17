require(['config'], function () {//调用配置config配置模块
    require(['jquery'], function () {//加载模块
        const aInput = document.querySelectorAll('form input');
        const pForm = document.querySelector('.regi-btn');

        let usenameflag = true;
        let emailflag = true;
        let passflag = true;
        let repassflag = true;
        let telflag = true;

        //用户名验证
        aInput[0].focus();
        aInput[0].onfocus = function () {
            if (this.value === '') {
                usenameflag = false;
            }
        }
        aInput[0].onblur = function () {

            if (this.value !== '') {
                let usename = /^[\u4e00-\u9fa5a-zA-Z0-9\-]{4,20}$/;
                if (usename.test(this.value)) {
                    $('.usename_box').html('√').css({ 'color': 'green' });
                    usenameflag = true;
                    $.ajax({
                        url: "http://10.31.155.15/project/php/regjiance.php",
                        dataType: "json",
                        type: 'post',
                        data: {
                            xingming: $('#username').val(),
                        },
                    }).done(function (d) {
                        if (!d) {
                            $('.usename_box').html('用户名不能为空').css({ 'color': 'red' });
                        } else {
                            $('.usename_box').html('用户名已存在').css({ 'color': 'red' });
                            aInput[0].focus();
                            usenameflag = false;
                        }
                    });
                    aInput[1].focus();
                } else {
                    $('.usename_box').html('格式不符，请重试').css({ 'color': 'red' });
                    usenameflag = false;
                    this.focus();
                }
            } else {
                $('.usename_box').html('用户名不能为空').css({ 'color': 'red' });
                usenameflag = false;
                this.focus();
            }
        }
        //邮箱验证
        aInput[1].onfocus = function () {
            if (this.value === '') {
                emailflag = false;
            }
        };
        aInput[1].onblur = function () {
            if (this.value !== '') {
                //规则
                let email = /^(\w+[+-._]*\w+)\@(\w+[+-.]*\w+)\.(\w+[+-.]*\w+)$/;
                if (email.test(this.value)) {
                    $('.email_box').html('√').css({ 'color': 'green' });
                    emailflag = true;
                    if ($('.password-input').val() == '') {
                        aInput[2].focus();
                    }

                } else {
                    $('.email_box').html('格式不符合要求').css({ 'color': 'red' });
                    emailflag = false;
                }
            } else {
                $('.email_box').html('邮箱不能为空').css({ 'color': 'red' });
                emailflag = false;
            }
        }
        //密码验证
        aInput[2].onfocus = function () {
            if (this.value === '') {
                passflag = true;
                aInput[3].value = '';
                passflag = false;
            } else {
                aInput[3].value = '';
                $('.password_box').html('请再次输入上面的密码').css({ 'color': '#aaa' });
                passflag = false;

            }
        };
        aInput[2].onblur = function () {
            if (this.value !== '') {
                if (this.value.length >= 6 && this.value.length <= 20) {
                    $('.password_box').html('√').css({ 'color': 'green' });
                    aInput[3].focus();
                    aInput[3].value = '';
                    passflag = true;
                } else {
                    $('.password_box').html('密码长度不够').css({ 'color': 'red' });
                    passflag = false;
                }
            } else {
                $('.password_box').html('密码不能为空').css({ 'color': 'red' });
                aInput[3].value = '';
                passflag = false;
            }
        }

        //确认密码
        aInput[3].onfocus = function () {
            if (this.value === '') {
                repassflag = false;
            }
        };
        aInput[3].onblur = function () {
            if (this.value !== '') {
                if (this.value === aInput[2].value) {
                    $('.password_box2').html('√').css({ 'color': 'green' });
                    repassflag = true;

                } else {
                    $('.password_box2').html('俩次密码不一致').css({ 'color': 'red' });
                    repassflag = false;
                }
            } else {
                $('.password_box2').html('确认密码不能为空').css({ 'color': 'red' });
                repassflag = false;
            }
        }


        //提交按钮
        //控制提交--form + submit
        pForm.onclick = function () {//提交
            // 数据请求
            const $username = $('#username');
            const $email = $('.email-input');
            const $password = $('.password-input');
            const $repassword = $('.password-input-2');
            const $submit = $('.regi-btn');
            console.log(2);

            if (aInput[0].value === '') {
                $('.usename_box').html('用户名不能为空').css({ 'color': 'red' });
                usenameflag = false;
            }
            if (aInput[1].value === '') {
                $('.email_box').html('邮箱不能为空').css({ 'color': 'red' });
                emailflag = false;
            }
            if (aInput[2].value === '') {
                $('.password_box').html('密码不能为空').css({ 'color': 'red' });
                passflag = false;
            }
            if (aInput[3].value === '') {
                $('.password_box2').html('确认密码不能为空').css({ 'color': 'red' });
                repassflag = false;
            }
            if (!usenameflag || !emailflag || !passflag || !repassflag) { //阻止
                return false;
            } else {
                $.ajax({
                    url: "http://10.31.155.15/project/php/register.php",
                    // dataType: "json",
                    type: "post",
                    data: {
                        usename: $username.val(),
                        email: $email.val(),
                        pass: $password.val(),
                        submit: $submit.html(),
                    },
                }).done(function (data) {
                    console.log(data);
                    if (data == 1) {
                        location.href = 'http://10.31.155.15/project/src/login.html';
                    }
                });
            }
        }
    })
})