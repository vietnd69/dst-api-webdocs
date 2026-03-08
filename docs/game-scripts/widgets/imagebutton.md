---
id: imagebutton
title: ImageButton
description: A UI widget that displays an image and responds to user interaction states such as focus, press, disable, and selection, with support for per-state texture and color customization.
tags: [ui, widget, input]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 6bb90c36
system_scope: ui
---

# ImageButton

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ImageButton` is a UI widget that extends the base `Button` class to display an image instead of plain text. It manages multiple visual states (normal, focused, pressed/down, disabled, selected) by switching textures, scales, and tint colors based on input and state. It is commonly used for interactive HUD elements where visual feedback is important, such as menu buttons or controls that must remain focusable even when "selected" (e.g., to enable controller navigation without fully disabling the widget).

## Usage example
```lua
local ImageButton = require "widgets/imagebutton"

local btn = ImageButton("images/frontend.xml", "button_long.tex", "button_long_halfshadow.tex")
btn:SetPosition(0, 0)
btn.onclick = function() print("Button clicked!") end
btn:SetFocusSound("dontstarve/HUD/click_move")
stage:AddChild(btn)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** Inherits from `Button`; no tags added or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `image` | `Image` widget | `nil` (initialized in constructor) | Child `Image` widget used to render the button texture. |
| `hover_overlay` | `Image` widget | `nil` | Optional overlay image shown during focus (used for gamepad focus visibility across states). |
| `atlas` | string | `"images/frontend.xml"` | Texture atlas path used for all image states. |
| `image_normal`, `image_focus`, `image_disabled`, `image_down`, `image_selected` | string | `"button_long.tex"` etc. | Texture names for each button state. |
| `has_image_down` | boolean | `false` | Whether a distinct "down" (pressed) texture is provided. |
| `image_scale` | `{x, y}` | `{1, 1}` | Base scale applied to the image. |
| `image_offset` | `{x, y}` | `{0, 0}` | Position offset of the image relative to the button. |
| `scale_on_focus` | boolean | `true` | Whether the image should scale when focused. |
| `move_on_click` | boolean | `true` | Whether the button should shift position slightly on press. |
| `focus_scale` | `{x, y, z}` | `{1.2, 1.2, 1.2}` | Scale applied during focus state. |
| `normal_scale` | `{x, y, z}` | `{1, 1, 1}` | Scale applied in normal state. |
| `focus_sound` | string | `nil` | Sound to play when focus is gained. |
| `imagenormalcolour`, `imagefocuscolour`, `imagedisabledcolour`, `imageselectedcolour` | `{r, g, b, a}` | `{0,0,0,0}` or `nil` | RGBA tint for each state's image. |
| `size_x`, `size_y` | number | `nil` | Fixed size applied via `ForceImageSize`. |
| `ignore_standard_scaling` | boolean | `nil` | If `true`, prevents automatic scaling during focus changes. |

## Main functions
### `SetTextures(atlas, normal, focus, disabled, down, selected, image_scale, image_offset)`
* **Description:** Configures texture assets and scaling/offset for all button states. If no arguments are provided, defaults to standard frontend button textures.
* **Parameters:**
  * `atlas` (string) — Texture atlas file path.
  * `normal`, `focus`, `disabled`, `down`, `selected` (string) — Texture names for each state. Omitted values fall back to defaults or adjacent states.
  * `image_scale`, `image_offset` (table or numbers) — Custom scale and offset; if provided as numbers, they are converted to `{x, y, z}` format.
* **Returns:** Nothing.
* **Error states:** None.

### `ForceImageSize(x, y)`
* **Description:** Locks the image to a specific size and resizes it accordingly.
* **Parameters:**
  * `x` (number) — Target width.
  * `y` (number) — Target height.
* **Returns:** Nothing.

### `UseFocusOverlay(focus_selected_texture)`
* **Description:** Adds a focus overlay image that is visible even when the button is selected or disabled—important for controller navigation consistency.
* **Parameters:**
  * `focus_selected_texture` (string) — Texture name for the overlay (e.g., `"button_long_halfshadow.tex"`).
