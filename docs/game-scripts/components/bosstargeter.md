---
id: bosstargeter
title: Bosstargeter
description: Tracks and manages the selection of boss entities for targeting, ensuring only valid bosses are considered for interaction by players and AI.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: d41d8cd9
---

# Bosstargeter

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `bosstargeter` component is responsible for enabling an entity to identify and track valid boss targets in the world. It provides utilities to query, validate, and maintain awareness of nearby entities that are tagged as bosses, and supports actions such as selecting a target or responding to changes in boss presence. This component is typically attached to entities that need to interact with or target bosses (e.g., players, AI agents), and helps avoid hardcoding boss detection logic across multiple scripts.

## Dependencies & Tags
- **Components used:** None
- **Tags:** Checks for and relies on the `"boss"` tag being present on target entities. Does not add, remove, or modify tags itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | `EntityInst` or `nil` | `nil` | The currently selected boss entity. `nil` if no valid boss is in range or selected. |

## Main Functions
### `IsBoss(inst)`
* **Description:** Validates whether the provided entity instance is considered a boss. Checks for the presence of the `"boss"` tag.
* **Parameters:**  
  `inst` (`EntityInst`) — The entity to validate as a boss.
* **Returns:** `boolean` — `true` if the entity has the `"boss"` tag, otherwise `false`.

### `SetTarget(target)`
* **Description:** Sets the current target to the specified boss entity. Validates that the entity is a boss before assignment.
* **Parameters:**  
  `target` (`EntityInst` or `nil`) — The boss entity to set as the current target, or `nil` to clear the target.
* **Returns:** `nil`

### `GetTarget()`
* **Description:** Returns the currently set target entity.
* **Parameters:** None
* **Returns:** `EntityInst` or `nil` — The current boss target, or `nil` if no target is set.

### `OnTargetLost()`
* **Description:** Callback invoked when the current target is lost (e.g., despawned or invalidated). Clears the `target` property and resets awareness.
* **Parameters:** None
* **Returns:** `nil`

### `FindNearestBoss(position, maxDist)`
* **Description:** Scans for the nearest valid boss entity to a given position, optionally limited by a maximum distance. Excludes invalid or non-boss entities.
* **Parameters:**  
  `position` (`Vector3`) — The reference point for proximity search.  
  `maxDist` (`number`) — Maximum distance radius to search for bosses. Use `nil` or omit for no distance limit.
* **Returns:** `EntityInst` or `nil` — The nearest boss within range, or `nil` if none found.

## Events & Listeners
- **Listens to:**  
  - `"onremove"` — When the target entity is removed from the world, triggers `OnTargetLost()` to clear `self.target`.
- **Pushes:**  
  - `"bosstargetchanged"` — Fired when `SetTarget()` changes the target (i.e., target is set to a different boss or cleared). Payload includes the new target (`nil` or `EntityInst`).