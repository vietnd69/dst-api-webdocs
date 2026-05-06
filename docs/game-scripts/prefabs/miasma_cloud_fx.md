---
id: miasma_cloud_fx
title: Miasma Cloud Fx
description: Defines the miasma cloud prefab and its associated visual effects for environmental hazard zones.
tags: [environment, fx, hazard]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 964acbc6
system_scope: environment
---

# Miasma Cloud Fx

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`miasma_cloud_fx` defines a prefab system for miasma cloud environmental hazards and their visual particle effects. The main `miasma_cloud` entity handles server-side logic including player detection and miasma debuff application, while `miasma_cloud_fx` and `miasma_ember_fx` handle client-side visual effects. The system integrates with `miasmawatcher` components on players to apply debuffs when entities enter the cloud radius, and responds to nearby fire sources by entering a diminishing state.

## Usage example
```lua
-- Spawn a miasma cloud at a position
local cloud = SpawnPrefab("miasma_cloud")
cloud.Transform:SetPosition(x, y, z)

-- Check if miasma clouds exist in the world
if TheWorld.GetMiasmaCloudCount and TheWorld.GetMiasmaCloudCount() > 0 then
    -- Miasma is active
end

-- Attach/detach particles on client (called internally)
if not TheNet:IsDedicated() then
    cloud:AttachParticles(true)
    cloud:DetachParticles()
end
```

## Dependencies & tags
**External dependencies:**
- `TheWorld.components.miasmamanager` -- queries and sets miasma diminishing state at points
- `TheCamera` -- listens for camera updates to optimize particle positioning

**Components used:**
- `edible` -- added on server; sets foodtype to MIASMA with sanity/hunger values
- `miasmawatcher` -- accessed on nearby entities to add/remove miasma sources

**Tags:**
- `FX` -- added to all three prefabs; excludes from targeting
- `miasma` -- added to main cloud; identifies as miasma source
- `playerghost`, `ghost`, `shadow`, `notarget`, `invisible` -- excluded from watcher detection

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_diminishing` | net_bool | `false` | Networked flag indicating if cloud is diminishing due to fire |
| `_front_cloud_fx` | entity | `nil` | Front semicircle particle effect child entity |
| `_back_cloud_fx` | entity | `nil` | Back semicircle particle effect child entity |
| `watchers` | table | `{}` | Current entities inside miasma radius with miasmawatcher |
| `watchers_exiting` | table | `{}` | Entities that were inside but are now exiting |
| `watchers_toremove` | table | `{}` | Entities scheduled for removal from watchers |
| `task` | task | `nil` | Periodic update task for watcher detection |
| `_miasma_kill_task` | task | `nil` | Scheduled task to remove unmanaged diminishing cloud |
| `camera_update_task` | task | `nil` | Client-side camera update task |
| `ember_fx` | entity | `nil` | Ember effect child entity (when diminishing) |

## Main functions
### `AttachParticles(do_fast_forward)`
* **Description:** Spawns front and back semicircle particle effect children and positions them relative to the cloud. Optionally fast-forwards particles for immediate visibility.
* **Parameters:**
  - `do_fast_forward` -- boolean; if true, spawns instant particles and fast-forwards VFX
* **Returns:** None
* **Error states:** None; returns early if `_front_cloud_fx` already exists

### `DetachParticles()`
* **Description:** Removes and clears both front and back particle effect children. Sets `_front_cloud_fx` and `_back_cloud_fx` to nil.
* **Parameters:** None
* **Returns:** None
* **Error states:** None; gracefully handles nil FX entities

### `SpawnInstantParticles()`
* **Description:** Immediately spawns `INSTANT_NUM_SPAWN` (10) particles for instant visual feedback when cloud becomes visible.
* **Parameters:** None
* **Returns:** None
* **Error states:** None; checks for valid player and parent before emitting

### `FastForwardParticles(fast_forward)`
* **Description:** Fast-forwards VFX effect particles by the specified time amount.
* **Parameters:** `fast_forward` -- number; seconds to fast-forward
* **Returns:** None
* **Error states:** None

### `ClearParticles()`
* **Description:** Clears all particles from the VFX effect emitter.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `StartAllWatchers()`
* **Description:** Starts the periodic update task that detects entities entering/exiting the miasma radius.
* **Parameters:** None
* **Returns:** None
* **Error states:** None; returns early if task already exists

### `StopAllWatchers()`
* **Description:** Cancels the update task and clears all watcher tables, removing miasma sources from all tracked entities.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `ClearWatcherTable(tbl)`
* **Description:** Clears a watcher table and calls `RemoveMiasmaSource` on all valid entities with `miasmawatcher` components.
* **Parameters:** `tbl` -- table; watcher table to clear
* **Returns:** None
* **Error states:** None; checks entity validity before accessing components

## Events & listeners
- **Listens to:** `onremove` -- triggers `OnRemove_Client` to remove from client entity cache
- **Listens to:** `diminishingdirty` -- triggers `OnDiminishingDirty` to attach/detach ember effects
- **Pushes:** `miasmacloudexists` -- fired on TheWorld when count changes to/from 1 (boolean value)