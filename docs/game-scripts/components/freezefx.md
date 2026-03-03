---
id: freezefx
title: Freezefx
description: Manages dynamic visual and audio effects for fire-based entities, including flickering light, radius scaling, intensity control, and sound effects across multiple flame levels.
tags: [fx, lighting, sound]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: bc40af89
system_scope: fx
---

# Freezefx

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`FireFX` is a component that dynamically controls fire-related visual and audio effects for an entity, such as flickering light radius and intensity, animation sequences across multiple flame levels, and fire-related sound playback. It is intended for entities that simulate fire (e.g., campfires, torches), and supports interpolation between flame levels and level transitions with sound and animation feedback.

> **Note:** Despite the file name `freezefx.lua`, the actual component class defined is `FireFX`, and all functionality relates to fire—not freezing effects. This appears to be a naming inconsistency in the codebase.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("freezefx") -- Note: component name in AddComponent() is typically "freezefx"
inst.components.freezefx.levels = {
    { radius = 1.0, intensity = 0.5, falloff = 1.0, colour = {1.0, 0.8, 0.2}, sound = "dontstarve/common/fire", anim = "fire_smolder" },
    { radius = 2.0, intensity = 1.0, falloff = 1.5, colour = {1.0, 0.6, 0.0}, sound = "dontstarve/common/fire", anim = "fire_on", pre = "fire_pre" },
}
inst.components.freezefx:SetLevel(2)
inst.components.freezefx:SetPercentInLevel(0.75)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

> **Note:** The component directly manipulates `inst.Light`, `inst.AnimState`, and `inst.SoundEmitter` — these components must already be present on the entity for `FireFX` to function correctly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | Entity | `nil` | The entity instance the component is attached to. |
| `level` | number | `nil` | Current flame level index (starts at `1`). |
| `percent` | number | `1` | Interpolation factor (`0` to `1`) used when transitioning between flame levels for radius/intensity. |
| `levels` | table | `{}` | Table of flame level definitions; each entry is a table with keys like `radius`, `intensity`, `falloff`, `colour`, `sound`, `anim`, and optionally `pre`, `pst`, `soundintensity`. |
| `playignitesound` | boolean | `true` | Whether to play ignition sound on level increase. |
| `bigignitesoundthresh` | number | `3` | Minimum level threshold to trigger large fire ignition sound. |
| `usedayparamforsound` | boolean | `false` | Whether to adjust fire sound based on in-game time of day (`true` sets parameter `"daytime"` to `1` or `2`). |
| `current_radius` | number | `1` | Computed light radius, updated in real time and during level changes. |

## Main functions
### `OnUpdate(dt)`
* **Description:** Called each frame by the game's update loop. Handles dynamic light flickering using sine-wave-based noise, and optionally updates fire sound parameter `"daytime"` if `usedayparamforsound` is `true`.
* **Parameters:** `dt` (number) — Delta time since last frame. (Unused directly but required by update loop.)
* **Returns:** Nothing.
* **Error states:** No failure conditions; assumes `inst.Light` and `inst.SoundEmitter` exist.

### `UpdateRadius()`
* **Description:** Updates `current_radius` by interpolating between lower and upper bounds of current and previous flame levels, then applies the computed radius to `inst.Light`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetPercentInLevel(percent)`
* **Description:** Sets the interpolation factor within the current flame level and updates both light radius and intensity accordingly. Also supports smooth transitions for intensity across levels.
* **Parameters:** `percent` (number) — Value between `0` and `1`, where `0` corresponds to the lower bound (previous level or level `1`) and `1` to the current level's full value.
* **Returns:** Nothing.

### `SetLevel(lev)`
* **Description:** Sets the flame level to `lev`. Handles animation sequences (`pre` and `pst` frames), sound switching and ignition sounds, and updates light properties (radius, intensity, colour, falloff). Does nothing if `lev <= 0` or `lev == self.level`.
* **Parameters:** `lev` (number) — Flame level index (`1`-based). Will be clamped to `#self.levels`.
* **Returns:** Nothing.
* **Error states:** If `self.level` is `nil`, animation may include a `pre` sequence followed by a looping animation. Level jumps only trigger ignition sound when increasing (`lev > self.level`) and `playignitesound` is `true`.

### `Extinguish()`
* **Description:** Stops fire sounds and optionally plays a fire-out sound and extinguish animation (`pst`). Returns whether the extinguish animation should be allowed to complete before entity removal.
* **Parameters:** None.
* **Returns:** `true` if a `pst` (post) animation exists and should be played; otherwise `false`.  
* **Error states:**  
  - Sound `"fire"` is always killed.  
  - If `extinguishsoundtest` exists and returns `false`, fire-out sound is skipped.  
  - If `levels[self.level]` or `levels[self.level].pst` is missing, no animation is played.

## Events & listeners
None identified
