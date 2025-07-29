---
id: postprocesseffects
title: Post Process Effects
description: Visual post-processing effects system for screen-space rendering
sidebar_position: 5

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Post Process Effects

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `postprocesseffects` module provides a comprehensive system for managing visual post-processing effects in Don't Starve Together. It extends the PostProcessor with methods to control color grading, bloom, distortion, lunacy effects, and other screen-space visual enhancements. The system includes dedicated server support with no-op implementations for performance optimization.

## Usage Example

```lua
-- Enable bloom effect
PostProcessor:SetBloomEnabled(true)

-- Set color cube transition
PostProcessor:SetColourCubeData(0, "day_colourcube.tex", "night_colourcube.tex")
PostProcessor:SetColourCubeLerp(0, 0.5)

-- Configure distortion effect
PostProcessor:SetDistortionEnabled(true)
PostProcessor:SetDistortionFactor(0.1)
PostProcessor:SetDistortionRadii(50, 100)
```

## PostProcessor Methods

### PostProcessor:SetColourCubeData(index, src, dest) {#setcolourcubedata}

**Status:** `stable`

**Description:**
Sets the source and destination texture samplers for a color cube effect at the specified index.

**Parameters:**
- `index` (number): Color cube index (0, 1, or 2)
- `src` (string): Source texture path for color cube
- `dest` (string): Destination texture path for color cube

**Example:**
```lua
-- Set day/night color cube transition
PostProcessor:SetColourCubeData(0, "images/colour_cubes/day.tex", "images/colour_cubes/night.tex")

-- Set secondary color effect
PostProcessor:SetColourCubeData(1, "images/colour_cubes/normal.tex", "images/colour_cubes/sepia.tex")
```

### PostProcessor:SetColourCubeLerp(index, lerp) {#setcolourcubelerp}

**Status:** `stable`

**Description:**
Sets the interpolation value for blending between color cube textures.

**Parameters:**
- `index` (number): Color cube index (0, 1, or 2)
- `lerp` (number): Interpolation value between 0.0 and 1.0

**Returns:**
- (void): No return value

**Example:**
```lua
-- Gradually transition from day to night
for i = 0, 100 do
    local lerp = i / 100
    PostProcessor:SetColourCubeLerp(0, lerp)
    Sleep(0.1)
end
```

### PostProcessor:SetOverlayTex(tex) {#setoverlaytex}

**Status:** `stable`

**Description:**
Sets the texture used for overlay effects in lunacy processing.

**Parameters:**
- `tex` (string): Path to overlay texture

**Example:**
```lua
PostProcessor:SetOverlayTex("images/overlays_lunacy.tex")
```

### PostProcessor:SetColourModifier(mod) {#setcolourmodifier}

**Status:** `stable`

**Description:**
Sets the intensity modifier for color effects.

**Parameters:**
- `mod` (number): Color intensity modifier (default: 1.0)

**Example:**
```lua
-- Increase color intensity
PostProcessor:SetColourModifier(1.2)

-- Desaturate colors
PostProcessor:SetColourModifier(0.8)
```

### PostProcessor:SetOverlayBlend(blend) {#setoverlayblend}

**Status:** `stable`

**Description:**
Sets the blend factor for overlay effects.

**Parameters:**
- `blend` (number): Blend factor for overlay mixing

**Example:**
```lua
PostProcessor:SetOverlayBlend(0.5)
```

## Bloom Effects

### PostProcessor:SetBloomEnabled(enabled) {#setbloomenabled}

**Status:** `stable`

**Description:**
Enables or disables the bloom post-processing effect.

**Parameters:**
- `enabled` (boolean): Whether to enable bloom effect

**Example:**
```lua
-- Enable bloom for magical effects
PostProcessor:SetBloomEnabled(true)

-- Disable bloom for performance
PostProcessor:SetBloomEnabled(false)
```

### PostProcessor:IsBloomEnabled() {#isbloomenabled}

**Status:** `stable`

**Description:**
Returns whether the bloom effect is currently enabled.

**Returns:**
- (boolean): True if bloom is enabled, false otherwise

**Example:**
```lua
if PostProcessor:IsBloomEnabled() then
    print("Bloom effect is active")
end
```

## Distortion Effects

### PostProcessor:SetDistortionEnabled(enabled) {#setdistortionenabled}

**Status:** `stable`

**Description:**
Enables or disables screen distortion effects. Also controls zoom blur when combined with lunacy.

**Parameters:**
- `enabled` (boolean): Whether to enable distortion effect

**Example:**
```lua
-- Enable distortion for nightmare effects
PostProcessor:SetDistortionEnabled(true)
```

### PostProcessor:IsDistortionEnabled() {#isdistortionenabled}

**Status:** `stable`

**Description:**
Returns whether the distortion effect is currently enabled.

**Returns:**
- (boolean): True if distortion is enabled, false otherwise

**Example:**
```lua
if PostProcessor:IsDistortionEnabled() then
    -- Apply additional nightmare effects
    PostProcessor:SetDistortionFactor(0.2)
end
```

