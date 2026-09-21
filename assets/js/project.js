(function () {
  const currentYear = new Date().getFullYear();
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = currentYear;
  });

  const host = document.getElementById("project-content");
  const id = new URLSearchParams(window.location.search).get("id");
  const item = [...(window.PORTFOLIO_ITEMS || []), ...(window.PORTFOLIO_ITEMS_EXTRA || [])]
    .find((candidate) => candidate.id === id);

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", "\"": "&quot;"
    })[character]);
  }

  function richText(value) {
    return escapeHtml(value).split(/\n\n+/).filter(Boolean).map((paragraph) => {
      const linked = paragraph.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noreferrer">$1</a>');
      return `<p>${linked}</p>`;
    }).join("");
  }

  if (!item) {
    host.innerHTML = '<section class="project-missing"><p class="eyebrow">Project unavailable</p><h1>This project could not be found.</h1><a class="text-link" href="index.html#portfolio">Return to the portfolio</a></section>';
    return;
  }

  document.title = `${item.title} — SpoTStudio`;
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.content = item.description || `${item.title}, a scientific visual communication project by SpoTStudio.`;
  const reference = item.reference
    ? `<a class="publication-link" href="${escapeHtml(item.reference)}" target="_blank" rel="noreferrer">View publication ↗</a>`
    : "";
  const media = item.media.map((entry, index) => {
    const visual = entry.type === "video"
      ? `<video src="${escapeHtml(entry.src)}" poster="${escapeHtml(entry.poster)}" controls preload="metadata" playsinline></video>`
      : `<img src="${escapeHtml(entry.src)}" alt="${escapeHtml(item.title)} — ${escapeHtml(entry.label)}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async">`;
    const supportingCopy = entry.description ? `<div class="project-media-copy">${richText(entry.description)}</div>` : "";
    return `<figure class="project-media ${item.fit === "contain" ? "project-media-contain" : ""}">${visual}<figcaption><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(entry.label)}</strong>${supportingCopy}</figcaption></figure>`;
  }).join("");

  host.innerHTML = `
    <header class="project-intro">
      <p class="eyebrow">${escapeHtml(item.category)} · ${escapeHtml(item.date)}</p>
      <h1>${escapeHtml(item.title)}</h1>
      <div class="project-description">${richText(item.description)}${reference}</div>
    </header>
    <section class="project-media-list" aria-label="Project media">${media}</section>`;
})();
