---
id: malbatross_feathered_weave
title: Malbatross Feathered Weave
description: A consumable fuel item that floats on water and burns slowly, used for campfires and cooking.
tags: [inventory, fuel, floating]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 732b4667
system_scope: inventory
---

# Malbatross Feathered Weave

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `malbatross_feathered_weave` prefab represents a floating, stackable fuel item used primarily as campfire fuel. It is designed to float on water surface due to its low density and provides a moderate fuel value when burned. The item integrates with DST’s inventory system, buoyancy physics, and fire mechanics via standard component hooks (`MakeInventoryFloatable`, `MakeSmallBurnable`, `MakeSmallPropagator`).

It is typically used as an ingredient or standalone fuel source and inherits standard small-item behavior from utility helpers.

## Usage example
This prefab is usually instantiated via the game’s prefab system and does not require direct component setup by modders. However, if programmatically spawning:
```lua
local inst = Prefab("malbatross_feathered_weave")
if inst ~= nil then
    inst.components.fuel.fuelvalue = TUNING.STACK_SIZE_MEDITEM * TUNING.SMALL_FUEL
    inst.components.stackable.maxsize = TUNING.STACK_SIZE_MEDITEM
end
```

## Dependencies & tags
**Components used:**  
- `stackable` — sets `maxsize`  
- `inventoryitem` — configures sinking behavior via `SetSinks(false)`  
- `fuel` — sets `fuelvalue`  
- `inspectable` — adds inspection capability  
- `animstate`, `transform`, `soundemitter`, `network` — core entity visuals/audio/sync  
- `physics` (via `MakeInventoryPhysics`) — enables collision  
- `burnable`, `propagator`, `hauntable_launch` — added via utility functions  

**Tags:** None explicitly added or checked in this file.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.SMALL_FUEL` | Fuel amount contributed when burned. |
| `maxsize` | number | `TUNING.STACK_SIZE_MEDITEM` | Maximum stack size for this item. |
| `sinks` | boolean | `false` | Whether the item sinks when placed in water. |

## Main functions
### `MakeInventoryFloatable(inst, size, sink_time, scale)`
*   **Description:** Makes the item float on water. Called internally via `MakeInventoryFloatable(inst, "small", 0.05, {1.25, 1.0, 1.25})`. Part of the utility module, not a method defined here.
*   **Parameters:**  
    - `inst` (Entity) — the item instance  
    - `size` (string) — buoyancy size class (`"small"`)  
    - `sink_time` (number) — seconds before sinking if submerged (`0.05`)  
    - `scale` (vector) — visual scale adjustment (`{1.25, 1.0, 1.25}`)  
*   **Returns:** Nothing.  
*   **Error states:** None — relies on external `MakeInventoryFloatable` implementation.

### `MakeSmallBurnable(inst, burntime)`
*   **Description:** Prepares the item as a small fuel source for igniting fires. Sets burn duration and flame properties. Part of the utility module.
*   **Parameters:**  
    - `inst` (Entity) — the item instance  
    - `burntime` (number) — duration of burn in seconds (`TUNING.SMALL_BURNTIME`)  
*   **Returns:** Nothing.  

### `MakeSmallPropagator(inst)`
*   **Description:** Configures the item to ignite adjacent burnables when lit. Part of the utility module.
*   **Parameters:** `inst` (Entity) — the item instance  
*   **Returns:** Nothing.  

### `MakeHauntableLaunch(inst)`
*   **Description:** Enables the item to trigger Haunter events when burned or used. Part of the utility module.
*   **Parameters:** `inst` (Entity) — the item instance  
*   **Returns:** Nothing.  

### `inst.components.inventoryitem:SetSinks(should_sink)`
*   **Description:** Configures whether the item sinks when placed in water. Called here with `false` to enable floating.
*   **Parameters:** `should_sink` (boolean) — `false` to float, `true` to sink  
*   **Returns:** Nothing.  
*   **Notes:** If the item is already landed (placed), calling this may trigger immediate sinking/re-floating.

### `inst.components.stackable.maxsize = ...`
*   **Description:** Sets the maximum stack size for the item. Referenced in this file to override the default to `TUNING.STACK_SIZE_MEDITEM`.
*   **Parameters:** None — direct property assignment.  
*   **Returns:** Nothing.  

## Events & listeners
**Listens to:** None identified in this file.  
**Pushes:** None identified in this file.