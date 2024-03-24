"use strict";

// dark mode will turn on at 21:00 - 09:00 by default
const DARK_START_TIME = 21,
    DARK_END_TIME = 9;

// get hugo_config_mode from global variable defined in html inner script
// default auto 
const HUGO_CONFIG_MODE = configMode === null ? "auto" : configMode;

initMode();

document.addEventListener("DOMContentLoaded", function () {
    const modeToggle = document.getElementById("scheme-toggle");

    if (modeToggle !== null) {
        toggleDarkMode();

        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (event) {
            if (event.matches) {
                localStorage.setItem("scheme", "dark");
            } else {
                localStorage.setItem("scheme", "light");
            }

            toggleDarkMode();
        });

        modeToggle.addEventListener("click", function () {
            localStorage.setItem("scheme", document.documentElement.classList.contains('dark') ? "light" : "dark");
            toggleDarkMode();
        });
    } else {
        // mode is not configured in hugo configuretion, mode = auto
        // console.log("mode=auto");
    }
});

function toggleDarkMode() {
    let theme = localStorage.getItem("scheme"),
        toggle = document.getElementById("scheme-toggle"),
        container = document.getElementsByTagName("html")[0];

    if (theme === "dark") {
        if (typeof feather !== "undefined") {
            toggle.innerHTML = feather.icons.sun.toSvg();
        }
        container.className = "dark";
    } else {
        if (typeof feather !== "undefined") {
            toggle.innerHTML = feather.icons.moon.toSvg();
        }
        container.className = "";
    }
}

function getModeByTime(darkStart, darkEnd) {
    const date = new Date();
    const hour = date.getHours();

    if (hour >= darkStart || hour < darkEnd) {
        return "dark";
    } else {
        return "light";
    }
}

function getInitMode(configMode, globalMode, localMode) {
    /**
     * configMode: hugo configure mode, Params.mode
     * globalMode: system mode
     * localMode: browser storage mode
     */
    let defaultMode = getModeByTime(DARK_START_TIME, DARK_END_TIME);
    // console.log(defaultMode)

    // priority: configMode > localMode > globalMode > defaultMode
    if (configMode !== "auto" ) {
        defaultMode = configMode;
    } else if (localMode !== null) {
        defaultMode = localMode; 
    } else if (globalMode) {
        defaultMode = "dark"
    }

    return defaultMode;
}

function initMode() {
    /**
     * initial theme mode
     */
    const globalDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const localMode = localStorage.getItem("scheme");
    // const modeToggle = document.getElementById("scheme-toggle"); 
	// console.log(modeToggle);

    const mode = getInitMode(HUGO_CONFIG_MODE, globalDark, localMode);
    // console.log(`configMode=${HUGO_CONFIG_MODE}, globalDark=${globalDark}, localMode=${localMode}, mode=${mode}`);

    localStorage.setItem("scheme", mode);

    document.getElementsByTagName("html")[0].className = mode;
}