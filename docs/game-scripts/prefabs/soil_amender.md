---
id: soil_amender
title: Soil Amender
description: Manages the lifecycle, fertilizer properties, and degradation behavior of the Soil Amender item, transitioning between fresh, stale, and spoiled states based on perishable status.
tags: [inventory, food, farming, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8ce20bbd
system_scope: environment
---

# Soil Amender

> Based on game build **714000** | Last updated: 2026-03-07

## Overview
`soil_amender` is a prefab that implements a consumable fertilizer item which degrades over time through three states: fresh, stale, and spoiled. Each state provides different fertilizer potency and soil-cycle values, determined dynamically by the `perishable` component. The prefab integrates with `fertilizer`, `fertilizerresearchable`, `perishable`, and `finiteuses` components to support gameplay mechanics like farming and crafting. It also handles unique visual and audio feedback (e.g., percolation animations) and network synchronization of its current degradation state.

## Usage example
```lua
-- Typical use in a player action (e.g., applying fertilizer)
local fertilizer = SpawnPrefab("soil_amender")
fertilizer.Transform:SetPosition(x, y, z)
player.components.inventory:GiveItem(fertilizer)

-- Later, when the player uses the fertilizer:
if fertilizer.components.fertilizer then
    fertilizer.components.fertilizer:Apply(targetSoil)
end
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `fertilizerresearchable`, `fertilizer`, `perishable`, `finiteuses`  
**Tags added:** `fertilizerresearchable`, `show_spoilage`  
**Tags checked:** `fresh`, `stale`, `spoiled` (via `inst:HasTag()`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fertilizerkey` | string | `"soil_amender_low"` (initial) | Unique identifier for research and fertilizer definition lookups. Updates when `fertilizer_index` changes. |
| `fertilizer_index` | net_tinybyte | `1` | Networked integer (`1`, `2`, or `3`) mapping to `soil_amender_low`, `soil_amender_med`, or `soil_amender_high`. |
| `GetFertilizerKey` | function | `GetFertilizerKey(inst)` | Getter function returning `fertilizerkey`. |

## Main functions
### `percolate(inst, anim, delay, pre_anim)`
*   **Description:** Plays looping animation and sound for the Soil Amender’s degradation state (e.g., fresh, stale, spoiled), scheduling the next percolation event. Used to create visual/auditory feedback for degradation.
*   **Parameters:**
    *   `anim` (string) — Base animation name (`"fresh"`, `"stale"`, `"spoiled"`, `"fermented"`).
    *   `delay` (number) — Base delay in seconds before next percolation.
    *   `pre_anim` (string?, optional) — Optional pre-animation name (e.g., `"stale_pre"`) to play before the loop.
*   **Returns:** Nothing.
*   **Error states:** No-op if `POPULATING`, entity is asleep, or in limbo; cancels previous `percolate_task`.

### `getdisplayname(inst)`
*   **Description:** Returns the localized name based on current spoilage state (`fresh`, `stale`, or `spoiled`).
*   **Parameters:** `inst` (Entity) — The Soil Amender instance.
*   **Returns:** string — One of `STRINGS.NAMES.SOIL_AMENDER_FRESH`, `STRINGS.NAMES.SOIL_AMENDER_STALE`, or `STRINGS.NAMES.SOIL_AMENDER_SPOILED`.

### `getstatus(inst)`
*   **Description:** Provides a short status string for the inspectable UI.
*   **Parameters:** `inst` (Entity) — The Soil Amender instance.
*   **Returns:** `"SPOILED"` if spoiled, `"STALE"` if stale, `nil` otherwise.

### `update_fertilizer(inst)`
*   **Description:** Synchronizes fertilizer properties (`fertilizervalue`, `soil_cycles`, `withered_cycles`, nutrients) and visual/audio feedback based on current `perishable` state. Called on `forceperishchange`.
*   **Parameters:** `inst` (Entity) — The Soil Amender instance.
*   **Returns:** Nothing.

### `bottlereturnfn(inst, is_final_use, doer, target)`
*   **Description:** Replacement logic when the Soil Amender is fully consumed: spawns an empty `messagebottleempty` and places it in the user’s inventory or world.
*   **Parameters:**
    *   `is_final_use` (boolean) — Whether this was the last use.
    *   `doer` (Entity?) — Entity using the item.
    *   `target` (Entity?) — Target entity (e.g., soil patch).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `forceperishchange` — Triggers `update_fertilizer` to refresh properties on forced spoilage changes.
- **Pushes:** None directly (relies on component events like `percentusedchange` from `finiteuses`).
- **Networked events:** `onfertilizerindexdirty` — Internal event used to sync `fertilizer_index` change to `fertilizerkey`.