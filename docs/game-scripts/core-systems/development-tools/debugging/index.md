---
id: debugging-tools-overview
title: Debugging Tools Overview
description: Comprehensive debugging and diagnostic utilities for DST development and troubleshooting
sidebar_position: 0

last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: development-system
system_scope: debugging, diagnostics, and analysis tools
---

# Debugging Tools Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Debugging Tools category provides comprehensive utilities for identifying, analyzing, and resolving issues in Don't Starve Together development. These tools enable developers to inspect game state, trace execution flow, analyze entity behavior, and troubleshoot complex problems through detailed diagnostic capabilities.

### Key Responsibilities
- Provide entity and component inspection capabilities
- Enable stack trace generation and error analysis
- Support interactive debugging through key bindings and commands
- Offer enhanced printing and logging utilities
- Facilitate performance analysis and memory debugging
- Enable audio debugging and sound event tracking

### System Scope
This category includes debugging utilities, diagnostic tools, and analysis systems, but excludes console commands (handled by Console Tools) and profiling utilities (handled by Profiling Tools).

## Architecture Overview

### System Components
Debugging tools are organized as non-intrusive utilities that can inspect, analyze, and manipulate game state without affecting normal gameplay operations.

### Data Flow
```
Debug Input → Analysis Engine → State Inspection → Output Generation
     ↓              ↓               ↓                ↓
Key Binding → Debug Command → Entity Analysis → Formatted Output
```

### Integration Points
- **Console System**: Debug commands and output integration
- **Entity Framework**: Entity and component inspection capabilities
- **Input System**: Debug key bindings and interactive controls
- **Audio System**: Sound debugging and event tracking
- **Lua Debug Library**: Stack trace and runtime analysis

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Debug Commands](./debugcommands.md) | stable | Current command collection |
| 676042 | 2025-06-21 | [Debug Keys](./debugkeys.md) | stable | Current key binding system |
| 676042 | 2025-06-21 | [Stack Trace](./stacktrace.md) | stable | Current error analysis tools |

## Core Debugging Modules

### [Debug Commands](./debugcommands.md)
Collection of debug utility functions for development, testing, and troubleshooting.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Debug Commands](./debugcommands.md) | stable | Utility functions for testing scenarios | Entity spawning, world state, skill trees |

**Key Command Categories:**
- **Entity Spawning**: Item and prefab spawning utilities
- **World Manipulation**: Moon phases, rifts, map exploration
- **Player Testing**: Skill trees, affinities, stats management
- **Performance Testing**: Mass spawning, stress testing
- **Development Utilities**: File decoding, string generation

### [Debug Keys](./debugkeys.md)
Interactive key binding system for developer tools and game manipulation.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Debug Keys](./debugkeys.md) | stable | Keyboard shortcuts for debug operations | 50+ key bindings, modifier support |

**Key Binding Categories:**
- **Global Keys**: God mode, pause controls, entity selection
- **Programmer Keys**: Advanced debugging, performance graphs
- **Window Keys**: Debug panel shortcuts (requires CAN_USE_DBUI)
- **Game Debug Keys**: World manipulation, time control
- **Entity Keys**: Selection, removal, manipulation
- **Mouse Actions**: Entity targeting, spawning, information

### [Debug Helpers](./debughelpers.md)
Utility functions for inspecting entities, components, and function upvalues.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Debug Helpers](./debughelpers.md) | stable | Entity and component inspection | Detailed dumps, upvalue analysis |

**Helper Functions:**
- **DumpEntity**: Comprehensive entity analysis
- **DumpComponent**: Component property inspection
- **DumpUpvalues**: Function closure analysis

### [Debug Tools](./debugtools.md)
Comprehensive debugging utilities including stack traces and table inspection.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Debug Tools](./debugtools.md) | stable | Core debugging infrastructure | Stack traces, conditional debugging |

**Tool Categories:**
- **Enhanced Print**: Table-aware printing with formatting
- **Stack Traces**: Detailed execution flow analysis
- **Table Inspection**: Recursive table dumping and analysis
- **Conditional Debugging**: Entity-specific debug filtering
- **Advanced Tools**: Userdata instrumentation, local inspection

### [Debug Print](./debugprint.md)
Enhanced print functions with source line tracking and logger management.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Debug Print](./debugprint.md) | stable | Enhanced logging and output | Source tracking, multiple loggers |

**Print Enhancements:**
- **Source Line Tracking**: File and line number integration
- **Multiple Loggers**: Custom logger registration
- **Console Output**: Recent output management
- **No-Line Print**: Interactive console output

### [Stack Trace](./stacktrace.md)
Debug stack trace and error handling utilities for Lua error analysis.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Stack Trace](./stacktrace.md) | stable | Error analysis and stack inspection | Safe conversion, local inspection |

