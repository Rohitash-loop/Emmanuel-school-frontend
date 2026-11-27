
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    menuToggle.textContent = nav.classList.contains("open") ? "×" : "☰";
});

nav.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", () => nav.classList.remove("open"))
);

// Student Login Modal
const modal = document.getElementById("loginModal");

const openModal = () => {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    setTimeout(() => document.getElementById("studentId").focus(), 100);
};

const closeModal = () => {
    modal.classList.remove("show");
    document.body.style.overflow = "";
    document.getElementById("modalMessage").textContent = "";
};

["loginOpen", "quickLogin", "portalLogin", "footerLogin"].forEach(id => {
    document.getElementById(id).addEventListener("click", e => {
        e.preventDefault();
        openModal();
    });
});

document.getElementById("modalClose").addEventListener("click", closeModal);

modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
});

document.getElementById("demoLogin").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("modalMessage").textContent =
        "This is a frontend preview. Student authentication will be enabled after the secure school backend is connected.";
});


// Slide Navigation
document.body.classList.add("presentation-mode");

const slides = Array.from(
    document.querySelectorAll("main > .slide, footer.slide")
);

const prevButton = document.getElementById("prevSlide");
const nextButton = document.getElementById("nextSlide");
const counter = document.getElementById("slideCounter");
const progress = document.getElementById("slideProgress");
const progressTrack = document.querySelector(".slide-progress");

let currentSlide = Math.max(
    0,
    slides.findIndex(slide => slide.classList.contains("active"))
);

function showSlide(index, updateHash = true) {

    currentSlide = Math.max(
        0,
        Math.min(index, slides.length - 1)
    );

    slides.forEach((slide, i) => {
        const active = i === currentSlide;

        slide.classList.toggle("active", active);
        slide.setAttribute("aria-hidden", String(!active));

        if (active) slide.scrollTop = 0;
    });

    prevButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === slides.length - 1;

    counter.textContent =
        `${String(currentSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;

    progress.style.width =
        `${((currentSlide + 1) / slides.length) * 100}%`;

    progressTrack.setAttribute("aria-valuemax", String(slides.length));
    progressTrack.setAttribute("aria-valuenow", String(currentSlide + 1));

    document.querySelectorAll("#nav a").forEach(link => {
        const target = link.getAttribute("href");

        link.classList.toggle(
            "active",
            target === `#${slides[currentSlide].id}` ||
            (currentSlide === 0 && target === "#")
        );
    });

    if (updateHash) {
        const id = slides[currentSlide].id;
        history.replaceState(null, "", id ? `#${id}` : location.pathname);
    }

    window.scrollTo({ top: 0, behavior: "instant" });
}

prevButton.addEventListener("click", () =>
    showSlide(currentSlide - 1)
);

nextButton.addEventListener("click", () =>
    showSlide(currentSlide + 1)
);

// Keyboard Navigation
document.addEventListener("keydown", event => {

    if (
        modal.classList.contains("show") ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
    ) return;

    if (
        event.key === "ArrowRight" ||
        event.key === "PageDown"
    ) {
        event.preventDefault();
        showSlide(currentSlide + 1);
    }

    if (
        event.key === "ArrowLeft" ||
        event.key === "PageUp"
    ) {
        event.preventDefault();
        showSlide(currentSlide - 1);
    }
});


// In-page Navigation
document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const href = link.getAttribute("href");

        if (!href || href === "#" || link.id === "footerLogin") {
            if (href === "#") {
                event.preventDefault();
                showSlide(0);
            }
            return;
        }

        const target = document.querySelector(href);

        if (!target) return;

        const targetSlide = target.closest(".slide");

        if (targetSlide) {
            event.preventDefault();
            showSlide(slides.indexOf(targetSlide));
            nav.classList.remove("open");
        }
    });
});


// Open Slide From URL Hash
if (location.hash) {

    const target = document.querySelector(location.hash);
    const targetSlide = target && target.closest(".slide");

    if (targetSlide) {
        currentSlide = slides.indexOf(targetSlide);
    }
}

showSlide(currentSlide, false);


// Command Palette: Ctrl + K / Cmd + K
const commandBackdrop = document.getElementById("commandBackdrop");
const commandInput = document.getElementById("commandInput");
const commandResults = document.getElementById("commandResults");

const paletteItems = [
    { label: "Home", href: "#", hint: "Start" },
    { label: "About the school", href: "#about", hint: "About" },
    { label: "Academics", href: "#academics", hint: "Learning" },
    { label: "Campus life", href: "#campus", hint: "Explore" },
    { label: "Notices", href: "#notices", hint: "Updates" },
    { label: "Admissions", href: "#admissions", hint: "Join" },
    { label: "Contact", href: "#contact", hint: "Reach us" }
];

