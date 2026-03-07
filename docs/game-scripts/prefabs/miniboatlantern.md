---
id: miniboatlantern
title: Miniboatlantern
description: A portable magical lantern that provides light, boosts wearer movement speed, and consumes magic fuel over time while active.
tags: [light, fuel, locomotion, magic]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4bc1f557
system_scope: entity
---

# Miniboatlantern

> Based on game build **7140114** | Last updated: 2026-03-06

## Overview
The `miniboatlantern` is a lightweight, floating lantern prefab used as a wearable inventory item. When equipped (dropped or held), it automatically turns on, emits light, and applies a persistent movement speed multiplier to the wearer while fuel remains. It uses magic-type fuel and supports combustion mechanics with self-ignition risk. The lantern integrates with multiple systems: `fueled` for consumption logic, `locomotor` for speed control, `burnable` for fire hazards, and `timer` for self-ignition events. It also persists home location and supports hauntings.

## Usage example
```lua
local lantern = SpawnPrefab("miniboatlantern")
lantern.components.fueled:InitializeFuelLevel(100)
lantern.components.locomotor.walkspeed = 5
```

## Dependencies & tags
**Components used:** `burnable`, `fuel`, `fueled`, `hauntable`, `inventoryitem`, `knownlocations`, `locomotor`, `timer`, `inspectable`, `soundemitter`, `animstate`, `transform`, `light`, `network`  
**Tags:** Adds `light`. Also uses `fireimmune` internally.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_light` | Entity (opt) | `nil` | Reference to the attached light emitter prefab (`miniboatlanternlight`). |
| `_acceleration_task` | Task (opt) | `nil` | Periodic task for gradually increasing walking speed after landing. |
| `no_wet_prefix` | boolean | `true` | Prevents changing animation name prefix when wet. |

## Main functions
### `TurnOn(inst)`
*   **Description:** Activates the lantern: starts fuel consumption, spawns and attaches the light emitter, shows the glow animation, resumes the self-combustion timer, and plays the active loop sound.  
*   **Parameters:** `inst` — The lantern entity instance.  
*   **Returns:** Nothing.  
*   **Error states:** Only has effect if fuel is available (`HasFuel(inst)` returns `true`).

### `TurnOff(inst)`
*   **Description:** Deactivates the lantern: removes the light emitter, hides the glow animation, stops fuel consumption, clears movement acceleration tasks, pauses the self-combustion timer, pushes the `"onturnoff"` event, and kills the sound.  
*   **Parameters:** `inst` — The lantern entity instance.  
*   **Returns:** Nothing.

### `HasFuel(inst)`
*   **Description:** Checks whether the lantern has usable fuel. Returns `true` if the `fueled` component exists and is not empty; otherwise `false`.  
*   **Parameters:** `inst` — The lantern entity instance.  
*   **Returns:** Boolean — Whether the lantern has fuel.  

### `StartSelfCombustionTimer(inst, time_to_combustion)`
*   **Description:** Starts or resumes a timer that may cause the lantern to ignite itself if it is not currently burning and has sufficient fuel. Uses a randomized duration based on current/max fuel (45%–100% of fuel, clamped and capped to avoid exhaustion).  
*   **Parameters:**  
    * `inst` — The lantern entity instance.  
    * `time_to_combustion` (optional) — If provided, overrides the computed duration.  
*   **Returns:** Nothing.  
*   **Error states:** Does nothing if a `"self_combustion"` timer already exists.

### `OnDropped(inst)`
*   **Description:** Callback triggered when the lantern is dropped into the world; automatically turns the lantern on.  
*   **Parameters:** `inst` — The lantern entity instance.  
*   **Returns:** Nothing.

### `OnPutInInventory(inst)`
*   **Description:** Callback triggered when the lantern is placed into an inventory slot; automatically turns the lantern off.  
*   **Parameters:** `inst` — The lantern entity instance.  
*   **Returns:** Nothing.

### `OnInventoryLanded(inst)`
*   **Description:** Called after the lantern lands from being dropped; remembers its location as `"home"` and starts acceleration to target walking speed if it has fuel and landed on passable terrain. Resets speed to `0` first, then ramps up via a periodic task.  
*   **Parameters:** `inst` — The lantern entity instance.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    * `"on_landed"` — Triggers `OnInventoryLanded`.  
    * `"onburnt"` — Triggers `OnBurnt`.  
    * `"onextinguish"` — Triggers `OnExtinguish`.  
    * `"timerdone"` — Triggers `OnTimerDone` for self-combustion.  
- **Pushes:**  
    * `"onturnoff"` — Fired when `TurnOff` is called.  
    * `"onignite"` — Triggered via `burnable:Ignite`.