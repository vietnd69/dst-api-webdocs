---
id: projectedeffects
title: Projectedeffects
description: Manages animated fade-in and fade-out transitions for projection shader effects on an entity using alpha interpolation and shader parameters.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: ff561b5e
---

# Projectedeffects

## Overview
The `ProjectedEffects` component manages smooth visual transitions (fade-in and fade-out) for projection-based shaders applied to an entity's animation state. It controls alpha interpolation over time, updates erosion parameters for the shader, and supports callbacks upon completion of construction or decay phases. It integrates with the entity’s update loop to drive the animation dynamically.

## Dependencies & Tags
- Uses `inst.AnimState:SetErosionParams(...)` — depends on the `AnimState` component being present on the entity.
- No explicit component additions or tag manipulations are performed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed in constructor) | Reference to the owning entity instance. |
| `alpha` | `number` | `0` | Current interpolation factor (0 = fully invisible, 1 = fully visible). |
| `targetalpha` | `number` | `0` | Target alpha value the transition is moving toward. |
| `cutoffheight` | `number` | `-0.01` | Shader cutoff height parameter; clamped to avoid fractal artifacts. |
| `intensity` | `number` | `-0.15` | Shader intensity (must be negative for projector to function). |
| `decaytime` | `number` | `0.5` | Duration (in seconds) for fade-out transitions. |
| `constructtime` | `number` | `0.25` | Duration (in seconds) for fade-in transitions. |
| `onconstructcallback` | `function?` | `nil` | Optional callback invoked when fade-in completes. |
| `ondecaycallback` | `function?` | `nil` | Optional callback invoked when fade-out completes (unless decay is locked). |

> Note: The component does not define `_ctor` separately but uses `Class(function(self, inst) ... end)` to initialize state.

## Main Functions

### `MakeOpaque()`
* **Description:** Immediately sets the effect to fully opaque (`alpha = 1`) and updates the shader erosion parameters accordingly.
* **Parameters:** None.

### `SetDecayTime(duration)`
* **Description:** Sets the duration (in seconds) for fade-out transitions. Enforces a minimum positive value.
* **Parameters:**  
  * `duration` (`number`): Desired fade-out duration. Values less than `0.01` are clamped to `0.01`.

### `SetConstructTime(duration)`
* **Description:** Sets the duration (in seconds) for fade-in transitions. Enforces a minimum positive value.
* **Parameters:**  
  * `duration` (`number`): Desired fade-in duration. Values less than `0.01` are clamped to `0.01`.

### `SetCutoffHeight(cutoffheight)`
* **Description:** Sets the shader cutoff height. Automatically adjusts `0` to `-0.01` to prevent shader artifacts.
* **Parameters:**  
  * `cutoffheight` (`number`): Cutoff height value for the erosion shader.

### `SetIntensity(intensity)`
* **Description:** Sets the shader intensity. Ensures the value is negative (required for projector shader functionality).
* **Parameters:**  
  * `intensity` (`number`): Intensity value. Values greater than `-0.01` are clamped to `-0.01`.

### `SetOnConstructCallback(callback)`
* **Description:** Registers a callback function to execute when the fade-in transition completes (i.e., `alpha` reaches `1`).
* **Parameters:**  
  * `callback` (`function?`): Function accepting `inst` as its sole argument.

### `SetOnDecayCallback(callback)`
* **Description:** Registers a callback function to execute when the fade-out transition completes (i.e., `alpha` reaches `0`), unless decay is locked.
* **Parameters:**  
  * `callback` (`function?`): Function accepting `inst` as its sole argument.

### `Construct()`
* **Description:** Initiates a fade-in transition by setting `targetalpha = 1` and starting the component update loop if not already active. No effect if `permanentdecay` is true.
* **Parameters:** None.

### `Decay(permanent)`
* **Description:** Initiates a fade-out transition by setting `targetalpha = 0` and starting the update loop. If `permanent` is true, the decay is locked so it cannot be re-enabled later.
* **Parameters:**  
  * `permanent` (`boolean`): If true, sets `permanentdecay = true`, preventing future construction.

### `LockDecay(locked)`
* **Description:** Locks or unlocks the decay state. When locked, decay completion callbacks are suppressed and no further fade-in is possible.
* **Parameters:**  
  * `locked` (`boolean`): If true, prevents decay callbacks and halts future construction.

### `SetPaused(paused)`
* **Description:** Pauses or resumes the transition update loop.
* **Parameters:**  
  * `paused` (`boolean`): If true, pauses updates; otherwise, resumes.

### `OnUpdate(dt)`
* **Description:** Interpolates `alpha` toward `targetalpha` using linear interpolation over `constructtime` or `decaytime`, then updates the shader. Triggers callbacks and stops updates when transitions complete.
* **Parameters:**  
  * `dt` (`number`): Delta time in seconds since the last frame.

## Events & Listeners
None. This component does not use DST’s event system (`inst:ListenForEvent`/`inst:PushEvent`); it relies solely on direct method calls and the `OnUpdate` loop.