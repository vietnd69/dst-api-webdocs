---
id: consolescreensettings
title: Console Screen Settings
description: Console history and settings persistence system for Don't Starve Together
sidebar_position: 9
slug: core-systems-consolescreensettings
last_updated: 2025-06-25
build_version: 676312
change_status: modified
---

# Console Screen Settings

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676312 | 2025-06-25 | modified | Improved type checking in OnLoad method for better error handling |
| 676042 | 2025-06-21 | stable | Previous version |

## Overview

The `ConsoleScreenSettings` class manages persistent settings and command history for the console interface in Don't Starve Together. It handles console command history storage, UI state persistence, and automatic save/load operations for user preferences.

## Usage Example

```lua
-- Initialize console settings
local console = ConsoleScreenSettings()

-- Load existing settings
console:Load(function(success)
    if success then
        print("Console settings loaded successfully")
    end
end)

-- Add commands to history
console:AddLastExecutedCommand("c_spawn('wilson')")
console:AddLastExecutedCommand("c_godmode()", true) -- Remote command

-- Access command history
local history = console:GetConsoleHistory()
for i, entry in ipairs(history) do
    print(i, entry.str, entry.remote and "(remote)" or "(local)")
end
```

## Constants

### MAX_SAVED_COMMANDS

**Value:** `20`

**Status:** `stable`

**Description:** Maximum number of commands stored in console history to prevent excessive memory usage.

## Classes/Components

### ConsoleScreenSettings

**Status:** `stable`

**Description:**
Main class for managing console settings and command history persistence.

**Version History:**
- Current implementation in build 676042

#### Constructor

```lua
ConsoleScreenSettings = Class(function(self)
    self.persistdata = {}
    self.profanityservers = {}
    self.dirty = true
end)
```

#### Properties

- `persistdata` (table): Stored console settings and command history data
- `profanityservers` (table): Server-specific profanity filter settings
- `dirty` (boolean): Flag indicating whether settings have unsaved changes

## Functions

### Reset() {#reset}

**Status:** `stable`

**Description:**
Resets all console settings to default values, sets the dirty flag, and immediately saves the changes.

**Parameters:** None

**Returns:** None

**Behavior:**
- Clears all persistent data
- Sets dirty flag to true
- Automatically calls Save() to persist changes

**Example:**
```lua
console:Reset()
```

**Version History:**
- Current implementation in build 676042

### GetConsoleHistory() {#get-console-history}

**Status:** `stable`

**Description:**
Returns the stored console command history as an array of command entries from the persistdata.

**Parameters:** None

**Returns:**
- (table): Array of history entries with structure `{str = "command", remote = boolean|nil}`, or empty table if no history exists

**Example:**
```lua
local history = console:GetConsoleHistory()
for i, entry in ipairs(history) do
    local remote_status = entry.remote and " [REMOTE]" or " [LOCAL]"
    print(string.format("%d: %s%s", i, entry.str, remote_status))
end
```

**Version History:**
- Current implementation in build 676042

### AddLastExecutedCommand(command_str, toggle_remote_execute) {#add-last-executed-command}

**Status:** `stable`

**Description:**
Adds a command to the persistent history with intelligent deduplication and remote execution tracking.

**Parameters:**
- `command_str` (string): The command string to add to history
- `toggle_remote_execute` (boolean, optional): Whether the command was executed remotely

**Returns:** None

**Behavior:**
- Trims leading and trailing whitespace from commands
- Ignores empty strings and `c_repeatlastcommand()` commands
- Moves duplicate commands to the end of history
- Updates remote execution flag for existing commands
- Maintains maximum history size limit

**Example:**
```lua
-- Add local command
console:AddLastExecutedCommand("c_spawn('wilson')")

-- Add remote command
console:AddLastExecutedCommand("c_godmode()", true)

-- These are ignored
console:AddLastExecutedCommand("")  -- Empty string
console:AddLastExecutedCommand("c_repeatlastcommand()")  -- Special command
```

**Version History:**
- Current implementation in build 676042

### IsWordPredictionWidgetExpanded() {#is-word-prediction-widget-expanded}

**Status:** `stable`

**Description:**
Checks whether the word prediction widget is currently in expanded state.

**Parameters:** None

**Returns:**
- (boolean): True if widget is expanded, false otherwise

**Example:**
```lua
if console:IsWordPredictionWidgetExpanded() then
    -- Show expanded prediction interface
    ShowExpandedView()
else
    -- Show compact prediction interface
    ShowCompactView()
end
```

**Version History:**
- Current implementation in build 676042

### SetWordPredictionWidgetExpanded(value) {#set-word-prediction-widget-expanded}

**Status:** `stable`

**Description:**
Sets the expansion state of the word prediction widget and marks settings as dirty for saving.

**Parameters:**
- `value` (boolean): True to expand widget, false to collapse

**Returns:** None

**Example:**
```lua
-- Expand the prediction widget
console:SetWordPredictionWidgetExpanded(true)

-- Collapse the prediction widget
console:SetWordPredictionWidgetExpanded(false)
```

**Version History:**
- Current implementation in build 676042

### GetSaveName() {#get-save-name}

**Status:** `stable`

