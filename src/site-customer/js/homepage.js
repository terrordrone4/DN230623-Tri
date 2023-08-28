var dataFunc = () => {
    return {

        isLoginModalVisible: false,

        category_blocks_counter: 0,
        category_blocks: [{
            id: 'category_blocks-0',
            example_blocks_counter: 0,
            example_blocks: [{
                id: 'example-block-0',
                image: "site-customer/asset/image/living-room.png",
            }],
        }],

        images: [
            "site-customer/asset/image/living-room.png",
            "site-customer/asset/image/cyclops-subnautica.png",
            "site-customer/asset/image/low-poly-f1-car.png",
            "site-customer/asset/image/sunset.png",
            "site-customer/asset/image/hover-drone.png",
            "site-customer/asset/image/intergalactic-spaceships.jpg",
        ],

        CACHE_AMOUNT_ALLOW_MAX: 8,
        ELEMENT_HEIGHT: 300,

        elementHidenOnTop: 0,
        elementHidenBellow: 0,
    }
}

var data = dataFunc();

function showLoginModal() {
    data.isLoginModalVisible = true;
}

function hideLoginModal() {
    data.isLoginModalVisible = false;
}



function getRandomImage() {
    let imageAvailabeCount = data.images.length;
    let randomElementId = Math.floor(Math.random() * imageAvailabeCount);
    return data.images[randomElementId];
}



function mapDOMToDataObj() {
    for (let i = 0; i < data.category_blocks.length; i++) {

        let currentExampleBlocks = data.category_blocks[i].example_blocks;

        let currentDOMCategBlock = document.getElementById("categ-" + i);
        console.log("reach dom categ block " + currentDOMCategBlock);
        let currentDOMImgBlocks = currentDOMCategBlock.getElementsByClassName("item-img");

        for (let i = 0; i < currentExampleBlocks.length; i++) {
            let currentExampleBlock = currentExampleBlocks[i];
            currentDOMImgBlocks[i].src = currentExampleBlock.image;
        }
    }
}



function hompage_hookButtons() {
}

function wiringAllProductsToDOM() {
    let allCategs = FakeData.fakeProductCategories;
    let allProducts = FakeData.fakeProductDetailInfos;

    let parentCategId = 0;
    let showingCategs = [];
    allCategs.forEach(
        each => {
            if (each.parent_category == parentCategId) {
                showingCategs.push(each);
            }
        }
    )

    const sourceCategBlock = getNode("categ");
    let domCategBlocks = [];
    domCategBlocks.push(sourceCategBlock);

    while (showingCategs.length > domCategBlocks.length) {
        let newDomCategBlock = cloneDOM(sourceCategBlock);
        domCategBlocks.push(newDomCategBlock);
    }

    let id = 0;
    domCategBlocks.forEach(
        eachDOMCategBlock => {
            let currentCateg = showingCategs[id];
            wireCategoryInfoIntoCategoryBlockNode(currentCateg, eachDOMCategBlock);
            id++;

            let example_block_className = "example-block";
            let availableDOMExampleBlocks = getNodes(example_block_className, eachDOMCategBlock);
            let exampleBlockId = 0;
            allProducts.forEach(
                eachProduct => {
                    if (ProductUtil.doesProductCategoryParentHierachyContainTargetCategory(currentCateg, eachProduct)) {

                        let needToGenerateMoreDOMExampleBlock = exampleBlockId > availableDOMExampleBlocks.length - 1;
                        while (needToGenerateMoreDOMExampleBlock) {
                            let newExampleBlock = cloneDOM(availableDOMExampleBlocks[0]);
                            availableDOMExampleBlocks.push(newExampleBlock);
                            
                            needToGenerateMoreDOMExampleBlock = exampleBlockId > availableDOMExampleBlocks.length - 1;
                        }

                        //wire eachProduct : product INTO dom node : availableDOMExampleBlocks[exampleBlockId]
                        let targetDOMExampleBlock = availableDOMExampleBlocks[exampleBlockId];
                        wireProductInfoIntoExampleBlockNode(eachProduct, targetDOMExampleBlock);
                        exampleBlockId++;
                    }
                }
            );
        }
    )
}


function wireCategoryInfoIntoCategoryBlockNode(categInfo, domCategBlock) {
    let categNames = getNodes("category-name", domCategBlock);
    categNames[0].innerHTML = categInfo.name;

    let categDescs = getNodes("category-context", domCategBlock);
    categDescs[0].innerHTML = categInfo.desc;
}


