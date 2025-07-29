---
id: fundamentals-overview
title: Fundamentals Overview
description: Overview of foundational infrastructure and core systems in DST API
sidebar_position: 0
slug: game-scripts/core-systems/fundamentals
last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: infrastructure-system
system_scope: foundational infrastructure and core systems
---

# Fundamentals Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Fundamentals category provides the essential foundational infrastructure that underlies all game functionality in Don't Starve Together. These systems implement the core programming frameworks, entity management architecture, AI infrastructure, player interaction systems, and utility functions that enable all higher-level game features and mechanics.

### Key Responsibilities
- Provide foundational programming infrastructure including object-oriented frameworks and entity management
- Implement comprehensive player interaction systems through actions and component-based behaviors
- Enable sophisticated AI systems through brain management and behavior trees
- Supply essential utility functions for mathematical operations, string processing, and performance monitoring
- Support modular component architecture for extensible game functionality
- Ensure reliable network synchronization and client-server communication

### System Scope
This category includes all foundational programming infrastructure, core entity systems, AI frameworks, and utility functions, but excludes specific gameplay mechanics (handled by Game Mechanics) and high-level specialized systems (handled by other Core Systems categories).

## Architecture Overview

### System Components
The Fundamentals are organized as layered infrastructure where core programming foundations enable entity management, which supports AI systems and player interactions, all utilizing shared utility functions:

```
Utility Functions → Core Infrastructure → AI Systems → Player Interactions
       ↓                  ↓                ↓               ↓
Math/String/Vector → Entity Management → Brain/Behavior → Actions/Components
```

### Data Flow
```
Low-Level Services → Core Systems → AI Frameworks → Player Input
        ↓                ↓              ↓              ↓
Engine Integration → Entity Scripts → Behavior Trees → Action Execution
```

### Integration Points
- **All Game Systems**: Every system in DST builds upon these fundamental infrastructures
- **Component Framework**: All components use the core entity and class systems
- **Network Architecture**: Client-server communication uses the replica and proxy systems
- **Performance Management**: Global coordination of AI and entity updates for optimal performance

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Actions](./actions/index.md) | stable | Current player interaction system |
| 676042 | 2025-06-21 | [AI Systems](./ai-systems/index.md) | stable | Current AI infrastructure |
| 676042 | 2025-06-21 | [Core](./core/index.md) | stable | Current foundational systems |
| 676042 | 2025-06-21 | [Utilities](./utilities/index.md) | stable | Current utility functions |

## Core Infrastructure Modules

### [Actions](./actions/index.md)
Player interaction and entity action systems for all game behaviors.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Core Actions](./actions/actions.md) | stable | Action definitions and execution framework | 100+ predefined actions, priority system, validation |
| [Buffered Actions](./actions/bufferedaction.md) | stable | Deferred action execution system | Queuing, validation, callback management |
| [Component Actions](./actions/componentactions.md) | stable | Component-based action discovery | Automatic action detection, mod support |
| [Equip Slot Utilities](./actions/equipslotutil.md) | stable | Equipment slot management | Name/ID conversion, networking optimization |

### [AI Systems](./ai-systems/index.md)
Artificial intelligence infrastructure and behavior management frameworks.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Brain System](./ai-systems/brain.md) | stable | Global AI management and coordination | Performance optimization, sleep/wake cycles |
| [Behaviour Trees](./ai-systems/behaviourtree.md) | stable | Hierarchical decision-making framework | Modular nodes, performance optimization |
| [Stategraphs](./ai-systems/stategraph.md) | stable | State machine system for behaviors | Animation coordination, event handling |

### [Core](./core/index.md)
Foundational programming infrastructure and entity management systems.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Class System](./core/class.md) | stable | Object-oriented programming framework | Inheritance, property management, tracking |
| [EntityScript](./core/entityscript.md) | stable | Core entity lifecycle management | Component system, events, state control |
| [Entity Replica](./core/entityreplica.md) | stable | Network synchronization infrastructure | Client-server sync, component replication |
| [Entity Proxy](./core/entityscriptproxy.md) | stable | Safe entity access wrapper | Memory management, controlled access |

