---
id: firefx
title: Firefx
description: Manages visual and audio effects for fire-based entities, including dynamic lighting, sound, and animation transitions across multiple intensity levels.
tags: [environment, fx, audio, lighting]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: eb4e091c
system_scope: fx
---
# Firefx

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FireFX` is a component responsible for rendering and managing the visual and auditory effects of fire entities in DST. It controls a dedicated fire light prefab (`firefx_light`), handles level-based transitions (including animations and intensity ramps), plays sound effects for ignition, burn, and extinguishing, and synchronizes sound playback with entity sleep/wake states. It integrates with the entity’s `AnimState`, `SoundEmitter`, and light components to provide dynamic, multi-stage fire behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("firefx")
inst.components.firefx:SetLevel(2, true)
inst.components.firefx:SetPercentInLevel(0.75)
inst.components.firefx:Extinguish(false)
```

## Dependencies & tags
**Components used:** None (uses prefab internals like `SpawnPrefab("firefx_light")`, but does not depend on other components via `inst.components.X`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `level` | number \| nil | `nil` | Current fire level index (1-based). |
| `percent` | number | `1` | Interpolation factor within a fire level (0 to 1). |
| `levels` | table | `{}` | Array of level definitions; each entry contains `radius`, `intensity`, `anim`, `sound`, `colour`, `falloff`, etc. |
| `playingsound` | string \| nil | `nil` | Name of the currently playing fire sound. |
| `current_radius` | number | `1` | Current rendered light radius. |
| `light` | Entity | `SpawnPrefab("firefx_light")` | The dedicated light entity associated with the fire. |
| `playignitesound` | boolean | `true` | Whether to play the ignition sound on level increase. |
| `bigignitesoundthresh` | number | `3` | Minimum level to trigger large fire burst sound on ignition. |
| `usedayparamforsound` | boolean | `false` | If `true`, modifies sound parameter `"daytime"` based on world time of day. |
| `lightsound` | string \| nil | `nil` | Custom ignition sound override. |
| `extinguishsound` | string \| nil | `nil` | Custom extinguish sound override. |

## Main functions
### `SetLevel(level, immediate, controlled_burn)`
* **Description:** Sets the fire to a specific intensity level, updating animation, light properties (radius, intensity, colour, falloff), and playing fire/ignition sounds. Automatically interpolates level if `percent` is set.
* **Parameters:**  
  - `level` (number) - Target fire level (1-indexed; capped to `#self.levels`).  
  - `immediate` (boolean, optional) - If `false` and `params.pre` exists, plays a transition animation before main animation.  
  - `controlled_burn` (boolean, optional) - If non-`nil`, uses `*_controlled_burn` animation variants; if `nil`, resets to non-controlled state.
* **Returns:** Nothing.
* **Error states:** No level change occurs if `level` is `<= 0` and equal to current level (unless controlled burn state changes).

### `SetPercentInLevel(percent)`
* **Description:** Interpolates the fire's radius and light intensity between the current level and the previous level based on `percent`.
* **Parameters:**  
  - `percent` (number) - Interpolation factor in `[0, 1]`. `0` = previous level values; `1` = current level values.
* **Returns:** Nothing.

### `GetLevelRadius(level)`
* **Description:** Retrieves the radius value for a given fire level using either `self.levels[level].radius` or `self.radius_levels[level]` (if present).
* **Parameters:**  
  - `level` (number) - Level index (1-based).
* **Returns:**  
  - (number) - Radius value for the level, or `nil` if level not defined.

### `UpdateRadius()`
* **Description:** Recalculates `current_radius` and updates the light radius based on `percent` interpolation between current and previous level.
* **Parameters:** None.
* **Returns:** Nothing.

### `Extinguish(fast)`
* **Description:** Stops fire sound, plays extinguish sound, and optionally plays an "afterglow" animation. Returns `true` if a pst-animation is playing (entity should delay removal).
* **Parameters:**  
  - `fast` (boolean) - If `true`, uses `*_fast` variant of the afterglow animation.
* **Returns:**  
  - (boolean) - `true` if apst animation is being played; `false` otherwise.
* **Error states:** If `self.extinguishsoundtest` is defined and returns `false`, no extinguish sound is played (rare).

### `AttachLightTo(target)`
* **Description:** Reparents the `light` entity to a new target entity (e.g., attaching to a burning item or character).
* **Parameters:**  
  - `target` (Entity) - The new parent entity.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Periodically updates light radius with subtle sine-based flicker and syncs sound `"daytime"` parameter if `usedayparamforsound` is enabled.
* **Parameters:**  
  - `dt` (number) - Time since last update (unused in calculation, but required by update contract).
* **Returns:** Nothing.

### `OnEntitySleep()`, `OnEntityWake()`
* **Description:** Mutes fire sound when entity sleeps and restores it on wake.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onremove"` on parent target entities (via `_onremovelighttarget` callback) to restore `light` parent back to owner if target is removed.

- **Pushes:** None.

- **Uses internal callbacks:**  
  - `_onremovelighttarget()` - Reparents `self.light` to `self.inst` when a target entity is removed.
