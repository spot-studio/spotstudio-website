# SpoTStudio website

A local, static portfolio draft for SpoTStudio. Open it through a small local web server for the most reliable preview.

## Preview

If Python is installed, open a terminal in this folder and run:

```text
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Edit later

- Navigation: `assets/js/header.js`
- Colors and layout: `assets/css/styles.css`
- Portfolio projects: `assets/js/portfolio-data.js`
- Page copy: the four `.html` files

Each project in `portfolio-data.js` is one small object. Duplicate one, update its fields and the gallery, filters and project viewer will update automatically.

Set a project's `size` to `"1x1"`, `"1x2"`, `"2x1"` or `"2x2"` to choose its footprint in the organized portfolio grid.

All biography, contact details, imagery, project stories and service descriptions are placeholders and should be verified before publishing.
