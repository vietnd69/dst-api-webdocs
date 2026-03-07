---
id: world
title: World
description: Manages the global world instance and initial setup for the game environment, including map rendering, tile physics, components, and prefabs.
tags: [world, initialization, map, physics]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b5ce5116
system_scope: world
---

# World

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `world` prefab is responsible for creating and initializing the singleton `TheWorld` entity, which serves as the central container for the entire game world. It sets up core infrastructure including map rendering layers, tile collision sets, global components (e.g., `worldstate`, `waterphysics`), and event handlers. It also defines utility methods such as `SetPocketDimensionContainer`, `GetPocketDimensionContainer`, and `CanFlyingCrossBarriers`.

## Usage example
```lua
-- Typically invoked internally by the game engine via `MakeWorld("world", ...)`
-- Modders do not usually call this directly; it is used in `gamelogic.lua`
-- Example of checking world state after initialization:
if TheWorld and TheWorld.components.worldstate then
    local season = TheWorld.state.season
    print("Current season:", season)
end
```

## Dependencies & tags
**Components used:** `worldsettings`, `worldstate`, `groundcreep`, `oceancolor`, `nutrients_visual_manager`, `hudindicatablemanager`, `walkableplatformmanager`, `waterphysics`, `shardtransactionsteps`, `klaussackloot`, `undertile`, `worldsettingstimer`, `timer`, `farming_manager`, `dockmanager`, `vinebridgemanager`, `worldroutes`, `playerspawner`, `nightlightmanager`, `winonateleportpadmanager`, `corpsepersistmanager`, `skeletonsweeper`, `uniqueprefabids`, `map`, `pathfinder`, `transform`, `soundemitter`  
**Tags added:** `"NOCLICK"`, `"CLASSIFIED"` (plus any custom tags passed via `tags` parameter)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `state` | table | `nil` | Lua-managed world state data, provided by the `worldstate` component (`inst.components.worldstate.data`). |
| `ismastersim` | boolean | `false` | Indicates whether this instance is the master simulation (server) in DST. |
| `ismastershard` | boolean | `false` | True only on the master shard (primary server in shard clusters). |
| `can_crossbarriers_flying` | boolean | `false` | Custom data flag indicating whether flying entities can cross barriers (e.g., for ghosts). |
| `PocketDimensionContainers` | table | `{}` | Dictionary mapping container names (strings) to container entity instances. |

## Main functions
### `MakeWorld(name, customprefabs, customassets, common_postinit, master_postinit, tags, custom_data)`
*   **Description:** Factory function that creates and returns a `Prefab` for the world instance. Handles initialization of map layers, components, prefabs, and post-initialization callbacks. Throws an error if a world already exists (`TheWorld ~= nil`).
*   **Parameters:**
    *   `name` (string) — Prefab name (e.g., `"world"`).
    *   `customprefabs` (table or `nil`) — Additional prefabs to include beyond the default set.
    *   `customassets` (table or `nil`) — Additional asset definitions.
    *   `common_postinit` (function or `nil`) — Callback executed during entity creation on both clients and server.
    *   `master_postinit` (function or `nil`) — Callback executed only on the master simulation (server).
    *   `tags` (table or `nil`) — Additional tags to add to the world instance.
    *   `custom_data` (table or `nil`) — Custom data passed to configure internal behavior (e.g., `tile_physics_init`, `cancrossbarriers_flying`).
*   **Returns:** A `Prefab` instance (the world prefab), or `nil` if called while a world already exists.

### `PostInit(inst)`
*   **Description:** Runs after the world entity is fully initialized (client or server). Calls `OnPostInit` on all components, triggers one-time world state synchronization, and sets up world state listeners for changes in season/day counters.
*   **Parameters:** `inst` (Entity) — The world entity instance.
*   **Returns:** Nothing.

### `OnRemoveEntity(inst)`
*   **Description:** Cleanup function for when the world is destroyed. Removes the minimap, asserts that `TheWorld` and `TheFocalPoint` match expectations, then nulls them out.
*   **Parameters:** `inst` (Entity) — The world entity instance.
*   **Returns:** Nothing.

### `CreateTilePhysics(inst)`
*   **Description:** Sets up tile collision groups for land, impassable terrain, and ocean boundaries. Uses custom physics initialization if provided via `custom_data`.
*   **Parameters:** `inst` (Entity) — The world entity instance.
*   **Returns:** Nothing.

### `CanFlyingCrossBarriers(world)`
*   **Description:** Determines whether flying entities (e.g., ghosts) can cross physical barriers. Defaults to `world.has_ocean` (for backwards compatibility) or `world.cancrossbarriers_flying`.
*   **Parameters:** `world` (Entity) — The world entity instance.
*   **Returns:** `boolean` — `true` if flying entities can cross barriers, otherwise `false`.

### `SetPocketDimensionContainer(world, name, containerinst)`
*   **Description:** Registers a pocket dimension container entity under a given name.
*   **Parameters:**
    *   `world` (Entity) — The world entity instance.
    *   `name` (string) — Key for the container.
    *   `containerinst` (Entity) — The container entity instance.
*   **Returns:** Nothing.

### `GetPocketDimensionContainer(world, name)`
*   **Description:** Retrieves a registered pocket dimension container by name.
*   **Parameters:**
    *   `world` (Entity) — The world entity instance.
    *   `name` (string) — Key for the container.
*   **Returns:** `Entity or nil` — The container entity if found, otherwise `nil`.

## Events & listeners
- **Listens to:** `ms_playerspawn` — Triggers `OnPlayerSpawn` to auto-teleport new players to existing players when `TheWorld.auto_teleport_players` is enabled.
- **Pushes:** None identified.