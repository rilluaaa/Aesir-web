import assert from "node:assert/strict";
import test from "node:test";

import { aesirProjects } from "../projectPortfolio.js";
import {
  localizeProject,
  PROJECT_DESCRIPTION_TRANSLATIONS,
  PROJECT_TITLE_TRANSLATIONS,
} from "./projectTranslations.js";
import { LANGUAGE_KEYS, languages } from "./translations.js";

test("all supported languages expose complete site content", () => {
  assert.deepEqual(LANGUAGE_KEYS, ["en", "traditional", "simplified"]);
  for (const language of LANGUAGE_KEYS) {
    assert.equal(languages[language].researchAreas.length, 3);
    assert.equal(languages[language].method.steps.length, 4);
    assert.equal(languages[language].evidence.outputs.length, 4);
    assert.equal(languages[language].leadership.photoLabels.length, 4);
    assert.equal(languages[language].leadership.photoAlts.length, 4);
    assert.equal(languages[language].leadership.archiveAlts.length, 10);
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
