const lightThemeButton = document.querySelector(".light-theme");
const darkThemeButton = document.querySelector(".dark-theme");

const savedTheme = localStorage.getItem("theme");

function setTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("dark-theme", isDark);

    if (lightThemeButton && darkThemeButton) {
        lightThemeButton.classList.toggle("active", !isDark);
        darkThemeButton.classList.toggle("active", isDark);

        lightThemeButton.setAttribute("aria-pressed", String(!isDark));
        darkThemeButton.setAttribute("aria-pressed", String(isDark));
    }

    localStorage.setItem("theme", theme);
}

if (savedTheme === "dark") {
    setTheme("dark");
} else {
    setTheme("light");
}

if (lightThemeButton) {
    lightThemeButton.addEventListener("click", () => {
        setTheme("light");
    });
}

if (darkThemeButton) {
    darkThemeButton.addEventListener("click", () => {
        setTheme("dark");
    });
}

const menuGrid = document.querySelector(".menu-grid");
const menuTabs = document.querySelectorAll(".menu-tab");
const menuMoreButton = document.querySelector(".menu-more-button");

let showAllProducts = false;
let currentProducts = [];
let wasMobile = window.innerWidth <= 768;

async function loadProducts() {
    if (!menuGrid) {
        return;
    }

    const response = await fetch("products.json");
    const products = await response.json();

    function showCategory(category) {
        const categoryProducts = products.filter(
            product => product.category === category
        );

        currentProducts = categoryProducts;
        showAllProducts = false;

        renderProducts(categoryProducts);
    }

    showCategory("coffee");

    menuTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const category = tab.dataset.category;

            menuTabs.forEach(button => {
                button.classList.remove("active");
            });

            tab.classList.add("active");

            showCategory(category);
        });
    });
}

function openProductModal(product, index) {
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");

    const modal = document.createElement("div");
    modal.classList.add("product-modal");

    modal.innerHTML = `
        <div class="product-modal-image">
            <img
                src="assets/${product.category}-${index + 1}.jpg"
                alt="${product.name}"
            >
        </div>

        <div class="product-modal-content">
            <h2>${product.name}</h2>

            <p class="product-modal-description">
                ${product.description}
            </p>

            <div class="product-modal-section">
                <span class="product-modal-label">Size</span>

                <div class="product-modal-options">
                    <button
                        class="modal-option size-option active"
                        type="button"
                        data-size="s"
                    >
                        <span>S</span>
                        ${product.sizes.s.size}
                    </button>

                    <button
                        class="modal-option size-option"
                        type="button"
                        data-size="m"
                    >
                        <span>M</span>
                        ${product.sizes.m.size}
                    </button>

                    <button
                        class="modal-option size-option"
                        type="button"
                        data-size="l"
                    >
                        <span>L</span>
                        ${product.sizes.l.size}
                    </button>
                </div>
            </div>

            <div class="product-modal-section">
                <span class="product-modal-label">Additives</span>

                <div class="product-modal-options">
                    ${product.additives.map((additive, additiveIndex) => `
    <button
        class="modal-option additive-option"
        type="button"
        data-additive-index="${additiveIndex}"
    >
        <span>${additiveIndex + 1}</span>
        ${additive.name}
    </button>
`).join("")}
                </div>
            </div>
<div class="product-modal-total">
    <span>Total:</span>
    <span class="product-modal-total-price">$${product.price}</span>
</div>

            <div class="product-modal-note">
                <span>ⓘ</span>

                <p>
                    The cost is not final. Download our mobile app to see
                    the final price and place your order. Earn loyalty points
                    and enjoy your favorite coffee with up to 20% discount.
                </p>
            </div>

            <button class="product-modal-close" type="button">
                Close
            </button>
        </div>
    `;

    const sizeButtons = modal.querySelectorAll(".size-option");
    const additiveButtons = modal.querySelectorAll(".additive-option");
    const totalPrice = modal.querySelector(".product-modal-total-price");

    let selectedSize = "s";
    const selectedAdditives = new Set();

    function updateTotalPrice() {
        let total = Number(product.price);

        total += Number(product.sizes[selectedSize]["add-price"]);

        selectedAdditives.forEach(index => {
            total += Number(product.additives[index]["add-price"]);
        });

        totalPrice.textContent = `$${total.toFixed(2)}`;
    }

    sizeButtons.forEach(button => {
        button.addEventListener("click", () => {
            sizeButtons.forEach(sizeButton => {
                sizeButton.classList.remove("active");
            });

            button.classList.add("active");
            selectedSize = button.dataset.size;

            updateTotalPrice();
        });
    });

    additiveButtons.forEach(button => {
        button.addEventListener("click", () => {
            const additiveIndex = Number(button.dataset.additiveIndex);

            if (selectedAdditives.has(additiveIndex)) {
                selectedAdditives.delete(additiveIndex);
                button.classList.remove("active");
            } else {
                selectedAdditives.add(additiveIndex);
                button.classList.add("active");
            }

            updateTotalPrice();
        });
    });

    overlay.append(modal);
    document.body.append(overlay);

    document.body.classList.add("modal-open");

    function closeModal() {
        overlay.remove();
        document.body.classList.remove("modal-open");
        document.removeEventListener("keydown", handleEscape);
    }

    function handleEscape(event) {
        if (event.key === "Escape") {
            closeModal();
        }
    }

    const closeButton = modal.querySelector(".product-modal-close");

    closeButton.addEventListener("click", closeModal);

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            closeModal();
        }
    });

    document.addEventListener("keydown", handleEscape);
}

