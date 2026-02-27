---
id: pumpkincarvable
title: Pumpkincarvable
description: Manages pumpkin carving state, shape placement, and visual effects for carved pumpkins in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: e70060f5
---

# Pumpkincarvable

## Overview
This component manages the carving logic, stored cut data, and dynamic visual effects for pumpkins in the game. It handles player interaction for carving, persists cut patterns, synchronizes carve data across clients and server, and controls lighting/animation behavior based on time of day. It also supports temporary FX visualization (via `pumpkincarving_swap_fx`) during usage.

## Dependencies & Tags
- `inst:AddComponent("burnable")`: Used to check if the pumpkin is burning (carving prevented).
- Tags added by internal `CreateCut` entities: `"FX"` for non-networked FX entities.
- No direct component dependencies declared in `_ctor`, but it watches world state `"isday"`.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | `Entity` | — | The owning entity (typically the pumpkin prefab instance). |
| `ismastersim` | `boolean` | `TheWorld.ismastersim` | True if this instance is running on the master simulation (server). |
| `cuts` | `table` | `{}` | Array of active FX entities representing individual cuts applied to the pumpkin. |
| `cutdata` | `net_string` | `net_string(inst.GUID, ...)` | Replicated string storing encoded, zipped array of cut definitions. Each cut is 4 elements: shape_id, rotation, x, y. |
| `swapinst` | `Entity?` | `nil` | Temporary FX entity (`pumpkincarving_swap_fx`) used while the pumpkin is equipped and carved. |
| `carver` | `Entity?` | `nil` | The player currently carving the pumpkin. |
| `range` | `number` | `3` | Maximum distance (in tiles) the carver can be from the pumpkin to continue carving. |
| `onopenfn` | `function?` | `nil` | Callback invoked when carving starts. |
| `onclosefn` | `function?` | `nil` | Callback invoked when carving ends. |

## Main Functions

### `PumpkinCarvable:CanBeginCarving(doer)`
* **Description:** Checks whether the given entity (`doer`, typically a player) is allowed to begin carving the pumpkin.
* **Parameters:**  
  `doer`: The potential carver entity.

### `PumpkinCarvable:BeginCarving(doer)`
* **Description:** Initiates the carving session for the pumpkin, switching the carver into the `"pumpkincarving"` state and registering event listeners for closing. Only executes on the master simulation.
* **Parameters:**  
  `doer`: The entity beginning to carve.

### `PumpkinCarvable:EndCarving(doer)`
* **Description:** Ends the active carving session for the given carver, removing event listeners and sending an event to the carver. Only executes on the master simulation.
* **Parameters:**  
  `doer`: The entity that was carving.

### `PumpkinCarvable:DoRefreshCutData()`
* **Description:** Reapplies all cuts stored in `cutdata` to the pumpkin by instantiating FX entities. Returns `true` if cut data was successfully decoded and applied.
* **Parameters:** None.

### `PumpkinCarvable:LoadCutData(cutdata)`
* **Description:** Loads and applies new cut data to the pumpkin. On dedicated servers, it only sets the data; on non-dedicated servers, it also refreshes visuals.
* **Parameters:**  
  `cutdata`: String containing encoded and zipped cut array.

### `PumpkinCarvable:OnSave()`
* **Description:** Serializes the current carving state. Returns a table with `cuts` field if cut data exists, otherwise `nil`.
* **Parameters:** None.

### `PumpkinCarvable:OnLoad(data, newents)`
* **Description:** Loads carving state from saved data by calling `LoadCutData`.
* **Parameters:**  
  `data`: Table potentially containing `cuts` (string).  
  `newents`: Unused parameter.

### `PumpkinCarvable:TransferComponent(newinst)`
* **Description:** Copies cut data and visual state to a new instance of the component (e.g., during respawn or transfer).
* **Parameters:**  
  `newinst`: The new entity instance receiving the component.

### `PumpkinCarvable:OnUpdate(dt)`
* **Description:** Periodically checks whether the carver is still near and can see the pumpkin; ends carving if not. Runs only while a carver is active.
* **Parameters:**  
  `dt`: Delta time since last update.

## Events & Listeners
- **Listens to:**
  - `"equipped"` → `OnEquipped_Server`
  - `"unequipped"` → `OnUnequipped_Server`
  - `"cutdatadirty"` (client only) → `OnCutDataDirty_Client`
  - `"isday"` world state → `OnIsDay_Server`
  - `"onremove"` on pumpkin → `onclosepumpkin` (via `doer`)
  - `"ms_closepopup"` → `onclosepopup`
- **Triggers:**
  - `"ms_endpumpkincarving"` event on the carver when carving ends.
  - Pushes `"cutdatadirty"` event on server when `cutdata` is updated (via `net_string`).