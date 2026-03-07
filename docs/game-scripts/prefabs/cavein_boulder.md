---
id: cavein_boulder
title: Cavein Boulder
description: Manages the state, physics, and behavior of large boulders used in cave-in events, including raised states, falling animation tracking, and formation creation upon landing.
tags: [physics, environment, event, loot, animation]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3eb5982c
system_scope: environment
---

# Cavein Boulder

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cavein_boulder` is a prefabricated entity that represents a heavy, breakable rock used in cave-in events. It supports multiple physical states: unformed, raised (propped up by another boulder), formed (on the ground), and falling. It integrates closely with the `heavyobstaclephysics`, `inventoryitem`, `workable`, `lootdropper`, `equippable`, and `inspectable` components. The entity also manages visual variation via animation overrides and handles special logic when dropped or landed, including triggering cave-in formations and particle effects.

## Usage example
```lua
local boulder = SpawnPrefab("cavein_boulder")
boulder.Transform:SetPosition(0, 0, 0)
boulder.components.workable:SetWorkLeft(20)
boulder.components.inventoryitem.canbepickedup = false
-- Later, after mining:
boulder:PushEvent("workfinished")
```

## Dependencies & tags
**Components used:** `heavyobstaclephysics`, `inspectable`, `lootdropper`, `inventoryitem`, `equippable`, `workable`, `submersible`, `symbolswapdata`, `entitytracker`  
**Tags:** Adds `heavy`, `boulder`, `caveindebris`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `variation` | number or `nil` | `math.random(NUM_VARIATIONS)` | Controls the visual animation variant (`1`–`NUM_VARIATIONS`). |
| `raised` | boolean or `nil` | `nil` | Whether the boulder is propped up (raised state). |
| `formed` | boolean or `nil` | `nil` | Whether the boulder is fully placed on the ground (formed state). |
| `_iconpos` | Vector3 or `nil` | `nil` | Cached position used for minimap icon management. |
| `_basepos` | Vector3 or `nil` | `nil` | Base position used when a raised boulder is tracked. |
| `fallingpos` | Vector3 or `nil` | `nil` | Target position for falling animation interpolation. |
| `fallingtask` | Task or `nil` | `nil` | Task driving the falling animation. |
| `wobbletask` | Task or `nil` | `nil` | Task scheduling wobble animation. |
| `_onremoveraisedboulder` | function | `OnRemoveRaisedBoulder` | Callback used to trigger wobble or fall when a propped boulder is removed. |

## Main functions
### `SetVariation(inst, variation, force)`
* **Description:** Changes the visual animation variant and syncs the symbol override on the animstate. Automatically updates equipped state if currently equipped.
* **Parameters:**  
  `variation` (number or `nil`) – Desired variant (`1` to `NUM_VARIATIONS`). Invalid values default to `nil`.  
  `force` (boolean) – If `true`, updates even if `variation` matches current value.
* **Returns:** Nothing.

### `SetRaised(inst, raised)`
* **Description:** Toggles the raised state of the boulder. Changes animations, minimap icon, and updates physics/workability flags. Removes `entitytracker` while raised.
* **Parameters:**  
  `raised` (boolean) – Whether to raise or lower the boulder.
* **Returns:** Nothing.

### `SetFormed(inst, formed)`
* **Description:** Toggles the formed (grounded, stable) state. Controls inclusion in `entitytracker` for raised boulder tracking.
* **Parameters:**  
  `formed` (boolean) – Whether the boulder is formed on the ground.
* **Returns:** Nothing.

### `OnWorked(inst, worker)`
* **Description:** Callback triggered when the boulder is mined. Spawns break FX, drops loot (including moisture inheritance), and removes the boulder.
* **Parameters:**  
  `worker` (Entity or `nil`) – The entity performing the work.
* **Returns:** Nothing.

### `CreateFormation(boulders)`
* **Description:** Arranges a group of boulders into a predefined quad formation (1 raised, 4 grounded) with randomized rotation and orientation. Spawns dust FX and sets up raised-boulder tracking between grounded and raised boulders.
* **Parameters:**  
  `boulders` (table of Entities) – A table of `cavein_boulder` prefabs to arrange. Must contain at least 5 elements (but uses only first 5).
* **Returns:** Nothing.

### `TryFormationAt(x, y, z)`
* **Description:** Scans for up to 5 unformed, non-raised, non-falling boulders within `FORMATION_RADIUS` and triggers `CreateFormation` if found.
* **Parameters:**  
  `x`, `y`, `z` (numbers) – World coordinates to center the search.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onremove`, `enterlimbo` – Triggers `OnRemoveFromScene`, which handles propped-boulder fall animation and icon cleanup.  
  - `abandon_ship` – Triggers `Sink`, which forces the boulder out of landed state.  
  - `startfalling` and `stopfalling` (via `AddFallingStates`) – Triggers `OnStartFalling` and `OnStopFalling`.  
  - `onputininventory`, `ondropped` (via `SetRadius`) – Implicitly handled in `heavyobstaclephysics` internal logic.  
- **Pushes:**  
  - `dropraisedboulder` – Fired when `SetRaised(inst, false)` is called.  
  - `equipskinneditem`, `unequipskinneditem` – Fired when the boulder is equipped/unequipped with a skin.  
  - `on_landed`, `on_no_longer_landed` – Triggered via `inventoryitem` when landing state changes.