function renderProducts(products) {
    menuGrid.innerHTML = "";

    const isMobile = window.innerWidth <= 768;

    const visibleProducts =
        isMobile && !showAllProducts
            ? products.slice(0, 4)
            : products;

    if (menuMoreButton) {
        const hasHiddenProducts =
            isMobile &&
            !showAllProducts &&
            products.length > 4;

        menuMoreButton.style.display =
            hasHiddenProducts ? "flex" : "none";
    }

    visibleProducts.forEach((product, index) => {
        const card = document.createElement("article");
        card.classList.add("menu-card");

        card.innerHTML = `
            <div class="menu-card-image">
                <img
                    src="assets/${product.category}-${index + 1}.jpg"
                    alt="${product.name}"
                >
            </div>

            <div class="menu-card-content">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <div class="menu-card-price">$${product.price}</div>
            </div>
        `;

        card.addEventListener("click", () => {
            openProductModal(product, index);
        });

        menuGrid.append(card);
    });
}

if (menuMoreButton) {
    menuMoreButton.addEventListener("click", () => {
        showAllProducts = true;
        renderProducts(currentProducts);
    });
}

window.addEventListener("resize", () => {
    if (!menuGrid || currentProducts.length === 0) {
        return;
    }

    const isMobile = window.innerWidth <= 768;

    if (isMobile !== wasMobile) {
        showAllProducts = false;
        wasMobile = isMobile;
    }

    renderProducts(currentProducts);
});

loadProducts();

const burgerButton = document.querySelector(".burger-button");
const header = document.querySelector("header");

