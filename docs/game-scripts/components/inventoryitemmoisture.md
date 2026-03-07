---
id: inventoryitemmoisture
title: Inventoryitemmoisture
description: Manages moisture level and wet state for inventory items, synchronizing them with environmental conditions, owner state, or external control.
tags: [inventory, moisture, environment, networking]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7411d04b
system_scope: inventory
---

# Inventoryitemmoisture

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`InventoryItemMoisture` extends `inventoryitem` to simulate realistic moisture behavior for held or stored items. It dynamically adjusts an item's `moisture` and `iswet` state based on environmental factors (e.g., rain, ocean submersion) and owner moisture (e.g., player wetness), while supporting external control and callbacks. It relies on replication via `_replica` (set by `inventoryitem`) for network sync and integrates with `floater`, `rideable`, `container`, `rainimmunity`, and `moisture` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inventoryitem")
inst:AddComponent("inventoryitemmoisture")
-- Note: The inventoryitemmoisture component is internally wired by inventoryitem during attachment
-- To manually configure behavior:
inst.components.inventoryitemmoisture:SetOnlyWetWhenSaturated(true)
inst.components.inventoryitemmoisture:SetExternallyControlled(true)
inst.components.inventoryitemmoisture:SetOnMoistureDeltaCallback(function(entity, old, new)
    print(entity:GetName(), "moisture changed from", old, "to", new)
end)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `floater`, `container`, `rideable`, `rainimmunity`, `moisture`, `stackable`  
**Tags:** Checks: `inventoryitem`, `floater`, `container`, `rideable`, `rainimmunity`, `moisture`, `stackable` — none added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (inherited) | Entity owning this component. |
| `_replica` | `ReplicaInventoryItemMoisture` or `nil` | `nil` | Network replica; initialized via `AttachReplica`. |
| `moisture` | number | `0` (after `AttachReplica`) | Current moisture level, clamped to `[0, MAX_WETNESS]`. |
| `iswet` | boolean | `false` (after `AttachRepque`) | Whether the item is considered wet. |
| `externallycontrolled` | boolean | `false` | If true, `GetTargetMoisture()` returns `moisture` directly (no environmental updates). |
| `onlywetwhensaturated` | boolean | `nil` | If true, `iswet` is set only when `moisture == MAX_WETNESS`; otherwise, thresholds are used. |
| `onmoisturedeltacallback` | function or `nil` | `nil` | Callback fired when `moisture` changes: `fn(entity, old_moisture, new_moisture)`. |
| `moistureupdatetask` | `PeriodicTask` or `nil` | `nil` | Task managing periodic moisture updates; starts/stops based on proximity to target. |
| `_entitysleeptime` | number or `nil` | `nil` | Timestamp used to compute elapsed time during entity sleep/wake cycles. |

## Main functions
### `AttachReplica(replica)`
* **Description:** Called internally by `inventoryitem` to link to the network replica and initialize `moisture`/`iswet`.
* **Parameters:** `replica` (`ReplicaInventoryItemMoisture`) — the networked replica object.
* **Returns:** Nothing.

### `OnRemoveFromEntity()`
* **Description:** Cleans up state when component is removed (e.g., item destroyed).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntitySleep()`
* **Description:** Cancels the moisture update task when the entity goes to sleep (e.g., inside a container or bag).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntityWake()`
* **Description:** Recomputes elapsed sleep time and updates moisture; resumes periodic updates if needed.
* **Parameters:** None.
* **Returns:** Nothing.

### `InheritMoisture(moisture, iswet)`
* **Description:** Sets moisture and wetness based on an external source (e.g., from another item during stacking or transfer), respecting `onlywetwhensaturated`.
* **Parameters:** `moisture` (number), `iswet` (boolean).
* **Returns:** Nothing.
* **Error states:** Clamps `moisture` to `[0, TUNING.MAX_WETNESS]`.