function renderCommands(query = "") {

    const matches = paletteItems.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase())
    );

    commandResults.innerHTML = matches.length
        ? matches.map(item => `
            <button class="command-result"
                type="button"
                data-href="${item.href}">
                <span>${item.label}</span>
                <span>${item.hint} ↗</span>
            </button>
        `).join("")
        : '<p class="command-empty">No matching page or section.</p>';
}

function openPalette() {
    renderCommands();
    commandBackdrop.classList.add("show");
    commandInput.value = "";
    commandInput.focus();
}

function closePalette() {
    commandBackdrop.classList.remove("show");
}

document.addEventListener("keydown", event => {

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
    ) {
        event.preventDefault();
        openPalette();
    }

    if (event.key === "Escape") {
        closePalette();
    }
});

commandInput.addEventListener("input", () =>
    renderCommands(commandInput.value)
);

commandResults.addEventListener("click", event => {

    const button = event.target.closest("[data-href]");

    if (!button) return;

    const href = button.dataset.href;

    closePalette();

    if (href === "#") {
        showSlide(0);
    } else {

        const target = document.querySelector(href);
        const targetSlide = target && target.closest(".slide");

        if (targetSlide) {
            showSlide(slides.indexOf(targetSlide));
        }
    }
});

commandBackdrop.addEventListener("click", event => {
    if (event.target === commandBackdrop) closePalette();
});


// Dark / Light Theme
const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("emmanuel-theme");

const systemDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

const initialTheme =
    savedTheme === "dark" || savedTheme === "light"
        ? savedTheme
        : (systemDark ? "dark" : "light");

function applyTheme(theme) {

    document.body.classList.toggle(
        "dark-theme",
        theme === "dark"
    );

    themeToggle.textContent = theme === "dark" ? "☀" : "☾";

    themeToggle.setAttribute(
        "aria-label",
        theme === "dark"
            ? "Switch to light theme"
            : "Switch to dark theme"
    );
}

applyTheme(initialTheme);

themeToggle.addEventListener("click", () => {

    const next = document.body.classList.contains("dark-theme")
        ? "light"
        : "dark";

    localStorage.setItem("emmanuel-theme", next);
    applyTheme(next);
});


// Reading Progress Bar
const readingProgress = document.getElementById("readingProgress");

const updateReadingProgress = () => {

    if (readingProgress) {
        readingProgress.style.width =
            `${((currentSlide + 1) / slides.length) * 100}%`;
    }
};

const originalShowSlide = showSlide;

showSlide = function(index, updateHash = true) {
    originalShowSlide(index, updateHash);
    updateReadingProgress();
};

updateReadingProgress();


// Live Rajasthan Clock
const localTime = document.getElementById("localTime");

function updateLocalTime() {

    if (!localTime) return;

    localTime.textContent =
        "Tonk, Rajasthan · " +
        new Intl.DateTimeFormat("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }).format(new Date());
}

updateLocalTime();

setInterval(updateLocalTime, 30000);


// Easter Egg: Click School Logo Five Times
let logoClicks = 0;
let logoReset;

document.querySelectorAll(".brand-mark").forEach(logo => {

    logo.addEventListener("click", () => {

        logoClicks++;

        clearTimeout(logoReset);

        logoReset = setTimeout(() => {
            logoClicks = 0;
        }, 1800);

        if (logoClicks >= 5) {

            document.body.classList.toggle("easter-theme");

            logoClicks = 0;

            const note = document.getElementById("schoolStatus");

            if (note) {
                note.textContent =
                    document.body.classList.contains("easter-theme")
                        ? "You found the Emmanuel secret theme. Keep exploring!"
                        : "Preparing students for a future full of possibilities.";
            }
        }
    });
});


// English / Hindi Language Toggle
const languageToggle = document.getElementById("languageToggle");

let hindiMode = false;

const translations = {
    "Home": "होम",
    "About": "परिचय",
    "Academics": "शिक्षा",
    "Campus life": "कैंपस जीवन",
    "Notices": "सूचनाएँ",
    "Admissions": "प्रवेश",
    "Contact school ↗": "संपर्क करें ↗",
    "Student login": "छात्र लॉगिन",
    "Discover Emmanuel": "एमैनुएल को जानें",
    "Explore academics": "शिक्षा देखें",
    "Latest notices": "नवीनतम सूचनाएँ",
    "Academic resources": "शैक्षणिक संसाधन"
};

languageToggle.addEventListener("click", () => {

    hindiMode = !hindiMode;

    document.querySelectorAll(
        "#nav a, .top-inner a, .login-btn, .hero-actions a, .quick-item b"
    ).forEach(el => {

        if (!el.dataset.originalText) {
            el.dataset.originalText = el.textContent.trim();
        }

        const original = el.dataset.originalText;

        el.textContent = hindiMode
            ? (translations[original] || original)
            : original;
    });

    languageToggle.textContent = hindiMode ? "English" : "हिंदी";
});


// Desktop Interaction Enhancement
if (
    window.matchMedia("(pointer:fine) and (min-width:1000px)").matches
) {
    document.body.classList.add("cursor-enhanced");
}
