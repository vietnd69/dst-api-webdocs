---
id: debugtools
title: Debug Tools
description: Comprehensive collection of debugging utilities including stack traces, table inspection, and conditional debugging
sidebar_position: 2
slug: game-scripts/core-systems/debugtools
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Debug Tools

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `debugtools` module provides a comprehensive suite of debugging utilities including stack trace generation, table inspection, conditional debugging systems, and enhanced print functions. It extends the standard Lua debugging capabilities with game-specific functionality.

## Usage Example

```lua
-- Enhanced printing with automatic table handling
printwrap("Player data:", player_table)

-- Stack trace generation
print(debugstack())

-- Table inspection
dumptable(game_state, 1, 3)

-- Conditional debugging
EnableDebugOnEntity(entity, "movement")
Dbg(entity, "movement", "Player moved to:", x, y)
```

## Enhanced Print Functions

### printwrap(msg, ...) {#printwrap}

**Status:** `stable`

**Description:**
Enhanced print function that automatically handles table formatting. If additional arguments are tables, they are dumped using `dumptable()`.

**Parameters:**
- `msg` (string): Message to print
- `...` (any): Additional arguments; tables are automatically formatted

**Example:**
```lua
printwrap("Game state:", {
    health = 100,
    hunger = 75,
    items = {"axe", "pickaxe"}
})
```

### printsel(inst, ...) {#printsel}

**Status:** `stable`

**Description:**
Conditional print that only outputs if the specified instance is currently selected (via `c_sel()`).

**Parameters:**
- `inst` (Entity): Entity to check selection for
- `...` (any): Arguments to print if selected

**Example:**
```lua
-- Only prints if player is selected in debug mode
printsel(player, "Player health:", player.components.health:GetCurrent())
```

## Stack Trace Functions

### debugstack(start, top, bottom) {#debugstack}

**Status:** `stable`

**Description:**
Generates a formatted stack trace with configurable depth and truncation.

**Parameters:**
- `start` (number): Starting stack level (default: 1)
- `top` (number): Number of top frames to show (default: 12)
- `bottom` (number): Number of bottom frames to show (default: 10)

**Returns:**
- (string): Formatted stack trace

**Example:**
```lua
function ErrorHandler()
    print("Error occurred:")
    print(debugstack(2, 8, 5))
end
```

### debugstack_oneline(linenum) {#debugstack-oneline}

**Status:** `stable`

**Description:**
Returns a single line of stack trace information for the specified level.

**Parameters:**
- `linenum` (number): Stack level to examine (default: 3)

**Returns:**
- (string): Single line stack trace information

**Example:**
```lua
local caller = debugstack_oneline(2)
print("Called from:", caller)
```

## Table Inspection Functions

### dumptable(obj, indent, recurse_levels, visit_table, is_terse) {#dumptable}

**Status:** `stable`

**Description:**
Recursively prints table contents with configurable indentation and depth limits.

**Parameters:**
- `obj` (table): Object to dump
- `indent` (number): Indentation level (default: 1)
- `recurse_levels` (number): Maximum recursion depth (default: 5)
- `visit_table` (table): Internal tracking for circular references
- `is_terse` (boolean): Whether to use minimal output

**Example:**
```lua
dumptable(player.components, 2, 3)
```

### dumptablequiet(obj, indent, recurse_levels, visit_table) {#dumptablequiet}

**Status:** `stable`

**Description:**
Quiet version of `dumptable` that suppresses some output messages.

**Parameters:**
- Same as `dumptable`

### tabletodictstring(obj, fn) {#tabletodictstring}

**Status:** `stable`

**Description:**
Converts a table to a compact dictionary-style string representation.

**Parameters:**
- `obj` (table): Table to convert
- `fn` (function): Optional transformation function for key-value pairs

**Returns:**
- (string): Dictionary-style string representation

**Example:**
```lua
local dict_str = tabletodictstring({a=1, b=2, c=3})
-- Returns: "{ a=1, b=2, c=3 }"
```

### tabletoliststring(obj, fn) {#tabletoliststring}

**Status:** `stable`

**Description:**
Converts an array-like table to a list-style string representation.

**Parameters:**
- `obj` (table): Array to convert
- `fn` (function): Optional transformation function for values

**Returns:**
- (string): List-style string representation

**Example:**
```lua
local list_str = tabletoliststring({"apple", "banana", "cherry"})
-- Returns: "[ apple, banana, cherry ]"
```

## Conditional Debugging System

### EnableDebugOnEntity(thing, items) {#enabledebugonentity}

**Status:** `stable`

**Description:**
Enables conditional debugging on an entity with various filtering options.

**Parameters:**
- `thing` (table): Entity to enable debugging on
- `items` (string|number|boolean): Debug filter configuration

**Filter Options:**
- `"all"`: Enable all debug output
- `"on"`: Enable debugging without changing filters
- `"off"`: Disable debugging without clearing filters
- `false`: Completely disable and reset debugging
- `number`: Set priority threshold for numeric filtering
- `string`: Enable debugging for specific tag

**Example:**
```lua
-- Enable all debugging
EnableDebugOnEntity(player, "all")

-- Enable only movement debugging
EnableDebugOnEntity(player, "movement")

-- Enable debugging for priority < 5
EnableDebugOnEntity(player, 5)

-- Disable debugging
EnableDebugOnEntity(player, false)
```

### Dbg(thing, level, ...) {#dbg}

**Status:** `stable`

**Description:**
Conditional debug print that respects entity-specific debug settings.

**Parameters:**
- `thing` (table): Entity to check debug settings for
- `level` (string|number|boolean): Debug level or tag
- `...` (any): Arguments to print if conditions are met

