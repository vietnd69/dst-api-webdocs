---
id: reticulemultitarget
title: Reticulemultitarget
description: Spawns visual effect prefabs (reticules) around multiple entities targeted by a willow ember attack, updating their positions and animations in real time.
tags: [fx, combat, visual, willow, targeting]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d56a051c
system_scope: fx
---

# Reticulemultitarget

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`reticulemultitarget` is a visual effect prefab used to provide feedback during Willow's Ember attack by displaying reticle markers on multiple valid targets. It functions as a controller entity that periodically queries available targets using `willow_ember_common.GetBurstTargets`, then spawns and manages a collection of `reticulemultitargetsub` child prefabs attached to each target. The controller updates target positions each frame via the `updatelooper` component and cleans up sub-effects when removed or when attack ends.

## Usage example
This prefab is typically instantiated internally by Willow's ember logic and does not need direct instantiation by modders. However, if required, usage would resemble:
```lua
local reticule = SpawnPrefab("reticulemultitarget")
-- The effect will automatically begin tracking targets when Willow is in combat
-- and emits ember bursts; no manual activation needed.
```

## Dependencies & tags
**Components used:** `updatelooper`  
**Tags:** Adds `FX`, `NOCLICK` to all three prefabs (`reticulemultitarget`, `reticulemultitargetsub`, `reticulemultitargetping`); checks `nil` for `ThePlayer`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_targets` | table or `nil` | `nil` | Stores list of spawned sub-effect entities (`reticulemultitargetsub`) attached to targets. Initialized on first successful target query. |

## Main functions
### `OnUpdate(inst, dt)`
*   **Description:** Called every frame via `updatelooper`. Clears existing sub-effects if the entity is being removed, then queries current burst targets for `ThePlayer`. For each new valid target, it spawns a `reticulemultitargetsub` prefab, attaches it as a child, and records it in `_targets`.
*   **Parameters:**  
    `inst` (entity) — the main reticule controller entity.  
    `dt` (number) — delta time in seconds since last frame.
*   **Returns:** Nothing.
*   **Error states:** No-ops safely if `ThePlayer` is `nil` or if `willow_ember_common.GetBurstTargets` returns `nil`.

### `UpdatePing(inst, s0, s1, t0, duration, multcolour, addcolour)`
*   **Description:** Animation helper used by the `reticulemultitargetping` prefab to animate a single ping effect (expansion and fade-out). Manages scale interpolation, mult-colour alpha fade, and add-colour flash decay over time.
*   **Parameters:**  
    `inst` (entity) — the ping effect instance.  
    `s0` (table of 2 numbers) — initial scale factors `{x, y}`.  
    `s1` (table of 2 numbers) — target scale factors `{x, y}`.  
    `t0` (number) — start time of the animation.  
    `duration` (number) — total animation duration in seconds.  
    `multcolour` (table) — RGBW mult colour, initialized from `AnimState:GetMultColour()` if empty.  
    `addcolour` (table) — RGBW add colour, initialized from `AnimState:GetAddColour()` if empty.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` — triggers `onremove` handler to destroy all attached sub-effect prefabs and nil out `_targets`.  
- **Pushes:** None.
