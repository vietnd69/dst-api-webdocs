---
id: decor_lamp
title: Decor Lamp
description: A decorative lantern prefab that provides adjustable ambient light and consumes cave fuel when active.
tags: [light, fuel, furniture, decor]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bfde5a8c
system_scope: environment
---

# Decor Lamp

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `decor_lamp` prefab is a decorative, fuel-powered light source that can be placed on furniture. It provides dynamic lighting whose intensity and radius scale with remaining fuel level. The lamp toggles automatically when dropped or picked up (via inventory events) and integrates with the `fueled`, `machine`, `inventoryitem`, and `furnituredecor` components. It emits light using the `light` component and is optimized with the `furnituredecor` tag.

## Usage example
```lua
local inst = Prefab("decor_lamp", fn, assets)
inst:Spawn()
-- After spawning, fuel the lamp and turn it on manually if needed:
inst.components.fueled:GainFuel(100)
inst.components.machine:TurnOn()
```

## Dependencies & tags
**Components used:** `fueled`, `furnituredecor`, `inventoryitem`, `machine`, `inspectable`, `light`, `transform`, `animstate`, `follower`, `network`, `hauntable`, `smallburnable`, `smallpropagator`  
**Tags added:** `furnituredecor` (used internally for optimization)

## Properties
No public properties are initialized directly on the `decor_lamp` prefab instance. All configuration occurs via component settings in the constructor.

## Main functions
### `lamp_turnoff(inst)`
* **Description:** Disables the light, stops fuel consumption, marks the lamp as off, and plays the "off" animation followed by the "idle" animation.
* **Parameters:** `inst` (Entity) — the lamp entity.
* **Returns:** Nothing.

### `lamp_fuelupdate(inst)`
* **Description:** Dynamically adjusts the lamp’s light intensity and radius based on current fuel percentage using linear interpolation. Called periodically while the lamp is consuming fuel.
* **Parameters:** `inst` (Entity) — the lamp entity.
* **Returns:** Nothing.

### `lamp_turnon(inst)`
* **Description:** Attempts to turn the lamp on: checks if fuel is present and the item is not held; if valid, starts fuel consumption, enables the light, marks it as on, and plays the "on" animation.
* **Parameters:** `inst` (Entity) — the lamp entity.
* **Returns:** Nothing.
* **Error states:** Returns early if `fueled:IsEmpty()` or `inventoryitem:IsHeld()` returns true.

### `lamp_ondropped(inst)`
* **Description:** Resets the lamp state when dropped (turns it off then immediately attempts to turn it on again, which succeeds if fuel remains).
* **Parameters:** `inst` (Entity) — the lamp entity.
* **Returns:** Nothing.

## Events & listeners
The following event-based callbacks are configured on the `fueled` component:
- **Listens to (via `fueled`):**  
  - Depletion (`SetDepletedFn(lamp_turnoff)`) — triggers `lamp_turnoff` when fuel runs out.  
  - Update (`SetUpdateFn(lamp_fuelupdate)`) — triggers `lamp_fuelupdate` periodically while consuming fuel.  
  - Take fuel (`SetTakeFuelFn(lamp_turnon)`) — triggers `lamp_turnon` when fuel is added.
- **Pushes:** None — this prefab does not fire custom events.
