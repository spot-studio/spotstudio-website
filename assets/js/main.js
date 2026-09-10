(function () {
  const currentYear = new Date().getFullYear();
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = currentYear;
  });

  const items = window.PORTFOLIO_ITEMS;
  const grid = document.getElementById("project-grid");
  if (!items || !grid) return;

  const count = document.getElementById("results-count");
  const empty = document.getElementById("empty-state");
  const filterHost = document.getElementById("category-filters");
  const minInput = document.getElementById("year-min");
  const maxInput = document.getElementById("year-max");
  const minOutput = document.getElementById("year-min-output");
  const maxOutput = document.getElementById("year-max-output");
  const yearRange = document.getElementById("year-range");
  const dialog = document.getElementById("project-dialog");
  const dialogContent = document.getElementById("dialog-content");
  const categories = ["All", "Animations", "Journal & proposal covers", "Thesis covers"];
  const firstYear = 2024;
  let activeCategory = "All";

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", "\"": "&quot;"
    })[character]);
  }

  function richText(value) {
    return escapeHtml(value).split(/\n\n+/).map((paragraph) => {
      const linked = paragraph.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noreferrer">$1</a>');
      return `<p>${linked}</p>`;
    }).join("");
  }

  function previewMarkup(item) {
    const media = item.media[0];
    const source = media.type === "video" ? media.poster : media.src;
    return `<div class="artwork ${item.fit === "contain" ? "artwork-contain" : ""}">
      <img src="${escapeHtml(source)}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async">
      ${media.type === "video" ? '<span class="play-mark" aria-hidden="true">▶</span>' : ""}
    </div>`;
  }

  function cardMarkup(item) {
    const hasProjectPage = item.media.length > 1;
    const openTag = hasProjectPage
      ? `<a class="project-open" href="project.html?id=${encodeURIComponent(item.id)}" aria-label="Explore ${escapeHtml(item.title)}">`
      : `<button type="button" class="project-open" data-project-id="${escapeHtml(item.id)}" aria-label="Enlarge ${escapeHtml(item.title)}">`;
    const closeTag = hasProjectPage ? "</a>" : "</button>";
    return `<article class="project-card project-size-${item.size || "1x1"}">
      ${openTag}${previewMarkup(item)}
        <span class="card-overlay"><span>${escapeHtml(item.title)}</span><i aria-hidden="true">↗</i></span>
      ${closeTag}
    </article>`;
  }

  [minInput, maxInput].forEach((input) => {
    input.min = firstYear;
    input.max = currentYear;
  });
  minInput.value = firstYear;
  maxInput.value = currentYear;

  filterHost.innerHTML = categories.map((category, index) =>
    `<button type="button" class="filter-button ${index === 0 ? "is-active" : ""}" data-category="${escapeHtml(category)}" aria-pressed="${index === 0}">${escapeHtml(category)}</button>`
  ).join("");

  function render() {
    let minimum = Number(minInput.value);
    let maximum = Number(maxInput.value);
    if (minimum > maximum) {
      if (document.activeElement === minInput) maximum = minimum;
      else minimum = maximum;
      minInput.value = minimum;
      maxInput.value = maximum;
    }
    minOutput.value = minimum;
    maxOutput.value = maximum;
    const span = Math.max(1, currentYear - firstYear);
    yearRange.style.setProperty("--range-start", `${((minimum - firstYear) / span) * 100}%`);
    yearRange.style.setProperty("--range-end", `${((maximum - firstYear) / span) * 100}%`);

    const visible = items.filter((item) =>
      (activeCategory === "All" || item.category === activeCategory) &&
      item.year >= minimum && item.year <= maximum
    );
    grid.innerHTML = visible.map(cardMarkup).join("");
    count.textContent = `${visible.length} ${visible.length === 1 ? "project" : "projects"}`;
    empty.hidden = visible.length !== 0;
  }

  filterHost.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    filterHost.querySelectorAll("button").forEach((candidate) => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });
    render();
  });

  [minInput, maxInput].forEach((input) => input.addEventListener("input", render));

  grid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project-id]");
    if (!trigger) return;
    const item = items.find((candidate) => candidate.id === trigger.dataset.projectId);
    if (!item) return;
    const media = item.media[0];
    const mediaMarkup = media.type === "video"
      ? `<video src="${escapeHtml(media.src)}" poster="${escapeHtml(media.poster)}" controls autoplay playsinline></video>`
      : `<img src="${escapeHtml(media.src)}" alt="${escapeHtml(item.title)}">`;
    const reference = item.reference
      ? `<a class="publication-link" href="${escapeHtml(item.reference)}" target="_blank" rel="noreferrer">View publication ↗</a>`
      : "";
    dialogContent.innerHTML = `<figure class="lightbox-figure">${mediaMarkup}<figcaption id="dialog-title"><strong>${escapeHtml(item.title)}</strong><div class="lightbox-description">${richText(item.description)}${reference}</div></figcaption></figure>`;
    dialog.showModal();
  });

  function pauseDialogMedia() {
    const video = dialog.querySelector("video");
    if (video) video.pause();
  }
  function closeDialog() {
    pauseDialogMedia();
    dialog.close();
  }
  dialog.querySelector(".dialog-close").addEventListener("click", closeDialog);
  dialog.addEventListener("close", pauseDialogMedia);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  render();
})();
