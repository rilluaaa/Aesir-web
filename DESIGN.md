---
name: "AESIR Research Launch"
description: "A paper-white editorial launch system for evidence-led immersive intelligence."
colors:
  ink: "#151713"
  muted: "#6f746c"
  moss: "#50651b"
  moss-dark: "#394b11"
  sage: "#9faa8d"
  sage-soft: "#e8eed4"
  cream: "#f4f0e6"
  warm-panel: "#eadfd4"
  paper-soft: "#f7f7f3"
  paper-tint: "#fafaf7"
  line: "#e4e5df"
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
  media: "28px"
  project-media: "22px"
  card: "16px"
  pill: "999px"
components:
  button-primary:
    backgroundColor: "{colors.moss}"
    textColor: "{colors.white}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "0 25px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.moss-dark}"
    textColor: "{colors.white}"
  research-tab-active:
    backgroundColor: "{colors.moss}"
    textColor: "{colors.white}"
    typography: "{typography.title}"
    rounded: "{rounded.card}"
    padding: "27px 28px"
  research-panel:
    backgroundColor: "{colors.sage-soft}"
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
    textColor: "{colors.moss-dark}"
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
    backgroundColor: "{colors.paper-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px"
  project-card-media:
    backgroundColor: "{colors.cream}"
    rounded: "{rounded.project-media}"
    padding: "14px"
  project-card-media-hover:
    backgroundColor: "{colors.sage-soft}"
    rounded: "{rounded.project-media}"
    padding: "14px"
  research-case-moss:
    backgroundColor: "{colors.moss}"
    textColor: "{colors.white}"
    typography: "{typography.case-title}"
    rounded: "{rounded.card}"
    padding: "26px"
  research-case-sage:
    backgroundColor: "{colors.sage}"
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

AESIR presents applied R&D with the clarity and anticipation of a modern product launch, but the evidence remains the product. Monumental serif claims, generous paper-white space, restrained moss actions, and documentary media make complex research feel consequential, human, and ready for public scrutiny.

The system is editorial before it is technological. Moss, sage, cream, warm clay, and soft paper group complex evidence into independent tonal cards; shared spacing keeps the system coherent without turning it into a dashboard. Softly rounded, full-frame media keeps real people and field work at the centre. Motion and elevation are brief signals of navigation or action, never ambient spectacle.

**Key Characteristics:**

- Monumental Crimson Text statements on a paper-white field.
- DM Sans interface copy with compact, disciplined metadata.
- Moss actions with sage, cream, warm-clay, and soft-paper evidence groups.
- Independent 16px cards paced by consistent 12px gaps.
- Rounded, full-frame documentary media that avoids accidental cropping.
- Restrained elevation reserved for navigation, media, and real actions.
- Responsive compositions that preserve the launch-like pacing on small screens.

## Colors

The palette pairs near-black editorial ink with one botanical action family and low-chroma paper tones.

### Primary

- **Launch Moss** (`moss`): Primary actions, project categories, and purposeful emphasis.
- **Deep Moss** (`moss-dark`): Button hover, research metadata, and the strongest botanical text accent.

### Secondary

- **Documentary Sage** (`sage`): Hero and film media enclosures.
- **Pale Sage** (`sage-soft`): Society 5.0 panels and alternating method or output cards.
- **Archive Cream** (`cream`): Warm neutral backing for documentary imagery.
- **Warm Research Clay** (`warm-panel`): NEURO research-panel differentiation.

### Neutral

- **Editorial Ink** (`ink`): Headlines, body emphasis, and principal interface text.
- **Quiet Record** (`muted`): Supporting prose and archive metadata.
- **Soft Paper** (`paper-soft`): Resting research tabs, output cards, filter trays, and the project-viewer canvas.
- **Paper Tint** (`paper-tint`): Method sections and search-field fill.
- **Measured Rule** (`line`): Dividers, section boundaries, and control strokes.
- **Paper White** (`white`): Dominant page and card field.

**The Paper Leads Rule.** Paper White is the dominant atmosphere; sage and cream organise evidence while moss remains a scarce action signal.

