---
id: shadow_harvester_trail
title: Shadow Harvester Trail
description: Visual effect prefab that generates a persistent shadowy trail animation around an entity, managed via client-side particle pooling.
tags: [prefab, fx, visual]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 38e75eef
system_scope: fx
---

# Shadow Harvester Trail

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`shadow_harvester_trail.lua` defines a visual effect prefab used to render a shadowy trail around an entity (typically associated with the Shadow Harvester or WX-78 nightmare fuel effects). The prefab attaches animation and sound components but relies on client-side logic for the trail generation. It uses an object pooling system (`trailfx_pool`) to recycle effect entities rather than spawning new ones continuously. The trail logic is skipped on dedicated servers (`TheNet:IsDedicated()`).

## Usage example
```lua
-- Spawn the trail effect at a specific position:
local inst = SpawnPrefab("shadow_harvester_trail")
inst.Transform:SetPosition(10, 0, 10)

-- The trail logic initializes automatically on non-dedicated clients:
-- No manual function calls required; effects persist until entity removal.
```

## Dependencies & tags
**Entity built-ins:**
- `Transform` -- position and parenting
- `AnimState` -- animation playback and layering
- `SoundEmitter` -- audio playback (attached but unused in source)
- `Network` -- entity replication metadata

**Tags:**
- `CLASSIFIED` -- added to child fx entities to hide them from debug selection

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | `{...}` | Array of `Asset` entries loaded with the prefab. |
| `trailfx` | table | `{}` | Array of active trail effect entities currently visible. Assigned in `fn()` on non-dedicated sims. |
| `trailfx_pool` | table | `{}` | Pool of inactive effect entities available for recycling. Assigned in `fn()` on non-dedicated sims. |

## Main functions
### `fn()`
*   **Description:** Prefab constructor. Creates the base entity, attaches components, and configures animations. On non-dedicated simulations, initializes the trail effect system (`trailfx`, `trailfx_pool`) and starts the generation task. Returns `inst` for both client and master simulations.
*   **Parameters:** None
*   **Returns:** entity instance
*   **Error states:** None.

### `CreateOneshotFx()` (local)
*   **Description:** Creates a child entity used for supplementary visual effects (shadow breath). Configures animation bank, build, and randomizes initial animation frame. Sets `persists = false` so it does not save.
*   **Parameters:** None
*   **Returns:** entity instance (child fx)
*   **Error states:** None.

### `InitializeFx(inst, fx)` (local)
*   **Description:** Configures a trail effect entity for playback. Adds `fx` to `inst.trailfx`, queues the animation sequence (`blob_decal_pre` -> `blob_decal_loop` -> `blob_decal_pst`), and randomizes the scale of the child oneshot fx.
*   **Parameters:**
    - `inst` -- parent entity owning the trail system
    - `fx` -- trail effect entity to initialize
*   **Returns:** None
*   **Error states:** Errors if `inst.trailfx` is nil (should be initialized in `fn()`).

### `CreateTrailFx(inst)` (local)
*   **Description:** **Recursive task.** Retrieves an effect entity from `trailfx_pool` or creates a new one if the pool is empty. Positions the effect randomly within a small radius (`0.1` to `0.2` units) around `inst`. Initializes the fx and schedules the next call via `DoTaskInTime` (3-5 frames delay).
*   **Parameters:** `inst` -- parent entity
*   **Returns:** None
*   **Error states:** Errors if `inst.Transform` is missing (required for `GetWorldPosition`).

### `ExpireTrailFx(inst)` (local)
*   **Description:** Cleanup function called on entity removal. Marks all active effects in `trailfx` for finalization (`finalize = true`) and removes all pooled effects in `trailfx_pool`.
*   **Parameters:** `inst` -- parent entity
*   **Returns:** None
*   **Error states:** Errors if `inst.trailfx` or `inst.trailfx_pool` is nil.

## Events & listeners
- **Listens to:** `onremove` (on `inst`) -- triggers `ExpireTrailFx` to clean up all trail particles when the parent entity is removed.
- **Listens to:** `animqueueover` (on `fx` children) -- triggers recycling logic; if `fx.finalize` is true, the entity is removed, otherwise it is returned to `trailfx_pool`.