---
id: text
title: Text
description: Renders and manages displayable text widgets with dynamic sizing, truncation, alignment, and multiline support for UI elements.
tags: [ui, text, rendering]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: fe261e63
system_scope: ui
---

# Text

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Text` is a UI widget component that renders text on-screen using the `TextWidget` system. It extends `Widget` and provides methods for setting string content, font, size, colour, alignment, word wrapping, and intelligent truncation—including support for multiline text with automatic shrinking. It is primarily used in frontend menus and UI overlays, and includes built-in debug UI integration via `DebugDraw_AddSection`. The component does not directly interact with game-world logic but is foundational for any screen-based UI.

## Usage example
```lua
local Text = require "widgets/text"
local text_widget = Entity():AddChild("text_widget")
text_widget:AddComponent("text")
text_widget.components.text:SetString("Hello, world!")
text_widget.components.text:SetFont("fonts/fontname.fnt")
text_widget.components.text:SetSize(24)
text_widget.components.text:SetHAlign("LEFT")
text_widget.components.text:SetVAlign("TOP")
```

## Dependencies & tags
**Components used:** `TextWidget` (via `self.inst.TextWidget`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `font` | string | `nil` | Font identifier (`.fnt` path). Set via `SetFont`. |
| `size` | number | `nil` | Font size in pixels. Set via `SetSize`. |
| `colour` | table | `{1, 1, 1, 1}` | RGBA colour table. Set via `SetColour`. |
| `string` | string | `""` | Internal text content. Set via `SetString`. |
| `original_size` | number? | `nil` | Stored original size for shrinking logic in autosize/multiline modes. |
| `target_font_size` | number? | `nil` | Font size used when autosizing. |

## Main functions
### `SetString(str)`
* **Description:** Sets the displayed text string. Accepts `nil`, which defaults to an empty string.
* **Parameters:** `str` (string?) - the text to display.
* **Returns:** Nothing.

### `GetString()`
* **Description:** Returns the currently displayed text string.
* **Parameters:** None.
* **Returns:** string — non-`nil` string; guaranteed to be at least `""`.

### `SetFont(font)`
* **Description:** Sets the font file path. Updates internal `self.font`.
* **Parameters:** `font` (string) — path to `.fnt` font file.
* **Returns:** Nothing.

### `SetSize(sz)`
* **Description:** Sets the font size. Applies localisation scaling if `LOC` is available.
* **Parameters:** `sz` (number) — font size in pixels.
* **Returns:** Nothing.

### `GetSize()`
* **Description:** Returns the currently set font size.
* **Parameters:** None.
* **Returns:** number — font size.

### `SetColour(r, g, b, a)`
* **Description:** Sets the text colour. Accepts either four numbers (`r,g,b,a`) or a table `{r,g,b,a}`.
* **Parameters:** `r` (number|table) — red component or colour table; `g,b,a` (numbers, optional if `r` is table) — components in `[0,1]`.
* **Returns:** Nothing.
* **Error states:** `a` (alpha) defaults to `1` if omitted in table form.

### `SetRegionSize(w, h)`
* **Description:** Explicitly sets the layout region size for text measurement.
* **Parameters:** `w` (number), `h` (number) — width and height in pixels.
* **Returns:** Nothing.

### `GetRegionSize()`
* **Description:** Returns the current width and height of the text region.
* **Parameters:** None.
* **Returns:** number, number — width and height.

### `ResetRegionSize()`
* **Description:** Resets the region size to automatic calculation (e.g., based on content).
* **Parameters:** None.
* **Returns:** Nothing.

### `SetTruncatedString(str, maxwidth, maxchars, ellipses)`
* **Description:** Truncates text to fit within a maximum width and/or character count, appending an ellipsis (`...` by default). **Not optimized**—intended for FE menus only.
* **Parameters:**  
  `str` (string?) — source string; `maxwidth` (number?) — max region width (optional); `maxchars` (number?) — max UTF-8 characters (optional); `ellipses` (string|nil) — replacement string for truncation (defaults to `"..."` if truthy, `""` if `nil`/`false`).
* **Returns:** boolean — `true` if no truncation occurred, `false` otherwise.
* **Error states:** Using this function with `SetRegionSize` causes infinite recursion. Do not combine.

### `SetMultilineTruncatedString(str, maxlines, maxwidth, maxcharsperline, ellipses, shrink_to_fit, min_shrink_font_size, linebreak_string)`
* **Description:** Renders multiline truncated text, optionally shrinking font size to fit within bounds. Handles word wrapping and linebreak detection.
* **Parameters:**  
  `str` (string?) — source string;  
  `maxlines` (number) — maximum number of lines;  
  `maxwidth` (number|table) — max width per line; if table, widths apply per-line recursively;  
  `maxcharsperline` (number?) — max UTF-8 chars per line;  
  `ellipses` (string?) — truncation suffix;  
  `shrink_to_fit` (boolean) — whether to reduce font size if content overflows;  
  `min_shrink_font_size` (number?) — minimum font size (default `16`);  
  `linebreak_string` (string?) — custom substring to treat as linebreak (e.g., `"\n"`).
* **Returns:** number — number of lines rendered.
* **Error states:** Shrink loop aborts at `min_shrink_font_size` to prevent infinite recursion.

### `SetAutoSizingString(str, max_width, allow_scaling_up)`
* **Description:** Auto-sizes the font to fit the string within `max_width`. **Deprecated**—use `SetMultilineTruncatedString` instead.
* **Parameters:**  
  `str` (string) — text to set;  
  `max_width` (number) — target width;  
  `allow_scaling_up` (boolean) — whether to scale up if narrower than original.
* **Returns:** Nothing.

### `RemoveAutoSizing()`
* **Description:** Restores the font size to the pre-auto-sizing value (`self.target_font_size`). Clears `self.target_font_size`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetHAlign(anchor)`
* **Description:** Sets horizontal text alignment.
* **Parameters:** `anchor` (string) — alignment mode (e.g., `"LEFT"`, `"CENTER"`, `"RIGHT"`).
* **Returns:** Nothing.

