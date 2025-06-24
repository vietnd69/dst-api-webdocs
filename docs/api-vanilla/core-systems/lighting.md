---
id: lighting
title: Lighting
description: Lighting system configuration and utilities (currently empty module)
sidebar_position: 70
slug: core-systems-lighting
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Lighting

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version (empty module) |

## Overview

The `lighting.lua` module is currently empty but is part of the lighting system infrastructure in Don't Starve Together. Based on codebase references, lighting functionality is primarily handled through components and other specialized modules.

## Current Status

**File Content:** Empty (no code implementation)

**Purpose:** Reserved for future lighting system utilities or configuration data.

## Related Lighting Systems

While this module is empty, lighting functionality exists throughout the codebase:

### Ambient Lighting Component

**Location:** `components/ambientlighting.lua`

**Purpose:** Manages world ambient lighting values and visual effects.

**Key Features:**
- Visual ambient value calculation
- Lighting overrides for special events
- Integration with weather and time systems

**Usage Example:**
```lua
-- Accessed through world components
local ambientLighting = TheWorld.components.ambientlighting
local brightness = ambientLighting:GetVisualAmbientValue()
```

### Lighting Constants

**Location:** Various tuning files and components

**Examples:**
- `TUNING.ABIGAIL_LIGHTING`: Character-specific lighting values
- Weather lighting constants in `components/weather.lua`
- Cave weather lighting in `components/caveweather.lua`

### Lighting Shaders

**Location:** `prefabs/global.lua`

**Asset:** `"shaders/lighting.ksh"`

**Purpose:** GPU shader for lighting calculations and effects.

### World Lighting Integration

Different world types have specific lighting configurations:

#### Forest World
```lua
-- In prefabs/forest.lua
inst:AddComponent("ambientlighting")
-- NOTE: ambient lighting is required by light watchers
```

#### Cave World
```lua
-- In prefabs/cave.lua  
inst:AddComponent("ambientlighting")
-- NOTE: ambient lighting is required by light watchers
```

#### Event Worlds
```lua
-- In prefabs/lavaarena.lua
inst:AddComponent("ambientlighting")
inst:PushEvent("overrideambientlighting", Point(200/255, 200/255, 200/255))
```

## Lighting-Related Events

### "overrideambientlighting"

**Status:** stable (but marked as NOT safe to use)

**Purpose:** Overrides default ambient lighting with custom values.

**Parameters:**
- Color point with RGB values (0-1 range)

**Example:**
```lua
inst:PushEvent("overrideambientlighting", Point(0.8, 0.8, 0.8))
```

## Light Sources

Various prefabs in the game implement lighting:

### Character Lighting
- **Abigail:** Uses `TUNING.ABIGAIL_LIGHTING` values
- **Mining Hat:** Provides hands-free lighting
- **Lanterns:** Mood and functional lighting

### Environmental Lighting
- **Moon Fissures:** React to world brightness
- **Lightning:** Creates temporary bright illumination
- **Fire Sources:** Dynamic light and warmth

## UI Lighting Effects

Several UI widgets react to ambient lighting:

### Overlay Widgets
- **Miasma Over:** Adjusts opacity based on ambient lighting
- **Sandstorm Over:** Brightness calculation from ambient values  
- **Moonstorm Over:** Visual effects tied to lighting levels

**Implementation Pattern:**
```lua
-- Common pattern in overlay widgets
self.ambientlighting = TheWorld.components.ambientlighting
local brightness = math.clamp(self.ambientlighting:GetVisualAmbientValue() * 1.4, 0, 1)
```

## Development Notes

### Why This Module Is Empty

The lighting system in DST is distributed across multiple specialized components rather than centralized in a single module:

1. **Component-Based Architecture:** Lighting logic lives in `ambientlighting` component
2. **World-Specific Implementation:** Each world type handles its own lighting setup
3. **Shader-Based Rendering:** Core lighting calculations happen in GPU shaders
4. **Event-Driven Updates:** Lighting changes use the event system

### Potential Future Use

This module could be used for:
- Centralized lighting configuration constants
- Lighting utility functions
- Cross-component lighting coordination
- Lighting effect definitions

## Related Modules

- [Ambient Lighting Component](../components/ambientlighting.md): Core lighting component
- [Weather](./weather.md): Weather-based lighting effects
- [Cave Weather](../components/caveweather.md): Underground lighting systems
- [World Temperature](../components/worldtemperature.md): Lighting constants for temperature
- [Tuning](./tuning.md): Lighting configuration constants

## Common Lighting Patterns

### Light Watcher Integration
```lua
-- Most lighting systems require light watchers
-- NOTE: ambient lighting is required by light watchers
inst:AddComponent("ambientlighting")
```

### Brightness Calculations
```lua
-- Standard brightness calculation pattern
local world_brightness = TheWorld.components.ambientlighting:GetVisualAmbientValue()
local adjusted_brightness = math.clamp(world_brightness * modifier, 0, 1)
```

### Platform-Specific Considerations
- Console vs PC lighting differences
- Performance optimization for different hardware
- Shader compatibility across platforms