**Description:**
Returns the appropriate save file name based on the current game branch.

**Parameters:** None

**Returns:**
- (string): Save file name ("consolescreen" for release, "consolescreen_[branch]" for development)

**Example:**
```lua
local filename = console:GetSaveName()
-- Returns: "consolescreen" or "consolescreen_dev"
```

**Version History:**
- Current implementation in build 676042

### Save(callback) {#save}

**Status:** `stable`

**Description:**
Saves current settings to persistent storage if changes have been made (dirty flag is set).

**Parameters:**
- `callback` (function, optional): Callback function called after save operation

**Callback Parameters:**
- `success` (boolean): Whether the save operation succeeded

**Returns:** None

**Behavior:**
- Only saves when `dirty` flag is true (changes were made)
- Sets `dirty` flag to false after successful save operation
- Uses JSON encoding for data serialization
- Calls SavePersistentString with filename from GetSaveName()
- If not dirty, immediately calls callback with success=true

**Example:**
```lua
-- Save with callback
console:Save(function(success)
    if success then
        print("Settings saved successfully")
    else
        print("Failed to save settings")
    end
end)

-- Save without callback
console:Save()
```

**Version History:**
- Current implementation in build 676042

### Load(callback) {#load}

**Status:** `stable`

**Description:**
Loads settings from persistent storage using the platform's persistent string system.

**Parameters:**
- `callback` (function, optional): Callback function called after load operation

**Returns:** None

**Behavior:**
- Uses TheSim:GetPersistentString() to retrieve saved data
- Ignores the load_success parameter, only checks if string content exists
- Delegates actual data processing to OnLoad() method
- Passes callback through to OnLoad for completion notification

**Example:**
```lua
console:Load(function(success)
    if success then
        print("Settings loaded successfully")
        local history = console:GetConsoleHistory()
        print("Loaded", #history, "command entries")
    else
        print("Failed to load settings")
    end
end)
```

**Version History:**
- Current implementation in build 676042

### OnLoad(str, callback) {#on-load}

**Status:** `modified in build 676312`

**Description:**
Internal method that processes loaded data string and handles legacy save data migration. Enhanced with improved type checking for better error handling.

**Parameters:**
- `str` (string): JSON-encoded settings data string
- `callback` (function, optional): Completion callback

**Returns:** None

**Behavior:**
- **Enhanced Type Checking**: Validates that `str` is a string type before checking length (improved in 676312)
- Decodes JSON data into persistdata table using TrackedAssert for error handling
- Handles migration from legacy save format (history + localremotehistory arrays)
- Sets dirty flag to false after successful load
- Converts old format to new historylines structure if needed
- Prints load status and string length to console
- Automatically sets dirty flag to true if migration occurs

**Type Safety Enhancement (Build 676312):**
```lua
-- Previous validation (could fail with non-string types)
if str == nil or string.len(str) == 0 then

-- Enhanced validation (now includes type checking)
if str == nil or type(str) ~= "string" or string.len(str) == 0 then
```

**Example:**
```lua
-- This is typically called internally by Load()
-- Manual usage not recommended
```

**Version History:**
- Modified in build 676312: Enhanced type checking for better error handling
- Current implementation in build 676042
- Includes CONSOLE_HISTORY_REFACTOR migration support

## Data Structures

### History Entry Format

```lua
{
    str = "command_string",      -- The executed command
    remote = true|false|nil      -- Remote execution status (nil = local)
}
```

### Persistent Data Structure

```lua
persistdata = {
    historylines = {
        { str = "c_spawn('wilson')", remote = nil },
        { str = "c_godmode()", remote = true },
        -- ... up to MAX_SAVED_COMMANDS entries
    },
    expanded = true  -- Word prediction widget expansion state
}
```

### Legacy Data Migration

The system automatically converts old save formats:

```lua
-- Old format (converted automatically)
{
    history = { "command1", "command2" },
    localremotehistory = { true, false }
}

-- Becomes new format
{
    historylines = {
        { str = "command1", remote = true },
        { str = "command2", remote = false }
    }
}
```

## Implementation Details

### Command Deduplication Logic

1. **Whitespace Trimming**: Commands are trimmed of leading/trailing whitespace
2. **Empty Command Filtering**: Empty strings and `c_repeatlastcommand()` are ignored
3. **Duplicate Detection**: Exact string matching identifies duplicate commands
4. **Position Management**: Duplicates are moved to end of history array
5. **Remote Flag Updates**: Remote execution status is updated for existing commands

### History Size Management

- **Maximum Limit**: 20 commands maximum (MAX_SAVED_COMMANDS)
- **Overflow Handling**: Oldest commands are removed when limit is exceeded
- **Efficient Storage**: Minimal data structure for optimal performance

### Persistence Strategy

- **Dirty Flag System**: Only saves when changes are detected
- **JSON Encoding**: Cross-platform compatible data serialization
- **Branch Isolation**: Separate save files for different game branches
- **Error Handling**: Graceful fallback for corrupt or missing save files

## Related Modules

- [Console Commands](consolecommands.md): Commands that utilize this history system
- [Class](class.md): Base class inheritance system
- [JSON](json.md): Data encoding/decoding utilities
