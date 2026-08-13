# Priya Salve — Tally ↔ Google Sheets Automation Website

A responsive, self-contained portfolio/service website for Tally ↔ Google Sheets integrations, finance automation, and dynamic dashboards.

## What changed in this version

- Added original local SVG visuals for the hero, sync architecture, sales intelligence, receivables aging, and payables planning.
- Added an interactive dashboard demo with Sales, Receivables, Payables, and Cash views.
- Added an automation opportunity calculator.
- Added a clear "before vs after automation" section.
- Added a larger report catalogue, project showcase, implementation process, FAQ, and lead form.
- Kept the site dependency-free: no external fonts, chart libraries, or image CDNs are required.
- Added favicon and improved SEO/social meta tags.

## Files

- `index.html` — website structure and content
- `styles.css` — responsive visual design and animations
- `script.js` — navigation, tabs, dynamic dashboard, calculator, and enquiry form
- `assets/` — local SVG illustrations and favicon

## Run locally

Open `index.html` directly in a modern browser. No build step is required.

For local development with a server, from this folder you can run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Google Analytics

No Google Analytics Measurement ID is included yet. Once you have a GA4 ID in the form `G-XXXXXXXXXX`, add the Google tag in the `<head>` of `index.html`.

## Contact form

The form prepares an email to `Workplace132000@gmail.com` using the visitor's default mail client. It does not send data to a backend.

## Important note

All figures shown in dashboard demos are illustrative sample data, not client results.