**Stack Analysis Features:**
- **Safe String Conversion**: Error-proof value conversion
- **Local Variable Inspection**: Stack frame variable analysis
- **Error Recovery**: Panic recovery and fallback mechanisms
- **Global Error Handler**: Integration with Lua error system

### [Debug Menu](./debugmenu.md)
Framework for creating text-based debug menu systems with navigation.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Debug Menu](./debugmenu.md) | stable | Interactive menu framework | Options, navigation, submenus |

**Menu System:**
- **MenuOption Classes**: Base option types with interaction methods
- **TextMenu System**: Menu navigation and state management
- **Option Types**: Actions, checkboxes, numeric toggles, submenus

### [Debug Sounds](./debugsounds.md)
Sound debugging system that tracks and monitors audio events.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Debug Sounds](./debugsounds.md) | stable | Audio debugging and tracking | Sound interception, visual indicators |

**Audio Debug Features:**
- **Sound Interception**: Automatic tracking of all audio events
- **Visual Indicators**: Debug icons for sound locations
- **Loop Tracking**: Looping sound management and monitoring
- **Parameter Monitoring**: Real-time audio parameter tracking

### [Inspect](./inspect.md)
Library for creating human-readable representations of Lua tables and values.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Inspect](./inspect.md) | stable | Table and value inspection | Pretty printing, circular references |

**Inspection Features:**
- **Smart Formatting**: Intelligent quote selection and formatting
- **Circular Reference Handling**: Safe inspection of complex structures
- **Type-Specific Output**: Appropriate formatting for each Lua type
- **Depth Control**: Configurable inspection depth limits

## Common Debugging Patterns

### Entity State Analysis
```lua
-- Inspect entity state comprehensively
local entity = c_sel()  -- Get selected entity
DumpEntity(entity)      -- Full entity dump

-- Focus on specific component
DumpComponent(entity.components.health)

-- Analyze function closures
DumpUpvalues(entity.OnSave)
```

### Interactive Debugging Session
```lua
-- Enable comprehensive debugging
d_unlockaffinities()    -- Unlock skill trees
d_resetskilltree()      -- Reset skills with max XP
d_playeritems()         -- Spawn all items
d_exploreland()         -- Reveal map

-- Set up debug key bindings
d_addemotekeys()        -- Add emote shortcuts

-- Monitor audio events
SOUNDDEBUGUI_ENABLED = true
```

### Error Analysis Workflow
```lua
-- Generate detailed stack trace
local function ErrorHandler(err)
    local trace = StackTrace(err)
    print("Error analysis:", trace)
    return trace
end

-- Wrap risky operations
local success, result = xpcall(riskyFunction, ErrorHandler)

-- Conditional entity debugging
EnableDebugOnEntity(player, "all")
Dbg(player, "movement", "Position updated:", x, y, z)
```

### Table and Data Inspection
```lua
-- Multiple inspection approaches
local data = {complex = "structure"}

-- Pretty printing with inspect
print(inspect(data, 3))

-- Enhanced table dumping
dumptable(data, 1, 3)

-- Dictionary-style compact output
print(tabletodictstring(data))

-- Debug-controlled output
dtable(data, 2)
```

## Debugging System Dependencies

### Required Systems
- **Lua Debug Library**: Stack inspection and runtime analysis
- **Console System**: Output destination and command integration
- **Entity Framework**: Entity and component inspection
- **Input System**: Debug key binding and mouse handling

### Optional Systems
- **Audio System**: Sound debugging and event tracking
- **Debug UI System**: Visual debug panel integration (requires CAN_USE_DBUI)
- **File System**: Log file output and data dumping

## Performance Considerations

### Debug Tool Impact
- Stack trace generation has significant performance cost
- Entity dumping can be memory-intensive for complex entities
- Debug key processing runs on every input frame
- Sound debugging adds overhead to audio system

### Memory Management
- Table inspection creates temporary string representations
- Debug output history is limited to prevent memory growth
- Circular reference detection prevents infinite loops
- Safe string conversion prevents memory bloat

### Production Considerations
```lua
-- Guard debug functionality appropriately
if DEVELOPMENT_MODE then
    -- Enable full debugging capabilities
    EnableDebugOnEntity(entity, "all")
    SOUNDDEBUGUI_ENABLED = true
else
    -- Minimal or no debug overhead in production
    -- Debug tools automatically disabled
end
```

## Development Guidelines

### Best Practices
- Use appropriate debug levels for different types of information
- Enable debug tools conditionally based on development flags
- Clean up debug state when switching between debugging sessions
- Combine multiple debugging approaches for comprehensive analysis
- Document debug key bindings and their purposes

