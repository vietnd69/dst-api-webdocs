---
id: formationfollower
title: Formationfollower
description: Manages an entity's participation in a formation by tracking leader relationships, positioning updates, and activation state.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 1b54b6a2
---

# Formationfollower

## Overview
This component enables an entity to join, maintain, and leave formations as a follower. It coordinates with a `formationleader` component to determine positioning, handles state changes related to formation type and activity, and updates the entity’s position according to its leader’s instructions.

## Dependencies & Tags
- Relies on `formationleader` component being present on potential leaders (accessed via `components.formationleader`).
- Dynamically adds/removes tags: `formation_<type>` (e.g., `formation_monster`).
- Maintains `formationsearchtags` (e.g., `{"formationleader_monster"}`) for entity searches.
- Starts/stops its own updating via `inst:StartUpdatingComponent(self)` / `inst:StopUpdatingComponent(self)`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity instance. |
| `in_formation` | `boolean` | `false` | Whether the entity is currently in a formation. |
| `formationleader` | `Entity?` | `nil` | Reference to the entity acting as formation leader. |
| `formationpos` | `Vector3?` | `nil` | Target position relative to the leader (set by leader). |
| `searchradius` | `number` | `50` | Radius within which to search for a formation leader. |
| `leashdistance` | `number` | `70` | Distance threshold beyond which the follower may be considered out of range (not actively used in current code). |
| `formation_type` | `string` | `"monster"` | Type identifier used to match follower and leader formations (e.g., `"monster"`). |
| `active` | `boolean` | `false` | Whether the component’s update loop is active. |
| `onupdatefn` | `function?` | `nil` | Optional callback invoked during `OnUpdate` to apply position updates. |
| `formationsearchtags` | `table?` | `nil` | Tags used for searching leaders (e.g., `{"formationleader_monster"}`). Set by `onformationtype` callback. |

## Main Functions

### `StartUpdating()`
* **Description:** Begins the component’s update loop by calling `StartUpdatingComponent` on the owning entity.
* **Parameters:** None.

### `StopUpdating()`
* **Description:** Stops the component’s update loop by calling `StopUpdatingComponent` on the owning entity.
* **Parameters:** None.

### `SearchForFormation(override_find_entities)`
* **Description:** Searches nearby entities for a compatible formation leader. If found, adds this entity as a new formation member via the leader’s `NewFormationMember` method.
* **Parameters:**
  * `override_find_entities` (`table?`, optional): Precomputed list of entities to search instead of performing a new search.

### `OnEntitySleep()`
* **Description:** Called when the entity goes to sleep (e.g., is stored in a container). Notifies the current leader of departure and stops the update loop.
* **Parameters:** None.

### `OnEntityWake()`
* **Description:** Called when the entity wakes (e.g., is removed from a container). Restarts the update loop unless the entity is inside an inventory (checked via `inventoryitem`).
* **Parameters:** None.

### `LeaveFormation()`
* **Description:** Informs the current leader (if any) that this entity is leaving the formation, without modifying internal state beyond nullifying the leader reference on the leader’s side.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Executes the follower’s update callback (`onupdatefn`) if active and leader/position data is available. Used to apply formation-specific movement logic.
* **Parameters:**
  * `dt` (`number`): Delta time since the last frame.

### `GetDebugString()`
* **Description:** Returns a formatted debug string summarizing the follower’s formation status and activity state.
* **Parameters:** None.

## Events & Listeners
- Listens to property changes on `formation_type` and `active` via custom setters (`onformationtype`, `onactive`) registered in the class table.
- No `inst:ListenForEvent` calls are present in this script.
- Does not push events directly.