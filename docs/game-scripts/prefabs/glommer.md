---
id: glommer
title: Glommer
description: A flying lunar-aligned companion entity that follows the player, enters sleep cycles, periodically spawns fuel items, and adjusts sanity.
tags: [flying, companion, boss, sleep, spawning]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d0e5a062
system_scope: entity
---

# Glommer

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`glommer.lua` defines the prefabricated entity for Glommer, a flying companion that follows the player while exhibiting autonomous behavior patterns. It uses the ECS to integrate sleep mechanics (with moon-phase awareness), periodic item spawning, follower tracking, and environmental interactions like sanity aura and loot generation. The prefab spawns `glommerfuel` and `glommerwings` as loot, and is designed to flee the world if left idle too long (`ShouldLeaveWorld` flag).

## Usage example
```lua
local glommer = SpawnPrefab("glommer")
glommer.Transform:SetPosition(x, y, z)
glommer.components.follower:FollowTarget(player)
-- Glommer automatically spawns fuel and adjusts sanity
```

## Dependencies & tags
**Components used:** `follower`, `health`, `combat`, `knownlocations`, `lootdropper`, `sleeper`, `sanityaura`, `locomotor`, `periodicspawner`, `inspectable`, `transform`, `animstate`, `soundemitter`, `dynamicshadow`, `minimapentity`, `network`, `hauntable`  
**Tags added:** `glommer`, `flying`, `lunar_aligned`, `ignorewalkableplatformdrowning`, `cattoyairborne`, `companion` (conditionally added via event)  
**Tags checked:** `companion`, `glommerflower` (on leader)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ShouldLeaveWorld` | boolean | `nil` (nil by default) | Controls whether the entity leaves the world after being idle/sleeping for too long. |

## Main functions
### `ShouldWakeUp(inst)`
*   **Description:** Determines if Glommer should wake up based on default wake test or being too far from leader (distance > `WAKE_TO_FOLLOW_DISTANCE = 14`).  
*   **Parameters:** `inst` (Entity) — the Glommer instance.  
*   **Returns:** boolean — `true` if it should wake up.  

### `ShouldSleep(inst)`
*   **Description:** Determines if Glommer should go to sleep based on default sleep test, proximity to leader (distance ≤ `SLEEP_NEAR_LEADER_DISTANCE = 7`), and absence of a full moon.  
*   **Parameters:** `inst` (Entity) — the Glommer instance.  
*   **Returns:** boolean — `true` if it should sleep.  

### `OnSpawnFuel(inst, fuel)`
*   **Description:** Triggers when `periodicspawner` spawns a fuel item. Sends the SGglommer stategraph into `"goo"` state with the spawned fuel entity as argument.  
*   **Parameters:**  
  - `inst` (Entity) — the Glommer instance.  
  - `fuel` (Entity) — the spawned `glommerfuel` entity.  
*   **Returns:** Nothing.  

### `OnStopFollowing(inst)`
*   **Description:** Event handler removes the `"companion"` tag when following stops.  
*   **Parameters:** `inst` (Entity) — the Glommer instance.  
*   **Returns:** Nothing.  

### `OnStartFollowing(inst)`
*   **Description:** Event handler adds the `"companion"` tag only if the leader has the `"glommerflower"` tag (special-case).  
*   **Parameters:** `inst` (Entity) — the Glommer instance.  
*   **Returns:** Nothing.  

### `OnSave(inst, data)`
*   **Description:** Persists `ShouldLeaveWorld` state to save data.  
*   **Parameters:**  
  - `inst` (Entity) — the Glommer instance.  
  - `data` (table) — the save table.  
*   **Returns:** Nothing.  

### `OnLoad(inst, data)`
*   **Description:** Restores `ShouldLeaveWorld` state from save data if present.  
*   **Parameters:**  
  - `inst` (Entity) — the Glommer instance.  
  - `data` (table?) — save data (may be `nil`).  
*   **Returns:** Nothing.  

### `OnEntitySleep(inst)`
*   **Description:** Handles cleanup when Glommer goes to sleep — removes the entity if `ShouldLeaveWorld` is set.  
*   **Parameters:** `inst` (Entity) — the Glommer instance.  
*   **Returns:** Nothing.  

## Events & listeners
- **Listens to:**  
  - `"stopfollowing"` — triggers `OnStopFollowing(inst)`  
  - `"startfollowing"` — triggers `OnStartFollowing(inst)`  

- **Pushes:** None — this script does not directly push events.

`<`!-- No other event listeners or pushes are defined in this file. -->