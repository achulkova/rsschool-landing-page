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

    products.forEach((product, index) => {
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

loadProducts();