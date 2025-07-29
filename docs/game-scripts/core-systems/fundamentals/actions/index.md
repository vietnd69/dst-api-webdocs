---
id: actions-overview
title: Actions Overview
description: Overview of player interaction and action system in DST API
sidebar_position: 0

last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: core-system
system_scope: player interactions and entity actions
---

# Actions Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Actions system forms the foundation of all player interactions in Don't Starve Together, providing a comprehensive framework for defining, validating, and executing player actions. This system enables players to interact with the world through clicks, key presses, and contextual menus while maintaining consistency and reliability across single-player and multiplayer environments.

### Key Responsibilities
- Define all possible player interactions through action templates and specifications
- Manage action execution lifecycle from input to completion with proper validation
- Provide component-based action discovery and registration for modular entity behaviors
- Handle equipment slot management and item interaction coordination
- Support deferred action execution through buffering and queuing mechanisms
- Ensure network synchronization of actions between clients and servers

### System Scope
This system encompasses all user-initiated interactions with entities, items, and world positions, including direct object interactions, tool usage, item deployment, crafting actions, and equipment management. It excludes automatic AI behaviors (handled by Brain systems) and passive entity updates (handled by Component systems).

## Architecture Overview

### System Components
The Actions system is built on a layered architecture where action definitions provide templates, component actions discover available interactions, buffered actions manage execution, and utility modules handle supporting functionality.

### Data Flow
```
Player Input → Action Discovery → Action Validation → Action Buffering → Action Execution
      ↓              ↓                 ↓                 ↓                 ↓
  Input Event → Component Check → Prerequisites → Queue Management → State Changes
```

### Integration Points
- **Entity System**: Actions operate on entities and modify their components and state
- **Component System**: Component actions automatically discover available interactions
- **Input System**: Player inputs trigger action discovery and execution
- **Networking System**: Actions synchronize between clients and servers
- **Animation System**: Action execution coordinates with entity animations and state changes

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Core Actions](./actions.md) | stable | Current action definitions and execution framework |
| 676042 | 2025-06-21 | [Buffered Actions](./bufferedaction.md) | stable | Current deferred action execution system |
| 676042 | 2025-06-21 | [Component Actions](./componentactions.md) | stable | Current component-based action discovery |
| 676042 | 2025-06-21 | [Equip Slot Utilities](./equipslotutil.md) | stable | Current equipment slot management utilities |

## Core Action Modules

