---
id: fundamentals-core-overview
title: Core Fundamentals Overview
description: Overview of core foundation systems and infrastructure in DST API
sidebar_position: 0
slug: game-scripts/core-systems/fundamentals/core
last_updated: 2025-01-27
build_version: 676042
change_status: stable
category_type: infrastructure-system
system_scope: core foundation systems and infrastructure
---

# Core Fundamentals Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-01-27**

## System Purpose

The Core Fundamentals category provides the essential foundation infrastructure that underlies all game functionality in Don't Starve Together. These systems implement the fundamental object-oriented programming framework, entity management architecture, network synchronization infrastructure, and standard component creation utilities that enable all higher-level game features.

### Key Responsibilities
- Object-oriented programming framework with inheritance and property management
- Core entity lifecycle management and component system architecture
- Network synchronization infrastructure for client-server communication
- Proxy system for safe entity access and memory management
- Standard component creation utilities and common patterns
- Advanced class system with enhanced garbage collection control

### System Scope
This category includes the lowest-level programming infrastructure but excludes specific gameplay components (handled by Game Mechanics) and high-level utilities (handled by other Fundamentals modules).

## Architecture Overview

### System Components
Core fundamentals are organized as layered infrastructure where basic class systems provide the foundation for entity management, which in turn enables component systems and network synchronization.

### Data Flow
```
Class System → Entity Creation → Component Management → Network Sync
     ↓              ↓                    ↓                 ↓
Object Creation → Entity Script → Component Proxy → Replica System
```

### Integration Points
- **All Game Systems**: Every system builds upon these core fundamentals
- **Component Framework**: Components use the class and entity systems
- **Network Architecture**: Client-server synchronization uses replica system
- **Memory Management**: Proxy system provides safe reference handling

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-01-27 | [EntityScript](./entityscript.md) | stable | Current entity management system |
| 676042 | 2025-01-27 | [Entity Replica](./entityreplica.md) | stable | Current network synchronization |
| 676042 | 2025-01-27 | [Class System](./class.md) | stable | Current object-oriented framework |

## Core Infrastructure Modules

### [Class System](./class.md)
Object-oriented programming foundation with inheritance and property management.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Class](./class.md) | stable | OOP framework with inheritance | Property setters, read-only properties, instance tracking |
| [MetaClass](./metaclass.md) | stable | Advanced class system with userdata | Enhanced garbage collection, custom metamethods |

### [Entity Management](./entityscript.md)
Core entity lifecycle and component management infrastructure.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [EntityScript](./entityscript.md) | stable | Core entity class and lifecycle | Component management, events, state control |
| [EntityScript Proxy](./entityscriptproxy.md) | stable | Safe entity access wrapper | Memory management, controlled access, reference safety |

### [Network Infrastructure](./entityreplica.md)
Client-server synchronization and component replication systems.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Entity Replica System](./entityreplica.md) | stable | Network component synchronization | Client-server sync, replica management, tag system |

### [Component Utilities](./standardcomponents.md)
Standard component creation patterns and common configurations.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Standard Components](./standardcomponents.md) | stable | Component creation utilities | Burnable makers, physics setup, hauntable patterns |

## Common Infrastructure Patterns

### Class-Based Entity Creation
```lua
-- Define custom entity class
local CustomEntity = Class(function(self, data)
    self.custom_data = data
    self.initialized = false
end)

function CustomEntity:Initialize()
    self.initialized = true
end

-- Create instance
local entity = CustomEntity({value = 42})
entity:Initialize()
```

### Component Management Pattern
```lua
-- Standard entity setup with components
local inst = CreateEntity()

-- Add core components
inst:AddComponent("health")
inst:AddComponent("inventory")

-- Access components safely
if inst.components.health then
    inst.components.health:SetMaxHealth(100)
end
```

### Network Synchronization Pattern
```lua
-- Server: Component automatically replicates
inst:AddComponent("health")

-- Client: Access replica data
inst:ListenForEvent("healthdelta", function(inst, data)
    local health_replica = inst.replica.health
    if health_replica then
        UpdateHealthUI(health_replica:GetPercent())
    end
end)
```

## Infrastructure Dependencies

### Required Systems
- [System Core](../../system-core/index.md): Engine integration and low-level services
- [Memory Management](../utilities/index.md): Garbage collection and reference tracking

### Optional Systems
- [Development Tools](../../development-tools/index.md): Debug infrastructure for core systems
- [Data Management](../../data-management/index.md): Persistence support for entity data

## Performance Considerations

### System Performance
- Class system uses metatable chains for method resolution with minimal overhead
- Entity management optimizes component access through direct table lookups
- Proxy system caches references to minimize allocation overhead
- Replica system batches network updates to reduce bandwidth usage

