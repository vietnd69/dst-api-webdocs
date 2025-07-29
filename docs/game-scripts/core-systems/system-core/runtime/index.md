---
id: runtime-overview
title: Runtime System Overview  
description: Overview of runtime process management, update loops, and task scheduling infrastructure in DST API
sidebar_position: 0

last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: infrastructure-system
system_scope: runtime process management and execution control
---

# Runtime System Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Runtime System provides the core process management infrastructure that controls execution timing, update loops, and task scheduling throughout Don't Starve Together. This system manages the fundamental execution environment that drives all game simulation, ensuring proper timing relationships between different system components and maintaining consistent performance across various execution contexts.

### Key Responsibilities
- Game simulation timing and update loop management
- Component update registration and lifecycle control
- Wall time vs simulation time coordination
- Task scheduling and execution priority management
- Process timing for game state transitions and long operations

### System Scope
This infrastructure category includes runtime execution control, update loop management, and process scheduling, but excludes specific game logic implementations, content-specific timing, and user interface update handling.

## Architecture Overview

### System Components
The Runtime System is organized as a multi-layered execution management infrastructure where timing control forms the foundation, update loops provide the execution framework, and component registration enables modular system participation.

### Data Flow
```
Timing Control → Update Loop Management → Component Registration → Execution Dispatch
       ↓                    ↓                        ↓                     ↓
   Time Sources → Update Type Routing → Component Callbacks → System Updates
```

### Integration Points
The Runtime System serves as the execution foundation for all game systems:
- **Engine System**: Provides timing services for entity management and physics
- **Character Systems**: Manages update cycles for character components and behavior
- **Game Mechanics**: Controls timing for gameplay systems and rule enforcement
- **User Interface**: Coordinates wall time updates for responsive UI elements
- **World Systems**: Manages simulation time for world state progression

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Update System](./update.md) | stable | Core update loop and component timing system |

## Core Infrastructure Modules

### [Update System](./update.md)
Core update loop system that handles game simulation timing and component updates.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Update System](./update.md) | stable | Update loop and timing management | Wall time updates, simulation updates, component registration |

## Common Infrastructure Patterns

### Component Update Registration Pattern
```lua
-- Standard component update lifecycle
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self.update_timer = 0
    self:StartUpdating()
end)

function MyComponent:OnUpdate(dt)
    -- Simulation time update
    self.update_timer = self.update_timer + dt
    if self.update_timer >= self.update_interval then
        self:ProcessUpdate()
        self.update_timer = 0
    end
end

function MyComponent:StartUpdating()
    StartUpdatingComponent(self, self.inst)
end

function MyComponent:StopUpdating()
    StopUpdatingComponent(self, self.inst)
end
```

### Wall Time Update Pattern
```lua
-- Real-time updates for UI and input
function MyComponent:OnWallUpdate(dt)
    -- Always runs, even when game is paused
    self.wall_timer = self.wall_timer + dt
    
    -- Update UI elements that need real-time responsiveness
    if self.needs_ui_update then
        self:UpdateUserInterface()
    end
    
    -- Process input even during pause
    self:ProcessUserInput()
end

function MyComponent:StartWallUpdating()
    StartWallUpdatingComponent(self, self.inst)
end
```

### Multi-Update Type Management Pattern
```lua
-- Component using multiple update types
local AdvancedComponent = Class(function(self, inst)
    self.inst = inst
    self.simulation_timer = 0
    self.wall_timer = 0
    self.is_paused = false
    
    -- Register for different update types
    self:StartUpdating()        -- Simulation updates
    self:StartWallUpdating()    -- Wall time updates
    self:StartStaticUpdating()  -- Paused updates
end)

function AdvancedComponent:OnUpdate(dt)
    -- Game simulation logic
    self.simulation_timer = self.simulation_timer + dt
    self:ProcessGameLogic()
end

function AdvancedComponent:OnWallUpdate(dt)
    -- Real-time processing
    self.wall_timer = self.wall_timer + dt
    self:ProcessRealTimeOperations()
end

function AdvancedComponent:OnStaticUpdate(dt)
    -- Operations during pause (dt is always 0)
    if self.should_continue_when_paused then
        self:ProcessPausedOperations()
    end
end

function AdvancedComponent:OnLongUpdate(dt)
    -- Handle time skipping operations
    local skip_amount = dt
    self:AdvanceSimulationState(skip_amount)
end
```

### Long Update Time Skipping Pattern
```lua
-- Time skipping for cave transitions or night skip
local function SkipTime(world, skip_duration, ignore_players)
    -- Skip forward in simulation time
    world:LongUpdate(skip_duration, ignore_players)
    
    -- Update all systems that need to catch up
    for _, component in pairs(world.components) do
        if component.OnLongUpdate then
            component:OnLongUpdate(skip_duration)
        end
    end
end

-- Advanced time skip with validation
local function SafeTimeSkip(duration, validation_callback)
    local original_time = GetTime()
    
    TheWorld:LongUpdate(duration, true)
    
    if validation_callback then
        local success = validation_callback()
        if not success then
            -- Rollback mechanism if needed
            print("Time skip validation failed")
        end
    end
    
    print("Skipped", duration, "seconds of game time")
end
```

