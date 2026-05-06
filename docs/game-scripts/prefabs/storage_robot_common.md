---
id: storage_robot_common
title: Storage Robot Common
description: Utility module providing helper functions for Storage Robot entity logic, including spawn point management and item collection routines.
tags: [utility, inventory, ai, storage]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 90021a05
system_scope: entity
---

# Storage Robot Common

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`storage_robot_common` is a utility module returned as a table of functions and constants. It is designed to support Storage Robot prefabs by managing spawn point locations via `knownlocations` and providing search logic for finding containers and items to pick up. This module does not attach as a component but is required and called by other scripts or components controlling storage robot behavior.

## Usage example
```lua
local storage_utils = require("prefabs/storage_robot_common")

-- Update the spawn point for a storage robot instance
storage_utils.UpdateSpawnPoint(inst, false)

-- Find a container near the spawn point that holds a specific item
local container = storage_utils.FindContainerWithItem(inst, item, 0)

-- Access filtering constants for custom search logic
local tags = storage_utils.CONTAINER_MUST_TAGS
```

## Dependencies & tags
**External dependencies:**
- `TheSim` -- used for `FindEntities` in search functions
- `TUNING` -- accesses `STORAGE_ROBOT_WORK_RADIUS` and `STACK_SIZE_MEDITEM`
- `Vector3` -- used for position calculations and conversions

**Components used:**
- `knownlocations` -- stores and retrieves spawn point positions (`RememberLocation`, `GetLocation`, `ForgetLocation`)
- `container` -- checks container type, openness, and item presence (`Has`, `CanAcceptCount`, `type`, `canbeopened`)
- `inventory` -- checks owned items (`HasItemThatMatches`)
- `inventoryitem` -- checks if item can be picked up or stored (`canbepickedup`, `cangoincontainer`, `IsHeld`)
- `stackable` -- checks stack compatibility and size (`CanStackWith`, `maxsize`, `StackSize`)
- `dryingrack` -- excluded from container search
- `bait` -- excluded from pickup logic if attached to a trap
- `trap` -- excluded from pickup logic
- `physics` -- checks collision masks and active state
- `transform` -- retrieves world position (`GetWorldPosition`)
- `brain` -- checks item ignore status (`UnignoreItem`, `ShouldIgnoreItem`)

**Tags:**
- `_container` -- check (CONTAINER_MUST_TAGS)
- `wx78_backupbody` -- check (CONTAINER_CANT_TAGS)
- `companion` -- check (CONTAINER_CANT_TAGS)
- `portablestorage` -- check (CONTAINER_CANT_TAGS)
- `mermonly` -- check (CONTAINER_CANT_TAGS)
- `mastercookware` -- check (CONTAINER_CANT_TAGS)
- `FX` -- check (CONTAINER_CANT_TAGS)
- `NOCLICK` -- check (CONTAINER_CANT_TAGS)
- `DECOR` -- check (CONTAINER_CANT_TAGS)
- `INLIMBO` -- check (CONTAINER_CANT_TAGS / PICKUP_CANT_TAGS)
- `_inventoryitem` -- check (PICKUP_MUST_TAGS)
- `irreplaceable` -- check (PICKUP_CANT_TAGS)
- `knockbackdelayinteraction` -- check (PICKUP_CANT_TAGS)
- `event_trigger` -- check (PICKUP_CANT_TAGS)
- `mineactive` -- check (PICKUP_CANT_TAGS)
- `catchable` -- check (PICKUP_CANT_TAGS)
- `fire` -- check (PICKUP_CANT_TAGS)
- `spider` -- check (PICKUP_CANT_TAGS)
- `cursed` -- check (PICKUP_CANT_TAGS)
- `heavy` -- check (PICKUP_CANT_TAGS)
- `outofreach` -- check (PICKUP_CANT_TAGS)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `CONTAINER_MUST_TAGS` | table | `{ "_container" }` | Tags required for entities to be considered valid containers. |
| `CONTAINER_CANT_TAGS` | table | `{ ... }` | Tags that disqualify entities from being considered valid containers. |
| `ALLOWED_CONTAINER_TYPES` | table | `{ "chest", "pack" }` | Allowed `container.type` values for storage operations. |
| `PICKUP_MUST_TAGS` | table | `{ "_inventoryitem" }` | Tags required for entities to be considered valid pickup items. |
| `PICKUP_CANT_TAGS` | table | `{ ... }` | Tags that disqualify entities from being picked up. |

