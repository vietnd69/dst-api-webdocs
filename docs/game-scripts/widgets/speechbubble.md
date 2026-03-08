---
id: speechbubble
title: Speechbubble
description: Renders a dynamic speech bubble with a face image and text, positioned relative to a target entity's screen coordinates.
tags: [ui, dialogue, rendering]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 32856571
system_scope: ui
---

# Speechbubble

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SpeechBubble` is a UI widget that displays a speech bubble anchored to a target entity in screen space. It renders a face image (typically a character portrait), text content, and a directional tail. The bubble automatically adjusts its position and tail orientation based on screen boundaries and the entity's position to remain visible. It is part of DST’s widget hierarchy and extends `Widget`, integrating with `NineSlice` and `Text` components for rendering.

## Usage example
```lua
local bubble = CreateEntity()
bubble:AddComponent("speechbubble")
bubble.components.speechbubble:SetText("Hello, world!")
bubble.components.speechbubble:SetTarget(some_actor, "face") -- 'some_actor' must have AnimState
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max_width` | number | `350` | Maximum width (in screen units) of the text area before wrapping. |
| `world_offset` | Vector3 | `Vector3(0,0,0)` | Offset applied to the target entity’s position before projecting to screen space. |
| `target` | Entity or nil | `nil` | The entity the speech bubble is anchored to. |
| `target_symbol` | string or table of strings | `nil` | Name(s) of symbol(s) on the target’s `AnimState` to anchor the bubble. |
| `face_size` | table `{x, y}` | `{x = 70, y = 70}` | Dimensions of the face image widget. |
| `face_offset` | table `{x, y}` | Computed from `face_size` | Offset applied to position the face image relative to the bubble content. |
| `root` | Widget | — | Root container widget for all internal widgets. |
| `face` | Image | — | Image widget displaying the face. |
| `dialog_bg` | NineSlice | — | Nine-slice background with tail attachment. |
| `tail` | NineSliceTail | — | The directional tail connecting the bubble to the target. |
| `text` | Text | — | Text widget displaying the dialogue content. |

## Main functions
### `SetFaceImage(atlas, tex)`
* **Description:** Intended to update the face image, but the function body is empty — no-op in current implementation.
* **Parameters:**  
  `atlas` (string or Atlas) — The texture atlas containing the face image.  
  `tex` (string) — The name of the face image texture within the atlas.  
* **Returns:** Nothing.  
* **Error states:** No effect — currently unimplemented.

### `SetText(text)`
* **Description:** Sets the text content, handles multiline wrapping/truncation, resizes the bubble background, and fades the bubble to full opacity.
* **Parameters:**  
  `text` (string) — The string to display. Truncates to 20 lines, wraps within `max_width`.  
* **Returns:** Nothing.  
* **Error states:** None.

### `SetTarget(target, symbol)`
* **Description:** Assigns the entity and optional symbol name(s) used to compute the bubble’s screen position.
* **Parameters:**  
  `target` (Entity) — The entity to follow on screen.  
  `symbol` (string or table of strings) — Symbol name(s) in `target.AnimState` to use as anchor. |
* **Returns:** Nothing.

### `SetTint(r, g, b, a)`
* **Description:** Sets the alpha tint for the entire bubble (text and background) while preserving original RGB color of the text.
* **Parameters:**  
  `r`, `g`, `b` (numbers in `[0,1]`) — Color channel intensities.  
  `a` (number in `[0,1]`) — Alpha value (opacity).  
* **Returns:** Nothing.

### `OnShow()`
* **Description:** Callback invoked when the widget becomes visible. Starts the `OnUpdate` loop to track the target.
* **Parameters:** None.  
* **Returns:** Nothing.

### `OnHide()`
* **Description:** Callback invoked when the widget is hidden. Stops the `OnUpdate` loop.
* **Parameters:** None.  
* **Returns:** Nothing.

### `OnUpdate()`
* **Description:** Core update logic: recomputes screen position based on `target` and `target_symbol`, clamps to screen margins, and adjusts tail orientation to keep the bubble in view.
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:** If `target` is invalid or `target.AnimState` is missing, it falls back to the entity’s position. If screen coordinates are out of bounds, it shows/hides the face image accordingly.

## Events & listeners
None identified