### `DiluteMoisture(item, count)`
* **Description:** Blends moisture levels with another item stack (e.g., adding damp items to a dry stack). Only active if both items are stackable and the target has `inventoryitem`.
* **Parameters:** `item` (`Entity`), `count` (number) — number of items from the source stack to dilute with.
* **Returns:** Nothing.
* **Error states:** No effect if either item lacks `stackable` or the source lacks `inventoryitem`.

### `MakeMoistureAtLeast(min)`
* **Description:** Raises `moisture` to at least `min` without reducing it.
* **Parameters:** `min` (number).
* **Returns:** Nothing.
* **Error states:** Updates `iswet` if `min > MOISTURE_DRY_THRESHOLD`; does not reduce `iswet` once wet.

### `DoDelta(delta)`
* **Description:** Applies a relative moisture change (e.g., for evaporation or absorption).
* **Parameters:** `delta` (number) — amount to add to current moisture.
* **Returns:** Nothing.

### `SetMoisture(moisture)`
* **Description:** Directly sets moisture and updates `iswet`. This is the canonical setter used by all other moisture-modifying methods.
* **Parameters:** `moisture` (number).
* **Returns:** Nothing.
* **Error states:** Clamps input to `[0, TUNING.MAX_WETNESS]`. Wet/dry thresholds: `MOISTURE_WET_THRESHOLD` and `MOISTURE_DRY_THRESHOLD`; `iswet` is unchanged when moisture is between them.

### `SetExternallyControlled(externallycontrolled)`
* **Description:** Toggles external control mode. When enabled, target moisture is ignored; item moisture remains static unless manually set.
* **Parameters:** `externallycontrolled` (boolean).
* **Returns:** Nothing.

### `SetOnlyWetWhenSaturated(onlywetwhensaturated)`
* **Description:** Configures wetness logic. When true, `iswet` is only `true` if `moisture == MAX_WETNESS`.
* **Parameters:** `onlywetwhensaturated` (boolean).
* **Returns:** Nothing.

### `SetOnMoistureDeltaCallback(fn)`
* **Description:** Registers a callback invoked every time `moisture` changes (via `SetMoisture`, `DoDelta`, etc.).
* **Parameters:** `fn` (function) — signature: `fn(entity, old_moisture, new_moisture)`.
* **Returns:** Nothing.

### `GetTargetMoisture()`
* **Description:** Computes the *desired* moisture level based on environment/owner:
  - If `externallycontrolled`: returns current `moisture`.
  - If floating (`floater.showing_effect`): returns `MAX_WETNESS`.
  - If exposed to rain and not immune: returns current world `wetness`.
  - If owned by an entity with `moisture` component: returns that component's moisture.
  - Otherwise (e.g., in a dry container): returns `0`.
* **Parameters:** None.
* **Returns:** `number` — target moisture value.

### `UpdateMoisture(dt)`
* **Description:** Advances `moisture` toward `GetTargetMoisture()` over `dt` seconds. Updates speed: approach at `0.5 * dt` when increasing; `dt` when decreasing.
* **Parameters:** `dt` (number) — elapsed time in seconds.
* **Returns:** `true` if `moisture` changed; `false` if no update occurred.
* **Error states:** Returns `false` only when `targetMoisture == current moisture`.

### `OnSave()`
* **Description:** Serializes moisture state for world save.
* **Parameters:** None.
* **Returns:** `table?` — e.g., `{ moisture = 10.5, wet = true }`, or `nil` if both are zero/false.

### `OnLoad(data)`
* **Description:** Deserializes moisture state from world save.
* **Parameters:** `data` (`table?`) — optional save data with `moisture` (number) and/or `wet` (boolean).
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string (e.g., `"moisture: 12.50 target: 0.00"`), appending `" WET"` if applicable.
* **Parameters:** None.
* **Returns:** `string`.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls are present in this file).
- **Pushes:** None (no `inst:PushEvent` calls are present in this file).
