---
id: firefx
title: Firefx
description: Manages visual and audio effects for a fire entity, including light flicker, radius, intensity, sound playback, and animation states across multiple fire levels.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: eb4e091c
---

# Firefx

## Overview
The `FireFX` component manages the visual and auditory effects for a fire entity within the game's Entity Component System. It handles dynamic light rendering (including radius and intensity), sound playback (with day/night adjustments), animation transitions between fire levels, and offset positioning of the light effect relative to its parent entity.

## Dependencies & Tags
- **Component Dependencies**: Requires `inst` (an entity instance) to be valid at construction time; expects `inst.AnimState`, `inst.SoundEmitter`, and `inst.Transform` to exist.
- **Sub-prefab Spawned**: Spawns and manages a child prefab `"firefx_light"` for the fire's light effect.
- **No explicit tags added/removed** by this component itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (constructor parameter) | Reference to the owning entity. |
| `level` | `number` or `nil` | `nil` | Current fire level index (1-based); `nil` before first `SetLevel` call. |
| `playingsound` | `string` or `nil` | `nil` | ID of the currently playing fire sound. |
| `playingsoundintensity` | `number` or `nil` | `nil` | Intensity parameter for the current fire sound. |
| `percent` | `number` | `1` | Progress within the current fire level (0 to 1); used for interpolation. |
| `levels` | `table` | `{}` | Array of fire level definitions, each containing `radius`, `intensity`, `colour`, `falloff`, `sound`, `soundintensity`, and animation keys. |
| `playignitesound` | `boolean` | `true` | Whether to play ignition sound when level increases. |
| `bigignitesoundthresh` | `number` | `3` | Minimum fire level to play the large fire ignition sound. |
| `usedayparamforsound` | `boolean` | `false` | Whether to use world day/night state to adjust fire sound parameters. |
| `current_radius` | `number` | `1` | Current computed light radius. |
| `light` | `Entity` | (Spawns `"firefx_light"`) | Light effect entity managed by this component. |
| `_onremovelighttarget` | `function` | (internal) | Callback to re-attach light if target entity is removed. |
| `lightsound` | `string` or `nil` | `nil` | Custom ignition sound override. |
| `extinguishsound` | `string` or `nil` | `nil` | Custom extinguish sound override. |
| `controlled_burn` | `boolean` or `nil` | `nil` | Whether the fire is in a "controlled burn" state. |
| `isday` | `boolean` or `nil` | `nil` | Cached day/night state for sound parameter updates. |

## Main Functions

### `SetLevel(lev, immediate, controlled_burn)`
* **Description**: Sets the fire to a specified level, updating animations, light properties, and sound accordingly. Plays ignition sounds when increasing level or exiting controlled burn. |
* **Parameters**:
  - `lev` (`number`): Target fire level (1-indexed). Clamped to `#self.levels`.
  - `immediate` (`boolean`): If true, skips any pre-animation and plays the main animation immediately.
  - `controlled_burn` (`boolean` or `nil`): If true, uses controlled-burn animation variants. Setting to `nil` after a non-nil value triggers a re-ignition sound.

### `SetPercentInLevel(percent)`
* **Description**: Updates the interpolation progress within the current fire level, adjusting light radius and intensity accordingly via linear interpolation between adjacent levels.
* **Parameters**:
  - `percent` (`number`): Value between `0` and `1` indicating progress through the current level's radius/intensity range.

### `UpdateRadius()`
* **Description**: Recomputes and applies the current light radius based on `self.level`, `self.percent`, and the `levels` table. Called automatically by `SetPercentInLevel`.

### `GetLevelRadius(level)`
* **Description**: Returns the radius value for a given fire level, supporting both direct table lookup (`self.levels[level].radius`) and fallback to `self.radius_levels[level]`.
* **Parameters**:
  - `level` (`number`): Level index (1-based).

### `OnUpdate(dt)`
* **Description**: Periodically updates the fire light effect with a subtle flicker (using a combined sine wave) and adjusts sound parameters if `usedayparamforsound` is enabled.
* **Parameters**:
  - `dt` (`number`): Time since last frame (unused in logic but passed by ECS).

### `Extinguish(fast)`
* **Description**: Stops fire sounds and plays an extinguish animation/sound. Optionally returns `true` to signal that the owning entity should not be removed immediately (due to a lingering post-animation).
* **Parameters**:
  - `fast` (`boolean`): If true, uses the fast extinguish animation (`pst_fast`).

### `AttachLightTo(target)`
* **Description**: Re-parents the light entity to a new target entity (e.g., when fire is attached to a held item or placed on ground).
* **Parameters**:
  - `target` (`Entity` or `nil`): Target entity to parent the light to; if `nil`, defaults to `self.inst`.

### `SetFxLightOffsetPosition(off)`
* **Description**: Sets a dynamic offset for the light's position relative to its parent.
* **Parameters**:
  - `off` (`Vector` or `nil`): Offset to apply via `self.offset_fxlight_position`.

### `OnEntitySleep()`
* **Description**: Pauses fire sound playback when the entity enters sleep state.

### `OnEntityWake()`
* **Description**: Restarts fire sound playback when the entity wakes, if a sound was previously playing.

## Events & Listeners
- Listens for `"onremove"` event on `self.light` (via `_onremovelighttarget`) when attached to a non-owning target, to re-parent light back to `self.inst` if the target is removed.
- Listens for `"onremove"` event on `target` (via `_onremovelighttarget`) when attaching to a new target to handle re-parenting on removal.