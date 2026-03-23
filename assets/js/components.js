async function loadComponent(targetId, filePath) {
  const element = document.getElementById(targetId);
  if (!element) return;

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      console.error("Failed to load:", filePath);
      return;
    }

    const html = await response.text();
    element.innerHTML = html;
  } catch (error) {
    console.error("Error loading component:", filePath, error);
  }
}

async function initLayout() {
  await loadComponent("header", "/components/header.html");
  await new Promise(requestAnimationFrame);

  await loadComponent("footer", "/components/footer.html");
  await new Promise(requestAnimationFrame);

  if (!document.querySelector('script[data-main-js="true"]')) {
    const script = document.createElement("script");
    script.src = "/assets/js/main.js";
    script.setAttribute("data-main-js", "true");

    script.onload = () => {
      if (window.AOS) {
        AOS.init({
          duration: 800,
          easing: "ease-in-out",
          once: true
        });
      }
    };

    document.body.appendChild(script);
  }
}

document.addEventListener("DOMContentLoaded", initLayout);