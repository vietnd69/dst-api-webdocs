---
id: grass
title: Grass
description: Handles the lifecycle of grass patches including growth cycles, morphing into grass geckos, and interaction with world settings timers.
tags: [environment, renewable, plant, timer]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c81ec552
system_scope: environment
---

# Grass

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `grass` prefab manages renewable grass patches that grow over time, can be harvested (producing `cutgrass`), and have a chance to morph into `grassgekko` entities under specific conditions. It integrates with several components: `pickable` for harvest mechanics, `witherable` for disease states, `lootdropper` for loot spawning, and `workable` for digging. World settings timers (`worldsettingstimer`) control morphing delays and cycles, ensuring correct behavior under paused or seasonal game states.

## Usage example
```lua
local inst = SpawnPrefab("grass")
-- Grass is fully initialized with components in its prefab function
-- No further setup required for basic use
-- To manually trigger morphing:
inst.components.worldsettingstimer:StartTimer("morphdelay", 5)
```

## Dependencies & tags
**Components used:** `pickable`, `witherable`, `lootdropper`, `inspectable`, `workable`, `worldsettingstimer`, `herdmember`, `knownlocations`.  
**Tags:** `plant`, `renewable`, `silviculture`, `lunarplant_target`, `witherable` (added for optimization), `FX`, `NOCLICK` (for `grasspartfx` only).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.scrapbook_specialinfo` | string | `"NEEDFERTILIZER"` | Marks the grass as needing fertilizer for the scrapbook. |
| `inst.components.pickable.product` | string | `"cutgrass"` | The primary loot item dropped when harvested. |
| `inst.components.pickable.regentime` | number | `TUNING.GRASS_REGROW_TIME` | Time in seconds for grass to regrow after harvest. |
| `inst.components.pickable.max_cycles` | number | `TUNING.GRASS_CYCLES` | Total number of harvest cycles before becoming barren. |
| `inst.components.pickable.cycles_left` | number | `TUNING.GRASS_CYCLES` | Remaining harvest cycles before barren. |

## Main functions
### `dig_up(inst, worker)`
*   **Description:** Digs up the grass, spawning loot (either `cutgrass` or `dug_grass` depending on withered state) and removing the grass entity. May trigger nearby morphing if the worker is a player passing a luck check.
*   **Parameters:** `inst` (entity) - the grass instance; `worker` (entity) - the entity performing the dig action.
*   **Returns:** Nothing.
*   **Error states:** Only proceeds if both `pickable` and `lootdropper` components are present.

### `onregenfn(inst)`
*   **Description:** Called when grass regrows after being picked. Animates growth (`grow` animation) followed by a looped `idle` animation.
*   **Parameters:** `inst` (entity) - the grass instance.
*   **Returns:** Nothing.

### `makeemptyfn(inst)`
*   **Description:** Plays an animation when grass becomes empty (picks depleted but not yet dead). Animations differ if the grass is withered or currently showing `idle_dead`.
*   **Parameters:** `inst` (entity) - the grass instance.
*   **Returns:** Nothing.

### `makebarrenfn(inst, wasempty)`
*   **Description:** Plays an animation when grass becomes barren (no more harvest cycles left). Animations differ if the grass was already empty and/or withered.
*   **Parameters:** `inst` (entity) - the grass instance; `wasempty` (boolean) - whether the grass was already empty before becoming barren.
*   **Returns:** Nothing.

### `onpickedfn(inst, picker)`
*   **Description:** Triggered when grass is picked (harvested). Plays a pickup sound, the `picking` animation, triggers morph logic on luck success, and transitions animation state.
*   **Parameters:** `inst` (entity) - the grass instance; `picker` (entity) - the entity performing the pick action (typically a player).
*   **Returns:** Nothing.
*   **Error states:** If `picker` is `nil` or not a player, morphing is skipped.

### `triggernearbymorph(inst, quick, range)`
*   **Description:** Finds nearby grass instances within `range` and triggers morphing or relay timers on eligible grasses, potentially expanding the search radius if none found.
*   **Parameters:** `inst` (entity) - the trigger source; `quick` (boolean) - whether to use faster morph timers; `range` (number) - the radius to search.
*   **Returns:** Nothing.

### `onmorphtimer(inst, data)`
*   **Description:** Handles timer completion events (`morphing`, `morphrelay`) for morphing grass into grass geckos. Checks density limits and spawns a `grassgekko` if conditions are met, otherwise delays and re-scans.
*   **Parameters:** `inst` (entity) - the grass instance; `data` (table) - timer event data containing `name` of completed timer.
*   **Returns:** Nothing.
*   **Error states:** Grass is only morphed if not already at max density (`TUNING.GRASSGEKKO_MAX_DENSITY`) and passes `canmorph()` check (current animation is `idle`).

### `makemorphable(inst)`
*   **Description:** Adds `worldsettingstimer` and related timers (`morphdelay`, `morphing`, `morphrelay`) to enable morphing, and registers the `timerdone` event listener.
*   **Parameters:** `inst` (entity) - the grass instance.
*   **Returns:** Nothing.
*   **Error states:** Only adds components/timers if `worldsettingstimer` is not already present.

### `ontransplantfn(inst)`
*   **Description:** Called when grass is transplanted (e.g., via dig action followed by planting). Makes the grass barren and reinitializes morph timers.
*   **Parameters:** `inst` (entity) - the grass instance.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` - fires `onmorphtimer` to handle morphing timers; `animover` on `grasspartfx` to remove the entity after animation ends.
- **Pushes:** `loot_prefab_spawned` - fired by `lootdropper:SpawnLootPrefab` when loot is dropped (via `dig_up`); no direct pushes from grass itself beyond component events.