### [Utilities](./utilities/index.md)
Essential utility functions and helper systems for all game operations.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [General Utilities](./utilities/util.md) | stable | Table manipulation, string processing | Data structures, random selection, debugging |
| [Math Utilities](./utilities/mathutil.md) | stable | Mathematical calculations and interpolation | Wave generation, lerp functions, angles |
| [Vector Mathematics](./utilities/vector3.md) | stable | 3D vector operations and calculations | Object-oriented and performance-optimized |
| [Performance Utilities](./utilities/perfutil.md) | stable | Performance monitoring and diagnostics | Entity counting, profiling, optimization |
| [Simulation Utilities](./utilities/simutil.md) | stable | Entity finding and position validation | Search functions, walkable positions |

## Common Infrastructure Patterns

### Entity and Component Foundation
```lua
-- Standard entity creation with components
local inst = CreateEntity()

-- Add foundational components
inst:AddComponent("health")
inst:AddComponent("inventory")

-- Safe component access
if inst.components.health then
    inst.components.health:SetMaxHealth(100)
end
```

### Action System Integration
```lua
-- Discover available actions for entity interaction
local actions = {}
target_entity:CollectActions("SCENE", player, actions, false)

-- Execute action with validation
local buffered_action = BufferedAction(player, target, ACTIONS.CHOP, tool)
if buffered_action:IsValid() then
    local success = buffered_action:Do()
end
```

### AI System Architecture
```lua
-- Set up AI with brain and behavior tree
local brain = require("brains/custombrain")
inst:AddComponent("brain")
inst.components.brain:SetBrain(brain)

-- Brain integrates with global AI manager automatically
```

### Utility Function Usage
```lua
-- Mathematical operations
local interpolated = Lerp(start_value, end_value, progress)
local distance_sq = distsq(pos1, pos2)

-- Entity finding with utilities
local entity = FindEntity(inst, radius, filter_fn, must_tags, cant_tags)

-- Vector operations (performance vs readability)
local direction = (target_pos - start_pos):GetNormalized() -- Vector3 class
local x, y, z = Vec3Util_Normalize(dx, dy, dz) -- Performance optimized
```

## Infrastructure Dependencies

### Required Systems
- [System Core](../system-core/index.md): Engine integration and low-level services providing platform abstraction
- [Data Management](../data-management/index.md): Persistent data storage for entity state and configuration

### Optional Systems
- [User Interface](../user-interface/index.md): Action presentation and input handling for player interactions
- [Networking](../networking-communication/index.md): Enhanced multiplayer support and synchronization
- [Development Tools](../development-tools/index.md): Debugging infrastructure and performance analysis

## Performance Considerations

### System Performance
- AI systems implement sophisticated sleep/wake cycles to optimize CPU usage across thousands of entities
- Action discovery uses efficient tag-based filtering and component registration for minimal overhead
- Entity management optimizes component access through direct table lookups and proxy caching
- Utility functions provide both performance-optimized and developer-friendly variants for different use cases

### Resource Usage
- Core systems use standard Lua table memory with optional instance tracking for development
- AI infrastructure scales memory usage with entity count and behavior complexity
- Network synchronization maintains synchronized state with automatic cleanup and batching
- Utility functions avoid unnecessary object creation in performance-critical code paths

### Scaling Characteristics
- Entity system handles thousands of concurrent entities with linear performance scaling
- AI management adapts update frequency based on entity proximity and importance
- Action system scales efficiently with proper component registration and tag usage
- Utility functions maintain consistent performance regardless of game state or entity count

## Development Guidelines

### Best Practices
- Always use the Class system for object-oriented code organization and inheritance
- Access entity components through validation checks to ensure robustness
- Implement proper AI sleep strategies for expensive operations to maintain performance
- Use appropriate utility functions for each domain (math, string, vector operations)
- Follow component-based architecture patterns for modular and extensible functionality
- Leverage the action system for consistent player interaction handling

### Common Pitfalls
- Creating circular references between entities and custom objects without proper cleanup
- Bypassing component validation for direct property access leading to runtime errors
- Implementing custom AI logic without utilizing the brain management system
- Using object-oriented vector operations in performance-critical loops
- Not considering multiplayer synchronization requirements when developing features
- Ignoring the action discovery system and hardcoding entity-specific interactions

### Testing Strategies
- Test entity lifecycle from creation through component attachment to removal
- Verify AI behavior under various performance conditions and entity counts
- Validate action system behavior with different entity states and player conditions
- Test utility functions with edge cases including zero, negative, and infinity values
- Performance test with large numbers of entities and concurrent operations
- Ensure network synchronization works correctly under various connection conditions

## Infrastructure Integration Workflows

