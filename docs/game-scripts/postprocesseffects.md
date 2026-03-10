---
id: postprocesseffects
title: Postprocesseffects
description: Manages visual post-processing shader effects such as bloom, distortion, lunacy, and moon pulse, configuring and enabling them via the engine's post-processing pipeline.
tags: [visuals, fx, shaders]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: f84a17c9
system_scope: fx
---

# Postprocesseffects

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`PostProcessor` is a singleton-like module (not a standard ECS component) that initializes and controls post-processing shader effects used in DST. It defines uniform variables, texture samplers, and sampler effects, then organizes post-process effects into a sorted execution pipeline. Effects include colour correction (via colour cubes), bloom, distortion, lunacy (the moon glow effect), zoom blur (conditional on distortion and lunacy), and moon pulse grading. Dedicated servers receive stubbed no-op methods; only non-dedicated clients actually process visual effects.

## Usage example
```lua
-- Example: Enable bloom and configure distortion
PostProcessor:SetBloomEnabled(true)
PostProcessor:SetDistortionEnabled(true)
PostProcessor:SetDistortionFactor(0.5)
PostProcessor:SetDistortionRadii(0.1, 0.5)
```

## Dependencies & tags
**Components used:** None (module-level, not attached to an entity). Uses engine APIs: `TheNet:IsDedicated()`, `PostProcessor`, `ModManager`, and various `TexSamplers`, `UniformVariables`, `SamplerEffects`, `PostProcessorEffects` constants.
**Tags:** None identified.

## Properties
No public properties — all state is internal (e.g., `bloom_enabled`, `distortion_enabled`, `lunacy_enabled` are module-local variables) and accessed exclusively via methods.

## Main functions
### `SetColourCubeData(index, src, dest)`
*   **Description:** Assigns source and destination colour cube textures for a given index (`0`, `1`, or `2`). Used in colour grading operations.
*   **Parameters:**  
    `index` (number) — colour cube layer index (`0`, `1`, or `2`).  
    `src` (string or handle) — source texture path or sampler handle.  
    `dest` (string or handle) — destination texture path or sampler handle.
*   **Returns:** Nothing.

### `SetColourCubeLerp(index, lerp)`
*   **Description:** Sets interpolation values for colour cube blending layers.
*   **Parameters:**  
    `index` (number) — colour cube layer index (`0`, `1`, or `2`).  
    `lerp` (number) — interpolation factor.
*   **Returns:** Nothing.

### `SetOverlayTex(tex)`
*   **Description:** Sets the texture used for the Lunacy overlay (moon glow effect).
*   **Parameters:** `tex` (string or handle) — texture path or sampler handle.
*   **Returns:** Nothing.

### `SetColourModifier(mod)`
*   **Description:** Sets the global intensity modifier for colour correction.
*   **Parameters:** `mod` (number) — intensity multiplier.
*   **Returns:** Nothing.

### `SetOverlayBlend(blend)`
*   **Description:** Controls how the Lunacy overlay blends with the base scene.
*   **Parameters:** `blend` (number) — blend factor (typically `0.0` to `1.0`).
*   **Returns:** Nothing.

### `SetDistortionEffectTime(time)`
*   **Description:** Sets the time component of the distortion effect (used for animation or pulsing).
*   **Parameters:** `time` (number) — time parameter.
*   **Returns:** Nothing.

### `SetDistortionFactor(factor)`
*   **Description:** Sets the distortion intensity factor.
*   **Parameters:** `factor` (number) — distortion strength.
*   **Returns:** Nothing.

### `SetDistortionRadii(inner, outer)`
*   **Description:** Defines the radial range over which distortion is applied (inner radius, outer radius).
*   **Parameters:**  
    `inner` (number) — inner radius.  
    `outer` (number) — outer radius.
*   **Returns:** Nothing.

### `SetDistortionFishEyeIntensity(intensity)`
*   **Description:** Sets the intensity of the fish-eye distortion effect.
*   **Parameters:** `intensity` (number) — fish-eye distortion strength.
*   **Returns:** Nothing.

### `SetDistortionFishEyeTime(time)`
*   **Description:** Sets the time component of the fish-eye distortion effect.
*   **Parameters:** `time` (number) — time parameter for animation.
*   **Returns:** Nothing.

### `SetBloomEnabled(enabled)`
*   **Description:** Enables or disables bloom post-processing.
*   **Parameters:** `enabled` (boolean) — whether bloom is active.
*   **Returns:** Nothing.

### `IsBloomEnabled()`
*   **Description:** Returns the current bloom enable state.
*   **Parameters:** None.
*   **Returns:** `true` if bloom is enabled, `false` otherwise.

### `SetDistortionEnabled(enabled)`
*   **Description:** Enables or disables distortion post-processing. When enabled, also toggles zoom blur if lunacy is enabled.
*   **Parameters:** `enabled` (boolean) — whether distortion is active.
*   **Returns:** Nothing.

### `IsDistortionEnabled()`
*   **Description:** Returns the current distortion enable state.
*   **Parameters:** None.
*   **Returns:** `true` if distortion is enabled, `false` otherwise.

### `SetLunacyEnabled(enabled)`
*   **Description:** Enables or disables lunacy post-processing. When enabled, also toggles zoom blur if distortion is enabled.
*   **Parameters:** `enabled` (boolean) — whether lunacy is active.
*   **Returns:** Nothing.

### `SetLunacyIntensity(intensity)`
*   **Description:** Sets the intensity of the lunacy effect (moon glow).
*   **Parameters:** `intensity` (number) — lunacy strength (e.g., `0.0`–`1.0`).
*   **Returns:** Nothing.

### `SetZoomBlurEnabled(enabled)`
*   **Description:** Enables or disables zoom blur post-processing. Only active when both distortion and lunacy are enabled (controlled indirectly via `SetDistortionEnabled()` and `SetLunacyEnabled()`).
*   **Parameters:** `enabled` (boolean) — whether zoom blur is active.
*   **Returns:** Nothing.

### `SetMoonPulseParams(p1, p2, p3, p4)`
*   **Description:** Sets uniform parameters for the Moon Pulse effect (typically controls timing and cycle behavior).
*   **Parameters:** Four numbers representing effect parameters (`p1`–`p4`).
*   **Returns:** Nothing.

### `SetMoonPulseGradingParams(p1, p2, p3, p4)`
*   **Description:** Sets uniform parameters for the Moon Pulse Grading effect (controls colour grading adjustments during moon pulse events).
*   **Parameters:** Four numbers representing grading parameters (`p1`–`p4`).
*   **Returns:** Nothing.

## Events & listeners
Not applicable — this module does not use events or listeners.