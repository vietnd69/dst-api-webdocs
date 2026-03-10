---
id: messagebottletreasures
title: Messagebottletreasures
description: Provides utility functions to generate and manage treasure items in message bottle containers based on weighted templates and loot presets.
tags: [inventory, loot, utility]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 04a931f3
system_scope: inventory
---

# Messagebottletreasures

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`messagebottletreasures` is a utility module that defines loot generation logic for message bottle-related containers (e.g., `sunkenchest`). It specifies treasure type templates with associated weightings, content presets, guaranteed and randomly selected loot, and provides functions to spawn populated treasure instances. It depends on the `container` and `inventory` components to populate and manage item slots.

## Usage example
```lua
local messagebottletreasures = require "messagebottletreasures"

-- Spawn a randomized treasure at position {x=0, y=0, z=0}
local treasure = messagebottletreasures.GenerateTreasure({x=0, y=0, z=0})

-- Spawn a specific chest type with guaranteed loot
local special_chest = messagebottletreasures.GenerateTreasure(
    {x=5, y=0, z=5},
    "sunkenchest",
    false,
    nil,
    TheFrontEnd:GetCurrentPlayer()
)

-- Retrieve all prefabs involved in treasure generation
local all_treasure_prefabs = messagebottletreasures.GetPrefabs()
```

## Dependencies & tags
**Components used:** `container`, `inventory`  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `GenerateTreasure(pt, overrideprefab, spawn_as_empty, postfn, doer)`
*   **Description:** Spawns a treasure container at the specified position and populates it with loot based on weighted templates. Loot includes guaranteed items and randomly selected items from predefined sets. It may also add `ancienttree_seed` or a random `trinket_*` item if capacity allows and luck checks pass.
*   **Parameters:**
    *   `pt` (table) — Position coordinates `{x, y, z}` for spawning.
    *   `overrideprefab` (string or `nil`) — Specific prefab name to spawn; if `nil`, a random prefab is selected based on weights.
    *   `spawn_as_empty` (boolean) — If `true`, spawns an empty container without any loot.
    *   `postfn` (function or `nil`) — Optional callback invoked after loot generation, passing the treasure instance.
    *   `doer` (entity or `nil`) — Entity responsible for the luck roll (used for deterministic RNG in multiplayer).
*   **Returns:** `entity` or `nil` — The spawned treasure entity, or `nil` if spawning failed.
*   **Error states:** Returns `nil` if `SpawnPrefab` fails (e.g., invalid prefab name or world error). Loot generation is skipped if the container has no `container` or `inventory` component, or if `weighted_treasure_contents[prefab]` is empty/missing.

### `GetPrefabs()`
*   **Description:** Returns a list of all prefab names used in the treasure system, including container prefabs (e.g., `sunkenchest`), guaranteed/random loot items, and trinkets.
*   **Parameters:** None.
*   **Returns:** `table` — A flat list of strings (`{ "prefab1", "prefab2", ... }`).

## Events & listeners
None identified