### Common Pitfalls
- Leaving debug tools enabled in production builds
- Creating debug output that affects game performance
- Not handling debug tool errors gracefully
- Overwhelming debug output without proper filtering

### Testing Strategies
- Test debug tools with various entity types and states
- Verify debug key bindings don't conflict with game controls
- Test error handling and stack trace generation
- Validate debug output formatting and readability

## Debugging Integration Workflows

### Development Workflow
1. **State Setup**: Use debug commands to create test scenarios
2. **Interactive Analysis**: Apply debug keys for real-time inspection
3. **Deep Inspection**: Use debug helpers for detailed entity analysis
4. **Error Investigation**: Apply stack trace tools for error analysis
5. **Audio Debugging**: Monitor sound events with audio debug tools

### Troubleshooting Workflow
1. **Problem Identification**: Use debug commands to reproduce issues
2. **State Inspection**: Apply debug helpers to analyze entity state
3. **Flow Analysis**: Use stack traces to understand execution flow
4. **Conditional Debugging**: Enable entity-specific debug output
5. **Data Validation**: Use inspection tools to verify data structures

### Performance Analysis Workflow
1. **Baseline Establishment**: Use debug tools to set up test scenarios
2. **Stress Testing**: Apply mass spawning commands for load testing
3. **Memory Analysis**: Use debug helpers to inspect memory usage
4. **Audio Analysis**: Monitor audio performance with sound debugging
5. **Optimization Validation**: Verify improvements with debug metrics

## Debug Security Considerations

### Access Control
- Debug tools require appropriate development privileges
- Entity manipulation commands validate entity state
- File system access is limited to safe debugging operations
- Debug key bindings are disabled on restricted platforms

### Safe Usage Guidelines
- Validate entity existence before debug operations
- Handle debug tool errors without crashing the game
- Limit debug output to prevent log spam
- Use appropriate debug levels for different information types

## Advanced Debugging Features

### Custom Debug Commands
```lua
-- Register custom debug utilities
function d_customtest()
    local entity = c_sel()
    if entity then
        DumpEntity(entity)
        Dbg(entity, "custom", "Custom analysis complete")
    end
end
```

### Entity-Specific Debugging
```lua
-- Set up targeted debugging
EnableDebugOnEntity(suspicious_entity, "movement")
EnableDebugOnEntity(suspicious_entity, "combat")

-- Use in entity logic
Dbg(self, "movement", "Position changed:", newX, newY)
Dbg(self, "combat", "Health updated:", newHealth)
```

### Interactive Debug Menus
```lua
-- Create custom debug menu
local menu = debugmenu.TextMenu("Custom Debug Menu")
local options = {
    debugmenu.DoAction("Spawn Test Items", function() 
        d_spawnlist({"log", "rocks", "gold"})
    end),
    debugmenu.CheckBox("God Mode", 
        function() return god_mode_enabled end,
        function(val) god_mode_enabled = val end),
}
menu:PushOptions(options)
```

## Troubleshooting Debug Tools

### Common Debug Issues
| Issue | Symptoms | Solution |
|----|----|----|
| Debug keys not working | No response to key presses | Check development mode and platform restrictions |
| Entity dumps causing lag | Performance drops during inspection | Limit dump depth and entity complexity |
| Stack traces missing info | Incomplete error information | Verify debug library availability |
| Audio debug not tracking | Missing sound events | Enable SOUNDDEBUGUI_ENABLED flag |

### Debug Tool Debugging Process
- Verify development flags are properly set
- Check debug tool initialization and setup
- Test individual tools separately for isolation
- Review error messages for specific failure reasons

## Debug Tool Maintenance

### Regular Maintenance Tasks
- Update debug commands to reflect current game state
- Review and optimize debug tool performance impact
- Clean up deprecated debugging utilities
- Test debug tools with new game builds and features

### Debug Tool Evolution
- Add new debugging capabilities based on development needs
- Improve error handling and recovery mechanisms
- Enhance integration between different debug tool categories
- Better visualization and output formatting for complex data

## Related Development Tools

- [Console Tools](../console/index.md): Command-line interface and hot-reload
- [Profiling Tools](../profiling/index.md): Performance analysis and optimization
- [Development Utilities](../utilities/index.md): Additional development helpers
- [System Core](../system-core/index.md): Core engine integration

## Debug Success Metrics

- **Error Resolution Time**: Significant reduction in debugging time
- **Issue Identification**: Faster problem isolation and analysis
- **Development Efficiency**: Improved development workflow with debug tools
- **Code Quality**: Better error handling and state validation

---

*Debugging tools provide essential infrastructure for identifying, analyzing, and resolving development issues through comprehensive inspection and analysis capabilities.*
