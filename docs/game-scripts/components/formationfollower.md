---
id: formationfollower
title: Formationfollower
description: Manages an entity's participation in a formation, including leader detection, positioning updates, and sleep/wake lifecycle handling.
tags: [formation, ai, locomotion, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1b54b6a2
system_scope: locomotion
---

# Formationfollower

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FormationFollower` enables an entity to join and maintain a position within a formation led by another entity. It coordinates with the `formationleader` component to enter/leave formations, track position updates, and respond to entity lifecycle events such as entering sleep or being placed in an inventory. This component is typically added to followers (e.g., minions or companions) and works alongside the `follower` component to update leader references dynamically.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("formationfollower")
inst.components.formationfollower.formation_type = "monster"
inst.components.formationfollower.active = true
inst.components.formationfollower:StartUpdating()
```

## Dependencies & tags
**Components used:** `formationleader`, `inventoryitem`, `follower`  
**Tags:** Adds/Removes `"formation_"..formation_type` (e.g., `formation_monster`) dynamically; sets internal `formationsearchtags` to `"formationleader_"..formation_type`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `in_formation` | boolean | `false` | Whether the entity is currently part of a formation. |
| `formationleader` | Entity | `nil` | Reference to the entity acting as formation leader. |
| `formationpos` | Vector3 | `nil` | Target position for this follower in the formation. |
| `searchradius` | number | `50` | Radius around the entity used to search for a formation leader. |
| `leashdistance` | number | `70` | Distance beyond which the entity may break formation (currently unused in code). |
| `formation_type` | string | `"monster"` | String used to generate tags and formation search filters. |
| `active` | boolean | `false` | Whether the follower is actively updating its formation position. |

## Main functions
### `GetDebugString()`
* **Description:** Returns a formatted string for debugging the current state.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"In Formation true/false, active: true/false"`.

### `StartUpdating()`
* **Description:** Begins periodic updates for the component by calling `StartUpdatingComponent`.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopUpdating()`
* **Description:** Stops periodic updates for the component by calling `StopUpdatingComponent`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SearchForFormation(override_find_entities)`
* **Description:** Scans the local area for a formation leader and attempts to join one that has capacity. Only the first eligible leader is joined.
* **Parameters:** `override_find_entities` (table or `nil`) — optional pre-computed entity list to search; if omitted, `TheSim:FindEntities()` is used.
* **Returns:** `boolean` — `true` if a leader successfully accepts the entity, `false` otherwise.
* **Error states:** Returns `nil` implicitly if no leaders found or all leaders are full.

### `OnEntitySleep()`
* **Description:** Handles entity entering sleep state (e.g., sleep animation, inventory placement). Removes from current formation and stops updates.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntityWake()`
* **Description:** Restarts updates upon waking. Skips update resumption if the entity is currently inside a container (checked via `inventoryitem:GetContainer()`).
* **Parameters:** None.
* **Returns:** Nothing.

### `LeaveFormation()`
* **Description:** Initiates departure from the current formation by notifying the leader.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Periodically invoked while `active` and `onupdatefn` is set. Calls `onupdatefn` with the entity and stored formation position.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.
* **Error states:** Returns early if `onupdatefn` is `nil` or if `formationleader`/`formationpos` is missing (though no explicit error is raised).

## Events & listeners
- **Listens to:** `death`, `onremove`, `onenterlimbo` (registered on the leader via `inst:ListenForEvent` when entering formation).
- **Pushes:** None.
