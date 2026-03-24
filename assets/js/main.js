(function () {
  "use strict";

  const body = document.body;

  function getHeader() {
    return document.querySelector("#header .header, header.header");
  }

  function getMobileNavToggleBtn() {
    return document.querySelector(".mobile-nav-toggle");
  }

  function getNavMenu() {
    return document.querySelector("#navmenu");
  }

  function getScrollTopBtn() {
    return document.querySelector(".scroll-top");
  }

  function getPreloader() {
    return document.querySelector("#preloader");
  }

  /* -----------------------------------
     Header Scrolled State
  ----------------------------------- */
  function toggleScrolled() {
    const header = getHeader();
    if (!header) return;

    const isStickyHeader =
      header.classList.contains("scroll-up-sticky") ||
      header.classList.contains("sticky-top") ||
      header.classList.contains("fixed-top");

    if (!isStickyHeader) return;

    body.classList.toggle("scrolled", window.scrollY > 100);
  }

  /* -----------------------------------
     Mobile Navigation
  ----------------------------------- */
  function setMobileNavState(isOpen) {
    const mobileNavToggleBtn = getMobileNavToggleBtn();
    const navMenu = getNavMenu();
    const navMenuList = navMenu ? navMenu.querySelector("ul") : null;

    body.classList.toggle("mobile-nav-active", isOpen);
    if (navMenu) {
      navMenu.classList.toggle("navmenu-active", isOpen);
    }

    // Fallback: ensure menu visibility is not blocked by conflicting CSS order.
    if (navMenuList) {
      navMenuList.style.display = isOpen ? "flex" : "";
    }

    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.toggle("bi-list", !isOpen);
      mobileNavToggleBtn.classList.toggle("bi-x", isOpen);
      mobileNavToggleBtn.setAttribute("aria-expanded", String(isOpen));
    }
  }

  function toggleMobileNav() {
    const isOpen = body.classList.contains("mobile-nav-active");
    setMobileNavState(!isOpen);
  }

  function initMobileNav() {
    const mobileNavToggleBtn = getMobileNavToggleBtn();
    const navMenu = getNavMenu();
    const navLinks = document.querySelectorAll("#navmenu a");

    if (!mobileNavToggleBtn || !navMenu) return;

    if (mobileNavToggleBtn.dataset.bound === "true") return;
    mobileNavToggleBtn.dataset.bound = "true";
    mobileNavToggleBtn.setAttribute("aria-label", "Toggle navigation");
    mobileNavToggleBtn.setAttribute("aria-controls", "navmenu");
    mobileNavToggleBtn.setAttribute("aria-expanded", "false");

    mobileNavToggleBtn.addEventListener("click", toggleMobileNav);

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (body.classList.contains("mobile-nav-active")) {
          setMobileNavState(false);
        }
      });
    });
  }

  /* -----------------------------------
     Preloader
  ----------------------------------- */
  function removePreloader() {
    const preloader = getPreloader();
    if (preloader) preloader.remove();
  }

  /* -----------------------------------
     Scroll To Top
  ----------------------------------- */
  function toggleScrollTop() {
    const scrollTopBtn = getScrollTopBtn();
    if (!scrollTopBtn) return;

    scrollTopBtn.classList.toggle("active", window.scrollY > 100);
  }

  function initScrollTop() {
    const scrollTopBtn = getScrollTopBtn();
    if (!scrollTopBtn) return;

    if (scrollTopBtn.dataset.bound === "true") return;
    scrollTopBtn.dataset.bound = "true";

    scrollTopBtn.addEventListener("click", function (event) {
      event.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  /* -----------------------------------
     AOS
  ----------------------------------- */
  function initAOS() {
    if (typeof AOS === "undefined") return;

    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }

  /* -----------------------------------
     GLightbox
  ----------------------------------- */
  function initGlightbox() {
    if (typeof GLightbox === "undefined") return;

    GLightbox({
      selector: ".glightbox",
    });
  }

  /* -----------------------------------
     PureCounter
  ----------------------------------- */
  function initPureCounter() {
    if (typeof PureCounter === "undefined") return;
    new PureCounter();
  }

  /* -----------------------------------
     Isotope
  ----------------------------------- */
  function initIsotopeLayouts() {
    if (typeof Isotope === "undefined" || typeof imagesLoaded === "undefined") {
      return;
    }

    document.querySelectorAll(".isotope-layout").forEach((isotopeItem) => {
      const container = isotopeItem.querySelector(".isotope-container");
      const filters = isotopeItem.querySelectorAll(".isotope-filters li");

      if (!container) return;

      const layout = isotopeItem.getAttribute("data-layout") || "masonry";
      const defaultFilter =
        isotopeItem.getAttribute("data-default-filter") || "*";
      const sort = isotopeItem.getAttribute("data-sort") || "original-order";

      let isotopeInstance;

      imagesLoaded(container, function () {
        isotopeInstance = new Isotope(container, {
          itemSelector: ".isotope-item",
          layoutMode: layout,
          filter: defaultFilter,
          sortBy: sort,
        });
      });

      filters.forEach((filterItem) => {
        filterItem.addEventListener("click", function () {
          const activeFilter = isotopeItem.querySelector(
            ".isotope-filters .filter-active"
          );

          if (activeFilter) {
            activeFilter.classList.remove("filter-active");
          }

          this.classList.add("filter-active");

          if (isotopeInstance) {
            isotopeInstance.arrange({
              filter: this.getAttribute("data-filter"),
            });
          }

          initAOS();
        });
      });
    });
  }

  /* -----------------------------------
     Swiper
  ----------------------------------- */
  function initSwipers() {
    if (typeof Swiper === "undefined") return;

    document.querySelectorAll(".init-swiper").forEach((swiperElement) => {
      const configElement = swiperElement.querySelector(".swiper-config");
      if (!configElement) return;

      let config = {};

      try {
        config = JSON.parse(configElement.innerHTML.trim());
      } catch (error) {
        console.error("Invalid Swiper config JSON:", error);
        return;
      }

      new Swiper(swiperElement, config);
    });
  }

  /* -----------------------------------
     Hash Scroll
  ----------------------------------- */
  function handleHashScrollOnLoad() {
    if (!window.location.hash) return;

    const section = document.querySelector(window.location.hash);
    if (!section) return;

    setTimeout(() => {
      const scrollMarginTop =
        parseInt(getComputedStyle(section).scrollMarginTop, 10) || 0;

      window.scrollTo({
        top: section.offsetTop - scrollMarginTop,
        behavior: "smooth",
      });
    }, 100);
  }

  /* -----------------------------------
     Scrollspy
  ----------------------------------- */
  function navmenuScrollspy() {
    const navLinks = document.querySelectorAll(".navmenu a");

    navLinks.forEach((link) => {
      if (!link.hash) return;

      const section = document.querySelector(link.hash);
      if (!section) return;

      const position = window.scrollY + 200;
      const inView =
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight;

      if (inView) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((activeLink) => activeLink.classList.remove("active"));

        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  /* -----------------------------------
     Copyright Year
  ----------------------------------- */
  function setCopyrightYear() {
    const yearElement = document.getElementById("year");
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /* -----------------------------------
     Dynamic Service Content
  ----------------------------------- */
  function initDynamicServiceContent() {
    const params = new URLSearchParams(window.location.search);
    const service = params.get("service");

    if (!service) return;

    const title = document.querySelector(".heading-title");
    const description = document.querySelector(".heading-title + p");
    const mainHeading = document.querySelector("h2");

    if (!title || !description || !mainHeading) return;

    const services = {
      website: {
        title: "Business Website Design",
        desc: "Professional websites designed to establish your business online and attract customers.",
      },
      redesign: {
        title: "Website Redesign",
        desc: "Transform your outdated website into a modern, high-performing online presence.",
      },
      development: {
        title: "Custom Web Development",
        desc: "Advanced features and custom functionality tailored to your business.",
      },
      maintenance: {
        title: "Website Maintenance & Support",
        desc: "We keep your site secure, updated, and running smoothly.",
      },
      "local-seo": {
        title: "Google Business & Local SEO",
        desc: "Help nearby customers find your business on Google Maps and search.",
      },
      seo: {
        title: "Search Engine Optimization (SEO)",
        desc: "Improve rankings and bring more organic traffic to your website.",
      },
    };

    const selectedService = services[service];
    if (!selectedService) return;

    title.textContent = selectedService.title;
    description.textContent = selectedService.desc;
    mainHeading.textContent = selectedService.title;
  }

  /* -----------------------------------
     Cookie Banner
  ----------------------------------- */
  function initCookieBanner() {
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptButton = document.getElementById("accept-cookies");

    if (!cookieBanner || !acceptButton) return;

    if (localStorage.getItem("cookiesAccepted") === "true") {
      cookieBanner.style.display = "none";
      return;
    }

    if (acceptButton.dataset.bound === "true") return;
    acceptButton.dataset.bound = "true";

    acceptButton.addEventListener("click", function () {
      localStorage.setItem("cookiesAccepted", "true");
      cookieBanner.style.display = "none";
    });
  }

  /* -----------------------------------
     Main Init
  ----------------------------------- */
  function initApp() {
    initMobileNav();
    initScrollTop();
    setCopyrightYear();
    initDynamicServiceContent();
    initCookieBanner();

    toggleScrolled();
    toggleScrollTop();
    removePreloader();
    initAOS();
    initGlightbox();
    initPureCounter();
    initIsotopeLayouts();
    initSwipers();
    handleHashScrollOnLoad();
    navmenuScrollspy();
  }

  window.initApp = initApp;

  document.addEventListener("scroll", function () {
    toggleScrolled();
    toggleScrollTop();
    navmenuScrollspy();
  });
})();
