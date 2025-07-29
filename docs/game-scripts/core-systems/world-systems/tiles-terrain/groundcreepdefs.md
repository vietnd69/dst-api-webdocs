---
id: groundcreepdefs
title: Ground Creep Definitions
description: Defines ground creep configurations for terrain overlay effects
sidebar_position: 6

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Ground Creep Definitions

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `groundcreepdefs.lua` script defines ground creep configurations that create visual overlays on terrain tiles. Ground creep provides atmospheric effects like spider webs spreading across the ground, enhancing the visual storytelling of specific game areas.

## Usage Example

```lua
-- The script automatically registers ground creep definitions
-- Ground creep is managed by the TileManager system
local TileManager = require("tilemanager")
```

## Ground Creep Definitions

### GROUND_CREEP_IDS.WEBCREEP

**Status:** `stable`

**Description:**
Defines the web creep overlay effect that appears around spider dens and areas of high spider activity.

**Configuration:**
- `name`: `"web"` - The identifier name for this ground creep type
- `noise_texture`: `"web_noise"` - The texture file used for the visual overlay pattern

**Example:**
```lua
TileManager.AddGroundCreep(
    GROUND_CREEP_IDS.WEBCREEP,
    {
        name = "web",
        noise_texture = "web_noise",
    }
)
```

## TileManager Integration

### TileManager.AddGroundCreep(id, config)

**Status:** `stable`

**Description:**
Registers a new ground creep definition with the tile management system.

**Parameters:**
- `id` (number): The ground creep ID constant from GROUND_CREEP_IDS
- `config` (table): Configuration table containing:
  - `name` (string): Internal name identifier for the ground creep
  - `noise_texture` (string): Texture file name for the overlay pattern

**Returns:**
- None

## Ground Creep System

Ground creep overlays are visual effects that:
- Render on top of terrain tiles
- Use noise textures for natural-looking patterns
- Provide atmospheric enhancement to specific game areas
- Are managed automatically by the tile rendering system

## Common Usage Patterns

Ground creep is typically used for:
- **Environmental Storytelling**: Visual indicators of creature presence or influence
- **Area Identification**: Helping players recognize dangerous or special zones
- **Atmospheric Enhancement**: Adding visual depth to terrain
- **Gameplay Feedback**: Subtle visual cues about game state changes

## Related Modules

- [TileManager](mdc:dst-api-webdocs/path/to/tilemanager.md): Core system for managing ground creep registration
- [Constants](./constants.md): Contains GROUND_CREEP_IDS definitions
- [Prefabs](./prefabs.md): Spider den prefabs that utilize web creep effects
