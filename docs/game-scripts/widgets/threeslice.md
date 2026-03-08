---
id: threeslice
title: ThreeSlice
description: "A UI widget that renders a horizontally or vertically scalable image by splitting it into three segments: a start cap, a repeating filler, and an optional end cap."
tags: [ui, rendering, widget]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 1212555d
system_scope: ui
---

# ThreeSlice

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ThreeSlice` is a UI widget that implements a three-part image tiling system: a fixed start cap, a stretchable filler region, and an optional end cap. It is used to render scalable UI elements (e.g., progress bars, frames, sliders) without stretching the corners. The widget manages one root container and dynamically creates `Image` children for the filler segments based on the requested size and orientation. It inherits from the base `Widget` class.

## Usage example
```lua
local threeslice = widget:AddChild(ThreeSlice("textures/my_atlas.xml", "start.tex", "fill.tex", "end.tex"))
threeslice:Flow(200, 30, true)  -- horizontal bar of width 200, height 30
-- or use a fixed number of filler tiles:
threeslice:ManualFlow(3, false) -- vertical bar with exactly 3 filler segments
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `threeslice` (via `Widget._ctor`) and internally manages `Image` children.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `atlas` | string | `nil` | Path to the image atlas file (e.g., `"textures/my_atlas.xml"`). |
| `filler` | string | `nil` | Filename of the filler texture in the atlas. |
| `start_cap_size` | number | `0` | Cached size (width or height) of the start cap in the flow direction. |
| `end_cap_size` | number | `0` | Cached size (width or height) of the end cap in the flow direction. |
| `filler_size` | number | `0` | Cached size (width or height) of a single filler tile in the flow direction. |
| `flip_end_cap` | boolean | `false` | Indicates whether the end cap should be flipped (e.g., mirrored horizontally/vertically) to match orientation. |

## Main functions
### `SetImages(atlas, cap, filler, end_cap)`
* **Description:** Updates the textures used for all segments (start cap, filler, and end cap) and re-applies them to existing images. Supports optional `end_cap`, defaulting to `cap` if omitted.
* **Parameters:**  
  `atlas` (string) – path to the new image atlas.  
  `cap` (string) – texture name for the start cap.  
  `filler` (string) – texture name for the filler segment.  
  `end_cap` (string, optional) – texture name for the end cap; defaults to `cap`.
* **Returns:** Nothing.

### `RemoveParts()`
* **Description:** Destroys all dynamically created filler images and clears the internal `parts` list.
* **Parameters:** None.  
* **Returns:** Nothing.

### `Flow(width, height, horizontal)`
* **Description:** Configures the widget to scale itself to a specified total size by computing how many filler segments are needed, placing caps at edges, and positioning/scaling fillers in between. Automatically handles both horizontal and vertical modes. If no room remains for fillers after caps, it centers the caps only.
* **Parameters:**  
  `width` (number) – total requested width (in pixels).  
  `height` (number) – total requested height (in pixels).  
  `horizontal` (boolean) – `true` for horizontal layout (width is the flow direction); `false` for vertical.
* **Returns:** Nothing.

### `ManualFlow(num_filler, horizontal)`
* **Description:** Renders a fixed number of filler segments, regardless of the total available space. Caps are positioned symmetrically around the filler block. Useful for consistent visual density or tiling patterns.
* **Parameters:**  
  `num_filler` (number) – number of filler tiles to insert (must be `>= 0`).  
  `horizontal` (boolean) – `true` for horizontal layout; `false` for vertical.
* **Returns:** Nothing.

## Events & listeners
None identified