---
id: postprocesseffects
title: Postprocesseffects
description: Extends the PostProcessor engine class with post-processing effect management functions for colour cubes, bloom, distortion, lunacy, and moon pulse shaders.
tags: [graphics, rendering, shaders, effects, client]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: root
source_hash: fe951c36
system_scope: fx
---

# Postprocesseffects

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`postprocesseffects.lua` extends the engine's `PostProcessor` class with functions for managing visual post-processing effects. It defines shader builders for colour cubes, bloom, distortion, zoom blur, lunacy, and moon pulse effects. On dedicated servers, most functions become empty stubs since post-processing is client-side only. The file sets up texture samplers, uniform variables, and effect ordering for the rendering pipeline.

## Usage example
```lua
-- Access PostProcessor methods (extended by this file)
PostProcessor:SetBloomEnabled(true)
PostProcessor:SetDistortionEnabled(true)
PostProcessor:SetLunacyIntensity(0.5)

-- Build and enable shaders (typically called during initialization)
BuildColourCubeShader()
BuildBloomShader()
BuildDistortShader()
SortAndEnableShaders()

-- Check effect states
local bloomOn = PostProcessor:IsBloomEnabled()
local distortionOn = PostProcessor:IsDistortionEnabled()
```

## Dependencies & tags
**External dependencies:**
- `PostProcessor` -- engine class extended with new methods via metatable `__index`
- `ModManager` -- used for post-init shader callbacks via `GetPostInitFns()`
- `TheNet` -- checks if running on dedicated server via `IsDedicated()`

**Components used:**
None identified

**Tags:**
None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `distortion_enabled` | boolean | `false` | Local state tracking whether distortion effect is enabled. |
| `lunacy_enabled` | boolean | `false` | Local state tracking whether lunacy effect is enabled. |
| `fishlens_active` | boolean | `false` | Local state tracking whether fish lens distortion is active (radius > 0). |
| `bloom_enabled` | boolean | `false` | Local state tracking whether bloom effect is enabled. |
| `UniformVariables.SAMPLER_PARAMS` | hash | — | Uniform variable containing buffer dimensions `{buffer_width, buffer_height, 1/buffer_width, 1/buffer_height}`. |
| `TexSamplers.CC0_SOURCE` | number | — | Texture sampler ID for colour cube 0 source. |
| `TexSamplers.CC0_DEST` | number | — | Texture sampler ID for colour cube 0 destination. |
| `TexSamplers.CC1_SOURCE` | number | — | Texture sampler ID for colour cube 1 source. |
| `TexSamplers.CC1_DEST` | number | — | Texture sampler ID for colour cube 1 destination. |
| `TexSamplers.CC2_SOURCE` | number | — | Texture sampler ID for colour cube 2 source. |
| `TexSamplers.CC2_DEST` | number | — | Texture sampler ID for colour cube 2 destination. |
| `TexSamplers.LUNACY_OVERLAY_IMAGE` | number | — | Texture sampler ID for lunacy overlay image. |
| `UniformVariables.CC_LERP_PARAMS` | number | — | Uniform variable for colour cube lerp parameters (3 components). |
| `UniformVariables.CC_LAYER_PARAMS` | number | — | Uniform variable for colour cube layer parameters (2 components). |
| `UniformVariables.INTENSITY_MODIFIER` | number | — | Uniform variable for intensity modifier (1 component). |
| `UniformVariables.OVERLAY_BLEND` | number | — | Uniform variable for overlay blend (1 component). |
| `UniformVariables.DISTORTION_PARAMS` | number | — | Uniform variable for distortion parameters (4 components). |
| `UniformVariables.DISTORTION_FISHEYE_PARAMS` | number | — | Uniform variable for fish eye distortion parameters (2 components). |
| `UniformVariables.DISTORTION_FISHLENS_PARAMS` | number | — | Uniform variable for fish lens distortion parameters (2 components). |
| `UniformVariables.LUNACY_INTENSITY` | number | — | Uniform variable for lunacy intensity (4 components). |
| `UniformVariables.MOONPULSE_PARAMS` | number | — | Uniform variable for moon pulse parameters (4 components). |
| `UniformVariables.MOONPULSE_GRADING_PARAMS` | number | — | Uniform variable for moon pulse grading parameters (4 components). |
| `SamplerEffects.CombineColourCubes` | number | — | Sampler effect ID for combining colour cubes. |
| `SamplerEffects.BlurH` | number | — | Sampler effect ID for horizontal blur (bloom). |
| `SamplerEffects.BlurV` | number | — | Sampler effect ID for vertical blur (bloom). |
| `PostProcessorEffects.ColourCube` | number | — | Post-process effect ID for colour cube. |
| `PostProcessorEffects.Bloom` | number | — | Post-process effect ID for bloom. |
| `PostProcessorEffects.Distort` | number | — | Post-process effect ID for distortion. |
| `PostProcessorEffects.ZoomBlur` | number | — | Post-process effect ID for zoom blur. |
| `PostProcessorEffects.Lunacy` | number | — | Post-process effect ID for lunacy. |
| `PostProcessorEffects.MoonPulse` | number | — | Post-process effect ID for moon pulse. |
| `PostProcessorEffects.MoonPulseGrading` | number | — | Post-process effect ID for moon pulse grading. |

