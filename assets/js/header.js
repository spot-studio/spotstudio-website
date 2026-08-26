(function () {
  const currentPage = document.body.dataset.page;
  const links = [
    { id: "portfolio", label: "Portfolio", href: "index.html" },
    { id: "services", label: "Services", href: "services.html" },
    { id: "about", label: "About", href: "about.html" },
    { id: "contact", label: "Contact", href: "contact.html" }
  ];

  const linkMarkup = links.map(link =>
    `<a href="${link.href}" ${currentPage === link.id ? 'aria-current="page"' : ""}>${link.label}</a>`
  ).join("");

  document.querySelector("[data-site-header]").innerHTML = `
    <header class="site-header wrap">
      <a class="brand" href="index.html" aria-label="SpoTStudio home">
        <span class="brand-mark" aria-hidden="true"><i>S</i><i>T</i></span>
        <span>SpoTStudio</span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav id="site-nav" class="site-nav" aria-label="Main navigation">${linkMarkup}</nav>
    </header>`;

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });
})();

