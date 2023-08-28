addEventListener("DOMContentLoaded", (event) => {
    main();
});

function main() {
    var showingProduct = getProductToShow();
    wiringProductsToDOM(showingProduct);
    initProductSliders();
}

function getProductToShow() {
    let productId = load(key_IdOfProductToDisplay);

    let product = ProductUtil.selectProduct(productId);
    if (isUndefined(product)) {
        console.error("no such product with id ", productId);
        return null;
    }
    return product;
}

function wiringProductsToDOM(product) {
    wireTextDom(product);
    wireBreadcrumbs(product);
    wireDownloadAddToCartButton(product);


    wireDownloadFiles(product);

    wireImgSection(product);
}

function wireTextDom(product) {
    $("#title_text").html(product.title_text);
    $("#title_extra_info").html(product.title_extra_info);
    $("#desc_text").html(product.desc_text);

    $("#likes-count").html(product.likes_count);
    $("#visit-count").html(product.visit_count);
    $("#download-count").html(product.download_count);

    $("#price").html(product.price);
    let priceDom = $(".single-product-price-container");
    if(product.price > 0.001){
        priceDom.addClass("premium-product-price");
    }
    else{
        priceDom.addClass("free-product-price");
    }

    $("#geometry").html(product.geometry);
    $("#polygon_count").html(product.polygon_count);
    $("#vertices_count").html(product.vertices_count);

    $("#has_textures").html((product.has_textures) ? "Yes" : "No");
    $("#has_material").html((product.has_material) ? "Yes" : "No");
    $("#had_rigged").html((product.had_rigged) ? "Yes" : "No");
    $("#had_animated").html((product.had_animated) ? "Yes" : "No");
    $("#is_gameReady").html((product.is_gameReady) ? "Yes" : "No");
    $("#had_UVMapped").html((product.had_UVMapped) ? "Yes" : "No");

    let dateObj = moment(product.date_added, "DD-MM-YYYY");
    $("#date_added").html(dateObj.format("MMM D, YYYY"));

    dateObj = moment(product.date_updated, "DD-MM-YYYY");
    $("#date_updated").html(dateObj.format("MMM D, YYYY"));

    let author = AuthorUtil.select(product.authorId);
    $("#author-username").html(author.username);
}

function wireBreadcrumbs(product) {
    $('#breadcrumb-product-title').html(product.title_text);

    let categHieracy = []; let currentCateg = null;

    let loopMaxCount = 3; let loopCount = 0;

    retrieveCategoryHieracy();

    let doms = []; let dom = null;
    for (let i = categHieracy.length - 1; i >= 0; i--) {
        //clone or retrieve...
        if (!dom)
            dom = getNode("breadcrumb-product-category");
        else {
            dom = cloneDOM(dom);
        }
        doms.push(dom);
        let currentDomId = doms.length - 1;
        dom.id += '-' + currentDomId;

        //wire...
        currentCateg = categHieracy[i];
        let aTag = dom.getElementsByClassName("link-to-category");
        aTag = aTag[0];
        aTag.innerHTML = currentCateg.name;
    }

    function retrieveCategoryHieracy() {
        let nextId = product.categoryId;
        while (true) {
            currentCateg = ProductUtil.selectCategory(nextId);
            if (!currentCateg || currentCateg.id == 0) {
                //can't find legit category or category is "3D model" (id = 0)
                break;
            }

            categHieracy.push(currentCateg);
            nextId = currentCateg.parent_category;

            if (nextId == -1)
                break;

            loopCount++;
            if (loopCount > loopMaxCount)
                break;
        }
    }
}

function wireDownloadAddToCartButton(product) {

    let btn_download_add_to_cart = $("#download-prod");
    if (product.price > 0) {
        btn_download_add_to_cart.addClass("btn-add-to-cart");
        btn_download_add_to_cart.html("Add to cart");
        btn_download_add_to_cart.click(
            function () {
                let loggedin_user = getCurrentUser();
                if (!loggedin_user) {
                    show_login_modal();
                    return;
                }
                btn_download_add_to_cart.removeClass("btn-add-to-cart");
                btn_download_add_to_cart.addClass("btn-disabled");

                let succeedAddingToCart = tryAddingToCart(product);

                if (succeedAddingToCart) {

                    btn_download_add_to_cart.removeClass("btn-add-to-cart");
                    btn_download_add_to_cart.addClass("btn-disabled");
                    updateShowingCart();
                }

            }
        );
    }
    else {
        btn_download_add_to_cart.addClass("btn-download");
        btn_download_add_to_cart.html("Download");
        btn_download_add_to_cart.click(
            function () {
                notifyNotYetImplement("downloading product");
                btn_download_add_to_cart.removeClass("btn-download");
                btn_download_add_to_cart.addClass("btn-disabled");
            }
        );;
    }
}

function wireDownloadFiles(product) {
    let id = 0;
    cloneAndWire("product-file-info", product.files.length,
        function () {
            let currentFile = product.files[id];

            $(this).children("#file-formats-expanded").html(StringUtil.upperCaseFirst(currentFile.file_format));
            $(this).children("#file-formats").html("(." + currentFile.file_format + ")");
            $(this).children("#file-name").html(currentFile.file_name);

            id++;
        }
    );
    id = 0;
    cloneAndWire("indiv-tag", product.tags.length,
        function () {
            let currentTag = product.tags[id];

            $(this).html(StringUtil.upperCaseFirst(currentTag));
            id++;
        }
    );
}

function wireImgSection(product) {
    let imgs = product.imgs;
    let id = 0;
    let imgLinkTrail = "../../asset/image/productImage/";

    cloneAndWire("slide-item", imgs.length,
        function () {
            let currentImg = imgs[id];
            let imgSrc = imgLinkTrail + currentImg;

            let imgDOM = $(this).children("img").first();
            imgDOM.attr("src", imgSrc);
            imgDOM.attr("alt", product.title_text);

            id++;
        }
    );

    id = 0;
    if (imgs.length == 1) {
        setEnable(".thumb-item", false);
    }
    else {
        cloneAndWire("thumb-item", imgs.length,
            function () {
                let currentImg = imgs[id];
                let imgSrc = imgLinkTrail + currentImg;

                let imgDOM = $(this).children("img").first();
                imgDOM.attr("src", imgSrc);
                imgDOM.attr("alt", product.title_text);

                id++;
            }
        );
    }
}




function updateShowingCart() {
    reloadPage();
}

function initProductSliders() {

    $("#large-slider").each(function (idx, e) {
        $(e).slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            rows: 0,
            asNavFor: "#thumb-slider",

        });

    });

    // thumb slider on product page
    $("#thumb-slider").each(function (idx, e) {
        $(e).slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            asNavFor: "#large-slider",
            dots: false,
            centerMode: false,
            focusOnSelect: true,
            vertical: true,
            verticalSwiping: true,
            rows: 0,

        });

    });
}
