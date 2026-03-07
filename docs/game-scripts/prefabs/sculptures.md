---
id: sculptures
title: Sculptures
description: Creates interactive, moonphase-sensitive statue prefabs that can be uncovered, repaired, and morph into chess-related creatures.
tags: [environment, entity, moonphase]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0dc8a15b
system_scope: environment
---

# Sculptures

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`sculptures.lua` defines reusable factory logic for creating statues (sculptures) that serve as interactive environmental prefabs in DST. Each sculpture exists in multiple states: covered, uncovered, broken, fixed, and morphed (during moon events). Sculptures interact with the `moonphase` state, support mining work via the `workable` component, can be repaired when broken, and transform into shadow chess creatures under specific conditions (e.g., new/full moon). The file exports six prefabs: rook (two variants), knight (two variants), and bishop (two variants).

## Usage example
```lua
-- Example usage in a mod or vanilla context:
local rook_sculpture = require "prefabs/sculptures"

-- Note: This file returns prefabs, not components. To spawn one:
local inst = SpawnPrefab("sculpture_rookbody")
if inst and inst.components.workable then
    inst.components.workable:SetWorkLeft(5)
end
```

## Dependencies & tags
**Components used:** `lootdropper`, `inspectable`, `workable`, `repairable`, `pointofinterest` (non-dedicated servers only), `combat`, `talker`, `inventoryitem`, `burnable`, `fueled`, `heavyobstaclephysics`.  
**Tags added:** `statue`, `sculpture`, `chess_moonevent`, `antlion_sinkhole_blocker`.  
**Tags checked:** `player`, `debuffed`, `burnt`, `pocketdimension_container`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst._task` | task handle or nil | `nil` | Holds a repeating task used during "struggle" animation when morphing is imminent. |
| `inst._reanimatetask` | task handle or nil | `nil` | Holds a delayed task that erodes the sculpture when it transforms. |
| `inst.persists` | boolean | `false` (during morph) | Controls whether the entity saves to disk. Set to `false` during morph. |

## Main functions
### `onworked(inst, worker, workleft)`
*   **Description:** Callback fired during mining work. If the sculpture is currently struggling (preparing to morph), stops the struggle and reanimates the entity. If work left drops to or below `TUNING.SCULPTURE_COVERED_WORK`, completes work immediately.
*   **Parameters:** `inst` (entity), `worker` (entity performing work), `workleft` (number, remaining work units).
*   **Returns:** Nothing.

### `MakeFixed(inst)`
*   **Description:** Transitions the sculpture to its "fixed" state. Updates minimap icon, resets the workable callback, removes repairable if present, plays animations and sound, clears loot table, and calls `CheckMorph`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `MakeBroken(inst)`
*   **Description:** Transitions the sculpture to its "broken" state. Plays "med" animation, clears the workable callback, and adds the `repairable` component if not present (configured to expect sculpture pieces as repair material).
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `Reanimate(inst, forceshadow)`
*   **Description:** Transforms the sculpture into a shadow chess creature. Cancels struggle task, plays transformation animation, removes physics colliders, spawns chess piece sketch and gears (if shadow), spawns shadow/normal creature, sets it aggroed on nearest player if nearby, and erodes away the old entity after 2 seconds.
*   **Parameters:** `inst` (entity), `forceshadow` (boolean, optional; forces creation of shadow variant even in non-moon phases).
*   **Returns:** Nothing.

### `CheckMorph(inst)`
*   **Description:** Evaluates whether the sculpture should begin the morphing struggle animation. Triggers if not repaired, work left exceeds covered threshold, it's full/new moon, entity is not asleep, and no reanimation is in progress.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `StartStruggle(inst)`
*   **Description:** Initiates a repeating struggle animation and sound loop (jiggle) on the sculpture. Schedules a task to continue the struggle for a random number of repetitions.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `StopStruggle(inst)`
*   **Description:** Cancels the struggle task and clears `_task`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `shadowchessroar` (world-level event) — triggers `onshadowchessroar` to morph uncovered sculptures.  
  - `isfullmoon`, `isnewmoon` — watched via `WatchWorldState`, triggers `CheckMorph` on change.
- **Pushes:**  
  - `ms_unlockchesspiece` — fired during morph to signal a chess piece has been unlocked.  
  - `entity_droploot` — pushed by `lootdropper:DropLoot`.  
  - `loot_prefab_spawned` — pushed by `lootdropper:SpawnLootPrefab`.