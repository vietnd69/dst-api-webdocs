---
id: regrowthutil
title: RegrowthUtil
description: Utility functions for calculating entity regrowth densities and spatial distribution
sidebar_position: 5
slug: /game-scripts/core-systems/regrowthutil
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# RegrowthUtil

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `regrowthutil` module provides utility functions for calculating entity regrowth patterns in Don't Starve Together. It handles density calculations and spatial distribution logic for the world's regrowth system, ensuring that entities respawn in appropriate quantities and locations based on the original world generation parameters.

## Core Concepts

### Five Radius System
The regrowth system uses a "five radius" approach where density calculations are performed for groups of 5 entities rather than individual entities. This creates natural clumping patterns that match the original world generation aesthetics.

### Density-Based Spawning
Regrowth calculations rely on the original world generation density data stored in `TheWorld.generated.densities`, ensuring that regrown entities maintain the intended distribution patterns.

## Functions

### CalculateFiveRadius(density) {#calculate-five-radius}

**Status:** `stable`

**Description:**
Calculates the search radius for regrowth spawning based on entity density. Uses a "five radius" system that groups entities to create natural clumping patterns rather than uniform distribution.

**Parameters:**
- `density` (number): The target density of entities per area unit

**Returns:**
- (number): The calculated radius for entity placement searches

**Formula:**
```lua
local searcharea = 2 * 16 * 5 / density
return math.sqrt(searcharea / math.pi)
```

**Example:**
```lua
-- Calculate radius for medium density spawning
local density = 0.3
local radius = CalculateFiveRadius(density)
-- radius will be larger for lower density (more spread out)
-- radius will be smaller for higher density (more clustered)
```

**Technical Notes:**
- The factor `16` represents tile size conversion (each worldgen tile is 4x4 game units)
- The factor `2` provides visual correction for proper spacing appearance
- The factor `5` implements the five-entity grouping system for natural clumping

### GetFiveRadius(x, z, prefab) {#get-five-radius}

**Status:** `stable`

**Description:**
Determines the appropriate regrowth radius for a specific prefab at given world coordinates. Queries the world topology and generation data to find the original density settings for the area.

**Parameters:**
- `x` (number): World x-coordinate
- `z` (number): World z-coordinate  
- `prefab` (string): The prefab name to calculate radius for

**Returns:**
- (number|nil): The calculated five radius, or nil if regrowth is not possible

**Example:**
```lua
-- Get regrowth radius for trees at specific location
local x, z = 100, 50
local radius = GetFiveRadius(x, z, "evergreen")
if radius then
    -- Use radius for regrowth spawning logic
    print("Regrowth radius for evergreen:", radius)
else
    -- No regrowth possible at this location
    print("Cannot regrow evergreen at this location")
end
```

**Failure Conditions:**
The function returns `nil` when:
- Coordinates are outside any topology node
- World lacks generation data (old save games)
- Area has no density data for the specified prefab
- Area is a special node type (blockers, etc.)

**Implementation Details:**
1. **Area Detection**: Uses `TheSim:WorldPointInPoly()` to find the topology node containing the coordinates
2. **Data Validation**: Checks for existence of world generation data and area-specific density information
3. **Density Lookup**: Retrieves density for the specific prefab from `TheWorld.generated.densities`
4. **Radius Calculation**: Calls `CalculateFiveRadius()` with the found density value

## Usage Patterns

### Basic Regrowth Check
```lua
-- Check if regrowth is possible before attempting spawn
local radius = GetFiveRadius(x, z, prefab_name)
if radius then
    -- Proceed with regrowth logic using the calculated radius
    local entities = TheSim:FindEntities(x, 0, z, radius, {"regrowth_target"})
    -- Apply regrowth rules based on existing entity count
end
```

### Density-Based Spawning
```lua
-- Calculate appropriate spacing for different density levels
local low_density_radius = CalculateFiveRadius(0.1)   -- Sparse distribution
local med_density_radius = CalculateFiveRadius(0.5)   -- Medium distribution  
local high_density_radius = CalculateFiveRadius(1.0)  -- Dense distribution
```

## Integration with World Systems

### Topology Integration
The regrowth system integrates with the world topology system to:
- Identify area boundaries using polygon data
- Access area-specific generation parameters
- Maintain consistency with original world design

### Generation Data Dependencies
Requires access to:
- `TheWorld.topology.nodes` - Area boundary definitions
- `TheWorld.topology.ids` - Area identifier mappings
- `TheWorld.generated.densities` - Original density parameters per area and prefab

## Performance Considerations

### Computational Efficiency
- `CalculateFiveRadius()` performs simple mathematical operations with O(1) complexity
- `GetFiveRadius()` includes polygon intersection testing which scales with topology complexity
- Density lookup operations are O(1) hash table access

### Caching Recommendations
For performance optimization in regrowth systems:
- Cache radius calculations for frequently used density values
- Pre-calculate area mappings for common coordinates
- Batch process multiple regrowth requests in the same area

## Related Systems

- [World Generation](./worldgen.md): Provides the original density data used by regrowth calculations
- [Topology System](./topology.md): Defines area boundaries and spatial organization  
- [Entity Management](./entityscript.md): Handles the actual spawning of regrown entities
- [TheWorld](./theworld.md): Global world state containing generation and topology data

## Technical Implementation Notes

### Coordinate System
- Uses world coordinates (not tile coordinates)
- Integrates with DST's standard coordinate system where each tile represents 4x4 game units
- Z-coordinate represents the vertical world axis (equivalent to Y in some contexts)

### Mathematical Approach
The five radius calculation balances several competing factors:
- **Clumping vs Distribution**: The factor of 5 creates natural clustering
- **Visual Appearance**: The factor of 2 provides empirically correct visual spacing
- **Performance**: Simplified circular area calculations for efficient computation

### Legacy Compatibility
The system gracefully handles:
- Old save games without generation data
- Special topology nodes without density information
- Missing prefab entries in density tables
