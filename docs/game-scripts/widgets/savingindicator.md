---
id: savingindicator
title: Savingindicator
description: Displays a visual saving indicator with animation and text during world-saving operations.
tags: [ui, save, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 3c8557f2
system_scope: ui
---

# Savingindicator

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SavingIndicator` is a UI widget that provides visual feedback during world-saving operations. It displays an animation (`saving` bank) and localized text ("SAVING") to indicate that the game is saving. It extends the base `Widget` class and manages its visibility, animation playback, and text state manually via `StartSave()` and `EndSave()` methods.

## Usage example
```lua
local owner = TheFrontEnd
local savingIndicator = CreateWidget("SavingIndicator", owner)
savingIndicator:SetOwner(owner)
savingIndicator:StartSave()
-- ... after save completes ...
savingIndicator:EndSave()
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | — | The entity that owns/hosts the widget (typically a UI root). |
| `anim` | UIAnim | `nil` (initialized in constructor) | The animation child widget used for the saving graphic. |
| `text` | Text | `nil` (initialized in constructor) | The text child widget showing the "SAVING" message. |
| `_scale` | number | `0.5` | Scaling multiplier applied to widget coordinates. |

## Main functions
### `SetScale(pos, y, z)`
*   **Description:** Overrides base widget scaling to apply an internal multiplier (`_scale`) to all axes. Supports both scalar and vector input.
*   **Parameters:**  
    - `pos` (number or Vector3) — if number, used for X/Y/Z; if Vector3, represents X/Y/Z components.  
    - `y` (number, optional) — Y-axis scale factor. Only used if `pos` is a number.  
    - `z` (number, optional) — Z-axis scale factor. Only used if `pos` is a number.
*   **Returns:** Nothing.

### `EndSave()`
*   **Description:** Signals the end of the saving process. Hides the "SAVING" text and plays the `save_post` animation.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `StartSave()`
*   **Description:** Signals the start of the saving process. Shows the entire widget, plays the `save_pre` animation, schedules the "SAVING" text to appear after 0.5 seconds, and then loops the `save_loop` animation.
*   **Parameters:** None.  
*   **Returns:** Nothing.

## Events & listeners
None identified