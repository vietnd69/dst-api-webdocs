---
id: tilebg
title: Tilebg
description: Renders a horizontally or vertically tiled background with optional end caps and separators, used for UI panels and containers.
tags: [ui, rendering, layout]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 36c76806
system_scope: ui
---

# Tilebg

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`TileBG` is a UI widget that dynamically composes a tiled background strip using an atlas-based image system. It supports configurable tiling orientation (horizontal or vertical), optional end-cap images, and separator images between tiles. It calculates total dimensions and positions child `Image` widgets accordingly. This widget is typically used for designing scalable UI elements such as panels, headers, or progress bars where consistent edge treatment and internal spacing are required.

## Usage example
```lua
local tilebg = TileBG("images/ui.xml", "tile.tex", "sep.tex", "cap.tex", true)
tilebg:SetNumTiles(5)
-- Now tilebg is a 5-tile background with end caps and separators
local w, h = tilebg:GetSize()
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `atlas` | string | `nil` | The atlas file path used by all child `Image` widgets. |
| `tileim` | string | `nil` | The image filename for the main repeating tile. |
| `sepim` | string | `nil` | The image filename for separator tiles between main tiles. |
| `endim` | string | `nil` | The image filename for end-cap tiles (used on both sides). |
| `horizontal` | boolean | `nil` | Orientation flag: `true` for horizontal layout, `false` for vertical. |
| `numtiles` | number | `0` | Number of main tiles currently rendered. |
| `w`, `h` | number | `0` | Computed total width and height of the widget. |
| `slotpos` | table | `{}` | Maps slot index `k` to `Vector3` position of the *k*-th tile. |
| `stepsize` | number | `0` | Distance between consecutive tile centers (tile size + separator size). |
| `length` | number | `0` | Total extent along the primary axis (`w` if horizontal, `h` otherwise). |
| `bgs` | table | `nil` | Array of `Image` widgets representing the main tiles. |
| `seps` | table | `nil` | Array of `Image` widgets representing the separators. |

## Main functions
### `GetSlotPos(k)`
* **Description:** Returns the world position (relative to this widget's center) of the *k*-th tile slot.
* **Parameters:** `k` (number) — slot index (1-based).
* **Returns:** `Vector3` — position of the tile; defaults to `(0,0,0)` if *k* is out of range.

### `GetSepSize()`
* **Description:** Returns the size (width, height) of the separator images.
* **Parameters:** None.
* **Returns:** `number, number` — width and height, or `0, 0` if no separators exist.

### `GetSlotSize()`
* **Description:** Returns the size (width, height) of a single main tile image.
* **Parameters:** None.
* **Returns:** `number, number` — width and height of the primary tile; `0, 0` if no tiles exist.

### `GetSize()`
* **Description:** Returns the total computed dimensions of the widget.
* **Parameters:** None.
* **Returns:** `number, number` — total width and height.

### `SetNumTiles(numtiles)`
* **Description:** Rebuilds the tile layout with the specified number of main tiles, including optional end caps and separators. Recalculates dimensions and positions all child images accordingly.
* **Parameters:** `numtiles` (number) — number of main tiles to render.
* **Returns:** Nothing.
* **Error states:** No explicit error states; silently handles zero tiles by rendering only end caps (if defined).

## Events & listeners
None identified.