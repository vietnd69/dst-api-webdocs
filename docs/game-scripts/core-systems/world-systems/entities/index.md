---
id: entities-overview
title: Entity Systems Overview  
description: Overview of entity creation, management, and prefab systems in DST API
sidebar_position: 0
slug: game-scripts/core-systems/world-systems/entities
last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: infrastructure-system
system_scope: entity and prefab management infrastructure
---

# Entity Systems Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Entity Systems category provides the foundational infrastructure for creating, managing, and customizing all game objects in Don't Starve Together. These systems form the core building blocks that enable every interactive element in the game world, from characters and items to structures and environmental objects.

### Key Responsibilities
- Define and instantiate game object templates through the prefab system
- Manage visual customization and cosmetic variations via the skin system
- Provide utility functions for common entity creation patterns
- Ensure critical entities exist across all world shards and dimensions
- Handle entity lifecycle management and asset dependencies

### System Scope
This infrastructure includes low-level entity creation and management systems but excludes high-level gameplay mechanics (handled by Game Mechanics) and specific entity behaviors (handled by Components and Stategraphs).

## Architecture Overview

### System Components
Entity systems are built on a layered architecture where prefab definitions provide templates, utilities standardize creation patterns, and the skin system enables visual customization.

### Data Flow
```
Prefab Definition → Asset Loading → Entity Creation → Skin Application → World Injection
       ↓                ↓              ↓               ↓                ↓
   Template Data → Resource Files → Instance Object → Visual State → Active Entity
```

### Integration Points
- **Asset System**: Loads required textures, animations, and sound files
- **Component System**: Entities receive modular functionality through components
- **World Generation**: Prefabs are instantiated during world creation and gameplay
- **Save System**: Entity state is preserved and restored across game sessions

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Prefabs](./prefabs.md) | stable | Current prefab system |
| 676042 | 2025-06-21 | [Prefab Skins](./prefabskin.md) | stable | Visual customization system |
| 676042 | 2025-06-21 | [Prefab List](./prefablist.md) | stable | Auto-generated prefab registry |

## Core Infrastructure Modules

### [Prefab System](./prefabs.md)
Foundation system that defines templates for all game objects.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Prefabs](./prefabs.md) | stable | Core prefab and asset classes | Entity templates, asset management |
| [Prefab List](./prefablist.md) | stable | Auto-generated prefab registry | Complete prefab inventory, 1,431+ prefabs |

### [Customization System](./prefabskin.md)
Visual skin system for customizing entity appearance and functionality.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Prefab Skin](./prefabskin.md) | stable | Skin application and management | Visual customization, sound effects |
| [Prefab Skins Data](./prefabskins.md) | stable | Auto-generated skin database | 2,000+ skin variations, theme mapping |

### [Creation Utilities](./prefabutil.md)
Helper functions for standardizing common entity creation patterns.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Prefab Utilities](./prefabutil.md) | stable | Placer and deployable kit creation | Building previews, deployable items |

### [World Management](./worldentities.md)
Infrastructure for ensuring critical entities exist across all world instances.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [World Entities](./worldentities.md) | stable | Required entity injection system | Cross-shard consistency, pocket dimensions |

## Common Infrastructure Patterns

### Basic Entity Creation
```lua
-- Standard prefab creation pattern
local function entity_fn()
    local inst = CreateEntity()
    
    -- Add core components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Configure visual state
    inst.AnimState:SetBank("entity_bank")
    inst.AnimState:SetBuild("entity_build")
    inst.AnimState:PlayAnimation("idle")
    
    -- Network boundary
    inst.entity:SetPristine()
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Server-side initialization
    inst:AddComponent("inspectable")
    
    return inst
end

return Prefab("my_entity", entity_fn, {
    Asset("ANIM", "anim/my_entity.zip"),
    Asset("ATLAS", "images/inventoryimages/my_entity.xml"),
})
```

### Skin Application
```lua
-- Apply visual skin to entity
local function ApplyEntitySkin(inst, skin_name)
    if inst.SetSkin then
        inst:SetSkin(skin_name)
    end
    
    -- Skin system automatically handles:
    -- - Visual build changes
    -- - Sound effect overrides
    -- - Special behavior modifications
end

-- Check available skins
local skins = PREFAB_SKINS["backpack"]
print("Available backpack skins:", #skins)
```

### Deployable Creation
```lua
-- Create deployable kit item with placer
local placer = MakePlacer("structure_placer", "structure", "structure", "idle")

local kit = MakeDeployableKitItem("structure_kit", "structure",
    "structure_kit", "structure_kit", "idle", {
        Asset("ANIM", "anim/structure_kit.zip"),
        Asset("ATLAS", "images/inventoryimages/structure_kit.xml"),
    }
)

return placer, kit
```

## Entity Infrastructure Dependencies

