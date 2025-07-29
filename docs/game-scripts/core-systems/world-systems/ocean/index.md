---
id: ocean-systems-overview
title: Ocean Systems Overview
description: Overview of ocean mechanics, water interaction, and marine systems in DST API
sidebar_position: 0

last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: infrastructure-system
system_scope: ocean mechanics and water interaction systems
---

# Ocean Systems Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Ocean Systems category provides the core infrastructure for water-based mechanics, marine environments, and aquatic interactions in Don't Starve Together. These systems handle everything from basic water detection to complex wave mechanics, entity sinking behaviors, and oceanic pathfinding, enabling rich maritime gameplay experiences.

### Key Responsibilities
- Manage ocean tile detection and water depth calculations
- Handle entity sinking mechanics and water interaction behaviors
- Provide wave generation and attack wave systems for gameplay effects
- Support flying creature land/water transition mechanics
- Enable pathfinding between ocean and land areas
- Control visual effects and tinting for water-based entities

### System Scope
This category includes all systems related to ocean mechanics, water interaction, and marine environment functionality, but excludes boat/raft entities (handled by Prefabs) and player swimming mechanics (handled by Character Systems).

## Architecture Overview

### System Components
Ocean systems are implemented as utility-focused infrastructure that provides foundational services for water-based gameplay mechanics.

### Data Flow
```
Tile Detection → Water Depth → Entity Behavior → Sinking/Floating State
      ↓              ↓              ↓                    ↓
Ocean Queries → Depth Calculation → Position Validation → State Changes
      ↓              ↓              ↓                    ↓
Wave Generation → Attack Patterns → Visual Effects → Gameplay Impact
```

### Integration Points
- **World Systems**: Tile and terrain systems provide ocean tile data
- **Entity Management**: Entity positioning and state management
- **Physics Systems**: Collision detection and movement calculations
- **Visual Effects**: Water-based animation and tinting systems

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Ocean Utilities](./ocean_util.md) | stable | Current ocean mechanics system |

## Core Ocean Modules

### [Ocean Utilities](./ocean_util.md)
Comprehensive ocean interaction and mechanics utility functions.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Ocean Utilities](./ocean_util.md) | stable | Core ocean mechanics and utilities | Tile checking, depth calculation, wave spawning, entity sinking |

## Common Ocean Patterns

### Basic Ocean Detection
```lua
-- Check if position is in ocean
local x, y, z = entity.Transform:GetWorldPosition()
local tile = TheWorld.Map:GetTileAtPoint(x, y, z)

if IsOceanTile(tile) then
    local depth = GetOceanDepthAtPosition(x, y, z)
    if depth and depth > 10 then
        print("Entity is in deep water")
    else
        print("Entity is in shallow water")
    end
end
```

### Wave Attack Generation
```lua
-- Create circular wave attack around boss
local boss_pos = boss:GetPosition()
local waves_spawned = SpawnAttackWaves(
    boss_pos,        -- center position
    0,               -- starting rotation
    8,               -- spawn radius
    6,               -- number of waves
    360,             -- full circle coverage
    12,              -- wave speed
    "wave_large",    -- wave prefab type
    2,               -- activation delay
    false            -- not instant active
)
```

### Entity Sinking Management
```lua
-- Handle entity water interaction
local function HandleWaterInteraction(entity)
    local should_sink = ShouldEntitySink(entity, true)
    
    if should_sink then
        -- Get appropriate visual effects
        local x, y, z = entity.Transform:GetWorldPosition()
        local fx_prefabs, is_fallback = GetSinkEntityFXPrefabs(entity, x, y, z)
        
        -- Spawn effects before sinking
        for _, fx_name in pairs(fx_prefabs) do
            local fx = SpawnPrefab(fx_name)
            fx.Transform:SetPosition(x, y, z)
        end
        
        -- Sink the entity
        SinkEntity(entity)
    end
end
```

## Ocean System Dependencies

### Required Systems
- [World Systems](../index.md): Tile and terrain data for ocean detection
- [Fundamentals](../../fundamentals/index.md): Entity and vector mathematics
- [System Core](../../system-core/index.md): Engine integration for tile queries

### Optional Systems
- [Entities](../entities/index.md): Enhanced entity behavior in water environments
- [User Interface](../../user-interface/index.md): Water-related visual feedback systems
- [Game Mechanics](../../game-mechanics/index.md): Integration with survival and combat systems

## Performance Considerations

### Ocean Query Optimization
- Tile type checking uses efficient TileGroupManager calls
- Ocean depth queries are cached when possible
- Pathfinding algorithms use optimized line-drawing for land detection
- Wave spawning batches multiple entities for performance

### Memory Management
- Ocean utilities avoid persistent state storage
- Visual effects use object pooling for frequent wave spawning
- Entity sinking processes clean up resources efficiently
- Depth calculations minimize allocation overhead

### Scaling Considerations
- Ocean systems handle large world areas efficiently
- Wave generation scales with configurable parameters
- Entity sinking supports bulk operations
- Pathfinding adapts to different world sizes and complexity

## Development Guidelines

### Best Practices
- Always validate positions before performing ocean queries
- Use appropriate wave prefabs for different gameplay contexts
- Handle entity sinking with proper inventory and state cleanup
- Test ocean mechanics with various tile configurations and world sizes

