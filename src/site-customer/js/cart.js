


addEventListener("DOMContentLoaded", (event) => {
    cart_main();
});

let cart_main = () => {
    cart_hook();
    cart_wire();
}


let cart_hook = () => {
    $("#shopping-basket").click(
        function () {
            let userCart = getUserCart();
            if (userCart.cartItems.length > 0) {
                toggleCart();
            }
            else{
                hideCart();
            }
        }
    );
}

let cart_wire = () => {
    let userCart = getUserCart();
    if(!userCart || !userCart.cartItems || userCart.cartItems.length == 0){
        return;
    }
    let imgLinkTrail = "../../asset/image/productImage/";
    let id = 0;
    cloneAndWire("cart-item", userCart.cartItems.length,
        function () {
            let cartItem = userCart.cartItems[id];
            let product = ProductUtil.selectProduct(cartItem.productId);
            let currentImg = product.imgs[0];
            let imgSrc = imgLinkTrail + currentImg;
            let author = AuthorUtil.select(product.authorId);


            $(this).find("img").first().attr('src', imgSrc)

            $(this).find(".title").first().html(
                product.title_text + '<span class="light"> ' + product.title_extra_info + '</span>'
            );

            $(this).find(".auth").html(
                'by '
                + '<a href="">' + author.username + '</a>'
            );
            $(this).find(".price").html(
                '<span class="dollar">$</span>' + product.price
            );
            $(this).find(".trash").click(
                function () {
                    console.log('removeitem');
                    CartUtil.removeItemFromCart(cartItem, userCart.id);
                    reloadPage();
                }
            );
            $(this).on("mouseover",
                function () {
                    $(this).find(".trash").show();
                }
            );
            $(this).on("mouseout",
                function () {
                    $(this).find(".trash").hide();
                }
            );
            id++;
        }
    );


    let totalPrice = 0;
    userCart.cartItems.forEach(eachCartItem => {
        let product = ProductUtil.selectProduct(eachCartItem.productId);
        totalPrice += product.price;
    })
    $('#cart-item-total-price').html(
        '<span class="dollar">$</span>'
        + totalPrice
    )
}

const cartId = "shopping-basket-container";
function toggleCart() {
    setEnable(cartId, !isEnabled(cartId));
}

function showCart() {
    setEnable(cartId, true);
}
function hideCart() {
    setEnable(cartId, false);
}

function tryAddingToCart(product) {
    let userCart = getUserCart();

    if(!userCart) return false;

    //add items to cart
    let accepted = CartUtil.addToCart(userCart, product);
    //save cart infos into DB
    CartUtil.saveCart(userCart);

    return accepted;
}

function getUserCart() {
    let loggedin_user = getCurrentUser();
    if (!loggedin_user) return;
    user = AccountUtil.select(loggedin_user.id);
    if (user == null) {
        console.error('no user with id ', loggedin_user.id);
        return;
    }
    let userCart = null;

    if (!('cartId' in user)
        || CartUtil.select(user.cartId) == null) {
        userCart = CartUtil.create();
        user.cartId = userCart.id;
        let savedUser = AccountUtil.saveUser(user);
    }
    else {
        userCart = CartUtil.select(user.cartId);
    }
    return userCart;
}