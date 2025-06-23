---
title: "Console Screen Settings"
description: "Console history and settings persistence system for Don't Starve Together"
sidebar_position: 10
slug: /api-vanilla/core-systems/consolescreensettings
last_updated: "2024-12-19"
build_version: "675312"
change_status: "stable"
---

# Console Screen Settings 🟢

The **ConsoleScreenSettings** module manages persistent settings and command history for the console interface in Don't Starve Together. It provides functionality for storing command history, UI preferences, and automatic save/load operations.

## Overview

ConsoleScreenSettings handles:
- **Command History**: Persistent storage of executed console commands
- **UI State**: Console widget expansion states and preferences  
- **Data Persistence**: Automatic saving and loading of console settings
- **History Management**: Intelligent deduplication and command storage
- **Migration Support**: Backwards compatibility with older save formats

## Class Definition

### ConsoleScreenSettings Class

```lua
ConsoleScreenSettings = Class(function(self)
    self.persistdata = {}
    self.profanityservers = {}
    self.dirty = true
end)
```

**Properties:**
- `persistdata` (table): Stored console settings and history
- `profanityservers` (table): Server-specific profanity filter settings
- `dirty` (boolean): Flag indicating unsaved changes

## Core Methods

### History Management

#### GetConsoleHistory()
Returns the stored console command history.

**Returns:**
- (table): Array of command history entries

```lua
local history = ConsoleScreenSettings:GetConsoleHistory()
for i, entry in ipairs(history) do
    print(i, entry.str, entry.remote and "(remote)" or "(local)")
end
```

**History Entry Format:**
```lua
{
    str = "command_string",      -- The executed command
    remote = true/false/nil      -- Whether it was executed remotely
}
```

#### AddLastExecutedCommand(command_str, toggle_remote_execute)
Adds a command to the persistent history with intelligent deduplication.

**Parameters:**
- `command_str` (string): The command string to add
- `toggle_remote_execute` (boolean, optional): Whether command was executed remotely

**Behavior:**
- Trims whitespace from commands
- Ignores empty strings and `c_repeatlastcommand()`
- Moves duplicate commands to end of history
- Maintains maximum history size (20 commands)
- Updates remote execution flag if needed

```lua
-- Add local command
ConsoleScreenSettings:AddLastExecutedCommand("c_spawn('wilson')")

-- Add remote command
ConsoleScreenSettings:AddLastExecutedCommand("c_godmode()", true)

-- Ignored commands
ConsoleScreenSettings:AddLastExecutedCommand("")  -- Empty string ignored
ConsoleScreenSettings:AddLastExecutedCommand("c_repeatlastcommand()")  -- Ignored
```

### UI State Management

#### IsWordPredictionWidgetExpanded()
Checks if the word prediction widget is currently expanded.

**Returns:**
- (boolean): True if widget is expanded, false otherwise

```lua
if ConsoleScreenSettings:IsWordPredictionWidgetExpanded() then
    -- Show expanded prediction interface
    ShowExpandedPredictions()
else
    -- Show compact prediction interface
    ShowCompactPredictions()
end
```

#### SetWordPredictionWidgetExpanded(value)
Sets the expansion state of the word prediction widget.

**Parameters:**
- `value` (boolean): True to expand widget, false to collapse

```lua
-- Expand word prediction widget
ConsoleScreenSettings:SetWordPredictionWidgetExpanded(true)

-- Collapse word prediction widget
ConsoleScreenSettings:SetWordPredictionWidgetExpanded(false)
```

### Data Persistence

#### Reset()
Resets all console settings to defaults and saves immediately.

```lua
ConsoleScreenSettings:Reset()  -- Clear all history and settings
```

#### Save(callback)
Saves current settings to persistent storage.

**Parameters:**
- `callback` (function, optional): Callback function called after save

**Callback Parameters:**
- `success` (boolean): Whether save operation succeeded

```lua
-- Save with callback
ConsoleScreenSettings:Save(function(success)
    if success then
        print("Console settings saved successfully")
    else
        print("Failed to save console settings")
    end
end)

-- Save without callback
ConsoleScreenSettings:Save()
```

#### Load(callback)
Loads settings from persistent storage.

**Parameters:**
- `callback` (function, optional): Callback function called after load

```lua
ConsoleScreenSettings:Load(function(success)
    if success then
        print("Console settings loaded")
        local history = ConsoleScreenSettings:GetConsoleHistory()
        print("Loaded", #history, "command entries")
    else
        print("Failed to load console settings")
    end
end)
```

#### OnLoad(str, callback)
Internal method for processing loaded data string.

**Parameters:**
- `str` (string): JSON-encoded settings data
- `callback` (function, optional): Completion callback

## Configuration

### History Limits

```lua
local MAX_SAVED_COMMANDS = 20
```

The system maintains a maximum of 20 commands in history to prevent excessive memory usage and save file bloat.

### Save File Naming

#### GetSaveName()
Returns the appropriate save file name based on game branch.

**Returns:**
- (string): Save file name

```lua
-- Production: "consolescreen"
-- Development: "consolescreen_dev"
local filename = ConsoleScreenSettings:GetSaveName()
```

## Data Format

### Persistent Data Structure

```lua
persistdata = {
    historylines = {
        { str = "c_spawn('wilson')", remote = nil },
        { str = "c_godmode()", remote = true },
        { str = "c_give('log', 20)", remote = false },
        -- ... up to MAX_SAVED_COMMANDS entries
    },
    expanded = true  -- Word prediction widget state
}
```

### Legacy Data Migration

The system automatically migrates old save data formats:

