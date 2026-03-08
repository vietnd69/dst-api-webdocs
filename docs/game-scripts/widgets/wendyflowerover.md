---
id: wendyflowerover
title: WendyFlowerOver
description: Manages the visual overlay animation for Wendy's flower pendant during specific gameplay states.
tags: [ui, animation, visual, wendy]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: a05c9c90
system_scope: ui
---

# WendyFlowerOver

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WendyFlowerOver` is a UI widget that controls the rendering of an animated overlay for Wendy's flower pendant — specifically, the "flower over" visual effect that appears during certain actions (e.g., during Abigail summoning or related abilities). It inherits from `Widget` and uses an internal `UIAnim` child to play targeted animations based on the selected level and optional skin.

## Usage example
```lua
local owner = CreateEntity()
local flower_over = WendyFlowerOver(owner)
owner.ui:AddChild(flower_over)

flower_over:SetSkin("wendy_flower_over")
flower_over:Play(1)  -- plays "over_stage1" animation
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags; interacts only with UI and animation systems.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | — | The entity that owns this widget (passed into constructor). |
| `anim` | `UIAnim` | `nil` initially | Child animation widget used to render the overlay. |
| `skinbuild` | `string?` | `nil` | Build path for the current skin (if any). |

## Main functions
### `SetSkin(skinname)`
*   **Description:** Sets or clears the current skin for the flower pendant overlay. If a non-empty skin name is provided, it resolves the corresponding build path using `GetBuildForItem`.
*   **Parameters:**  
    - `skinname` (string) — The name of the item/skin to apply. Empty string clears the skin.
*   **Returns:** Nothing.

### `Play(level)`
*   **Description:** Plays the specified animation stage (`"over_stage{level}"`) on the internal animation widget. Applies skin if previously set.
*   **Parameters:**  
    - `level` (number or string convertible to number) — The stage level (e.g., `1`, `2`) indicating which animation to play.
*   **Returns:** Nothing.
*   **Error states:** If `skinname` was previously set to a non-empty value but `GetBuildForItem` returned `nil`, behavior is undefined (no explicit error handling is present).

## Events & listeners
None identified. This widget does not register or fire events.