### Resource Usage
- Class instances use standard Lua table memory with optional tracking
- MetaClass instances use userdata for enhanced garbage collection control
- Entity proxies share metadata between instances of the same class
- Network replicas maintain synchronized state with automatic cleanup

### Scaling Characteristics
- Class system scales linearly with object count
- Entity management handles thousands of concurrent entities efficiently
- Proxy system memory usage scales with unique proxy types, not instances
- Network synchronization scales with active players and replicated components

## Development Guidelines

### Best Practices
- Always use Class system for object-oriented code organization
- Access entity components through validation checks for robustness
- Use proxy system for safe entity interfaces between subsystems
- Implement proper cleanup in constructors and destructors
- Follow standard component patterns for consistency

### Common Pitfalls
- Creating circular references between entities and custom objects
- Bypassing component validation for direct property access
- Not cleaning up event listeners when entities are removed
- Overriding metamethods without understanding garbage collection implications
- Implementing custom network synchronization instead of using replica system

### Testing Strategies
- Test class inheritance chains with multiple levels
- Verify entity lifecycle from creation through removal
- Test proxy behavior with invalid or removed entities
- Validate network synchronization under various connection conditions
- Performance test with large numbers of entities and components

## Core System Integration

### With Component Framework
Core fundamentals provide the infrastructure that enables the component system:
- Class system defines component base classes and inheritance
- EntityScript manages component lifecycle and attachment
- Replica system synchronizes component state across network
- Standard utilities provide common component configuration patterns

### With Game Systems
All game systems depend on core fundamentals:
- Character systems use EntityScript for player and NPC entities
- Game mechanics rely on component management for functionality
- World systems use entity infrastructure for environmental objects
- User interface systems access entity data through proxy mechanisms

### With Network Architecture
Core systems enable multiplayer functionality:
- Entity replica system synchronizes game state between server and clients
- Component replication ensures consistent data across connections
- Proxy system provides safe access to potentially remote objects
- Event system supports both local and network-distributed notifications

## Advanced Infrastructure Features

### Memory Management
- Weak reference tables prevent memory leaks in circular structures
- Proxy reference counting optimizes memory usage
- Instance tracking supports development-time memory debugging
- Garbage collection hooks enable custom cleanup behaviors

### Hot Reloading Support
- Class registry enables safe reloading of class definitions
- Entity proxy system maintains stability during code updates
- Component system supports adding/removing functionality dynamically
- Network synchronization adapts to changing component configurations

### Error Handling
- Validation functions ensure type safety in critical paths
- Proxy system provides graceful degradation for invalid references
- Component access includes existence checks and error recovery
- Network synchronization handles connection failures transparently

## Troubleshooting Core Infrastructure

### Common Infrastructure Issues
| Issue | Symptoms | Solution |
|----|----|----|
| Memory leaks in class instances | Increasing memory usage over time | Check for circular references, enable instance tracking |
| Entity component access errors | Nil component access crashes | Use validation before component access |
| Network synchronization failures | Inconsistent state between clients | Verify replica component configuration |
| Proxy reference issues | Stale proxy data or access errors | Ensure proper proxy lifecycle management |

### Debugging Infrastructure
- Enable class instance tracking for memory analysis
- Use entity debug strings for component inspection
- Monitor replica synchronization with network debug tools
- Check proxy reference counts for memory leak detection

### Performance Monitoring
```lua
-- Monitor class instance counts
HandleClassInstanceTracking() -- Reports top classes by instance count

-- Debug entity state
print(inst:GetDebugString()) -- Shows component status and data

-- Check replica synchronization
local replica = inst.replica.health
local validated = inst:ValidateReplicaComponent("health", replica)
```

## Future Development Considerations

### Extensibility Design
- Class system supports unlimited inheritance depth
- Component framework accommodates new component types
- Proxy system adapts to any object type with metatable support
- Network replication extends to new component categories

### Integration Planning
- New game systems should build upon existing core infrastructure
- Custom networking should use replica system rather than reimplementation
- Memory-sensitive systems should leverage proxy patterns
- Performance-critical code should understand class system overhead

### Maintenance Strategy
- Core infrastructure changes require extensive compatibility testing
- Performance improvements should maintain API compatibility
- Memory management updates need careful garbage collection analysis
- Network protocol changes must handle version compatibility

## Contributing to Core Infrastructure

### Modification Guidelines
- Core infrastructure changes affect all systems
- Maintain backward compatibility for existing game code
- Performance changes require benchmarking across representative workloads
- Memory management modifications need thorough leak testing

### Code Review Standards
- All changes require understanding of system-wide impact
- Performance implications must be documented and measured
- Memory safety must be verified through stress testing
- Network synchronization changes need multiplayer validation

### Testing Requirements
- Unit tests for class system behavior and inheritance
- Integration tests for entity lifecycle management
- Performance tests for large-scale entity operations
- Network tests for replica synchronization under various conditions
