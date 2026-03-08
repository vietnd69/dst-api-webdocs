---
id: image
title: Image
description: Renders a textured image widget within the UI system, supporting multiple texture states, tinting, scaling, and interaction callbacks.
tags: [ui, widget, rendering]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: a606272a
system_scope: ui
---

# Image

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Image` is a UI widget component that renders a textured image using an atlas and texture name. It extends the base `Widget` class and provides functionality for switching textures on mouseover/disabled states, setting tints, controlling alpha, and managing layout via scaling and sizing. It interacts directly with the `ImageWidget` component attached to its entity to handle low-level rendering and resource management.

## Usage example
```lua
local image = Image("images/ui.xml", "button_normal.tex")
image:SetSize(64, 64)
image:SetTint(1, 1, 1, 0.8)
image:SetMouseOverTexture("images/ui.xml", "button_hover.tex")
image:SetDisabledTexture("images/ui.xml", "button_gray.tex")
mywidget:AddChild(image)
```

## Dependencies & tags
**Components used:** `ImageWidget`, `UITransform`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `atlas` | string or nil | `nil` | Resolved filepath of the UI atlas (e.g., `"images/ui.xml"`). |
| `texture` | string or nil | `nil` | Name of the texture file within the atlas (e.g., `"button_normal.tex"`). |
| `mouseovertex` | string or nil | `nil` | Optional texture used when mouse is hovering over the image. |
| `disabledtex` | string or nil | `nil` | Optional texture used when the widget is disabled. |
| `tint` | table | `{1,1,1,1}` | RGBA color multiplier applied to the rendered image. |
| `region_preview` | Image or nil | `nil` | Internal debug overlay used in editor/debug UI. |
| `can_fade_alpha` | boolean | Inferred from base Widget | Controls whether alpha fading is allowed. |

## Main functions
### `SetTexture(atlas, tex, default_tex)`
*   **Description:** Sets the primary texture of the image. Automatically resolves `atlas` path and updates the underlying `ImageWidget`. Triggers `UITransform` update as sizing may change.
*   **Parameters:**  
    `atlas` (string) — Path to the UI atlas file (e.g., `"images/ui.xml"`).  
    `tex` (string) — Texture name within the atlas (e.g., `"button_normal.tex"`).  
    `default_tex` (string, optional) — Fallback texture (logging warnings may occur).
*   **Returns:** Nothing.
*   **Error states:** Asserts if `atlas` or `tex` is `nil`. Does *not* gracefully handle invalid atlas/texture names — debug only.

### `SetMouseOverTexture(atlas, tex)`
*   **Description:** Sets the texture to display when the mouse hovers over the image. Used in combination with `OnMouseOver`/`OnMouseOut` handlers.
*   **Parameters:**  
    `atlas` (string) — UI atlas path.  
    `tex` (string) — Mouse-over texture name.
*   **Returns:** Nothing.

### `SetDisabledTexture(atlas, tex)`
*   **Description:** Sets the texture to display when the widget is disabled. Used in `OnDisable`.
*   **Parameters:**  
    `atlas` (string) — UI atlas path.  
    `tex` (string) — Disabled-state texture name.
*   **Returns:** Nothing.

### `SetSize(w, h)`
*   **Description:** Sets the widget's internal size, passed through to `ImageWidget`. Accepts numeric arguments or a table `{w, h}`.
*   **Parameters:**  
    `w` (number or table) — Width (if table, expects `{w, h}`).  
    `h` (number, optional) — Height (used only if `w` is a number).
*   **Returns:** Nothing.

### `GetSize()`
*   **Description:** Retrieves the current internal size of the image widget.
*   **Parameters:** None.
*   **Returns:** `w` (number), `h` (number) — Current width and height.

### `GetScaledSize()`
*   **Description:** Computes the total effective size, accounting for local scale and all parent scales.
*   **Parameters:** None.
*   **Returns:** `scaled_w`, `scaled_h` (numbers) — Size multiplied by all inherited scaling.

### `ScaleToSize(w, h)`
*   **Description:** Adjusts the widget's scale so its rendered size matches the target dimensions, relative to its *current* size and parent scale.
*   **Parameters:**  
    `w` (number) — Target width in pixels.  
    `h` (number) — Target height in pixels.
*   **Returns:** Nothing.

### `ScaleToSizeIgnoreParent(w, h)`
*   **Description:** Like `ScaleToSize`, but adjusts scale *ignoring* parent scaling. Useful for absolute sizing in nested layouts.
*   **Parameters:** Same as `ScaleToSize`.
*   **Returns:** Nothing.

### `SetTint(r, g, b, a)`
*   **Description:** Sets the RGBA tint color multiplier. Stored in `self.tint` and applied via `ImageWidget`.
*   **Parameters:**  
    `r`, `g`, `b`, `a` (numbers) — Color components (0–1 range).
*   **Returns:** Nothing.

### `SetFadeAlpha(a, skipChildren)`
*   **Description:** Applies a multiplicative alpha factor (e.g., for fading in/out). Only works if `can_fade_alpha` is `true`.
*   **Parameters:**  
    `a` (number) — Alpha multiplier (e.g., `0.5` for half-opacity).  
    `skipChildren` (boolean) — Whether to skip propagating to child widgets.
*   **Returns:** Nothing.

### `SetEffect(filename)`
*   **Description:** Applies a shader effect (`.ksh` file) to the image. Includes special handling for `"shaders/ui_cc.ksh"`.
*   **Parameters:**  
    `filename` (string) — Path to the shader effect file (e.g., `"shaders/ui_cc.ksh"`).
*   **Returns:** Nothing.

### `SetEffectParams(...)`, `SetEffectParams2(...)`
*   **Description:** Passes up to four floating-point parameters to the currently applied shader effect or effect variant.
*   **Parameters:** `param1`–`param4` (numbers).
*   **Returns:** Nothing.

### `EnableEffectParams(enabled)`, `EnableEffectParams2(enabled)`
*   **Description:** Enables or disables the effect parameter sets.
*   **Parameters:** `enabled` (boolean).
*   **Returns:** Nothing.

### `SetUVScale(xScale, yScale)`
*   **Description:** Scales the UV coordinates used to sample the texture.
*   **Parameters:**  
    `xScale`, `yScale` (numbers) — UV scale factors.
*   **Returns:** Nothing.

### `SetUVMode(uvmode)`
*   **Description:** Sets how UV coordinates are handled (e.g., normal, sliced, etc.).
*   **Parameters:** `uvmode` (string or enum) — UV mode identifier.
*   **Returns:** Nothing.

### `SetBlendMode(mode)`
*   **Description:** Sets the blending mode for the image (e.g., `"alpha"`, `"add"`, `"premultiplied"`).
*   **Parameters:** `mode` (string) — Blend mode string.
*   **Returns:** Nothing.

### `SetRadiusForRayTraces(radius)`
*   **Description:** Sets the radius for mouse/raycast hit detection.
*   **Parameters:** `radius` (number).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onmouseoverself`, `onmouseoutself`, `onenable`, `ondisable` (inherited via base `Widget` and overridden in `OnMouseOver`, `OnMouseOut`, `OnEnable`, `OnDisable`).
- **Pushes:** No events directly. Interactions are handled via state changes and callbacks.