### PostProcessor:SetDistortionEffectTime(time) {#setdistortioneffecttime}

**Status:** `stable`

**Description:**
Sets the time parameter for animated distortion effects.

**Parameters:**
- `time` (number): Time value for distortion animation

**Example:**
```lua
-- Animate distortion over time
local time = GetTime()
PostProcessor:SetDistortionEffectTime(time)
```

### PostProcessor:SetDistortionFactor(factor) {#setdistortionfactor}

**Status:** `stable`

**Description:**
Sets the intensity of the distortion effect.

**Parameters:**
- `factor` (number): Distortion intensity factor

**Example:**
```lua
-- Mild distortion
PostProcessor:SetDistortionFactor(0.05)

-- Strong distortion for dramatic effect
PostProcessor:SetDistortionFactor(0.2)
```

### PostProcessor:SetDistortionRadii(inner, outer) {#setdistortionradii}

**Status:** `stable`

**Description:**
Sets the inner and outer radii for radial distortion effects.

**Parameters:**
- `inner` (number): Inner radius of distortion
- `outer` (number): Outer radius of distortion

**Example:**
```lua
-- Create distortion around screen center
PostProcessor:SetDistortionRadii(100, 300)
```

### PostProcessor:SetDistortionFishEyeIntensity(intensity) {#setdistortionfisheyeintensity}

**Status:** `stable`

**Description:**
Sets the intensity of fish-eye lens distortion effect.

**Parameters:**
- `intensity` (number): Fish-eye effect intensity

**Example:**
```lua
PostProcessor:SetDistortionFishEyeIntensity(0.3)
```

### PostProcessor:SetDistortionFishEyeTime(time) {#setdistortionfisheyetime}

**Status:** `stable`

**Description:**
Sets the time parameter for animated fish-eye effects.

**Parameters:**
- `time` (number): Time value for fish-eye animation

**Example:**
```lua
PostProcessor:SetDistortionFishEyeTime(GetTime())
```

## Lunacy Effects

### PostProcessor:SetLunacyEnabled(enabled) {#setlunacyenabled}

**Status:** `stable`

**Description:**
Enables or disables lunacy visual effects. When combined with distortion, also controls zoom blur.

**Parameters:**
- `enabled` (boolean): Whether to enable lunacy effect

**Example:**
```lua
-- Enable lunacy for sanity loss effects
PostProcessor:SetLunacyEnabled(true)
```

### PostProcessor:SetLunacyIntensity(intensity) {#setlunacyintensity}

**Status:** `stable`

**Description:**
Sets the intensity of lunacy visual effects.

**Parameters:**
- `intensity` (number): Lunacy effect intensity

**Example:**
```lua
-- Set lunacy intensity based on sanity level
local sanity_percent = inst.components.sanity:GetPercent()
local lunacy_intensity = (1 - sanity_percent) * 0.5
PostProcessor:SetLunacyIntensity(lunacy_intensity)
```

### PostProcessor:SetZoomBlurEnabled(enabled) {#setzoomblurrenabled}

**Status:** `stable`

**Description:**
Enables or disables zoom blur effect. Note: Zoom blur is only enabled when both distortion and lunacy are active.

**Parameters:**
- `enabled` (boolean): Whether to enable zoom blur

**Example:**
```lua
-- This is automatically controlled by distortion and lunacy states
-- Direct calls are typically not needed
PostProcessor:SetZoomBlurEnabled(true)
```

## Moon Pulse Effects

### PostProcessor:SetMoonPulseParams(p1, p2, p3, p4) {#setmoonpulseparams}

**Status:** `stable`

**Description:**
Sets parameters for moon pulse visual effects.

**Parameters:**
- `p1` (number): First moon pulse parameter
- `p2` (number): Second moon pulse parameter
- `p3` (number): Third moon pulse parameter
- `p4` (number): Fourth moon pulse parameter

**Example:**
```lua
-- Configure moon pulse effect for full moon
PostProcessor:SetMoonPulseParams(1.0, 0.5, 2.0, 0.8)
```

### PostProcessor:SetMoonPulseGradingParams(p1, p2, p3, p4) {#setmoonpulsegradingparams}

**Status:** `stable`

**Description:**
Sets color grading parameters for moon pulse effects.

**Parameters:**
- `p1` (number): First grading parameter
- `p2` (number): Second grading parameter
- `p3` (number): Third grading parameter
- `p4` (number): Fourth grading parameter

**Example:**
```lua
-- Adjust color grading for moon phases
PostProcessor:SetMoonPulseGradingParams(0.9, 1.1, 0.8, 1.0)
```

## Shader Building Functions

### BuildColourCubeShader() {#buildcolourcubeshader}

**Status:** `stable`

**Description:**
Initializes the color cube shader system with texture samplers and uniform variables.

**Example:**
```lua
-- Called during initialization
BuildColourCubeShader()
```

### BuildBloomShader() {#buildbloomshader}

