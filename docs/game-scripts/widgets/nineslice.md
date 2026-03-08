---
id: nineslice
title: Nineslice
description: A UI widget that renders a scalable nine-sliced image by arranging nine sub-elements around a central content area.
tags: [ui, rendering]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 9e72d551
system_scope: ui
---

# Nineslice

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`NineSlice` is a UI widget that implements nine-slice scaling, a technique used to scale rectangular textures (such as buttons or panels) without distorting corners and edges. It creates eight surrounding sub-elements arranged around a central `mid_center` element, which acts as the reference for sizing and alignment. This component extends `Widget` and is intended for client-side UI rendering only.

## Usage example
```lua
local nineslice = TheWidgetManager:AddChild(NineSlice("images/myatlas.xml",
    "topleft.tex", "top.tex", "topright.tex",
    "left.tex", "center.tex", "right.tex",
    "bottomleft.tex", "bottom.tex", "bottomright.tex"))

nineslice:SetSize(200, 100)
nineslice:SetTint(1, 1, 1, 0.8)
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `atlas` | string or `nil` | `nil` | Texture atlas used for all sub-elements. |
| `mid_center` | Image or Widget | `nil` | Central element used as the sizing and alignment anchor. |
| `elements` | table of Image | `{}` | Array of all eight surrounding sub-elements (corners, edges, and center edges). |

## Main functions
### `SetSize(w, h)`
*   **Description:** Sets the size of the nine-slice widget by resizing and repositioning all sub-elements relative to the `mid_center` element.
*   **Parameters:**  
    - `w` (number) — width in pixels.  
    - `h` (number) — height in pixels.  
*   **Returns:** Nothing.

### `SetScale(w, h)`
*   **Description:** Applies scaling to all sub-elements without changing their actual size, useful for zooming or resolution adjustments.
*   **Parameters:**  
    - `w` (number) — horizontal scale factor.  
    - `h` (number) — vertical scale factor.  
*   **Returns:** Nothing.

### `AddCrown(image, hanchor, vanchor, offsetX, offsetY)`
*   **Description:** Adds a new image element (a "crown") at the specified anchor point, which is appended to the internal `elements` array and will scale/position with the widget.
*   **Parameters:**  
    - `image` (string) — texture name within the atlas.  
    - `hanchor` (number) — horizontal anchor constant (e.g., `ANCHOR_LEFT`).  
    - `vanchor` (number) — vertical anchor constant (e.g., `ANCHOR_TOP`).  
    - `offsetX` (number, optional) — horizontal offset in pixels. Default: `0`.  
    - `offsetY` (number, optional) — vertical offset in pixels. Default: `0`.  
*   **Returns:** The created `Image` instance.

### `AddTail(image, hanchor, vanchor, offsetX, offsetY)`
*   **Description:** Adds a special "tail" image element, stored separately as `self.tail` but also added to `self.elements`.
*   **Parameters:** Same as `AddCrown`.
*   **Returns:** The created `Image` instance.

### `UpdateTail(hanchor, vanchor, offsetX, offsetY)`
*   **Description:** Updates the positioning and anchor of the `tail` element, useful for dynamic repositioning after creation.
*   **Parameters:** Same as `AddCrown`.
*   **Returns:** Nothing.

### `SetTint(r, g, b, a)`
*   **Description:** Applies a color tint to the entire nine-slice, affecting both `mid_center` and all elements in `self.elements`.
*   **Parameters:**  
    - `r` (number) — red component (0–1).  
    - `g` (number) — green component (0–1).  
    - `b` (number) — blue component (0–1).  
    - `a` (number) — alpha (opacity) component (0–1).  
*   **Returns:** Nothing.

### `GetSize()`
*   **Description:** Returns the current size of the widget, as defined by `mid_center`.
*   **Parameters:** None.
*   **Returns:**  
    - `w` (number) — current width.  
    - `h` (number) — current height.

### `DebugDraw_AddSection(dbui, panel)`
*   **Description:** Adds debug UI controls for editing the widget size interactively during development.
*   **Parameters:**  
    - `dbui` (DebugUI instance) — UI builder interface.  
    - `panel` (Panel) — parent debug panel.  
*   **Returns:** Nothing.

## Events & listeners
None identified.