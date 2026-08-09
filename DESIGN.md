---
name: "AESIR Research Launch"
description: "A paper-white editorial launch system grounded in institutional blue, cool mist, and evidence-led immersive intelligence."
colors:
  ink: "#15263a"
  muted: "#607286"
  clay: "#3f73a8"
  clay-dark: "#274f78"
  sand: "#aec8df"
  sand-soft: "#e6f0f8"
  cream: "#f1f6fb"
  warm-panel: "#dceaf5"
  archive-paper: "#f5f8fb"
  paper-tint: "#f7fafe"
  viewer-paper: "#f3f7fb"
  line: "#d9e4ee"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Inter, DM Sans, sans-serif"
    fontSize: "clamp(3.7rem, 5.45vw, 5.75rem)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.04em"
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
    height: "88px"
    mobileHeight: "76px"
  hero-media:
    backgroundColor: "{colors.white}"
    rounded: "0"
    aspectRatio: "full viewport / 16:9 tablet / 1:1 mobile"
    objectFit: "cover"
    objectPosition: "right bottom"
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

AESIR presents applied R&D with the clarity and anticipation of a modern product launch, but the evidence remains the product. Monumental serif claims, generous paper-white space, restrained institutional-blue actions, and documentary media make complex research feel consequential, human, and ready for public scrutiny.

The system is editorial before it is technological. Cobalt, mist blue, cool paper, and white group complex evidence into independent tonal cards; shared spacing keeps the system coherent without turning it into a dashboard. The landing viewport pairs an Inter typewriter thesis with a full-bleed cognitive video that visitors scrub horizontally on desktop and watch normally on mobile. Evidence and archive media remain contained when the complete artifact matters.

**Key Characteristics:**

- Monumental Crimson Text statements on a paper-white field.
- DM Sans interface copy with compact, disciplined metadata.
- Institutional-blue actions with mist, haze, and soft-paper evidence groups.
- A fixed, paper-white 88px desktop header with clean navigation and an underlined Contact action.
- A full-viewport interactive video hero followed by a centred documentary image of Ernest HS CHAN in public dialogue.
- Independent 16px cards paced by consistent 12px gaps.
- Local static WebP archive previews that avoid third-party thumbnail requests.
- Responsive compositions that preserve the launch-like pacing on small screens.

## Colors

The palette pairs deep navy editorial ink with one institutional-blue action family and low-chroma mist and paper tones.

### Primary

- **Launch Blue** (`clay`): Primary actions, project categories, case-study emphasis, and purposeful wayfinding. The legacy token name remains for code compatibility.
- **Deep Blue** (`clay-dark`): Button hover, research metadata, and the strongest text accent.

### Secondary

- **Clear Mist** (`sand`): Evidence and project-detail media fields, plus the middle case-study card.
- **Soft Blue** (`sand-soft`): Society 5.0 panels and alternating method, output, or project-hover fields.
- **Archive Haze** (`cream`): Cool neutral backing for contained documentary imagery.
- **Research Sky** (`warm-panel`): NEURO research-panel differentiation.

### Neutral

- **Editorial Ink** (`ink`): Headlines, body emphasis, and principal interface text.
- **Quiet Record** (`muted`): Supporting prose and archive metadata.
- **Archive Paper** (`archive-paper`): Resting research tabs, output cards, and quiet archive fields.
- **Paper Tint** (`paper-tint`): Method sections and search-field fill.
- **Viewer Paper** (`viewer-paper`): Standalone project-viewer canvas.
- **Measured Rule** (`line`): Dividers, section boundaries, and control strokes.
- **Paper White** (`white`): Dominant page, header, and card field.

**The Paper Leads Rule.** Paper White is the dominant atmosphere; mist and haze organise evidence while blue remains a scarce action signal.

**The Blue Restraint Rule.** Stay inside the navy, institutional-blue, mist, and paper family; do not add competing saturated technology colours.

## Typography

**Display Font:** Crimson Text (with Georgia and serif fallbacks)

**Body Font:** DM Sans (with system sans-serif fallbacks)

**Character:** Crimson Text gives the research thesis cultural weight and launch-scale drama without a futuristic cliché. DM Sans keeps navigation, controls, definitions, and long explanations clean and contemporary.

### Hierarchy

- **Display** (Inter 400, fluid 3.7rem–5.75rem, line-height 1.02): The typewritten landing thesis. Mobile uses 3.25rem–4.35rem and preserves the authored line break.
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

Primary content uses a 1200px shell with 40px desktop gutters. The hero is a separate full-viewport stage: its copy occupies the clear left half of a full-bleed video, while the cognitive figure remains on the right. Below 900px, the copy becomes a white first panel and the video follows at 16:9; below 640px the video becomes square. The remainder returns to asymmetric editorial splits and three-column project grids. Within research, method, and output groups, independent cards use 12px gaps.

