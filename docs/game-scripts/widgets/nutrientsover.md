---
id: nutrientsover
title: Nutrientsover
description: Displays a visual overlay on screen when the player has nutrient vision active.
tags: [ui, vision, overlay]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 4cbe7a79
system_scope: ui
---

# Nutrientsover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`NutrientsOver` is a UI widget that shows or hides a fullscreen overlay texture to indicate when the player currently has nutrient vision enabled. It listens for the `"nutrientsvision"` event broadcast on `TheWorld` and reacts to changes in the player's vision state. The component is typically attached to the player entity as part of the UI rendering system and uses a full-screen image with a tinted transparency to visually communicate the effect.

## Usage example
```lua
local inst = ThePlayer
inst:NutrientsOver = inst:AddWidget("nutrientsover", inst)
-- The widget automatically shows/hides based on nutrientsvision events
```

## Dependencies & tags
**Components used:** `playervision` — accessed via `owner.components.playervision:HasNutrientsVision()` for initial state check.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The entity (typically a player) that owns this widget. |
| `bg` | `Image` | `nil` | The background image widget used for the overlay. |
| `shown` | `boolean` | `false` | Tracks whether the overlay is currently visible. |

## Main functions
### `ToggleNutrients(show)`
*   **Description:** Shows or hides the nutrient vision overlay based on the `show` flag. Ensures the widget state matches the intended visibility and updates the internal `shown` flag.
*   **Parameters:** `show` (boolean) — if `true`, shows the overlay; if `false`, hides it.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `nutrientsvision` — fired on `TheWorld` to signal a change in nutrient vision state. Triggers `ToggleNutrients(data.enabled)`.
- **Pushes:** None.