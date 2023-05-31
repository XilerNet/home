// Copyright (c) 2023 Xiler

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