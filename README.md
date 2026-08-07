# AESIR Research Website

A React and Vite website presenting AESIR's evidence-based immersive-intelligence research, field deployments, and leadership.

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
- AESIR research website: `/investor/`
- Legacy `#/founders` links resolve to the Leadership section.
- Legacy `#/neuro` links resolve to the consolidated AESIR homepage.

## AESIR Deployment

The production build is configured for the `https://aesir.hk/investor/` subdirectory.

1. Run `npm install` and `npm run build`.
2. Upload everything inside `dist/` to the AESIR web root's `investor/` directory.
3. Point the AESIR navigation link to `href="/investor/"`.
4. Verify `https://aesir.hk/investor/` on desktop and mobile before removing the old Investor section.

## GitHub Pages Deployment

Pushes to `main` automatically build and deploy through `.github/workflows/deploy-pages.yml`. The workflow sets the Pages base path to `/Aesir-web/` and opens NEURO Business Futures as the default page.

## Notes

The project uses local public assets for founder photography and 106 project-media records. The applied-work film loads `hls.js` only when the video is near the viewport. The previous Three.js meteor background is no longer mounted or included in the production bundle.
