---
name: "AESIR Research Launch"
description: "A paper-white editorial launch system grounded in natural clay, sand, and evidence-led immersive intelligence."
colors:
  ink: "#1b1816"
  muted: "#716963"
  clay: "#8d4d3b"
  clay-dark: "#6f3729"
  sand: "#c7b5a2"
  sand-soft: "#f1e5dc"
  cream: "#f5efe8"
  warm-panel: "#eadfd4"
  archive-paper: "#f7f7f3"
  paper-tint: "#fafaf7"
  viewer-paper: "#f7f3ef"
  line: "#e7dfd7"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Crimson Text, Georgia, serif"
    fontSize: "clamp(6.25rem, 10.7vw, 10rem)"
    fontWeight: 400
    lineHeight: 0.88
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Crimson Text, Georgia, serif"
    fontSize: "clamp(4rem, 7vw, 7rem)"
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Crimson Text, Georgia, serif"
    fontSize: "1.8rem"
    fontWeight: 400
    letterSpacing: "-0.035em"
  body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: "0.08em"
  case-heading:
    fontFamily: "Crimson Text, Georgia, serif"
    fontSize: "clamp(2.5rem, 4vw, 4rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  case-title:
    fontFamily: "Crimson Text, Georgia, serif"
    fontSize: "1.7rem"
    fontWeight: 400
    lineHeight: 1.06
    letterSpacing: "-0.035em"
  case-body:
    fontFamily: "DM Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.86rem"
    fontWeight: 400
    lineHeight: 1.68
rounded:
  panel: "30px"
  hero: "24px"
  media: "28px"
  project-media: "22px"
  card: "16px"
  pill: "999px"
components:
  button-primary:
    backgroundColor: "{colors.clay}"
    textColor: "{colors.white}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 25px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.clay-dark}"
    textColor: "{colors.white}"
  sticky-header:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    height: "96px"
    mobileHeight: "76px"
  hero-media:
    backgroundColor: "transparent"
    rounded: "{rounded.hero}"
    aspectRatio: "auto"
    objectFit: "contain"
    objectPosition: "center"
  research-tab-active:
    backgroundColor: "{colors.clay}"
    textColor: "{colors.white}"
    typography: "{typography.title}"
    rounded: "{rounded.card}"
    padding: "27px 28px"
  research-panel:
    backgroundColor: "{colors.sand-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(34px, 5vw, 68px)"
  research-panel-ax:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(34px, 5vw, 68px)"
  research-panel-neuro:
    backgroundColor: "{colors.warm-panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "clamp(34px, 5vw, 68px)"
  research-tag:
    backgroundColor: "transparent"
    textColor: "{colors.clay-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "9px 13px"
  search-field:
    backgroundColor: "{colors.paper-tint}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "13px 18px"
  method-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "28px 28px 38px"
  output-card:
    backgroundColor: "{colors.archive-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px"
  project-card-media:
    backgroundColor: "{colors.cream}"
    rounded: "{rounded.project-media}"
    padding: "14px"
  project-card-media-hover:
    backgroundColor: "{colors.sand-soft}"
    rounded: "{rounded.project-media}"
    padding: "14px"
  research-case-clay:
    backgroundColor: "{colors.clay}"
    textColor: "{colors.white}"
    typography: "{typography.case-title}"
    rounded: "{rounded.card}"
    padding: "26px"
  research-case-sand:
    backgroundColor: "{colors.sand}"
    textColor: "{colors.ink}"
    typography: "{typography.case-title}"
    rounded: "{rounded.card}"
    padding: "26px"
  research-case-paper:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    typography: "{typography.case-title}"
    rounded: "{rounded.card}"
    padding: "26px"
---

# Design System: AESIR Research Launch

## Overview

**Creative North Star: "The Research Launch"**

AESIR presents applied R&D with the clarity and anticipation of a modern product launch, but the evidence remains the product. Monumental serif claims, generous paper-white space, restrained clay actions, and documentary media make complex research feel consequential, human, and ready for public scrutiny.

The system is editorial before it is technological. Clay, sand, cream, and soft paper group complex evidence into independent tonal cards; shared spacing keeps the system coherent without turning it into a dashboard. The hero is a direct, cinematic editorial image without an enclosing matte, while evidence and archive media use intentional contained presentations when the complete artifact matters. Motion and elevation are brief signals of action, never ambient spectacle.

