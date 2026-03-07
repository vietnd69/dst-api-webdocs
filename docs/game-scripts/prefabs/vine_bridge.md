---
id: vine_bridge
title: Vine Bridge
description: Renders a procedurally generated decorative FX bridge composed of multiple animated sub-entities with randomized behavior and sound.
tags: [fx, environment, procedural]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4b312cc5
system_scope: fx
---

# Vine Bridge

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`vine_bridge` is a client-side FX prefab responsible for spawning a decorative vine bridge structure. It consists of a primary bridge entity and multiple randomly generated decor sub-entities attached to it via parent-child transforms. The bridge plays an initial animation sequence, starts looping ambient sound, and spawns decorative FX elements over time. It is non-persistent, used only for visual effect in specific world events (e.g., Charlie residue areas).

## Usage example
```lua
local bridge = SpawnPrefab("vine_bridge_fx")
bridge.Transform:SetPosition(x, y, z)
-- The bridge automatically spawns decor sub-entities and plays animations.
-- Optional: trigger state changes via the exposed methods.
bridge.SkipPre()
bridge.ShakeIt()
bridge.KillFX()
```

## Dependencies & tags
**Components used:** `animstate`, `soundemitter`, `transform`, `network`
**Tags:** `FX` (on main entity), `DECOR` (on decor sub-entities)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `variation` | number | random (1–3) | Bridge variant ID, determining which animation bank (`bridge1`, `bridge2`, `bridge3`) is used. |
| `animbase` | string | `"bridge"` | Base string used to construct animation names for the main entity. |
| `decor` | table | `{}` | Array of task handles or decor FX entities spawned during initialization. |
| `soundtask` | task | `nil` | Task handle for scheduling the initial sound effect. |
| `persists` | boolean | `false` | Whether the entity persists across world saves/loads. |

## Main functions
### `SkipPre()`
* **Description:** Skips the initial pre-animation and transitions directly to the idle state for the bridge and all decor sub-entities. Cancels pending sound task if present.
* **Parameters:** None.
* **Returns:** Nothing.

### `KillFX()`
* **Description:** Triggers the post-destruction FX: plays the `*_pst` (post) animation sequence, removes the entity after animation completes, stops the looping sound, and plays a final sound effect.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Sets `OnEntitySleep` to `inst.Remove` so the entity self-destructs on sleep; does nothing if already asleep.

### `ShakeIt()`
* **Description:** Plays the `*_shake` animation for the bridge and all active decor sub-entities.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — used in `KillFX()` to trigger entity removal upon animation completion.
- **Pushes:** None.