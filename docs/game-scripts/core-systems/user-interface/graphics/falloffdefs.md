---
id: falloffdefs
title: Falloff Definitions
description: Module that defines tile falloff texture configurations for visual transitions between different terrain types
sidebar_position: 7
slug: core-systems-falloffdefs
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Falloff Definitions

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `falloffdefs.lua` module configures falloff textures that create smooth visual transitions between different tile types in Don't Starve Together. It uses the TileManager to register various falloff texture definitions that determine how terrain edges blend together.

## Usage Example

```lua
-- The module is automatically loaded and configured at startup
-- No direct function calls needed - it configures the TileManager
```

## Falloff Texture Definitions

### FALLOFF_IDS.FALLOFF

**Status:** `stable`

**Description:**
Default falloff texture for standard land tiles, providing smooth transitions between land tiles and other terrain types.

**Configuration:**
```lua
TileManager.AddFalloffTexture(
    FALLOFF_IDS.FALLOFF,
    {
        name = "falloff",
        noise_texture = "images/square.tex",
        should_have_falloff = TileGroups.LandTilesWithDefaultFalloff,
        should_have_falloff_result = true,
        neighbor_needs_falloff = TileGroups.LandTilesWithDefaultFalloff,
        neighbor_needs_falloff_result = false
    }
)
```

**Properties:**
- `name`: "falloff"
- `noise_texture`: "images/square.tex"
- `should_have_falloff`: Applies to tiles in `TileGroups.LandTilesWithDefaultFalloff`
- `neighbor_needs_falloff`: Checks against `TileGroups.LandTilesWithDefaultFalloff`

### FALLOFF_IDS.DOCK_FALLOFF

**Status:** `stable`

**Description:**
Falloff texture specifically for dock tiles, creating smooth transitions between docks and transparent ocean areas.

**Configuration:**
```lua
TileManager.AddFalloffTexture(
    FALLOFF_IDS.DOCK_FALLOFF,
    {
        name = "dock_falloff",
        noise_texture = "images/square.tex",
        should_have_falloff = TileGroups.DockTiles,
        should_have_falloff_result = true,
        neighbor_needs_falloff = TileGroups.TransparentOceanTiles,
        neighbor_needs_falloff_result = true
    }
)
```

**Properties:**
- `name`: "dock_falloff"
- `noise_texture`: "images/square.tex"
- `should_have_falloff`: Applies to tiles in `TileGroups.DockTiles`
- `neighbor_needs_falloff`: Checks against `TileGroups.TransparentOceanTiles`

### FALLOFF_IDS.OCEANICE_FALLOFF

**Status:** `stable`

**Description:**
Falloff texture for ocean ice tiles, creating transitions between ice and transparent ocean areas.

**Configuration:**
```lua
TileManager.AddFalloffTexture(
    FALLOFF_IDS.OCEANICE_FALLOFF,
    {
        name = "oceanice_falloff",
        noise_texture = "images/square.tex",
        should_have_falloff = TileGroups.OceanIceTiles,
        should_have_falloff_result = true,
        neighbor_needs_falloff = TileGroups.TransparentOceanTiles,
        neighbor_needs_falloff_result = true,
    }
)
```

**Properties:**
- `name`: "oceanice_falloff"
- `noise_texture`: "images/square.tex"
- `should_have_falloff`: Applies to tiles in `TileGroups.OceanIceTiles`
- `neighbor_needs_falloff`: Checks against `TileGroups.TransparentOceanTiles`

### FALLOFF_IDS.INVISIBLE

**Status:** `stable`

**Description:**
Invisible falloff texture for land tiles that need falloff effects but should remain visually invisible.

**Configuration:**
```lua
TileManager.AddFalloffTexture(
    FALLOFF_IDS.INVISIBLE,
    {
        name = "invisible_falloff",
        noise_texture = "images/square.tex",
        should_have_falloff = TileGroups.LandTilesInvisible,
        should_have_falloff_result = true,
        neighbor_needs_falloff = TileGroups.LandTilesWithDefaultFalloff,
        neighbor_needs_falloff_result = true,
    }
)
```

**Properties:**
- `name`: "invisible_falloff"
- `noise_texture`: "images/square.tex"
- `should_have_falloff`: Applies to tiles in `TileGroups.LandTilesInvisible`
- `neighbor_needs_falloff`: Checks against `TileGroups.LandTilesWithDefaultFalloff`

## Constants

### FALLOFF_IDS

**Description:** Enumeration of available falloff texture identifiers.

**Values:**
- `FALLOFF = 1`: Default land tile falloff
- `DOCK_FALLOFF = 2`: Dock tile falloff
- `OCEANICE_FALLOFF = 3`: Ocean ice tile falloff
- `INVISIBLE = 4`: Invisible falloff for special cases

## Configuration Parameters

### Falloff Texture Configuration

**Structure:**
```lua
{
    name = "string",                    -- Unique identifier name
    noise_texture = "string",           -- Path to noise texture
    should_have_falloff = TileGroup,    -- Tile group that should have falloff
    should_have_falloff_result = bool,  -- Whether tiles should have falloff
    neighbor_needs_falloff = TileGroup, -- Neighboring tile group to check
    neighbor_needs_falloff_result = bool -- Whether neighbors need falloff
}
```

**Parameters:**
- `name` (string): Unique identifier for the falloff texture
- `noise_texture` (string): Texture file path used for the falloff effect
- `should_have_falloff` (TileGroup): Group of tiles that should apply this falloff
- `should_have_falloff_result` (boolean): Whether the falloff should be applied
- `neighbor_needs_falloff` (TileGroup): Group of neighboring tiles to consider
- `neighbor_needs_falloff_result` (boolean): Whether neighboring tiles require falloff

## Module Protection

The module uses `mod_protect_TileManager` to prevent modification of the TileManager after configuration:

```lua
mod_protect_TileManager = false  -- Allow modifications
-- ... TileManager.AddFalloffTexture calls ...
mod_protect_TileManager = true   -- Protect from further modifications
```

## Related Modules

- [TileManager](./tilemanager.md): Core system for managing tile textures and falloffs
- [Constants](./constants.md): Contains FALLOFF_IDS definitions
- [TileGroups](./tilegroups.md): Defines tile groupings used in falloff configurations
