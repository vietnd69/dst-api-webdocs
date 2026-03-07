---
id: driftwood_trees
title: Driftwood Trees
description: Defines prefabs for driftwood trees and implements their chopping, burning, stump conversion, and persistence behavior.
tags: [environment, object, tree, loot]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f1493012
system_scope: environment
---

# Driftwood Trees

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`driftwood_trees.lua` defines the prefabs and associated logic for the three types of driftwood trees (`driftwood_tall`, `driftwood_small1`, and `driftwood_small2`). It implements tree-specific behaviors including chopping, burning, stump conversion, and loot dropping. It integrates with the `burnable`, `inspectable`, `lootdropper`, and `workable` components to manage state transitions and persistence across saves.

## Usage example
```lua
-- Create a small driftwood tree
local tree = Prefab("driftwood_small1")()
tree:GetPosition()  -- Query position for loot spawning

-- Inspect tree status (e.g., "BURNING", "BURNT", "CHOPPED")
local status = tree.components.inspectable.getstatus(tree)
```

## Dependencies & tags
**Components used:** `burnable`, `inspectable`, `lootdropper`, `workable`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`, `physics`, `propagator`, `hauntable`

**Tags added/checked:** `plant`, `tree`, `burnt`, `stump`, `structure` (via `MakeLargeBurnable`), `small_tree`/`large_tree` (via `MakeSmallBurnable`/`MakeLargeBurnable`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `is_large` | boolean | `nil` (set in master sim only) | Indicates whether the tree is a tall driftwood tree. |

## Main functions
### `make_stump(inst, is_burnt)`
*   **Description:** Converts a felled or burnt driftwood tree into a stump. Removes non-stump components and adds workable/stump-related logic. If not burnt, prepares it for digging.
*   **Parameters:** `inst` (entity) — the tree instance; `is_burnt` (boolean) — whether the tree is already burnt.
*   **Returns:** Nothing.
*   **Error states:** Assumes `inst` has the necessary components before removal; may silently fail if components are missing.

### `on_chopped_down(inst, chopper)`
*   **Description:** Handles the event when a non-burnt driftwood tree is fully chopped. Plays animations, spawns loot, and creates a stump.
*   **Parameters:** `inst` (entity) — the tree being chopped; `chopper` (entity or `nil`) — the entity performing the chop.
*   **Returns:** Nothing.
*   **Error states:** Drops loot at a position offset relative to the player's side only for large trees; small trees drop loot at their position.

### `on_chopped_down_burnt(inst, chopper)`
*   **Description:** Handles the event when a burnt driftwood tree (or small burnt tree) is chopped down after burning. Converts small trees to stumps and removes large burnt trees.
*   **Parameters:** `inst` (entity) — the burnt tree; `chopper` (entity or `nil`).
*   **Returns:** Nothing.

### `on_burnt(inst)`
*   **Description:** Transforms a burnt driftwood tree into its burnt state. Updates loot table to charcoal, adjusts work callback, and applies burnt visuals.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Returns a string status for display in the inspector UI (`"BURNING"`, `"BURNT"`, `"CHOPPED"`, or `nil`).
*   **Parameters:** `inst` (entity).
*   **Returns:** `string?` — status label.
*   **Error states:** Returns `nil` if none of the conditions are met.

### `onsave(inst, data)`
*   **Description:** Serializes tree state (`burnt`, `stump`) into the save data table.
*   **Parameters:** `inst` (entity); `data` (table) — save data table to populate.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores tree state during load. Recreates stumps or applies burnt state as needed.
*   **Parameters:** `inst` (entity); `data` (table?) — loaded save data or `nil`.
*   **Returns:** `nil`.

## Events & listeners
- **Listens to:** `animover` — removes the entity once a falling or chop animation completes (for both normal and burnt trees).
- **Pushes:** `loot_prefab_spawned` — via `lootdropper:SpawnLootPrefab` when loot is dropped.
- **Custom events:** `onfinish` callback (`on_chopped_down` or `on_chopped_down_burnt`) triggered when workable work completes; `onwork` callback (`on_chop`) triggered during each chop action.