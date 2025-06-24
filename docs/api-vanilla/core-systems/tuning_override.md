---
id: tuning-override
title: Tuning Override
description: System for overriding and disabling specific game mechanics and events through dummy function replacements
sidebar_position: 171
slug: api-vanilla/core-systems/tuning-override
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Tuning Override

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `tuning_override` module provides a system for selectively disabling or overriding specific game mechanics, events, and world features. It returns a table of override functions that can replace default game behaviors, primarily used for testing, debugging, or creating specialized game modes where certain mechanics need to be disabled.

## Usage Example

```lua
-- Access the tuning override table
local overrides = require("tuning_override")

-- Apply override to disable hound attacks
local original_hounds = some_hounds_function
some_hounds_function = overrides.hounds  -- Now does nothing

-- Check if override is a dummy function
if overrides.deerclops == dummyfn then
    print("Deerclops events are disabled")
end
```

## Module Structure

### Return Table

**Type:** `table`

**Status:** `stable`

**Description:** The module returns a table mapping game mechanic names to their override functions. Most overrides use a dummy function that performs no operations, effectively disabling the associated mechanics.

**Structure:**
```lua
{
    [mechanic_name] = function_override,
    [event_name] = function_override,
    [system_name] = function_override
}
```

## Override Categories

### Creature Events

These overrides control various creature-related events and spawning mechanics:

#### hounds

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables hound attack events and related mechanics.

**Example:**
```lua
-- Disable hound attacks
local overrides = require("tuning_override")
HoundAttackManager.StartAttack = overrides.hounds
```

#### wormattacks

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables worm attack events in caves.

#### deerclops

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables Deerclops boss spawning and related events.

#### bearger

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables Bearger boss spawning and mechanics.

#### goosemoose

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables Goose/Moose boss spawning and behaviors.

#### dragonfly

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables Dragonfly boss mechanics and events.

#### krampus

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables Krampus spawning mechanics.

#### deciduousmonster

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables Treeguard spawning from chopping trees.

#### liefs

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables Treeguard (Leif) related mechanics.

### Environmental Events

#### antliontribute

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables Antlion tribute mechanics and events.

#### disease_delay

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables disease spread delay mechanisms.

#### wildfires

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables wildfire events and spread mechanics.

#### earthquakes

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables earthquake events.

#### meteorshowers

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables meteor shower events.

#### waves

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables ocean wave mechanics.

#### petrification

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables petrification effects and mechanics.

### Wildlife and Spawning

#### perd

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables Perd (turkey) spawning and behaviors.

#### hunt

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables hunting events and mechanics.

#### alternatehunt

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables alternative hunting mechanics.

#### butterfly

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables butterfly spawning and behaviors.

#### birds

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables bird spawning mechanics.

#### penguins

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables penguin spawning in winter.

#### beefaloheat

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables beefalo heat/mating mechanics.

### Environment and Vegetation

#### flowers

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables flower spawning and growth.

#### flower_cave

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables cave flower mechanics.

#### lureplants

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables lureplant spawning and growth.

#### rock_ice

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables ice rock formation mechanics.

#### regrowth

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables plant and resource regrowth.

### Weather and Seasons

#### day

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables day cycle events.

#### autumn

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables autumn season mechanics.

#### winter

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables winter season mechanics.

#### spring

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables spring season mechanics.

#### summer

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables summer season mechanics.

#### season_start

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables season start events.

#### weather

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables weather change mechanics.

#### lightning

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables lightning strike events.

#### frograin

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables frog rain events in spring.

### Ambience and Visual Effects

#### creepyeyes

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables creepy eyes ambient effects.

#### areaambient

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables area-specific ambient effects.

#### areaambientdefault

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables default area ambient mechanics.

#### colourcube

**Status:** `stable`

**Override Function:** `dummyfn`

**Description:** Disables color cube visual effects.

## Helper Function

### dummyfn

**Type:** `function`

**Status:** `stable`

**Description:** A placeholder function that performs no operations. Used as the default override for most mechanics to effectively disable them.

