---
id: commander
title: Commander
description: Manages a group of unit entities (soldiers) that respond to shared commands such as targeting, wake/alert, and distance tracking.
tags: [ai, combat, group, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 186f009b
system_scope: entity
---

# Commander

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Commander` is a component that enables an entity to command and coordinate a group of unit entities ("soldiers") in Don't Starve Together. It maintains an internal list of soldier entities, provides utilities to query and iterate over them, and supports shared behavior such as distributing a target to all soldiers, waking frozen or sleeping soldiers, and optionally tracking distance to keep the group cohesive. This component is typically used for boss mechanics or NPC groups where coordinated behavior is needed.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("commander")

-- Add soldiers
local soldier1 = Prefab("soldier1")
local soldier2 = Prefab("soldier2")
inst.components.commander:AddSoldier(soldier1)
inst.components.commander:AddSoldier(soldier2)

-- Give all soldiers the same target
inst.components.commander:ShareTargetToAllSoldiers(target_entity)

-- Wake any sleeping or frozen soldiers
inst.components.commander:AlertAllSoldiers()
```

## Dependencies & tags
**Components used:** `combat`, `freezable`, `health`, `sleeper`
**Tags:** None added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `soldiers` | table | `{}` | A dictionary mapping soldier entities to `true`; used to track which entities are under command. |
| `numsoldiers` | number | `0` | The total number of currently added soldiers. |
| `trackingdist` | number | `0` | The maximum distance threshold for distance-based tracking. When `> 0`, soldiers outside this radius are removed. |
| `trackingperiod` | number | `3` | The interval (in seconds) between distance checks. |
| `_task` | Task | `nil` | The recurring task that performs distance checks; `nil` when tracking is inactive. |
| `_onremove` | function | (lambda) | Callback invoked when a soldier entity is removed, automatically removing it from the commander's list. |

## Main functions
### `GetNumSoldiers(prefab)`
*   **Description:** Returns the total number of soldiers, optionally filtered by a specific prefab name.
*   **Parameters:** `prefab` (string or `nil`) — if provided, only soldiers with matching `ent.prefab` are counted.
*   **Returns:** number — count of matching soldiers.
*   **Error states:** Returns `0` if no soldiers exist; returns total count if `prefab` is `nil`.

### `CollectSoldiers(tbl, prefab)`
*   **Description:** Fills a given table with soldier entities, optionally filtered by prefab.
*   **Parameters:**  
    * `tbl` (table) — table to populate.  
    * `prefab` (string or `nil`) — if provided, only soldiers matching this prefab are added.
*   **Returns:** Nothing — modifies `tbl` in place.

### `GetAllSoldiers(prefab)`
*   **Description:** Returns a new table containing all soldiers (optionally filtered by prefab).
*   **Parameters:** `prefab` (string or `nil`) — filter by prefab name.
*   **Returns:** table — list of soldier entities.

### `IsSoldier(ent)`
*   **Description:** Checks whether a given entity is currently a soldier under this commander's command.
*   **Parameters:** `ent` (Entity or `nil`) — entity to check.
*   **Returns:** boolean — `true` if `ent` is in `self.soldiers`, otherwise `false`.

### `ForEachSoldier(fn, ...)`
*   **Description:** Iterates over all soldiers and invokes the provided function for each. Note: the `inst` passed to `fn` is always the commander, not the soldier.
*   **Parameters:**  
    * `fn` (function) — callback to invoke per soldier.  
    * `...` — additional arguments passed to `fn`.
*   **Returns:** Nothing.

### `ShareTargetToAllSoldiers(target)`
*   **Description:** Attempts to set the same combat target on all soldiers that have the `combat` component.
*   **Parameters:** `target` (Entity or `nil`) — the target to suggest to all soldiers.
*   **Returns:** Nothing.

### `DropAllSoldierTargets()`
*   **Description:** Clears the combat target for all soldiers that have the `combat` component.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `IsAnySoldierNotAlert()`
*   **Description:** Checks if any soldier is currently asleep or frozen.
*   **Parameters:** None.
*   **Returns:** boolean — `true` if at least one soldier is asleep or frozen, otherwise `false`.

### `AlertAllSoldiers()`
*   **Description:** Wakes up all frozen or sleeping soldiers by calling `Unfreeze()` or `WakeUp()` on their respective components.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `PushEventToAllSoldiers(ev, data)`
*   **Description:** Fires a custom event on every soldier with optional payload data.
*   **Parameters:**  
    * `ev` (string) — event name.  
    * `data` (table or `nil`) — payload data to pass with the event.
*   **Returns:** Nothing.

### `AddSoldier(ent)`
*   **Description:** Adds an entity as a soldier if it is alive and not already in the list. Registers listeners for `death` and `onremove` events.
*   **Parameters:** `ent` (Entity) — the entity to add as a soldier.
*   **Returns:** Nothing.
*   **Error states:** silently skips if the entity is dead or already a soldier.

### `RemoveSoldier(ent)`
*   **Description:** Removes an entity from the soldier list and cleans up associated event listeners.
*   **Parameters:** `ent` (Entity) — the soldier to remove.
*   **Returns:** Nothing.
*   **Error states:** silently skips if the entity is not in the list.

### `SetTrackingDistance(dist)`
*   **Description:** Sets the distance threshold for automatic soldier removal due to distance and starts/stops tracking accordingly.
*   **Parameters:** `dist` (number) — maximum distance (in tiles) before a soldier is considered out of range.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug string summarizing the commander's state.
*   **Parameters:** None.
*   **Returns:** string — formatted string including soldier count, tracking distance, period, and active status.

## Events & listeners
- **Listens to:**  
  * `onremove` — handled by `self._onremove` to remove the entity from the soldier list.  
  * `death` — also handled by `self._onremove`.
- **Pushes:**  
  * `soldierschanged` — fired whenever the soldier list changes (add/remove).  
  * `gotcommander` — fired on the soldier entity when added.  
  * `lostcommander` — fired on the soldier entity when removed.
