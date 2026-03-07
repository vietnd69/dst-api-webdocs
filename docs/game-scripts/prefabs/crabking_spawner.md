---
id: crabking_spawner
title: Crabking Spawner
description: Spawns the Crab King boss upon timer expiration and manages regeneration when the current Crab King is killed.
tags: [boss, combat, spawner]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9dc46726
system_scope: world
---

# Crabking Spawner

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `crabking_spawner` entity serves as a world-level boss spawner that initiates the Crab King event. It uses the `childspawner` component to manage the one-time creation of the `crabking` prefab, and the `worldsettingstimer` component to handle timed respawn logic. The spawner starts in a non-regenerating state (`StopRegen()`) and transitions to active spawning via timer completion or child death. It also supports save/load persistence via `OnPreLoad` and `OnLoadPostPass`.

## Usage example
This component is not meant to be added dynamically by modders; it is implemented in the `crabking_spawner` prefab. For reference, its core usage is:

```lua
inst:AddComponent("childspawner")
inst.components.childspawner.childname = "crabking"
inst.components.childspawner:SetMaxChildren(1)
inst.components.childspawner:SetSpawnPeriod(TUNING.CRABKING_SPAWN_TIME, 0)
inst.components.childspawner.onchildkilledfn = StartSpawning
inst.components.childspawner.overridespawnlocation = zero_spawn_offset

inst:AddComponent("worldsettingstimer")
inst.components.worldsettingstimer:AddTimer(CRABKING_SPAWNTIMER, TUNING.CRABKING_RESPAWN_TIME, TUNING.SPAWN_CRABKING)
inst:ListenForEvent("timerdone", ontimerdone)
```

## Dependencies & tags
**Components used:** `childspawner`, `worldsettingstimer`
**Tags:** Adds `CLASSIFIED`, `crabking_spawner`; does not remove or check other tags.

## Properties
No public properties are initialized by this file itself; it relies on `childspawner` and `worldsettingstimer` public properties. See `childspawner.lua` and `worldsettingstimer.lua` for details.

## Main functions
### `StartSpawning(inst)`
* **Description:** Starts the Crab King respawn timer using `worldsettingstimer`. If `TUNING.SPAWN_CRABKING` is `false`, the timer is disabled.
* **Parameters:** `inst` (entity) — the spawner entity instance.
* **Returns:** Nothing.

### `GenerateNewKing(inst)`
* **Description:** Triggers spawning of a new Crab King by adding it to the child count and activating spawner logic.
* **Parameters:** `inst` (entity) — the spawner entity instance.
* **Returns:** Nothing.

### `ontimerdone(inst, data)`
* **Description:** Event handler that triggers `GenerateNewKing` when the `CRABKING_SPAWNTIMER` completes.
* **Parameters:**
  * `inst` (entity) — the spawner entity.
  * `data` (table) — timer event data; checked for `data.name == CRABKING_SPAWNTIMER`.
* **Returns:** Nothing.

### `OnPreLoad(inst, data)`
* **Description:** Restores spawner state on load; ensures `childspawner.spawning` is `true` if pre-load data indicates a pending spawn.
* **Parameters:**
  * `inst` (entity) — the spawner entity.
  * `data` (table?) — persisted entity data; expects `data.childspawner`.
* **Returns:** Nothing.

### `OnLoadPostPass(inst, newents, data)`
* **Description:** Ensures the respawn timer is active after world load if both children and timer are missing (e.g., post-regression recovery).
* **Parameters:**
  * `inst` (entity) — the spawner entity.
  * `newents` (table) — newly loaded entities (unused).
  * `data` (table?) — persisted state.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` — triggered when `CRABKING_SPAWNTIMER` completes; invokes `ontimerdone`.
- **Pushes:** None.