---
id: amphibiouscreature
title: AmphibiousCreature
description: Manages automatic swimming state and animation bank switching for entities that transition between land and water tiles.
tags: [locomotion, animation, environment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ca5e1300
system_scope: locomotion
---

# AmphibiousCreature

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AmphibiousCreature` automatically detects when an entity moves between land and ocean tiles, toggles the `swimming` tag accordingly, and switches animation banks (e.g., land vs water animations). It updates per-frame while the entity is awake and not dead, and stops updating on death or when the entity falls asleep.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("amphibiouscreature")
inst.components.amphibiouscreature:SetBanks("hare", "hare_swim")
inst.components.amphibiouscreature:SetEnterWaterFn(function(ent)
    print(ent:GetName() .. " entered water!")
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `swimming` when entering water; removes it when exiting.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tile` | table | `nil` | Not used internally; appears to be a remnant. |
| `tileinfo` | table | `nil` | Not used internally. |
| `ontilechangefn` | function | `nil` | Not used internally. |
| `in_water` | boolean | `false` | Whether the entity is currently on a water tile. |
| `onwaterchangefn` | function | `nil` | Not used internally. |
| `land_bank` | string | `nil` | Animation bank name used when on land. |
| `ocean_bank` | string | `nil` | Animation bank name used when in water. |
| `transitiondistance` | number | `2.5` | Distance threshold for tile transitions (not used in current logic). |
| `enterwaterfn` | function | `nil` | Custom callback fired when entering water. |
| `exitwaterfn` | function | `nil` | Custom callback fired when exiting water. |

## Main functions
### `SetBanks(land, ocean)`
* **Description:** Sets the animation bank names to use when the entity is on land (`land`) or in water (`ocean`).
* **Parameters:**  
  `land` (string) — name of the animation bank for land animations.  
  `ocean` (string) — name of the animation bank for water animations.  
* **Returns:** Nothing.

### `SetTransitionDistance(transitiondistance)`
* **Description:** Sets the distance threshold used to detect tile transitions. Note: current implementation does not use this value.
* **Parameters:**  
  `transitiondistance` (number) — desired transition distance.  
* **Returns:** Nothing.

### `GetTransitionDistance()`
* **Description:** Returns the currently configured transition distance.
* **Parameters:** None.  
* **Returns:** number — the current `transitiondistance` value.

### `OnUpdate(dt)`
* **Description:** Periodically checks the entity’s position to determine if it crossed a land/water boundary. Updates swimming state and animation bank if needed. Skips updates while the entity is jumping.
* **Parameters:**  
  `dt` (number) — delta time since last frame.  
* **Returns:** Nothing.

### `OnEnterOcean()`
* **Description:** Called when the entity moves onto a water tile. Sets `in_water` to `true`, adds the `swimming` tag, switches to the ocean animation bank (if set), and invokes `enterwaterfn` if defined.
* **Parameters:** None.  
* **Returns:** Nothing.

### `OnExitOcean()`
* **Description:** Called when the entity moves onto a land tile. Sets `in_water` to `false`, removes the `swimming` tag, switches to the land animation bank (if set), and invokes `exitwaterfn` if defined.
* **Parameters:** None.  
* **Returns:** Nothing.

### `SetEnterWaterFn(fn)`
* **Description:** Registers a callback function to be invoked when the entity enters water.
* **Parameters:**  
  `fn` (function) — function taking the entity instance as its only argument.  
* **Returns:** Nothing.

### `SetExitWaterFn(fn)`
* **Description:** Registers a callback function to be invoked when the entity exits water.
* **Parameters:**  
  `fn` (function) — function taking the entity instance as its only argument.  
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a simple status string for debugging display.
* **Parameters:** None.  
* **Returns:** string — `"in water: true"` or `"in water: false"`.

## Events & listeners
- **Listens to:** `death` — stops component updates when the entity dies (via `OnDeath`).
- **Pushes:** None identified.

## Public lifecycle hooks
- `OnRemoveFromEntity()`: Removes the `death` event listener.
- `OnEntitySleep()`: Pauses per-frame updates.
- `OnEntityWake()`: Restarts per-frame updates (unless dead).
