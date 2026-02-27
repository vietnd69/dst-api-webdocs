---
id: walkableplatform
title: Walkableplatform
description: Manages a platform entity that supports entities and players above water, handling entity attachment, collision, drowning logic, and state synchronization.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 212ee09e
---

# Walkableplatform

## Overview
This component enables an entity to function as a navigable, physics-aware platform (e.g., a boat) that can carry other entities and items above water. It tracks which entities are on the platform, manages their attachment/detachment via platform followership, handles drowning for drownable entities during sinking, and synchronizes state (e.g., fullness, UID) with the `walkableplatformmanager`.

## Dependencies & Tags
- **Component Dependencies**: Relies on `TheWorld.components.walkableplatformmanager` being present. Also works alongside components like `health`, `boatphysics`, `boatdrifter`, `drownable`, and `inventoryitem`.
- **Tags Added/Removed**: 
  - Always adds tag `"walkableplatform"` to the entity on creation.
  - Adds/removes `"walkableplatform_full"` tag dynamically when `SetIsFull` is called.
- **Ignore Tags**: Uses two lists for entity filtering:
  - `IGNORE_WALKABLE_PLATFORM_TAGS_ON_REMOVE`: `{"ignorewalkableplatforms", "ignorewalkableplatformdrowning", "activeprojectile", "flying", "FX", "DECOR", "INLIMBO", "player"}`
  - `IGNORE_WALKABLE_PLATFORM_TAGS`: `{"ignorewalkableplatforms", "activeprojectile", "flying", "FX", "DECOR", "INLIMBO", "herd"}`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *required argument* | Reference to the entity the component is attached to. |
| `players_on_platform` | `table` | `{}` | Map of players currently on the platform (keyed by entity reference). |
| `objects_on_platform` | `table` | `{}` | Map of non-player entities currently on the platform. |
| `platform_radius` | `number` | `4` | Radius used for entity detection when scanning entities on the platform. |
| `uid` | `number?` | `nil` | Unique identifier assigned by `walkableplatformmanager` for registration. |
| `player_collision` | `Entity?` | `nil` | Optional collision proxy for player interaction (spawns via `player_collision_prefab`). |
| `isfull` | `boolean?` | `nil` | Server-side flag indicating whether the platform can accept more entities. |
| `had_players` | `boolean?` | `nil` | Tracks whether players were on the platform in the previous `CommitPlayersOnPlatform` cycle. |

## Main Functions
### `HasPlatformCamera()`
* **Description:** Checks whether the platform should apply custom camera zoom when aboard. Reads the `doplatformcamerazoom` field directly from the entity.
* **Parameters:** None.

### `OnRemoveEntity()`
* **Description:** Handles cleanup when the platform entity is removed—stops updates, destroys carried objects, triggers `"onsink"` events for players and other entities, detaches followers, and unregisters the platform from the manager.
* **Parameters:** None.

### `GetUID()`
* **Description:** Ensures the platform is registered with `walkableplatformmanager` and returns its unique ID. Registers it if not already done.
* **Parameters:** None.

### `OnSave()`
* **Description:** Returns state data for persistence—currently only includes the platform’s `uid`.
* **Parameters:** None.
* **Returns:** `{ uid = <number> }`

### `OnLoad(data)`
* **Description:** Restores state during loading—loads `uid` from `data` and re-registers the platform with the manager.
* **Parameters:** 
  - `data` (table): Contains at least `uid` (number).

### `StartUpdating()` / `StopUpdating()`
* **Description:** Registers or unregisters the platform with `walkableplatformmanager`, controlling whether it is included in platform tracking/updates.
* **Parameters:** None.

### `DestroyObjectsOnPlatform(excluding)`
* **Description:** (Server-only) Destroys or lands non-essential objects on the platform (based on tags and components), except those excluded. Calls `DestroyEntity` or `SetLanded`.
* **Parameters:** 
  - `excluding` (table?): Optional table of entities to preserve (keyed by reference).

### `GetEntitiesOnPlatform()` / `GetPlayersOnPlatform()`
* **Description:** Return the `objects_on_platform` and `players_on_platform` tables respectively.
* **Parameters:** None.
* **Returns:** (table) Map of entities currently on the platform.

### `AddPlayerOnPlatform(player)` / `RemovePlayerOnPlatform(player)`
* **Description:** Add or remove a player entity from the `players_on_platform` map.
* **Parameters:** 
  - `player` (Entity): The player entity to add/remove.

### `SetIsFull(isfull)` / `IsFull()`
* **Description:** (Server-only) Sets or gets the `"walkableplatform_full"` tag based on whether more entities can board. Syncs with `isfull` boolean flag.
* **Parameters:** 
  - `isfull` (boolean): Whether the platform is considered full.

### `GetEmbarkPosition(embarker_x, embarker_z, embarker_min_dist)`
* **Description:** Calculates a safe embarkation position on the platform’s edge (e.g., for player mounting). Adjusts based on platform radius and minimum distance from the embarker.
* **Parameters:** 
  - `embarker_x`, `embarker_z` (number): World coordinates of the embarker.
  - `embarker_min_dist` (number?): Optional minimum distance to keep from the embarker.
* **Returns:** `x, z` (number, number) — World coordinates for the embark point.

### `AddEntityToPlatform(ent)`
* **Description:** Attaches an entity to the platform using `AddPlatformFollower`, avoiding duplicate registration. Skips if the entity already has a parent.
* **Parameters:** 
  - `ent` (Entity): Entity to add.

### `SetEntitiesOnPlatform()`
* **Description:** (Server-only) Re-scans and updates the list of entities on the platform. Handles physics-safe collision checks (to prevent infinite-mass intersections), checks for underwater terrain (health break), and updates the platform’s halting state.
* **Parameters:** None.

### `RemoveObject(obj)`
* **Description:** (Stub) Removes a specific object from `objects_on_platform` and detaches it using `RemovePlatformFollower`. Not actively used internally.
* **Parameters:** 
  - `obj` (Entity): Entity to remove.

### `SpawnPlayerCollision()` / `DespawnPlayerCollision()`
* **Description:** (Client/server) Spawns and attaches/detaches an optional `player_collision_prefab` entity as a collision proxy for player interaction.
* **Parameters:** None.

### `CommitPlayersOnPlatform()`
* **Description:** (Server-only) Tracks player count changes over time and triggers `"OnStartDrifting"` / `"OnStopDrifting"` events on the `boatdrifter` component accordingly.
* **Parameters:** None.

## Events & Listeners
- **Listens for events:**
  - `"onremove"` on `self.player_collision`, handled by `DespawnPlayerCollision()`.

- **Triggers/pushes events:**
  - `"onsink"` on `inst` itself.
  - `"onsink"` on each drownable entity carried (`{ boat = self.inst, shore_pt = shore_pt }`).
  - `"onsink"` on non-drownable entities carried (`{ boat = self.inst }`).