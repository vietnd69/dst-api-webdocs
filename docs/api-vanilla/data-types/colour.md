---
id: colour
title: Colour
sidebar_position: 3
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Colour

Colour is a data type representing colors in the game, typically using RGBA format with values from 0 to 1. 

## Overview

In Don't Starve Together, Colour objects are used to define:
- Entity tinting
- UI element colors
- Lighting effects
- Particle effects
- Text colors

The game uses a normalized color format where each component (Red, Green, Blue, Alpha) ranges from 0.0 to 1.0, rather than the traditional 0-255 range.

## Properties

Colour objects have the following properties:

- **r**: Red component (0.0 to 1.0)
- **g**: Green component (0.0 to 1.0)
- **b**: Blue component (0.0 to 1.0)
- **a**: Alpha (transparency) component (0.0 to 1.0, where 0.0 is fully transparent and 1.0 is fully opaque)

## Creating Colors

```lua
-- Create a new Color with RGBA values
local red = Colour(1, 0, 0, 1)       -- Bright red
local green = Colour(0, 1, 0, 1)     -- Bright green
local blue = Colour(0, 0, 1, 1)      -- Bright blue
local white = Colour(1, 1, 1, 1)     -- White
local black = Colour(0, 0, 0, 1)     -- Black
local transparent = Colour(1, 1, 1, 0) -- Fully transparent white

-- Create a color with partial transparency
local halfTransparentRed = Colour(1, 0, 0, 0.5)
```

## Common Usage Examples

### Entity Tinting

```lua
-- Set an entity's color (e.g., to indicate status effects)
inst.AnimState:SetMultColour(colour.r, colour.g, colour.b, colour.a)

-- Reset color to default (white)
inst.AnimState:SetMultColour(1, 1, 1, 1)

-- Tint an entity partially
inst.AnimState:SetMultColour(0.8, 0.8, 1, 1) -- Slight blue tint
```

### UI Elements

```lua
-- Set widget text color
widget.text:SetColour(colour.r, colour.g, colour.b, colour.a)

-- Create a colored UI image
widget.bg:SetTint(colour.r, colour.g, colour.b, colour.a)
```

### Lighting Effects

```lua
-- Create a colored light source
local light = SpawnPrefab("lightsource")
light.Light:SetColour(colour.r, colour.g, colour.b)
```

## Color Operations

```lua
-- Blending colors (example implementation)
local function BlendColors(color1, color2, weight)
    weight = math.clamp(weight, 0, 1)
    return Colour(
        color1.r * (1 - weight) + color2.r * weight,
        color1.g * (1 - weight) + color2.g * weight,
        color1.b * (1 - weight) + color2.b * weight,
        color1.a * (1 - weight) + color2.a * weight
    )
end

-- Adjust brightness
local function AdjustBrightness(color, factor)
    return Colour(
        math.min(color.r * factor, 1),
        math.min(color.g * factor, 1),
        math.min(color.b * factor, 1),
        color.a
    )
end
```

## Common Predefined Colors

The game has several predefined color constants that are commonly used:

```lua
DEFAULTCOLOUR = Colour(1, 1, 1, 1)       -- Default white
NOLINECOLOUR = Colour(0, 0, 0, 0)        -- Transparent
SCRAPBOOKCOLOUR = Colour(.75, .75, .75, 1) -- Light gray used in scrapbook
WEBCOLOUR = Colour(.9, .9, .9, 1)        -- Off-white used in web elements
```

## Notes

- Always keep color component values within the 0-1 range, as exceeding these bounds can cause unexpected behavior
- The alpha component is often ignored by certain rendering systems like lighting, which only use RGB
- Colors in DST are typically stored as instances of the Colour class, not as tables 
