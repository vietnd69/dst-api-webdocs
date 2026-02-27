---
id: inventoryitemmoisture
title: Inventoryitemmoisture
description: Manages moisture level and wet state for inventory items, synchronizing them with environmental or owner conditions over time.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: inventory
source_hash: 7411d04b
---

# Inventoryitemmoisture

## Overview
This component extends `inventoryitem`-owned entities to simulate realistic moisture dynamics: items gradually gain or lose moisture to match a target level determined by environmental conditions (e.g., rain, submersion) or owner state (e.g., player wetness). It runs periodic updates while active and handles persistence, entity sleep/wake cycles, and replica synchronization for networked clients.

## Dependencies & Tags
- **Components Required on Same Instance:** None directly — it is designed to be attached *together with* an `inventoryitem` component (see `AttachReplica`).
- **Tags Added/Removed:** None identified.
- **Other Dependencies:** Relies on `TUNING.MAX_WETNESS`, `TUNING.MOISTURE_WET_THRESHOLD`, `TUNING.MOISTURE_DRY_THRESHOLD`, `TheWorld.state.israining`, `TheWorld.state.wetness`, and optionally `inventoryitem`, `stackable`, `floater`, `rideable`, `rainimmunity`, `container`, and `moisture` (for owner).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `moisture` | `number` | `0` | Current moisture value, clamped between `0` and `TUNING.MAX_WETNESS`. |
| `iswet` | `boolean` | `false` | Whether the item is considered wet, determined by moisture thresholds or explicit setting. |
| `externallycontrolled` | `boolean` | `nil` | If true, item moisture does not auto-update toward environmental target (see `GetTargetMoisture`). |
| `onlywetwhensaturated` | `boolean` | `nil` | If true, `iswet` is only true when `moisture == TUNING.MAX_WETNESS`. |
| `_replica` | `object?` | `nil` | Replica object used to sync state to clients; initialized via `AttachReplica`. |
| `moistureupdatetask` | `task?` | `nil` | Active periodic task performing moisture updates. |
| `onmoisturedeltacallback` | `function?` | `nil` | Optional callback invoked when moisture changes: `fn(inst, oldMoisture, newMoisture)`. |
| `_entitysleeptime` | `number?` | `nil` | Timestamp recorded when entity went to sleep, used to adjust moisture upon wake. |

## Main Functions
### `AttachReplica(replica)`
* **Description:** Links the component to its network replica (`inventoryitem`'s replica), initializes `moisture` and `iswet` to `0`/`false`, and prepares the component for replication.
* **Parameters:**  
  `replica` (`object`) — Replica object returned by `inventoryitem`.

### `OnRemoveFromEntity()`
* **Description:** Cleans up the component on removal: resets moisture, cancels the update task, and clears the task reference.

### `OnEntitySleep()`
* **Description:** Cancels the periodic moisture update task while the entity is sleeping (to avoid inaccuracies). Records the sleep start time.

### `OnEntityWake()`
* **Description:** After waking, computes elapsed time slept and applies it via `UpdateMoisture`. Restarts the periodic task if needed.

### `InheritMoisture(moisture, iswet)`
* **Description:** Sets moisture to a provided value (clamped), updates `iswet` using threshold logic, and fires the optional delta callback if changed. Intended for direct inheritance of moisture (e.g., during item trade or drop).
* **Parameters:**  
  `moisture` (`number`) — Target moisture value.  
  `iswet` (`boolean`) — Desired wet state used in logic when `onlywetwhensaturated` is false.

### `DiluteMoisture(item, count)`
* **Description:** Mixes moisture from another item into this one, simulating dilution (e.g., rainwater in a bucket). Only valid for stackable items and requires the other item to have `inventoryitem`.
* **Parameters:**  
  `item` (`Entity`) — Item contributing moisture.  
  `count` (`number`) — Number of items being added.

### `MakeMoistureAtLeast(min)`
* **Description:** Ensures current moisture is at least `min`, increasing it if needed. Updates `iswet` conservatively (stays wet if already wet or if `min` exceeds dry threshold).
* **Parameters:**  
  `min` (`number`) — Minimum moisture to enforce.

### `DoDelta(delta)`
* **Description:** Applies a moisture change (positive or negative) directly to current moisture.

### `SetMoisture(moisture)`
* **Description:** Sets and clamps moisture, updating `iswet` based on thresholds (wet if ≥ wet threshold, dry if ≤ dry threshold; unchanged if between thresholds). Fires delta callback if value changed.

### `SetExternallyControlled(externallycontrolled)`
* **Description:** Enables/disables automatic moisture adjustment toward environmental target.

### `SetOnlyWetWhenSaturated(onlywetwhensaturated)`
* **Description:** Configures whether `iswet` only becomes true at maximum moisture.

### `SetOnMoistureDeltaCallback(fn)`
* **Description:** Registers a callback to be invoked on every moisture change.

### `GetTargetMoisture()`
* **Description:** Computes the expected target moisture based on game context:  
  - Ocean floating → `TUNING.MAX_WETNESS`.  
  - Exposed container or rain-immune entity → world wetness (or 0).  
  - Player owner → owner’s moisture level.  
  - Otherwise (e.g., sealed container) → `0`.
* **Returns:** `number` — Target moisture value.

### `UpdateMoisture(dt)`
* **Description:** Applies moisture change over `dt` seconds toward target: wetting is slower (linear with rate `0.5*dt`) and drying is faster (`1.0*dt`). Returns `true` if moisture changed, `false` otherwise.

### `OnSave()`
* **Description:** Serializes `moisture` and `iswet` to a table if non-default. Used for saving.

### `OnLoad(data)`
* **Description:** Loads and clamps saved `moisture`, restores `iswet`, and fires delta callback.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging: `moisture: <value> target: <value> [WET]`.

## Events & Listeners
This component does **not** register or push any game events. It uses internal tasks and callbacks instead.