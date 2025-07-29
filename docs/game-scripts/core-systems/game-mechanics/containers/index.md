---
id: containers-overview
title: Containers Overview
description: Overview of container systems and storage mechanics in DST API
sidebar_position: 0

last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: storage-system
system_scope: container interfaces and storage mechanics
---

# Containers Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Container Systems category implements all storage interfaces and inventory mechanics in Don't Starve Together. These systems transform basic item management into structured storage experiences through specialized containers, validation rules, and interactive UI elements that support diverse gameplay activities.

### Key Responsibilities
- Manage storage interfaces for backpacks, chests, and specialized containers
- Define UI layouts, slot positions, and visual configurations for container widgets
- Implement item validation rules determining which items can be stored where
- Handle container interaction behaviors including sounds, animations, and button actions
- Support character-specific containers with unique storage capabilities and requirements

### System Scope
This category includes all container-related mechanics but excludes basic inventory management (handled by Character Systems) and item definitions (handled by World Systems).

## Architecture Overview

### System Components
Container systems are built on a widget-driven architecture where configuration parameters define container behavior, validation rules control item placement, and UI components provide player interaction interfaces.

### Data Flow
```
Player Interaction → Container Widget → Item Validation → Storage Update
        ↓                ↓                  ↓               ↓
    UI Event → Widget Configuration → Validation Rules → Container State
```

### Integration Points
- **Character Systems**: Character-specific containers and inventory interactions
- **User Interface**: Container widget rendering and interaction handling
- **Game Mechanics**: Cooking, crafting, and specialized equipment integration
- **World Systems**: Container entities and prefab implementations
- **Networking**: Container state synchronization across clients

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Core Containers](./containers.md) | stable | Current stable container system |

## Core Container Modules

### [Container System](./containers.md)
Comprehensive container configuration and widget management system.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Container Configurations](./containers.md) | stable | All container definitions and widget setups | 80+ container types, validation rules, UI layouts |

## Container Categories

### Storage Containers
Basic storage solutions for item organization and transport.

**Backpacks and Portable Storage:**
- **Standard Backpacks**: 2x4 slot configurations with side panel UI
- **Specialized Packs**: Ice pack (food preservation), Krampus sack (large capacity)
- **Character Containers**: Spice pack, candy bag, seed pouch with item-specific validation

**Chests and Stationary Storage:**
- **Basic Chests**: Treasure chest (3x3), icebox (food-only with perish protection)
- **Living Containers**: Chester, Hutch with companion-based storage
- **Specialized Storage**: Fish box (ocean creatures), salt box (food preservation)

### Equipment Containers
Container interfaces integrated into tools and equipment.

**Weapon Systems:**
- **Slingshot Variants**: Ammunition storage with skill tree integration
- **Fishing Equipment**: Ocean fishing rod with bobber and lure slots
- **Modification Systems**: Slingshot modification container with component slots

**Character Equipment:**
- **Headgear Storage**: Antlion hat (turf storage), alter guardian hat (spore storage)
- **Pocket Storage**: Pocket watch (component assembly), Wendy's sisturn (petal storage)

### Cooking Containers
Specialized containers for food preparation and recipe management.

**Cooking Stations:**
- **Cook Pot Systems**: Standard and portable variants with ingredient validation
- **Specialized Cooking**: Portable spicer with specific slot requirements
- **Event Cooking**: Quagmire cooking containers with event-specific validation

**Food Processing:**
- **Preparation Tools**: Bundle wrapper for item packaging
- **Storage Solutions**: Containers with cooking-specific item acceptance rules

### Character-Specific Containers
Unique storage solutions tied to specific character abilities.

**Character Abilities:**
- **Wendy Systems**: Sisturn with skill tree progression, elixir container
- **Wortox Storage**: Soul jar with soul-specific validation
- **Webber Progression**: Beard sacks with expanding capacity (1-3 slots)

