---
id: freezefx
title: Freezefx
description: This component manages dynamic firelight effects—including flickering, radius/intensity scaling, animation states, and sound—based on configurable intensity levels and dynamic updates.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: bc40af89
---

# Freezefx

## Overview  
This component controls the visual and auditory behavior of fire-related effects for an entity, including dynamic light flickering, animated state transitions (ignition, burning, extinguishing), radius and intensity interpolation across predefined levels, and sound playback. It integrates with `Light`, `AnimState`, and `SoundEmitter` components to provide real-time updates and feedback.

## Dependencies & Tags  
- Requires the following components to be present on the same entity:  
  - `Light` (for dynamic lighting: radius, intensity, falloff, colour)  
  - `AnimState` (for playing fire animations)  
  - `SoundEmitter` (for fire ignition, burn, and extinguish sounds)  
- Adds itself as an updating component (`inst:StartUpdatingComponent(self)`) to receive `OnUpdate(dt)` calls.

## Properties  

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` → assigned in constructor | Reference to the owning entity instance. |
| `level` | `number?` | `nil` | Current fire intensity level index (1-based), or `nil` if unset. |
| `percent` | `number` | `1` | Interpolation factor (0–1) for smoothly transitioning radius/intensity *within* a level. |
| `levels` | `table` | `{}` | Array of fire level configurations (see `SetLevel` for expected structure). |
| `playignitesound` | `boolean` | `true` | Controls whether ignition sounds (small/large burst) play when level increases. |
| `bigignitesoundthresh` | `number` | `3` | Minimum level threshold to trigger the *large* fire burst sound. |
| `usedayparamforsound` | `boolean` | `false` | Whether to use `TheWorld.state.isday` to modulate fire sound via the `daytime` parameter. |
| `current_radius` | `number` | `1` | Dynamically updated radius of the light (used in flickering and updates). |
| `playingsound` | `string?` | `nil` | Name of the currently playing fire sound. |
| `isday` | `boolean?` | `nil` | Cached day/night state (used only if `usedayparamforsound` is true). |

## Main Functions  

### `OnUpdate(dt)`  
* **Description:** Runs every frame to animate the firelight: adds subtle flicker to the radius and optionally updates the fire sound's `daytime` parameter based on in-world time.  
* **Parameters:**  
  - `dt` (number): Delta time since last frame (unused directly; only used for time-sampling).  

### `UpdateRadius()`  
* **Description:** Calculates and applies the current light radius by interpolating between adjacent level radii using `self.percent`, or falls back to the current level’s full radius.  
* **Parameters:** None.  

### `SetPercentInLevel(percent)`  
* **Description:** Sets the interpolation factor `percent` (0–1) within the current level and updates both light radius and intensity accordingly.  
* **Parameters:**  
  - `percent` (number): Interpolation factor between 0 and 1 (0 = start of level range, 1 = end).  

### `SetLevel(lev)`  
* **Description:** Sets the fire to a specified intensity level, updating animation, light properties, and sound. Plays ignition sound (if enabled) when increasing level. Handles initial animation setup (including pre/post animations) or direct looped playback.  
* **Parameters:**  
  - `lev` (number): Desired fire level index (1-based). If `lev <= #levels`, it clamps to the highest available level. If `lev <= 0`, no change occurs.  

### `Extinguish()`  
* **Description:** Stops the fire effect: kills the fire sound, plays the extinction sound (if not suppressed), and optionally triggers an 'exiting' animation. Returns a boolean indicating if the extinguish animation is playing (caller may defer destruction).  
* **Parameters:** None.  
* **Returns:**  
  - `boolean`: `true` if a post-extinguish animation (`pst`) is playing and should be allowed to finish; `false` otherwise.  

## Events & Listeners  
None. This component does not register any `ListenForEvent` calls or push custom events.