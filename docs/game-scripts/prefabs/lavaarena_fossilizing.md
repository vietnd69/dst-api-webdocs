---
id: lavaarena_fossilizing
title: Lavaarena Fossilizing
description: Generates and manages network-synchronized debris entities used for visual effects during the Lava Arena event's fossilizing effect.
tags: [fx, event, lavaarena, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d78eb118
system_scope: fx
---

# Lavaarena Fossilizing

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
This file defines prefabs used to create transient visual effects for the Lava Arena event's fossilizing mechanic. It includes logic for spawning multiple debris variations with animated tinting and a central FX entity that triggers their creation. All spawned entities are marked as `FX`, non-persistent, and removed shortly after creation. The component handles both client-side animation (via non-networked entities) and server-side cleanup (via master-simulated entities).

## Usage example
This prefab is not added directly via `inst:AddComponent`. Instead, it is used as a prefab factory that returns `Prefab` objects, which are resolved by the prefab system:

```lua
-- When spawned (e.g., via a spawn function or event):
local debris_prefab = "lavaarena_fossilizedebris" .. tostring(math.random(1, 3))
local debris = SpawnPrefab(debris_prefab)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX`, `lavaarena_fossilizedebris` (to debris entities)

## Properties
No public properties.

## Main functions
### `MakeFossilizeDebris(name, variation, prefabs)`
*   **Description:** Returns a `Prefab` factory function that creates debris entities with specific variation IDs and optional FX animation. Handles both master and client simulation to ensure only non-dedicated servers spawn visual FX.
*   **Parameters:**  
    * `name` (string) — Base name of the prefab (e.g., `"lavaarena_fossilizedebris1"`).  
    * `variation` (number | `nil`) — Debris animation index (`1` to `NUM_DEBRIS_VARIATIONS`). If `nil`, a random variation is chosen.  
    * `prefabs` (table) — List of potential debris prefabs used for spawning.  
*   **Returns:** A `Prefab` object.

### `PlayDebrisAnim(proxy, variation)`
*   **Description:** Spawns a temporary, non-networked entity that plays an animation and applies a time-based colour tint effect. Removes itself when the animation ends.
*   **Parameters:**  
    * `proxy` (Entity) — Reference entity used to inherit transform (position/rotation).  
    * `variation` (number) — Animation index (e.g., `1`, `2`, or `3`).  
*   **Returns:** Nothing.

### `UpdateDebrisTint(inst, delta)`
*   **Description:** Reduces the tint value over time and updates the animation colour multiplier for a fading effect. Cancels the periodic task when tint completes.
*   **Parameters:**  
    * `inst` (Entity) — The debris FX entity.  
    * `delta` (number) — Time delta (unused in current implementation; fixed step is applied).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — Used to auto-remove debris FX entities when their animation finishes.
