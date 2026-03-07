---
id: mushgnome_spawner
title: Mushgnome Spawner
description: Manages the controlled spawning of Mushgnome entities in response to player proximity within a defined zone, using the ChildSpawner component.
tags: [mob, spawner, behavior]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0a144dbf
system_scope: world
---

# Mushgnome Spawner

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`mushgnome_spawner` is a non-networked entity that periodically spawns `mushgnome` minions when players are present inside the `"MushGnomeSpawnArea"` zone. It leverages the `childspawner` component to handle child management (e.g., spawn rate, regeneration, max count) and integrates with `areaaware` to detect nearby players. The spawner activates only when the world entity is awake and stops periodic checks when the entity sleeps or spawning conditions are unmet.

## Usage example
This prefab is instantiated internally by the game world and is not typically added manually by modders. However, a typical usage pattern involving its underlying mechanisms appears as follows:
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst:AddTag("CLASSIFIED")
inst:AddComponent("childspawner")
inst.components.childspawner:SetSpawnPeriod(10)
inst.components.childspawner:SetRegenPeriod(30)
inst.components.childspawner:SetMaxChildren(3)
inst.components.childspawner.childname = "mushgnome"
inst.components.childspawner:StartRegen()
```

## Dependencies & tags
**Components used:** `childspawner`, `areaaware` (checked via player components), `health` (indirectly, via `childspawner:CanSpawn()`), `transform`  
**Tags:** Adds `"CLASSIFIED"` to the spawner instance. Checks players for `"MushGnomeSpawnArea"` tag via `areaaware:CurrentlyInTag`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_PeriodicSpawnTesting` | `Task` or `nil` | `nil` | Handles periodic testing for spawn conditions; cancels when inactive. |
| `OnEntityWake` | function | `on_entity_wake` | Callback triggered when the world entity wakes; starts periodic spawn testing. |
| `OnEntitySleep` | function | `on_entity_sleep` | Callback triggered when the world entity sleeps; cancels spawn testing. |
| `OnPreLoad` | function | `OnPreLoad` | Callback during world load; applies world-settings overrides to spawn/regen periods. |

## Main functions
### `do_spawn_test(inst)`
*   **Description:** Evaluates whether a `mushgnome` should be spawned by scanning for players within the `"MushGnomeSpawnArea"` zone and within `TUNING.MUSHGNOME_SPAWN_RADIUSSQ` distance. If conditions are met, it spawns a child near a randomly selected player.
*   **Parameters:** `inst` (Entity) — the spawner instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `childspawner:CanSpawn()` fails, no players are found in range, or `FindWalkableOffset` cannot locate a valid position.

### `StartTesting(inst)`
*   **Description:** Initiates a periodic task (`TEST_FREQUENCY = 10` seconds) to call `do_spawn_test`.
*   **Parameters:** `inst` (Entity) — the spawner instance.
*   **Returns:** Nothing.

### `on_gnome_spawned(inst, gnome)`
*   **Description:** Event handler fired after a `mushgnome` is successfully spawned; dispatches the `"spawn"` event on the newly created gnome.
*   **Parameters:**  
  - `inst` (Entity) — the spawner instance.  
  - `gnome` (Entity) — the spawned `mushgnome` instance.  
*   **Returns:** Nothing.

### `on_entity_wake(inst)`
*   **Description:** Starts spawn-condition testing when the spawner’s entity wakes.
*   **Parameters:** `inst` (Entity) — the spawner instance.
*   **Returns:** Nothing.

### `on_entity_sleep(inst)`
*   **Description:** Cancels the periodic spawn-testing task when the spawner’s entity goes to sleep.
*   **Parameters:** `inst` (Entity) — the spawner instance.
*   **Returns:** Nothing.

### `OnPreLoad(inst, data)`
*   **Description:** Applies world-settings overrides to the spawner’s spawn and regen periods during world load.
*   **Parameters:**  
  - `inst` (Entity) — the spawner instance.  
  - `data` (table) — the loaded world data (unused directly, but passed to `WorldSettings_ChildSpawner_*` functions).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (the prefab itself does not register events directly; it relies on callbacks on `inst` such as `OnEntityWake`, `OnEntitySleep`, and `OnPreLoad`).
- **Pushes:** None (the spawner entity does not push events, but calls `gnome:PushEvent("spawn")` on spawned children).

## External Integration
- Uses `WorldSettings_ChildSpawner_PreLoad`, `WorldSettings_ChildSpawner_SpawnPeriod`, and `WorldSettings_ChildSpawner_RegenPeriod` from `worldsettingsutil.lua` to support dynamic world settings. These functions adjust spawner behavior based on world configuration flags like `TUNING.MUSHGNOME_ENABLED`.