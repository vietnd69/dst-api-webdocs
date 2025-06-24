---
id: reload
title: Reload System
description: Hot-swapping and live reloading system for development and debugging
sidebar_position: 2
slug: /api-vanilla/core-systems/reload
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Reload System

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `reload` system provides hot-swapping capabilities for Don't Starve Together development, allowing developers to reload modified Lua modules without restarting the game. This system enables rapid iteration during development by dynamically updating code while preserving game state.

## Core Concepts

### Hot-Swapping
The system performs live code replacement by comparing old and new module versions, updating functions and tables in-place while maintaining object references and inheritance chains.

### Class Inheritance Management
Special handling for DST's class system ensures that inheritance relationships are preserved and properly updated when base classes are modified.

### File Modification Tracking
The system monitors file modification times to automatically detect changes and trigger appropriate reload procedures.

## Global Variables

### InvalidatedTables

**Type:** `table`

**Description:** Tracks tables that have been invalidated during the reload process and need to be removed from the ClassRegistry.

### RequiredFilesForReload

**Type:** `table`

**Description:** Maps file paths to their last known modification times for change detection.

### LastProbeReload

**Type:** `boolean`

**Description:** Tracks the previous state of the reload probe to detect state changes.

## Functions

### cloneTable(t) {#clone-table}

**Status:** `stable`

**Description:**
Creates a shallow copy of a table, copying all key-value pairs to a new table.

**Parameters:**
- `t` (table): The table to clone

**Returns:**
- (table): A new table containing all key-value pairs from the original

**Example:**
```lua
local original = {a = 1, b = 2, c = {nested = true}}
local copy = cloneTable(original)
-- copy.a == 1, copy.b == 2, copy.c == original.c (same reference)
```

### hotswap(modname) {#hotswap}

**Status:** `stable`

**Description:**
Performs hot-swapping of a Lua module by reloading it and updating all existing references. Preserves object identity while updating function implementations and table contents.

**Parameters:**
- `modname` (string): The name of the module to hot-swap

**Returns:**
- (table|nil): The original module table on success, or nil on error
- (string|nil): Error message if reload failed

**Example:**
```lua
-- Hot-swap the components/health module
local oldmod, err = hotswap("components/health")
if err then
    print("Hot-swap failed:", err)
else
    print("Successfully hot-swapped health component")
end
```

**Implementation Details:**
1. **State Backup**: Creates a backup of the global environment
2. **Module Reload**: Unloads and reloads the specified module
3. **Reference Update**: Updates all existing references to maintain object identity
4. **Error Recovery**: Restores original state if reload fails
5. **Inheritance Handling**: Manages class inheritance chains properly

### ScrubClass(cls, inh) {#scrub-class}

**Status:** `stable`

**Description:**
Removes inherited members from a class table, leaving only members that belong specifically to that class. Used during hot-swapping to clean up inheritance relationships.

**Parameters:**
- `cls` (table): The class table to scrub
- `inh` (table): The inheritance source table

**Example:**
```lua
-- Remove inherited functions from derived class
ScrubClass(DerivedClass, BaseClass)
-- DerivedClass now only contains its own members
```

### MonkeyPatchClass(mt) {#monkey-patch-class}

**Status:** `stable`

**Description:**
Rebuilds a class metatable by walking up the inheritance chain and applying all functions from base classes to derived classes in the correct order.

**Parameters:**
- `mt` (table): The metatable/class to patch

**Example:**
```lua
-- Rebuild inheritance chain for a class
MonkeyPatchClass(SomeClassMetatable)
-- Class now has all inherited functions properly applied
```

**Implementation Process:**
1. **Chain Walking**: Traverses inheritance chain from derived to base
2. **Function Collection**: Gathers all functions from the entire chain
3. **Order Application**: Applies functions from base to derived order
4. **Metatable Rebuild**: Reconstructs the metatable with proper inheritance

### MonkeyPatchClasses() {#monkey-patch-classes}

**Status:** `stable`

**Description:**
Applies inheritance patching to all classes in the ClassRegistry. Called after hot-swapping to ensure all class relationships are properly maintained.

**Example:**
```lua
-- After hot-swapping multiple modules
MonkeyPatchClasses()
-- All classes now have properly updated inheritance
```

**Process Overview:**
1. **Class Scrubbing**: Removes inherited functions from all classes
2. **Inheritance Reconstruction**: Rebuilds inheritance chains bottom-up
3. **Registry Update**: Updates ClassRegistry with patched classes

### DoReload() {#do-reload}

**Status:** `stable`

**Description:**
Main reload function that checks for modified files and performs hot-swapping for all changed modules. Handles the complete reload workflow including file detection and class patching.

**Example:**
```lua
-- Trigger a complete reload check
DoReload()
-- All modified files will be hot-swapped
```

**Workflow Steps:**
1. **Cache Purge**: Clears Lua file cache on console builds
2. **File Detection**: Checks modification times for all tracked files
3. **Path Validation**: Ensures files are in scripts/ directory
4. **Module Processing**: Hot-swaps each modified module
5. **Class Patching**: Updates all class inheritance relationships
6. **Cleanup**: Performs garbage collection and invalidation cleanup

### ProbeReload(ispressed) {#probe-reload}

**Status:** `stable`

**Description:**
Probe function typically called from input handling to trigger reload when a specific key or condition is met. Detects state changes to avoid repeated triggers.

