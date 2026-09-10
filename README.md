# SpoTStudio website

A static portfolio for SpoTStudio, published with GitHub Pages at `spotstudio.design`.

## Preview

If Python is installed, open a terminal in this folder and run:

```text
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Edit later

- Navigation: `assets/js/header.js`
- Colors and layout: `assets/css/styles.css`
- Portfolio projects and metadata: `assets/js/portfolio-data.js`
- Optimized portfolio images, videos and video posters: `assets/portfolio-curated/`
- Header logo and portrait: `assets/images/`
- Page copy: the four `.html` files

Each work in `portfolio-data.js` is one project object. Its `media` list may contain one or more images or animations. Single-media projects open in the dark viewer; projects with supporting media open on `project.html`. Valid filters are `Animations`, `Journal & proposal covers` and `Thesis covers`.

Set a project's `size` to `"1x1"`, `"1x2"`, `"2x1"` or `"2x2"` to choose its footprint in the organized portfolio grid.

The project titles, descriptions and dates come from the paired text files in the curated September 2026 portfolio package. The Background/CV section is still explicitly marked as awaiting final details.

Keep new browser-ready media below 25 MB per file for easy GitHub uploads. Preserve the original source archive separately; the website uses compressed `.webp`, `.jpg` and `.mp4` copies.
