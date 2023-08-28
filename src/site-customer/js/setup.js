

window.addEventListener("load", function () {

    //----------user----------------
    if (load(key_usersDB) != null) {
        console.log('userDB already available');
        
    }
    else {

        const DB_users = FakeData.fakeUserData;
        DB_users.forEach(element => {
            element.password = hash(element.password);
        })
        save(key_usersDB, DB_users);
    }
    //-------cart-------------
    if (load(key_cart) != null) {
        console.log('cartDB already available');
        
    }
    else {
        save(key_cart, FakeData.fakeUserCart);
    }

});  
