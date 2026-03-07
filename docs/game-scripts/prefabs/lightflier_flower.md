---
id: lightflier_flower
title: Lightflier Flower
description: A dynamic plant prefab that hosts and manages lightflier spawnlings, toggles light emission based on environmental illumination, and coordinates lifecycle events with its children.
tags: [environment, ai, lifecycle, light, boss]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4415cdfa
system_scope: environment
---

# Lightflier Flower

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`lightflier_flower` is a prefabricated environment entity that functions as a nurturing home for `lightflier` spawnlings. It uses the `pickable`, `childspawner`, and `timer` components to manage regeneration cycles, light emission states (`ON`, `CHARGED`, `RECHARGING`), and child召回 mechanics. The flower’s light state depends on whether it is currently emitting light (`ON`), fully charged and ready to emit (`CHARGED`), or currently recharging (`RECHARGING`). It listens to environmental events such as entering light, ignition, and timer completions to drive state transitions and child behavior.

## Usage example
```lua
local flower = SpawnPrefab("lightflier_flower")
flower.Transform:SetPosition(vector3(x, y, z))
-- Light state transitions happen automatically based on light levels and timers
-- Child spawner logic manages lightflier spawning and recall
```

## Dependencies & tags
**Components used:** `timer`, `pickable`, `childspawner`, `lootdropper`, `inspectable`, `light`, `lightwatcher`  
**Tags:** `plant`, `lightflier_home`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `light_state` | string | `LIGHT_STATES.CHARGED` | Current light state: `"ON"`, `"CHARGED"`, or `"RECHARGING"` |
| `light_params` | table | `nil` | Light configuration: `radius`, `intensity`, `falloff` |
| `_lighttime` | `net_tinybyte` | `0` | Networked light variation timing offset (within `[0, LIGHT_MAX_TIME - LIGHT_MIN_TIME]`) |
| `_lightframe` | `net_byte` | `inst._lightmaxframe` | Current frame in light tween animation |
| `_islighton` | `net_bool` | `false` | Whether the light is currently on |
| `_lightmaxframe` | number | `math.floor(LIGHT_MIN_TIME / FRAMES + .5)` | Target frame count for light tween |
| `_lighttask` | Task? | `nil` | Periodic task driving light tween animation |
| `_lightflier_returning_home` | Entity? | `nil` | Ref to the lightflier currently returning home |
| `_call_for_lightflier_task` | Task? | `nil` | Periodic task periodically checking if lightfliers should recall |

## Main functions
### `SetLightState(state)`
*   **Description:** Updates the flower’s animation state and internal `light_state` to match the given state (`ON`, `CHARGED`, `RECHARGING`).  
*   **Parameters:** `state` (string) — One of the `LIGHT_STATES` keys.  
*   **Returns:** Nothing.

### `TurnOn(inst)`
*   **Description:** Initiates light emission if the flower is `CHARGED` and pickable; starts a countdown timer to turn off and begins the animation sequence.  
*   **Parameters:** `inst` (Entity) — The flower instance.  
*   **Returns:** Nothing.
*   **Error states:** No effect if the flower is not pickable or not in `CHARGED` state.

### `TurnOff(inst)`
*   **Description:** Ends light emission, sets state to `RECHARGING`, and starts a recharge timer. Also triggers regeneration if pickable.  
*   **Parameters:** `inst` (Entity) — The flower instance.  
*   **Returns:** Nothing.

### `ForceOn(inst)`
*   **Description:** Immediately turns the light on without checking state or pickability, overriding timers. Used for restores and load.  
*   **Parameters:** `inst` (Entity) — The flower instance.  
*   **Returns:** Nothing.

### `ForceOff(inst)`
*   **Description:** Immediately extinguishes the light, sets state to `RECHARGING`, and cancels any active timers. Used for ignition, picking, and restores.  
*   **Parameters:** `inst` (Entity) — The flower instance.  
*   **Returns:** Nothing.

### `SpawnLightflierFromStalk(inst)`
*   **Description:** Spawns a `lightflier` prefab, takes ownership, positions it at the flower’s location, and notifies it via `"startled"` event.  
*   **Parameters:** `inst` (Entity) — The flower instance.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `"timerdone"` — Triggers `ontimerdone` to handle `"recharge"` and `"turnoff"` timers.
  - `"enterlight"` — Calls `TurnOn` if the flower enters a lit area.
  - `"onignite"` — Calls `OnIgnite` to extinguish and trigger picking/regen.
