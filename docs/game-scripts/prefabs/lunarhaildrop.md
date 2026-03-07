---
id: lunarhaildrop
title: Lunarhaildrop
description: A one-shot visual effect prefab that plays a falling lunar hail animation sequence and recycles or destroys itself upon completion.
tags: [fx, animation, visual]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 25382151
system_scope: fx
---

# Lunarhaildrop

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lunarhaildrop` is a visual effect (FX) prefab used to render falling lunar hailstones — likely part of a weather or event system (e.g., lunar events). It is a non-persistent, non-networked entity with basic animation and orientation handling. The effect plays an initial falling animation (`anim`), transitions to a grounded animation (`ground1` or `ground2`), and then plays a post-ground animation (`ground*_pst`). After the final animation completes, the entity either returns to a reusable pool or is removed from the scene.

## Usage example
```lua
local drop = SpawnPrefab("lunarhaildrop")
drop.Transform:SetPos(x, y, z)
drop.delay = 1.5 -- seconds before post-ground animations start
drop.pool = { ents = {} } -- optional: pass a pool table for entity recycling
```

## Dependencies & tags
**Components used:** `animstate`, `transform`
**Tags:** Adds `FX`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `delay` | number or `nil` | `nil` | Time in seconds to wait before playing post-ground animations. If `nil`, skips grounded animations and goes directly to post-ground. |
| `pool` | table or `nil` | `nil` | Optional table with an `ents` array; if valid, the entity is recycled into this pool instead of being destroyed. |

## Main functions
### `RestartFx(inst)`
*   **Description:** Resets the effect by playing the initial falling animation (`anim`) and randomly mirroring it horizontally for visual variety.
*   **Parameters:** `inst` (Entity) — the lunarhaildrop entity instance.
*   **Returns:** Nothing.
*   **Error states:** No known error states; uses `math.random()` for orientation.

### `PlayPstAnim(inst, anim)`
*   **Description:** Helper to play a specific animation on the entity’s `AnimState`. Called internally during transition to post-ground animations.
*   **Parameters:** 
  * `inst` (Entity) — the lunarhaildrop entity instance.
  * `anim` (string) — name of the animation to play.
*   **Returns:** Nothing.

### `OnAnimOver(inst)`
*   **Description:** Handles animation completion logic. Branches based on current animation:
    - If `anim` finished and `delay` is `nil`, plays `anim_pst`.
    - If `anim` finished and `delay` is set, waits `delay` seconds then plays `ground*_pst`.
    - If `ground1` or `ground2` finished, schedules `ground*_pst` after `delay`.
    - Finally, removes the entity from the scene and either recycles it (into `inst.pool.ents`) or destroys it.
*   **Parameters:** `inst` (Entity) — the lunarhaildrop entity instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — triggers `OnAnimOver` when the current animation finishes.