## Main functions

### `GetSpawnPoint(inst)`
*   **Description:** Retrieves the stored spawn point position for the entity. Prioritizes local platform space if on a platform, otherwise uses world space location or current position.
*   **Parameters:**
    - `inst` -- entity instance with `knownlocations` component
*   **Returns:** `Vector3` position of the spawn point.
*   **Error states:** Errors if `inst.components.knownlocations` is nil (nil dereference on `GetLocation` — no guard present).

### `UpdateSpawnPoint(inst, dont_overwrite)`
*   **Description:** Updates the stored spawn point location to the entity's current position. Handles platform local space conversion if on a platform. Clears brain item ignore status.
*   **Parameters:**
    - `inst` -- entity instance with `knownlocations` and `brain` components
    - `dont_overwrite` -- boolean to prevent overwriting existing location
*   **Returns:** None
*   **Error states:** Errors if `inst.components.knownlocations` is nil (nil dereference on `GetLocation`/`RememberLocation` — no guard present). Errors if `inst.Transform` is nil.

### `UpdateSpawnPointOnLoad(inst)`
*   **Description:** Restores spawn point location from saved data on entity load. Sets dirty flags for origin coordinates.
*   **Parameters:**
    - `inst` -- entity instance with `knownlocations` and `Transform`
*   **Returns:** `boolean` -- `true` if a saved position was found and loaded, `false` otherwise.
*   **Error states:** Errors if `inst.components.knownlocations` is nil. Errors if `inst.Transform` is nil.

### `ClearSpawnPoint(inst)`
*   **Description:** Removes stored spawn point locations (both world and local).
*   **Parameters:**
    - `inst` -- entity instance with `knownlocations` component
*   **Returns:** None
*   **Error states:** Errors if `inst.components.knownlocations` is nil (nil dereference on `ForgetLocation` — no guard present).

### `FindContainerWithItem(inst, item, count)`
*   **Description:** Searches for a valid container near the spawn point that already contains the specified item and has room for more. Excludes drying racks and specific tags.
*   **Parameters:**
    - `inst` -- owner entity instance
    - `item` -- item entity to match
    - `count` -- number of items already accounted for (default `0`)
*   **Returns:** Container entity instance or `nil` if none found.
*   **Error states:** Errors if `inst.components.knownlocations` is nil (via `GetSpawnPoint`). Errors if `item` is nil (nil dereference on `item.components.stackable`).

### `FindItemToPickupAndStore_filter(inst, item, match_item)`
*   **Description:** Internal filter logic exposed for modding. Validates if an item can be picked up and stored based on components, tags, physics, and container availability.
*   **Parameters:**
    - `inst` -- owner entity instance
    - `item` -- candidate item entity
    - `match_item` -- optional item to check stack compatibility against
*   **Returns:** `item`, `container` if valid, or `nil` if checks fail.
*   **Error states:** Errors if `item` is nil (nil dereference on `item:HasTag`/`item.components`). Errors if `inst.components.inventory` is missing.

### `FindItemToPickupAndStore(inst, match_item)`
*   **Description:** Scans entities within work radius to find a valid item to pick up and store using the filter function.
*   **Parameters:**
    - `inst` -- owner entity instance
    - `match_item` -- optional item to check stack compatibility against
*   **Returns:** `item`, `container` if found, or `nil`.
*   **Error states:** Errors if `inst.Transform` is nil. Errors if `inst.components.knownlocations` is nil (inherited from `GetSpawnPoint`).