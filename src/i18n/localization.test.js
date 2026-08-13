import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { aesirProjects } from "../projectPortfolio.js";
import {
  localizeProject,
  PROJECT_DESCRIPTION_TRANSLATIONS,
  PROJECT_TITLE_TRANSLATIONS,
} from "./projectTranslations.js";
import { LANGUAGE_KEYS, languages } from "./translations.js";

const sectionIds = ["top", "research", "method", "evidence", "projects", "leadership", "contact"];
const chineseCopySources = [
  new URL("./translations.js", import.meta.url),
  new URL("./projectTranslations.js", import.meta.url),
  new URL("../projectPortfolio.js", import.meta.url),
  new URL("../components/AesirResearchSite.jsx", import.meta.url),
  new URL("../../public/project-viewer.html", import.meta.url),
];

test("all supported languages expose complete site content", () => {
  assert.deepEqual(LANGUAGE_KEYS, ["en", "traditional", "simplified"]);
  for (const language of LANGUAGE_KEYS) {
    assert.equal(languages[language].researchAreas.length, 3);
    assert.equal(languages[language].method.steps.length, 4);
    assert.equal(languages[language].evidence.outputs.length, 4);
    assert.equal(languages[language].leadership.photoLabels.length, 4);
    assert.equal(languages[language].leadership.photoAlts.length, 4);
    assert.equal(languages[language].leadership.archiveAlts.length, 10);
    assert.deepEqual(
      languages[language].sectionNavigation.items.map(([, id]) => id),
      sectionIds,
    );
    assert.ok(languages[language].sectionNavigation.label);
  }
});

test("approved project translations cover every unique project title", () => {
  const uniqueTitles = new Set(aesirProjects.map((project) => project.title));
  assert.equal(uniqueTitles.size, 94);

  for (const language of ["traditional", "simplified"]) {
    assert.equal(Object.keys(PROJECT_TITLE_TRANSLATIONS[language]).length, uniqueTitles.size);
    assert.equal(Object.keys(PROJECT_DESCRIPTION_TRANSLATIONS[language]).length, uniqueTitles.size);
    for (const title of uniqueTitles) {
      assert.ok(PROJECT_TITLE_TRANSLATIONS[language][title], `missing ${language} title for ${title}`);
      assert.ok(PROJECT_DESCRIPTION_TRANSLATIONS[language][title], `missing ${language} description for ${title}`);
    }
  }
});

test("project localization preserves technical metadata", () => {
  const original = aesirProjects.find((project) => project.title === "Happy Kingdom AR Playbook");
  const localized = localizeProject(original, "traditional");

  assert.equal(localized.title, "Happy Kingdom AR 正向心理學互動手冊");
  assert.equal(localized.category, "AR 與動態互動／沉浸式學習");
  assert.equal(localized.originalTitle, original.title);
  assert.equal(localized.media, original.media);
  assert.equal(localized.previewMedia, original.previewMedia);
  assert.equal(localized.number, original.number);
  assert.equal(localized.link, original.link);
});

test("English localization remains byte-for-byte source copy", () => {
  const original = aesirProjects[0];
  const localized = localizeProject(original, "en");
  assert.equal(localized.title, original.title);
  assert.equal(localized.category, original.category);
  assert.equal(localized.description, original.description);
});

test("Chinese source copy uses natural punctuation spacing", () => {
  for (const sourceUrl of chineseCopySources) {
    const source = readFileSync(sourceUrl, "utf8");
    assert.doesNotMatch(
      source,
      /[，。；：！？、][\u0009-\u000d\u0020\u0085\u00a0\u1680\u2000-\u200b\u2028\u2029\u202f\u205f\u3000\ufeff]+/u,
      `${sourceUrl.pathname} has Unicode whitespace after Chinese punctuation`,
    );
  }
});
