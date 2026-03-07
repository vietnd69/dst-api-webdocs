---
id: fans
title: Fans
description: Implements wearable fans (featherfan and perdfan) that extinguish fires and cool nearby entities, with the perdfan additionally summoning tornadoes when channeling.
tags: [inventory, environment, fx]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 93b20b76
system_scope: inventory
---

# Fans

> Based on game build **7140114** | Last updated: 2026-03-05

## Overview
The `fans.lua` file defines two wearable prefabs — `featherfan` and `perdfan` — which function as inventory items equipped to provide environmental utility. The featherfan extinguishes nearby burning or smoldering entities and cools temperature-sensitive entities in proximity. The perdfan extends this functionality by allowing the player to channel and summon tornadoes when sufficient uses remain. Both prefabs leverage the `fan`, `finiteuses`, and `floater` components to manage behavior, durability, and visual presentation.

## Usage example
```lua
-- Example: spawning a featherfan programmatically
local fan = SpawnPrefab("featherfan")
fan.Transform:SetPosition(0, 0, 0)
fan.components.inventoryitem:Equip()

-- Example: using the fan on a smoldering entity
local target = FindEntity(nil, TUNING.FEATHERFAN_RADIUS, {"smolder"})
if target ~= nil then
    fan:DoTaskInTime(0, function() fan.components.fan:OnUse(target) end)
end
```

## Dependencies & tags
**Components used:** `burnable`, `fan`, `finiteuses`, `floater`, `inventoryitem`, `knownlocations`, `temperature`  
**Tags added:** `fan`, `channelingfan` (for perdfan), `donotautopick`, `usesdepleted` (via `finiteuses` when exhausted)  
**Tags excluded from targeting:** `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `playerghost`  
**Tags searched for single target per use:** `smolder`, `fire`, `player`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lasttornadoangle` | number (optional) | `nil` | Tracks last tornado direction for alternation (perdfan only). |

## Main functions
### `OnUse(inst, target)`
*   **Description:** Extinguishes smoldering or fire components on nearby entities and cools their temperature if within range. Called when the fan is used in inventory.
*   **Parameters:**  
    `inst` (Entity) — the fan instance.  
    `target` (Entity) — the primary targeted entity (used for positioning, not directly modified).  
*   **Returns:** Nothing.  
*   **Error states:** No explicit error handling; relies on component existence checks (`v.components.burnable ~= nil`, `v.components.temperature ~= nil`).

### `NoHoles(pt)`
*   **Description:** Predicate function used by `FindWalkableOffset` to avoid spawning tornadoes near holes.
*   **Parameters:**  
    `pt` (Vec3) — world position to test.  
*   **Returns:** `true` if the point is not near a hole, otherwise `false`.

### `OnChanneling(inst, target)`
*   **Description:** Creates a tornado at an offset position when the perdfan is channeled. Consumes 2 uses per tornado. Only activates if `finiteuses` > 3.
*   **Parameters:**  
    `inst` (Entity) — the perdfan instance.  
    `target` (Entity or nil) — optional target for position reference.  
*   **Returns:** Nothing.  
*   **Error states:** Early return if uses are `<= 3`; skips tornado spawn if no valid position is found.

### `common_fn(overridesymbol, onchannelingfn)`
*   **Description:** Shared constructor for both fan prefabs. Sets up transform, animation, sound, network, inventory, fan, and finiteuses components.
*   **Parameters:**  
    `overridesymbol` (string or nil) — optional symbol override for anim state.  
    `onchannelingfn` (function or nil) — callback for channeling behavior.  
*   **Returns:** Fully configured `Entity` instance.  
*   **Error states:** Returns early on clientside if `TheWorld.ismastersim` is `false`.

### `feather_fn()`
*   **Description:** Factory function for the `featherfan` prefab. Configures floater scale/offset and sets finiteuses max/initial count from tuning.
*   **Parameters:** None.  
*   **Returns:** `featherfan` entity.

### `perd_fn()`
*   **Description:** Factory function for the `perdfan` prefab. Configures special floater bank swap, sets symbol override, channeling callback, and finiteuses values.
*   **Parameters:** None.  
*   **Returns:** `perdfan` entity.

## Events & listeners
- **Listens to:** None directly in this file (event handling occurs in components like `burnable`, `finiteuses`, `fan`, and `temperature`).
- **Pushes:** `percentusedchange` (via `finiteuses:SetUses`) and `onextinguish` (via `burnable:Extinguish`).