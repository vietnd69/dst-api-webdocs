---
id: rideable
title: Rideable
description: Manages riding, saddling, and related behaviors for entities that can be mounted or equipped with a saddle in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 810bf8e8
---

# Rideable

## Overview
The `Rideable` component enables an entity to be ridden by a player and equipped with a saddle. It handles rider attachment/detachment, periodic tick updates while being ridden, saddle attachment/detachment (including visual and logic effects), and persistence across saves—especially in coordination with the `domesticatable` component.

## Dependencies & Tags
**Components:**
- Relies on `domesticatable` for obedience checks (`:TestObedience()`).
- Interacts with `saddler` for saddle-specific logic (e.g., discarding).
- Interacts with `rider` on the rider entity to trigger `bucked` events.
- Interacts with `skilltreeupdater` and `singinginspiration` during riding for special effects.
- Uses `lootdropper` to fling saddle items when unequipped or rejected.

**Tags Added/Removed:**
- Always adds `"saddleable"` at construction.
- Adds/removes `"rideable"` tag dynamically based on `canride` state.
- Adds/removes `"saddled"` tag dynamically based on whether a saddle is attached.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component belongs to. |
| `saddleable` | `boolean` | `false` | Whether the entity supports saddles. |
| `canride` | `boolean` | `false` | Whether the entity can be ridden (depends on saddle presence and saddleable flag). |
| `saddle` | `Entity?` | `nil` | The current saddle entity attached to this entity. |
| `rider` | `Entity?` | `nil` | The entity currently riding this entity. |
| `requiredobedience` | `number?` | `nil` | Minimum obedience level required for this entity to be rideable. |
| `lastridetime` | `number` | `-1000` | Unix timestamp of the last riding tick. |
| `riddentask` | `DoTask?` | `nil` | Periodic task reference for `RiddenTick`. |
| `shouldsave` | `boolean` | `true` | Whether this component’s state should be serialized on save. |
| `allowed_riders` | `table` | `{}` | List of entities allowed to ride (not actively used in source—declared but unused). |
| `custom_rider_test` | `function?` | `nil` | Optional custom predicate for rider eligibility. |

## Main Functions

### `Rideable:SetSaddle(doer, newsaddle)`
* **Description:** Attaches or removes a saddle on the entity. Removes the old saddle if present, spawns it as loot, and updates visual state (`swap_saddle` symbol override). Sets `canride` based on whether a valid saddle is attached. Emits `saddlechanged` event. If the entity is not `saddleable`, the new saddle is flung as loot and may suggest combat target.
* **Parameters:**  
  `doer` (`Entity?`) — The entity triggering the saddle change (e.g., player); used for sound logic and discard event handling.  
  `newsaddle` (`Entity?`) — The saddle entity to attach; if `nil`, removes current saddle.

### `Rideable:SetRider(rider)`
* **Description:** Attaches or detaches a rider. When attaching, starts periodic tick updates and listens for rider attack events; when detaching, cancels the periodic task and updates `lastridetime`. Emits `riderchanged` event with old/new rider info.
* **Parameters:**  
  `rider` (`Entity?`) — The entity to set as rider; `nil` to dismount.

### `Rideable:TestObedience()`
* **Description:** Returns `true` if the entity’s obedience meets or exceeds `requiredobedience`, or if no obedience requirement is set. Relies on the `domesticatable` component if present.
* **Parameters:** *(none)*  
* **Returns:** `boolean`

### `Rideable:TestRider(potential_rider)`
* **Description:** Returns `true` if the `potential_rider` passes rider eligibility. Uses `custom_rider_test` if set; otherwise, defaults to `true`.
* **Parameters:**  
  `potential_rider` (`Entity`) — The candidate rider entity to test.

### `Rideable:Buck(gentle)`
* **Description:** Triggers a `"bucked"` event on the current rider, indicating the rider was dismounted (e.g., due to taming failure or attack).
* **Parameters:**  
  `gentle` (`boolean`) — Passed to the rider’s buck event to differentiate harsh vs. soft dismounts.

### `Rideable:TimeSinceLastRide()`
* **Description:** Computes and returns the time (in seconds) elapsed since the last riding tick.
* **Parameters:** *(none)*  
* **Returns:** `number`

### `Rideable:SetRequiredObedience(required)`
* **Description:** Sets the minimum obedience threshold required for this entity to be rideable.
* **Parameters:**  
  `required` (`number`) — Required obedience level.

### `Rideable:SetCustomRiderTest(fn)`
* **Description:** Assigns a custom predicate function for rider eligibility. Signature: `fn(entity, rider_entity) → boolean`.
* **Parameters:**  
  `fn` (`function`) — Custom rider test callback.

### `Rideable:OnSaveDomesticatable()`
* **Description:** Provides serialization data for the `domesticatable` component’s save system. Includes current saddle (as save record) and time since last ride.
* **Parameters:** *(none)*  
* **Returns:** `table?` — `nil` if no data to save; otherwise a table with `saddle` and `lastridedelta`.

### `Rideable:OnLoadDomesticatable(data, newents)`
* **Description:** Restores saved state during load: respawns the saddle (if present) using `SpawnSaveRecord`, and restores `lastridetime` using `lastridedelta`.
* **Parameters:**  
  `data` (`table`) — Saved data from `OnSaveDomesticatable`.  
  `newents` (`table`) — Table of newly spawned entities for restoration resolution.

## Events & Listeners
- **Listens to:**
  - `"death"` — Removes saddle when the entity dies (calls `SetSaddle(nil, nil)`).
  - `"onattackother"` (on rider) — Triggers `"riderdoattackother"` on this entity.
  - `"on_landed"` (on saddle, only when `doer == nil`) — Calls `OnSaddleDiscard` to handle post-landing saddle cleanup.

- **Emits:**
  - `"saddlechanged"` — When saddle is attached or removed; payload: `{ saddle = Entity? }`.
  - `"riderchanged"` — When rider is attached or removed; payload: `{ oldrider = Entity?, newrider = Entity? }`.
  - `"beingridden"` — Periodically while a rider is present; payload: `(dt)`.
  - `"riderdoattackother"` — Triggered via rider’s `"onattackother"` event; payload: `(data)`.