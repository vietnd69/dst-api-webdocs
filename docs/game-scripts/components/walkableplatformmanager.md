---
id: walkableplatformmanager
title: Walkableplatformmanager
description: Manages the registration, lookup, and update of walkable platforms in the world.
tags: [world, entity, locomotion, physics]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 740ac78b
system_scope: world
---

# Walkableplatformmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WalkablePlatformManager` tracks and coordinates all walkable platforms in the world. It assigns unique identifiers to platforms, maintains registries for fast lookup, and orchestrates platform updates (entity tracking and player platform membership) during `PostUpdate`. It works closely with `walkableplatform` and `walkableplatformplayer` components to ensure correct player/platform synchronization in both server and client contexts.

## Usage example
```lua
-- Typically added automatically to TheWorld via worldgen or level setup
-- Manual usage is not required for modding; this is managed internally.

-- Example of accessing platform UID resolution (rare, advanced use)
local platform = inst.components.walkableplatformmanager:GetPlatformWithUID(some_uid)
if platform then
    -- platform is a valid entity with walkableplatform component
end
```

## Dependencies & tags
**Components used:** `walkableplatform`, `walkableplatformplayer`, `health`, `boatdrifter`, `boatphysics`, `physics`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lastuid` | number | `-1` | The highest assigned UID; incremented on each new platform registration. |
| `walkable_platforms` | table | `{}` | Set of registered platform entities. |
| `walkable_platform_uids` | table | `{}` | Map from `uid → platform` for fast lookup. |

## Main functions
### `GetNewUID()`
*   **Description:** Generates and returns a new unique identifier for a walkable platform. UIDs are monotonically increasing integers; reuse is explicitly avoided to support persistent world saves.
*   **Parameters:** None.
*   **Returns:** `number` — A new unique ID.
*   **Error states:** None; guaranteed to return a new integer each call.

### `RegisterPlatform(platform)`
*   **Description:** Registers a platform entity with the manager. Assigns a new UID if the platform lacks one. Handles legacy UIDs by bumping `lastuid` to prevent collisions.
*   **Parameters:** `platform` (Entity) — The entity with the `walkableplatform` component to register.
*   **Returns:** Nothing.
*   **Error states:** Prints a warning if a platform is registered with a duplicate UID.

### `UnregisterPlatform(platform)`
*   **Description:** Removes a platform from internal registries. Validates that the UID and platform match expected values.
*   **Parameters:** `platform` (Entity) — The entity to unregister.
*   **Returns:** Nothing.
*   **Error states:** Prints warnings if the platform has no UID, or if the stored UID does not map to the provided platform.

### `GetPlatformWithUID(uid)`
*   **Description:** Looks up a registered platform by its UID.
*   **Parameters:** `uid` (number) — The UID to look up.
*   **Returns:** `Entity?` — The platform entity, or `nil` if no such UID is registered.

### `AddPlatform(platform)`
*   **Description:** Adds a platform to the manager’s active set. Platforms in this set are updated each `PostUpdate`.
*   **Parameters:** `platform` (Entity) — The platform entity to add.
*   **Returns:** Nothing.

### `RemovePlatform(platform)`
*   **Description:** Removes a platform from the active set. Does not affect its UID registration.
*   **Parameters:** `platform` (Entity) — The platform entity to remove.
*   **Returns:** Nothing.

### `PostUpdate(dt)`
*   **Description:** Updates all active platforms and players’ platform membership. On the server (`ismastersim`), calls `SetEntitiesOnPlatform` on each platform, tests player/platform membership, then commits player lists. On clients, only `ThePlayer` membership is updated (no full iteration).
*   **Parameters:** `dt` (number) — Time since last update.
*   **Returns:** Nothing.
*   **Error states:** If a platform entity is no longer valid, it is silently removed from `walkable_platforms` (note: typo in source — `self.walkableplatform[k]` should be `self.walkable_platforms[k]`, but this is not documented as an API boundary).

### `OnSave()`
*   **Description:** Saves state for world persistence. Only the `lastuid` is saved to ensure UID uniqueness persists across sessions.
*   **Parameters:** None.
*   **Returns:** `{ lastuid = number }` — Table containing the current `lastuid`.

### `OnLoad(data)`
*   **Description:** Restores state from a previous save. Updates `lastuid` if present.
*   **Parameters:** `data` (table) — Data returned by `OnSave()`, typically `{ lastuid = number }`.
*   **Returns:** Nothing.

## Events & listeners
None. This component does not register event listeners or fire events itself.
