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

function renderProducts(products) {
    menuGrid.innerHTML = "";

    const isMobile = window.innerWidth <= 768;
    const visibleProducts =
        isMobile && !showAllProducts ? products.slice(0, 4) : products;

    if (menuMoreButton) {
        const hasHiddenProducts =
            isMobile && !showAllProducts && products.length > 4;

        menuMoreButton.style.display = hasHiddenProducts ? "flex" : "none";
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

        menuGrid.append(card);
    });
}

if (menuMoreButton) {
    menuMoreButton.addEventListener("click", () => {
        showAllProducts = true;
        renderProducts(currentProducts);
    });
}

loadProducts();