### Required Systems
- [Asset System](../assets/index.md): Loads textures, animations, and audio files required by entities
- [Network System](../../networking-communication/index.md): Synchronizes entity state across clients and servers
- [Save System](../../data-management/saves/index.md): Persists entity data across game sessions

### Optional Systems
- [Component System](../../../components/index.md): Provides modular functionality to entities
- [Animation System](../../user-interface/graphics/index.md): Handles entity visual presentation
- [Physics System](../../system-core/engine/index.md): Manages entity collision and movement

## Performance Considerations

### System Performance
- Prefab loading occurs during game initialization to minimize runtime overhead
- Skin application uses cached build data to optimize visual transitions
- Entity creation pools common objects to reduce garbage collection pressure
- Asset preloading ensures smooth entity instantiation during gameplay

### Resource Usage
- Entity templates consume minimal memory through shared prefab definitions
- Skin data uses texture atlases to optimize GPU memory usage
- Audio assets are loaded on-demand to balance memory and performance
- Animation data is compressed to reduce storage requirements

### Scaling Characteristics
- System supports 1,431+ prefab types with thousands of skin variations
- Entity creation scales linearly with world complexity
- Skin application performs constant-time lookups through optimized data structures
- Cross-shard entity synchronization handles distributed world architectures

## Development Guidelines

### Best Practices
- Always define required assets in prefab declarations to prevent missing resource errors
- Use consistent naming conventions for prefab and skin identifiers
- Implement proper network boundaries between client and server entity initialization
- Follow the component pattern for modular entity functionality
- Test entity creation with various skin applications to ensure compatibility

### Common Pitfalls
- Forgetting to include required assets in prefab definitions leads to runtime errors
- Mixing client and server initialization code violates network architecture
- Creating circular dependencies between prefabs causes loading failures
- Not handling missing skin data gracefully can crash skin application
- Bypassing the prefab system for entity creation breaks save/load functionality

### Testing Strategies
- Validate all prefab assets load correctly during game initialization
- Test entity creation in both single-player and multiplayer environments
- Verify skin application works with all available skin variations
- Confirm entity persistence across save/load cycles
- Test cross-shard entity synchronization in distributed worlds

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [Components](../../../components/index.md) | Provides entity functionality | Component attachment, entity behavior |
| [Stategraphs](../../../stategraphs/index.md) | Controls entity animation | Animation state management, behavior trees |
| [World Generation](../generation/index.md) | Places entities in world | Prefab spawning, spatial distribution |
| [Save System](../../data-management/saves/index.md) | Persists entity state | Data serialization, world reconstruction |

## Troubleshooting

### Common Infrastructure Issues
| Issue | Symptoms | Solution |
|----|----|----|
| Missing prefab assets | Game crashes on entity creation | Verify all assets are included in prefab definition |
| Skin application fails | Visual glitches or missing textures | Check skin data exists in PREFAB_SKINS table |
| Entity creation slow | Performance drops during spawning | Review asset preloading and creation pooling |
| Cross-shard inconsistency | Entities missing in some shards | Verify world entity injection system operation |

### Debugging Infrastructure
- Use console commands to inspect entity state and component configuration
- Check prefab asset loading during game initialization for missing resources
- Monitor skin application logs for customization failures
- Verify world entity injection occurs correctly across all shards

## Entity System Statistics

Current system capacity (Build 676042):
- **Total Prefabs**: 1,431 unique entity templates
- **Available Skins**: 2,000+ visual and functional variations
- **Asset Types**: Animations, textures, sounds, atlases, shaders
- **Skinnable Prefabs**: 200+ different base entity types
- **Entity Categories**: Characters, items, structures, creatures, effects

## Migration and Compatibility

### Entity Data Migration
When updating entity systems:
- Maintain compatibility with existing save data structures
- Provide migration paths for changed prefab definitions
- Test entity loading from previous game versions
- Preserve skin application data across system updates

### Backward Compatibility
- Support legacy prefab creation patterns during transition periods
- Maintain existing entity behavior contracts for mod compatibility
- Preserve save data format compatibility for user content
- Document breaking changes and provide migration guidance

## Contributing to Entity Infrastructure

### Adding New Entity Types
1. Define prefab with required assets and dependencies
2. Follow established naming conventions and architecture patterns
3. Implement proper network boundaries and client/server separation
4. Test entity creation and skin application thoroughly
5. Document integration points with other systems

### Extending Skin System
1. Add skin definitions to appropriate data tables
2. Test visual application across different entity states
3. Verify sound effect integration works correctly
4. Ensure skin data loads properly during game initialization
5. Document new skin themes and naming conventions

### Performance Optimization
1. Profile entity creation performance under load
2. Optimize asset loading and caching strategies
3. Review memory usage patterns for large entity counts
4. Test cross-shard synchronization performance
5. Document performance characteristics and scaling limits