* **Returns:** Nothing.

### `OnGainFocus()`
* **Description:** Applies visual changes when the button gains focus: swaps texture, applies focus scale/tint, and plays `focus_sound` if defined. The `hover_overlay` is shown if created.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if button is selected or disabled (no scale/tint change).

### `OnLoseFocus()`
* **Description:** Reverts to normal state visuals when focus is lost: swaps back to normal texture, normal scale, and normal tint.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `OnDisable()`
* **Description:** Applies the disabled texture and tint when the button is disabled (unless selected).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSelect()`
* **Description:** Applies the selected texture and tint. Unlike disabled, selected buttons remain focusable (required for navigation).
* **Parameters:** None.
* **Returns:** Nothing.

### `SetFocusScale(scaleX, scaleY, scaleZ)`
* **Description:** Updates the scale used during focus state. Supports both `{x, y, z}` table or separate number arguments.
* **Parameters:**
  * `scaleX`, `scaleY`, `scaleZ` (number or table) — New focus scale.
* **Returns:** Nothing.

### `SetNormalScale(scaleX, scaleY, scaleZ)`
* **Description:** Updates the scale used during normal state. Supports both `{x, y, z}` table or separate number arguments.
* **Parameters:**
  * `scaleX`, `scaleY`, `scaleZ` (number or table) — New normal scale.
* **Returns:** Nothing.

### `SetImageNormalColour(r, g, b, a)`
* **Description:** Sets the tint for the normal state. Supports `{r,g,b,a}` table or individual number arguments.
* **Parameters:**
  * `r`, `g`, `b`, `a` (number or table) — RGBA values (0.0–1.0 range).
* **Returns:** Nothing.

### `SetImageFocusColour(r, g, b, a)`
* **Description:** Sets the tint for the focused state.
* **Parameters:** Same as `SetImageNormalColour`.
* **Returns:** Nothing.

### `SetImageDisabledColour(r, g, b, a)`
* **Description:** Sets the tint for the disabled state.
* **Parameters:** Same as `SetImageNormalColour`.
* **Returns:** Nothing.

### `SetImageSelectedColour(r, g, b, a)`
* **Description:** Sets the tint for the selected state.
* **Parameters:** Same as `SetImageNormalColour`.
* **Returns:** Nothing.

### `SetFocusSound(sound)`
* **Description:** Sets the sound to play when focus is gained.
* **Parameters:**
  * `sound` (string) — Sound bank path (e.g., `"dontstarve/HUD/click_move"`).
* **Returns:** Nothing.

### `GetSize()`
* **Description:** Returns the current size of the underlying image.
* **Parameters:** None.
* **Returns:** `{width, height}` table.

### `DebugDraw_AddSection(dbui, panel)`
* **Description:** Adds color-editing controls for image tints in the debug UI.
* **Parameters:**
  * `dbui` (DebugUI instance) — Debug UI instance.
  * `panel` (table) — Panel handle.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input control events (e.g., keyboard/controller presses). Triggers `ondown`/`onclick` callbacks and manages the pressed ("down") texture.
* **Parameters:**
  * `control` (int) — Resolved control ID.
  * `down` (boolean) — Whether the control is pressed (`true`) or released (`false`).
* **Returns:** `true` if the control event was handled, otherwise `false`.
* **Error states:** Returns `false` early if button is disabled, not focused, or selected (and `AllowOnControlWhenSelected` is not set).

### `IsDisabledState()`
* **Description:** Helper indicating if the button is disabled (not enabled *and* not selected).
* **Parameters:** None.
* **Returns:** boolean.

### `IsFocusedState()`
* **Description:** Helper indicating if the button is currently focused, enabled, and not selected.
* **Parameters:** None.
* **Returns:** boolean.

### `IsNormalState()`
* **Description:** Helper indicating if the button is in the normal (enabled, not focused, not selected) state.
* **Parameters:** None.
* **Returns:** boolean.

### `_RefreshImageState()`
* **Description:** Internal method that updates the image to match the button's current logical state (selected, disabled, focused, or normal).
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None. (Relies on inherited `Button` input handling.)
- **Pushes:** None.