**The Botanical Restraint Rule.** Stay inside the moss-and-sage family; do not add competing saturated technology colors.

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

Primary content uses a 1200px shell with 40px desktop gutters; the hero expands to 1440px with 24px gutters. Launch statements are centred and deliberately oversized, then give way to asymmetric two-column evidence layouts and three-column project grids. Within research, method, and output groups, independent cards use 12px gaps so comparison remains clear without joined table borders. Major sections use 138px vertical spacing, allowing each thesis, method, or archive set to arrive as a distinct editorial chapter.

At 1100px the content shell tightens and project cards move to two columns. At 900px the header becomes a 76px mobile bar, desktop navigation moves into a full-width menu, major editorial splits stack, and the method grid becomes two columns. At 640px section spacing drops to 88px, projects become one column, the method becomes a horizontal snap sequence, research tabs stack, and the hero retains its centred launch rhythm.

**The Tonal Grouping Rule.** Use aligned 16px cards and consistent 12px gaps for research, method, and output sets; use rules for section boundaries and compact metadata, not as the only grouping device.

## Elevation & Depth

The system is restrained rather than flat. Tonal layers and full-frame image mattes establish most depth. The shared launch shadow (`0 18px 54px rgba(36, 42, 29, 0.1)`) supports raised editorial objects; stronger media depth appears inside the hero enclosure, while compact navigation and the open mobile menu use lighter temporary shadows. Project cards stay on the page plane and signal action through a cream-to-Pale-Sage matte change and arrow movement.

### Shadow Vocabulary

- **Launch Object** (`0 18px 54px rgba(36, 42, 29, 0.1)`): Shared soft elevation token.
- **Hero Media** (`0 22px 65px rgba(25, 31, 17, 0.24)`): The framed documentary image inside its sage enclosure.
- **Compact Navigation** (`0 10px 34px rgba(21, 23, 19, 0.08)`): Floating desktop navigation after scrolling.
- **Temporary Menu** (`0 20px 40px rgba(21, 23, 19, 0.08)`): Open mobile navigation only.

**The Elevation as Event Rule.** Shadows mark a framed media object, navigation state, or temporary overlay; ordinary evidence remains on the paper plane.

## Shapes

Soft geometry is hierarchical. Large research panels use a 30px radius, principal media uses 28px, project media uses 22px, grouped information cards use 16px, and compact controls use the full pill radius. Thin rules and disciplined 12px gaps keep the rounded system precise rather than soft or playful.

**The Radius Hierarchy Rule.** Larger evidence containers receive larger radii; pills belong to actions, search, filters, and compact navigation, not long-form content.

## Components

### Buttons

- **Shape:** Full pill with a 50px minimum height; the final contact action grows to 66px on desktop.
- **Primary:** Launch Moss with white DM Sans text and 25px horizontal padding.
- **Hover / Focus:** Shift to Deep Moss and rise 2px over 180ms; keyboard focus uses a 3px translucent moss outline offset by 4px.
- **Text action:** Ink text without a container; the directional arrow moves 3px diagonally on hover.

### Chips

- **Style:** Transparent or Pale Sage pill with a fine moss border, compact tracked DM Sans, and 9px × 13px padding.
- **State:** Research tags are descriptive; filter chips use Launch Moss with white text when hovered or selected.

### Cards / Containers

- **Corner Style:** 30px research panels, 28px primary media, 22px project media, and 16px grouped cards.
- **Background:** Society 5.0 uses Pale Sage, AX uses Archive Cream, and NEURO uses Warm Research Clay. Detail cards use translucent white; method and output cards alternate Paper White, Soft Paper, and Pale Sage.
- **Shadow Strategy:** Project cards have no resting shadow; the media matte changes from Archive Cream to Pale Sage while the arrow moves, with no image crop or zoom.
- **Border:** One-pixel Measured Rule remains for section boundaries, names, and compact controls; tonal cards separate through fill and 12px gaps.
- **Internal Padding:** 20px for research details, 24px for outputs, 26px for research cases, 27–28px for tabs and method cards, and fluid 34–68px for research panels.

