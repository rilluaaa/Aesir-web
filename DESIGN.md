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
  line: "#e4e5df"
  white: "#ffffff"
  viewer-background: "#f7f7f3"
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
rounded:
  panel: "30px"
  media: "28px"
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
    backgroundColor: "{colors.sage-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    padding: "27px 28px"
  research-panel:
    backgroundColor: "#f0f3e7"
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
    backgroundColor: "#fafaf7"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "13px 18px"
---

# Design System: AESIR Research Launch

## Overview

**Creative North Star: "The Research Launch"**

AESIR presents applied R&D with the clarity and anticipation of a modern product launch, but the evidence remains the product. Monumental serif claims, generous paper-white space, restrained moss actions, and documentary media make complex research feel consequential, human, and ready for public scrutiny.

The system is editorial before it is technological. Pale sage panels organise dense material without interrupting the reading field; thin ruled grids make methods and records inspectable; softly rounded media keeps real people and field work at the centre. Motion and elevation are brief signals of navigation or action, never ambient spectacle.

**Key Characteristics:**

- Monumental Crimson Text statements on a paper-white field.
- DM Sans interface copy with compact, disciplined metadata.
- Moss actions and pale sage evidence surfaces.
- Rounded documentary media within thin ruled editorial grids.
- Restrained elevation reserved for navigation, media, and real actions.
- Responsive compositions that preserve the launch-like pacing on small screens.

## Colors

The palette pairs near-black editorial ink with one botanical action family and low-chroma paper tones.

### Primary

- **Launch Moss** (`moss`): Primary actions, project categories, and purposeful emphasis.
- **Deep Moss** (`moss-dark`): Button hover, research metadata, and the strongest botanical text accent.

### Secondary

- **Documentary Sage** (`sage`): Hero and film media enclosures.
- **Pale Sage** (`sage-soft`): Selected research states, evidence statements, and filter feedback.
- **Archive Cream** (`cream`): Warm neutral backing for documentary imagery.

### Neutral

- **Editorial Ink** (`ink`): Headlines, body emphasis, and principal interface text.
- **Quiet Record** (`muted`): Supporting prose and archive metadata.
- **Measured Rule** (`line`): Dividers, section boundaries, and control strokes.
- **Paper White** (`white`): Dominant page and card field.
- **Viewer Paper** (`viewer-background`): Standalone project-viewer canvas.

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

**The Two-Voice Rule.** Crimson Text announces claims and sequence; DM Sans navigates, explains, and records evidence.

**The Monument Rule.** Display type earns its scale through short, balanced statements; never stretch dense copy into the display role.

## Layout

Primary content uses a 1200px shell with 40px desktop gutters; the hero expands to 1440px with 24px gutters. Launch statements are centred and deliberately oversized, then give way to asymmetric two-column evidence layouts and three-column project grids. Major sections use 138px vertical spacing, allowing each thesis, method, or archive set to arrive as a distinct editorial chapter.

At 1100px the content shell tightens and project cards move to two columns. At 900px the header becomes a 76px mobile bar, desktop navigation moves into a full-width menu, major editorial splits stack, and the method grid becomes two columns. At 640px section spacing drops to 88px, projects become one column, the method becomes a horizontal snap sequence, research tabs stack, and the hero retains its centred launch rhythm.

**The Ruled Sequence Rule.** Use shared one-pixel rules to express sequence and comparison; rounded containers hold evidence, not every individual row.

## Elevation & Depth

The system is restrained rather than flat. Tonal layers and image crops establish most depth. The shared launch shadow (`0 18px 54px rgba(36, 42, 29, 0.1)`) supports raised editorial objects; stronger media depth appears inside the hero enclosure, while compact navigation and the open mobile menu use lighter temporary shadows. Project cards stay on the page plane and signal action through image scale and arrow movement.

### Shadow Vocabulary

- **Launch Object** (`0 18px 54px rgba(36, 42, 29, 0.1)`): Shared soft elevation token.
- **Hero Media** (`0 22px 65px rgba(25, 31, 17, 0.24)`): The framed documentary image inside its sage enclosure.
- **Compact Navigation** (`0 10px 34px rgba(21, 23, 19, 0.08)`): Floating desktop navigation after scrolling.
- **Temporary Menu** (`0 20px 40px rgba(21, 23, 19, 0.08)`): Open mobile navigation only.

