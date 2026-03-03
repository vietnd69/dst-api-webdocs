---
id: pumpkinhatcarvable
title: Pumpkinhatcarvable
description: Manages the carving interaction and face customization logic for pumpkin-based wearable items, including validation, state transitions, and tool requirements.
tags: [crafting, interaction, inventory, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 80f447c3
system_scope: crafting
---

# Pumpkinhatcarvable

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PumpkinHatCarvable` handles the carving workflow for pumpkin headwear (e.g., pumpkin helmet), enabling players to customize facial features via a popup interface. It coordinates with the `inventory`, `burnable`, `equippable`, and `floater` components to enforce constraints (e.g., burning, equipped, floating) and ensure valid face data is applied only when proper tools are available. The component orchestrates carving start/end states, range checks, and event-driven cleanup.

## Usage example
```lua
local inst = Prefab("pumpkin_helmet")
inst:AddComponent("pumpkinhatcarvable")

inst.components.pumpkinhatcarvable.onchangefacedatafn = function(inst, facedata)
    -- Apply custom face variation logic here
end

local player = The Player()
if inst.components.pumpkinhatcarvable:CanBeginCarving(player) then
    inst.components.pumpkinhatcarvable:BeginCarving(player)
end
```

## Dependencies & tags
**Components used:** `burnable`, `equippable`, `floater`, `inventory`, `inventoryitem`  
**Tags:** Checks `burnable:burning`, `equippable:isequipped`, `floater:showing_effect`; modifies `inventoryitem.canbepickedup`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *assigned in constructor* | The entity (pumpkin hat) this component is attached to. |
| `ismastersim` | boolean | `TheWorld.ismastersim` | Indicates if this instance is the master simulation. |
| `carver` | `Entity?` | `nil` | The entity currently carving the pumpkin. |
| `range` | number | `3` | Max distance (in tiles) the carver must remain within to continue carving. |
| `collectfacedatafn` | `function?` | `nil` | Callback to populate `facedata` table from the pumpkin. |
| `onchangefacedatafn` | `function?` | `nil` | Callback fired when a valid face data change is confirmed. |
| `onopenfn` | `function?` | `nil` | Callback fired when carving begins. |
| `onclosefn` | `function?` | `nil` | Callback fired when carving ends. |
| `onclosepumpkin` | `function` | internal | Event handler for popup close or pumpkin removal during carving. |

## Main functions
### `CanBeginCarving(doer)`
* **Description:** Checks whether the given entity (`doer`) is allowed to start carving this pumpkin.  
* **Parameters:** `doer` (`Entity`) – The player or entity attempting to carve.  
* **Returns:**  
  * `true` – If carving can start.  
  * `false, "BURNING"` – If the pumpkin is on fire.  
  * `false, "INUSE"` – If another carver is already using it.  
  * `false` – If the pumpkin is equipped or floating.  
* **Error states:** Does not initiate carving; only validates conditions.

### `BeginCarving(doer)`
* **Description:** Starts the carving interaction for the pumpkin, opening a UI popup and disabling pickup.  
* **Parameters:** `doer` (`Entity`) – The entity performing the carve.  
* **Returns:** `true` if carving successfully started; `false` if already in progress.  
* **Error states:** Returns `false` immediately if not in master simulation.

### `EndCarving(doer)`
* **Description:** Terminates the carving interaction, re-enables pickup, removes event listeners, and fires cleanup callbacks.  
* **Parameters:** `doer` (`Entity`) – The carver ending the interaction (must match `self.carver`).  
* **Returns:** Nothing.  
* **Error states:** Silently returns if `doer` does not match the current carver or not in master simulation.

### `GetFaceData()`
* **Description:** Retrieves the current face configuration by invoking the `collectfacedatafn` callback.  
* **Parameters:** None.  
* **Returns:** `table` – A dictionary mapping `"reye"`, `"leye"`, `"mouth"` to numeric variation IDs (e.g., `{ reye = 2, leye = 1, mouth = 0 }`).  
* **Error states:** Returns an empty table if `collectfacedatafn` is not set.

## Events & listeners
- **Listens to:**  
  - `"onputininventory"` – Triggers `interruptcarving` if the pumpkin is placed in inventory.  
  - `"floater_startfloating"` – Triggers `interruptcarving` if the pumpkin starts floating.  
  - `"onremove"` – Triggers `onclosepumpkin` (on pumpkin removal during carving).  
  - `"ms_closepopup"` – Triggers `onclosepopup` (on popup close in master sim).  
- **Pushes:**  
  - `"ms_endpumpkincarving"` – Sent to the carver when carving ends (master sim only).  
  - `"onremove"` – indirectly triggers `onclosepumpkin` callback during carving.
