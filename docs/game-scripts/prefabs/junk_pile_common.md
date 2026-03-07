---
id: junk_pile_common
title: Junk pile common
description: Provides shared loot generation and dependency tracking logic for junk pile entities in DST.
tags: [loot, spawn, utility]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 19ec728b
system_scope: world
---

# Junk pile common

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`junk_pile_common.lua` is a utility module that defines loot tables and helper functions for spawning loot and creatures from junk piles. It centralizes the logic for weighted random selection of critters and items, perishable item initialization, and prefab dependency registration. This module does not define a component itself but returns a table of constants and functions intended for reuse across multiple junk pile-related prefabs.

The module interacts with the `lootdropper`, `combat`, `perishable`, and `inventory` components to spawn, fling, target, and position items or creatures.

## Usage example
```lua
local junk_pile_common = require "prefabs/junk_pile_common"

-- Use the loot generation function
junk_pile_common.SpawnJunkLoot(junk_pile_inst, digger_inst, false)

-- Register prefabs for preloading
local prefabs = {}
junk_pile_common.AddPrefabDeps(prefabs)
```

## Dependencies & tags
**Components used:** `lootdropper`, `combat`, `perishable`, `inventory`  
**Tags:** None identified.

## Properties
No public properties. This module exports only functions and lookup tables in the returned table.

## Main functions
### `SpawnJunkLoot(inst, digger, nopickup)`
*   **Description:** Spawns either a random critter (with low chance) or a random item from the junk pile. If spawning a critter, it may be given a combat target (e.g., the digger) and directed into an attack state. Items may be given to the digger’s inventory or flung into the world.
*   **Parameters:**
    *   `inst` (Entity) — The junk pile entity; used to call `lootdropper:FlingItem`.
    *   `digger` (Entity) — The entity that dug up the pile; used as potential combat target and inventory recipient.
    *   `nopickup` (boolean) — If `true`, items are always flung instead of given to inventory.
*   **Returns:** Nothing.
*   **Error states:** No critter spawns if `enabled_tuning` is defined and evaluates to `false`. No item spawns if the weighted selection yields `EMPTY`. Critters without `combat` component ignore targeting logic.

### `AddPrefabDeps(prefabs)`
*   **Description:** Populates the provided `prefabs` table with all critter and item prefabs referenced in the loot tables (excluding `EMPTY`).
*   **Parameters:**
    *   `prefabs` (table, array) — A table to append prefab names into.
*   **Returns:** Nothing.

## Events & listeners
None — this module is purely functional and does not attach or respond to any events.