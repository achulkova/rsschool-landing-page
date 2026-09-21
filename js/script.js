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