---
id: fx
title: FX (Visual Effects)
description: Visual effects system defining animation-based particle effects, sounds, and screen elements
sidebar_position: 2
slug: game-scripts/core-systems/fx
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# FX (Visual Effects)

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `FX` system provides a comprehensive collection of visual effects for Don't Starve Together. It defines animation-based particle effects, screen overlays, impact effects, transformation sequences, and environmental animations. Effects are defined as data tables with animation banks, builds, sounds, and custom initialization functions.

## Usage Example

```lua
-- Spawn a basic effect
local splash_fx = SpawnPrefab("splash")

-- Spawn effect at specific location
local x, y, z = inst.Transform:GetWorldPosition()
local puff_fx = SpawnPrefab("sand_puff")
puff_fx.Transform:SetPosition(x, y, z)

-- Effects with custom properties
local shock_fx = SpawnPrefab("shock_fx")
shock_fx.Transform:SetRotation(45) -- Many effects support rotation
```

## FX Definition Structure

Each effect in the `fx` table follows this structure:

```lua
{
    name = "effect_name",           -- Prefab name for spawning
    bank = "animation_bank",        -- Animation bank file
    build = "animation_build",      -- Animation build file  
    anim = "animation_name",        -- Animation to play
    sound = "sound/path",           -- Optional sound effect
    transform = Vector3(x, y, z),   -- Optional scale transform
    tint = Vector3(r, g, b),        -- Optional color tint
    tintalpha = 0.5,               -- Optional alpha transparency
    fn = CustomFunction,            -- Optional initialization function
    bloom = true,                   -- Optional bloom effect
    autorotate = true,             -- Optional auto-rotation
    -- Additional specialized properties...
}
```

## Core Helper Functions

### FinalOffset Functions

```lua
local function FinalOffset1(inst)
    inst.AnimState:SetFinalOffset(1)
end

local function FinalOffset2(inst) 
    inst.AnimState:SetFinalOffset(2)
end

local function FinalOffset3(inst)
    inst.AnimState:SetFinalOffset(3)
end
```

**Description:** Set the rendering layer offset for proper depth sorting.

### UsePointFiltering(inst) {#use-point-filtering}

**Status:** `stable`

**Description:**
Enables point filtering for pixelated/crisp rendering instead of smooth interpolation.

**Parameters:**
- `inst` (Entity): The effect entity instance

**Example:**
```lua
fn = UsePointFiltering
```

### GroundOrientation(inst) {#ground-orientation}

**Status:** `stable`

**Description:**
Sets the effect to render flat on the ground surface with appropriate layer settings.

**Parameters:**
- `inst` (Entity): The effect entity instance

**Example:**
```lua
fn = GroundOrientation
```

### Bloom(inst) {#bloom}

**Status:** `stable`

**Description:**
Applies bloom shader effect and sets final offset for glowing effects.

**Parameters:**
- `inst` (Entity): The effect entity instance

**Example:**
```lua
fn = Bloom
```

## Effect Categories

### Impact Effects

Effects that trigger on collision or interaction:

| Effect Name | Description | Sound | Usage |
|-------------|-------------|-------|-------|
| `splash` | Water splash effect | Bird splash | Water entry |
| `frogsplash` | Frog-specific splash | Frog splash | Frog jumping |
| `shock_fx` | Electric shock effect | Shock sound | Lightning damage |
| `mining_fx` | Rock mining debris | None | Mining rocks |
| `glass_fx` | Glass breaking effect | Sand to glass | Glass creation |

**Example:**
```lua
-- Spawn splash effect when entering water
local splash = SpawnPrefab("splash")
splash.Transform:SetPosition(x, y, z)
```

### Transformation Effects

Effects for character or object transformations:

| Effect Name | Description | Duration | Special Properties |
|-------------|-------------|----------|-------------------|
| `werebeaver_transform_fx` | Woodie beaver form | ~2 seconds | Death poof sound |
| `weremoose_transform_fx` | Woodie moose form | ~1.5 seconds | Multiple stages |
| `beefalo_transform_fx` | Beefalo domestication | ~1 second | Final offset |
| `attune_in_fx` | Portal attunement in | ~1 second | Ghost haunt sound |
| `attune_out_fx` | Portal attunement out | ~1 second | Ghost haunt sound |

**Example:**
```lua
-- Trigger transformation effect
local transform_fx = SpawnPrefab("werebeaver_transform_fx")
transform_fx.Transform:SetPosition(player.Transform:GetWorldPosition())
```

### Particle Effects

Environmental and atmospheric effects:

| Effect Name | Type | Properties |
|-------------|------|------------|
| `sand_puff` | Dust cloud | Deathpoof sound |
| `small_puff` | Small smoke | Smoke animation |
| `shadow_puff` | Dark particle | Black tint, 50% alpha |
| `dirt_puff` | Soil particles | Final offset 1 |
| `emote_fx` | Emote particles | Auto-rotate, final offset |

**Example:**
```lua
-- Create dust effect when digging
local dust = SpawnPrefab("sand_puff")
dust.Transform:SetPosition(x, y, z)
```

### Combat Effects

Effects related to combat and damage:

| Effect Name | Purpose | Visual Style |
|-------------|---------|--------------|
| `groundpound_fx` | Ground slam impact | Dust cloud with sound |
| `firesplash_fx` | Fire damage burst | Bloom effect |
| `shadowstrike_slash_fx` | Shadow weapon attack | Eight-faced scaling |
| `minotaur_blood1/2/3` | Blood splatter | Semi-transparent red |