- **Pushes:** None directly (relies on `pickable`, `childspawner` events).

## Event handlers
### `ontimerdone(inst, data)`
*   **Description:** Callback for `"timerdone"` events. If `data.name == "recharge"`, calls `Recharge`. If `"turnoff"`, calls `TurnOff` and attempts to pick the flower if still pickable.

### `OnChildKilled(inst, child)`
*   **Description:** Called when a child lightflier dies or is caught. Resumes the pickable regen cycle.

### `OnGoHome(inst, child)`
*   **Description:** Called when a child returns home. If the flower is not pickable, triggers `Regen()`, and then calls `ForceOn()` to illuminate.

### `OnIgnite(inst)`
*   **Description:** Extinguishes the light and attempts to pick the flower. Adjusts animations depending on current pickable state and animation.

### `onregenfn(inst)`
*   **Description:** Flower regrowth callback: turns off the light and plays growth animation.

### `onpickedfn(inst, picker, loot)`
*   **Description:** Called when the flower is picked. Spawns a lightflier, turns off light, stops timers, and starts the recall task. Plays `pickup_lightbulb` sound.

### `onSave(inst, data)`
*   **Description:** Saves current `light_state` to serialization data.

### `OnLoad(inst, data)`
*   **Description:** Restores `light_state` after loading and re-applies appropriate state via `ForceOn` or `ForceOff`.

### `OnLoadPostPass(inst, ents, data)`
*   **Description:** After world load, restarts the recall task if the flower is not pickable and enough children are outside.

### `CallForLightflier(inst)`
*   **Description:** Checks if lightfliers should return home based on current pickability and child count; sets `_lightflier_returning_home` or clears it.

### `StartCallForLightflierTask(inst)`
*   **Description:** Starts a periodic task (`RECALL_FREQUENCY`) to call `CallForLightflier` after a randomized delay.

### `OnUpdateLight(inst, dframes)`
*   **Description:** Animates light intensity/radius/falloff using `_lightframe` and `_lighttime`. Manages fade-in/fade-out transitions based on `k = frame / _lightmaxframe`.

### `OnLightDirty(inst)`
*   **Description:** Recomputes `_lightmaxframe` and starts/resets the `OnUpdateLight` task when light timing changes.

### `Recharge(inst)`
*   **Description:** Completes recharging: sets state to `CHARGED`. If in light, automatically triggers `TurnOn`.

### `CanTurnOn(inst)`
*   **Description:** Helper to check if light can be turned on: only when `light_state == CHARGED` (and not picked).

### `Enterlight(inst)`
*   **Description:** Simple wrapper that calls `TurnOn` when entering light.

### `OnWake(inst)`
*   **Description:** On entity wake, delays one frame to call `TurnOnInLight` to ensure `LightWatcher` state is initialized.

### `GetDebugString(inst)`
*   **Description:** Returns `"State: <state>"` for use in debug overlay.

### `TurnOnInLight(inst)`
*   **Description:** Calls `TurnOn` if the entity is currently in light.

### `makefullfn(inst)`
*   **Description:** Pickable regrowth callback: cancels recall task, plays growth animation, forces light on, and restarts turnoff timer.

### `makeemptyfn(inst)`
*   **Description:** Pickable emptying callback: forces light off and plays `picked` animation.

### `CancelCallForLightflierTask(inst)`
*   **Description:** Cancels and clears `_call_for_lightflier_task`.

### `OnPreLoad(inst, data)`
*   **Description:** Wrapper for `WorldSettings_Pickable_PreLoad` to handle world settings persistence.

### `onsave_single(inst, data)`
*   **Description:** Extended save for single variant to include `plantname`.

### `onload_single(inst, data)`
*   **Description:** Extended load for single variant to restore `plantname` and correct anim bank/build.

### `commonfn(bank, build, light_params)`
*   **Description:** Shared constructor logic for all variants; sets up components, networked properties, tags, and callbacks.

### `single()`
*   **Description:** Variant-specific constructor: randomizes `plantname`, sets regen time and pickability from tuning, assigns custom save/load handlers.

## Notes
- Uses `net_tinybyte`, `net_byte`, and `net_bool` for efficient light-state replication across client/server.
- Syncs light animation and state precisely using frame-based tweening (`OnUpdateLight`) to avoid network jitter.
- The recall mechanism ensures lightfliers return home after being away, enabling recharging and regrowth.
- Behavior is tunable via `TUNING.LIGHTFLIER_FLOWER_*` values (regrow time, light duration, recall delay, etc.).