The header stays fixed as a full-width paper surface: 88px on desktop and 76px at the mobile navigation breakpoint. It does not condense, float, or change into a pill. At 900px desktop navigation becomes a full-screen mobile overlay and the video moves beneath the copy. At 640px section spacing drops to 88px, projects become one column, the method becomes a horizontal snap sequence, and research tabs stack.

**The Tonal Grouping Rule.** Use aligned 16px cards and consistent 12px gaps for research, method, and output sets; use rules for section boundaries and compact metadata, not as the only grouping device.

## Elevation & Depth

The system is restrained rather than flat. Tonal layers establish most depth. The hero creates depth through the black cognitive figure against a white field rather than a card or shadow. The fixed desktop header remains on the paper plane; the mobile navigation becomes a full-screen temporary layer. Project cards signal action through lift, matte change, and arrow movement.

### Shadow Vocabulary

- **Launch Object** (`0 18px 54px rgba(31, 69, 105, 0.12)`): Shared cool elevation token.
- **Hero Image** (`0 20px 52px rgba(31, 69, 105, 0.14)`): Direct depth beneath the unframed hero image.
- **Temporary Menu** (`0 20px 40px rgba(21, 38, 58, 0.08)`): Open mobile navigation only.
- **Viewer Panel** (`0 24px 70px rgba(31, 69, 105, 0.12)`): Single focused object in the standalone project viewer.

**The Elevation as Event Rule.** Shadows mark the hero, a focused detail object, or a temporary overlay; ordinary evidence and the sticky header remain on the paper plane.

## Shapes

Soft geometry is hierarchical. Large research panels use a 30px radius, secondary documentary media uses 28px, the direct hero image uses 24px, project media uses 22px, grouped information cards use 16px, and compact controls use the full pill radius. The hero figure itself has no fill, padding, border, or radius, so the image reads as a standalone editorial object rather than a card inside a card.

**The Radius Hierarchy Rule.** Larger evidence containers receive larger radii; pills belong to actions, search, and filters, not to the header or long-form content.

## Components

### Buttons

- **Shape:** Full pill with a 50px minimum height; the final contact action grows to 66px on desktop but stays compact at 160px minimum width.
- **Primary:** Launch Blue with white DM Sans text and 25px horizontal padding.
- **Hover / Focus:** Shift to Deep Blue and rise 2px over 180ms; keyboard focus uses a white inner outline plus a Deep Blue outer ring so it remains visible on light and coloured surfaces.
- **Text action:** Ink text without a container; the directional arrow moves 3px diagonally on hover.

### Chips

- **Style:** Transparent or Soft Blue pill with a fine blue border, compact tracked DM Sans, and 9px × 13px padding.
- **State:** Research tags are descriptive; filter chips use Launch Blue with white text when hovered or selected.

### Cards / Containers

- **Corner Style:** 30px research panels, 28px secondary media, 24px hero image, 22px project media, and 16px grouped cards.
- **Background:** Society 5.0 uses Soft Blue, AX uses Archive Haze, and NEURO uses Research Sky. Detail cards use translucent white; method and output cards alternate Paper White, Archive Paper, and Soft Blue.
- **Shadow Strategy:** Project cards have no resting shadow; hovering raises the whole linked record by 8px, adds a soft blue media shadow, changes the matte from Archive Haze to Soft Blue, and moves the arrow without cropping or zooming the image.
- **Border:** One-pixel Measured Rule remains for section boundaries, names, and compact controls; tonal cards separate through fill and 12px gaps.
- **Internal Padding:** 20px for research details, 24px for outputs, 26px for research cases, 27–28px for tabs and method cards, and fluid 34–68px for research panels.

### Inputs / Fields

- **Style:** Search sits inside a lightly filled pill with a one-pixel Measured Rule border and an 11px icon gap.
- **Focus:** Preserve the shared white inner outline and Deep Blue outer ring; the input itself remains borderless.
- **Placeholder:** Quiet Record at readable opacity.

### Navigation

The desktop header is a full-width, 88px paper-white fixed surface with centred Inter links and an underlined Contact action. At 900px it becomes a 76px bar; a three-line 44px menu control transforms into an X and opens a full-screen ruled navigation overlay with a blue contact action. The Deployment label retains the original Evidence section anchor and behaviour.

### Hero Media

The hero media is an unframed full-bleed local MP4 with an immediate WebP poster. Large or high-density desktops receive a motion-interpolated 1440p/120fps source, standard desktops retain the lighter 1080p/120fps source, and mobile uses a 720p/60fps source that plays normally and loops. Desktop keeps the neutral poster visible while the selected source buffers and decodes its neutral frame, then crossfades once scrubbing is ready; pointer input is ignored during that preparation window instead of exposing incomplete seeks. Pointer position maps absolutely across the video timeline—left, neutral centre, and right—then coalesces seeking through a display-synchronised requestAnimationFrame loop, so gaze direction no longer depends on the pointer's entry position. Reduced-motion visitors receive a paused frame. A white-to-transparent readability veil protects the left copy without obscuring the figure. The copy is limited to the typewritten thesis, concise positioning, and the compact proof line. Immediately below, Ernest HS CHAN's panel photograph returns as a centred documentary figure.