**Example:**
```lua
-- Add combat impact effect
local impact = SpawnPrefab("groundpound_fx")
impact.Transform:SetPosition(target.Transform:GetWorldPosition())
```

### Weather and Environmental Effects

Effects for weather and environmental changes:

| Effect Name | Environment | Properties |
|-------------|-------------|------------|
| `splash_snow_fx` | Winter/Snow | Fire suppresser impact sound |
| `green_leaves_chop` | Forest/Trees | Leaf rustle sound |
| `oceantree_leaf_fx_fall` | Ocean/Islands | Falling animation with physics |
| `halloween_firepuff_1/2/3` | Seasonal | Bloom with fire sound |

### Character-Specific Effects

Effects tied to specific characters:

#### Wendy/Abigail Effects
```lua
"ghostlyelixir_slowregen_fx"     -- Abigail regeneration buff
"ghostlyelixir_attack_fx"        -- Abigail attack buff  
"ghostlyelixir_shield_fx"        -- Abigail shield buff
"abigail_attack_shadow_fx"       -- Shadow attack ground effect
```

#### Wanda Time Effects
```lua
"oldager_become_younger_front_fx" -- Age reversal effect
"oldager_become_older_fx"         -- Aging effect
"pocketwatch_heal_fx"             -- Pocket watch healing
```

#### Wolfgang Effects
```lua
"wolfgang_mighty_fx"             -- Mighty form transformation
```

#### Wortox Effects
```lua
"wortox_soul_spawn_fx"           -- Soul spawning
"wortox_teleport_reviver_top"    -- Teleport revival effect
```

## Dynamic Effect Generation

The system dynamically generates effects for certain categories:

### Crater Steam Effects
```lua
-- Generates crater_steam_fx1 through crater_steam_fx4
for cratersteamindex = 1, 4 do
    table.insert(fx, {
        name = "crater_steam_fx"..cratersteamindex,
        bank = "crater_steam",
        build = "crater_steam", 
        anim = "steam"..cratersteamindex,
        fn = FinalOffset1,
    })
end
```

### Slingshot Ammo Hit Effects
```lua
-- Generates hit effects for different ammo types
local SHOT_TYPES = {
    "rock", "gold", "marble", "thulecite", "honey",
    "freeze", "slow", "poop", "moonglass", "dreadstone",
    "gunpowder", "lunarplanthusk", "purebrilliance"
}

-- Creates slingshotammo_hitfx_[type] for each type
```

### Shadow Shield Effects
```lua
-- Generates shadow_shield1 through shadow_shield6
-- with mirrored versions for different orientations
```

## Effect Properties Reference

### Common Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | string | Prefab name for spawning |
| `bank` | string | Animation bank file |
| `build` | string | Animation build file |
| `anim` | string/function | Animation name or function returning name |
| `sound` | string | Sound effect path |
| `sounddelay` | number | Delay before playing sound |

### Transform Properties

| Property | Type | Description |
|----------|------|-------------|
| `transform` | Vector3 | Scale transformation |
| `autorotate` | boolean | Enable automatic rotation |
| `eightfaced` | boolean | Eight-directional facing |
| `fourfaced` | boolean | Four-directional facing |
| `twofaced` | boolean | Two-directional facing |
| `sixfaced` | boolean | Six-directional facing |
| `nofaced` | boolean | No directional facing |

### Visual Properties

| Property | Type | Description |
|----------|------|-------------|
| `tint` | Vector3 | RGB color tint (0-1) |
| `tintalpha` | number | Alpha transparency (0-1) |
| `bloom` | boolean | Enable bloom shader effect |
| `fn` | function | Custom initialization function |

### Animation Properties

| Property | Type | Description |
|----------|------|-------------|
| `animqueue` | boolean | Queue multiple animations |
| `update_while_paused` | boolean | Update during pause |

## Creating Custom Effects

### Basic Custom Effect

```lua
local custom_fx = {
    name = "my_custom_effect",
    bank = "my_fx_bank",
    build = "my_fx_build", 
    anim = "my_animation",
    sound = "my_mod/effects/custom_sound",
    fn = function(inst)
        inst.AnimState:SetFinalOffset(1)
        inst.AnimState:SetScale(1.5, 1.5, 1.5)
    end
}

table.insert(fx, custom_fx)
```

### Advanced Custom Effect with Physics

```lua
local advanced_fx = {
    name = "falling_leaf_custom",
    bank = "leaf_fx",
    build = "leaf_fx",
    anim = "fall",
    fn = function(inst)
        local scale = 1 + 0.3 * math.random()
        inst.Transform:SetScale(scale, scale, scale)
        
        -- Add falling physics
        inst.fall_speed = 2.0 + 1.5 * math.random()
        inst:DoPeriodicTask(FRAMES, function(inst)
            local x, y, z = inst.Transform:GetWorldPosition()
            inst.Transform:SetPosition(x, y - inst.fall_speed * FRAMES, z)
        end)
    end
}
```

## Performance Considerations

- Effects are temporary entities that clean up automatically
- Use appropriate final offsets to avoid rendering conflicts
- Large-scale effects should use efficient animation techniques
- Sound effects should be optimized for multiple simultaneous plays

## Related Modules

- [Prefabs](./prefabs.md): Effect entities are created as prefabs
- [EntityScript](./entityscript.md): Base entity functionality for effects
- [AnimState](../components/animstate.md): Animation rendering system
- [SoundEmitter](../components/soundemitter.md): Audio playback for effects
- [Transform](../components/transform.md): Positioning and scaling effects
