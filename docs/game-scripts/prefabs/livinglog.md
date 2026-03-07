---
id: livinglog
title: Livinglog
description: A consumable and repair item that emits a sound effect when taken as fuel or ignited.
tags: [fuel, repair, edible, sound]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: dc4d8938
system_scope: inventory
---

# Livinglog

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`livinglog` is aPrefab that functions as both an edible item and a fuel source, while also serving as a boat repair material. It is designed to emit a distinctive "tormented scream" sound effect (`SOUND_TORMENTED_SCREAM`) when ignited, burned, or taken as fuel. ThePrefab integrates with several core components: `edible` (for consumption), `fuel` (for burning), `repairer` (for boat repair), and `inventoryitem` (for inventory handling).

## Usage example
```lua
local inst = SpawnPrefab("livinglog")
if inst ~= nil and inst.components ~= nil then
    -- Example: ignite it programmatically to trigger the sound
    inst:PushEvent("onignite")
end
```

## Dependencies & tags
**Components used:** `edible`, `fuel`, `repairer`, `inspectable`, `inventoryitem`, `stackable`, `burnable`, `propagator`, `hauntable`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `eatensound` | string | `"dontstarve/creatures/leif/livinglog_burn"` | Sound played when consumed. |
| `incineratesound` | string | `"dontstarve/creatures/leif/livinglog_burn"` | Sound played when incinerated (same as `eatensound`). |
| `pickupsound` | string | `"wood"` | Sound played when picked up. |
| `components.edible.foodtype` | `FOODTYPE` | `FOODTYPE.WOOD` | Food category for compatibility with food-based systems. |
| `components.edible.healthvalue` | number | `0` | Health restored on consumption (none). |
| `components.edible.hungervalue` | number | `0` | Hunger restored on consumption (none). |
| `components.fuel.fuelvalue` | number | `TUNING.MED_FUEL` | Fuel value (used in fire management). |
| `components.fuel.ontaken` | function | `FuelTaken` | Callback fired when fuel is consumed. |
| `components.repairer.repairmaterial` | `MATERIALS` | `MATERIALS.WOOD` | Material type used for repairs. |
| `components.repairer.healthrepairvalue` | number | `TUNING.REPAIR_LOGS_HEALTH * 3` | Health points restored per repair action. |
| `components.repairer.boatrepairsound` | string | `"turnoftides/common/together/boat/repair_with_wood"` | Sound effect played during boat repair. |

## Main functions
### `FuelTaken(inst, taker)`
*   **Description:** Plays the "tormented scream" sound on the taker entity when the living log is consumed as fuel.  
*   **Parameters:**  
    - `inst` (Entity): The living log instance being used as fuel.  
    - `taker` (Entity or nil): The entity consuming the log. If `nil`, no sound is played.  
*   **Returns:** Nothing.  
*   **Error states:** Only performs the sound if `taker.SoundEmitter` is not `nil`. No error is raised if missing.

### `allanimalscanscream(inst)`
*   **Description:** Plays the "tormented scream" sound on the living log itself (via its own `SoundEmitter`).  
*   **Parameters:**  
    - `inst` (Entity): The living log instance.  
*   **Returns:** Nothing.  

### `onignite(inst)`
*   **Description:** Event handler triggered when the log ignites; delegates to `allanimalscanscream(inst)`.  
*   **Parameters:**  
    - `inst` (Entity): The living log instance.  
*   **Returns:** Nothing.  

## Events & listeners
- **Listens to:** `onignite` - triggers the scream sound via `onignite(inst)` when ignited (e.g., by fire or lightning).
- **Pushes:** No events.