**Level Types:**
- `string`: Must match enabled tag
- `number`: Must be below priority threshold
- `true`: Always prints if debugging is enabled

**Example:**
```lua
-- Tag-based debugging
Dbg(player, "movement", "Player position:", x, y)

-- Priority-based debugging
Dbg(enemy, 3, "High priority: Enemy attacking")

-- Simple debugging
Dbg(item, true, "Item picked up")
```

## Advanced Debugging Functions

### instrument_userdata(instance) {#instrument-userdata}

**Status:** `stable`

**Description:**
Creates a proxy for userdata that prints call stacks for all method calls. Useful for tracing C function calls.

**Parameters:**
- `instance` (userdata): Userdata instance to instrument

**Returns:**
- (table): Proxy object that logs all method calls

**Example:**
```lua
-- Instrument TheNet to trace all network calls
local traced_net = instrument_userdata(TheNet)
traced_net:SendRPCToServer() -- Will print call stack
```

### debuglocals(level) {#debuglocals}

**Status:** `stable`

**Description:**
Returns information about local variables at the specified stack level.

**Parameters:**
- `level` (number): Stack level to examine

**Returns:**
- (string): Formatted list of local variables and their values

**Example:**
```lua
function ExamineLocals()
    local locals_info = debuglocals(1)
    print("Local variables:", locals_info)
end
```

## Specialized Print Functions

### dprint(...) {#dprint}

**Status:** `stable`

**Description:**
Conditional debug print controlled by global flags. Only prints when cheats are enabled and specific conditions are met.

**Control Variables:**
- `CHEATS_ENABLE_DPRINT`: Master enable flag
- `DPRINT_USERNAME`: User-specific filtering
- `DPRINT_PRINT_SOURCELINE`: Include source line information

**Parameters:**
- `...` (any): Arguments to print

**Example:**
```lua
CHEATS_ENABLE_DPRINT = true
DPRINT_PRINT_SOURCELINE = true
dprint("Debug message") -- Only prints if conditions are met
```

### IOprint(...) {#ioprint}

**Status:** `stable`

**Description:**
Raw character output to stdout without processing, controlled by the same flags as `dprint`.

**Parameters:**
- `...` (any): Raw content to output

### eprint(inst, ...) {#eprint}

**Status:** `stable`

**Description:**
Entity-specific debug print that only outputs if the instance is the current debug entity.

**Parameters:**
- `inst` (Entity): Entity to check
- `...` (any): Arguments to print

**Example:**
```lua
-- Only prints if 'inst' is the debug entity
eprint(inst, "Entity state changed")
```

## Table Inspection Utilities

### ddump(obj, indent, recurse_levels, root) {#ddump}

**Status:** `stable`

**Description:**
Debug version of `dumptable` that uses `dprint` for conditional output.

**Parameters:**
- Same as `dumptable` with additional `root` parameter for circular reference tracking

### dtable(tab, depth) {#dtable}

**Status:** `stable`

**Description:**
Pretty-prints a table using the `inspect` library if available.

**Parameters:**
- `tab` (table): Table to inspect
- `depth` (number): Inspection depth (default: 1)

**Example:**
```lua
dtable(complex_data_structure, 3)
```

## Visual Debugging

### DrawLine(pos1, pos2) {#drawline}

**Status:** `stable`

**Description:**
Draws a debug line between two positions using the debug render system.

**Parameters:**
- `pos1` (Vector3): Starting position
- `pos2` (Vector3): Ending position

**Example:**
```lua
-- Draw line from player to target
DrawLine(player:GetPosition(), target:GetPosition())
```

## Utility Functions

### SortByTypeAndValue(a, b) {#sortbytypeandvalue}

**Status:** `stable`

**Description:**
Comparison function for sorting mixed-type values by type first, then by value.

**Parameters:**
- `a` (any): First value
- `b` (any): Second value

**Returns:**
- (boolean): Comparison result

## Complete Example

```lua
-- Setup conditional debugging
local player = GetPlayer()
EnableDebugOnEntity(player, "all")

-- Setup global debug flags
CHEATS_ENABLE_DPRINT = true
DPRINT_PRINT_SOURCELINE = true

-- Enhanced table inspection
local player_data = {
    health = player.components.health:GetCurrent(),
    hunger = player.components.hunger:GetCurrent(),
    position = player:GetPosition()
}

printwrap("Player status:", player_data)

-- Conditional entity debugging
Dbg(player, "status", "Health check:", player_data.health)

-- Stack trace example
function TraceableFunction()
    print("Function called from:")
    print(debugstack(2, 5, 3))
end

-- Debug-specific printing
dprint("Debug mode active")
eprint(player, "Player-specific debug info")

-- Table inspection with various methods
print("=== Dictionary format ===")
print(tabletodictstring(player_data))

print("=== Detailed dump ===")
dumptable(player_data, 1, 2)

print("=== Compact inspection ===")
dtable(player_data, 2)
```

## Global Debugging Flags

| Flag | Type | Purpose |
|------|------|---------|
| `CHEATS_ENABLED` | boolean | Master cheat system enable |
| `CHEATS_ENABLE_DPRINT` | boolean | Enable dprint output |
| `DPRINT_USERNAME` | string | User-specific debug filtering |
| `DPRINT_PRINT_SOURCELINE` | boolean | Include source line in dprint |

## Related Modules

- [Debug Print](./debugprint.md): Enhanced printing system
- [Debug Menu](./debugmenu.md): Interactive debug menu framework
- [Debug Commands](./debugcommands.md): Command-line debugging interface
- [Console Commands](./consolecommands.md): Console command system
