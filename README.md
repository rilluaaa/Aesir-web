# Neuro Business Futures

A React, Vite, and Tailwind CSS website project containing the Founders main website and the connected NEURO Business Futures proposal website.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Routes

- GitHub Pages deployment: `https://rilluaaa.github.io/Aesir-web/`
- AESIR Investor / NEURO Business Futures website: `/investor/`
- Founders website inside the Investor deployment: `/investor/#/founders`
- NEURO hash-route compatibility: `/investor/#/neuro`

## AESIR Deployment

The production build is configured for the `https://aesir.hk/investor/` subdirectory.

1. Run `npm install` and `npm run build`.
2. Upload everything inside `dist/` to the AESIR web root's `investor/` directory.
3. Change the AESIR navigation link from `href="#investor"` to `href="/investor/"`.
4. Verify `https://aesir.hk/investor/` on desktop and mobile before removing the old Investor section.

## GitHub Pages Deployment

Pushes to `main` automatically build and deploy through `.github/workflows/deploy-pages.yml`. The workflow sets the Pages base path to `/Aesir-web/` and opens NEURO Business Futures as the default page.

## Notes

The project uses local public assets for founder photos, project media, achievements, and website imagery. The main Founders hero uses an HLS video background through `hls.js`.
