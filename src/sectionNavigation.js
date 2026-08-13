export const SECTION_IDS = [
  "top",
  "research",
  "method",
  "evidence",
  "projects",
  "leadership",
  "contact",
];

export const calculateSectionTargetY = ({
  elementTop,
  scrollY,
  headerHeight,
}) => Math.max(0, elementTop + scrollY - headerHeight);

export const getActiveSectionId = ({
  sectionTops,
  referenceY,
  atDocumentEnd = false,
}) => {
  if (atDocumentEnd) return SECTION_IDS.at(-1);

  let activeSection = SECTION_IDS[0];
  for (const sectionId of SECTION_IDS) {
    const sectionTop = sectionTops[sectionId];
    if (!Number.isFinite(sectionTop) || sectionTop > referenceY) break;
    activeSection = sectionId;
  }

  return activeSection;
};
