async function includeHTML(id, file) {
    const el = document.getElementById(id);
    if (!el) return;

    try {
        const res = await fetch(file);
        const html = await res.text();
        el.innerHTML = html;

        // IMPORTANT: RE-ACTIVATE NAV TOOGLE AFTER HEADER LOADS
        initDynamicNav();
    }   catch (err) {
        console.error("Component load error:", file);
    }
}

function initDynamicNav() {
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    if (!mobileNavToggleBtn) return;

    mobileNavToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('mobile-nav-active');
        mobileNavToggleBtn.classList.toggle('bi-list');
        mobileNavToggleBtn.classList.toggle('bi-x');
    });
}

document.addEventListener("DOMContentLoaded", () => {
    includeHTML("header", "/components/header.html");
    includeHTML("footer", "/components/footer.html");
});