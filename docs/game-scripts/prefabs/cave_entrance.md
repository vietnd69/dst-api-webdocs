---
id: cave_entrance
title: Cave Entrance
description: Manages the lifecycle and behavior of cave entrance structures, including spawning bats, handling mining to open the entrance, and state transitions based on world migration status and day/night cycles.
tags: [entity, world, boss, structure]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: cb6b17d2
system_scope: world
---

# Cave Entrance

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `cave_entrance` is a world structure that serves as a gateway to the Caves. It exists in two primary forms: a closed `cave_entrance` (and its variant `cave_entrance_ruins`) and an open `cave_entrance_open`. Closed versions require mining to open, while the open variant manages bat population dynamics via the `childspawner` component. The component also tracks migration state via `worldmigrator`, respond to day/night cycles to control spawning vs. regen behavior of bats, and provides loot upon successful mining.

Key dependencies include `workable`, `lootdropper`, `childspawner`, `worldmigrator`, and `inspectable`. The structure is not interactive on dedicated servers or non-sharded clients (where it is hidden and non-colliding).

## Usage example
```lua
-- Example: Spawning a standard closed cave entrance
local entrance = SpawnPrefab("cave_entrance")
entrance.Transform:SetPosition(x, y, z)

-- Example: Triggering mining interaction programmatically
entrance:PushEvent("migration_activate_other")
```

## Dependencies & tags
**Components used:** `workable`, `lootdropper`, `childspawner`, `worldmigrator`, `inspectable`, `pointofinterest`, `homeseeker`, `locomotor` (external, via `childspawner.childrenoutside`)
**Tags:** Adds `antlion_sinkhole_blocker` and `NOCLICK`/`CLASSIFIED` on non-sharded/non-master clients. Checks `burnt` and `structure` via `lootdropper`. Uses `canspawnfn` callback from `childspawner`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_anim` | string | `"idle_closed"` | Animation name used in the scrapbook for this entity. |
| `scrapbook_thingtype` | string | `"POI"` | Classification used for scrapbook rendering. |
| `scrapbook_ignore` | boolean | `false` | When `true`, hides the entity from the scrapbook (set for hidden entities). |
| `linked_skinname` | string or `nil` | `nil` | Skin name passed during instantiation of open variant. |
| `skin_id` | number or `nil` | `nil` | Skin ID passed during instantiation of open variant. |
| `OnPreLoad` | function | `OnPreLoad` | Hook used during world load to apply world settings overrides to child spawner behavior. |

## Main functions
### `OnWork(inst, worker, workleft)`
*   **Description:** Handles the result of mining the closed cave entrance. When `workleft <= 0`, spawns visual FX, drops loot, opens the portal via `cave_entrance_open`, and removes the original entity. Also awards the `cave_entrance_opened` achievement to the `worker` if present.
*   **Parameters:** `inst` (entity), `worker` (entity or `nil`), `workleft` (number).
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; logic assumes `worker` may be `nil`.

### `canspawn(inst)`
*   **Description:** Callback provided to `childspawner.canspawnfn` that determines whether the `bat` child prefabs may spawn. Returns `true` if the world migrator is active or full.
*   **Parameters:** `inst` (entity) — the entrance instance.
*   **Returns:** `boolean` — `true` if spawning is permitted.

### `OnIsDay(inst, isday)`
*   **Description:** Responds to day/night state changes on the overworld. At day, stops spawning, starts regenerating bat count, and returns all outside bats home. At night, stops regen and starts spawning.
*   **Parameters:** `inst` (entity), `isday` (boolean).
*   **Returns:** Nothing.

### `ReturnChildren(inst)`
*   **Description:** Iterates through `childrenoutside` of the `childspawner`, instructing any child with a `homeseeker` component to `GoHome()`, and pushing a `"gohome"` event to all children.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `GetStatus(inst)`
*   **Description:** Used by the `inspectable` component to report the current migration status as a string (`"OPEN"` or `"FULL"`), or `nil`.
*   **Parameters:** `inst` (entity).
*   **Returns:** `"OPEN"` if active, `"FULL"` if full, otherwise `nil`.

### `open_fn()`, `closed_fn()`, `ruins_fn()`
*   **Description:** Constructor functions used to build the three distinct prefabs (`cave_entrance_open`, `cave_entrance`, `cave_entrance_ruins`). Each configures the appropriate components, animations, minimap icons, loot tables, and event listeners.
*   **Parameters:** None (instances are created via `fn()` helper with hardcoded parameters).
*   **Returns:** An entity instance with components initialized for the specific variant.

## Events & listeners
- **Listens to:**
  - `"migration_available"` → `open` animation and state
  - `"migration_unavailable"` → `close` animation and state
  - `"migration_full"` → `full` animation
  - `"migration_activate_other"` → `activatebyother`, which triggers `OnWork`
  - `"isday"` world state change → `OnIsDay`
- **Pushes:** None directly; delegates firing of `"gohome"` to child entities via `child:PushEvent("gohome")`.

## Special Notes
- The open variant (`cave_entrance_open`) becomes visible only after mining the closed variant. It uses the same `shard_name = "Caves"` for world migration.
- Bats are controlled via `childspawner`, with spawn/regen periods derived from `TUNING.CAVE_ENTRANCE_BATS_*`. Behavior changes if `TUNING.BATCAVE_ENABLED` is `false`.
- The `OnPreLoad` hook integrates with `WorldSettings_ChildSpawner_PreLoad` and related utilities from `worldsettingsutil.lua` to allow world settings overrides before spawning starts.
- On dedicated servers or non-sharded clients, the structure is visually hidden (`SetScale(0,0)`) and uncollidable, but persists in the world for save compatibility with sharded servers.