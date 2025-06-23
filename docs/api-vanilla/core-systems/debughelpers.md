---
id: debughelpers
title: Debug Helpers
description: Debug utility functions for inspecting and analyzing entities, components, and function upvalues in Don't Starve Together
sidebar_position: 34
slug: core-systems-debughelpers
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Debug Helpers

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current stable implementation |

## Overview

The `debughelpers` module provides essential debug utility functions for inspecting and analyzing entities, components, and function upvalues in Don't Starve Together. These functions are primarily used for debugging, troubleshooting, and understanding the internal structure of game objects during development.

:::info Development Tool
These functions are debugging utilities designed to help developers understand the internal state and structure of game objects. They output detailed information to the console for analysis.
:::

## Usage Example

```lua
-- Dump detailed information about an entity
local player = ThePlayer
DumpEntity(player)

-- Inspect a specific component
DumpComponent(player.components.health)

-- Analyze function upvalues
local myFunction = function() return "test" end
DumpUpvalues(myFunction)
```

## Functions

### DumpComponent(comp) {#dump-component}

**Status:** `stable`

**Description:**
Outputs detailed information about a component to the console, including all properties and methods with their source locations.

**Parameters:**
- `comp` (Component): The component instance to dump

**Output Information:**
- **Functions**: Function name and source file location with line number
- **Entity References**: Entity objects with validity status
- **Properties**: All other properties with their current values

**Example:**
```lua
-- Dump player's health component
local player = ThePlayer
DumpComponent(player.components.health)

-- Output example:
--       currenthealth = 100
--       maxhealth = 100
--       SetHealth = function - scripts/components/health.lua:45
--       DoDelta = function - scripts/components/health.lua:67
--       owner = [entity 100001] (valid:true)
```

**Version History:**
- Current implementation since build 676042

### DumpEntity(ent) {#dump-entity}

**Status:** `stable`

**Description:**
Provides comprehensive debugging output for an entity, including entity properties, debug string, and detailed information for all attached components.

**Parameters:**
- `ent` (Entity): The entity instance to dump

**Output Structure:**
1. **Header**: Entity identification and debug string
2. **Entity Properties**: All entity-level properties and methods
3. **Component Analysis**: Detailed dump of each attached component

**Example:**
```lua
-- Dump complete entity information
local player = ThePlayer
DumpEntity(player)

-- Output structure:
-- ============================================ Dumping entity [entity] ============================================
-- [Entity debug string output]
-- --------------------------------------------------------------------------------------------------------------------
-- [Entity properties and methods]
-- --------------------------------------------------------------------------------------------------------------------
-- Dumping component health
--       [Component details]
-- Dumping component inventory
--       [Component details]
-- ====================================================================================================================================
```

**Output Details:**
- **Functions**: Listed with source file and line number information
- **Entity References**: Shown with validity status when applicable
- **Component Breakdown**: Each component is individually analyzed using `DumpComponent`

**Version History:**
- Current implementation since build 676042

### DumpUpvalues(func) {#dump-upvalues}

**Status:** `stable`

**Description:**
Analyzes and displays all upvalues (external variables) captured by a function closure, providing insight into function scope and variable capture.

**Parameters:**
- `func` (function): The function whose upvalues should be analyzed

**Output Information:**
- **Function Metadata**: Function name, source file, and definition line
- **Upvalue Count**: Total number of captured upvalues
- **Upvalue Details**: Index, name, type, and current value for each upvalue

**Example:**
```lua
-- Analyze function upvalues
local captured_var = "test_value"
local my_function = function()
    return captured_var .. "_modified"
end

DumpUpvalues(my_function)

-- Output example:
-- ============================================ Dumping Upvalues ============================================
-- Upvalues (1 of 'em) for function nil defined at @console:2
-- 1:    captured_var (string)    = test_value
-- --------------------------------------------------------------------------------------------------------------------
```

**Use Cases:**
- **Closure Analysis**: Understanding what variables a function captures
- **Memory Debugging**: Identifying potential memory leaks through upvalue references
- **Scope Investigation**: Analyzing variable scope and capture behavior
- **Function Optimization**: Understanding function dependencies for optimization

**Version History:**
- Current implementation since build 676042

## Technical Implementation

### Debug Information Sources

The module utilizes Lua's built-in debug library for introspection:

- **`debug.getinfo()`**: Retrieves function metadata including source location
- **`debug.getupvalue()`**: Accesses function upvalue information
- **Entity Debug System**: Uses entity-specific debug methods

### Output Formatting

All functions use consistent formatting patterns:

- **Hierarchical Structure**: Clear indentation for nested information
- **Type Information**: Explicit type indicators for all values
- **Validity Checks**: Entity validity status when applicable
- **Source Tracking**: File and line number information for functions

### Performance Considerations

- **Console Output**: All functions output directly to console
- **Memory Usage**: Temporary strings created for formatting
- **Iteration Overhead**: Complete traversal of object properties
- **Debug Library**: Uses reflection which has performance implications

## Usage Guidelines

### Development Best Practices

1. **Console Preparation**: Ensure console output is visible and accessible
2. **Large Objects**: Be cautious when dumping entities with many components
3. **Output Management**: Consider redirecting output for large dumps
4. **Performance Impact**: Avoid using in performance-critical code paths

### Common Use Cases

```lua
-- Entity debugging during development
local suspicious_entity = c_sel() -- Get selected entity
DumpEntity(suspicious_entity)

-- Component state analysis
local health_comp = ThePlayer.components.health
DumpComponent(health_comp)

-- Function closure investigation
local closure_func = some_module.create_closure()
DumpUpvalues(closure_func)

-- Component comparison
DumpComponent(entity1.components.health)
DumpComponent(entity2.components.health)
```

### Debugging Workflow

1. **Identify Target**: Determine which entity, component, or function to analyze
2. **Capture State**: Use appropriate dump function at the right moment
3. **Analyze Output**: Review console output for relevant information
4. **Compare States**: Use multiple dumps to track changes over time
5. **Document Findings**: Record important discoveries for future reference

## Dependencies

### Required Systems
- **Lua Debug Library**: Core functionality for introspection
- **Entity Framework**: Entity and component structure access
- **Console System**: Output destination for debug information

### Global Functions Used
- `debug.getinfo()`: Function metadata retrieval
- `debug.getupvalue()`: Upvalue access and analysis
- `pairs()`: Property iteration
- `tostring()`: Value string conversion

## Related Modules

- [Debug Commands](./debugcommands.md): Command-line debug utilities
- [Debug Keys](./debugkeys.md): Debug input handling
- [Debug Print](./debugprint.md): Debug output formatting utilities

## Notes

- **Development Tool**: These functions are debugging aids, not gameplay features
- **Console Dependency**: All output goes to console, requiring console access
- **Reflection Performance**: Debug operations have performance overhead
- **Object Traversal**: Functions perform complete object property traversal
- **Memory Considerations**: Large objects may produce extensive output
- **Thread Safety**: Functions should be used from main thread context
