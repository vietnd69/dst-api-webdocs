---
id: fused_shadeling_bomb
title: Fused Shadeling Bomb
description: A hostile monster prefab that chases targets, grows in size over time, and detonates to deal area-of-effect damage while spawning secondary quick-fuse bombs.
tags: [combat, ai, monster, explosion]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6f7b63a3
system_scope: entity
---

# Fused Shadeling Bomb

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`fused_shadeling_bomb` is a monster entity that patrols and chases targets using the `locomotor` and `entitytracker` components. It slowly scales up over time and detonates after a configurable delay, dealing planar and direct damage within range while spawning additional `fused_shadeling_quickfuse_bomb` projectiles. The prefab uses a stategraph (`SGfused_shadeling_bomb`) and includes client-side ball-following effects and scorch mark particles. It interacts with `combat`, `entitytracker`, `groundshadowhandler`, `locomotor`, and `timer` components.

## Usage example
This prefab is created internally by the game when certain entities (e.g., `parasitic_shadeling`) spawn it. It is not typically instantiated manually by modders, but the core behavior can be replicated as follows:

```lua
local bomb = SpawnPrefab("fused_shadeling_bomb")
if bomb and TheWorld.ismastersim then
    -- Set initial target (optional)
    bomb:PushEvent("setexplosiontarget", { target = target_entity })
    -- The rest of the behavior (growth, chase, explosion) is automated.
end
```

## Dependencies & tags
**Components used:** `combat`, `entitytracker`, `groundshadowhandler`, `locomotor`, `timer`, `inspectable`, `transform`, `animstate`, `soundemitter`, `dynamicshadow`, `follower`, `network`, `groundshadowhandler`

**Tags added:** `hostile`, `monster`, `notraptrigger`, `shadow`, `shadow_aligned`, `explosive`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_current_scale` | number | `1.0` | Current scale factor applied to the bomb's animation (grows toward `FULL_SIZE`). |
| `_ball` | entity or nil | `nil` | (Client-side only) Child entity representing the growing bomb ball that follows the parent. |
| `_start_ball_growing` | event | `net_event(...)` | Networked event used on client to trigger ball growth animation in sync with server. |

## Main functions
### `do_explosion_effect(inst, ix, iy, iz)`
* **Description:** Triggers visual and damage effects for the bomb’s detonation. Finds nearby valid targets within `EXPLODE_RANGE` and damages them, then spawns death FX and scorch mark.
* **Parameters:** `inst` (entity) — the bomb instance; `ix`, `iy`, `iz` (optional numbers) — world position to use (defaults to bomb’s current position).
* **Returns:** Nothing.

### `do_full_explode(inst)`
* **Description:** Performs the full explosion: spawns `EXTRA_QUICKFUSE_BOMBS` projectiles at randomized angles over a short time, then removes the bomb and calls `do_explosion_effect`.
* **Parameters:** `inst` (entity) — the bomb instance.
* **Returns:** Nothing.

### `do_chase_tick(inst)`
* **Description:** Attempts to locate a target (`entitytracker:GetEntity("target")`), and if not found or lost, searches for a new one using `FindEntity`. If a target is found and is outside `INSIDE_CHASE_RANGESQ`, moves toward a point near the target’s current position.
* **Parameters:** `inst` (entity) — the bomb instance.
* **Returns:** Nothing.

### `do_quickfuse_bomb_toss(inst, ix, iy, iz, angle)`
* **Description:** Spawns and launches a `fused_shadeling_quickfuse_bomb` projectile with random velocity.
* **Parameters:** `inst` (entity), `ix`, `iy`, `iz` (numbers) — spawn position, `angle` (optional number) — launch angle (defaults to random).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `setexplosiontarget` — sets and tracks a new target via `entitytracker:TrackEntity("target", target)`.  
  `timerdone` — dispatches to handler functions (`on_timer_done`) for explosion, chase tick, spawn delays, and scaling timers.  
  `fused_shadeling_bomb._start_ball_growing` — (client only) triggers `do_ball_grow` to sync ball animation.  
  `animover` — (death FX only) removes the entity when animation finishes.  
  `fadedirty` — (scorch only) updates fading opacity on client.

- **Pushes:**  
  `fused_shadeling_bomb._start_ball_growing` — (server only, networked) signals client to grow the ball.