### Inputs / Fields

- **Style:** Search sits inside a lightly filled pill with a one-pixel Measured Rule border and an 11px icon gap.
- **Focus:** Preserve the shared 3px moss outline; the input itself remains borderless.
- **Placeholder:** Quiet Record at readable opacity.

### Navigation

The initial desktop header is 96px tall with centred links and a moss contact pill. After scrolling, it condenses into a 530px by 60px floating navigation pill with a blurred paper background and subtle shadow. At 900px, a circular 44px menu control opens a ruled white list with 56px rows and a full-width moss contact action.

### Research Selector

Three independent Soft Paper tabs sit on a 12px grid; the active tab switches to Launch Moss with white text. The connected 30px panel varies by research area—Pale Sage for Society 5.0, Archive Cream for AX, and Warm Research Clay for NEURO. Its definition rows become translucent-white 16px cards, followed by three 16px case-study cards in moss, sage, and white. Arrow-key navigation, visible focus, and the 320ms reduced-motion-aware panel transition remain required.

### Method Cards

The four-step method uses independent 16px cards with 12px gaps, large moss serif numerals, and alternating Paper White and Pale Sage fills. At narrow widths the cards become a horizontal snap sequence rather than collapsing into a dense vertical list.

### Output Cards

Applied outputs form a vertical 12px-spaced stack of 16px cards. Soft Paper and Pale Sage alternate to create scan rhythm without implying interactivity; each card holds a serif title above concise DM Sans evidence copy.

### Documentary Media

Hero, evidence, leadership, archive, project-card, and project-detail imagery uses `object-fit: contain` inside a deliberate sage, cream, white, or dark inner matte so the complete artifact remains visible. The hero keeps its 16:8.9 frame without cropping; the project card uses a 16:10 frame with 14px padding; the project viewer centres the original project media within a padded sage field and caps it at 62vh.

### Project Card

All 106 source records remain in the archive in source order; the interface does not deduplicate repeated titles or categories. Each whole-card link opens the internal project detail page in a new tab and uses a rounded 16:10 cream media matte with contained preview imagery, moss category label, serif title, a three-line description clamp, and a quiet destination row. Hover leaves the image full-frame and unchanged, switches only the matte to Pale Sage, and moves the arrow 3px diagonally.

### Project Viewer

The standalone viewer uses a 28px white panel on Soft Paper, a padded sage field with the record's original `project.media` shown full-frame, a moss category pill, a Crimson Text title, and a readable description capped near 72 characters per line. Higher-resolution YouTube thumbnails belong only to `previewMedia` in archive cards and never replace detail media. Show one **Open Project** action only when the archive supplies a verified direct destination. When no verified link exists, hide the action group and show the neutral availability note; never substitute the media URL or generic AESIR homepage as a project action.

## Do's and Don'ts

### Do:

- **Do** let monumental serif statements and paper-white space establish confidence.
- **Do** use moss for purposeful action and the sage–cream–warm-clay range for tonal evidence groups.
- **Do** keep research, method, and output items as independent 16px cards with consistent 12px gaps.
- **Do** preserve complete evidence and archive imagery with contained full-frame presentation where cropping would remove information.
- **Do** preserve visible focus, 44px or larger targets, reduced-motion behavior, and verified-link gating.
- **Do** keep the supplied AESIR wordmark on its original white rectangular background.

### Don't:

- **Don't** reintroduce meteor, particle, starfield, canvas, or decorative WebGL effects.
- **Don't** make expanded research content dark or detach it from the selector.
- **Don't** substitute gradients, glass cards, or generic technology-dashboard styling for the paper-led editorial world.
- **Don't** shadow every rounded container or lift static evidence.
- **Don't** crop documentary or project media merely to force uniform card geometry.
- **Don't** deduplicate the 106-record source archive or use preview thumbnails as project-detail media.
- **Don't** expose an external project action unless its destination has been verified; never fall back to media or the AESIR homepage.
- **Don't** fabricate awards, publications, people, or outcomes to strengthen a layout.
