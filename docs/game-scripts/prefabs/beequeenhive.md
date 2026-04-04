---
id: beequeenhive
title: Beequeenhive
description: Defines the Bee Queen hive prefabs with growth timers, workable interactions, and boss spawn mechanics.
tags: [boss, hive, growth, event]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: root
source_hash: f6acd662
system_scope: entity
---

# Beequeenhive

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
`beequeenhive` is a prefab file that defines two entity types: the base hive (`beequeenhive`) and the grown hive (`beequeenhivegrown`). It manages the Bee Queen boss spawn system through timer-based growth mechanics, workable hammer interactions, and entity tracking. The file handles honey level visualization, physics collision updates during growth stages, and coordinates between the hive base and spawned queen entities.

## Usage example
```lua
-- Spawn the base hive (typically done via worldgen)
local hive = SpawnPrefab("beequeenhive")

-- The hive automatically starts growth timers
-- Players can hammer the hive to trigger queen spawn chance
-- Check hive status via inspectable component
local status = hive.components.inspectable:getstatus()
```

## Dependencies & tags
**Components used:** `timer`, `workable`, `inspectable`, `entitytracker`, `pointofinterest`, `combat`, `health`, `transform`, `animstate`, `soundemitter`, `minimapentity`, `network`, `physics`

**Tags:** Adds `event_trigger`, `antlion_sinkhole_blocker`, `blocker`, `FX`; checks `player`, `playerghost`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `physrad` | net_tinybyte | `0` | Networked byte tracking physics radius growth stage |
| `queenkilled` | boolean | `false` | Tracks whether the Bee Queen has been defeated |
| `hivebase` | entity | `nil` | Reference to the base hive entity (on grown hive) |
| `scrapbook_anim` | string | `"large"` | Animation name for scrapbook display |
| `scrapbook_specialinfo` | string | `"BEEQUEENHIVE"` | Special info identifier for scrapbook |

## Main functions
### `SetHoneyLevel(inst, honeylevel, delay)`
*   **Description:** Controls which honey animation layers are visible based on the honey level (0-3).
*   **Parameters:** `inst` (entity) - the hive entity; `honeylevel` (number) - level from 0 to 3; `delay` (number|nil) - optional delay in seconds before applying.
*   **Returns:** Nothing.

### `StartHiveGrowthTimer(inst)`
*   **Description:** Initiates the appropriate growth timer based on queen kill status. Stops all existing growth timers first.
*   **Parameters:** `inst` (entity) - the base hive entity.
*   **Returns:** Nothing.

### `StopHiveGrowthTimer(inst)`
*   **Description:** Stops all hive growth timers and resets the hive to idle state.
*   **Parameters:** `inst` (entity) - the base hive entity.
*   **Returns:** Nothing.

### `DoSpawnQueen(inst, worker, x1, y1, z1)`
*   **Description:** Spawns the Bee Queen boss entity at the hive location, optionally targeting the worker who hammered the hive.
*   **Parameters:** `inst` (entity) - the grown hive entity; `worker` (entity) - the player who triggered the spawn; `x1`, `y1`, `z1` (number) - face target coordinates.
*   **Returns:** Nothing.
*   **Error states:** Removes the hive instance after spawning the queen.

### `OnWorked(inst, worker, workleft)`
*   **Description:** Callback executed when a player hammers the hive. Handles honey drop loot, queen spawn chance calculation, and animation playback.
*   **Parameters:** `inst` (entity) - the hive entity; `worker` (entity) - the player performing the work; `workleft` (number) - remaining work points.
*   **Returns:** Nothing.

### `EnableBase(inst, enable)`
*   **Description:** Toggles the base hive visibility and physics collision. Used during growth stage transitions.
*   **Parameters:** `inst` (entity) - the base hive entity; `enable` (boolean) - whether to enable or disable the base.
*   **Returns:** Nothing.

### `CalcHoneyLevel(workleft)`
*   **Description:** Calculates the honey level (0-3) based on remaining work points on the hive.
*   **Parameters:** `workleft` (number) - current work left value.
*   **Returns:** number - honey level from 0 to 3.

### `SpawnBeequeenChanceMult(inst, chance, luck)`
*   **Description:** Applies luck modifier to the Bee Queen spawn chance calculation.
*   **Parameters:** `inst` (entity) - the hive entity; `chance` (number) - base spawn chance; `luck` (number) - player luck value.
*   **Returns:** number - modified spawn chance.

## Events & listeners
- **Listens to:** `timerdone` - triggers growth stage transitions and honey regeneration; `physraddirty` - updates physics collision radius on clients; `animover` - advances growth animation stages; `onremove` - cleans up entity tracker references when queen or hive is removed
- **Pushes:** None directly identified (interacts via entitytracker and timer components)