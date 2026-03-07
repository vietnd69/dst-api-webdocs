---
id: storage_robot
title: Storage Robot
description: Manages the behavior and state of the Storage Robot, a companion entity that collects and stores items from the world using fuel-based operation.
tags: [inventory, locomotion, fuel, companion, ai]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 375a14cf
system_scope: entity
---

# Storage Robot

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`storage_robot.lua` defines the `storage_robot` prefab, a specialized companion entity that patrols the world, picks up items, and stores them in nearby containers. It uses fuel for operation, changes appearance and movement characteristics as fuel depletes, and supports equippable headgear (e.g., open-top hats) to control lighting and visuals. The component relies heavily on the `inventory`, `fueled`, `locomotor`, `trader`, `drownable`, and `deployhelper` components, and integrates with a custom brain and stategraph (`SGstorage_robot`) for behavior control.

## Usage example
```lua
local inst = Prefab("storage_robot", fn, assets)
inst:AddComponent("inventory")
inst.components.inventory.maxslots = 1
inst:AddComponent("fueled")
inst.components.fueled.fueltype = FUELTYPE.MAGIC
inst.components.fueled:InitializeFuelLevel(TUNING.STORAGE_ROBOT_FUEL)
```
This prefab is instantiated automatically via `return Prefab("storage_robot", fn, assets)` and does not require manual component addition in typical mod usage.