**Key Characteristics:**

- Monumental Crimson Text statements on a paper-white field.
- DM Sans interface copy with compact, disciplined metadata.
- Clay actions with sand, cream, warm-clay, and soft-paper evidence groups.
- A full-width, opaque sticky header whose shape does not morph on scroll.
- An unframed, full-frame hero image with direct shadow and no subject crop.
- Independent 16px cards paced by consistent 12px gaps.
- Local static WebP archive previews that avoid third-party thumbnail requests.
- Responsive compositions that preserve the launch-like pacing on small screens.

## Colors

The palette pairs warm editorial ink with one natural clay action family and low-chroma sand and paper tones.

### Primary

- **Launch Clay** (`clay`): Primary actions, project categories, case-study emphasis, and purposeful wayfinding.
- **Deep Clay** (`clay-dark`): Button hover, research metadata, and the strongest earthen text accent.

### Secondary

- **Natural Sand** (`sand`): Evidence and project-detail media fields, plus the middle case-study card.
- **Soft Sand** (`sand-soft`): Society 5.0 panels and alternating method, output, or project-hover fields.
- **Archive Cream** (`cream`): Warm neutral backing for contained documentary imagery.
- **Warm Research Clay** (`warm-panel`): NEURO research-panel differentiation.

### Neutral

- **Editorial Ink** (`ink`): Headlines, body emphasis, and principal interface text.
- **Quiet Record** (`muted`): Supporting prose and archive metadata.
- **Archive Paper** (`archive-paper`): Resting research tabs, output cards, and quiet archive fields.
- **Paper Tint** (`paper-tint`): Method sections and search-field fill.
- **Viewer Paper** (`viewer-paper`): Standalone project-viewer canvas.
- **Measured Rule** (`line`): Dividers, section boundaries, and control strokes.
- **Paper White** (`white`): Dominant page, header, and card field.

**The Paper Leads Rule.** Paper White is the dominant atmosphere; sand and cream organise evidence while clay remains a scarce action signal.

**The Earthbound Restraint Rule.** Stay inside the clay, sand, cream, and paper family; do not add competing saturated technology colors.

## Typography

**Display Font:** Crimson Text (with Georgia and serif fallbacks)

**Body Font:** DM Sans (with system sans-serif fallbacks)

**Character:** Crimson Text gives the research thesis cultural weight and launch-scale drama without a futuristic cliché. DM Sans keeps navigation, controls, definitions, and long explanations clean and contemporary.

### Hierarchy

- **Display** (weight 400, fluid 6.25rem–10rem, line-height 0.88): Centred hero and final launch statements; narrow screens use the implemented 4rem–5.25rem range.
- **Headline** (weight 400, fluid 4rem–7rem, line-height 0.94): Section theses and major editorial transitions.
- **Title** (weight 400, 1.8rem, tight tracking): Research tabs and component-level serif titles.
- **Body** (weight 400, about 1rem, line-height 1.7): Explanations, evidence, and field records.
- **Label** (weight 600, about 0.75rem, tracked): Categories, proof points, figure captions, and definition terms; uppercase is reserved for metadata.
- **Case group heading** (weight 400, fluid 2.5rem–4rem, line-height 0.98): Introduces the applied-case group.
- **Case title** (weight 400, 1.7rem, line-height 1.06): Titles inside the 16px tonal research-case cards.
- **Case body** (weight 400, 0.86rem, line-height 1.68): Compact evidence copy inside research-case cards.

**The Two-Voice Rule.** Crimson Text announces claims and sequence; DM Sans navigates, explains, and records evidence.

**The Monument Rule.** Display type earns its scale through short, balanced statements; never stretch dense copy into the display role.

## Layout

Primary content uses a 1200px shell with 40px desktop gutters; the hero expands to a 1320px image within 24px page gutters. Launch statements are centred and deliberately oversized, then give way to asymmetric two-column evidence layouts and three-column project grids. Within research, method, and output groups, independent cards use 12px gaps so comparison remains clear without joined table borders. Major sections use 138px vertical spacing, allowing each thesis, method, or archive set to arrive as a distinct editorial chapter.