**Definition:**
```lua
local dummyfn = function() end
```

**Example:**
```lua
-- Check if a mechanic is disabled
local overrides = require("tuning_override")
if overrides.hounds == dummyfn then
    print("Hound attacks are disabled")
end
```

## Common Usage Patterns

### Testing Environment Setup

```lua
local tuning_overrides = require("tuning_override")

-- Disable all hostile events for peaceful testing
function SetupPeacefulMode()
    -- Disable boss spawns
    BossSpawnManager.SpawnDeerclops = tuning_overrides.deerclops
    BossSpawnManager.SpawnBearger = tuning_overrides.bearger
    BossSpawnManager.SpawnGoose = tuning_overrides.goosemoose
    
    -- Disable hostile events
    HoundAttackManager.StartAttack = tuning_overrides.hounds
    EarthquakeManager.StartQuake = tuning_overrides.earthquakes
    
    -- Disable environmental hazards
    WildfireManager.StartFire = tuning_overrides.wildfires
    LightningManager.Strike = tuning_overrides.lightning
end
```

### Selective Mechanic Disabling

```lua
function CreateCustomGameMode()
    local overrides = require("tuning_override")
    
    -- Keep seasons but disable weather events
    WeatherManager.SetWeather = overrides.weather
    WeatherManager.StartRain = overrides.frograin
    
    -- Keep wildlife but disable aggressive spawns
    SpawnManager.SpawnHounds = overrides.hounds
    SpawnManager.SpawnKrampus = overrides.krampus
    
    -- Allow growth but disable regrowth
    GrowthManager.Regrow = overrides.regrowth
end
```

### Debug Mode Implementation

```lua
function EnableDebugMode()
    local overrides = require("tuning_override")
    
    -- Store original functions for restoration
    local original_functions = {}
    
    -- Disable disruptive events during debugging
    local debug_overrides = {
        "earthquakes", "wildfires", "meteorshowers",
        "hounds", "deerclops", "bearger"
    }
    
    for _, override_name in ipairs(debug_overrides) do
        original_functions[override_name] = _G[override_name]
        _G[override_name] = overrides[override_name]
    end
    
    return original_functions  -- For later restoration
end
```

### Conditional Override Application

```lua
function ApplyDifficultyOverrides(difficulty_level)
    local overrides = require("tuning_override")
    
    if difficulty_level == "peaceful" then
        -- Disable all hostile mechanics
        return {
            hounds = overrides.hounds,
            krampus = overrides.krampus,
            deerclops = overrides.deerclops,
            wildfires = overrides.wildfires
        }
    elseif difficulty_level == "casual" then
        -- Disable only the most disruptive events
        return {
            earthquakes = overrides.earthquakes,
            meteorshowers = overrides.meteorshowers
        }
    end
    
    return {}  -- No overrides for normal/hard difficulty
end
```

## Integration Notes

### Relationship to Tuning System

The tuning override system works alongside the main [Tuning System](./tuning.md):

- **Tuning**: Controls numeric values and balance parameters
- **Tuning Override**: Controls function behavior and feature availability
- Both systems can be used together for comprehensive game customization

### Performance Considerations

- Dummy function calls have minimal performance impact
- Override functions are called instead of original functions, not in addition
- Memory usage is minimal since most overrides share the same dummy function
- No cleanup required as overrides simply replace function references

### Testing and Development Benefits

The override system provides several advantages for development:

- **Isolated Testing**: Disable specific mechanics to test others in isolation
- **Debug Sessions**: Prevent disruptive events during debugging
- **Performance Testing**: Disable expensive systems to measure impact
- **Feature Validation**: Test new features without interference from existing systems

## Related Modules

- [Tuning](./tuning.md): Main game balance and configuration system
- [Constants](./constants.md): Game constants and non-tunable values
- [Debug Tools](./debugtools.md): Development and testing utilities
- [World Settings](./worldsettings.md): Player-configurable world options

## Source Reference

**File Location:** `scripts/tuning_override.lua`

**Module Type:** Function override table

**Global Access:** Accessed via `require("tuning_override")`

**Dependencies:** None (standalone module)
