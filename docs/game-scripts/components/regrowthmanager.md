---
id: regrowthmanager
title: Regrowthmanager
description: Manages regrowth logic for specific prefabs by scheduling and executing regrowth events based on time, environment conditions, and spatial constraints.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 39e9381e
---

# Regrowthmanager

## Overview
The RegrowthManager component orchestrates the delayed regrowth of specific in-game entities (e.g., plants, mushrooms, dens) on the master simulation. It tracks scheduled regrowth events, applies time multipliers based on world state (season, time of day, weather), enforces biome and spacing constraints, and spawns new instances once their regrowth timer completes.

## Dependencies & Tags
- **Component dependency**: None explicitly required on the host entity (`inst`).
- **Tags used internally**: `"structure"`, `"wall"`, `"regrowth_blocker"` (in `REGROWBLOCKER_ONEOF_TAGS`).
- **System scope**: Requires `TheWorld.ismastersim`; fails if instantiated on the client.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | Reference to the entity this component is attached to (typically the world). |
| `_worldstate` | `WorldState` | `TheWorld.state` | Internal reference to current world state (season, time, weather, etc.). |
| `_map` | `Map` | `TheWorld.Map` | Reference to the terrain map. |
| `_internaltimes` | `table` | `{}` | Tracks cumulative time elapsed per prefab type since last regrowth. |
| `_regrowthvalues` | `table` | `{}` | Stores per-prefab configuration: `regrowtime`, `product`, and `timemult` function. |
| `_lists` | `table` | `{}` | Maps prefab names to `LinkedList` of pending regrowth timers. |

## Main Functions

### `SetRegrowthForType(prefab, regrowtime, product, timemult)`
* **Description**: Configures regrowth behavior for a given prefab by storing its base regrowth time, spawn target, and time multiplier function.
* **Parameters**:
  - `prefab`: `string` — Name of the prefab to configure.
  - `regrowtime`: `number` — Base regrowth duration (in seconds).
  - `product`: `string` — Name of the prefab to spawn upon successful regrowth.
  - `timemult`: `function` — Returns a multiplier based on current world state (e.g., season, time of day).

### `LongUpdate(dt)`
* **Description**: Periodically processes all pending regrowth timers per prefab type. Advances internal timers, checks conditions, and spawns new entities when thresholds are met. Handles success, cached (retry), and failure (reset) cases.
* **Parameters**:
  - `dt`: `number` — Delta time (seconds) elapsed since last update.

### `OnSave()`
* **Description**: Serializes pending regrowth timers for save compatibility. Stores relative regrowth times and positions.
* **Returns**: `table` — Save data containing `timers`, a nested table mapping prefab names to lists of timer objects.

### `OnLoad(data)`
* **Description**: Restores pending regrowth timers from saved data. Reconstructs timer objects with absolute regrowth thresholds and positions.
* **Parameters**:
  - `data`: `table` — Save data as returned by `OnSave()`.

### `GetDebugString()`
* **Description**: Generates a debug string listing active regrowth timers for each prefab (count, next regrowth time, time multiplier).
* **Returns**: `string` — Multi-line debug output.

### `DoRegrowth(key, product, position)`
* **Description**: Attempts to spawn `product` at a jittered position near `position`, checking terrain, spacing, and player proximity constraints.
* **Parameters**:
  - `key`: `string` — Prefab name being regrown (used for logging/config lookup).
  - `product`: `string` — Name of the prefab to spawn.
  - `position`: `Point` — Target position for regrowth center.
* **Returns**: `number` — Status code (`0 = SUCCESS`, `1 = FAILED`, `2 = CACHE`).

## Events & Listeners
- **Listens to**:
  - `"beginregrowth"` → `OnBeginRegrowth(src, target)`: Registers a new regrowth timer when the event is pushed (typically when a plant is harvested).
- **No events are pushed** by this component.