**The Elevation as Event Rule.** Shadows mark a framed media object, navigation state, or temporary overlay; ordinary evidence remains on the paper plane.

## Shapes

Soft geometry is hierarchical. Large research panels use a 30px radius, principal media uses 28px, project cards use 22px around the image only, and compact controls use the full pill radius. Thin rules keep the rounded system precise rather than soft or playful.

**The Radius Hierarchy Rule.** Larger evidence containers receive larger radii; pills belong to actions, search, filters, and compact navigation, not long-form content.

## Components

### Buttons

- **Shape:** Full pill with a 50px minimum height; the final contact action grows to 66px on desktop.
- **Primary:** Launch Moss with white DM Sans text and 25px horizontal padding.
- **Hover / Focus:** Shift to Deep Moss and rise 2px over 180ms; keyboard focus uses a 3px translucent moss outline offset by 4px.
- **Text action:** Ink text without a container; the directional arrow moves 3px diagonally on hover.

### Chips

- **Style:** Transparent or Pale Sage pill with a fine moss border, compact tracked DM Sans, and 9px × 13px padding.
- **State:** Research tags are descriptive; filter chips add Pale Sage fill only when hovered or selected.

### Cards / Containers

- **Corner Style:** 30px research panels, 28px primary media, and 22px project media.
- **Background:** Paper White, Pale Sage, or the implemented pale research panel (`#f0f3e7`).
- **Shadow Strategy:** Project cards have no resting shadow; media zoom and arrow motion communicate destination.
- **Border:** One-pixel Measured Rule separates tabs, methods, names, and archive controls.
- **Internal Padding:** 27–28px for tabs and method cells; fluid 34–68px for research panels.

### Inputs / Fields

- **Style:** Search sits inside a lightly filled pill with a one-pixel Measured Rule border and an 11px icon gap.
- **Focus:** Preserve the shared 3px moss outline; the input itself remains borderless.
- **Placeholder:** Quiet Record at readable opacity.

### Navigation

The initial desktop header is 96px tall with centred links and a moss contact pill. After scrolling, it condenses into a 530px by 60px floating navigation pill with a blurred paper background and subtle shadow. At 900px, a circular 44px menu control opens a ruled white list with 56px rows and a full-width moss contact action.

### Research Selector

Three ruled tabs lead into one rounded Pale Sage-adjacent panel. The active tab uses Pale Sage and Editorial Ink; the panel pairs a large serif lead with a structured definition list. Arrow-key navigation, visible focus, and the 320ms reduced-motion-aware panel transition are part of the component.

### Project Card

Project records use a rounded 4:3 documentary image, moss category label, serif title, and quiet destination row. Cards remain shadowless; hover scales only the image to 1.035 and moves the arrow 3px diagonally.

### Project Viewer

The standalone viewer uses a 28px white media panel on Viewer Paper, a moss category pill, a Crimson Text title, and primary/secondary action pills. Its stronger ambient shadow is acceptable because the panel is the single focused object on that page.

## Do's and Don'ts

### Do:

- **Do** let monumental serif statements and paper-white space establish confidence.
- **Do** use moss for purposeful action and Pale Sage for selected or explanatory states.
- **Do** frame real people, program footage, and project media with the documented radius hierarchy.
- **Do** preserve thin ruled grids, visible focus, 44px or larger targets, and reduced-motion behavior.
- **Do** keep the supplied AESIR wordmark on its original white rectangular background.

### Don't:

- **Don't** reintroduce meteor, particle, starfield, canvas, or decorative WebGL effects.
- **Don't** make expanded research content dark or detach it from the selector.
- **Don't** substitute gradients, glass cards, or generic technology-dashboard styling for the paper-led editorial world.
- **Don't** shadow every rounded container or lift static evidence.
- **Don't** fabricate awards, publications, people, or outcomes to strengthen a layout.
