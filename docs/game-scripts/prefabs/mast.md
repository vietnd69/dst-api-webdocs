---
id: mast
title: Mast
description: Manages mast structures for boats, including sail deployment, fuel-powered lighting upgrades (lamp), lightning rod upgrades, and destruction behavior.
tags: [boat, physics, fuel, structure]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4097391a
system_scope: entity
---

# Mast

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `mast` component manages the behavior of boat masts, including sail state (furled/unfurled), interaction with the boat's physics system, and integration with upgradeable components such as the lamp (fuel-powered light) and lightning rod. It is primarily attached to mast prefabs and connected to their parent boat via `boat.components.boatphysics`. The component handles destruction (including removal from the boat's physics list), burning, deconstruction, and saving/loading.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("mast")
inst.components.mast.boat = boat_entity
inst.components.mast:SailUnfurled()
inst.components.mast:SetBoat(nil) -- detach from boat
```

## Dependencies & tags
**Components used:** `burnable`, `fueled`, `lootdropper`, `upgradeable`, `workable`, `hauntable`, `inspectable`, `deployable`  
**Tags added/checked:** `structure`, `mast`, `rotatableobject`, `firefuellight`, `burnt`, `boat_accessory`, `deploykititem`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `boat` | entity or `nil` | `nil` | Reference to the parent boat entity. Set via `SetBoat(boat)`. |
| `rudder` | entity or `nil` | `nil` | Reference to the rudder attached to this mast. Set and cleared internally. |
| `is_sail_raised` | boolean | `false` | Whether the sail is currently raised (unfurled). Inverted for certain mast types. |
| `inverted` | boolean | `false` | Whether the sail logic is inverted (e.g., for Malbatross mast). |
| `sail_force` | number | `TUNING.BOAT.MAST.SAIL_FORCE` | Propulsion force applied by the sail. |
| `max_velocity` | number | `TUNING.BOAT.MAST.MAX_VELOCITY` | Maximum boat velocity modifier. |
| `rudder_turn_drag` | number | `TUNING.BOAT.MAST.RUDDER_TURN_DRAG` | Turn drag modifier when the mast is attached. |
| `is_sail_transitioning` | boolean | `false` | Whether the sail is currently animating between states. |
| `sink_fx` | string | `"boat_mast_sink_fx"` | Prefab name used for the sinking visual effect. |
| `_lamp` | entity or `nil` | `nil` | The lamp upgrade prefab instance, if installed. |
| `_lightningrod` | entity or `nil` | The lightning rod upgrade prefab instance, if installed. |
| `_lightningrod._top` | entity or `nil` | The lightning rod top part, if installed. |

## Main functions
### `SailFurled()`
* **Description:** Furleds (lowers) the sail, updating animation, physics flags, and sail state.
* **Parameters:** None.
* **Returns:** Nothing.

### `SailUnfurled()`
* **Description:** Unfurleds (raises) the sail, updating animation, physics flags, and sail state.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetBoat(boat)`
* **Description:** Assigns or clears the parent boat reference. Registers or removes the mast from the boat's physics system.
* **Parameters:** `boat` (entity or `nil`) – The boat entity to attach to, or `nil` to detach.
* **Returns:** Nothing.
* **Error states:** If `boat` is non-`nil` and already attached to another mast, behavior may conflict; no explicit guards.

### `SetReveseDeploy(bool)`
* **Description:** Sets the `inverted` flag, which inverts the sail logic (e.g., for the Malbatross mast).
* **Parameters:** `bool` (boolean) – `true` to invert sail raising/lowesting logic.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onburnt` – Triggers `onburnt()` handler to remove the mast from the boat, detach rudder, remove upgrades, and clean up components.  
  - `onbuilt` – Triggers visual/sound feedback upon successful placement.  
  - `ondeconstructstructure` – Propagates deconstruction event to attached upgrades.

- **Pushes:** None directly; events are handled by external callbacks (`onburnt`, `ondeconstructstructure`) and upgrade prefabs.