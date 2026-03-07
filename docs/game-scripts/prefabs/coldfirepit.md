---
id: coldfirepit
title: Coldfirepit
description: Manages the cold fire pit structure, a weather-resistant campfire that consumes fuel at a variable rate depending on precipitation.
tags: [campfire, structure, fuel, weather, loot]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 87b55679
system_scope: environment
---

# Coldfirepit

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `coldfirepit` is a durable campfire structure that remains stable in rainy conditions. It combines components for fuel consumption (`fueled`), burning control (`burnable`), loot generation (`lootdropper`), and hauntable behavior. It is designed to extinguish only when fuel is depleted and resist external weather effects via the `rainimmunity` component (implied by behavior). The prefab is placed in the world and supports hammering for harvesting, fueling, and hauntable interactions.

## Usage example
```lua
local firepit = SpawnPrefab("coldfirepit")
firepit.Transform:SetPosition(x, y, z)
firepit.components.fueled:InitializeFuelLevel(TUNING.COLDFIREPIT_FUEL_START)
firepit.components.burnable:Ignite()
```

## Dependencies & tags
**Components used:** `burnable`, `fueled`, `lootdropper`, `workable`, `inspectable`, `hauntable`, `storytellingprop`, `rainimmunity` (referenced, not directly added), `propagator` (implied via `burnable` usage)  
**Tags added:** `campfire`, `structure`, `wildfireprotected`, `blueflame`, `storytellingprop`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `restart_firepit` | function | `nil` (added at runtime) | A utility function that resets the fire pit's fuel level while preserving its current percent. |

## Main functions
### `restart_firepit(inst)`
* **Description:** Resets the fire pit's fuel state by emptying current fuel and then reapplying the previously recorded percentage. Used to refresh the fire without losing its fuel level relative to its max capacity.
* **Parameters:** `inst` (entity) — the cold fire pit instance.
* **Returns:** Nothing.
* **Error states:** Requires `fueled` component; no explicit failure case is handled.

## Events & listeners
- **Listens to:**  
  - `onextinguish` — triggers `onextinguish(inst)` to zero out fuel.  
  - `onbuilt` — triggers `onbuilt(inst)` to play placement animation and sound.  
- **Pushes:** None directly; relies on components (`burnable`, `fueled`, `workable`) to push events like `onignite`, `percentusedchange`, `onwork`, `onfinish`, etc.