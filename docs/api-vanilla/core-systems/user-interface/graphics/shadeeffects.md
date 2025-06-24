---
id: shadeeffects
title: Shade Effects
description: Visual shade rendering system for environmental lighting effects and canopy shadows
sidebar_position: 6
slug: /api-vanilla/core-systems/shadeeffects
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Shade Effects

## Version History
| Build Version | Change Date | Change Type | Description |
|---------------|-------------|-------------|-------------|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `ShadeEffects` module provides visual shade rendering functionality for environmental lighting effects, particularly tree canopy shadows. This system creates dynamic shade effects that respond to ambient lighting conditions and provides realistic shadowing for enhanced visual atmosphere.

## Dedicated Server Handling

**Status:** `stable`

**Description:**
The module automatically disables all shade functionality on dedicated servers to optimize performance, as visual effects are not needed on headless servers.

**Implementation:**
```lua
-- Dedicated server check
if TheNet:IsDedicated() then
    local nullfunc = function() end
    ShadeEffectUpdate = nullfunc
    SpawnLeafCanopy = nullfunc
    DespawnLeafCanopy = nullfunc
    EnableShadeRenderer = nullfunc
    return
end
```

## Shade Types

### ShadeTypes.LeafCanopy

**Status:** `stable`

**Description:**
Primary shade type for rendering tree canopy shadows with dynamic movement and lighting response.

**Configuration:**
```lua
-- Shade type creation and configuration
ShadeTypes.LeafCanopy = ShadeRenderer:CreateShadeType()

-- Rotation settings
ShadeRenderer:SetShadeMaxRotation(ShadeTypes.LeafCanopy, TUNING.CANOPY_MAX_ROTATION)
ShadeRenderer:SetShadeRotationSpeed(ShadeTypes.LeafCanopy, TUNING.CANOPY_ROTATION_SPEED)

-- Translation settings
ShadeRenderer:SetShadeMaxTranslation(ShadeTypes.LeafCanopy, TUNING.CANOPY_MAX_TRANSLATION)
ShadeRenderer:SetShadeTranslationSpeed(ShadeTypes.LeafCanopy, TUNING.CANOPY_TRANSLATION_SPEED)

-- Texture assignment
ShadeRenderer:SetShadeTexture(ShadeTypes.LeafCanopy, "images/tree.tex")
```

## Core Functions

### SpawnLeafCanopy(x, z) {#spawn-leaf-canopy}

**Status:** `stable`

**Description:**
Creates a new leaf canopy shade effect at the specified world coordinates with randomized rotation and configured scale.

**Parameters:**
- `x` (number): World X coordinate for shade placement
- `z` (number): World Z coordinate for shade placement

**Returns:**
- (number): Shade ID for managing the created shade effect

**Example:**
```lua
-- Spawn a canopy shade at specific coordinates
local shade_id = SpawnLeafCanopy(10, 15)

-- Spawn multiple canopy shades for a forest area
local forest_shades = {}
for i = 1, 5 do
    local x = math.random(-20, 20)
    local z = math.random(-20, 20)
    table.insert(forest_shades, SpawnLeafCanopy(x, z))
end
```

**Technical Details:**
- Uses `TUNING.CANOPY_SCALE` for consistent sizing
- Applies random rotation (0-360 degrees) for natural variation
- Returns unique ID for shade management

### DespawnLeafCanopy(id) {#despawn-leaf-canopy}

**Status:** `stable`

**Description:**
Removes a specific leaf canopy shade effect using its unique identifier.

**Parameters:**
- `id` (number): Shade ID returned from `SpawnLeafCanopy`

**Returns:**
None

**Example:**
```lua
-- Spawn and later remove a shade
local shade_id = SpawnLeafCanopy(5, 10)

-- Remove the shade when no longer needed
DespawnLeafCanopy(shade_id)

-- Remove multiple shades
local shade_ids = {1001, 1002, 1003}
for _, id in ipairs(shade_ids) do
    DespawnLeafCanopy(id)
end
```

### ShadeEffectUpdate(dt) {#shade-effect-update}

**Status:** `stable`

**Description:**
Updates shade rendering system each frame, adjusting shade strength based on ambient lighting conditions and processing shade animations.

**Parameters:**
- `dt` (number): Delta time since last update in seconds

**Returns:**
None

**Example:**
```lua
-- This function is typically called by the game's main update loop
-- Manual usage in custom update systems:
local function CustomEnvironmentUpdate(dt)
    -- Update shade effects
    ShadeEffectUpdate(dt)
    
    -- Other environment updates
    UpdateWeatherEffects(dt)
    UpdateTimeOfDay(dt)
end
```