if (burgerButton && header) {
    const mobileMenu = document.createElement("div");
    mobileMenu.classList.add("mobile-menu");

    const isMenuPage = Boolean(document.querySelector(".menu-section"));

    mobileMenu.innerHTML = `
        <nav class="mobile-menu-nav">
            <a href="index.html#favorite-coffee">Favorite coffee</a>
            <a href="index.html#about">About</a>
            <a href="index.html#mobile-app">Mobile app</a>
            <a href="#contacts">Contact us</a>

            <a href="menu.html" class="mobile-menu-coffee">
                <span>Menu</span>
                <img src="assets/coffee-cup.svg" alt="">
            </a>
        </nav>
    `;

    header.append(mobileMenu);

    function openBurgerMenu() {
        burgerButton.classList.add("open");
        mobileMenu.classList.add("open");
        document.body.classList.add("burger-open");

        burgerButton.setAttribute("aria-label", "Close navigation menu");
        burgerButton.setAttribute("aria-expanded", "true");
    }

    function closeBurgerMenu() {
        burgerButton.classList.remove("open");
        mobileMenu.classList.remove("open");
        document.body.classList.remove("burger-open");

        burgerButton.setAttribute("aria-label", "Open navigation menu");
        burgerButton.setAttribute("aria-expanded", "false");
    }

    burgerButton.setAttribute("aria-expanded", "false");

    burgerButton.addEventListener("click", () => {
        if (mobileMenu.classList.contains("open")) {
            closeBurgerMenu();
        } else {
            openBurgerMenu();
        }
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeBurgerMenu);
    });

    document.addEventListener("keydown", event => {
        if (
            event.key === "Escape" &&
            mobileMenu.classList.contains("open")
        ) {
            closeBurgerMenu();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth >= 769) {
            closeBurgerMenu();
        }
    });

    if (isMenuPage) {
        const contactLink = mobileMenu.querySelector('a[href="#contacts"]');

        contactLink.addEventListener("click", event => {
            event.preventDefault();
            closeBurgerMenu();

            document.querySelector("#contacts")?.scrollIntoView({
                behavior: "smooth"
            });
        });
    }
}


const sliderTrack = document.querySelector(".slider-track");
const originalSlides = document.querySelectorAll(".coffee-slide");
const sliderPrevButton = document.querySelector(".slider-button-left");
const sliderNextButton = document.querySelector(".slider-button-right");
const sliderControls = document.querySelectorAll(".slider-control");

if (
    sliderTrack &&
    originalSlides.length > 0 &&
    sliderPrevButton &&
    sliderNextButton
) {
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);

    sliderTrack.append(firstClone);
    sliderTrack.prepend(lastClone);

    const sliderSlides = sliderTrack.querySelectorAll(".coffee-slide");

    let currentSlide = 1;
    let isMoving = false;

    function moveSlider(animate = true) {
        sliderTrack.style.transition = animate
            ? "transform 0.6s ease"
            : "none";

        sliderTrack.style.transform =
            `translateX(-${currentSlide * 100}%)`;
    }

    function updateControls() {
        let realSlide = currentSlide - 1;

        if (currentSlide === 0) {
            realSlide = originalSlides.length - 1;
        }

        if (currentSlide === sliderSlides.length - 1) {
            realSlide = 0;
        }

        sliderControls.forEach((control, index) => {
            control.classList.toggle(
                "active",
                index === realSlide
            );
        });
    }

    function showNextSlide() {
        if (isMoving) {
            return;
        }

        isMoving = true;
        currentSlide++;

        moveSlider();
        updateControls();
    }

    function showPreviousSlide() {
        if (isMoving) {
            return;
        }

        isMoving = true;
        currentSlide--;

        moveSlider();
        updateControls();
    }

    sliderTrack.addEventListener("transitionend", () => {
        if (currentSlide === sliderSlides.length - 1) {
            currentSlide = 1;
            moveSlider(false);
        }

        if (currentSlide === 0) {
            currentSlide = originalSlides.length;
            moveSlider(false);
        }

        updateControls();
        isMoving = false;
    });

    sliderNextButton.addEventListener("click", showNextSlide);
    sliderPrevButton.addEventListener("click", showPreviousSlide);

    sliderControls.forEach((control, index) => {
        control.addEventListener("click", () => {
            if (isMoving) {
                return;
            }

            isMoving = true;
            currentSlide = index + 1;

            moveSlider();
            updateControls();
        });
    });

    window.addEventListener("resize", () => {
        moveSlider(false);
    });

    moveSlider(false);
    updateControls();
}
