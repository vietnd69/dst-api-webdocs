---
id: dragonfly_spawner
title: Dragonfly spawner
description: Manages spawning and lifecycle of dragonflies in lava ponds, tracking active dragonflies and synchronizing engagement state across connected ponds.
tags: [spawn, boss, lava, entity, world]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 45864a3d
system_scope: world
---

# Dragonfly spawner

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `dragonfly_spawner` is a non-networked, non-visual entity that coordinates the spawning and engagement logic for dragonflies in lava arenas. It uses the `childspawner` component to manage dragonfly instances and the `worldsettingstimer` component to handle respawn timing based on global tuning settings. It maintains a list of nearby lava ponds and broadcasts engagement events to coordinate synchronized behavior (e.g., boss mechanics) across multiple pond entities. It supports save/load serialization via `OnPreLoad` and `OnLoadPostPass`.

## Usage example
```lua
-- Automatically instantiated by the world generation system.
-- Manual usage is not typical; this entity is created only for lava arena layouts.

-- Example interaction from a pond entity:
inst:PushEvent("dragonflyengaged", { engaged = true, dragonfly = some_dragonfly })
```

## Dependencies & tags
**Components used:** `childspawner`, `worldsettingstimer`, `knownlocations`  
**Tags:** Adds `CLASSIFIED`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `engageddfly` | entity or `nil` | `nil` | Reference to the currently engaged dragonfly, if any. |
| `ponds` | table | `{}` | Set-like table mapping pond entities to `true` for nearby lava ponds that should receive engagement events. |

## Main functions
### `StartSpawning(inst)`
* **Description:** Starts the respawn timer for a new dragonfly using the `worldsettingstimer` component.
* **Parameters:** `inst` (entity) — the spawner instance.
* **Returns:** Nothing.

### `GenerateNewDragon(inst)`
* **Description:** Notifies the `childspawner` component to spawn a new dragonfly and begins active spawning.
* **Parameters:** `inst` (entity) — the spawner instance.
* **Returns:** Nothing.

### `ontimerdone(inst, data)`
* **Description:** Handles timer completion events; triggers dragonfly generation if the `DRAGONFLY_SPAWNTIMER` expires.
* **Parameters:**  
  `inst` (entity) — the spawner instance.  
  `data` (table) — timer data with a `name` field.
* **Returns:** Nothing.

### `onspawned(inst, child)`
* **Description:** Callback invoked when a dragonfly is spawned; positions the dragonfly high above the spawner, transitions it to the `"land"` state, and records its spawn location.
* **Parameters:**  
  `inst` (entity) — the spawner instance.  
  `child` (entity) — the spawned dragonfly.
* **Returns:** Nothing.

### `Disengage(inst, dfly)`
* **Description:** Clears engagement tracking and notifies all registered ponds that a dragonfly is no longer engaged.
* **Parameters:**  
  `inst` (entity) — the spawner instance.  
  `dfly` (entity or `nil`) — the dragonfly to disengage.
* **Returns:** Nothing.

### `Engage(inst, dfly)`
* **Description:** Sets a new dragonfly as engaged, cancels any prior engagement, and notifies ponds of the change.
* **Parameters:**  
  `inst` (entity) — the spawner instance.  
  `dfly` (entity or `nil`) — the dragonfly to engage.
* **Returns:** Nothing.

### `OnDragonflyEngaged(inst, data)`
* **Description:** Event handler that routes engagement/disengagement requests to `Engage` or `Disengage`.
* **Parameters:**  
  `inst` (entity) — the spawner instance.  
  `data` (table) — must contain `engaged` (boolean) and `dragonfly` (entity).
* **Returns:** Nothing.

### `OnPreLoad(inst, data)`
* **Description:** Prepares spawner state for deserialization; handles legacy timer data and adjusts spawner timers if needed.
* **Parameters:**  
  `inst` (entity) — the spawner instance.  
  `data` (table or `nil`) — saved game data.
* **Returns:** Nothing.

### `OnLoadPostPass(inst, newents, data)`
* **Description:** Ensures spawner starts its respawn timer if no dragonflies are active and no timer is running after load.
* **Parameters:**  
  `inst` (entity) — the spawner instance.  
  `newents` (table) — new entities created during load (unused).  
  `data` (table or `nil`) — saved game data.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `timerdone` — handled by `ontimerdone` to trigger dragonfly respawn.  
  `dragonflyengaged` — handled by `OnDragonflyEngaged` to manage engagement state.  
  `ms_registerlavapond` (from `TheWorld`) — registers nearby ponds and rebroadcasts current engagement state to them.  
  `onremove` (on ponds and dragonflies) — disengages dragonflies when ponds or the engaged dragonfly is removed.

- **Pushes:**  
  `dragonflyengaged` — fired on each registered pond when engagement state changes. Data includes `engaged` (boolean) and `dragonfly` (entity).