The header stays sticky at the top of the viewport and remains a full-width opaque surface: 96px on desktop and 76px at the mobile navigation breakpoint. It does not condense, float, blur, or change into a pill while scrolling. At 1100px the content shell tightens and project cards move to two columns. At 900px desktop navigation moves into a full-width mobile menu, major editorial splits stack, and the method grid becomes two columns. At 640px section spacing drops to 88px, projects become one column, the method becomes a horizontal snap sequence, research tabs stack, and the hero retains its centred launch rhythm.

**The Tonal Grouping Rule.** Use aligned 16px cards and consistent 12px gaps for research, method, and output sets; use rules for section boundaries and compact metadata, not as the only grouping device.

## Elevation & Depth

The system is restrained rather than flat. Tonal layers establish most depth. The shared launch shadow (`0 18px 54px rgba(64, 43, 34, 0.1)`) supports raised editorial objects. The hero image receives a direct warm shadow (`0 20px 52px rgba(58, 38, 30, 0.13)`) without an outer frame. The fixed-state desktop header remains on the paper plane; only the open mobile menu uses a temporary shadow. Project cards signal action through a cream-to-Soft-Sand matte change and arrow movement rather than lift.

### Shadow Vocabulary

- **Launch Object** (`0 18px 54px rgba(64, 43, 34, 0.1)`): Shared warm elevation token.
- **Hero Image** (`0 20px 52px rgba(58, 38, 30, 0.13)`): Direct depth beneath the unframed hero image.
- **Temporary Menu** (`0 20px 40px rgba(27, 24, 22, 0.08)`): Open mobile navigation only.
- **Viewer Panel** (`0 24px 70px rgba(64, 43, 34, 0.1)`): Single focused object in the standalone project viewer.

**The Elevation as Event Rule.** Shadows mark the hero, a focused detail object, or a temporary overlay; ordinary evidence and the sticky header remain on the paper plane.

## Shapes

Soft geometry is hierarchical. Large research panels use a 30px radius, secondary documentary media uses 28px, the direct hero image uses 24px, project media uses 22px, grouped information cards use 16px, and compact controls use the full pill radius. The hero figure itself has no fill, padding, border, or radius, so the image reads as a standalone editorial object rather than a card inside a card.

**The Radius Hierarchy Rule.** Larger evidence containers receive larger radii; pills belong to actions, search, and filters, not to the header or long-form content.

## Components

### Buttons

- **Shape:** Full pill with a 50px minimum height; the final contact action grows to 66px on desktop.
- **Primary:** Launch Clay with white DM Sans text and 25px horizontal padding.
- **Hover / Focus:** Shift to Deep Clay and rise 2px over 180ms; keyboard focus uses a white inner outline plus a Deep Clay outer ring so it remains visible on light and colored surfaces.
- **Text action:** Ink text without a container; the directional arrow moves 3px diagonally on hover.

### Chips

- **Style:** Transparent or Soft Sand pill with a fine clay border, compact tracked DM Sans, and 9px × 13px padding.
- **State:** Research tags are descriptive; filter chips use Launch Clay with white text when hovered or selected.

### Cards / Containers

- **Corner Style:** 30px research panels, 28px secondary media, 24px hero image, 22px project media, and 16px grouped cards.
- **Background:** Society 5.0 uses Soft Sand, AX uses Archive Cream, and NEURO uses Warm Research Clay. Detail cards use translucent white; method and output cards alternate Paper White, Archive Paper, and Soft Sand.
- **Shadow Strategy:** Project cards have no resting shadow; the media matte changes from Archive Cream to Soft Sand while the arrow moves, with no image crop or zoom.
- **Border:** One-pixel Measured Rule remains for section boundaries, names, and compact controls; tonal cards separate through fill and 12px gaps.
- **Internal Padding:** 20px for research details, 24px for outputs, 26px for research cases, 27–28px for tabs and method cards, and fluid 34–68px for research panels.

### Inputs / Fields

- **Style:** Search sits inside a lightly filled pill with a one-pixel Measured Rule border and an 11px icon gap.
- **Focus:** Preserve the shared white inner outline and Deep Clay outer ring; the input itself remains borderless.
- **Placeholder:** Quiet Record at readable opacity.

### Navigation

The desktop header is a full-width, 96px opaque white sticky surface with centred links and a clay contact pill. Its dimensions, shape, and surface do not change with scroll; there is no blur or floating compact state. At 900px it becomes a 76px bar, and a circular 44px menu control opens a ruled white list with 56px rows and a full-width clay contact action.

### Hero Media

