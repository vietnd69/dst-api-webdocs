---
id: projectedeffects
title: Projectedeffects
description: Manages animated transparency and shader parameters for projected visual effects on entities, such as fading in or out using an erosion shader.
tags: [fx, visual, animation]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ff561b5e
system_scope: fx
---
# Projectedeffects

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ProjectedEffects` controls the fade-in and fade-out animation of projected visual effects on an entity's mesh by dynamically adjusting the alpha value of an erosion shader. It interacts with the `AnimState` component to apply time-based transitions using configurable construct and decay times. This component is typically used for particles or overlays that need smooth opacity transitions (e.g., summoned entities, temporary barriers).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("projectedeffects")
inst.components.projectedeffects:SetConstructTime(0.5)
inst.components.projectedeffects:SetDecayTime(1.0)
inst.components.projectedeffects:SetIntensity(-0.2)
inst.components.projectedeffects:Construct()
```

## Dependencies & tags
**Components used:** `AnimState` (via `inst.AnimState:SetErosionParams(...)`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `alpha` | number | `0` | Current opacity level (0 = fully transparent, 1 = fully opaque). |
| `targetalpha` | number | `0` | Target opacity for interpolation. |
| `cutoffheight` | number | `-0.01` | Shader parameter to control vertical cutoff; set to `SHADER_CUTOFF_HEIGHT_HIDE` (`20`) when fully transparent. |
| `intensity` | number | `-0.15` | Shader intensity; must be ≤ `-0.01` to function. |
| `decaytime` | number | `0.5` | Duration (seconds) for fade-out transition. |
| `constructtime` | number | `0.25` | Duration (seconds) for fade-in transition. |
| `onconstructcallback` | function or nil | `nil` | Optional callback fired when fully constructed (`alpha == 1`). |
| `ondecaycallback` | function or nil | `nil` | Optional callback fired when fully decayed (`alpha == 0`) *and* not locked. |
| `permanentdecay` | boolean or nil | `nil` | When true, prevents reactivation via `Construct()`. |
| `lockeddecay` | boolean or nil | `nil` | When true, prevents cleanup after decay completes (i.e., keeps component updated). |
| `paused` | boolean or nil | `nil` | If true, temporarily halts updates in `OnUpdate`. |

## Main functions
### `MakeOpaque()`
* **Description:** Instantly sets the effect to fully opaque (alpha = 1) and applies the erosion shader parameters accordingly. Useful for immediate visibility without animation.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetDecayTime(duration)`
* **Description:** Sets the time (in seconds) over which the effect fades out (alpha → 0).
* **Parameters:** `duration` (number) — must be ≥ `0.01`; values below this are clamped.
* **Returns:** Nothing.

### `SetConstructTime(duration)`
* **Description:** Sets the time (in seconds) over which the effect fades in (alpha → 1).
* **Parameters:** `duration` (number) — must be ≥ `0.01`; values below this are clamped.
* **Returns:** Nothing.

### `SetCutoffHeight(cutoffheight)`
* **Description:** Configures the vertical cutoff height used by the erosion shader. Automatically adjusts zero to `-0.01` to prevent shader instability.
* **Parameters:** `cutoffheight` (number) — desired cutoff height.
* **Returns:** Nothing.

### `SetIntensity(intensity)`
* **Description:** Sets the shader intensity. Enforces a maximum (least negative) value of `-0.01` to ensure the projector shader remains active.
* **Parameters:** `intensity` (number) — must be ≤ `-0.01`.
* **Returns:** Nothing.

### `SetOnConstructCallback(callback)`
* **Description:** Assigns an optional callback function invoked when the effect reaches full opacity (`alpha == 1`).
* **Parameters:** `callback` (function) — takes the entity instance (`inst`) as argument.
* **Returns:** Nothing.

### `SetOnDecayCallback(callback)`
* **Description:** Assigns an optional callback function invoked when the effect completes decay (`alpha == 0`) *and* decay is not locked.
* **Parameters:** `callback` (function) — takes the entity instance (`inst`) as argument.
* **Returns:** Nothing.

### `Construct()`
* **Description:** Initiates fade-in transition by setting `targetalpha = 1`. Skips if `permanentdecay` is set or if alpha is already at or above target.
* **Parameters:** None.
* **Returns:** Nothing.

### `Decay(permanent)`
* **Description:** Initiates fade-out transition by setting `targetalpha = 0`. If `permanent` is true, prevents future `Construct()` calls.
* **Parameters:** `permanent` (boolean) — if true, locks the decay state permanently.
* **Returns:** Nothing.

### `LockDecay(locked)`
* **Description:** Determines whether to keep the component active after full decay. When `true`, decay callbacks won’t stop updates, preserving the component for potential later use.
* **Parameters:** `locked` (boolean) — whether to lock decay state.
* **Returns:** Nothing.

### `SetPaused(paused)`
* **Description:** Pauses or resumes animation updates. Accepts `true`/`false` or any truthy/falsy value.
* **Parameters:** `paused` (boolean) — if truthy, pauses the update loop.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Core update loop that interpolates `alpha` toward `targetalpha` each frame, using `constructtime` or `decaytime`. Applies updated shader params to `AnimState`. Fires callbacks and stops updates when transitions complete.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
