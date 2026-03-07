---
id: carrot_spinner
title: Carrot Spinner
description: A visualFX entity that fades in and out over time, typically attached to a player or object to indicate a temporary status effect.
tags: [fx, visual, animation]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 47126592
system_scope: fx
---

# Carrot Spinner

> Based on game build **7140014** | Last updated: 2026-03-04

## Overview
`carrot_spinner` is a prefab that creates a persistent visual effect (FX) entity with animated fade-in and fade-out behavior. It uses the `timer` component to schedule fade-in and fade-out transitions and the `updatelooper` component to smoothly adjust the entity's alpha value over time. It is typically attached to another entity (e.g., a player) to visually indicate a temporary effect (e.g., carrot-based bonus). The FX is non-interactive (`NOCLICK` tag) and exists only for rendering (background layer, `OnGround` orientation).

## Usage example
```lua
local spinner = TheSim:LoadPrefab("carrot_spinner")
if spinner ~= nil then
    spinner.components.carrot_spinner.AttachTo(spinner, player)
    -- Optional: manually trigger fade-out earlier
    -- spinner.components.carrot_spinner.FadeOut()
end
```

## Dependencies & tags
**Components used:** `timer`, `updatelooper`  
**Tags:** Adds `FX`, `NOCLICK`  
**Public methods added to entity:** `inst.AttachTo`, `inst.FadeOut`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `alpha` | number | `0` | Current opacity value (between `0` and `0.6`). Updated by `OnUpdate`. |
| `fadein` | boolean / `nil` | `nil` | Indicates whether the entity is currently fading in. |
| `fadeout` | boolean / `nil` | `nil` | Indicates whether the entity is currently fading out. |

## Main functions
### `AttachTo(inst, owner)`
*   **Description:** Positions and orients the spinner to match the `owner` entity. Listens for the `onremove` event on the owner to automatically trigger `FadeOut()` when the owner is removed.
*   **Parameters:**  
    `inst` (Entity) — The carrot spinner entity.  
    `owner` (Entity) — The entity to attach to (e.g., a player).  
*   **Returns:** Nothing.

### `FadeOut(inst)`
*   **Description:** Immediately stops the fade-in timer and initiates the fade-out phase. The entity will gradually become transparent and self-remove once alpha drops below zero.
*   **Parameters:** `inst` (Entity) — The carrot spinner entity.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` — Used to set `inst.fadein` or `inst.fadeout` flags based on which timer (`begin_delay` or `end_delay`) completed.
- **Pushes:** None.