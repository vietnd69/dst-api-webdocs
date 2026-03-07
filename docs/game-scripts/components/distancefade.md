---
id: distancefade
title: Distancefade
description: Controls the visual fade effect of an entity based on its distance from the camera relative to the ground plane.
tags: [visual, environment, camera]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 07278c0b
system_scope: environment
---

# Distancefade

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Distancefade` manages the alpha transparency (fade) of an entity's visuals based on how far it is from the camera *along the camera's downward-facing axis* (i.e., depth relative to the screen). It is used to smoothly fade in/out objects as they move beyond or approach a set distance threshold—most commonly for environmental props and terrain features to improve performance and visual coherence. The component operates by periodically updating the entity's `AnimState` colour override, modifying only the alpha channel while keeping RGB at full intensity.

This component is typically attached to static or passive entities that do not require high update frequency and is designed to work in conjunction with `StartWallUpdatingComponent`/`StopWallUpdatingComponent` lifecycle hooks for efficiency.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("distancefade")
inst.components.distancefade:Setup(30, 10)  -- fade starts at 30 units, completes over 10 units
inst.components.distancefade:SetExtraFn(function(ent, dt)
    -- Optional: modify fade scale per entity (e.g., based on time of day)
    return TheWorld.state.isnight and 0.7 or 1.0
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `range` | number | `25` | Distance (along camera down vector) at which fading begins. Entities closer than this are fully visible. |
| `fadedist` | number | `15` | Distance over which the alpha value decreases linearly from `1.0` to `0.0` once past `range`. |
| `extrafn` | function or nil | `nil` | Optional callback that returns a multiplier (`0.0`–`1.0`) to scale the computed alpha. Called each update with `(inst, dt)`. |

## Main functions
### `Setup(range, fadedist)`
*   **Description:** Configures the fade parameters for the entity. Must be called after construction (either manually or implicitly) to define when and how quickly the fade occurs.
*   **Parameters:**  
    `range` (number) — Distance from the camera where fading begins.  
    `fadedist` (number) — Distance range over which the entity transitions from fully opaque to fully transparent.  
*   **Returns:** Nothing.
*   **Error states:** No explicit validation; `fadedist <= 0` will produce incorrect or no fading.

### `SetExtraFn(fn)`
*   **Description:** Assigns a custom function to dynamically modulate the alpha value on top of the base distance-based calculation. Useful for time-of-day, weather, or gameplay-state-dependent opacity.
*   **Parameters:**  
    `fn` (function or nil) — A callback accepting `(inst, dt)` and returning a numeric multiplier for the alpha. If `nil`, no extra scaling is applied.  
*   **Returns:** Nothing.

### `OnEntitySleep()`
*   **Description:** Stops periodic wall updates (i.e., stops calling `OnWallUpdate`) when the entity enters a sleep state (typically when far from players).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnEntityWake()`
*   **Description:** Resumes periodic wall updates when the entity wakes up (typically when entering the active region near a player).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnWallUpdate(dt)`
*   **Description:** Core update logic. Computes the entity’s distance from the camera along the camera's down vector and updates the alpha channel of the entity’s `AnimState` multicolour override accordingly. Runs on a fixed update cadence triggered by `StartWallUpdatingComponent`.
*   **Parameters:**  
    `dt` (number) — Delta time since the last update.  
*   **Returns:** Nothing.
*   **Error states:**  
    - If `ThePlayer` is `nil` (e.g., during early init), no alpha change occurs.  
    - If `mody > self.range + self.fadedist`, alpha becomes `0.0`.  
    - If `mody <= self.range`, alpha is set to the `extrafn` multiplier (or `1.0` if none).

## Events & listeners
None identified
