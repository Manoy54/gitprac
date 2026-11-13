---
name: FORME
description: Swiss Industrial Print for rental homes and their everyday operations.
colors:
  accent: "#c22117"
  action-bg: "#c22117"
  background: "#f4f4f0"
  foreground: "#1c1d19"
  line: "#d6d7cf"
  muted: "#6b6c63"
  surface: "#edeee7"
typography:
  display:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "clamp(46px, 5.15vw, 88px)"
    fontWeight: 850
    lineHeight: 0.94
    letterSpacing: "-0.065em"
  body:
    fontFamily: "Geist, Arial, sans-serif"
    fontSize: "14px"
  label:
    fontFamily: "Geist Mono, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.045em"
rounded:
  square: "0px"
spacing:
  control-x: "15px"
  content-x: "37px"
  mobile-content-x: "17px"
components:
  button-primary:
    backgroundColor: "{colors.action-bg}"
    textColor: "#fff"
    rounded: "{rounded.square}"
    padding: "0 15px"
  button-secondary:
    textColor: "{colors.foreground}"
    rounded: "{rounded.square}"
    padding: "0 15px"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.square}"
    padding: "11px"
  property-status:
    backgroundColor: "{colors.background}"
    rounded: "{rounded.square}"
    padding: "5px 7px"
---

# Design System: FORME

## Overview

**Creative North Star: "Swiss Industrial Print"**

FORME treats the workspace as a property register: off-white paper, carbon typography, visible rules, and a single red accent. Heavy display type establishes hierarchy; compact monospaced labels identify records, actions, and measurements. Architectural photographs add context within the grid.

The interface is flat, square, and deliberately dense on desktop. Manage and Explore share the same visual language; the workspace switch changes tasks without changing identity.

**Key Characteristics:**
- Heavy, tightly spaced headings paired with monospaced metadata.
- Hairline compartments, square controls, and restrained tonal surfaces.
- Red for primary actions, selected navigation, and attention.
- Muted architectural photography with readable property information below.

## Colors

A warm paper and carbon palette supports a controlled industrial red. The frontmatter records the reusable CSS primitives; component-specific neutral shades remain in the stylesheet.

### Primary

- **Industrial Red** (`accent`): primary buttons, active navigation, available-home markers, focus outlines, and small attention details. Keep the current darkened value: the reviewed active-navigation pairing reaches 4.76:1, and white button text reaches 5.96:1.

### Neutral

- **Paper** (`background`): page canvas, form fields, status labels, dialogs, and notices.
- **Carbon** (`foreground`): body text, major headings, and strong section rules.
- **Rule Grey** (`line`): compartment boundaries, cards, dividers, and control outlines.
- **Muted Olive Grey** (`muted`): supporting copy and metadata.
- **Surface Paper** (`surface`): subtle interaction surfaces, including icon-button hover.

### Dark mode

The header sun/moon toggle switches the entire interface using `data-theme` on the root element. The choice persists under `forme-theme` in local storage; without a saved choice, the interface follows the system preference. A script in the document head applies the theme before paint. Native inputs and scrollbars follow `color-scheme`.

Dark mode uses `#12140f` for the canvas, `#eeeee7` for text, `#a6ae9b` for supporting text, and `#353c2d` for rules. Component surfaces, fields, charts, status markers, and dialogs use semantic variables defined in `src/app/globals.css`. The text accent becomes `#ff8070` for contrast on dark surfaces. Primary button backgrounds retain the deeper `--action-bg: #c22117` and white labels; do not use the brighter dark text accent as a white-label button background.

**The One Accent Rule.** Use red to signal action or state; retain neutral surfaces for the surrounding information.

## Typography

Geist supplies display and body text; Geist Mono supplies metadata and control labels. Both load through `next/font` in the root layout, with Arial/sans-serif and monospace fallbacks respectively.

- **Display:** the frontmatter captures the desktop heading. Responsive overrides reduce it for narrower layouts; the smallest layout uses `clamp(48px, 12vw, 68px)`. Preserve the tight tracking and short lines.
- **Section titles:** compact bold Geist, typically (12px, weight 700), with a strong bottom rule.
- **Body:** base Geist (14px); supporting copy varies by component. Forms use (13px) inputs.
- **Labels:** the monospaced base is (10px), with contextual overrides, often (7–9px) in the dense desktop workspace. Do not apply these small metadata sizes to long prose.
- **Figures:** portfolio values use tabular numerals, tight tracking, and a larger scale than their labels.

