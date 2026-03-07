---
id: rock_ice
title: Rock Ice
description: Manages the lifecycle, seasonal phase transitions, and resource yield of ice boulder entities in DST.
tags: [environment, seasonal, resource]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f15aa230
system_scope: environment
---

# Rock Ice

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`rock_ice` defines a seasonal environmental entity that cycles through multiple visual and physical states (`dryup`, `empty`, `short`, `medium`, `tall`) based on the current season and season progress. It interacts with the `workable`, `lootdropper`, `timer`, `inspectable`, and `lunarhailbuildup` components to handle mining, loot generation, seasonal decay/growth, and client-server synchronization. The entity is persistent, saveable, and reacts to environmental events such as fire melting or abandonship.

## Usage example
```lua
local inst = SpawnPrefab("rock_ice")
inst.Transform:SetPosition(x, y, z)
-- The rock_ice prefab initializes all components and stage state automatically in its constructor.
-- Manual interaction includes:
inst.components.workable:SetWorkLeft(100) -- simulate partial mining
inst:PushEvent("firemelt") -- trigger fire melting behavior
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `lunarhailbuildup`, `timer`, `inspectable`, `burnable`, `buoyant` (implicit via `Sink`), `heavyobstaclephysics` (used via `lootdropper:SpawnLootPrefab`), `inventoryitem`, `burnable`
**Tags:** `antlion_sinkhole_blocker`, `frozen`, `CLASSIFIED` (conditionally added/removed during `dryup`/emptying), `hauntable`

## Properties
No public properties are exposed. Internal state is maintained via:
- `inst.stage`: String (e.g., `"tall"`, `"empty"`)
- `inst.threshold1`, `inst.threshold2`, `inst.threshold3`: Floats used for season phase interpolation
- `inst.remove_on_dryup`: Boolean or `nil`
- `inst.firemelttask`: Task or `nil`
- `inst._ismelt`: Networked boolean
- `inst._stage`: Networked tinybyte

## Main functions
### `SetStage(inst, stage, source, snap_to_stage)`
*   **Description:** Transitions the rock_ice to a new stage (`dryup`, `empty`, `short`, `medium`, `tall`). Handles animation, physics, loot generation (on work), lunar hail buildup, and tag changes. Enforces monotonic changes unless `snap_to_stage` is `true`.
*   **Parameters:** `stage` (string), `source` (string: `"melt"`, `"grow"`, `"work"`), `snap_to_stage` (boolean). 
*   **Returns:** Nothing.
*   **Error states:** Returns early if `stage == inst.stage` or if growth/melting would go against `source` direction and `snap_to_stage` is `false`. Growth from `dryup` is blocked if occupied entities exist in a 1.1 radius.

### `SerializeStage(inst, stageindex, source)`
*   **Description:** Saves current stage and melt status to networked variables and triggers `OnStageDirty` for visual sync.
*   **Parameters:** `stageindex` (1-based integer index of `STAGES`), `source` (string: `"melt"` or other).
*   **Returns:** Nothing.

### `DeserializeStage(inst)`
*   **Description:** Converts the 0-based networked stage index back to a 1-based index for `STAGES` lookup.
*   **Parameters:** None.
*   **Returns:** Integer.

### `OnWorked(inst, worker, workleft, numworks)`
*   **Description:** Callback when the entity is fully mined. Transitions to `"empty"` or `"dryup"` based on critical hits. Plays break sound if fully emptied.
*   **Parameters:** `worker` (entity), `workleft` (number), `numworks` (number).
*   **Returns:** Nothing.

### `TryStageChange(inst)`
*   **Description:** Called via `DayEnd` or timers. Adjusts stage based on current season (`isspring`, `issummer`, `isautumn`, `iswinter`) and `seasonprogress`. Implements thermal momentum via `threshold*` parameters.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Sink(inst)`
*   **Description:** Spawns all remaining ice loot (based on current stage) and removes the entity. Triggered by `"abandon_ship"` event (e.g., flood rise).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StartFireMelt(inst)` / `StopFireMelt(inst)`
*   **Description:** Initiates/cancels a delayed `"dryup"` transition after 4 seconds if a fire event is ongoing.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` (`ontimerdone`) — triggers `TryStageChange` for `"rock_ice_change"` timers.  
  `firemelt` (`StartFireMelt`) — schedules fire-based melting.  
  `stopfiremelt` (`StopFireMelt`) — cancels pending fire melt.  
  `abandon_ship` (`Sink`) — triggers sinking behavior.  
  `stagedirty` (client-only, `OnStageDirty`) — syncs visuals when networked stage changes.
- **Pushes:** `loot_prefab_spawned` (via `lootdropper:SpawnLootPrefab`), `on_loot_dropped` (internal), and custom events `firemelt`/`stopfiremelt` are handled via listening, not pushing.