### Research Selector

Three independent Archive Paper tabs sit on a 12px grid; the active tab switches to Launch Blue with white text. The connected 30px panel varies by research area—Soft Blue for Society 5.0, Archive Haze for AX, and Research Sky for NEURO. Each area opens at **Description**, then progresses through **Research Focus** and **Applied Direction** using a three-step ruled navigator and labelled previous/next arrow controls. Only one detailed narrative is shown at a time, with two readable paragraphs and a stable sequence indicator; changing the research area resets the journey to Description. The applied case-study cards remain visible after the narrative. Area tabs and stage tabs both support arrow-key navigation, visible focus, and reduced-motion behaviour.

### Method Cards

The four-step method uses independent 16px cards with 12px gaps, large blue serif numerals, and alternating Paper White and Soft Blue fills. At narrow widths the cards become a horizontal snap sequence rather than collapsing into a dense vertical list.

### Output Cards

Applied outputs form a vertical 12px-spaced stack of 16px cards. Archive Paper and Soft Blue alternate to create scan rhythm without implying interactivity; each card holds a serif title above concise DM Sans evidence copy.

### Documentary Media

The responsive hero video sources use `object-fit: cover` and keep the cognitive figure right-aligned. The follow-up Ernest image uses the former centred editorial crop and direct cool shadow. Evidence, leadership, archive, project-card, and project-detail imagery uses `object-fit: contain` inside a deliberate mist, haze, white, or dark field whenever the complete artifact must remain visible. Project cards use a 16:10 frame with 14px padding; the project viewer centres original project media within a padded Clear Mist field and caps it at 62vh.

### Project Card

All 106 source records remain in the archive in source order; the interface does not deduplicate repeated titles or categories. Each whole-card link opens the internal project detail page in a new tab and uses a rounded 16:10 haze media field containing a locally stored static WebP preview, a blue category label, serif title, a three-line description clamp, and a quiet destination row. Local previews prevent the archive grid from depending on third-party thumbnail requests. `content-visibility` and containment keep the long grid efficient. Hover raises the linked record by 8px, leaves the image itself unchanged, switches the field to Soft Blue, adds a soft shadow, and moves the arrow 3px diagonally.

### Project Viewer

The standalone viewer uses a 28px white panel on Viewer Paper, a padded Clear Mist field with the record's original `project.media` shown full-frame, a Soft Blue category pill with blue text, a Crimson Text title, and a readable description capped near 72 characters per line. Archive-only static WebP `previewMedia` never replaces detail media. Show one **Open Project** action only when the archive supplies a verified direct destination. When no verified link exists, hide the action group and show the neutral availability note; never substitute the media URL or generic AESIR homepage as a project action.

## Do's and Don'ts

### Do:

- **Do** let monumental serif statements and paper-white space establish confidence.
- **Do** use blue for purposeful action and the mist–haze–sky range for tonal evidence groups.
- **Do** keep the header full-width, fixed, and geometrically stable.
- **Do** keep the hero video full-bleed, right-aligned, and free of a card frame.
- **Do** preserve 120Hz-coalesced desktop scrubbing, lightweight mobile autoplay, and the reduced-motion pause.
- **Do** serve local static WebP previews in archive cards and preserve original media in project detail.
- **Do** keep research, method, and output items as independent 16px cards with consistent 12px gaps.
- **Do** preserve visible focus, 44px or larger targets, reduced-motion behavior, and verified-link gating.
- **Do** keep the supplied AESIR wordmark on its original white rectangular background.

### Don't:

- **Don't** reintroduce meteor, particle, starfield, canvas, or decorative WebGL effects.
- **Don't** add a scroll-driven header morph, floating navigation pill, or decorative backdrop blur.
- **Don't** wrap the hero video in a coloured matte or rounded card.
- **Don't** make expanded research content dark or detach it from the selector.
- **Don't** substitute gradients, glass cards, or generic technology-dashboard styling for the paper-led editorial world.
- **Don't** shadow every rounded container or lift static evidence.
- **Don't** crop documentary or project media where doing so would remove information.
- **Don't** fetch archive previews from third-party thumbnail hosts or use preview images as project-detail media.
- **Don't** deduplicate the 106-record source archive.
- **Don't** expose an external project action unless its destination has been verified; never fall back to media or the AESIR homepage.
- **Don't** fabricate awards, publications, people, or outcomes to strengthen a layout.
