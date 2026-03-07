---
id: lantern_winter_fx
title: Lantern Winter Fx
description: Creates and manages visual snowflake particle effects associated with the lantern in winter.
tags: [fx, visual, seasonal]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 96843e23
system_scope: fx
---

# Lantern Winter Fx

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines two prefabs (`lantern_winter_fx_held` and `lantern_winter_fx_ground`) that generate and animate snowflake visual effects for the lantern during winter. The `heldfn` variant spawns dynamic snowflake particles continuously while the lantern is held, whereas the `groundfn` variant renders a looping snow animation on the ground surface. Both prefabs are non-persistent, client-only FX entities with no networked state.

## Usage example
```lua
-- Example: Spawn the held variant (typically handled automatically by lantern logic)
local held_fx = SpawnPrefab("lantern_winter_fx_held")
-- The held variant begins emitting snowflakes automatically on the client.
```

## Dependencies & tags
**Components used:** `animstate`, `transform`, `network`  
**Tags:** Adds `FX` tag to all spawned entities; checks `FX` tag internally via `inst:AddTag("FX")`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `killed` | boolean | `false` | Flag indicating whether this FX entity has been signaled for removal (used by `KillFX`). |
| `ismoving` | boolean | `false` | Tracks whether the parent entity is moving (used in held variant to toggle visibility). |
| `prevpos` | vector3? | `nil` | Stores previous world position for movement detection. |
| `snowflakeemitter` | entity? | `nil` | Reference to the emitter entity in the held variant. |
| `anim` | string | `""` | Animation name used for snowflake particles (e.g., `"snowfall1"`). |
| `step` | number | `0` | Step index used to determine particle behavior in the held variant. |

## Main functions
### `KillFX(inst)`
*   **Description:** Signals the FX entity for removal. If the entity has been alive for > 0 seconds, it sets `inst.killed = true`; otherwise, it removes the entity immediately.
*   **Parameters:** `inst` (entity) — The FX entity instance.
*   **Returns:** Nothing.

### `IsMovingStep(step)`
*   **Description:** Helper function to determine whether a given step index corresponds to a moving animation state.
*   **Parameters:** `step` (number) — Step index (0–7).
*   **Returns:** `true` if `step` is `1` or `2`; `false` otherwise.

### `OnSnowflakeAnimOver(inst)`
*   **Description:** Handles animation completion for individual snowflake particles. Manages visibility (based on movement state), position sync to emitter, and animation restart. Removes the entity if the emitter is invalid.
*   **Parameters:** `inst` (entity) — The snowflake particle instance.
*   **Returns:** Nothing.

### `CreateSnowflake(snowflakeemitter, variation, step)`
*   **Description:** Creates and configures a single snowflake FX entity. Sets up animation, tags, transform, and listeners.
*   **Parameters:**  
    `snowflakeemitter` (entity) — Parent emitter entity.  
    `variation` (number) — Animation variation index (1–7).  
    `step` (number) — Step index affecting visibility/movement logic.
*   **Returns:** The created FX entity instance.

### `CheckMoving(inst)`
*   **Description:** Periodically checks if the parent entity has moved by comparing current world position to `prevpos`. Updates `ismoving` and `prevpos`.
*   **Parameters:** `inst` (entity) — The emitter entity (typically the held FX entity).
*   **Returns:** Nothing.

### `heldfn()`
*   **Description:** Constructor for the held variant. Spawns a periodic task to emit snowflakes in cycles, tracks movement, and runs `CheckMoving` every frame on non-dedicated servers.
*   **Parameters:** None.
*   **Returns:** The held FX entity instance.
*   **Error states:** On dedicated servers, returns an empty entity without FX initialization.

### `OnGroundAnimOver(inst)`
*   **Description:** Handles loop transitions for the ground FX animation (e.g., `snow_pre` → `snow_loop` → `snow_pst`).
*   **Parameters:** `inst` (entity) — The ground FX instance.
*   **Returns:** Nothing.

### `groundfn()`
*   **Description:** Constructor for the ground variant. Initializes the ground snow animation with `snow_pre`, `snow_loop`, and `snow_pst` states. Supports populating with random frames for variety.
*   **Parameters:** None.
*   **Returns:** The ground FX entity instance.
*   **Error states:** On non-master simulations, returns the entity before completing server-side setup.

## Events & listeners
- **Listens to:** `animover` — Triggers post-animation logic (handled by `OnSnowflakeAnimOver` for held particles and `OnGroundAnimOver` for ground FX).
- **Pushes:** None.