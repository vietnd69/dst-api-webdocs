---
id: pond
title: Pond
description: Manages frozen, spawning, and environmental state transitions for surface and cave ponds, including seasonal freezing, child mob spawning, acid rain effects, and loot spawning.
tags: [environment, spawner, physics, seasonal]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9da541ca
system_scope: environment
---

# Pond

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `pond` prefab is a dynamic environment entity that handles surface and cave pond behavior, including seasonal freezing, daily/mosquito spawning cycles, and cave-specific acid rain interaction. It coordinates multiple components (`childspawner`, `fishable`, `watersource`, `workable`, `acidlevel`, `hauntable`, `inspectable`, `lootdropper`) to control spawn behavior, water availability, fish spawning, and interactive state changes (e.g., freezing, acidification). It supports three variants: `pond` (frog pond), `pond_mos` (mosquito pond), and `pond_cave` (cave pond with acid/formation mechanics).

## Usage example
```lua
-- Spawn a standard frog pond at world coordinates
local pond = SpawnPrefab("pond")
pond.Transform:SetPosition(x, y, z)
 pond.components.childspawner:StartSpawning() -- ensure spawning is active
 pond.components.fishable:Unfreeze() -- ensure unfrozen for fishing
```

## Dependencies & tags
**Components used:** `childspawner`, `fishable`, `watersource`, `hauntable`, `inspectable`, `lootdropper`, `workable`, `acidlevel`, `slipperyfeettarget` (added conditionally on freezing).
**Tags added:** `watersource`, `pond`, `antlion_sinkhole_blocker`, `birdblocker`.
**Tags removed:** None.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pondtype` | string | `""`, `"_mos"`, or `"_cave"` | Variant identifier, used for animation selection and prefabs. |
| `planttype` | string | `"marsh_plant"` or `"pond_algae"` | Prefab name used for plant spawns. |
| `plants` | table or `nil` | `nil` | Stores static plant spawn offsets. |
| `plant_ents` | table or `nil` | `nil` | Table of spawned plant entities. |
| `nitreformations` | table or `nil` | `nil` | Stores static nitre formation offsets (cave only). |
| `nitreformation_ents` | table or `nil` | `nil` | Table of spawned nitre formation entities (cave only). |
| `frozen` | boolean or `nil` | `nil` | Whether the pond is currently frozen. |
| `acidinfused` | boolean or `nil` | `nil` | Whether the cave pond is currently acid-formation state. |
| `dayspawn` | boolean | `true` (frog), `false` (mosquito) | Determines if spawning occurs on day or night. |
| `task` | function or `nil` | `nil` | Delayed initialization task for pond setup. |
| `scrapbook_anim` | string | `"idle_mos"` or `"idle_cave"` | Animation name used in scrapbook UI. |
| `scrapbook_specialinfo` | string or `nil` | `"PONDCAVE"` | Metadata for scrapbook display. |

## Main functions
### `commonfn(pondtype)`
*   **Description:** Shared constructor for all pond variants. Initializes core transforms, animation, physics, tags, and basic components. Sets up `childspawner`, `fishable`, `hauntable`, `watersource`, and `inspectable` components.
*   **Parameters:** `pondtype` (string) — one of `""`, `"_mos"`, or `"_cave"` to select variant and animation.
*   **Returns:** `inst` (entity instance) — the initialized pond entity.

### `OnInit(inst)`
*   **Description:** Attaches world state watchers for `isday` and `snowlevel`, then immediately invokes `OnIsDay` and `OnSnowLevel` to set initial state based on current world conditions.
*   **Parameters:** `inst` (entity) — the pond instance.
*   **Returns:** Nothing.

### `OnIsDay(inst, isday)`
*   **Description:** Controls spawning based on day/night cycle and season. Stops spawning at night for frog ponds, resumes at day. Mosquito ponds spawn at night.
*   **Parameters:**  
    - `inst` (entity) — the pond instance.  
    - `isday` (boolean) — current world day state.  
*   **Returns:** Nothing.

### `OnSnowLevel(inst, snowlevel)`
*   **Description:** Handles freezing/unfreezing transitions based on snow level. When `snowlevel > 0.02`, pond freezes: stops spawning, freezes fish, adds slippery physics, disables water source, and despawns plants. When snow level drops, pond thaws and reverts behavior.
*   **Parameters:**  
    - `inst` (entity) — the pond instance.  
    - `snowlevel` (number) — current world snow level.  
*   **Returns:** Nothing.
*   **Error states:** No explicit errors; may fail silently if components missing (assumes components are added via `commonfn`).

### `OnAcidLevelDelta_Cave(inst, data)`
*   **Description:** Event handler for cave pond acid level changes. Triggers transitions to/from acidic (nitre-formation) state when acid level crosses `TUNING.ACIDRAIN_BOULDER_WORK_STARTS_PERCENT`. Spawns/destroys nitre formations and updates workability and visual state.
*   **Parameters:**  
    - `inst` (entity) — the cave pond instance.  
    - `data` (table or `nil`) — expected to contain `oldpercent` and `newpercent` values (numbers).  
*   **Returns:** Nothing. Returns early if `data` is `nil`.

### `SetAcidic_Cave(inst)`
*   **Description:** Switches cave pond to acidic (nitre-formation) state: plays animation, stops spawning, freezes fish, disables water, sets inspectable name to `"nitre_formation"`, and spawns nitre formations.
*   **Parameters:** `inst` (entity) — the cave pond instance.
*   **Returns:** Nothing.

### `SetBackToNormal_Cave(inst)`
*   **Description:** Reverts cave pond from acidic state to normal. Resets animation, restores spawning/fish, enables water, restores inspectable name to `"pond"`, and removes nitre formations.
*   **Parameters:** `inst` (entity) — the cave pond instance.
*   **Returns:** Nothing.

### `OnPondCaveMinedFinished(inst, miner)`
*   **Description:** Callback executed when the cave pond is mined (when in nitre-formation state). Spawns 2–4 `nitre` items and resets workable state and acid level.
*   **Parameters:**  
    - `inst` (entity) — the cave pond instance.  
    - `miner` (entity) — the miner (not used beyond callback signature).  
*   **Returns:** Nothing.

### `SpawnPlants(inst)`
*   **Description:** Spawns marsh plants (or pond algae in caves) at randomized positions around the pond. Called on init or thaw.
*   **Parameters:** `inst` (entity) — the pond instance.
*   **Returns:** Nothing.

### `DespawnPlants(inst)`
*   **Description:** Removes all currently spawned plant entities and clears references.
*   **Parameters:** `inst` (entity) — the pond instance.
*   **Returns:** Nothing.

### `SpawnNitreFormations(inst)`
*   **Description:** Spawns `nitre_formation` entities for cave ponds in acidic state. Uses stored offsets and random animation variants. Assigns highlight children for client-side rendering.
*   **Parameters:** `inst` (entity) — the cave pond instance.
*   **Returns:** Nothing.

### `DespawnNitreFormations(inst)`
*   **Description:** Removes all nitre formation entities and clears references.
*   **Parameters:** `inst` (entity) — the cave pond instance.
*   **Returns:** Nothing.

### `ReturnChildren(inst)`
*   **Description:** Sends all externally spawned child entities back to the pond via `homeseeker` or `gohome` event.
*   **Parameters:** `inst` (entity) — the pond instance.
*   **Returns:** Nothing.

### `PondCaveDisplayNameFn(inst)`
*   **Description:** Dynamic name resolver for cave pond inspectable. Returns `"nitre_formation"` when the pond is workable/acidic, otherwise `nil`.
*   **Parameters:** `inst` (entity) — the cave pond instance.
*   **Returns:** `string` or `nil`.

## Events & listeners
- **Listens to:**  
    - `acidleveldelta` — triggers `OnAcidLevelDelta_Cave` for cave pond acid state changes.  
    - `gainrainimmunity` — triggers `OnStopIsAcidRaining` to end acidification.  
    - `onworkfinished` — triggers `OnPondCaveMinedFinished` when cave pond is mined.  
- **Pushes:** None (event producers are child entities or other components).