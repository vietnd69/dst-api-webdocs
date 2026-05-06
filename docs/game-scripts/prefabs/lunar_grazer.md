---
id: lunar_grazer
title: Lunar Grazer
description: Defines the Lunar Grazer hostile mob prefab with cloud-based sleep mechanics, debris scattering on death, and gestalt capture support.
tags: [combat, boss, lunar, mob]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 9c6c90fb
system_scope: entity
---

# Lunar Grazer

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`lunar_grazer` is a hostile lunar-aligned mob prefab that spawns from lunar portals and patrols with a protective cloud aura. The cloud applies grogginess or sleepiness to nearby entities, while debris pieces scatter upon dissipation. It supports gestalt capture mechanics and tracks its spawn portal for cleanup on removal.

Three prefabs are defined in this file: `lunar_grazer` (main entity), `lunar_grazer_core_fx` (visual core effect), and `lunar_grazer_debris` (scattered rock pieces).

## Usage example
```lua
-- Spawn a Lunar Grazer at position
local grazer = SpawnPrefab("lunar_grazer")
grazer.Transform:SetPosition(10, 0, 10)

-- Enable or disable the cloud aura
grazer.EnableCloud(false)

-- Manually show debris (normally triggered by stategraph)
grazer.ShowDebris()
grazer.ScatterDebris()

-- Check cloud status
local cloudActive = grazer:IsCloudEnabled()
```

## Dependencies & tags
**External dependencies:**
- `brains/lunar_grazer_brain` -- AI behavior tree for patrol and combat logic

**Components used:**
- `health` -- manages health pool with no fadeout on death
- `combat` -- handles targeting, damage, attack timing, and retargeting logic
- `planarentity` -- marks entity as planar for lunar realm interactions
- `planardamage` -- sets base planar damage output
- `damagetyperesist` -- adds explosive damage resistance
- `locomotor` -- controls movement speed and creep interaction
- `knownlocations` -- remembers spawnpoint position
- `entitytracker` -- tracks associated portal entity
- `gestaltcapturable` -- enables gestalt capture at level 2
- `inspectable` -- allows player inspection

**Tags:**
- `monster` -- added on spawn
- `hostile` -- added on spawn
- `notraptrigger` -- added on spawn
- `lunar_aligned` -- added on spawn
- `brightmare` -- added on spawn
- `gestaltcapturable` -- added on spawn
- `FX` -- added on core_fx prefab
- `NOCLICK`, `DECOR` -- added on debris prefab

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `cloud` | entity | spawned FX | Cloud visual effect parented to grazer |
| `core` | entity | spawned FX | Core visual effect following rock_cycle_follow symbol |
| `debris` | table | `nil` | Array of debris entity instances |
| `debrisshown` | boolean | `false` | Whether debris is currently visible |
| `debrisscattered` | boolean | `false` | Whether debris has been scattered |
| `trails` | table | shuffled 1-7 | Pool of trail variation indices |
| `_cloudenabled` | net_bool | `true` | Networked flag for cloud aura state |
| `scrapbook_anim` | string | `"scrapbook"` | Animation name for scrapbook entry |
| `scrapbook_animoffsety` | number | `0` | Vertical offset for scrapbook display |
| `scrapbook_bb_y_extra` | number | `75` | Extra bounding box height for scrapbook |
| `variation` | number | random 1-5 | Debris variation index (debris prefab only) |

## Main functions
### `HideDebris()`
* **Description:** Hides all debris pieces by removing them from scene and parenting them back to the grazer entity.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `ShowDebris()`
* **Description:** Shows debris pieces by returning them to scene. Spawns new debris if none exist.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `ScatterDebris()`
* **Description:** Scatters debris in a circular pattern around the grazer without vertical velocity.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `TossDebris()`
* **Description:** Tosses debris upward with vertical velocity and plays rock_float animation.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `DropDebris()`
* **Description:** Drops debris at ground level with horizontal velocity and plays rock_float animation.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `EnableCloud(enable)`
* **Description:** Enables or disables the cloud aura periodic task. Updates networked `_cloudenabled` value.
* **Parameters:** `enable` -- boolean to enable (default `true` if nil)
* **Returns:** None
* **Error states:** None

### `IsCloudEnabled()`
* **Description:** Returns the current cloud aura enabled state from networked variable.
* **Parameters:** None
* **Returns:** boolean -- `true` if cloud is enabled
* **Error states:** None

### `SetCloudProtection(ent, duration)`
* **Description:** Sets a temporary protection task on an entity to prevent repeated cloud effects.
* **Parameters:**
  - `ent` -- entity to protect
  - `duration` -- protection duration in seconds
* **Returns:** None
* **Error states:** None

### `IsTargetSleeping(target)`
* **Description:** Checks if a target is asleep or knocked out via grogginess or sleeper components.
* **Parameters:** `target` -- entity to check
* **Returns:** boolean -- `true` if target is asleep or knocked out
* **Error states:** None

### `OnSpawnedBy(portal, delay)`
* **Description:** Called when spawned by a portal. Remembers spawnpoint location and tracks portal entity.
* **Parameters:**
  - `portal` -- portal entity that spawned this grazer
  - `delay` -- delay before entering active state
* **Returns:** None
* **Error states:** None

### `OnSave(data)`
* **Description:** Saves debris visibility state to save data table.
* **Parameters:** `data` -- save data table to populate
* **Returns:** None
* **Error states:** None

### `OnLoad(data)`
* **Description:** Loads debris visibility state and transitions to dissipated state if debris was shown.
* **Parameters:** `data` -- save data table to read from
* **Returns:** None
* **Error states:** None

### `OnLoadPostPass()`
* **Description:** Restores portal event listener after load. Removes grazer if spawnpoint exists but portal is missing.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnEntitySleep()`
* **Description:** Called when entity goes to sleep. Removes grazer if spawned by portal and portal is missing. Stops tracking and cloud task.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnEntityWake()`
* **Description:** Called when entity wakes up. Restarts tracking and cloud task if enabled.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnRemoveEntity()`
* **Description:** Called when entity is being removed. Cleans up debris and stops tracking.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SpawnTrail(scale, duration, pos)`
* **Description:** Spawns or recycles a trail FX at the grazer's position or specified position.
* **Parameters:**
  - `scale` -- scale multiplier for trail FX
  - `duration` -- duration for trail FX
  - `pos` -- optional position vector (uses grazer position if nil)
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `attacked` -- sets attacker as combat target if not already targeting nearby player
- **Listens to:** `newstate` -- hides debris when leaving debris state
- **Listens to:** `onremove` (on portal) -- triggers despawn or removal when portal is removed
- **Pushes:** `captured_despawn` -- fired immediately when captured by gestalt
- **Pushes:** `lunar_grazer_despawn` -- fired when portal is removed and grazer is awake