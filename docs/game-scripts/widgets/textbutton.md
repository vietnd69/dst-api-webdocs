---
id: textbutton
title: Textbutton
description: A clickable UI widget that displays text and automatically resizes a transparent background image to match the text width and height.
tags: [ui, widget]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 416e7c6e
system_scope: ui
---

# Textbutton

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TextButton` is a UI widget class derived from `Button` that displays clickable text with an automatically sized transparent background image. It is intended for simple text-based buttons where an image is not required, though the documentation advises preferring `Button` or `ImageButton` for most use cases. Internally, it leverages the `Image` widget to manage the background region and dynamically resizes it to match the rendered text size.

## Usage example
```lua
local TextButton = require "widgets/textbutton"

local btn = TextButton("my_text_button")
btn:SetText("Click me")
btn:SetFont("images/calibrated_sans_bold font")
btn:SetTextSize(24)
btn:SetTextColour({0.5, 0.5, 0.5, 1})
```

## Dependencies & tags
**Components used:** `Button`, `Image`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `image` | `Image` | `Image("images/ui.xml", "blank.tex")` | Background image widget that is automatically resized to fit the text. |
| `text` | `Text` | (inherited) | The text display object managed via inherited `Button` methods. |

## Main functions
### `GetSize()`
*   **Description:** Returns the current size (width, height) of the button, based on the underlying image size.
*   **Parameters:** None.
*   **Returns:** `{width, height}` (table of numbers) — the width and height of the button.

### `SetText(msg)`
*   **Description:** Sets the displayed text and automatically resizes the background image to match the text's region size.
*   **Parameters:** `msg` (string) — the text to display.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `SetColour(r, g, b, a)`
*   **Description:** *Deprecated.* Alias for `SetTextColour`. Sets the default text colour.
*   **Parameters:** 
    *   `r`, `g`, `b`, `a` (numbers) — red, green, blue, and alpha components (0–1 range).
*   **Returns:** Nothing.

### `SetOverColour(r, g, b, a)`
*   **Description:** *Deprecated.* Alias for `SetTextFocusColour`. Sets the text colour when the button is focused or hovered.
*   **Parameters:** 
    *   `r`, `g`, `b`, `a` (numbers) — red, green, blue, and alpha components (0–1 range).
*   **Returns:** Nothing.

## Events & listeners
None identified.