## Main functions
### `PostProcessor__index:SetColourCubeData(index, src, dest)`
* **Description:** Sets texture samplers for colour cube data at the specified index. Index 0-2 correspond to CC0, CC1, CC2 colour cube pairs.
* **Parameters:**
  - `index` -- integer colour cube index (0, 1, or 2)
  - `src` -- source texture sampler
  - `dest` -- destination texture sampler
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetColourCubeLerp(index, lerp)`
* **Description:** Sets lerp parameters for colour cube blending at the specified index.
* **Parameters:**
  - `index` -- integer colour cube index (0, 1, or 2)
  - `lerp` -- number lerp value for blending
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetOverlayTex(tex)`
* **Description:** Sets the overlay texture sampler for lunacy effects.
* **Parameters:**
  - `tex` -- texture sampler for lunacy overlay image
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetColourModifier(mod)`
* **Description:** Sets the intensity modifier uniform variable for colour adjustment.
* **Parameters:**
  - `mod` -- number intensity modifier value
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetOverlayBlend(blend)`
* **Description:** Sets the overlay blend uniform variable.
* **Parameters:**
  - `blend` -- number blend value
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetDistortionEffectTime(time)`
* **Description:** Sets the distortion effect time parameter.
* **Parameters:**
  - `time` -- number time value for distortion animation
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetDistortionFactor(factor)`
* **Description:** Sets the distortion factor parameter.
* **Parameters:**
  - `factor` -- number distortion factor value
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetDistortionRadii(inner, outer)`
* **Description:** Sets the inner and outer radii for distortion effect.
* **Parameters:**
  - `inner` -- number inner radius value
  - `outer` -- number outer radius value
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetDistortionFishEyeIntensity(intensity)`
* **Description:** Sets the fish eye distortion intensity.
* **Parameters:**
  - `intensity` -- number fish eye intensity value
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetDistortionFishEyeTime(time)`
* **Description:** Sets the fish eye distortion time parameter.
* **Parameters:**
  - `time` -- number time value for fish eye animation
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetDistortionFishLensRadius(r)`
* **Description:** Sets the fish lens distortion radius and updates effect enablement state.
* **Parameters:**
  - `r` -- number radius value (values > 0 activate fishlens_active state)
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetDistortionFishLensAspectRatio(aspect_ratio)`
* **Description:** Sets the fish lens distortion aspect ratio.
* **Parameters:**
  - `aspect_ratio` -- number aspect ratio value
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetBloomEnabled(enabled)`
* **Description:** Enables or disables the bloom post-processing effect.
* **Parameters:**
  - `enabled` -- boolean to enable or disable bloom
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:IsBloomEnabled()`
* **Description:** Returns whether bloom effect is currently enabled.
* **Parameters:** None
* **Returns:** `boolean` -- true if bloom is enabled
* **Error states:** None

### `PostProcessor__index:SetDistortionEnabled(enabled)`
* **Description:** Enables or disables the distortion post-processing effect. Also updates zoom blur state based on distortion and lunacy combination.
* **Parameters:**
  - `enabled` -- boolean to enable or disable distortion
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:IsDistortionEnabled()`
* **Description:** Returns whether distortion effect is currently enabled.
* **Parameters:** None
* **Returns:** `boolean` -- true if distortion is enabled
* **Error states:** None

### `PostProcessor__index:SetLunacyEnabled(enabled)`
* **Description:** Enables or disables the lunacy post-processing effect. Also updates zoom blur state based on distortion and lunacy combination.
* **Parameters:**
  - `enabled` -- boolean to enable or disable lunacy
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetLunacyIntensity(intensity)`
* **Description:** Sets the lunacy effect intensity.
* **Parameters:**
  - `intensity` -- number intensity value (4-component uniform)
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetZoomBlurEnabled(enabled)`
* **Description:** Enables or disables zoom blur effect. Zoom blur is only enabled when both distortion and lunacy are on.
* **Parameters:**
  - `enabled` -- boolean to enable or disable zoom blur
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetMoonPulseParams(p1, p2, p3, p4)`
* **Description:** Sets the moon pulse effect parameters (4-component vector).
* **Parameters:**
  - `p1` -- number first parameter
  - `p2` -- number second parameter
  - `p3` -- number third parameter
  - `p4` -- number fourth parameter
* **Returns:** None
* **Error states:** None

### `PostProcessor__index:SetMoonPulseGradingParams(p1, p2, p3, p4)`
* **Description:** Sets the moon pulse grading effect parameters (4-component vector).
* **Parameters:**
  - `p1` -- number first parameter
  - `p2` -- number second parameter
  - `p3` -- number third parameter
  - `p4` -- number fourth parameter
* **Returns:** None
* **Error states:** None

### `BuildColourCubeShader()`
* **Description:** Initializes colour cube shader pipeline including texture samplers, uniform variables, and the combine colour cubes sampler effect. Sets up CC0, CC1, CC2 source/destination pairs.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `BuildZoomBlurShader()`
* **Description:** Initializes zoom blur shader with overlay blend uniform variable. Contains commented-out code for tap count and weight calculations.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `BuildBloomShader()`
* **Description:** Initializes bloom shader pipeline with horizontal and vertical blur sampler effects. Configures bloom sampler params and effect ordering.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `BuildDistortShader()`
* **Description:** Initializes distortion shader with distortion params, fish eye params, and fish lens params uniform variables.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `BuildLunacyShader()`
* **Description:** Initializes lunacy shader with lunacy overlay texture sampler and smoke sampler. Sets up overlay blend and lunacy intensity uniforms.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `BuildMoonPulseShader()`
* **Description:** Initializes moon pulse shader with moon pulse params uniform variable.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `BuildMoonPulseGradingShader()`
* **Description:** Initializes moon pulse grading shader with moon pulse grading params uniform variable.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `BuildModShaders()`
* **Description:** Calls all mod post-init functions registered for `ModShadersInit`. Allows mods to add custom shader initialization.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SortAndEnableShaders()`
* **Description:** Sets the base post-process effect and orders all effects in the rendering pipeline. Enables colour cube as base effect and calls mod post-init functions for `ModShadersSortAndEnable`.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

## Events & listeners
None.