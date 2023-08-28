let hash = (content) => {
    return md5(salt + content);
}

let toJson = (dataInJavascript) => {
    return JSON.stringify(dataInJavascript);
}
let fromJson = (dataAsJsonString) => {
    return JSON.parse(dataAsJsonString);
}

let save = (key, content) => {
    localStorage.setItem(key, toJson(content));
}

let load = (key) => {
    return fromJson(localStorage.getItem(key));
}

let removeFromStorage = (key) => {
    localStorage.removeItem(key);
}

let reloadPage = () => {
    setTimeout(function () {
        window.location.reload();
    });
    console.log('page reloaded....!');
}

let getCurrentUser = () => {
    return load(key_currentUser);
}
let hadLoggedIn = () => {
    return load(key_currentUser) != null;
}

let isUndefined = (someVar) => {
    return typeof someVar === 'undefined';
}

let hasValue = (someVar, context = "") => {
    if (someVar == null) {
        //console.warn('variable ',someVar,' is null', context); 
        return false;
    }
    if (isUndefined(someVar)) {
        //console.warn('variable ',varName,' is undefined', context);      
        return false;
    }
    if (someVar == NaN) {
        //console.warn('variable ',varName,' is not a number', context);         
        return false;
    }
    return true;
}

function isElement(obj) {
    return (
        typeof HTMLElement === "object" ? obj instanceof HTMLElement : //DOM2
            obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string"
    );
}

let getNode = (id) => {
    let tryGet = null;

    tryGet = document.getElementById(id);

    if (hasValue(tryGet, " when querying dom node with id " + id)) {
        //
    }
    return tryGet;
}


let getNodes = (classname, parent) => {
    if (!classname) {
        console.error("classname cannot be null");
        return null;
    }
    let tryGets = null;

    if (parent) {
        tryGets = parent.getElementsByClassName(classname);
    }
    else {
        tryGets = document.getElementsByClassName(classname);
    }

    tryGets = arrayFromHTMLCollection(tryGets);

    if (tryGets.length == 0) {
        console.warn('no such domNode with className:', className);
    }
    return tryGets;
}

let arrayFromHTMLCollection = (targetHTMLCollection) => {
    let newArray = [];
    for (let i = 0; i < targetHTMLCollection.length; i++) {
        newArray.push(targetHTMLCollection[i]);
    }
    return newArray;
}

let isEnabled = (nodeId) => {
    let node = getNode(nodeId);
    if (!node) return false;

    return node.style.display != 'none';
}

let setEnable = (id, toEnabledOrNot = true) => {
    let node = getNode(id);
    if (node) {
        if (toEnabledOrNot)
            show(node);
        else
            hide(node);

        return true;
    }
    return false;
}

let setEnableAll = (className, toEnabledOrNot = true) => {
    let nodes = getNodes(className);
    if (nodes.length == 0) return false;
    nodes.forEach(
        node => {
            if (toEnabledOrNot)
                show(node);
            else
                hide(node);

            return true;
        }
    );
}

let hide = (domNode) => {
    if (isUndefined(domNode)) return;
    domNode.style.display = 'none';
}
let show = (domNode, displayStyle = 'block') => {
    if (isUndefined(domNode)) return;
    domNode.style.display = displayStyle;
}


let showNodeId = (nodeId, displayStyle = 'block') => {
    let domNode = getNode(nodeId);
    if (isUndefined(domNode)) return;
    domNode.style.display = displayStyle;
}

let clearInputClass = (className) => {
    let nodes = getNodes(className);
    if (!nodes || nodes.length == 0) {
        console.warn("no such node with className ", className);
        return;
    }
    nodes.forEach(
        (eachInput) => {
            eachInput.value = "";
        }
    );
}

let hook = (nodeId, targetActionName, func) => {
    let node = getNode(nodeId);
    return hookNode(node, targetActionName, func);
}

let hookNode = (node, targetActionName, func) => {
    if (!node) return false;
    node.addEventListener(targetActionName, func)
    return true;
}



let fixUpId = (arrayOfObjs) => {
    let id = 0;
    arrayOfObjs.forEach(element => {
        element.id = id;
        id++;
    });
    return arrayOfObjs;
}

let convertToDate = (dayAsDDMMYYYY, splitString = "-") => {
    let dateParts = dayAsDDMMYYYY.split(splitString);

    // month is 0-based, that's why we need dataParts[1] - 1
    let dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

    return dateObject;
}

let cloneDOM = (source, keepSameParent = true) => {

    let newDOM = source.cloneNode(true);

    if (keepSameParent) {
        let sharedParentNode = source.parentNode;
        sharedParentNode.appendChild(newDOM);
    }
    //TODO: gen new id for newDOM
    return newDOM;
}

let cloneAndWire = (classNames, cloneThreshold, wireFunc) => {
    if (!Array.isArray(classNames)) {
        classNames = [classNames];
    }
    while (classNames.length > 0) {
        let className = classNames.pop();

        let doms = $("." + className).toArray();

        let howManyMoreToClone = cloneThreshold - doms.length;
        let source = doms[0];
        while (howManyMoreToClone > 0) {
            let newDOM = cloneDOM(source);
            doms.push(newDOM);
            howManyMoreToClone = cloneThreshold - doms.length;
        }

        $("." + className).each(wireFunc);
    }
}