## Dependencies & tags
**Components used:** `deployhelper`, `drownable`, `inventory`, `inventoryitem`, `locomotor`, `fueled`, `forgerepairable`, `trader`, `inspectable`, `knownlocations`
**Tags added:** `companion`, `NOBLOCK`, `scarytoprey`, `storagerobot`, `irreplaceable`, `broken` (conditionally)
**Tags checked:** `broken`, `open_top_hat`, `NOCLICK`, `CLASSIFIED`, `placer`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_originx`, `_originz` | `net_float` | `nil` | Networked floats tracking the robot's spawn point origin; triggers `origindirty` updates. |
| `SCANNABLE_RECIPENAME` | string | `"winona_storage_robot"` | Recipe name used for scanning and construction. |
| `PICKUP_ARRIVE_DIST` | number | `0` | Distance threshold for pickup action during offscreen operations. |
| `helper` | `Entity` or `nil` | `nil` | Optional visual radius circle (non-networked), active when helper is enabled. |
| `_sleeptask`, `_sleepteleporttask` | `Task` or `nil` | `nil` | Tasks managing offscreen pickup and sleep-time teleport logic. |
| `_last_spark_time` | number or `nil` | `nil` | Timestamp of last spark effect when wet. |

## Main functions
### `CreateHelperRadiusCircle()`
* **Description:** Creates a non-networked visual entity showing the robot's work radius as a light-blue circle.
* **Parameters:** None.
* **Returns:** `Entity` — The visual circle entity.
* **Error states:** None; always returns a valid entity.

### `DoOnDroppedLogic(inst)`
* **Description:** Handles cleanup and state transitions when the robot is dropped, including updating spawn points and choosing idle state (`idle` vs `idle_broken`).
* **Parameters:** `inst` (`Entity`) — The storage robot instance.
* **Returns:** Nothing.
* **Error states:** Uses `StorageRobotCommon.UpdateSpawnPoint(inst)` and may set broken state if fuel is empty.

### `OnPickup(inst, pickupguy, src_pos)`
* **Description:** Dumps the robot’s held item and hat onto the ground or gives them to the pickup entity. Resets state and stops consumption.
* **Parameters:**  
  `inst` (`Entity`) — The robot instance.  
  `pickupguy` (`Entity` or `nil`) — Entity picking up the robot.  
  `src_pos` (`Vector3` or `nil`) — Position of pickup.
* **Returns:** Nothing.
* **Error states:** Fallback drops items if inventory is unavailable.

### `SetBroken(inst)`
* **Description:** Marks the robot as broken, updates visuals (icon, inventory image), and removes physics colliders.
* **Parameters:** `inst` (`Entity`) — The robot instance.
* **Returns:** Nothing.

### `OnRepaired(inst)`
* **Description:** Removes the `broken` tag and transitions the robot out of broken states, potentially switching animations or builds.
* **Parameters:** `inst` (`Entity`) — The robot instance.
* **Returns:** Nothing.

### `DoOffscreenPickup(inst)`
* **Description:** Performs inventory pickup and storage logic while the robot is offscreen, using fuel proportional to distance and animation time.
* **Parameters:** `inst` (`Entity`) — The robot instance.
* **Returns:** Nothing.
* **Error states:** Early return if no item is found or container is unreachable; re-queues pickup task.

### `StartOffscreenPickupTask(inst, time)`
* **Description:** Schedules a delayed offscreen pickup task. Cancels existing tasks first.
* **Parameters:** `inst` (`Entity`) — The robot instance.  
  `time` (`number`) — Delay in seconds.
* **Returns:** Nothing.

### `OnUpdateFueled(inst)`
* **Description:** Adjusts fuel consumption rate based on moisture level; spawns sparks periodically when wet.
* **Parameters:** `inst` (`Entity`) — The robot instance.
* **Returns:** Nothing.

### `FueledSectionCallback(newsection, oldsection, inst)`
* **Description:** Dynamically updates robot build, walkspeed, and mass as fuel sections change (e.g., `storage_robot_small`, `storage_robot_med`, `storage_robot`).
* **Parameters:**  
  `newsection` (`number`) — New fuel section index.  
  `oldsection` (`number`) — Previous fuel section index.  
  `inst` (`Entity`) — The robot instance.
* **Returns:** Nothing.

### `GetFueledSectionMass(inst)`
* **Description:** Returns current mass based on fuel level.
* **Parameters:** `inst` (`Entity`) — The robot instance.
* **Returns:** `number` — Mass value (`TUNING.STORAGE_ROBOT_MASS.SMALL`, `.MED`, or `.FULL`).

### `GetFueledSectionSuffix(inst)`
* **Description:** Returns a string suffix (`"_small"`, `"_med"`, or `""`) based on current fuel section.
* **Parameters:** `inst` (`Entity`) — The robot instance.
* **Returns:** `string` — Sound suffix for vocalizations.

### `OnGetItemFromPlayer(inst, giver, item)`
* **Description:** Handles equipping a headgear item given by a player; plays pickup sound.
* **Parameters:** `inst` (`Entity`) — The robot instance.  
  `giver` (`Entity`) — The player.  
  `item` (`Entity`) — The equipped item (must be `EQUIPSLOTS.HEAD`).
* **Returns:** Nothing.

### `OnRefuseItemFromPlayer(inst, giver, item)`
* **Description:** Plays refusal sound when a player attempts to give an unacceptable item.
* **Parameters:** `inst` (`Entity`) — The robot instance.  
  `giver` (`Entity`) — The player.  
  `item` (`Entity`) — The refused item.
* **Returns:** Nothing.

### `OnInventoryChange(inst, data)`
* **Description:** Toggles the robot’s light and bloom visuals based on held inventory item and equipped hat.
* **Parameters:** `inst` (`Entity`) — The robot instance.  
  `data` — Event payload (ignored).
* **Returns:** Nothing.

### `GetStatus(inst, viewer)`
* **Description:** Returns `"BROKEN"` status if fuel is depleted.
* **Parameters:** `inst` (`Entity`) — The robot instance.  
  `viewer` (`Entity`) — The inspecting entity.
* **Returns:** `string` or `nil` — `"BROKEN"` or `nil`.

## Events & listeners
- **Listens to:**  
  `origindirty` — Updates helper circle position.  
  `onreachdestination` — Snaps robot to item position for correct layering.  
  `itemget`, `itemlose` — Triggers light update (`OnInventoryChange`).  
  `equip`, `unequip` — Handles headgear light遮蔽 logic (`OnEquipSomething`, `OnUnequipSomething`).  
  `teleported` — Updates spawn point and cancels pickup tasks.  
  `onfueldsectionchanged` — Automatically triggers `FueledSectionCallback`.  
  `onrepaired` — Automatically triggers `OnRepaired`.  
  `onbroken` — Automatically triggers `OnBroken` via `SetDepletedFn`.  
  `onpickup`, `ondrop` — Automatically triggers `OnPickup`, `OnDropped` via `SetOnPickupFn`, `SetOnDroppedFn`.  
  `enterlimbo`, `exitlimbo`, `sleep`, `wake` — Triggers `OnEntitySleep`, `OnEntityWake`, and related teleport logic.  
  `accept`, `refuse` — Triggers `OnGetItemFromPlayer`, `OnRefuseItemFromPlayer` via `Trader` component.

- **Pushes:**  
  `dropitem`, `setoverflow`, `setbroken`, `imagechange`, `locomote`, `onreachdestination`, `origindirty`, `setbreakable`, `setrepairable`, `settradeable`.