**Character Integration:**
- **Skill Requirements**: Containers that check character progression
- **Ability Enhancement**: Storage that supports character-specific mechanics

## Common Container Patterns

### Container Widget Setup
```lua
-- Standard container configuration
local function OnInit(inst)
    containers.widgetsetup(inst.components.container, "backpack")
end

-- Custom container with data override
local custom_config = {
    widget = {
        slotpos = {Vector3(0, 32, 0), Vector3(0, -32, 0)},
        animbank = "ui_chest_2x1",
        animbuild = "ui_chest_2x1"
    },
    type = "chest"
}
containers.widgetsetup(inst.components.container, nil, custom_config)
```

### Item Validation Implementation
```lua
-- Basic item filtering
function params.icebox.itemtestfn(container, item, slot)
    -- Accept items marked as icebox valid
    if item:HasTag("icebox_valid") then
        return true
    end
    
    -- Must be perishable food
    if not (item:HasTag("fresh") or item:HasTag("stale") or item:HasTag("spoiled")) then
        return false
    end
    
    -- Must be edible
    for k, v in pairs(FOODTYPE) do
        if item:HasTag("edible_"..v) then
            return true
        end
    end
    
    return false
end
```

### Character Integration
```lua
-- Character-specific functionality
function params.sisturn.itemtestfn(container, item, slot)
    local owner = container.inst.components.container:GetOpeners()[1]
    
    -- Skill tree integration for expanded functionality
    if owner and owner.components.skilltreeupdater and 
       owner.components.skilltreeupdater:IsActivated("wendy_sisturn_3") then
        return item.prefab == "petals" or 
               item.prefab == "moon_tree_blossom" or 
               item.prefab == "petals_evil"
    end
    
    return item.prefab == "petals"
end
```

## Container System Dependencies

### Required Systems
- [User Interface](../../user-interface/index.md): Widget rendering and interaction handling
- [Character Systems](../../character-systems/index.md): Player inventory and character-specific containers
- [Fundamentals](../../fundamentals/index.md): Entity framework and component systems

### Optional Systems
- [Game Mechanics](../../game-mechanics/index.md): Enhanced container functionality for cooking and crafting
- [World Systems](../../world-systems/index.md): Container entity implementations and world interactions
- [Networking](../../networking-communication/index.md): Multi-player container synchronization

## Performance Considerations

### Memory Usage
- Container configurations are loaded once during initialization
- Widget positions are pre-calculated for optimal rendering performance
- Item validation functions use efficient tag-based checking
- Maximum slot calculation ensures proper memory allocation

### Performance Optimizations
- Container validation uses fast tag-based item filtering
- Widget configurations cache frequently accessed layout data
- Item test functions minimize complex logic in tight loops
- Container state updates batch UI changes for efficiency

### Scaling Considerations
- System supports 80+ different container types simultaneously
- Widget layouts adapt to various screen resolutions and UI scales
- Container validation scales efficiently with large item inventories
- Event-specific containers load only when events are active

## Development Guidelines

### Best Practices
- Always validate container state before item operations
- Use efficient tag-based validation in item test functions
- Implement proper error handling for container edge cases
- Design container layouts with consistent visual patterns
- Test container behavior with maximum capacity and edge items

### Common Pitfalls
- Not handling container state changes during network synchronization
- Creating item validation functions that are too computationally expensive
- Forgetting to account for character skill progression in validation
- Implementing containers without proper stack handling consideration
- Not testing container behavior with unusual item combinations

### Testing Strategies
- Test all container types with their intended item sets
- Verify container UI scaling across different screen resolutions
- Test character-specific containers with appropriate character progression
- Validate container persistence across save/load cycles
- Test container behavior in multiplayer environments with network latency

## Container Integration Patterns

### With Cooking Systems
Containers integrate closely with food preparation mechanics:
- Cooking stations validate ingredients through container item tests
- Recipe systems access container contents for crafting calculations
- Food storage containers preserve item quality through specialized validation
- Cooking containers provide action buttons for recipe execution

