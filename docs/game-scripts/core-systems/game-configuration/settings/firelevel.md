---
id: firelevel
title: Fire Level
description: Class for defining fire intensity levels with fuel consumption, visual effects, and heat spreading properties
sidebar_position: 10

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Fire Level

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `FireLevel` class defines different intensity levels for fire entities in Don't Starve Together. Each fire level specifies fuel consumption rates, visual properties, heat distribution, and fire spreading behavior. This system allows for graduated fire intensity that changes based on available fuel.

## Usage Example

```lua
-- Create a low-intensity fire level
local small_fire = FireLevel(
    "small",                    -- name
    "Small flickering flame",   -- description
    0,                         -- minFuel
    20,                        -- maxFuel
    4,                         -- burnRate (seconds)
    0.5,                       -- intensity
    {1, 0.8, 0.6},            -- colour (RGB)
    2,                         -- heat distance
    8                          -- spreadrate (seconds)
)

-- Create a high-intensity fire level
local raging_fire = FireLevel(
    "raging",
    "Intense roaring flame",
    80,
    100,
    1,
    2.0,
    {1, 0.4, 0.1},
    8,
    2
)
```

## Class Definition

### FireLevel(name, desc, minFuel, maxFuel, burnRate, intensity, colour, heat, spreadrate)

**Status:** `stable`

**Description:**
Constructor for creating a new fire level configuration that defines the behavior and appearance of fire at specific fuel ranges.

**Parameters:**
- `name` (string): Unique identifier for this fire level
- `desc` (string): Human-readable description of the fire level
- `minFuel` (number): Minimum fuel amount for this fire level
- `maxFuel` (number): Maximum fuel amount for this fire level
- `burnRate` (number): Time in seconds between fuel consumption updates
- `intensity` (number): Light intensity multiplier for the flame
- `colour` (table): RGB color values for the flame light (array of 3 numbers)
- `heat` (number): Distance in tiles that fire can spread
- `spreadrate` (number): Time in seconds between fire spread attempts

**Returns:**
- (FireLevel): New FireLevel instance with configured properties

**Example:**
```lua
-- Medium fire level for campfires
local medium_fire = FireLevel(
    "medium",                   -- Identifier
    "Steady burning flame",     -- Description
    30,                        -- Active when fuel >= 30
    70,                        -- Active when fuel <= 70
    2,                         -- Consume fuel every 2 seconds
    1.2,                       -- 120% light intensity
    {1.0, 0.7, 0.3},          -- Orange flame color
    4,                         -- Can spread 4 tiles
    5                          -- Attempt spread every 5 seconds
)
```

## Properties

### name

**Type:** `string`

**Description:** Unique identifier for the fire level, used for referencing and debugging.

### desc

**Type:** `string`

**Description:** Human-readable description of the fire level for tooltips or debugging.

### minFuel

**Type:** `number`

**Description:** Minimum fuel amount required for this fire level to be active. When fuel drops below this value, the fire transitions to a lower intensity level.

### maxFuel

**Type:** `number`

**Description:** Maximum fuel amount at which this fire level remains active. When fuel exceeds this value, the fire transitions to a higher intensity level.

### burnRate

**Type:** `number`

**Description:** Time interval in seconds between fuel consumption updates. Lower values mean faster fuel consumption and more frequent updates.

### intensity

**Type:** `number`

**Description:** Light intensity multiplier for the flame. Higher values create brighter illumination around the fire.

### colour

**Type:** `table`

**Description:** RGB color array defining the flame's light color. Values typically range from 0.0 to 1.0 for each color component.

**Format:**
```lua
colour = {red, green, blue}  -- Each value 0.0-1.0
```

### heat

**Type:** `number`

**Description:** Maximum distance in tiles that the fire can spread to adjacent flammable objects.

### spreadrate

**Type:** `number`

**Description:** Time interval in seconds between fire spread attempts. Lower values make fire spread more aggressively.

## Fire Level Examples

### Low Intensity Fire

```lua
local ember = FireLevel(
    "ember",
    "Glowing embers",
    0,      -- minFuel: starts immediately
    15,     -- maxFuel: transitions at 15 fuel
    6,      -- burnRate: slow consumption
    0.3,    -- intensity: dim light
    {1, 0.5, 0.2},  -- colour: deep orange
    1,      -- heat: minimal spread
    15      -- spreadrate: slow spread
)
```

### Medium Intensity Fire

```lua
local steady_flame = FireLevel(
    "steady",
    "Steady flame",
    15,     -- minFuel: active after ember level
    60,     -- maxFuel: most common range
    3,      -- burnRate: moderate consumption
    1.0,    -- intensity: normal brightness
    {1, 0.7, 0.4},  -- colour: warm orange
    3,      -- heat: moderate spread
    8       -- spreadrate: regular spread
)
```

### High Intensity Fire

```lua
local inferno = FireLevel(
    "inferno",
    "Raging inferno",
    60,     -- minFuel: requires substantial fuel
    999,    -- maxFuel: no upper limit
    1,      -- burnRate: rapid consumption
    3.0,    -- intensity: very bright
    {1, 0.3, 0.1},  -- colour: intense red-orange
    6,      -- heat: long-range spread
    3       -- spreadrate: aggressive spread
)
```

## Common Usage Patterns

### Fire Progression System

```lua
-- Define complete fire progression from ember to inferno
local fire_levels = {
    FireLevel("dying", "Dying embers", 0, 5, 8, 0.2, {0.8, 0.3, 0.1}, 0, 20),
    FireLevel("small", "Small flame", 5, 25, 4, 0.6, {1, 0.6, 0.3}, 2, 12),
    FireLevel("normal", "Normal fire", 25, 75, 2, 1.2, {1, 0.7, 0.4}, 4, 8),
    FireLevel("large", "Large fire", 75, 150, 1.5, 2.0, {1, 0.5, 0.2}, 6, 5),
    FireLevel("massive", "Massive blaze", 150, 999, 1, 3.5, {1, 0.4, 0.1}, 8, 2)
}
```

### Specialized Fire Types

```lua
-- Magical fire with unique properties
local magical_fire = FireLevel(
    "magical",
    "Mystical flame",
    10, 50, 3, 1.5,
    {0.3, 0.7, 1.0},  -- Blue magical flame
    2, 15               -- Slow spread, magical effect
)

-- Emergency beacon fire
local beacon_fire = FireLevel(
    "beacon",
    "Signal beacon",
    20, 100, 5, 4.0,
    {1, 1, 0.8},      -- Bright white light
    1, 999            -- No spreading (safe beacon)
)
```

## Integration with Fire Systems

Fire levels are typically used by fire-related components and systems:

```lua
-- Example usage in a fire component
local function UpdateFireLevel(self)
    local current_fuel = self.fuel
    
    for _, level in ipairs(self.fire_levels) do
        if current_fuel >= level.minFuel and current_fuel <= level.maxFuel then
            self:SetCurrentLevel(level)
            break
        end
    end
end
```

## Related Modules

- [Components/Burnable](../components/burnable.md): Uses fire levels for combustible objects
- [Components/Fueled](../components/fueled.md): Manages fuel consumption with fire levels
- [Lighting](./lighting.md): Handles light intensity and color from fire levels
- [Physics](./physics.md): Manages fire spread and heat distribution
