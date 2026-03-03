---
id: desolationspawner
title: Desolationspawner
description: Manages timed regrowth of trees and plants in desolation zones based on world topology and time multipliers.
tags: [world, map, regrowth]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 9ce08784
system_scope: world
---

# Desolationspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Desolationspawner` is a world-level component responsible for scheduling and triggering the regrowth of specific tree types in desolation zones (e.g., areas previously stripped of trees). It operates only on the server (master simulation) and uses world topology data to determine spawn locations, respecting constraints like proximity to players, existing structures, and terrain rules. The component supports configurable replacement prefabs, regrowth times, and time multipliers per tree type.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("desolationspawner")

-- Configure custom regrowth behavior
inst.components.desolationspawner:SetSpawningForType(
    "custom_tree",
    "custom_sapling",
    300, -- regrowtime in seconds
    {"custom_tree"}, -- searchtags for existing seeded entities
    function() return TUNING.REGROWTH_TIME_MULTIPLIER end
)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None added or checked

## Properties
No public properties

## Main functions
### `SetSpawningForType(prefab, product, regrowtime, searchtags, timemult)`
* **Description:** Registers or reconfigures the regrowth behavior for a given source `prefab`. The system will spawn `product` in locations associated with `prefab` after the specified `regrowtime` has elapsed, adjusted by `timemult`.
* **Parameters:**
  * `prefab` (string) — the source tree/prefab type that triggers regrowth (e.g., `"evergreen"`).
  * `product` (string) — the prefab to spawn upon regrowth (e.g., `"pinecone_sapling"`).
  * `regrowtime` (number) — base time (in seconds) required before regrowth occurs.
  * `searchtags` (table of strings) — tags used to search for existing entities that would block regrowth (to prevent overcrowding).
  * `timemult` (function) — a callback returning a time multiplier (e.g., based on season or moon phase). Should return `0` to pause regrowth.
* **Returns:** Nothing.
* **Error states:** No explicit validation is performed on inputs. Misconfigured `timemult` returning `nil` defaults to `1`.

### `LongUpdate(dt)`
* **Description:** Advances internal timers for all registered tree types and attempts to spawn one regrowth instance if its timer has elapsed. Only one regrowth attempt is made per update for performance.
* **Parameters:**
  * `dt` (number) — delta time elapsed since last update.
* **Returns:** Nothing.
* **Error states:** silently skips regrowth if:
  * no available area points are found,
  * placement constraints fail (e.g., too close to players, blocked by structures, invalid terrain),
  * or no regrowth timer has elapsed.

### `OnSave()`
* **Description:** Serializes current regrowth state for persistence (e.g., across world saves/loads).
* **Parameters:** None.
* **Returns:** `data` (table) — a table with an `areas` key, mapping area indices to per-prefab data containing `density` and relative `regrowtime` (elapsed since last spawn).
* **Error states:** None identified.

### `OnLoad(data)`
* **Description:** Restores regrowth state from saved data.
* **Parameters:**
  * `data` (table) — saved state, expected to match the format returned by `OnSave`.
* **Returns:** Nothing.
* **Error states:** Skips loading if required fields (`density`, `regrowtime`, `_internaltimes[prefab]`) are missing or `nil`.

### `GetDebugString()`
* **Description:** Returns a formatted string summarizing the next regrowth timers per prefab for debugging.
* **Parameters:** None.
* **Returns:** `s` (string) — e.g., `"pinecone_sapling: 120.0/300.0 mushtree_tall: 45.5/200.0"`.
* **Error states:** None identified.

## Events & listeners
- **Listens to:** None — timing is driven by `DoPeriodicTask` and `DoTaskInTime`.
- **Pushes:** None — does not emit events directly.
