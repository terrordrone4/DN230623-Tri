function checkForUserLoggedInStatus() {
    if (hadLoggedIn()) {
        console.log('user had already logged in');

        let login_signup = getNode("login-signup");
        hide(login_signup);

        showUsername();
    }
    else {
        console.log('user had NOT logged in');

        let nodes = getNodes("userStuffs");
        nodes.forEach(each => {
            hide(each);
        })

    }
}

let showUsername = () => {
    let avatarNode = getNode("account-avatar");
    let usernameNode = getNode("account-username");


    let email = load(key_currentUser).email;
    let emailFirstLetter = email.charAt(0);


    avatarNode.innerHTML = emailFirstLetter;
    usernameNode.innerHTML = email;
}

addEventListener("DOMContentLoaded", (event) => {
    checkForUserLoggedInStatus();
});
