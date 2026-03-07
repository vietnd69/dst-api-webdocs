---
id: flower_cave
title: Flower Cave
description: Manages a light-emitting, harvestable cave plant that cycles between active, recharging, and idle states based on environmental light levels.
tags: [light, harvest, timer, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7d0e5419
system_scope: environment
---

# Flower Cave

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `flower_cave` prefab represents a bioluminescent cave plant that emits light when active. It operates via a state machine with three states: `ON` (emitting light), `CHARGED` (ready to turn on), and `RECHARGING` (restoring capacity after use or low light exposure). Its behavior integrates the `timer`, `pickable`, `halloweenmoonmutable`, `inspectable`, and `lootdropper` components. The plant interacts with the `LightWatcher` component to respond to ambient light levels and enters the `ON` state when exposed to sufficient darkness.

## Usage example
```lua
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddSoundEmitter()
inst.entity:AddMiniMapEntity()
inst.entity:AddLight()
inst.entity:AddLightWatcher()
inst.entity:AddNetwork()

-- Add required components
inst:AddComponent("timer")
inst:AddComponent("pickable")
inst:AddComponent("halloweenmoonmutable")
inst:AddComponent("lootdropper")
inst:AddComponent("inspectable")

-- Initialize light parameters (see commonfn logic)
inst.light_params = {
    falloff = 0.5,
    intensity = 0.8,
    radius = 3,
}
inst:AddTag("plant")

-- Call initialization logic (e.g., commonfn or prefabricated constructors)
-- Finalize with appropriate prefab type (single/double/triple/withered)
```

## Dependencies & tags
**Components used:** `timer`, `pickable`, `halloweenmoonmutable`, `lootdropper`, `inspectable`, `lightwatcher`, `transform`, `animstate`, `soundemitter`, `minimapentity`, `light`, `network`  
**Tags:** Adds `plant` via `inst:AddTag("plant")`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `plantname` | string? | `nil` | Optional suffix variant (e.g., `"_single"`, `"_springy"`) affecting animation bank/build. |
| `light_state` | string | `LIGHT_STATES.CHARGED` | Current state: `"ON"`, `"CHARGED"`, or `"RECHARGING"`. |
| `light_params` | table | *see definitions* | Light configuration including `radius`, `intensity`, `falloff`, and optional `turnoff_time`, `recharge_time` functions. |
| `is_bulb_withered` | boolean | `false` | Indicates whether the plant is the withered variant (produces `spoiled_food`). |
| `_lighttime` | net_tinybyte | `0` | Networked time offset for light fade/revive animation. |
| `_lightframe` | net_byte | `math.floor(LIGHT_MIN_TIME / FRAMES + .5)` | Current animation frame index. |
| `_islighton` | net_bool | `false` | Networked flag for whether the light is active. |
| `_lightmaxframe` | number | `math.floor(LIGHT_MIN_TIME / FRAMES + .5)` | Maximum frame count for animation transitions. |
| `_lighttask` | Task? | `nil` | Periodic task managing light transition animation. |

## Main functions
### `SetLightState(inst, state)`
* **Description:** Updates the plant's animation sequence based on the given `state`, and records the state in `inst.light_state`.  
* **Parameters:**  
  `state` (string) — One of `LIGHT_STATES.ON`, `.CHARGED`, or `.RECHARGING`.  
* **Returns:** Nothing.

### `TurnOn(inst)`
* **Description:** Activates the light if the plant is `CHARGED` and harvestable. Initiates a fade-in animation, sets the light state to `ON`, and schedules a timer to turn it off.  
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:** Early returns if `pickable:CanBePicked()` is false.

### `TurnOff(inst)`
* **Description:** Deactivates the light and transitions the plant to `RECHARGING`. Schedules a recharge timer and resets animation state.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `Recharge(inst)`
* **Description:** Completes the recharge cycle, transitions the plant to `CHARGED`. If the plant is in darkness (via `LightWatcher`), it automatically calls `TurnOn`.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `ForceOn(inst)`
* **Description:** Immediately sets the light to `ON` state, bypassing state checks. Used during entity load or forced activation.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `ForceOff(inst, on_load)`
* **Description:** Immediately turns off the light and forces `RECHARGING` or playback of the final animation frame if `on_load` is true. Used during load, pickup, or regeneration.  
* **Parameters:**  
  `on_load` (boolean) — Whether this is called during entity load (affects animation).  
* **Returns:** Nothing.

### `CanTurnOn(inst)`
* **Description:** Returns whether the light may transition from `CHARGED` to `ON`.  
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if `light_state == LIGHT_STATES.CHARGED`.  

## Events & listeners
- **Listens to:**  
  - `timerdone` — Triggers `ontimerdone` to handle recharge or turn-off logic.  
  - `enterlight` — Triggers `enterlight`, which calls `TurnOn`.  
  - `lightdirty` (client) — Refreshes light animation and state (via `OnLightDirty`).  
- **Pushes:** None directly (relies on entity-wide events like `animover` for cleanup).