**Technical Implementation:**
```lua
function ShadeEffectUpdate(dt)
    local r, g, b = TheSim:GetAmbientColour()
    
    -- Calculate shade strength based on ambient lighting
    local light_intensity = ((r + g + b) / 3) / 255
    local shade_strength = Lerp(TUNING.CANOPY_MIN_STRENGTH, 
                               TUNING.CANOPY_MAX_STRENGTH, 
                               light_intensity)
    
    ShadeRenderer:SetShadeStrength(ShadeTypes.LeafCanopy, shade_strength)
    ShadeRenderer:Update(dt)
end
```

### EnableShadeRenderer(enable) {#enable-shade-renderer}

**Status:** `stable`

**Description:**
Enables or disables the entire shade rendering system for performance control or visual preference settings.

**Parameters:**
- `enable` (boolean): `true` to enable shade rendering, `false` to disable

**Returns:**
None

**Example:**
```lua
-- Enable shade rendering
EnableShadeRenderer(true)

-- Disable shade rendering for performance
EnableShadeRenderer(false)

-- Toggle based on graphics settings
local graphics_quality = Profile:GetGraphicsQuality()
if graphics_quality == "high" then
    EnableShadeRenderer(true)
else
    EnableShadeRenderer(false)
end
```

## Tuning Constants

### Canopy Rotation Settings

- `TUNING.CANOPY_MAX_ROTATION`: Maximum rotation angle for shade movement
- `TUNING.CANOPY_ROTATION_SPEED`: Speed of rotational animation

### Canopy Translation Settings

- `TUNING.CANOPY_MAX_TRANSLATION`: Maximum translation distance for shade movement
- `TUNING.CANOPY_TRANSLATION_SPEED`: Speed of translational movement

### Canopy Strength Settings

- `TUNING.CANOPY_MIN_STRENGTH`: Minimum shade opacity in bright conditions
- `TUNING.CANOPY_MAX_STRENGTH`: Maximum shade opacity in dark conditions

### Canopy Scale Settings

- `TUNING.CANOPY_SCALE`: Default scale factor for canopy shade size

## Usage Patterns

### Basic Shade Management

```lua
-- Create shade effects for a tree
local function CreateTreeShades(tree_inst)
    local x, y, z = tree_inst.Transform:GetWorldPosition()
    
    -- Create main canopy shade
    local shade_id = SpawnLeafCanopy(x, z)
    
    -- Store shade ID for cleanup
    tree_inst.shade_id = shade_id
    
    -- Remove shade when tree is removed
    tree_inst:ListenForEvent("onremove", function()
        if tree_inst.shade_id then
            DespawnLeafCanopy(tree_inst.shade_id)
        end
    end)
end
```

### Environmental Integration

```lua
-- Integrate shade effects with day/night cycle
local function UpdateEnvironmentalShades(dt)
    -- Update shade effects based on time and weather
    ShadeEffectUpdate(dt)
    
    -- Adjust shader parameters based on weather
    if TheWorld.state.israining then
        -- Increase shade strength during rain
        ShadeRenderer:SetShadeStrength(ShadeTypes.LeafCanopy, 
                                     TUNING.CANOPY_MAX_STRENGTH * 1.2)
    end
end
```

### Performance-Aware Shade Control

```lua
-- Control shade rendering based on performance settings
local function ApplyGraphicsSettings()
    local settings = Profile:GetGraphicsSettings()
    
    if settings.shade_quality == "disabled" then
        EnableShadeRenderer(false)
    elseif settings.shade_quality == "low" then
        EnableShadeRenderer(true)
        -- Reduce shade count or quality
    else
        EnableShadeRenderer(true)
        -- Full quality shade rendering
    end
end
```

## Integration Points

### TheNet Integration

The module checks server type for optimization:

```lua
-- Dedicated server detection
if TheNet:IsDedicated() then
    -- Disable all shade functionality
end
```

### TheSim Integration

Uses simulation services for ambient lighting:

```lua
-- Get ambient color for dynamic strength calculation
local r, g, b = TheSim:GetAmbientColour()
```

### ShadeRenderer Integration

Core rendering system interface:

```lua
-- Shade type management
ShadeRenderer:CreateShadeType()
ShadeRenderer:SetShadeTexture()
ShadeRenderer:SpawnShade()
ShadeRenderer:RemoveShade()
ShadeRenderer:Update()
```

## Technical Notes

### Performance Considerations

- Automatically disabled on dedicated servers
- Shade strength calculated based on ambient lighting reduces GPU load
- Dynamic enable/disable support for performance scaling

### Visual Quality Features

- Random rotation for natural variation
- Dynamic strength adjustment based on lighting
- Smooth animation updates via delta time

### Resource Management

- Unique ID system for proper shade lifecycle management
- Automatic cleanup support through despawn functions
- Integration with game object lifecycle

## Related Modules

- [TUNING](../core-systems/index.md#tuning): Configuration constants for shade parameters
- [Profile](./playerprofile.md): Graphics settings and performance preferences
- [TheNet](../core-systems/index.md#thenet): Network and server type detection
- [TheSim](../core-systems/index.md#thesim): Simulation services and ambient lighting
