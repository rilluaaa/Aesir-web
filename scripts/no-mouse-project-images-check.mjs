import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium, webkit } from "playwright";

const previewPort = 4181;
const previewUrl = `http://127.0.0.1:${previewPort}/Aesir-web/`;
const projectQueries = [
  "Live Pose Football Runner",
  "Drug Prevention Marathon",
  "AI Internationalization at Home for Medicine-Engineering Talent",
];

async function waitForPreview(server) {
  let lastError;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Vite preview exited with code ${server.exitCode}.`);
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

async function chooseLanguage(page, label) {
  const trigger = page.locator(".language-selector:not(.language-selector--mobile) .language-selector__trigger");
  await trigger.focus();
  await page.keyboard.press("Enter");
  const option = page.getByRole("menuitemradio", { name: label });
  await option.focus();
  await page.keyboard.press("Enter");
}

async function waitForImage(image) {
  await image.waitFor({ state: "visible" });
  await image.evaluate(async (element) => {
    if (!element.complete || element.naturalWidth === 0) {
      await Promise.race([
        new Promise((resolve) => element.addEventListener("load", resolve, { once: true })),
        new Promise((resolve) => setTimeout(resolve, 8_000)),
      ]);
    }
    await element.decode?.().catch(() => {});
  });
  const state = await image.evaluate((element) => ({
    complete: element.complete,
    naturalWidth: element.naturalWidth,
    src: element.getAttribute("src"),
  }));
  assert.ok(state.src, "project image has no real src attribute");
  assert.ok(state.complete && state.naturalWidth > 0, `project image did not load: ${state.src}`);
  return state;
}

async function runScenario(browserName, browserType) {
  const browser = await browserType.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const projectImageRequests = new Set();
  const consoleProblems = [];

  page.on("request", (request) => {
    const pathname = new URL(request.url()).pathname;
    if (pathname.includes("/assets/project-thumbs/") || pathname.includes("/assets/projects/")) {
      projectImageRequests.add(pathname);
    }
  });
  page.on("console", (message) => {
    if (["warning", "error"].includes(message.type())) consoleProblems.push(message.text());
  });

  try {
    await page.goto(previewUrl, { waitUntil: "load" });

    const evidenceImage = page.locator(".hero-evidence img");
    await waitForImage(evidenceImage);
    const evidencePriority = await evidenceImage.evaluate((image) => ({
      loading: image.loading,
      fetchPriority: image.fetchPriority,
    }));
    assert.equal(evidencePriority.loading, "eager");
    assert.equal(evidencePriority.fetchPriority, "high");

    const initialProjectImages = page.locator(".project-card img[data-predictive-media]");
    assert.equal(await initialProjectImages.count(), 12);
    const missingInitialSources = await initialProjectImages.evaluateAll((images) => (
      images.filter((image) => !image.getAttribute("src")).length
    ));
    assert.equal(missingInitialSources, 0, "project images depend on scheduler-injected src values");

    await chooseLanguage(page, "繁中");
    await page.locator("html[data-language='traditional']").waitFor();
    await expectExactText(page, "應用項目，合作夥伴與公共成果。");
    await assertChineseTypography(page, "traditional");

    await chooseLanguage(page, "简中");
    await page.locator("html[data-language='simplified']").waitFor();
    await assertChineseTypography(page, "simplified");

    await page.locator("#projects").evaluate((section) => section.scrollIntoView({ block: "start" }));
    const firstRow = page.locator(".project-card img[data-predictive-media]").first();
    await waitForImage(firstRow);
    const rowImages = await page.locator(".project-card img[data-predictive-media]").evaluateAll((images) => {
      const top = Math.min(...images.map((image) => image.closest(".project-card").getBoundingClientRect().top));
      return images
        .filter((image) => Math.abs(image.closest(".project-card").getBoundingClientRect().top - top) <= 4)
        .slice(0, 3)
        .map((image) => ({ src: image.getAttribute("src"), complete: image.complete, naturalWidth: image.naturalWidth }));
    });
    assert.equal(rowImages.length, 3);
    for (const image of rowImages) {
      assert.ok(image.src && image.complete && image.naturalWidth > 0, `first-row project image was blank: ${image.src}`);
    }

    const search = page.locator("#project-search");
    for (const query of projectQueries) {
      await search.fill(query);
      const matchingImages = page.locator(".project-card img[data-predictive-media]");
      assert.ok(await matchingImages.count() > 0, `no project matched ${query}`);
      await waitForImage(matchingImages.first());
    }

    assert.ok(
      projectImageRequests.size <= 20,
      `${browserName} requested ${projectImageRequests.size} project images during a bounded archive check`,
    );
    assert.deepEqual(consoleProblems, [], `${browserName} emitted console warnings/errors`);

    const fallbackPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    let fallbackState;
    try {
      await fallbackPage.route("**/assets/project-thumbs/28-live-pose-football-runner.webp", (route) => route.abort());
      await fallbackPage.goto(previewUrl, { waitUntil: "load" });
      await fallbackPage.locator("#projects").evaluate((section) => section.scrollIntoView({ block: "start" }));
      await fallbackPage.locator("#project-search").fill("Live Pose Football Runner");
      const fallbackImage = fallbackPage.locator(".project-card img[data-predictive-media]").first();
      fallbackState = await waitForImage(fallbackImage);
      assert.match(fallbackState.src, /\/assets\/projects\/28-live-pose-football-runner\.png$/);
    } finally {
      await fallbackPage.close();
    }

    console.log(JSON.stringify({
      browser: browserName,
      interaction: "keyboard-and-programmatic-scroll-only",
      projectImageRequests: projectImageRequests.size,
      firstRowImages: rowImages.length,
      fallback: fallbackState.src,
    }));
  } finally {
    await page.close();
    await browser.close();
  }
}

async function expectExactText(page, text) {
  const locator = page.getByText(text, { exact: true });
  assert.ok(await locator.count() > 0, `missing exact copy: ${text}`);
}

async function assertChineseTypography(page, language) {
  const style = await page.locator(".evidence-section .section-intro h2").evaluate((element) => {
    const computed = getComputedStyle(element);
    return {
      fontFamily: computed.fontFamily,
      fontFeatureSettings: computed.fontFeatureSettings,
      fontVariantEastAsian: computed.fontVariantEastAsian,
    };
  });
  const expectedFirstFamily = language === "traditional" ? "Heiti TC" : "Heiti SC";
  assert.ok(style.fontFamily.startsWith(`\"${expectedFirstFamily}\"`) || style.fontFamily.startsWith(expectedFirstFamily));
  assert.equal(style.fontFeatureSettings, "normal");
  assert.equal(style.fontVariantEastAsian, "normal");
}

const preview = spawn(
  process.execPath,
  ["node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1", "--port", String(previewPort)],
  {
    cwd: process.cwd(),
    env: { ...process.env, VITE_BASE_PATH: "/Aesir-web/", VITE_DEFAULT_PAGE: "neuro" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);

try {
  await waitForPreview(preview);
  await runScenario("chromium", chromium);
  await runScenario("webkit", webkit);
} finally {
  preview.kill("SIGTERM");
}
