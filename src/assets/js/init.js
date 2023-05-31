// Copyright (c) 2023 Xiler
const $THEME = document.querySelector("#theme");
const $SUN = $THEME.querySelector(".sun");
const $MOON = $THEME.querySelector(".moon");

const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("/sw.js");
            console.log("Service worker registered")
        } catch (e) {
            console.log("Service worker registration failed");
        }
    } else {
        console.log("Service worker not supported");
    }
}

registerServiceWorker();

const updateTheme = () => {
    const theme = localStorage.getItem("theme");
    const root = document.documentElement;

    if (theme === "dark") {
        root.style.setProperty("--background-color", "#2F3030");
        root.style.setProperty("--text-color", "#ECF0F1");
        root.style.setProperty("--primary-color", "#3598DB");
        $SUN.style.display = "block";
        $MOON.style.display = "none";
    } else {
        root.style.setProperty("--background-color", "#ECF0F1");
        root.style.setProperty("--text-color", "#2F3030");
        root.style.setProperty("--primary-color", "#3598DB");
        $SUN.style.display = "none";
        $MOON.style.display = "block";
    }
}

const toggleTheme = () => {
    const theme = localStorage.getItem("theme");
    localStorage.setItem("theme", theme === "dark" ? "light" : "dark");
    updateTheme();
}

$THEME.addEventListener("click", toggleTheme);
updateTheme();
