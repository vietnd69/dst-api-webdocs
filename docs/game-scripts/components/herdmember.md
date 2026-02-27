---
id: herdmember
title: Herdmember
description: Manages an entity's membership in a herd, including herd creation, joining, and departure logic.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: fdcac55f
---

# Herdmember

## Overview
This component tracks and manages an entity's association with a herd. It handles automatic herd creation or reassignment, tag management, and membership lifecycle events such as leaving or rejoining a herd.

## Dependencies & Tags
- **Dependencies**:  
  - `health` component (used to prevent herd creation for dead entities)  
- **Tags added/removed**:  
  - Adds `"herdmember"` tag when enabled  
  - Removes `"herdmember"` tag when disabled or component removed  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | `boolean` | `true` | Controls whether the entity actively participates in herd behavior (e.g., herd creation, membership). |
| `herd` | `GODATA?` | `nil` | Reference to the `herd` entity this member belongs to (may be invalid or `nil`). |
| `herdprefab` | `string` | `"beefaloherd"` | Prefab name of the herd to spawn if no herd exists. |
| `task` | `GDTASK?` | `nil` | Delayed task reference used for deferred herd initialization. |

## Main Functions

### `SetHerd(herd)`
* **Description:** Assigns the given `herd` entity as this member’s current herd.
* **Parameters:**  
  - `herd` (`GODATA?`): The herd entity to associate with.

### `SetHerdPrefab(prefab)`
* **Description:** Updates the prefab name used when creating a new herd.
* **Parameters:**  
  - `prefab` (`string`): The new prefab name (e.g., `"beefaloherd"`).

### `GetHerd()`
* **Description:** Returns the current herd reference.
* **Returns:** `GODATA?` — The currently assigned herd entity.

### `CreateHerd()`
* **Description:** Spawns a new herd entity (using `herdprefab`) at the member’s current position and triggers herd-wide gathering if the herd has a `herd` component. Only runs if enabled, no valid herd exists, and the member is alive.
* **Parameters:** None.

### `Leave()`
* **Description:** Removes this entity from its current herd (if valid) and schedules a respawn of a new herd after a 5-second delay, provided the component remains enabled.
* **Parameters:** None.

### `Enable(enabled)`
* **Description:** Enables or disables the component. Disabling removes the member from its herd; enabling without a valid herd schedules herd creation after 5 seconds.
* **Parameters:**  
  - `enabled` (`boolean`): Whether to enable participation in herd behavior.

### `GetDebugString()`
* **Description:** Returns a debug string containing the current herd reference and whether the component is disabled.
* **Returns:** `string` — e.g., `"herd:beefaloherd:123 disabled"` or `"herd:nil"`.

## Events & Listeners
- **Listens for**:  
  - `enabled` event (via setter in class definition) → triggers `onenabled(self, enabled)` to add/remove `"herdmember"` tag  
- **Pushes/Triggers**:  
  - None directly (relies on herd component methods like `RemoveMember` for side effects)