### Common Pitfalls
- Performing ocean depth queries on invalid or out-of-bounds positions
- Creating wave attacks without considering performance impact on large numbers
- Not handling special entity tags (irreplaceable, shoreonsink) during sinking
- Assuming ocean tile presence without proper validation

### Testing Strategies
- Test ocean detection across different tile types and boundaries
- Verify wave spawning performance with maximum configured wave counts
- Test entity sinking with various entity types and special tags
- Validate pathfinding between ocean and land across different world configurations

## Ocean System Integration

### With World Generation
Ocean systems use world generation data for:
- Ocean tile placement and depth distribution
- Shore detection and pathfinding reference points
- Wave spawn point validation during world creation
- Entity placement validation in water areas

### With Gameplay Mechanics
Ocean mechanics integrate with core gameplay:
- Combat systems use wave attacks for boss encounters
- Survival mechanics handle water interaction and drowning
- Movement systems adapt to water depth and swimming capabilities
- Item systems handle dropping and retrieval in water environments

### With Visual Systems
Ocean systems drive visual presentation:
- Water tinting based on tile type and depth
- Wave animation and effect spawning
- Entity sinking visual feedback
- Transition effects for flying creature landing/takeoff

## Technical Implementation

### Tile System Integration
Ocean systems interface with the tile system through:
- `TileGroupManager` for efficient tile type classification
- `TheWorld.Map` for position-to-tile coordinate conversion
- Ocean depth maps for realistic water depth simulation
- Tile boundary detection for pathfinding algorithms

### Mathematical Foundations
Core algorithms use optimized mathematical approaches:
- Bresenham-like line algorithm for land detection pathfinding
- Circular trigonometry for wave attack pattern generation
- Vector mathematics for entity positioning and movement
- Distance calculations for shore proximity detection

### Memory and Performance Patterns
Ocean systems follow efficient resource usage patterns:
- Stateless utility functions minimize memory footprint
- Batch processing for multiple wave generation
- Lazy evaluation for expensive depth calculations
- Resource pooling for frequently created visual effects

## Troubleshooting Ocean Issues

### Common Ocean Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Ocean detection failure | Entities behave incorrectly near water | Verify tile type checking and boundary handling |
| Wave spawning performance | Frame drops during wave attacks | Reduce wave count or implement spawning delays |
| Entity sinking errors | Items disappear or behave unexpectedly | Check entity tags and sinking validation logic |
| Pathfinding problems | Entities cannot navigate between water and land | Verify shore detection and land-finding algorithms |

### Debugging Ocean Systems
- Use tile visualization tools to verify ocean tile placement
- Monitor wave spawning performance with debug timing
- Check entity sinking logs for special tag handling
- Test pathfinding with various start and end point combinations

## Advanced Ocean Features

### Custom Wave Patterns
Ocean systems support extensible wave generation:
- Configurable wave prefab types for different effects
- Flexible spawning patterns with rotation and radius control
- Timing systems for delayed activation and sequencing
- Integration with game events for triggered wave mechanics

### Dynamic Water Interaction
Advanced water mechanics include:
- Real-time depth calculation for varying water levels
- Entity state management for water entry and exit
- Flying creature transition systems for land/water boundaries
- Custom tinting and visual effects based on water properties

### Pathfinding Enhancement
Sophisticated navigation features:
- Shore-finding algorithms for emergency situations
- Multi-point pathfinding between ocean and land areas
- Distance-based accessibility checking
- Integration with AI systems for creature behavior

## Future Development Opportunities

### System Enhancement
- Enhanced water physics simulation for more realistic behavior
- Advanced wave generation with physics-based propagation
- Dynamic water level systems for tidal and seasonal effects
- Improved pathfinding algorithms for complex shoreline navigation

### Integration Expansion
- Deeper integration with weather systems for storm effects
- Enhanced compatibility with mod systems for custom water types
- Advanced visual effects for different water environments
- Expanded entity interaction systems for marine life

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [World Systems](../index.md) | Parent category | Provides world infrastructure for ocean mechanics |
| [Tiles and Terrain](../tiles-terrain/index.md) | Provider | Supplies tile data and terrain information |
| [Entities](../entities/index.md) | Consumer | Uses ocean data for entity behavior and positioning |
| [Game Mechanics](../../game-mechanics/index.md) | Consumer | Integrates water mechanics with survival gameplay |

## Contributing to Ocean Systems

### Adding New Ocean Features
1. Understand existing ocean infrastructure and utility patterns
2. Follow established conventions for tile checking and depth calculation
3. Implement proper error handling for edge cases and invalid positions
4. Provide comprehensive testing for various water environments

### Modifying Existing Systems
1. Maintain backward compatibility with existing ocean-dependent systems
2. Update related documentation and integration examples
3. Test changes across different world types and configurations
4. Consider performance impact on systems that frequently query ocean data

## Performance Monitoring

### Key Metrics
- Ocean tile query frequency and response time
- Wave generation performance during large-scale attacks
- Entity sinking processing time for bulk operations
- Pathfinding algorithm efficiency across different world sizes

### Optimization Strategies
- Cache frequently accessed ocean tile data
- Optimize wave spawning algorithms for common use cases
- Minimize memory allocation during entity sinking operations
- Implement spatial indexing for efficient shore detection queries