function wireProductInfoIntoExampleBlockNode(product, exampleBlockNode) {

    let idDiv = getNodes("product-id", exampleBlockNode)[0];
    idDiv.value = "" + product.id;

    let alink = getNodes("link", exampleBlockNode)[0];
    alink.href = "/site-customer/pages/product/index.html";  //?id=" + product.id;

    let clickToNavigateTarget = getNodes("content-wrapper", exampleBlockNode)[0];
    hookNode(clickToNavigateTarget, "click",
        () => { 
            save(key_IdOfProductToDisplay, product.id);
        }
    )

    let bigimg = getNodes("product-bigimg", exampleBlockNode)[0];
    bigimg.src = "../../site-customer/asset/image/productImage/" + product.imgs[0];

    let productTitle = getNodes("product-title", exampleBlockNode)[0];
    productTitle.innerHTML = product.title_text;

    let productFileFormats = getNodes("product-file-formats", exampleBlockNode)[0];
    let temp_str = ""
    product.files.forEach(
        each => {
            temp_str += "." + each.file_format + " ";
        }
    );
    productFileFormats.innerHTML = temp_str;

    let productPrice = getNodes("product-price", exampleBlockNode)[0];
    productPrice.innerHTML = (product.price > 0) ? "" + product.price : "Free";

    let productDownloadCount = getNodes("product-download-count", exampleBlockNode)[0];
    productDownloadCount.innerHTML = product.download_count;

}
let wireDOMUsername = () => {
    let avatarNode = getNode("account-avatar");
    let usernameNode = getNode("account-username");


    let email = load(key_currentUser).email;
    let emailFirstLetter = email.charAt(0);


    avatarNode.innerHTML = emailFirstLetter;
    usernameNode.innerHTML = email;
}

function checkForUserLoggedInStatus() {
    if (hadLoggedIn()) {
        console.log('user had already logged in');

        let login_signup = getNode("login-signup");
        hide(login_signup);

        wireDOMUsername();
    }
    else {
        console.log('user had NOT logged in');

        let nodes = getNodes("userStuffs");
        nodes.forEach(each => {
            hide(each);
        })

    }
}

function mounted() {
    console.log("mounting...");
    //generateRandomData(exampleBlockAmountToClone, sourceExampleBlock, categBlockAmountToClone);

    checkForUserLoggedInStatus();
    wiringAllProductsToDOM();
    hompage_hookButtons();
}

var main = () => {
    setTimeout(() => {
        mounted();
    }, 690);
}

addEventListener("DOMContentLoaded", (event) => {
    main();
});


function generateRandomData() {

    const exampleBlockAmountToClone = 6;
    const categBlockAmountToClone = 8;
    const sourceExampleBlock = data.category_blocks[0];

    cloneExampleBlock(exampleBlockAmountToClone, sourceExampleBlock);
    cloneCategoryBlock(categBlockAmountToClone);

    //clone dom nodes
    cloneDOMExampleBlock(exampleBlockAmountToClone);
    cloneDOMCategBlock(categBlockAmountToClone);

    //map dom nodes attribute to data obj
    mapDOMToDataObj();
}


function cloneCategoryBlock(cloneAmount) {
    for (let i = 0; i < cloneAmount; i++) {
        data.category_blocks_counter++;
        data.category_blocks.push({

            id: `category-${data.category_blocks_counter}`,

            example_blocks_counter: 0,
            example_blocks: [{
                id: 'example-block-0',
                image: getRandomImage(),
            }],

        });
        let newCategBlock = data.category_blocks[data.category_blocks.length - 1]
        cloneExampleBlock(4, newCategBlock);
    }
}

function cloneDOMCategBlock(categBlockToClone) {
    let id = "categ";

    const sourceCategBlock = document.getElementById(id);


    for (let i = 1; i <= categBlockToClone; i++) {
        let newCategBlock = sourceCategBlock.cloneNode(true);
        let sharedParentNode = sourceCategBlock.parentNode;
        sharedParentNode.appendChild(newCategBlock);

        newCategBlock.id += ("-" + i);
    }

    sourceCategBlock.id += "-0";
}


// function cloneDOMExampleBlock(exampleBlockAmountToClone) {
//     let id = "example-block";
//     const sourceExampleBlock = document.getElementById(id);

//     for (let i = 1; i <= exampleBlockAmountToClone; i++) {
//         let newExampleBlock = sourceExampleBlock.cloneNode(true);
//         let sharedParentNode = sourceExampleBlock.parentNode;
//         sharedParentNode.appendChild(newExampleBlock);

//         newExampleBlock.id += ("-" + i);
//     }
//     sourceExampleBlock.id += "-0";
// }


// function cloneExampleBlock(cloneAmount, targetCategBlock) {

//     for (let i = 0; i < cloneAmount; i++) {
//         targetCategBlock.example_blocks_counter++;
//         targetCategBlock.example_blocks.push({
//             id: `example-block-${targetCategBlock.example_blocks_counter}`,
//             image: getRandomImage(),
//         });

//     }
// }