class StringUtil {
    static upperCaseFirst(targetString) {
        let firstLetterCapped = targetString.charAt(0).toUpperCase();
        let remainingLetters = targetString.slice(1);

        return firstLetterCapped + remainingLetters;
    }
}

class AccountUtil {
    static selectAll() {
        let userDB = load(key_usersDB);
        return userDB;
    }
    static select(id) {
        let userDB = load(key_usersDB);

        if (id < 0 || id >= userDB.length) {
            return null;
        }
        return userDB[id];
    }
    static userFrom(inputEmail, hashedInputPassword) {
        return { email: inputEmail, password: hashedInputPassword }
    }
    static addUser(user) {
        let userDB = this.selectAll();
        user.id = userDB.length;
        userDB.push(user);
        save(key_usersDB, userDB);
        return userDB[user.id];
    }

    static saveUser(targetUser) {
        let foundUser = this.select(targetUser.id);
        if (!foundUser) {
            foundUser = this.addUser(targetUser);
        }
        let userDB = this.selectAll();
        userDB[foundUser.id] = targetUser;
        save(key_usersDB, userDB);
        return userDB[foundUser.id];
    }
}

class CartUtil {
    static selectAll() {
        let cartDB = load(key_cart);
        return cartDB;
    }
    static select(id) {
        let cartDB = load(key_cart);

        if (id < 0 || id >= cartDB.length) {
            return null;
        }
        return cartDB[id];
    }

    static create() {
        let cartDB = load(key_cart);
        let nextId = cartDB.length;
        let newCart = {
            id: nextId,
            cartItems: [
            ]
        }
        cartDB.push(newCart);

        save(key_cart, cartDB);
        return newCart;
    }

    static addToCart(cart, product) {
        let accepted = false;
        if (!cart) return accepted;

        if (!Array.isArray(product)) {
            product = [product];
        }
        product.forEach(
            eachProduct => {
                let cartItem = CartUtil.findCartItemWithProduct(eachProduct, cart);
                //console.log('findCartItemWithProduct', product, cart, "cartItem", cartItem);
                if (cartItem) {
                    accepted = false;
                    //do nothing, no such thing as purchasing a single 3d-product multiple times                 
                }
                else {
                    cart.cartItems.push(
                        {
                            productId: eachProduct.id,
                        }
                    );
                    accepted = true;
                }
            }
        )

        this.saveCart(cart);
        return accepted;
    }
    static findCartItemWithProduct(product, cart) {
        if (!cart || !product) return null;
        if (!('cartItems' in cart)) return null;
        if (!(cart.cartItems) || cart.cartItems.length == 0) return null;

        let foundCartItem = null;
        cart.cartItems.every(
            eachCartItem => {
                if (!('productId' in eachCartItem)) {
                    return true; //continue loop
                }
                else if (eachCartItem.productId == product.id) {
                    foundCartItem = eachCartItem;
                    return false; // break loop
                }
                return true;
            }
        )
        return foundCartItem;
    }
    static saveCart(cart) {
        let cartDB = load(key_cart);

        if (cartDB.length <= cart.id) {
            return false;
        }

        cartDB[cart.id] = cart;
        save(key_cart, cartDB);
    }

    static removeItemFromCart(cartItem, cartId) {
        let foundCart = this.select(cartId);
        if (foundCart) {
            ArrayUtil.removeItemFrom(cartItem, foundCart.cartItems);
        }
        this.saveCart(foundCart);
    }
}


class AuthorUtil {
    static select(id) {
        return FakeData.fakeAuthors[id];
    }
}
class ProductUtil {

    static selectProduct(productId) {
        return FakeData.fakeProductDetailInfos[productId];
    }

    static selectCategory(categoryId) {
        let allCategs = FakeData.fakeProductCategories;
        let resultCategory = null;
        // allCategs.every(
        //     each => {
        //         if(each.id = categoryId){
        //             resultCategory = each;
        //             return false;
        //         }
        //         return true;
        //     }
        // );
        if (categoryId <= allCategs.length - 1) {
            resultCategory = allCategs[categoryId];
        }
        return resultCategory;
    }

    static doesProductCategoryParentHierachyContainTargetCategory(targetCategory, product, maxDepth = 3) {
        let nextCateg = ProductUtil.selectCategory(product.categoryId);

        let currentDepthCount = 1;
        while (nextCateg != null) {
            if (nextCateg.id == targetCategory.id) {

                return true;
            }
            nextCateg = ProductUtil.selectCategory(nextCateg.parent_category);
            currentDepthCount++;
            if (currentDepthCount > maxDepth) {
                break;
            }
        }

        return false;
    }
}

class ArrayUtil {
    static removeItemFrom(item, array) {
        if (!array) {
            console.error("array param is null");
            return array;
        }
        let indexOf = array.indexOf(item);
        if (indexOf < 0 && indexOf >= array.length) {
            console.error("no such item ", item, " in ", array);
            return array;
        }
        array.splice(indexOf, 1);
        return array;
    }
}

function notifyNotYetImplement(featureName) {
    console.log(featureName + " haven't yet to be implement");
}
