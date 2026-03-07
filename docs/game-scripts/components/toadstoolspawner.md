---
id: toadstoolspawner
title: Toadstoolspawner
description: Manages the spawning and respawn logic for toadstools across registered spawner entities.
tags: [spawn, world, map]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 70f5902d
system_scope: world
---

# Toadstoolspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ToadstoolSpawner` is a world-scoped component responsible for coordinating toadstool spawns across multiple spawner entities. It ensures that at most one toadstool exists in the world at a time and handles respawn timing based on world settings. It interacts with the `worldsettingstimer` component to manage internal timers and works with registered spawner entities (likely prefabs like `toadstool_spawner`) that emit or host toadstools.

## Usage example
```lua
TheWorld:AddComponent("toadstoolspawner")
-- Spawner entities register themselves automatically
TheWorld:PushEvent("ms_registertoadstoolspawner", {spawner = spawner_inst})
-- Query current state
if TheWorld.components.toadstoolspawner:IsEmittingGas() then
    print("A toadstool is currently active")
end
```

## Dependencies & tags
**Components used:** `worldsettingstimer`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GExtInst` | (set by ECS) | Reference to the entity that owns the component (typically `TheWorld`). |

*Note: All other state is held in module-scoped private variables.*

## Main functions
### `IsEmittingGas()`
* **Description:** Returns whether a toadstool is currently active in the world (i.e., a spawner has a toadstool). Uses a fast, timer-based heuristic instead of scanning spawners.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if a toadstool is currently active, `false` otherwise.

### `OnPostInit()`
* **Description:** Called after the world is initialized; ensures the respawn timer is correctly stopped or restarted based on current toadstool state.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSave()`
* **Description:** Serializes the current toadstool spawn state for world saving.
* **Parameters:** None.
* **Returns:** `table` — A table with key `toadstool_queued_spawn` (boolean), indicating whether a toadstool spawn is pending (i.e., respawn timer is not active).
* **Error states:** None.

### `OnLoad(data)`
* **Description:** Restores the toadstool spawn state after loading a saved game. Supports legacy `timetorespawn` field for backward compatibility.
* **Parameters:** `data` (table) — Loaded world data.
  - `data.timetorespawn` (optional number): Legacy time remaining until respawn.
  - `data.toadstool_queued_spawn` (optional boolean): Whether to queue a spawn on load.
* **Returns:** Nothing.
* **Error states:** If `timetorespawn` is provided, it is clamped to `TUNING.TOADSTOOL_RESPAWN_TIME`.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string for the current state.
* **Parameters:** None.
* **Returns:** `string` — Format: `"Active Toadstool: <spawner_ref or '--'>  Cooldown: <seconds>"`.

## Events & listeners
- **Listens to:**  
  - `ms_registertoadstoolspawner` — Triggered on `TheWorld` to register a new spawner entity.
  - `toadstoolstatechanged` (from spawner) — Notified when a spawner’s toadstool state changes (e.g., spawned or removed).
  - `toadstoolkilled` (from spawner) — Notified when a toadstool is killed.
  - `onremove` (from spawner) — Notified when a spawner entity is removed.

- **Pushes:**  
  - `toadstoolstatechanged` — Broadcasts world event with `{spawner = spawner, state = state}`.
  - `toadstoolkilled` — Broadcasts world event with `{spawner = spawner, toadstool = toadstool}`.

## Timer behavior
Internally uses the `worldsettingstimer` to manage two sequential phases:
1. **Spawn delay** (`TUNING.TOADSTOOL_SPAWN_TIME`) — Time before the first toadstool spawn after world start or respawn.
2. **Respawn delay** (`TUNING.TOADSTOOL_RESPAWN_TIME`) — Cooldown between the destruction of one toadstool and the start of the next spawn window.

A respawn is triggered by calling `ms_spawntoadstool` on a random registered spawner if no toadstool is currently active.