## Infrastructure Dependencies

### Required Systems
- **Engine Core**: Low-level timing and execution framework
- **Lua Runtime**: Script execution environment and memory management
- **Platform Threading**: OS-level timing and process management

### Optional Systems  
- **Profiling System**: Performance measurement and optimization integration
- **Debug Systems**: Development timing analysis and debugging support
- **Metrics Collection**: Runtime performance data gathering

## Performance Considerations

### System Performance
Runtime infrastructure is optimized for consistent execution timing:
- Update loops use efficient component iteration with minimal overhead
- Component registration uses fast lookup tables for update dispatch
- Time management maintains stable frame rates across varying system loads
- Priority-based update scheduling ensures critical systems get execution preference

### Resource Usage
- **CPU Optimization**: Update loops batch operations to minimize context switching
- **Memory Management**: Component registration tables use weak references for automatic cleanup
- **Timing Precision**: High-resolution timers ensure accurate simulation stepping

### Scaling Characteristics
Runtime infrastructure scales efficiently with system complexity:
- Component update system handles thousands of registered components
- Update type routing supports multiple concurrent timing domains
- Long update operations can process large time skips without performance degradation

## Development Guidelines

### Best Practices
- Always pair StartUpdatingComponent calls with corresponding StopUpdatingComponent calls
- Use appropriate update type for each operation (wall time for UI, simulation time for game logic)
- Implement OnLongUpdate for components that need time-skip handling
- Keep update functions lightweight to maintain consistent frame rates
- Use update timers to control execution frequency within components

### Common Pitfalls
- Registering for updates without proper cleanup leading to orphaned update callbacks
- Mixing wall time and simulation time logic in the same update function
- Performing expensive operations directly in update callbacks without timing control
- Not implementing OnLongUpdate for components that track time-dependent state
- Forgetting to handle pause state appropriately in wall time updates

### Testing Strategies
- Test component update registration and cleanup under various lifecycle scenarios
- Verify timing accuracy across different update types and execution loads
- Test long update operations with various skip durations and entity states
- Validate pause/resume behavior for components using multiple update types
- Performance test update loops with high component counts

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [Engine System](../engine/index.md) | Foundation dependency | Entity lifecycle, physics timing, save/load coordination |
| [Fundamentals](../../fundamentals/index.md) | Built upon runtime infrastructure | Component system, entity updates, action processing |
| [Development Tools](../../development-tools/index.md) | Uses runtime profiling | Performance analysis, timing measurement, debug updates |
| [User Interface](../../user-interface/index.md) | Leverages wall time updates | UI responsiveness, input processing, animation timing |

## Troubleshooting

### Common Infrastructure Issues
| Issue | Symptoms | Solution |
|----|----|----|
| Update callbacks not firing | Component logic not executing | Verify StartUpdatingComponent registration |
| Performance drops during updates | Frame rate stuttering | Profile update functions, batch expensive operations |
| Timing desynchronization | Inconsistent game state | Check mixing of wall time and simulation time |
| Memory leaks in update system | Growing memory usage | Ensure StopUpdatingComponent calls on cleanup |
| Long update failures | Incorrect state after time skip | Implement proper OnLongUpdate handlers |

### Debugging Infrastructure
- Use profiler integration within update loops to identify performance bottlenecks
- Enable timing debug output to verify update frequency and execution order
- Monitor component registration tables for proper cleanup and lifecycle management
- Validate timing consistency across different update types during development

## Performance Monitoring

### Key Metrics
- Update loop execution time per frame
- Component registration count and cleanup efficiency
- Wall time vs simulation time synchronization accuracy
- Long update processing duration and success rate

### Optimization Strategies
- Batch component updates by type to improve cache locality
- Use update timers to reduce unnecessary computation frequency
- Implement priority-based update scheduling for critical components
- Profile and optimize expensive update operations with targeted improvements

## Migration Notes

### From Previous Versions
Runtime infrastructure maintains compatibility with existing component update patterns:
- Legacy update registration functions continue to work with current system
- Timing constants remain stable across build versions
- Component lifecycle patterns preserve existing behavior

### Deprecated Features
- Direct manipulation of update lists should migrate to provided registration functions
- Manual timing calculations should use provided time query functions
- Custom update loop implementations should integrate with standard update types

## Contributing

### Adding New Runtime Features
When extending runtime infrastructure:
- Follow established update registration patterns for new component types
- Implement proper cleanup procedures for any new timing or scheduling features
- Ensure thread safety for operations that might affect update loop execution
- Document performance characteristics and resource usage for new runtime features

### Documentation Standards
Runtime infrastructure documentation should:
- Include timing behavior and performance impact for all functions
- Provide complete lifecycle examples showing proper registration and cleanup
- Document interaction patterns between different update types
- Cross-reference integration points with dependent systems

### Code Review Checklist
Before contributing runtime infrastructure changes:
- [ ] Verify update registration and cleanup procedures work correctly
- [ ] Test timing accuracy and performance impact under load
- [ ] Validate compatibility with existing component update patterns
- [ ] Ensure proper handling of pause/resume states
- [ ] Document integration requirements for dependent systems
- [ ] Test long update and time skip functionality thoroughly