### Entity Development Workflow
1. **Entity Creation**: Use CreateEntity() and standard component attachment patterns
2. **Component Integration**: Add components through validated attachment and access patterns
3. **Action Discovery**: Implement component actions for automatic interaction detection
4. **AI Integration**: Add brain component for sophisticated behavior management
5. **Testing**: Validate entity lifecycle and component interactions

### AI Development Workflow
1. **Brain Design**: Create custom brain inheriting from Brain class
2. **Behavior Trees**: Implement hierarchical decision-making using node composition
3. **Performance Optimization**: Add proper sleep strategies and hibernation support
4. **Integration**: Connect with action system and component interactions
5. **Validation**: Test AI behavior across different game scenarios

### Utility Integration Workflow
1. **Function Selection**: Choose appropriate utilities for mathematical, string, or vector operations
2. **Performance Consideration**: Select between object-oriented and functional approaches
3. **Error Handling**: Implement proper validation and error recovery patterns
4. **Optimization**: Cache expensive calculations and use squared distance where appropriate
5. **Testing**: Validate utility usage with representative data and edge cases

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [Game Mechanics](../game-mechanics/index.md) | Consumer | Uses fundamental infrastructure for gameplay features |
| [Character Systems](../character-systems/index.md) | Consumer | Builds on entity and component systems for character management |
| [World Systems](../world-systems/index.md) | Consumer | Leverages entity infrastructure for environmental objects |
| [User Interface](../user-interface/index.md) | Integration | Action presentation and input handling coordination |

## Troubleshooting Infrastructure Issues

### Common Infrastructure Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Entity component access errors | Nil component crashes or undefined behavior | Use component validation before access |
| AI performance problems | Frame rate drops with many entities | Implement proper sleep strategies and hibernation |
| Action discovery failures | Missing or incorrect player interactions | Check component registration and tag configuration |
| Memory leaks in custom objects | Increasing memory usage over time | Verify proper cleanup and avoid circular references |
| Network synchronization issues | Inconsistent state between clients | Use replica system instead of custom networking |

### Debugging Infrastructure
- Use class instance tracking for memory analysis and leak detection
- Apply entity debug strings for component inspection and state validation
- Monitor AI performance with brain manager statistics and entity distribution
- Leverage performance utilities for entity counting and system profiling
- Check action discovery with component action debugging and validation

### Performance Monitoring
```lua
-- Monitor foundational system performance
CountEntities() -- Track total entity count
local brain_stats = BrainManager:GetStats() -- AI performance monitoring
local profile_data = GetProfilerMetaData() -- System profiling information

-- Entity and component debugging
print(inst:GetDebugString()) -- Component status and state
local actions = {} -- Test action discovery
inst:CollectActions("SCENE", player, actions, false)
```

## Future Development Considerations

### Infrastructure Extensibility
- Core systems support unlimited extension through component and class frameworks
- AI infrastructure accommodates new behavior patterns and decision-making algorithms
- Action system scales to support new interaction types and component behaviors
- Utility functions provide extensible patterns for new mathematical and processing needs

### Integration Planning
- New game systems should build upon existing foundational infrastructure
- Custom functionality should leverage component patterns rather than parallel architectures
- Performance-critical systems should understand and utilize optimization patterns
- Network-dependent features should use replica system for consistency

### Maintenance Strategy
- Infrastructure changes require extensive compatibility testing across all dependent systems
- Performance improvements should maintain API compatibility while enhancing efficiency
- Memory management updates need careful analysis of garbage collection and reference patterns
- Documentation must remain current with both API changes and usage patterns

## Contributing to Fundamental Infrastructure

### Modification Guidelines
- Changes to fundamental infrastructure affect all game systems and require careful analysis
- Maintain backward compatibility for existing game code and mod integrations
- Performance modifications require benchmarking across representative workloads
- Memory safety must be verified through stress testing and leak detection

### Code Review Standards
- All infrastructure changes require understanding of system-wide impact and dependencies
- Performance implications must be documented, measured, and validated
- API changes must provide migration paths for existing code
- Network synchronization changes need thorough multiplayer testing

### Testing Requirements
- Unit tests for core class system behavior and inheritance patterns
- Integration tests for entity lifecycle management and component interactions
- Performance tests for large-scale operations and entity management
- Network tests for replica synchronization under various conditions
- AI tests for behavior tree execution and brain management performance

---

*The Fundamentals provide the essential infrastructure foundation that enables all DST functionality through robust entity management, sophisticated AI systems, comprehensive action frameworks, and performance-optimized utility functions.*
