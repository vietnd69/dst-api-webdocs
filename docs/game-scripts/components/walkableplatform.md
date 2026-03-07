---
id: walkableplatform
title: Walkableplatform
description: Manages a physical platform (e.g., a boat or raft) that players and objects can stand on, handling entity attachment, detachment, and interaction with surrounding systems like drowning, physics halting, and network registration.
tags: [locomotion, physics, entity, world]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 212ee09e
system_scope: world
---

# Walkableplatform

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Walkableplatform` enables an entity to act as a traversable surface (e.g., a boat or raft) that players and objects can board. It is responsible for detecting entities within its radius, attaching them as platform followers, managing player presence, registering/unregistering with the global `walkableplatformmanager`, and triggering events such as `onsink` when the platform is destroyed. It integrates closely with `boatdrifter`, `boatphysics`, `health`, `inventoryitem`, and `drownable` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("walkableplatform")
inst.components.walkableplatform.platform_radius = 5
inst.components.walkableplatform:SetIsFull(true)
inst.components.walkableplatform:AddEntityToPlatform(ent)
local uid = inst.components.walkableplatform:GetUID()
```

## Dependencies & tags
**Components used:** `boatdrifter`, `boatphysics`, `health`, `drownable`, `inventoryitem`, `amphibiouscreature`, `walkableplatformmanager`  
**Tags:** Adds `walkableplatform`; conditionally adds/removes `walkableplatform_full`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `players_on_platform` | table | `{}` | Map of players currently standing on the platform (keyed by entity instance). |
| `objects_on_platform` | table | `{}` | Map of non-player entities currently on the platform. |
| `platform_radius` | number | `4` | Radius around the platform center used to detect nearby entities. |
| `uid` | number or `nil` | `nil` | Unique identifier assigned by `walkableplatformmanager` upon registration. |
| `isfull` | boolean or `nil` | `nil` | Whether the platform has reached capacity (server-only; clients sync via `walkableplatform_full` tag). |
| `had_players` | boolean or `nil` | `nil` | Internal tracking of whether players were on the platform in the previous frame. |

## Main functions
### `HasPlatformCamera()`
* **Description:** Returns whether the platform has an associated camera zoom override. Checks for `inst.doplatformcamerazoom` on the owning instance (not a component).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `inst.doplatformcamerazoom` is truthy, otherwise `false`.

### `OnRemoveEntity()`
* **Description:** Handles cleanup when the platform is removed from the world. Stops updating, destroys attached objects, despawns player collision proxy, notifies attached entities of sinking, and unregisters from the global manager.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Server-only; client-side calls have no effect.

### `GetUID()`
* **Description:** Returns the platform’s unique identifier. Registers the platform with the `walkableplatformmanager` if not already done.
* **Parameters:** None.
* **Returns:** `number` — The assigned UID.

### `OnSave()`
* **Description:** Returns serializable data for world save.
* **Parameters:** None.
* **Returns:** `{ uid = number }` — Table containing the platform’s UID.

### `OnLoad(data)`
* **Description:** Restores the platform’s state from saved data. Assigns the saved UID and registers the platform with the manager.
* **Parameters:** `data` (table) — Saved data containing `uid`.
* **Returns:** Nothing.

### `StartUpdating()` / `StopUpdating()`
* **Description:** Registers or unregisters the platform with the `walkableplatformmanager`. Called during initialization and cleanup to control global tracking.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetIsFull(isfull)`
* **Description:** Sets whether the platform is at capacity. Only on the server.
* **Parameters:** `isfull` (boolean) — Whether the platform is full.
* **Returns:** Nothing. Adds or removes the `walkableplatform_full` tag accordingly.

### `IsFull()`
* **Description:** Returns whether the platform is full (server-side state).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `self.isfull == true`, otherwise `false`.

### `GetEmbarkPosition(embarker_x, embarker_z, embarker_min_dist)`
* **Description:** Computes a safe embarkation position on the platform edge for an entity.
* **Parameters:**  
  `embarker_x`, `embarker_z` (number) — Position of the embarking entity.  
  `embarker_min_dist` (number or `nil`) — Minimum safe distance from the edge.  
* **Returns:** `number, number` — `x`, `z` coordinates of the calculated position.

### `AddEntityToPlatform(ent)`
* **Description:** Attaches an entity to the platform as a follower if it has no parent and isn’t already attached.
* **Parameters:** `ent` (Entity) — Entity to attach.
* **Returns:** Nothing.

### `SetEntitiesOnPlatform()`
* **Description:** (Server-only) Scans for entities within `platform_radius` and updates internal tracking and followers. Also handles physics halting, health break, and platform sinking if grounded on solid ground.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetEntitiesOnPlatform()` / `GetPlayersOnPlatform()`
* **Description:** Returns the current map of entities/players on the platform.
* **Parameters:** None.
* **Returns:** `table` — Keyed map of entities/players (values are truthy).

### `AddPlayerOnPlatform(player)` / `RemovePlayerOnPlatform(player)`
* **Description:** Adds or removes a player from the platform’s player tracking table.
* **Parameters:** `player` (Entity) — Player entity.
* **Returns:** Nothing.

### `DestroyObjectsOnPlatform(excluding)`
* **Description:** (Server-only) Destroys non-drownable, non-amphibious, non-landed objects currently on the platform.
* **Parameters:** `excluding` (table or `nil`) — Map of entities to preserve.
* **Returns:** Nothing.

### `SpawnPlayerCollision()` / `DespawnPlayerCollision()`
* **Description:** Spawns or removes a visual proxy (`player_collision_prefab`) used for player collision handling on the platform.
* **Parameters:** None.
* **Returns:** Nothing.

### `CommitPlayersOnPlatform()`
* **Description:** Detects transitions in player presence (e.g., players boarding or disembarking) and notifies `boatdrifter` accordingly.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onremove` on player collision proxy — triggers `DespawnPlayerCollision()`.
- **Pushes:** `onsink` — fired on the platform instance, and on each attached entity, when the platform is destroyed.
- **Tag-based client signals:** `walkableplatform_full` — added/removed when `SetIsFull()` changes state.
