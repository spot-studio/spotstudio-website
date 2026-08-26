(function () {
  document.querySelectorAll("[data-current-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const items = window.PORTFOLIO_ITEMS;
  if (!items) return;

  const grid = document.getElementById("project-grid");
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
  const categories = ["All", "Visuals", "Videos", "Covers", "Projects"];
  let activeCategory = "All";

  const firstYear = Math.min(...items.map(item => item.year));
  const currentYear = new Date().getFullYear();
  [minInput, maxInput].forEach(input => {
    input.min = firstYear;
    input.max = currentYear;
  });
  minInput.value = firstYear;
  maxInput.value = currentYear;

  filterHost.innerHTML = categories.map((category, index) =>
    `<button type="button" class="filter-button ${index === 0 ? "is-active" : ""}" data-category="${category}" aria-pressed="${index === 0}">${category}</button>`
  ).join("");

  function artworkMarkup(item, large = false) {
    return `<div class="artwork ${item.format} ${large ? "artwork-large" : ""}" style="--c1:${item.palette[0]};--c2:${item.palette[1]};--c3:${item.palette[2]}">
      <span class="shape shape-one"></span><span class="shape shape-two"></span><span class="shape shape-three"></span>
      ${item.categories.includes("Videos") ? '<span class="play-mark" aria-label="Video placeholder">▶</span>' : ""}
      <span class="placeholder-label">Placeholder artwork</span>
    </div>`;
  }

  function render() {
    let min = Number(minInput.value);
    let max = Number(maxInput.value);
    if (min > max) {
      if (document.activeElement === minInput) max = min;
      else min = max;
      minInput.value = min; maxInput.value = max;
    }
    minOutput.value = min; maxOutput.value = max;
    const totalYears = Math.max(1, currentYear - firstYear);
    yearRange.style.setProperty("--range-start", `${((min - firstYear) / totalYears) * 100}%`);
    yearRange.style.setProperty("--range-end", `${((max - firstYear) / totalYears) * 100}%`);
    const visible = items.filter(item =>
      (activeCategory === "All" || item.categories.includes(activeCategory)) && item.year >= min && item.year <= max
    );

    grid.innerHTML = visible.map(item => `
      <article class="project-card project-size-${item.size || "1x1"}">
        <button type="button" class="project-open" data-project-id="${item.id}" aria-label="Open ${item.title} project">
          ${artworkMarkup(item)}
          <span class="card-overlay"><span>View project</span><i aria-hidden="true">↗</i></span>
        </button>
        <div class="card-meta"><div><h3>${item.title}</h3><p>${item.kicker}</p></div><div><p>${item.categories.join(" · ")}</p><time>${item.year}</time></div></div>
      </article>`).join("");

    count.textContent = `${visible.length} ${visible.length === 1 ? "project" : "projects"}`;
    empty.hidden = visible.length !== 0;
  }

  filterHost.addEventListener("click", event => {
    const button = event.target.closest("button[data-category]");
    if (!button) return;
    activeCategory = button.dataset.category;
    filterHost.querySelectorAll("button").forEach(candidate => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });
    render();
  });

  [minInput, maxInput].forEach(input => input.addEventListener("input", render));

  grid.addEventListener("click", event => {
    const trigger = event.target.closest("[data-project-id]");
    if (!trigger) return;
    const item = items.find(project => project.id === trigger.dataset.projectId);
    dialogContent.innerHTML = `${artworkMarkup(item, true)}<div class="dialog-copy"><p class="eyebrow">${item.categories.join(" · ")} · ${item.year}</p><h2 id="dialog-title">${item.title}</h2><p>${item.description}</p><dl><div><dt>Status</dt><dd>Placeholder project</dd></div><div><dt>Services</dt><dd>${item.kicker}</dd></div></dl></div>`;
    dialog.showModal();
  });

  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  render();
})();