The hero figure is unframed: transparent, unpadded, and without its own radius. Its image keeps its natural aspect ratio, uses a direct 24px radius, and remains fully visible with `object-fit: contain`, then receives the dedicated warm hero shadow. The caption sits 18px below on the page field rather than inside a colored enclosure.

### Research Selector

Three independent Archive Paper tabs sit on a 12px grid; the active tab switches to Launch Clay with white text. The connected 30px panel varies by research area—Soft Sand for Society 5.0, Archive Cream for AX, and Warm Research Clay for NEURO. Each area opens at **Description**, then progresses through **Research Focus** and **Applied Direction** using a three-step ruled navigator and labelled previous/next arrow controls. Only one detailed narrative is shown at a time, with two readable paragraphs and a stable sequence indicator; changing the research area resets the journey to Description. The applied case-study cards remain visible after the narrative. Area tabs and stage tabs both support arrow-key navigation, visible focus, and reduced-motion behaviour.

### Method Cards

The four-step method uses independent 16px cards with 12px gaps, large clay serif numerals, and alternating Paper White and Soft Sand fills. At narrow widths the cards become a horizontal snap sequence rather than collapsing into a dense vertical list.

### Output Cards

Applied outputs form a vertical 12px-spaced stack of 16px cards. Archive Paper and Soft Sand alternate to create scan rhythm without implying interactivity; each card holds a serif title above concise DM Sans evidence copy.

### Documentary Media

The hero keeps its full documentary frame without an outer matte. Evidence, leadership, archive, project-card, and project-detail imagery also uses `object-fit: contain` inside a deliberate sand, cream, white, or dark field whenever the complete artifact must remain visible. Project cards use a 16:10 frame with 14px padding; the project viewer centres original project media within a padded Natural Sand field and caps it at 62vh.

### Project Card

All 106 source records remain in the archive in source order; the interface does not deduplicate repeated titles or categories. Each whole-card link opens the internal project detail page in a new tab and uses a rounded 16:10 cream media field containing a locally stored static WebP preview, a clay category label, serif title, a three-line description clamp, and a quiet destination row. Local previews prevent the archive grid from depending on third-party thumbnail requests. `content-visibility` and containment keep the long grid efficient. Hover leaves the image unchanged, switches only the field to Soft Sand, and moves the arrow 3px diagonally.

### Project Viewer

The standalone viewer uses a 28px white panel on Viewer Paper, a padded Natural Sand field with the record's original `project.media` shown full-frame, a Soft Sand category pill with clay text, a Crimson Text title, and a readable description capped near 72 characters per line. Archive-only static WebP `previewMedia` never replaces detail media. Show one **Open Project** action only when the archive supplies a verified direct destination. When no verified link exists, hide the action group and show the neutral availability note; never substitute the media URL or generic AESIR homepage as a project action.

## Do's and Don'ts

### Do:

- **Do** let monumental serif statements and paper-white space establish confidence.
- **Do** use clay for purposeful action and the sand–cream–warm-clay range for tonal evidence groups.
- **Do** keep the header opaque, full-width, and geometrically stable while it sticks.
- **Do** let the hero image stand on its own without an enclosing colored frame.
- **Do** serve local static WebP previews in archive cards and preserve original media in project detail.
- **Do** keep research, method, and output items as independent 16px cards with consistent 12px gaps.
- **Do** preserve visible focus, 44px or larger targets, reduced-motion behavior, and verified-link gating.
- **Do** keep the supplied AESIR wordmark on its original white rectangular background.

### Don't:

- **Don't** reintroduce meteor, particle, starfield, canvas, or decorative WebGL effects.
- **Don't** add a scroll-driven header morph, floating navigation pill, translucency, or backdrop blur.
- **Don't** wrap the hero image in a colored matte or nested rounded frame.
- **Don't** make expanded research content dark or detach it from the selector.
- **Don't** substitute gradients, glass cards, or generic technology-dashboard styling for the paper-led editorial world.
- **Don't** shadow every rounded container or lift static evidence.
- **Don't** crop documentary or project media where doing so would remove information.
- **Don't** fetch archive previews from third-party thumbnail hosts or use preview images as project-detail media.
- **Don't** deduplicate the 106-record source archive.
- **Don't** expose an external project action unless its destination has been verified; never fall back to media or the AESIR homepage.
- **Don't** fabricate awards, publications, people, or outcomes to strengthen a layout.
