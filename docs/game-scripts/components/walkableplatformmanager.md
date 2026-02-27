---
id: walkableplatformmanager
title: Walkableplatformmanager
description: Manages registration, lookup, and updates for walkable platforms in the world, including UID assignment and per-frame entity tracking on platforms.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 740ac78b
---

# Walkableplatformmanager

## Overview
This component acts as a centralized registry and manager for all walkable platforms in the game world. It handles UID generation and assignment to platforms (ensuring uniqueness and persistence across sessions), tracks platforms in use, and performs per-frame updates (on the master simulation only) to determine which entities are standing on each platform and synchronize player-platform relationships. It also supports serialization of its state for save/load.

## Dependencies & Tags
- **Components used:**
  - Requires entities to have a `walkableplatform` component to be registered.
  - On the master sim, iterates over all players (`AllPlayers`) and expects them to have a `walkableplatformplayer` component for platform detection.
- **Tags:** No tags are added or removed by this component itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity the component is attached to (typically the world). |
| `lastuid` | `number` | `-1` | The last assigned unique identifier; incremented sequentially when new platforms are registered. |
| `walkable_platforms` | `table` | `{}` | A set (keys-only table) tracking all currently registered walkable platforms. |
| `walkable_platform_uids` | `table` | `{}` | A map from `uid` (number) → platform entity, enabling fast UID-to-platform lookup. |

## Main Functions

### `GetNewUID()`
* **Description:** Generates and returns a new unique identifier for a walkable platform, incrementing `lastuid` atomically.
* **Parameters:** None.

### `UnregisterPlatform(platform)`
* **Description:** Removes a platform from the UID lookup table (`walkable_platform_uids`) if its UID matches. Issues a warning if the UID is missing or mismatched, but does *not* remove it from `walkable_platforms`.
* **Parameters:**
  - `platform` (`Entity`): The walkable platform entity to unregister.

### `RegisterPlatform(platform)`
* **Description:** Ensures the platform has a valid UID (assigning one if missing), registers it in the UID map, and issues a warning if the UID is already in use. Also handles legacy data where `lastuid` may be stale by advancing it if needed.
* **Parameters:**
  - `platform` (`Entity`): The walkable platform entity to register.

### `GetPlatformWithUID(uid)`
* **Description:** Returns the platform entity associated with a given UID, or `nil` if not found.
* **Parameters:**
  - `uid` (`number`): The unique identifier to look up.

### `AddPlatform(platform)`
* **Description:** Adds a platform to the tracking set (`walkable_platforms`), marking it as an active platform that should be updated each frame.
* **Parameters:**
  - `platform` (`Entity`): The walkable platform entity to add.

### `RemovePlatform(platform)`
* **Description:** Removes a platform from the tracking set (`walkable_platforms`), stopping its per-frame updates. Note: this does *not* unregister it from the UID map—`UnregisterPlatform` should be used for that.
* **Parameters:**
  - `platform` (`Entity`): The walkable platform entity to remove.

### `PostUpdate(dt)`
* **Description:** Main per-frame logic. On the master simulation, it updates all registered platforms by calling their `SetEntitiesOnPlatform(dt)` and `CommitPlayersOnPlatform()` methods, and checks each player for platform transitions via `TestForPlatform()`. On clients, only updates the local player (if available) for testing (for future prediction support). Includes a deliberate error in the removal clause: `self.walkableplatform[k] = nil` should be `self.walkable_platforms[k] = nil`.
* **Parameters:**
  - `dt` (`number`): Delta time since the last frame.

### `OnSave()`
* **Description:** Returns a serializable table containing the current `lastuid` value for world save persistence.
* **Parameters:** None.
* **Returns:** `{ lastuid = number }`

### `OnLoad(data)`
* **Description:** Restores the `lastuid` from saved data. Does not restore platform lists; those must be re-registered on load.
* **Parameters:**
  - `data` (`table`): The saved data table, expected to optionally contain a `lastuid` key.

## Events & Listeners
None identified.