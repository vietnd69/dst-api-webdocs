---
id: cave_vents
title: Cave Vents
description: Manages dynamic vent behavior for cave rock entities, handling spewing of heat, miasma, or gas based on world state and mining progress.
tags: [environment, entity, combat]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e136dd39
system_scope: environment
---

# Cave Vents

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cave_vents.lua` defines the `cave_vent_rock` prefab, an interactive environmental entity that dynamically adjusts its spewing behavior based on world conditions (e.g., rift activity, toadstool gas emission) and player interaction. It integrates with the `heater`, `lootdropper`, `workable`, `timer`, `inspectable`, and `miasmamanager` components to simulate geothermal activity, spew miasma clouds, and respond to mining. The vent type is computed by `GetVentType()` and can be `HOT`, `MIASMA`, `COLD`, `GAS`, or `NONE`, with behavior handlers registered in `vent_type_fns`.

## Usage example
```lua
local vent = SpawnPrefab("cave_vent_rock")
if vent and vent.Transform then
    vent.Transform:SetPosition(x, y, z)
    vent.UpdateVentilation() -- Recompute spewing behavior based on world state
    if vent.components.workable then
        print("Vent work left:", vent.components.workable.workleft)
    end
end
```

## Dependencies & tags
**Components used:** `heater`, `lootdropper`, `inspectable`, `workable`, `timer`, `miasmamanager`, ` riftspawner`, `toadstoolspawner`.  
**Tags:** Adds `boulder`, `HASHEATER`. Uses conditional tag `miasma_venter` for MIASMA-type vents.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ventilation_type` | number | `VENT_TYPES.NONE` | Current vent type (see `VENT_TYPES` constants). |
| `set_loot_table` | string or nil | `nil` | Loot table override set during world generation. |
| `_gaslevel` | number | `0` | Internal gas buildup level (used for gas vents). |
| `_gasuptask` / `_gasdowntask` | Task or nil | `nil` | Periodic tasks managing gas buildup and decay. |

## Main functions
### `UpdateVentilation(inst, is_populating, vent_type)`
*   **Description:** Recomputes and applies the current vent type. Stops old vent effects and triggers new ones (e.g., start miasma spewing or hot air).
*   **Parameters:** `inst` (Entity) — the vent entity; `is_populating` (boolean) — true if called during world gen initialization; `vent_type` (number, optional) — override vent type (default: computed via `GetVentType`).
*   **Returns:** Nothing.
*   **Error states:** Safely handles missing vent function definitions via `vent_type_fns[old_vent_type].on_stop_venting` nil checks.

### `GetHeat(inst)`
*   **Description:** Returns the heat output value for the heater component based on the current vent type.
*   **Parameters:** `inst` (Entity).
*   **Returns:** number — heat magnitude (e.g., `TUNING.CAVE_VENTS.HEAT.HOT_ACTIVE`).
*   **Error states:** Sets heater thermics (`exothermic`/`endothermic`) to `false` for non-active types.

### `ForceSpew(inst)`
*   **Description:** Immediately triggers spew timers for all vent types by setting their remaining time to `FRAMES`.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `CustomOnHaunt(inst, haunter)`
*   **Description:** Custom haunt reaction; with 50% chance, forces a spew on haunting.
*   **Parameters:** `inst` (Entity), `haunter` (Entity).
*   **Returns:** boolean — `true` if haunting should succeed (i.e., a spew occurred), otherwise `false`.

### `OnSave(inst, data)`
*   **Description:** Serializes state to `data`. Saves `ventilation_type` and `set_loot_table`.
*   **Parameters:** `inst` (Entity), `data` (table).
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores vent state during load. Does not re-initialize timers immediately (handled by scheduled tasks).
*   **Parameters:** `inst` (Entity), `data` (table).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `timerdone` — triggers `OnTimerDone` to restart vent spew timers.
- **Pushes:** `OnSave` and `OnLoad` are custom hooks on `inst` (not pushed events).  
- **World listeners:** Subscribes to `ms_riftaddedtopool`, `ms_riftremovedfrompool`, `toadstoolstatechanged`, and `toadstoolkilled` on `TheWorld` to recompute ventilation when rift/toadstool states change.