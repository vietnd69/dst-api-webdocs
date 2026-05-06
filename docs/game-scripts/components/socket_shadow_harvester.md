---
id: socket_shadow_harvester
title: Socket Shadow Harvester
description: Manages automated harvesting of pickable items and traps via shadow tendrils for WX-78 skill system.
tags: [skills, wx78, harvesting]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 88b28143
system_scope: entity
---

# Socket Shadow Harvester

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Socket_Shadow_Harvester` enables automated harvesting of nearby pickable entities and traps through shadow tendril projectiles. It is primarily used for WX-78's skill system passive harvesting ability. Player entities trigger ticks via pickup/pick events, while non-player entities use periodic task-based ticking. The component spawns visual tendrils that travel to target items and harvest them upon arrival.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("socket_shadow_harvester")
inst.components.socket_shadow_harvester:SetHarvestRadius(6)
inst.components.socket_shadow_harvester:SetMaxTendrils(3)
inst.components.socket_shadow_harvester:SetTravelSpeed(3)
```

## Dependencies & tags
**External dependencies:**
- `TUNING.SKILLS.WX78.HARVEST_PASSIVE_TICK_PERIOD` -- tick period constant for passive harvesting
- `FindPickupableItem` -- external function to locate harvestable items in range
- `Launch2` -- external function to launch loot items after harvesting
- `math2d.DistSq` -- distance calculation utility

**Components used:**
- `trap` -- calls `Harvest()` on trap components
- `pickable` -- calls `Pick()` on pickable components
- `inventoryitem` -- checks owner status to validate targets
- `stackable` -- calls `Get()` to extract single items from stacks
- `inventory` or `container` -- calls `GiveItem()` to transfer harvested items
- `minigame_participator` -- calls `GetMinigame()` to push cheat events
- `updatelooper` -- adds update function for tendril movement
- `SoundEmitter` -- plays pick sounds on successful harvests

**Tags:**
- `pickable` -- required tag for valid harvest targets
- `plant`, `lichen`, `oceanvine`, `kelp` -- one of these tags required for valid targets
- `INLIMBO`, `FX` -- entities with these tags are excluded from harvesting

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `harvestradius` | number | `4` | Maximum distance in units to search for harvestable items. |
| `travelspeed` | number | `2` | Speed at which shadow tendrils travel toward targets. |
| `maxtendrils` | number | `1` | Maximum number of concurrent tendrils allowed. |
| `tendrilscount` | number | `0` | Current count of active tendrils. |
| `tendrils` | table | `{}` | Maps tendril entities to their target items. |
| `items` | table | `{}` | Inverted lookup table mapping items to their tendrils. |
| `periodictask` | task | `nil` | Periodic task handle for non-player entity ticking. |
| `item` | entity | `nil` | Currently tracked item entity. |
| `removeontendrilsfinished` | boolean | `nil` | If true, entity removes itself after all tendrils complete. |
| `onusedfn` | function | `nil` | Callback hook fired after successful harvest. Signature: `fn(inst)`. Set by owning prefab. |
| `ontendrilremoved` | function | `nil` | Callback assigned in constructor. Handles tendril cleanup when a tendril entity is removed. |
| `onitemremoved` | function | `nil` | Callback assigned in constructor. Handles item cleanup when a tracked item entity is removed. |
| `OnTick` | function | `nil` | Callback assigned in constructor. Triggers `DoTick()` when called. |
| `OnAoETick` | function | `nil` | Player-only callback assigned in constructor. Handles `picksomethingfromaoe` event by calling `DoTick()` for each harvested item. |

## Main functions
### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when component is removed from entity. Cancels periodic tasks, removes event listeners, and removes all active tendrils.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `SetHarvestRadius(harvestradius)`
* **Description:** Sets the maximum search radius for harvestable items.
* **Parameters:** `harvestradius` -- number representing search radius in units
* **Returns:** nil
* **Error states:** None

### `SetTravelSpeed(travelspeed)`
* **Description:** Sets the movement speed of shadow tendrils traveling to targets.
* **Parameters:** `travelspeed` -- number representing units per second
* **Returns:** nil
* **Error states:** None

### `SetMaxTendrils(maxtendrils)`
* **Description:** Sets the maximum number of concurrent tendrils that can be active.
* **Parameters:** `maxtendrils` -- number representing maximum concurrent tendrils
* **Returns:** nil
* **Error states:** None

### `RemoveOnTendrilsFinished()`
* **Description:** Sets the flag to remove the owning entity after all tendrils complete their harvesting.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `ClearItem()`
* **Description:** Clears the currently tracked item and removes its onremove event listener.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `SetItem(item)`
* **Description:** Sets a specific item to track and registers an onremove event listener. Automatically clears any previously tracked item.
* **Parameters:** `item` -- entity instance to track
* **Returns:** nil
* **Error states:** None

### `HarvestItem_Internal(tendril, item)`
* **Description:** Executes the harvest logic on a target item. Handles traps via `trap:Harvest()`, pickables via `pickable:Pick()`, and generic items via inventory transfer. Plays pick sounds and launches loot. Pushes `pickupcheat` event to minigame if participator exists. Calls `onusedfn` callback after completion.
* **Parameters:**
  - `tendril` -- shadow tendril entity that reached the target
  - `item` -- target item entity to harvest
* **Returns:** nil
* **Error states:** Errors if `self.inst.components.inventory` and `self.inst.components.container` are both nil when attempting to give harvested items (no nil guard present).

### `TryToFindItem()`
* **Description:** Searches for valid harvestable items within the harvest radius. Uses `FindPickupableItem` with component tag filters.
* **Parameters:** None
* **Returns:** Entity instance of found item, or `nil` if no valid target exists.
* **Error states:** Errors if `self.inst.components.inventory` and `self.inst.components.container` are both nil (passed to `FindPickupableItem` without nil guard).

### `DoTick()`
* **Description:** Main tick function that spawns a shadow tendril toward a found item. Checks tendril count against maximum, finds a target item, spawns a `shadow_harvester_trail` prefab, and sets up an updatelooper to move the tendril toward the target. When the tendril reaches the target, calls `HarvestItem_Internal()`. Increments tendril count and registers onremove listeners for cleanup.
* **Parameters:** None
* **Returns:** nil
* **Error states:** Errors if `self.inst.Transform` is nil when getting position for tendril spawn (no nil guard present).

### `OnAoETick(data)`
* **Description:** **Player-only.** Handles the `picksomethingfromaoe` event by iterating through the harvested count and calling `DoTick()` for each harvested item.
* **Parameters:** `data` -- table containing `harvestedcount` field indicating number of items harvested
* **Returns:** nil
* **Error states:** None

## Events & listeners
**Listens to:**
- `onpickupitem` (player only) -- triggers `OnTick` when player picks up an item
- `picksomething` (player only) -- triggers `OnTick` when player picks something
- `picksomethingfromaoe` (player only) -- triggers `OnAoETick` with harvest count data
- `onremove` (tendril) -- triggers `ontendrilremoved` callback when tendril is removed
- `onremove` (item) -- triggers `onitemremoved` callback when tracked item is removed

**Pushes:**
- `pickupcheat` -- pushed to minigame component if `minigame_participator` exists. Data: `{cheater = entity, item = entity}`