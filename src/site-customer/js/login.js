var show_login_button;
var login_modal;
var login_submit_button;
var input_login_email;
var input_login_password;

const login_loadRef = () => {
    console.log("login page loading refs..");
    show_login_button = document.getElementById("hook-show-login");
    login_modal = document.getElementById("login-container");
    login_submit_button = document.getElementById("hook-submit-login");

    input_login_email = document.getElementById("input-login-email");
    input_login_password = document.getElementById("input-login-password");
}


const login_hook = () => {
    show_login_button.onclick = () => {
        console.log("smashing the login button");
        toggleLoginModal();
    }

    let toggleLoginModal = () => {
        login_modal.hidden = !login_modal.hidden;
    }

    let hideMyLoginModal = () => {
        if (login_modal.hidden == false)
            login_modal.hidden = true;
    }

    login_submit_button.onclick = () => {

        let email = input_login_email.value;
        let password = input_login_password.value;

        login_submit(email, password);
    }

    let login_submit = (inputEmail, inputPassword) => {
        
        let isLoginSuccess = false;
        let userDB = load(key_usersDB);
        let hashedInputPassword = hash(inputPassword);
        let userFound = null;
        userDB.every((user) => {

            let isMatched = true;
            isMatched &= inputEmail == user.email;
            isMatched &= hashedInputPassword == user.password;

            if (isMatched) {
                isLoginSuccess = true;
                userFound = user;
                return false; //similar to break;
            }
            return true;//similar to continue;
        })

        if (isLoginSuccess) {
            onLoginSuccess(userFound.id, userFound.email, hashedInputPassword );
        } else {
            onLoginFailure();
        }
    }
    hook("avatar-container", "click", () => {
        let isUserPanelEnabled = isEnabled("user-panel-container");
        console.log('isEnabled', isUserPanelEnabled);
        setEnable("user-panel-container", !isUserPanelEnabled);
    })

    hook("log_out", "click", () => {
        console.log('logging out...');
        removeFromStorage(key_currentUser);
        reloadPage();
        console.log('reloaded !?');
    })

}

function show_login_modal (){
    login_modal.hidden = false;
}


var onLoginSuccess = (userId, inputEmail, hashedInputPassword ) => {
    console.log('onLoginSuccess');
    let currentUser = {id: userId, email: inputEmail, password: hashedInputPassword};
    save(key_currentUser, currentUser);
    reloadPage();
}

var onLoginFailure = () => {
    console.log('onLoginFailure');
    show_login_failed_error();
}

var login_mounted = function mounted() {
    console.log("login.js mounting...");
    login_loadRef();
    login_hook();
};

var show_login_failed_error = () => {
    let domNode = document.getElementById("alert-login-failed");
    domNode.style.display = 'block';
}

var hide_login_failed_error = () => {
    let domNode = document.getElementById("alert-login-failed");
    domNode.style.display = 'none';
}


setTimeout(() => {
    console.log("timeup, running login.js");
    login_mounted();
}, 1500);