### [Core Actions](./actions.md)
Fundamental action definitions and execution framework for all player interactions.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Action Class](./actions.md#action) | stable | Action template definition system | Priority system, distance checking, validity constraints |
| [Action Definitions](./actions.md#core-actions) | stable | 100+ predefined actions | Basic interactions, tool actions, combat, ocean systems |
| [Range Checking](./actions.md#range-check-functions) | stable | Distance validation utilities | Custom range functions, physics-based checking |
| [Execution Framework](./actions.md#action-execution-functions) | stable | Action execution engine | Success/failure handling, component interaction |

**Action Categories:**
- **Basic Interactions**: Pickup, drop, equip, examine, talk, walk
- **Tool Actions**: Chop, mine, dig, hammer, attack, net fishing
- **Fire and Light**: Light, extinguish, stoke fires, add fuel
- **Ocean Actions**: Ocean fishing, boat rowing, platform interactions
- **High Priority**: Map actions, teleportation, deploy mode toggle

### [Buffered Actions](./bufferedaction.md)
Deferred action execution system with validation and callback management.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [BufferedAction Class](./bufferedaction.md#bufferedaction-class) | stable | Queued action container | Parameter preservation, state validation |
| [Validation System](./bufferedaction.md#validation-system) | stable | Action prerequisite checking | Entity validity, component state, ownership |
| [Callback Management](./bufferedaction.md#callback-management) | stable | Success/failure handling | Callback registration, execution, cleanup |
| [Position Management](./bufferedaction.md#position-management) | stable | Dynamic position handling | Static positions, moving targets, platform coordination |

**Buffering Capabilities:**
- **Action Queuing**: Prepare actions for later execution with preserved context
- **State Validation**: Comprehensive prerequisite checking before execution
- **Callback System**: Success/failure notification with automatic cleanup
- **Dynamic Positioning**: Support for moving targets and platform-relative positioning

### [Component Actions](./componentactions.md)
Component-based action discovery and registration system for entity interactions.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Action Types](./componentactions.md#action-types) | stable | 6 interaction categories | Scene, use item, point, equipped, inventory, validation |
| [Registration System](./componentactions.md#core-functions) | stable | Component action management | Register/unregister, automatic discovery |
| [Mod Support](./componentactions.md#mod-support) | stable | Custom component actions | Mod registration, network synchronization |
| [Helper Functions](./componentactions.md#helper-functions) | stable | Specialized action utilities | Fishing validation, rowing, plant research |

**Component Action Types:**
- **SCENE**: Direct world object interactions without items
- **USEITEM**: Using inventory items on target entities
- **POINT**: Using items on specific world positions
- **EQUIPPED**: Actions available when items are equipped
- **INVENTORY**: Actions for items in inventory
- **ISVALID**: Validation functions for action availability

### [Equip Slot Utilities](./equipslotutil.md)
Equipment slot identifier management and conversion utilities.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Slot Conversion](./equipslotutil.md#to-id) | stable | Name/ID conversion system | String to numeric ID, ID to string |
| [Slot Management](./equipslotutil.md#count) | stable | Equipment slot enumeration | Total slot counting, mod compatibility |
| [Initialization](./equipslotutil.md#initialize) | stable | Setup and configuration | Mod integration, deterministic ordering |

**Utility Features:**
- **Networking Optimization**: Compact numeric IDs for efficient data transmission
- **Mod Compatibility**: Support for mod-added equipment slots (max 63 slots)
- **Deterministic Ordering**: Consistent slot numbering across clients

## Common Action Patterns

### Basic Action Execution
```lua
-- Standard action execution pattern
local action = ACTIONS.CHOP
local tree = GetClosestEntity(player, 10, nil, {"tree"})
local axe = player.components.inventory:GetActiveItem()

if tree and axe and axe:HasTag("axe") then
    local buffered_action = BufferedAction(player, tree, action, axe)
    
    if buffered_action:IsValid() then
        local success = buffered_action:Do()
        if success then
            print("Tree chopped successfully!")
        end
    end
end
```

### Component Action Discovery
```lua
-- Discover available actions for an entity
local function GetEntityActions(entity, player, right_click)
    local actions = {}
    entity:CollectActions("SCENE", player, actions, right_click)
    
    -- Check for equipped item actions
    local equipped_item = player.components.inventory:GetEquippedItem(EQUIPSLOTS.HANDS)
    if equipped_item then
        entity:CollectActions("EQUIPPED", equipped_item, player, actions, right_click)
    end
    
    return actions
end

-- Usage example
local available_actions = GetEntityActions(target_entity, player, false)
for _, action in ipairs(available_actions) do
    print("Available action:", action.id)
end
```

### Custom Action Registration
```lua
-- Register custom component action for mods
AddComponentAction("SCENE", "mycomponent", function(inst, doer, actions, right)
    if inst:HasTag("my_interactive_tag") and not inst:HasTag("burnt") then
        if right and inst:HasTag("right_clickable") then
            table.insert(actions, ACTIONS.MY_RIGHT_ACTION)
        elseif not right and inst:HasTag("left_clickable") then
            table.insert(actions, ACTIONS.MY_LEFT_ACTION)
        end
    end
end, "MyModName")
```

### Advanced Action Validation
```lua
-- Create action with comprehensive validation
local function CreateValidatedAction(doer, target, action_type, tool)
    local buffered_action = BufferedAction(doer, target, action_type, tool)
    
    -- Add custom validation
    buffered_action.validfn = function(action)
        -- Check time of day
        if action_type == ACTIONS.SLEEP and not TheWorld.state.isnight then
            return false, "Can only sleep at night"
        end
        
        -- Check player status
        if doer.components.health:GetPercent() < 0.5 and action_type == ACTIONS.WORK then
            return false, "Too injured to work"
        end
        
        -- Check tool durability
        if tool and tool.components.finiteuses then
            local uses_left = tool.components.finiteuses:GetUses()
            if uses_left <= 0 then
                return false, "Tool is broken"
            end
        end
        
        return true
    end
    
    -- Add completion callbacks
    buffered_action:AddSuccessAction(function()
        doer.components.talker:Say("Action completed!")
    end)
    
    buffered_action:AddFailAction(function()
        doer.components.talker:Say("Action failed!")
    end)
    
    return buffered_action
end
```

### Equipment Slot Management
```lua
-- Equipment slot utilities usage
local equipslotutil = require("equipslotutil")

-- Initialize system (called once during world setup)
equipslotutil.Initialize()

-- Convert between slot names and IDs
local hands_id = equipslotutil.ToID("hands")
local head_id = equipslotutil.ToID("head")

-- Network-friendly slot identification
local function GetEquippedItemInSlot(player, slot_name)
    local slot_id = equipslotutil.ToID(slot_name)
    if slot_id then
        return player.components.inventory:GetEquippedItem(equipslotutil.FromID(slot_id))
    end
    return nil
end

-- Enumerate all equipment slots
local total_slots = equipslotutil.Count()
for i = 1, total_slots do
    local slot_name = equipslotutil.FromID(i)
    print("Slot", i, ":", slot_name)
end
```

## Action System Dependencies

### Required Systems
- [Fundamentals Core](../core/index.md): Entity and component framework for action targets
- [User Interface](../../user-interface/index.md): Input handling and action triggering
- [Networking](../../networking-communication/index.md): Action synchronization between clients

### Optional Systems
- [World Systems](../../world-systems/index.md): Environmental context for position-based actions
- [Character Systems](../../character-systems/index.md): Player stats and capabilities affecting actions
- [Game Mechanics](../../game-mechanics/index.md): Specific gameplay interactions using action framework

## Performance Considerations

### Action Discovery Optimization
- Component actions use efficient tag-based filtering to minimize unnecessary checks
- Action registration uses numeric IDs for fast component lookup and network efficiency
- Validation functions cache results for expensive checks when appropriate

### Memory Management
- Buffered actions clean up callbacks automatically after execution
- Component action functions are shared across entities with same components
- Equipment slot utilities use compact numeric representations for networking

### Network Efficiency
- Action component IDs limited to 255 types for 8-bit network transmission
- Equipment slot system supports maximum 63 slots for efficient bit manipulation
- Action validation minimizes network round-trips through client-side prereq checking

## Development Guidelines

### Best Practices
- Always validate actions before execution using `IsValid()` method
- Use component actions for automatic action discovery rather than hardcoding
- Include proper success/failure callbacks for user feedback and error handling
- Consider both left-click and right-click contexts when designing interactions
- Test actions in both single-player and multiplayer environments for consistency

### Common Pitfalls
- Forgetting to handle edge cases like burned, broken, or invalid entities
- Not considering player state restrictions (mounted, carrying, ghost mode)
- Creating actions without proper distance and range validation
- Implementing actions that work only on client or server side
- Bypassing the component action system for entity-specific hardcoded interactions

### Testing Strategies
- Test all action combinations with various entity states and player conditions
- Verify action behavior with different tool types and durability levels
- Test action discovery and execution in multiplayer with network latency
- Validate custom component actions work correctly with mod loading order
- Ensure equipment slot utilities handle mod-added slots properly

## Action Integration Workflows

### Player Interaction Workflow
1. **Input Detection**: Player input triggers action discovery
2. **Action Discovery**: Component actions collect available interactions
3. **Action Selection**: UI presents options and player selects action
4. **Action Validation**: System checks prerequisites and requirements
5. **Action Execution**: Buffered action executes with proper validation
6. **Result Handling**: Success/failure callbacks provide feedback

### Component Action Registration
1. **Component Creation**: New component implements action functions
2. **Action Registration**: Component registers with action system
3. **Network Synchronization**: Registration syncs to all clients
4. **Action Discovery**: System automatically includes component actions
5. **Action Execution**: Actions execute through standard framework

### Custom Action Development
1. **Action Definition**: Create action template with properties
2. **Component Integration**: Implement component action functions
3. **Validation Logic**: Add prerequisite checking and validation
4. **Execution Function**: Implement action effect and state changes
5. **Testing**: Verify action works in all supported contexts

## Troubleshooting Action Issues

### Common Action Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Actions not appearing | Right-click menu empty | Check component registration and tags |
| Action validation failing | Actions grayed out | Verify prerequisites and entity state |
| Network desync | Actions work locally but not multiplayer | Check client-server validation consistency |
| Equipment not recognized | Tool actions unavailable | Verify equipment slot registration |
| Performance issues | Action discovery slow | Optimize component action functions |

### Debugging Action System
- Use debug console commands to inspect entity action components
- Check action validation step-by-step with custom validation functions
- Monitor network traffic for action synchronization issues
- Verify equipment slot mappings with utility debug functions

### Action Development Best Practices
- Start with simple actions and gradually add complexity
- Use existing action patterns as templates for new implementations
- Test actions with various entity states and combinations
- Document action requirements and limitations clearly
- Consider backward compatibility when modifying existing actions

## Related Systems

- [Core Systems](../../index.md): Integration with all major game systems
- [Fundamentals](../index.md): Base entity and component framework
- [Components](../../../components/index.md): Entity components that actions interact with
- [Stategraphs](../../../stategraphs/index.md): Animation system coordinated with actions
- [User Interface](../../user-interface/index.md): Action presentation and input handling

## Success Metrics

- **Interaction Reliability**: Actions execute consistently across all game contexts
- **Development Efficiency**: Component action system enables rapid creation of new interactions
- **Network Performance**: Action synchronization maintains responsiveness in multiplayer
- **Mod Compatibility**: Custom actions integrate seamlessly with base game systems

---

*The Actions system provides the essential foundation for all player interactions in DST through comprehensive action definitions, component-based discovery, buffered execution, and robust validation mechanisms.*
