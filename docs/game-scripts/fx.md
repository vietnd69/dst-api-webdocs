---
id: fx
title: Fx
description: Defines local helper functions for animation state manipulation and a comprehensive fx table containing visual effect configurations for Don't Starve Together, including splash effects, transformation effects, buff effects, environmental FX, turf effects, wagpunk, slingshot, and WX78 shield animations.
tags: [fx, animation, visual, effects, configuration]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: data_config
source_hash: e238fe97
system_scope: fx
---

# Fx

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`fx.lua` is a data configuration file that defines a comprehensive table of visual effect configurations and local helper functions for animation state manipulation in Don't Starve Together. The file contains effect definitions for splash effects, transformation effects, buff effects, environmental FX, turf effects, wagpunk, slingshot, and WX78 shield animations. Helper functions configure animation state properties such as final offset, bloom effects, orientation, and layer settings. This file is required by other systems that need to spawn or configure visual effects on entities.

## Usage example
```lua
local fx = require("fx")

-- Access a specific effect configuration from the fx table
local splash_fx = fx.splash

-- Apply a helper function to configure an entity's animation state
local effect_entity = SpawnPrefab("fx_splash")
if effect_entity ~= nil then
    fx.FinalOffset1(effect_entity)
    fx.Bloom(effect_entity)
    fx.GroundOrientation(effect_entity)
end

-- Use WX78 shield effect functions
fx.Wx78ShieldFn(effect_entity)
```

## Dependencies & tags
**External dependencies:**
- `FRAMES` -- Animation frame constant used in timing calculations and position updates
- `TUNING` -- Accesses TUNING.OCEAN_SHADER.EFFECT_TINT_AMOUNT for ocean blend parameters
- `STRINGS` -- Accesses STRINGS.NAMES.MOLE_UNDERGROUND for mole effect name override
- `Vector3` -- Creates color tint and transform scale vectors for effects
- `ANIM_ORIENTATION` -- Sets animation orientation to OnGround for ground-level effects
- `LAYER_BACKGROUND` -- Sets animation layer for background rendering
- `LAYER_WORLD_BACKGROUND` -- Sets animation layer for world background rendering
- `LAYER_BELOW_GROUND` -- Sets animation layer for below-ground rendering
- `ANIM_SORT_ORDER` -- Sets animation sort order for proper rendering depth
- `ANIM_SORT_ORDER_BELOW_GROUND` -- Sets animation sort order for below-ground elements like boat trails
- `GetString` -- Retrieves localized description strings for mole underground effect
- `LAYER_GROUND` -- Animation layering
- `FinalOffset1` -- Referenced as fn callback
- `FinalOffset2` -- Referenced as fn callback
- `FinalOffset3` -- Referenced as fn callback
- `ErodeAway` -- Called in degrade_fx_ice fn
- `GetRandomWithVariance` -- Called in degrade_fx_ice fn

**Components used:**
- `AnimState` -- SetScale, SetMultColour, SetFinalOffset, PlayAnimation, SetOrientation, SetLayer, SetSortOrder, SetBloomEffectHandle, SetLightOverride, Hide, OverrideSymbol, SetFrame, SetAddColour, SetSymbolBloom, SetSymbolLightOverride
- `Transform` -- SetFourFaced, SetScale, SetPosition, GetWorldPosition
- `SoundEmitter` -- PlaySound, PlaySoundWithParams, KillSound
- `entity` -- AddSoundEmitter, GetParent, SetParent

**Tags:**
None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SHOT_TYPES` | table | `{}` | Table defining available shot types for the weapon. |
| `SPECIFIC_HITFX_ANIM` | table | `{}` | Table mapping hit effects to specific animations. |
| `FX_SIZES` | table | `{"tiny", "small", "med", "large"}` | Valid size identifiers for visual effects. |
| `FX_HEIGHTS` | table | `{"_low", "", "_high"}` | Valid height identifiers for visual effects (empty string = medium). |
| `WX_SHIELD_COLOUR` | table | `{243/255, 187/255, 6/255}` | RGB color values for WX-78 shield effect. |
| `DELAY_SHIELDFX_SET_NO_PARENT` | number | `11 * FRAMES` | Frame delay before shield effect clears parent reference. |
## Main functions
## Events & listeners
None.
