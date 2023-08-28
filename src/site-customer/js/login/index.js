// Sự kiện window.onload có ý nghĩa rằng khi trình duyệt đã load xong mọi thứ (image, js, css) thì những đoạn code nằm bên trong đó mới được chạy. 
window.onload = function () {
    class User {
        constructor(name, email, pswd) {
            this.name = name
            this.email = email
            this.pswd = pswd
        }
    }
    document.getElementById("btn-sign-up").addEventListener("click", onSignUp);
    document.getElementById("btn-login").addEventListener("click", onLogin);

    function onSignUp() {
        let name = document.getElementById("sign-name").value
        let email = document.getElementById("sign-email").value
        let pswd = document.getElementById("sign-pswd").value

        // hướng dẫn validate pass, trường hợp name , email các bạn tự  bổ sung
        if (validatePassword(pswd)) {
            let UserSignUp = new User(name, email, pswd);
            let usersStorage = localStorage.getItem('users')

            if (!usersStorage) {
                usersStorage = new Array();
            } else {
                usersStorage = JSON.parse(usersStorage)
            }

            const indexOfUser = usersStorage.findIndex(i => i.email === email);
            if (indexOfUser !== -1) {
                alert('Tài khoản đã tồn tài !')
            } else {
                usersStorage.push(UserSignUp)
                localStorage.setItem('users', JSON.stringify(usersStorage))
                alert('Đăng ký thành công !')
            }
        }
        document.getElementById("sign-pswd").value =''
    }

    function onLogin() {
        let email = document.getElementById("login-email").value
        let pswd = document.getElementById("login-pswd").value

        // hướng dẫn validate pass, trường hợp email các bạn tự  bổ sung
        if (validatePassword(pswd)) {
            let usersStorage = localStorage.getItem('users')
            if (!usersStorage) {
                usersStorage = new Array();
            } else {
                usersStorage = JSON.parse(usersStorage)
            }
            const indexOfUser = usersStorage.findIndex(i => i.email === email && i.pswd === pswd);
            if (indexOfUser !== -1) {
                alert('Đăng nhập thành công !')
            } else {
                alert('Đăng nhập thất bại !')
            }

            document.getElementById("login-pswd").value =''
        }
    }

    function validatePassword(password) {
        console.log(password)
        // ^ Chuỗi mật khẩu sẽ bắt đầu theo cách này
        // (?=.*[a-z]) Chuỗi phải chứa ít nhất 1 ký tự chữ cái viết thường
        // (?=.*[A-Z]) Chuỗi phải chứa ít nhất 1 ký tự chữ cái viết hoa
        // (?=.*[0-9]) Chuỗi phải chứa ít nhất 1 ký tự số
        // (?=.*[!@#$%^&*]) Chuỗi phải chứa ít nhất một ký tự đặc biệt, nhưng chúng tôi đang thoát các ký tự RegEx dành riêng để tránh xung đột
        // (?=.{8,}) Chuỗi phải có tám ký tự trở lên
        var passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

        // Check if the password is empty
        if (password == "") {
            alert("Vui lòng nhập mật khẩu ");
            return false;
        }
        // Kiểm tra xem mật khẩu có đủ mạnh không
        if (!password.toString().match(passwordRegex)) {
            alert("Mật khẩu phải dài ít nhất 8 ký tự và chứa ít nhất một chữ thường, một chữ in hoa và một số va` 1 ki tu dac biet");
            return false;
        }
        // If all checks pass, return true
        return true;
    }

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    //Xóa toàn bộ dữ liệu trong localStorage
    //localStorage.clear()
 
};