import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateSectionTargetY,
  getActiveSectionId,
  SECTION_IDS,
} from "../src/sectionNavigation.js";

test("section navigation exposes exactly the seven major sections", () => {
  assert.deepEqual(SECTION_IDS, [
    "top",
    "research",
    "method",
    "evidence",
    "projects",
    "leadership",
    "contact",
  ]);
});

test("section target uses the measured header height", () => {
  assert.equal(calculateSectionTargetY({
    elementTop: 420,
    scrollY: 680,
    headerHeight: 88,
  }), 1012);
  assert.equal(calculateSectionTargetY({
    elementTop: 30,
    scrollY: 20,
    headerHeight: 76,
  }), 0);
});

test("active section is the latest boundary above the reference line", () => {
  const sectionTops = {
    top: -900,
    research: -120,
    method: 210,
    evidence: 950,
    projects: 1600,
    leadership: 2200,
    contact: 2900,
  };

  assert.equal(getActiveSectionId({ sectionTops, referenceY: 180 }), "research");
  assert.equal(getActiveSectionId({ sectionTops, referenceY: 220 }), "method");
});

test("document end always resolves to Contact", () => {
  const sectionTops = Object.fromEntries(SECTION_IDS.map((id, index) => [id, index * 500]));
  assert.equal(getActiveSectionId({
    sectionTops,
    referenceY: 180,
    atDocumentEnd: true,
  }), "contact");
});