```lua
-- Old format (deprecated)
{
    history = { "command1", "command2", ... },
    localremotehistory = { true, false, ... }
}

-- New format (current)
{
    historylines = {
        { str = "command1", remote = true },
        { str = "command2", remote = false }
    }
}
```

## Usage Examples

### Basic History Management

```lua
-- Initialize console settings
local console = ConsoleScreenSettings()

-- Load existing settings
console:Load(function(success)
    if success then
        print("Settings loaded successfully")
    end
end)

-- Add commands to history
console:AddLastExecutedCommand("c_spawn('deerclops')")
console:AddLastExecutedCommand("c_teleport(100, 0, 200)", true)

-- Get command history
local history = console:GetConsoleHistory()
print("Command history:")
for i, entry in ipairs(history) do
    local remote_indicator = entry.remote and " [REMOTE]" or ""
    print(string.format("%d: %s%s", i, entry.str, remote_indicator))
end

-- Save settings
console:Save()
```

### UI State Management

```lua
-- Check current widget state
local isExpanded = ConsoleScreenSettings:IsWordPredictionWidgetExpanded()
print("Prediction widget expanded:", isExpanded)

-- Toggle widget state
ConsoleScreenSettings:SetWordPredictionWidgetExpanded(not isExpanded)

-- Save the new state
ConsoleScreenSettings:Save()
```

### Command History Analysis

```lua
local function AnalyzeCommandHistory()
    local history = ConsoleScreenSettings:GetConsoleHistory()
    local stats = {
        total = #history,
        local_commands = 0,
        remote_commands = 0,
        spawn_commands = 0
    }
    
    for _, entry in ipairs(history) do
        if entry.remote then
            stats.remote_commands = stats.remote_commands + 1
        else
            stats.local_commands = stats.local_commands + 1
        end
        
        if entry.str:find("c_spawn") then
            stats.spawn_commands = stats.spawn_commands + 1
        end
    end
    
    return stats
end

-- Usage
local stats = AnalyzeCommandHistory()
print(string.format("Total: %d, Local: %d, Remote: %d, Spawns: %d",
    stats.total, stats.local_commands, stats.remote_commands, stats.spawn_commands))
```

### Backup and Restore

```lua
local function BackupConsoleSettings()
    local history = ConsoleScreenSettings:GetConsoleHistory()
    local expanded = ConsoleScreenSettings:IsWordPredictionWidgetExpanded()
    
    return {
        history = history,
        expanded = expanded,
        timestamp = os.time()
    }
end

local function RestoreConsoleSettings(backup)
    ConsoleScreenSettings:Reset()
    
    -- Restore history
    for _, entry in ipairs(backup.history) do
        ConsoleScreenSettings:AddLastExecutedCommand(entry.str, entry.remote)
    end
    
    -- Restore UI state
    ConsoleScreenSettings:SetWordPredictionWidgetExpanded(backup.expanded)
    
    -- Save restored settings
    ConsoleScreenSettings:Save()
end
```

## Technical Implementation Details

### Command Deduplication

The system implements intelligent command deduplication:

1. **Exact Match Detection**: Commands are compared by exact string match
2. **Position Management**: Duplicate commands move to end of history
3. **Remote Flag Updates**: Remote execution status updates for existing commands
4. **History Preservation**: Original command order maintained except for duplicates

### Persistence Strategy

- **Dirty Flag System**: Only saves when changes are detected
- **JSON Encoding**: Uses game's JSON encoder for cross-platform compatibility
- **Error Handling**: Graceful fallback for corrupt or missing save files
- **Branch Isolation**: Separate save files for different game branches

### Memory Management

- **Fixed History Size**: Maximum 20 commands prevents unbounded growth
- **Automatic Cleanup**: Oldest commands removed when limit exceeded
- **Lazy Loading**: Settings loaded only when needed
- **Efficient Storage**: Minimal data structure for optimal performance

## Integration Points

### Console Screen Integration

```lua
-- Console screen uses these methods for history management
local function OnCommandExecuted(command, is_remote)
    ConsoleScreenSettings:AddLastExecutedCommand(command, is_remote)
    ConsoleScreenSettings:Save()
end

local function GetCommandSuggestions()
    local history = ConsoleScreenSettings:GetConsoleHistory()
    -- Process history for autocomplete suggestions
    return suggestions
end
```

### Settings Synchronization

```lua
-- Ensure settings are saved before game exit
local function OnGameShutdown()
    ConsoleScreenSettings:Save(function(success)
        if success then
            print("Console settings saved on shutdown")
        end
    end)
end
```

## Error Handling

### Load Failures

```lua
function ConsoleScreenSettings:OnLoad(str, callback)
    if str == nil or string.len(str) == 0 then
        print("ConsoleScreenSettings could not load " .. self:GetSaveName())
        if callback then
            callback(false)
        end
        return
    end
    
    -- Proceed with loading...
end
```

### Save Failures

The system handles save failures gracefully:
- Dirty flag remains set on failure
- Retry mechanisms can be implemented
- Callback notifications for error handling

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 675312 | 2024-12-19 | Current implementation with history refactor support |

## Related Modules

- **[Console Commands](consolecommands.md)** - Commands that use this history system
- **[Class](class.md)** - Base class system
- **[Networking](networking.md)** - Remote command execution

## Technical Notes

- Settings are automatically saved when modified
- History maintains execution context (local vs remote)
- Branch-specific save files prevent conflicts
- Legacy data migration ensures backwards compatibility
- Maximum history size prevents memory issues

---

*This documentation covers the ConsoleScreenSettings module as of build 675312. The module provides essential infrastructure for console usability and command persistence.*