### `SetVAlign(anchor)`
* **Description:** Sets vertical text alignment.
* **Parameters:** `anchor` (string) — alignment mode (e.g., `"TOP"`, `"MIDDLE"`, `"BOTTOM"`).
* **Returns:** Nothing.

### `EnableWordWrap(enable)`
* **Description:** Enables or disables word wrapping.
* **Parameters:** `enable` (boolean).
* **Returns:** Nothing.

### `EnableWhitespaceWrap(enable)`
* **Description:** Enables or disables wrapping on whitespace (independent of word wrap).
* **Parameters:** `enable` (boolean).
* **Returns:** Nothing.

### `UpdateAlpha(a)`
* **Description:** Updates the alpha component of `self.colour` and applies it directly to the widget. Preserves original colour.
* **Parameters:** `a` (number) — alpha in `[0,1]`.
* **Returns:** Nothing.

### `SetAlpha(a)`
* **Description:** Overrides all colour components except alpha, setting text to white with the given alpha.
* **Parameters:** `a` (number) — alpha in `[0,1]`.
* **Returns:** Nothing.

### `SetFadeAlpha(a, skipChildren)`
* **Description:** Applies multiplicative alpha fading if `self.can_fade_alpha` is true. Maintains base colour.
* **Parameters:** `a` (number) — fade factor in `[0,1]`; `skipChildren` (boolean) — ignored (stubbed).
* **Returns:** Nothing.

### `UpdateOriginalSize()`
* **Description:** Records the current `self.size` into `self.original_size` for later font-shrinking restoration.
* **Parameters:** None.
* **Returns:** Nothing.

### `DebugDraw_AddSection(dbui, panel)`
* **Description:** Adds debug UI controls for modifying text properties at runtime.
* **Parameters:** `dbui` (object) — debug UI interface; `panel` (object) — debug panel node.
* **Returns:** Nothing.

## Events & listeners
None.