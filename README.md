# FORME

A rental homes UI for landlords and renters, built with Next.js, React, TypeScript, and Tailwind CSS 4.

## Run locally

```sh
npm install
npm run dev
```

Open http://localhost:3000. Switch between **Manage** and **Explore** in the sidebar.

Use the sun/moon button in the header to switch light and dark mode. The theme choice persists across refreshes; before choosing, the interface follows your system theme.

- Manage properties, tenants, rent payments, and maintenance.
- Browse available homes, filter by price and bedrooms, save favorites, and request demo viewings.
- Add properties and maintenance requests, record payments, and export the portfolio as CSV.

This is a frontend demonstration. All records are illustrative, changes reset on refresh, and no viewing requests or emails are sent. No database, authentication, or backend services are connected.

## Checks

```sh
npm run lint
npm run build
```

Tailwind uses the official PostCSS integration. The visual system follows the light Swiss industrial direction of the industrial-brutalist-ui skill: paper surfaces, sharp corners, structural rules, heavy type, and a single red accent.

Property photos are sourced from Unsplash; original URLs are recorded in `public/images/sources.json`.


I am learning Git and GitHub.