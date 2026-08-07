---
name: AESIR Research
description: A clinical innovation atlas for evidence-led immersive intelligence.
colors:
  primary: "#2f637d"
  primary-deep: "#224a60"
  ink: "#182832"
  ink-soft: "#4c606d"
  steel: "#566d7c"
  mist: "#edf3f5"
  wash: "#f6f8f9"
  line: "#d6e0e4"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(3.35rem, 6.7vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.94
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Archivo, sans-serif"
    fontSize: "clamp(2.65rem, 5vw, 4.9rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Archivo, sans-serif"
    fontSize: "1.46rem"
    fontWeight: 650
    lineHeight: 1.12
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
rounded:
  none: "0"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "18px"
  lg: "24px"
  xl: "32px"
  section: "132px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "12px 18px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
  research-panel:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "clamp(32px, 5vw, 76px)"
  research-tag:
    backgroundColor: "rgba(255, 255, 255, 0.56)"
    textColor: "{colors.primary-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "8px 11px"
---

# Design System: AESIR Research

## Overview

**Creative North Star: "The Clinical Innovation Atlas"**

AESIR should feel like a precise, public-facing research atlas: rigorous enough for investors and institutions, but understandable to readers outside a laboratory. White space, documentary photography, structured rules, and restrained steel-blue surfaces make the work feel evidenced rather than advertised.

The visual system is editorial, image-forward, and deliberately calm. Large Archivo headlines establish conviction; Source Sans 3 carries dense research content with clarity. Light panels preserve continuity across long-form reading, while the single deep-blue method section marks the shift from research premise to execution process.

**Key Characteristics:**

- White-led and evidence-first.
- Large editorial typography with compact institutional labels.
- Real people, programs, and project media as proof.
- Square, ruled surfaces with rare pill-shaped research tags.
- Interaction feedback only on controls and media that can actually be opened.

## Colors

The palette combines clinical white, cool research-paper neutrals, and a restrained steel-blue accent.

### Primary

- **Applied Intelligence Blue:** Used for interactive emphasis, active research states, and secondary action feedback.
- **Deep Research Blue:** Used for authoritative headings, the method section, and high-contrast institutional moments.

### Neutral

- **Evidence Ink:** Primary text and dark actions.
- **Soft Record Ink:** Long-form supporting copy.
- **Institutional Steel:** Logo-adjacent and secondary identity tone.
- **Research Mist:** Active tabs, expanded research panels, and evidence statements.
- **Archive Wash:** Quiet section differentiation and card hover surfaces.
- **Measured Rule:** Dividers, grid boundaries, and form strokes.
- **Paper White:** The dominant page and card surface.

**The White-Led Rule.** Paper White remains the dominant field; blue surfaces are reserved for evidence hierarchy and action, never ambient decoration.

**The Light Panel Rule.** Expanded research content uses Research Mist or a neighboring light neutral, never a dark interruption.

## Typography

**Display Font:** Archivo (with sans-serif fallback)
**Body Font:** Source Sans 3 (with system sans-serif fallbacks)

**Character:** Archivo supplies compact, technical confidence without becoming futuristic. Source Sans 3 keeps research explanations, labels, and archive metadata readable at high density.

### Hierarchy

- **Display** (700, fluid 3.35rem to 6rem, 0.94): Hero statement only; tightly tracked and balanced.
- **Headline** (700, fluid 2.65rem to 4.9rem, 0.98): Major section theses and contact statement.
- **Title** (650, 1.46rem, 1.12): Research, project, and leadership titles.
- **Body** (400, 1rem, 1.65): Explanations and evidence copy, generally constrained to readable measures.
- **Label** (700, 0.75rem, 1.4): Navigation, categories, proof statements, and metadata.

**The Two-Voice Rule.** Archivo speaks for claims and structure; Source Sans 3 explains, labels, and records evidence.

## Layout

Primary content sits inside a fluid shell capped at 1320px, while the header and hero can reach 1420px. Desktop compositions use asymmetric two-column grids; evidence libraries use three columns, collapsing to two below 1100px and one below 560px. Section rhythm is generous at 132px on desktop and 92px on small screens.

The 820px breakpoint converts the hero and editorial splits to a single reading column, stacks research tabs, and keeps the light panel full-width. The 560px breakpoint uses a 24px page gutter, full-width primary actions, one-column projects, and horizontally scrollable archive media. Sticky navigation remains compact and never covers the hero headline.

**The Atlas Grid Rule.** Grids use shared borders and aligned rules so separate items read as one research record, not a collection of floating tiles.

## Elevation & Depth

The system is flat by default. Depth comes from tonal layering, ruled boundaries, image cropping, and one soft institutional shadow on the hero image or temporary mobile navigation. Clickable project cards may lift four pixels with a soft shadow; static containers do not.

### Shadow Vocabulary

- **Institutional image depth** (`0 24px 70px rgba(39, 62, 74, 0.13)`): Hero imagery and temporary navigation overlays.
- **Interactive card lift** (`0 18px 38px rgba(42, 65, 78, 0.12)`): Project-card hover only.

**The Flat-Until-Action Rule.** Static evidence stays flat. Elevation signals an available action or a temporary overlay.

## Shapes

Major surfaces, buttons, media frames, tabs, and cards use square corners. This keeps the visual language documentary and architectural. Pill geometry is limited to small research-topic tags; it must not spread to primary actions or large containers.

## Components

### Buttons

- **Shape:** Square, compact, and institutional.
- **Primary:** Evidence Ink with Paper White text, 44px minimum height, and 12px by 18px padding.
- **Hover / Focus:** Shift to Applied Intelligence Blue and lift two pixels; keyboard focus uses a clear blue outline.
- **Text action:** Underlined by a one-pixel rule and paired with a small directional arrow.

### Chips

- **Style:** Light translucent paper, a cool one-pixel stroke, and pill shape.
- **State:** Descriptive research tags only; category filters remain rectangular action controls.

### Cards / Containers

- **Corner Style:** Square.
- **Background:** Paper White at rest; Archive Wash on clickable project hover.
- **Shadow Strategy:** Flat at rest, interactive lift only.
- **Border:** Shared one-pixel Measured Rule grid.
- **Internal Padding:** 24px for project cards; 32px to 76px for research panels.

### Inputs / Fields

- **Style:** Borderless field on white with a single cool bottom rule.
- **Focus:** The global three-pixel blue focus outline remains visible.
- **Placeholder:** Muted but readable Soft Record Ink.

### Navigation

Desktop navigation is centered, compact, and label-led. Hover uses Research Mist without lift. Below 1100px it becomes a bordered white menu opened by a square icon control; each destination remains at least 48px high.

### Research Panel

Three square tabs control one spacious light panel. The selected tab shifts to Research Mist and Deep Research Blue; the panel uses a two-column lead/detail layout on desktop and a single reading column on mobile. Keyboard arrow navigation and reduced-motion behavior are required.

### Project Card

Project cards are links with a 16:10 media frame, category label, editorial title, and ruled footer. Only these actionable archive items lift and scale their image slightly on hover.

## Do's and Don'ts

### Do:

- **Do** lead with white space, large research claims, and verifiable documentary media.
- **Do** use light tonal changes and one-pixel rules to organise dense evidence.
- **Do** preserve keyboard focus, reduced-motion handling, and 44px or larger action targets.
- **Do** reserve lift, glow, and state changes for controls or media that open something.
- **Do** keep the supplied AESIR wordmark on its original white rectangular background.

### Don't:

- **Don't** reintroduce meteor, particle, starfield, canvas, or decorative WebGL backgrounds.
- **Don't** make expanded research panels dark.
- **Don't** turn the site into a generic gradient-heavy technology landing page.
- **Don't** apply hover elevation to non-interactive boxes, labels, or evidence rows.
- **Don't** fabricate publications, awards, people, or outcome metrics to fill a visual gap.
