import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium, webkit } from "playwright";

const mobileWidths = process.env.LAYOUT_TEST_WIDTHS
  ? process.env.LAYOUT_TEST_WIDTHS.split(",").map(Number)
  : [375, 390, 393, 414, 430];
const viewportHeight = 844;
const previewPort = 4179;
const previewUrl = `http://127.0.0.1:${previewPort}/Aesir-web/`;
const targetUrl = process.env.LAYOUT_TEST_URL || previewUrl;

const styleProperties = [
  "height",
  "minHeight",
  "marginTop",
  "marginBottom",
  "paddingTop",
  "paddingBottom",
  "position",
  "transform",
  "display",
  "gap",
  "rowGap",
  "contentVisibility",
  "containIntrinsicSize",
  "contain",
];

async function waitForPreview(server) {
  let lastError;

  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Vite preview exited with code ${server.exitCode}.`);
    }

    try {
      const response = await fetch(previewUrl);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Vite preview did not become ready: ${lastError?.message ?? "timeout"}`);
}

async function measureLayout(page) {
  await page.locator(".evidence-image").scrollIntoViewIfNeeded();
  await page.locator(".evidence-image img").waitFor({ state: "visible" });
  await page.locator(".evidence-image img").evaluate(async (image) => {
    if (!image.complete) {
      await Promise.race([
        new Promise((resolve) => image.addEventListener("load", resolve, { once: true })),
        new Promise((resolve) => setTimeout(resolve, 5_000)),
      ]);
    }
    await image.decode?.().catch(() => {});
  });
  await page.evaluate(() => Promise.race([
    document.fonts.ready,
    new Promise((resolve) => setTimeout(resolve, 5_000)),
  ]));

  return page.evaluate(({ properties }) => {
    const selectors = [
      ".evidence-section",
      ".evidence-story",
      ".evidence-image",
      ".projects-section",
      ".projects-heading",
    ];
    const computed = {};

    for (const selector of selectors) {
      const element = document.querySelector(selector);
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      computed[selector] = {
        rect: { top: rect.top, bottom: rect.bottom, height: rect.height },
        style: Object.fromEntries(properties.map((property) => [property, style[property]])),
      };
    }

    const imageRect = document.querySelector(".evidence-image").getBoundingClientRect();
    const headingRect = document.querySelector(".projects-heading").getBoundingClientRect();
    const evidenceRect = document.querySelector(".evidence-section").getBoundingClientRect();
    const projectsRect = document.querySelector(".projects-section").getBoundingClientRect();

    return {
      actualGap: headingRect.top - imageRect.bottom,
      gapComposition: {
        imageToEvidenceBottom: evidenceRect.bottom - imageRect.bottom,
        evidenceToProjectsTop: projectsRect.top - evidenceRect.bottom,
        projectsTopToHeading: headingRect.top - projectsRect.top,
      },
      computed,
      viewport: { width: innerWidth, height: innerHeight },
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  }, { properties: styleProperties });
}

const preview = process.env.LAYOUT_TEST_URL
  ? null
  : spawn(
    process.execPath,
    ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", String(previewPort)],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        VITE_BASE_PATH: "/Aesir-web/",
        VITE_DEFAULT_PAGE: "neuro",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

try {
  if (preview) await waitForPreview(preview);

  for (const [browserName, browserType] of [["chromium", chromium], ["webkit", webkit]]) {
    const browser = await browserType.launch({ headless: true });

    try {
      for (const width of mobileWidths) {
        const page = await browser.newPage({ viewport: { width, height: viewportHeight } });

        try {
          await page.goto(targetUrl, { waitUntil: "load" });
          const result = await measureLayout(page);

          assert.ok(
            result.actualGap >= 60 && result.actualGap <= 90,
            `${browserName} ${width}px gap was ${result.actualGap}px; expected 60–90px.`,
          );
          assert.equal(
            result.horizontalOverflow,
            0,
            `${browserName} ${width}px had ${result.horizontalOverflow}px horizontal overflow.`,
          );

          console.log(JSON.stringify({
            browser: browserName,
            width,
            actualGap: result.actualGap,
            gapComposition: result.gapComposition,
            horizontalOverflow: result.horizontalOverflow,
            ...(width === 390 ? { computed: result.computed } : {}),
          }));
        } finally {
          await page.close();
        }
      }
    } finally {
      await browser.close();
    }
  }
} finally {
  preview?.kill("SIGTERM");
}
