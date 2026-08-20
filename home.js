/* =========================================
   DOM — با null-check برای امنیت
========================================= */

const body = document.body;
const header = document.getElementById("header");
const themeToggle = document.getElementById("themeToggle");
const mobileMenuButton = document.getElementById("mobileMenuButton");
const mobileNav = document.getElementById("mobileNav");
const toast = document.getElementById("toast");
const closeToast = document.getElementById("closeToast");
const disabledButtons = document.querySelectorAll(".disabled-download");
const revealElements = document.querySelectorAll(".reveal");
const mouseGlow = document.querySelector(".mouse-glow");


/* =========================================
   THEME
========================================= */

const savedTheme = localStorage.getItem("software-theme");

if (savedTheme) {
    body.setAttribute("data-theme", savedTheme);
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = body.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        body.setAttribute("data-theme", newTheme);
        localStorage.setItem("software-theme", newTheme);
    });
}


/* =========================================
   HEADER SCROLL
========================================= */

function handleHeaderScroll() {
    if (header) {
        header.classList.toggle("scrolled", window.scrollY > 20);
    }
}

window.addEventListener("scroll", handleHeaderScroll, { passive: true });
handleHeaderScroll();


/* =========================================
   MOBILE MENU
========================================= */

if (mobileMenuButton && mobileNav) {
    mobileMenuButton.addEventListener("click", () => {
        const isOpen = mobileNav.classList.toggle("open");
        mobileMenuButton.setAttribute("aria-expanded", isOpen);
    });

    /* بستن منو بعد از کلیک روی لینک */
    const mobileLinks = mobileNav.querySelectorAll("a");
    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            mobileNav.classList.remove("open");
        });
    });

    /* بستن منو با کلیک بیرون */
    document.addEventListener("click", event => {
        if (!mobileNav.contains(event.target) && !mobileMenuButton.contains(event.target)) {
            mobileNav.classList.remove("open");
        }
    });
}

/* =========================================
   DOWNLOAD COMING SOON TOAST
========================================= */

let toastTimer;

function showToast() {
    if (!toast) return;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 4500);
}

disabledButtons.forEach(button => {
    button.addEventListener("click", showToast);
});

if (closeToast) {
    closeToast.addEventListener("click", () => {
        toast.classList.remove("show");
    });
}

/* =========================================
   SCROLL REVEAL — بخش مهم برای نمایش متنها
========================================= */

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay;
                    if (delay) {
                        entry.target.style.transitionDelay = `${delay}ms`;
                    }
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    revealElements.forEach(element => observer.observe(element));
} else {
    // برای مرورگرهای قدیمی — همه را فوراً visible کن
    revealElements.forEach(element => element.classList.add("visible"));
}


/* =========================================
   MOUSE GLOW
========================================= */

if (
    mouseGlow &&
    window.matchMedia("(pointer: fine)").matches
) {
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener("mousemove", event => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }, { passive: true });

    function animateGlow() {
        currentX += (mouseX - currentX) * 0.08;
        currentY += (mouseY - currentY) * 0.08;
        mouseGlow.style.left = `${currentX}px`;
        mouseGlow.style.top = `${currentY}px`;
        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}

/* =========================================
   ACTIVE NAVIGATION
========================================= */

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove("active"));
                    const activeLink = document.querySelector(
                        `.nav-link[href="#${entry.target.id}"]`
                    );
                    if (activeLink) {
                        activeLink.classList.add("active");
                    }
                }
            });
        },
        { rootMargin: "-35% 0px -55% 0px" }
    );

    sections.forEach(section => sectionObserver.observe(section));
}

/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        if (mobileNav) mobileNav.classList.remove("open");
        if (toast) toast.classList.remove("show");
    }
});

/* =========================================
   SMOOTH ANCHOR
========================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
        const targetId = link.getAttribute("href");
        if (targetId === "#") return;

        const target = document.querySelector(targetId);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
});