## Layout

Desktop uses a fixed left sidebar (228px), a matching main-content offset, a ruled topbar (73px), and centered content capped at (1750px). Default content gutters are (37px). The overview combines a four-column statistics strip, three property columns, and an activity rail; this is the overview composition, not a requirement for every screen.

At (1250px) the sidebar narrows to (205px) and gutters reduce. At (1050px) the activity rail moves beneath the portfolio. At (780px) navigation becomes an off-canvas drawer with a scrim and the main offset disappears. At (580px) statistics become two columns, property cards become one column, toolbars wrap, and content gutters become (17px). Wide-screen refinements begin at (1500px).

Keep internal grids shrinkable with `minmax(0, 1fr)` and let controls wrap before they overflow. Preserve the visible rules between functional groups rather than nesting extra cards.

## Elevation & Depth

Surfaces have no box shadows. Borders, pale neutral fills, and whitespace establish separation. Dialogs use a carbon border and a translucent backdrop; mobile navigation uses a similar scrim. The small text shadow on photo record IDs serves legibility only.

Motion is restrained: controls transition color over (150ms), property images scale to (1.035) over (500ms), and notices enter over (200ms). The mobile drawer uses a (200ms) slide. Reduced-motion preferences disable animations and transitions.

## Shapes

Controls and containers have square corners. Hairline borders are generally (1px); small square markers, index labels, a stepped brand mark, and barcode/diagonal hatch details carry the industrial print language. Use these details sparingly within the established hierarchy.

## Components

### Buttons

Primary buttons use red with white monospaced labels, square edges, horizontal padding (15px), and a minimum height (39px). Hover darkens to `#a91b13`. Secondary buttons use a fine neutral border and a pale hover fill. Icon buttons have a minimum width and height (32px). Disabled controls reduce opacity to (0.5).

Keyboard focus is an accent outline (2px) offset by (4px). Preserve visible focus when adding variants.

### Inputs / Fields

Form fields use paper fill, square borders, padding (11px), and minimum height (43px). Labels use Geist Mono above the field. The toolbar search is intentionally lighter: it uses an unboxed input and an enclosing carbon outline on focus. Retain native validation and native select behavior.

### Navigation

The fixed sidebar contains the two-part Manage/Explore switch and task navigation. Selected navigation has red text, a muted neutral fill, and a red left marker. Hover adds a pale fill. The mode switch uses a neutral selected segment. Mobile retains these controls inside the drawer.

### Property Cards / Containers

Cards use a fine border and a pale paper fill, without elevation. Photos are cropped to fill, with saturation reduced to (0.58); hover enlarges the image within its clipped frame. Status sits at the top left, while record IDs or renter save controls occupy the opposing corner. Name, location, specifications, and monthly rent remain outside the photo.

Use local property photographs and keep provenance in `public/images/sources.json`. The reusable card also has a horizontal list variant; keep its data hierarchy aligned with the grid variant.

### Status Labels

Property status labels use a paper rectangle, monospaced uppercase text, and a small square marker. Available status uses the red accent. Keep the text label alongside color so status remains explicit.

### Dialogs and Notices

Native dialogs use a maximum width (590px), viewport-aware margins and height, a ruled heading, and padded form content. Notices are bordered paper rectangles at the lower right; on small screens they span the viewport with side margins. Preserve focus restoration and the notice status role.

## Do's and Don'ts

### Do:

- **Do** use the existing CSS primitives and shared property card and dialog components.
- **Do** keep heavy headings, compact mono labels, and visible rules in distinct roles.
- **Do** preserve keyboard focus, reduced-motion behavior, and explicit status text.
- **Do** keep photographs contextual and record their source.

### Don't:

- **Don't** introduce rounded cards, ambient shadows, or additional accent colors.
- **Don't** lighten the red without checking its text and button contrast pairings.
- **Don't** turn short metadata styling into the default for long-form text.
- **Don't** require the overview's three-column portfolio and rail on unrelated screens.
