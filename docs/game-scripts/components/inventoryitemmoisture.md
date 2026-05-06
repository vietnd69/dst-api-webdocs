---
id: inventoryitemmoisture
title: InventoryItemMoisture
description: Manages moisture and wetness state for inventory items, synchronizing with owner or world conditions.
tags: [inventory, moisture, wetness]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: components
source_hash: 47873fdf
system_scope: inventory
---

# InventoryItemMoisture

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`InventoryItemMoisture` extends the `inventoryitem` component to track and update moisture levels for items in inventory. It calculates target moisture based on owner state, world rain, or floating status, and updates the item's wetness accordingly. This component should not be used standalone—it is designed to work alongside `inventoryitem`.

Moisture updates occur via periodic tasks that adjust the item's moisture toward a target value. The component supports network replication through a replica object and handles entity sleep/wake cycles to minimize unnecessary updates.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("inventoryitemmoisture")
inst.components.inventoryitemmoisture:AttachReplica(inst.replica.inventoryitemmoisture)
inst.components.inventoryitemmoisture:SetMoisture(50)
inst.components.inventoryitemmoisture:SetOnlyWetWhenSaturated(true)
```

## Dependencies & tags
**Components used:**
- `inventoryitem` -- accesses `owner` property to determine moisture source
- `stackable` -- reads `stacksize` for moisture dilution calculations
- `floater` -- checks `showing_effect` to apply max wetness when floating
- `rainimmunity` -- checked to determine if entity is protected from rain
- `rideable` -- calls `GetRider()` to traverse rider chain for moisture source
- `container` -- checks `isexposed` to determine if container contents are exposed to elements
- `moisture` -- calls `GetMoisture()` on owner to inherit moisture value

**Tags:**
- None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The entity instance that owns this component. |
| `lastUpdate` | number | `GetTime()` | Timestamp of the last moisture update. |
| `_replica` | table | `nil` | Network replica object for state synchronization. |
| `moisture` | number | `0` | Current moisture value (0 to `TUNING.MAX_WETNESS`). |
| `iswet` | boolean | `false` | Whether the item is currently considered wet. |
| `moistureupdatetask` | task | `nil` | Reference to the periodic update task. |
| `_entitysleeptime` | number | `nil` | Timestamp when the entity went to sleep. |
| `externallycontrolled` | boolean | `nil` | If true, moisture is not automatically updated toward target. |
| `onlywetwhensaturated` | boolean | `nil` | If true, item is only wet when moisture equals `TUNING.MAX_WETNESS`. |
| `onmoisturedeltacallback` | function | `nil` | Callback fired when moisture changes. |

## Main functions
### `AttachReplica(replica)`
* **Description:** Links the network replica object and initializes moisture properties. Called internally by the `inventoryitem` component during setup.
* **Parameters:** `replica` -- network replica table for state synchronization.
* **Returns:** None.
* **Error states:** None.

### `OnRemoveFromEntity()`
* **Description:** Resets moisture state and cancels the update task when the component is removed from an entity.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `OnEntitySleep()`
* **Description:** Cancels the update task and records the sleep time when the entity goes to sleep.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `OnEntityWake()`
* **Description:** Updates moisture based on time slept and restarts the periodic update task with a random initial delay.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

### `InheritMoisture(moisture, iswet)`
* **Description:** Sets moisture from an external source, clamping to valid range and updating wetness state based on configuration.
* **Parameters:**
  - `moisture` -- number, the moisture value to inherit.
  - `iswet` -- boolean, whether the source is wet.
* **Returns:** None.
* **Error states:** None.

### `DiluteMoisture(item, count)`
* **Description:** Averages moisture when stacking with another item, weighted by stack sizes.
* **Parameters:**
  - `item` -- entity, the item being stacked with.
  - `count` -- number, the stack count of the other item.
* **Returns:** None.
* **Error states:** None

### `MakeMoistureAtLeast(min)`
* **Description:** Ensures moisture is at least the specified minimum value, updating wetness state accordingly.
* **Parameters:** `min` -- number, the minimum moisture value.
* **Returns:** None.
* **Error states:** None.

### `DoDelta(delta)`
* **Description:** Applies a moisture change by calling `SetMoisture` with the current value plus delta.
* **Parameters:** `delta` -- number, the moisture change amount (can be negative).
* **Returns:** None.
* **Error states:** None.

### `SetMoisture(moisture)`
* **Description:** Sets the moisture value, clamping to valid range and updating wetness state based on thresholds. Triggers the moisture delta callback if set.
* **Parameters:** `moisture` -- number, the moisture value to set.
* **Returns:** None.
* **Error states:** None.

### `SetExternallyControlled(externallycontrolled)`
* **Description:** Toggles whether moisture is automatically updated toward target or controlled externally.
* **Parameters:** `externallycontrolled` -- boolean, true to disable automatic updates.
* **Returns:** None.
* **Error states:** None.

### `SetOnlyWetWhenSaturated(onlywetwhensaturated)`
* **Description:** Configures whether the item is only considered wet when fully saturated (at `TUNING.MAX_WETNESS`).
* **Parameters:** `onlywetwhensaturated` -- boolean, true to require full saturation for wet state.
* **Returns:** None.
* **Error states:** None.

### `SetOnMoistureDeltaCallback(fn)`
* **Description:** Sets a callback function that fires when moisture changes. Used to avoid event overhead for entities that need moisture change notifications.
* **Parameters:** `fn` -- function, callback with signature `fn(inst, oldMoisture, newMoisture)`.
* **Returns:** None.
* **Error states:** None.

### `GetTargetMoisture()`
* **Description:** Calculates the target moisture value based on owner state, world rain, floating status, or container exposure. Traverses owner/container/rideable chain to find the appropriate moisture source.
* **Parameters:** None.
* **Returns:** Number representing the target moisture value.
* **Error states:** None

### `UpdateMoisture(dt)`
* **Description:** Updates the current moisture toward the target value over time. Returns whether a change occurred.
* **Parameters:** `dt` -- number, the time delta in seconds.
* **Returns:** Boolean — `true` if moisture changed, `false` if already at target.
* **Error states:** None.

### `OnSave()`
* **Description:** Serializes moisture state for persistence. Returns nil if no data needs saving.
* **Parameters:** None.
* **Returns:** Table with `moisture` and `wet` keys, or `nil` if both are at default values.
* **Error states:** None.

### `OnLoad(data)`
* **Description:** Restores moisture state from saved data. Triggers the moisture delta callback if set.
* **Parameters:** `data` -- table, saved data from `OnSave()`.
* **Returns:** None.
* **Error states:** None.

### `GetDebugString()`
* **Description:** Returns a formatted debug string showing current moisture, target moisture, and wet status.
* **Parameters:** None.
* **Returns:** String in format `"moisture: X.XX target: X.XX WET"`.
* **Error states:** None.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
- **Net variable handlers:** `moisture` and `iswet` net variables trigger `onmoisture` and `oniswet` functions to update the replica state.