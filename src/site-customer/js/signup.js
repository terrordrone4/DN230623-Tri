
var isSignupShowing = false;

const signup_hook = () => {
    console.log('signup_hook');
    hook("close-dim", "click", () => {
        setEnable('signup-overlay', false);
        isSignupShowing = false;

        setEnable("signup-failed", false);
    });
    hook("hook-show-register", "click", () => {
        setEnable('signup-overlay', true);
        isSignupShowing = true;
    });
    hook("hook-signup", "click", () => {
        console.log("signup > submit...");
        let input_signup_email = getNode('su_email');
        let input_signup_password = getNode('su_password');

        let email = input_signup_email.value;
        let password = input_signup_password.value;
        signup_submit(email, password);
    });

}

let signup_submit = (inputEmail, inputPassword) => {
    let hasAccountExisted = false;
    let userDB = load(key_usersDB);

    let passedValidation = validate({
        inputEmail: inputEmail,
        inputPassword: inputPassword,
    }
    )

    if (!passedValidation) {
        console.log('not passed validation');
        return;
    }

    console.log('validate success, checking in with DB...');
    userDB.every((user) => {
        let hashedInputPassword = hash(inputPassword);

        let isMatched = true;
        isMatched &= inputEmail == user.email;
        isMatched &= hashedInputPassword == user.password;

        if (isMatched) {
            hasAccountExisted = true;
            
            setEnable("signup-failed-user-existed", true);
            return false; //similar to break;
        }
        return true;//similar to continue;
    })

    if (hasAccountExisted) {
        onSignupFailure();
    } else {
        onSignupSuccess(inputEmail, inputPassword);
    }
}

let validate = (targetObj) => {
    let passedValidation = true;

    passedValidation = validateEmail(targetObj.inputEmail);
    passedValidation &= validatePassword(targetObj.inputPassword)

    return passedValidation;
}

function validateEmail(inputEmail) {
    setEnable("signup-failed-invalid-email", false);
    if (inputEmail == "") {
        setEnable("signup-failed-invalid-email", true);
        console.info("empty email !");
        return false;
    }
    if (!inputEmail.toString().toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )) {
        setEnable("signup-failed-invalid-email", true);
        console.info("email not matched with regex !");
        return false;
    }
    return true;
}

function validatePassword(inputPassword) {

    setEnable("signup-failed-invalid-password", false);

    let passedValidation = true;
    if (inputPassword == "") {
        passedValidation = false;
        setEnable("signup-failed-invalid-password", true);
    }
    if (!inputPassword.toString().match(passwordRegex)) {
        passedValidation = false;
        setEnable("signup-failed-invalid-password", true);
    }
    return passedValidation;
}

let onSignupFailure = () => {
    console.log('onSignupFailure');
    //clearInputClass("su_input");
}

let onSignupSuccess = (inputEmail, inputPassword) => {
    console.log('onSignupSuccess');

    let hashedInputPassword = hash(inputPassword);
    let newUser = AccountUtil.userFrom(inputEmail, hashedInputPassword);
    let DB_users = load(key_usersDB);

    DB_users.push(newUser);
    save(key_usersDB, DB_users);

    //login too...
    save(key_currentUser, newUser);

    reloadPage();
}

var signup_mounted = function mounted() {
    console.log("signup.js mounting...");
    signup_hook();
};

setTimeout(() => {
    signup_mounted();
}, 1500);