**Status:** `stable`

**Description:**
Builds the bloom effect shader with horizontal and vertical blur samplers.

**Example:**
```lua
-- Called during initialization
BuildBloomShader()
```

### BuildDistortShader() {#builddistortshader}

**Status:** `stable`

**Description:**
Creates the distortion effect shader with required uniform variables.

**Example:**
```lua
-- Called during initialization
BuildDistortShader()
```

### BuildLunacyShader() {#buildlunacyshader}

**Status:** `stable`

**Description:**
Builds the lunacy effect shader with overlay texture support.

**Example:**
```lua
-- Called during initialization
BuildLunacyShader()
```

### BuildZoomBlurShader() {#buildzoomblurshader}

**Status:** `stable`

**Description:**
Creates the zoom blur effect shader for combined distortion and lunacy effects.

**Example:**
```lua
-- Called during initialization
BuildZoomBlurShader()
```

### BuildMoonPulseShader() {#buildmoonpulseshader}

**Status:** `stable`

**Description:**
Builds the moon pulse effect shader system.

**Example:**
```lua
-- Called during initialization
BuildMoonPulseShader()
```

### BuildMoonPulseGradingShader() {#buildmoonpulsegradingshader}

**Status:** `stable`

**Description:**
Creates the moon pulse color grading shader.

**Example:**
```lua
-- Called during initialization
BuildMoonPulseGradingShader()
```

### BuildModShaders() {#buildmodshaders}

**Status:** `stable`

**Description:**
Executes mod-defined shader initialization functions through ModManager.

**Example:**
```lua
-- Called during initialization to allow mods to add custom shaders
BuildModShaders()
```

### SortAndEnableShaders() {#sortandenableshaders}

**Status:** `stable`

**Description:**
Sets the rendering order and enables post-processing effects. The current order is: ZoomBlur → Bloom → Distort → ColourCube (base) → Lunacy → MoonPulse → MoonPulseGrading.

**Example:**
```lua
-- Called during initialization to establish effect order
SortAndEnableShaders()
```

## Constants

### Effect Rendering Order

The post-processing effects are rendered in this order:
1. **ZoomBlur** - Applied first for background blur
2. **Bloom** - Light bloom effects
3. **Distort** - Screen distortion
4. **ColourCube** - Base color grading (always enabled)
5. **Lunacy** - Sanity-related visual effects
6. **MoonPulse** - Moon phase effects
7. **MoonPulseGrading** - Final color grading

## Dedicated Server Support

All PostProcessor methods have no-op implementations when running on dedicated servers to optimize performance since visual effects are not needed server-side.

```lua
-- On dedicated servers, these calls do nothing
if TheNet:IsDedicated() then
    -- All post-processing methods are empty functions
    PostProcessor:SetBloomEnabled(true) -- No effect on server
end
```

## Common Usage Patterns

### Sanity-Based Effects
```lua
-- Update visual effects based on player sanity
local function UpdateSanityEffects(inst)
    local sanity = inst.components.sanity
    if sanity then
        local sanity_percent = sanity:GetPercent()
        
        -- Enable lunacy effects when sanity is low
        if sanity_percent < 0.3 then
            PostProcessor:SetLunacyEnabled(true)
            PostProcessor:SetLunacyIntensity((1 - sanity_percent) * 0.8)
            
            -- Add distortion for very low sanity
            if sanity_percent < 0.15 then
                PostProcessor:SetDistortionEnabled(true)
                PostProcessor:SetDistortionFactor(0.1)
            end
        else
            PostProcessor:SetLunacyEnabled(false)
            PostProcessor:SetDistortionEnabled(false)
        end
    end
end
```

### Day/Night Cycle
```lua
-- Smooth day/night color transitions
local function UpdateDayNightColors(phase)
    if phase == "day" then
        PostProcessor:SetColourCubeData(0, "day.tex", "day.tex")
        PostProcessor:SetColourCubeLerp(0, 1.0)
    elseif phase == "dusk" then
        PostProcessor:SetColourCubeData(0, "day.tex", "night.tex")
        PostProcessor:SetColourCubeLerp(0, 0.5)
    elseif phase == "night" then
        PostProcessor:SetColourCubeData(0, "night.tex", "night.tex")
        PostProcessor:SetColourCubeLerp(0, 1.0)
    end
end
```

### Magical Effects
```lua
-- Enhance magical moments with bloom
local function ApplyMagicalEffects(intensity)
    PostProcessor:SetBloomEnabled(true)
    PostProcessor:SetColourModifier(1.0 + intensity * 0.3)
    
    -- Add subtle distortion for powerful magic
    if intensity > 0.7 then
        PostProcessor:SetDistortionEnabled(true)
        PostProcessor:SetDistortionFactor(intensity * 0.05)
    end
end
```

## Related Modules

- [Lighting](./lighting.md): Controls scene lighting that interacts with post-processing
- [Shaders](../util/shaders.md): Low-level shader management
- [Physics](./physics.md): Rendering system integration