**Parameters:**
- `ispressed` (boolean): Whether the reload trigger is currently active

**Example:**
```lua
-- In input handling code
ProbeReload(TheInput:IsKeyDown(KEY_F5))
-- Reload triggers only on key press, not while held
```

## Usage Patterns

### Development Workflow
```lua
-- Typical development reload pattern
function OnUpdateInput()
    -- Check for reload hotkey
    ProbeReload(TheInput:IsKeyDown(KEY_F5))
end

-- Manual reload for specific module
if DEVELOPMENT_MODE then
    local success, err = hotswap("components/mycomponent")
    if not success then
        print("Reload failed:", err)
    end
end
```

### File Modification Tracking
```lua
-- Set up file tracking for auto-reload
RequiredFilesForReload["scripts/components/health.lua"] = 
    TheSim:GetFileModificationTime("scripts/components/health.lua")

-- Check if file has been modified
local currentTime = TheSim:GetFileModificationTime("scripts/components/health.lua")
if currentTime ~= RequiredFilesForReload["scripts/components/health.lua"] then
    -- File has been modified, reload needed
    DoReload()
end
```

### Class Hot-Swapping
```lua
-- Safe class hot-swapping with error handling
local function ReloadComponent(component_name)
    local old_global = cloneTable(_G)
    local module_path = "components/" .. component_name
    
    local success, err = hotswap(module_path)
    if not success then
        -- Restore global state on failure
        for k, v in pairs(old_global) do
            _G[k] = v
        end
        return false, err
    end
    
    return true
end
```

## Development Integration

### Console Integration
The reload system integrates with console builds through:
- **File Cache Purging**: `TheSim:PurgeLuaFileCache()` clears cached files
- **Modification Time Queries**: `TheSim:GetFileModificationTime()` for change detection
- **Path Validation**: Ensures only scripts/ directory files are reloaded

### Input System Integration
```lua
-- Typical integration with input system
local RELOAD_KEY = KEY_F5

function HandleReloadInput()
    if TheInput:IsKeyDown(RELOAD_KEY) and DEVELOPMENT_MODE then
        ProbeReload(true)
    else
        ProbeReload(false)
    end
end
```

## Performance Considerations

### Memory Management
- **Garbage Collection**: Explicit `collectgarbage()` calls after hot-swapping
- **Reference Cleanup**: Proper cleanup of InvalidatedTables to prevent memory leaks
- **State Backup**: Temporary cloning of global state impacts memory during reload

### Hot-Swap Efficiency
- **Selective Updates**: Only modified files are processed
- **In-Place Updates**: Functions are updated without recreating objects
- **Inheritance Optimization**: Class patching minimizes redundant operations

### Development vs Production
```lua
-- Guard reload functionality in production
if DEVELOPMENT_MODE or IsConsole() then
    -- Enable hot-swapping capabilities
    ProbeReload(TheInput:IsKeyDown(RELOAD_KEY))
else
    -- Disable reload system in production builds
    -- (system functions still exist but are not called)
end
```

## Error Handling

### Reload Failure Recovery
The system provides robust error recovery:
- **Global State Restoration**: Automatic rollback on reload failure
- **Error Reporting**: Clear error messages for debugging
- **Graceful Degradation**: Failed reloads don't crash the game

### Common Error Scenarios
```lua
-- Syntax errors in reloaded module
local success, err = hotswap("components/broken_component")
if not success then
    print("Syntax error in component:", err)
end

-- Missing file or invalid module path
local success, err = hotswap("nonexistent/module")
if not success then
    print("Module not found:", err)
end
```

## Limitations and Considerations

### Scope Limitations
- **Scripts Directory Only**: Only files in scripts/ or /scripts/ paths can be reloaded
- **Lua Files Only**: System specifically targets .lua files
- **Module System Dependency**: Relies on Lua's require/package system

### Class System Constraints
- **Inheritance Complexity**: Complex inheritance chains may not hot-swap perfectly
- **Metatable Dependencies**: Changes to metatable structure may require restart
- **Instance State**: Existing object instances retain old state until explicitly updated

### Production Usage
- **Development Only**: Hot-swapping should be disabled in production builds
- **Performance Impact**: File monitoring and reload checks add overhead
- **Stability Concerns**: Hot-swapping can introduce unexpected behavior

## Related Systems

- [Class System](./class.md): Provides the ClassRegistry and inheritance mechanisms
- [Module System](./mods.md): Integration with DST's module loading system
- [Debug Tools](./debug/debugtools.md): Development utilities that complement hot-swapping
- [Console Commands](./consolecommands.md): Console integration for development builds

## Integration Examples

### Custom Reload Triggers
```lua
-- Set up custom reload conditions
function CheckCustomReloadConditions()
    -- Reload on specific debug command
    if DEBUG_RELOAD_REQUESTED then
        DoReload()
        DEBUG_RELOAD_REQUESTED = false
    end
    
    -- Reload on file system events (if available)
    if FileSystemWatcher and FileSystemWatcher:HasChanges() then
        DoReload()
    end
end
```

### Module-Specific Reloading
```lua
-- Reload specific subsystems
function ReloadUISystem()
    local ui_modules = {
        "screens/mainscreen",
        "widgets/button",
        "widgets/menu"
    }
    
    for _, module in ipairs(ui_modules) do
        local success, err = hotswap(module)
        if not success then
            print("Failed to reload", module, ":", err)
        end
    end
    
    MonkeyPatchClasses()
end
```
