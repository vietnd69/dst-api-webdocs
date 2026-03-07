---
id: storage_robot_common
title: Storage Robot Common
description: Provides shared utility functions for storage robots to manage spawn points and locate items/containers for automated storage operations.
tags: [inventory, automation, navigation]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: eeea6075
system_scope: inventory
---

# Storage Robot Common

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`storage_robot_common.lua` is a utility module that encapsulates shared logic for storage robot prefabs. It does not define a component, but rather a collection of functions and constants used to locate valid spawn points, find items to pick up and store, and identify suitable containers. The module is designed to be shared across storage robot prefabs (e.g., `storage_robot`, `storage_robot_v2`) and supports modding via its exported table (`fns`). It interacts primarily with `knownlocations`, `container`, `inventory`, `inventoryitem`, `bait`, and `trap` components.

## Usage example
```lua
local storage_common = require "prefabs/storage_robot_common"

-- Get or update the robot's spawn point
local spawn_pos = storage_common.GetSpawnPoint(inst)
storage_common.UpdateSpawnPoint(inst)

-- Find an item to store and its target container
local item, container = storage_common.FindItemToPickupAndStore(inst, desired_item_prefab)
```

## Dependencies & tags
**Components used:**  
- `knownlocations` (for remembering/forgetting spawn points)  
- `container` (to verify acceptance capacity and contents)  
- `inventory` (to count existing items in robot’s inventory)  
- `inventoryitem` (to verify pickup eligibility)  
- `bait` and `trap` (to exclude baits and active traps)  

**Tags:**  
- Must tags for containers: `"_container"`  
- Must tags for pickup items: `"_inventoryitem"`  
- Cannot tags for containers: `"portablestorage"`, `"mermonly"`, `"mastercookware"`, `"FX"`, `"NOCLICK"`, `"DECOR"`, `"INLIMBO"`  
- Cannot tags for pickup items: `"INLIMBO"`, `"NOCLICK"`, `"irreplaceable"`, `"knockbackdelayinteraction"`, `"event_trigger"`, `"mineactive"`, `"catchable"`, `"fire"`, `"spider"`, `"cursed"`, `"heavy"`, `"outofreach"`  

## Properties
No public properties. The module exports only functions and constants (see `Main functions` and `Dependencies & tags`).

## Main functions
### `GetSpawnPoint(inst)`
* **Description:** Returns the stored spawn point position for the robot. Prioritizes a platform-local spawn point if available and a platform exists; otherwise falls back to a world-space spawn point or the robot’s current position.
* **Parameters:** `inst` (Entity) — the robot entity instance.
* **Returns:** `Vector3` — the spawn point position in world space.

### `UpdateSpawnPoint(inst, dont_overwrite)`
* **Description:** Records the robot’s current position as a new spawn point, storing both world-space and platform-local (if applicable) versions. Clears any active brain ignoring state.
* **Parameters:**  
  - `inst` (Entity) — the robot entity instance.  
  - `dont_overwrite` (boolean, optional) — if true, does not overwrite an existing spawn point.  
* **Returns:** Nothing.

### `UpdateSpawnPointOnLoad(inst)`
* **Description:** Restores origin coordinates from stored spawn point during loading. Ensures `_originx` and `_originz` are set correctly. Used for consistent navigation serialization.
* **Parameters:** `inst` (Entity) — the robot entity instance.
* **Returns:** `boolean` — `true` if a spawn point was found and loaded, `false` otherwise.

### `ClearSpawnPoint(inst)`
* **Description:** Removes both world and local spawn point entries from `knownlocations`.
* **Parameters:** `inst` (Entity) — the robot entity instance.
* **Returns:** Nothing.

### `FindContainerWithItem(inst, item, count)`
* **Description:** Scans nearby entities for a valid container that already contains the specified item and has capacity to accept more. Filters by type (`chest`, `pack`), accessibility, and platform compatibility.
* **Parameters:**  
  - `inst` (Entity) — the robot entity instance.  
  - `item` (Entity) — the item prefab to check for and accept.  
  - `count` (number, optional) — minimum required free stack space; defaults to `0`.  
* **Returns:** `Entity | nil` — the first valid container entity, or `nil` if none found.

### `FindItemToPickupAndStore(inst, match_item)`
* **Description:** Scans the robot’s work radius for eligible items that should be picked up and stored. Uses `FindItemToPickupAndStore_filter` to validate items and locate a matching container.
* **Parameters:**  
  - `inst` (Entity) — the robot entity instance.  
  - `match_item` (Entity | nil) — if provided, only items matching its `prefab` and `skinname` are considered.  
* **Returns:** `item (Entity), container (Entity) | nil, nil` — the item to pick up and its target container, or `nil` if no valid pair is found.

### `FindItemToPickupAndStore_filter(inst, item, match_item)`
* **Description:** Filter function used internally to validate a single candidate item. Checks tags, pickup eligibility, physics interaction, platform, brain ignoring rules, bait/trap status, inventory capacity, and container availability.
* **Parameters:**  
  - `inst` (Entity) — the robot entity instance.  
  - `item` (Entity) — the candidate pickup item.  
  - `match_item` (Entity | nil) — optional item to match `prefab` and `skinname`.  
* **Returns:** `item (Entity), container (Entity) | nil, nil` — the item and container if valid, otherwise `nil`.

## Events & listeners
None identified — this module provides static utility functions and does not register or fire events.