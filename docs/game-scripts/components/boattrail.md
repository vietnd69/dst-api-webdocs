---
id: boattrail
title: Boattrail
description: Generates visual water wake effects behind a boat entity as it moves.
tags: [water, fx, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 26c1d469
system_scope: fx
---

# Boattrail

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Boattrail` is a client-side component that spawns visual water wake effects (using the `boat_water_fx` prefab) behind a boat as it moves. It calculates movement distance between frames and triggers effect instantiation at regular intervals (`effect_spawn_rate`). It listens for `entitysleep` and `entitywake` events to pause and resume updates when the entity enters/exits sleep state, ensuring effects are not generated while the boat is stationary.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("boattrail")

-- Configure trail properties (optional)
inst.components.boattrail.effect_spawn_rate = 0.8
inst.components.boattrail.radius = 2.5

-- The component automatically updates while the entity is awake
```

## Dependencies & tags
**Components used:** `boattrailmover` (via `fx.components.boattrailmover:Setup(...)`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `anim_idx` | number | `0` | Zero-based index for selecting next animation to play on effect prefabs. |
| `effect_spawn_rate` | number | `1` | Minimum distance traveled required before spawning a new effect. |
| `radius` | number | `3` | Radial offset from the boat's center where effects spawn. |
| `scale_x` | number | `1` | X-scale factor applied to spawned effects. |
| `scale_z` | number | `1` | Z-scale factor applied to spawned effects. |
| `total_distance_traveled` | number | `0` | Accumulated distance traveled since last reset (e.g., on wake). |
| `last_x` | number | `nil` | Last known X position of the parent entity. |
| `last_z` | number | `nil` | Last known Z position of the parent entity. |
| `last_dir_x` | number | `nil` | Last known normalized X direction vector. |
| `last_dir_z` | number | `nil` | Last known normalized Z direction vector. |

## Main functions
### `SpawnEffectPrefab(x, y, z, dir_x, dir_z)`
*   **Description:** Spawns a `boat_water_fx` prefab at the specified world position, offset by `radius` opposite the movement direction. Applies a randomly selected animation loop and initializes its movement via `boattrailmover:Setup`.
*   **Parameters:**  
    * `x`, `y`, `z` (numbers) — World position to spawn the effect at.  
    * `dir_x`, `dir_z` (numbers) — Normalized direction vector indicating movement direction.  
*   **Returns:** Nothing.
*   **Error states:** If the spawned prefab lacks a `boattrailmover` component, the movement setup step is skipped silently.

### `OnUpdate(dt)`
*   **Description:** Updates trail state each frame while the entity is awake. Computes distance moved since last frame, accumulates it, and spawns an effect when the accumulated distance exceeds `effect_spawn_rate`.
*   **Parameters:** `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing.
*   **Error states:** If `total_distance_traveled` is uninitialized (e.g., on first call before wake), it initializes tracking and returns early without spawning effects.

## Events & listeners
- **Listens to:**  
  * `entitysleep` — Stops updating the component (via `inst:StopUpdatingComponent`).  
  * `entitywake` — Resets distance tracking and resumes updates (via `inst:StartUpdatingComponent`).  
- **Pushes:** None.