### With Character Progression
Containers adapt to character development and abilities:
- Character-specific containers check skill tree progression
- Container capacity and functionality expand with character advancement
- Validation rules adapt to character capabilities and unlocked features
- Container appearance and behavior reflect character specialization

### With User Interface
Container systems drive inventory and storage interfaces:
- Widget configurations define all visual container layouts
- Container types determine UI positioning and interaction patterns
- Slot backgrounds and animations provide visual feedback
- Button configurations enable container-specific actions and operations

## Container Design Principles

### Functional Specialization
- Storage containers focus on capacity and organization efficiency
- Equipment containers integrate seamlessly with tool functionality
- Cooking containers optimize ingredient management and recipe execution
- Character containers enhance specific character abilities and playstyles

### User Experience
- Container layouts follow consistent visual patterns and interaction models
- Item validation provides clear feedback about storage compatibility
- Container animations and sounds enhance interaction feedback
- UI positioning optimizes screen space usage and accessibility

### Gameplay Integration
- Container limitations create meaningful resource management decisions
- Specialized containers encourage diverse playstyles and character choices
- Container progression rewards player advancement and skill development
- Container variety supports different gameplay activities and strategies

## Troubleshooting Container Issues

### Common Container Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Items not accepting | Validation failures | Check itemtestfn implementation and item tags |
| UI layout problems | Misaligned slots | Verify widget slotpos configurations |
| Container not opening | Interaction failures | Check container component state and openlimit |
| Save/load issues | Container contents lost | Verify container persistence and data serialization |

### Debugging Container Systems
- Use container debug commands to inspect current configuration state
- Check item validation functions with debug output for failed items
- Review container widget setup for proper initialization
- Validate container component integration with prefab systems

## Advanced Container Features

### Custom Container Creation
```lua
-- Define new container type
params.my_container = {
    widget = {
        slotpos = {Vector3(-32, 0, 0), Vector3(32, 0, 0)},
        animbank = "ui_container_2x1",
        animbuild = "ui_container_2x1",
        pos = Vector3(0, 100, 0),
    },
    type = "chest",
    acceptsstacks = true,
}

-- Add validation logic
function params.my_container.itemtestfn(container, item, slot)
    return item:HasTag("my_custom_tag")
end
```

### Dynamic Container Behavior
```lua
-- Conditional container functionality
function params.upgradeable_container.itemtestfn(container, item, slot)
    if container.inst:HasTag("upgraded") then
        return item:HasTag("advanced_materials")
    else
        return item:HasTag("basic_materials")
    end
end
```

### Container Action Integration
```lua
-- Custom button actions
function params.processing_container.widget.buttoninfo.fn(inst, doer)
    if inst.components.container ~= nil then
        BufferedAction(doer, inst, ACTIONS.PROCESS):Do()
    elseif inst.replica.container ~= nil and not inst.replica.container:IsBusy() then
        SendRPCToServer(RPC.DoWidgetButtonAction, ACTIONS.PROCESS.code, inst)
    end
end
```

## Performance Monitoring

### Key Metrics
- Container widget rendering performance across different UI scales
- Item validation function execution time for large inventories
- Container state synchronization latency in multiplayer environments
- Memory usage patterns for container configuration data

### Optimization Strategies
- Cache frequently accessed container configuration data
- Minimize complex logic in item validation functions
- Batch container UI updates when handling multiple item changes
- Use efficient data structures for container slot management

## Future Development

### Extensibility Design
- Container framework supports easy addition of new container types
- Validation system accommodates custom item filtering requirements
- Widget system adapts to new UI layout patterns and interaction models
- Integration points support enhanced container functionality

### Integration Planning
- New containers should leverage existing validation and widget frameworks
- Consider performance implications when adding complex container behaviors
- Plan for backward compatibility when modifying existing container types
- Design container systems to support mod integration and customization
