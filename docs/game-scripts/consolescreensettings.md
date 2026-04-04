---
id: consolescreensettings
title: Consolescreensettings
description: Manages persistent storage for console command history and UI widget states.
tags: [ui, settings, persistence]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: b6e41e69
system_scope: ui
---

# Consolescreensettings

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`ConsoleScreenSettings` is a standalone utility class responsible for managing user-specific console screen data. It handles the storage and retrieval of command history lines and word prediction widget expansion states. The class serializes this data to persistent storage using the simulation file system, ensuring settings persist across game sessions. It is not attached to an entity instance and operates independently of the Entity Component System.

## Usage example
```lua
local settings = ConsoleScreenSettings()

-- Add a command to the history
settings:AddLastExecutedCommand("c_spawn('beefalo')", true)

-- Retrieve the command history
local history = settings:GetConsoleHistory()

-- Save changes to disk
settings:Save(function(success)
    print("Save complete:", success)
end)
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persistdata` | table | `{}` | Stores all persistent settings including history and widget states. |
| `profanityservers` | table | `{}` | Reserved table for profanity filter server data. |
| `dirty` | boolean | `true` | Indicates whether the data has changed and requires saving. |

## Main functions
### `Reset()`
*   **Description:** Clears all persistent data and marks the settings as dirty to trigger a save.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetConsoleHistory()`
*   **Description:** Retrieves the list of previously executed console commands.
*   **Parameters:** None.
*   **Returns:** `table` - Array of command history entries, or empty table if none exist.

### `AddLastExecutedCommand(command_str, toggle_remote_execute)`
*   **Description:** Adds a new command to the history list. Handles duplicates by moving existing entries to the end and enforces a maximum limit of 20 saved commands.
*   **Parameters:**
    *   `command_str` (string) - The command string to save.
    *   `toggle_remote_execute` (boolean/nil) - Indicates if the command was remotely executed.
*   **Returns:** Nothing.
*   **Error states:** Returns early without saving if the command string is empty or matches `c_repeatlastcommand()`.

### `IsWordPredictionWidgetExpanded()`
*   **Description:** Checks the current expansion state of the word prediction widget.
*   **Parameters:** None.
*   **Returns:** `boolean` - `true` if expanded, `false` otherwise.

### `SetWordPredictionWidgetExpanded(value)`
*   **Description:** Sets the expansion state of the word prediction widget and marks data as dirty.
*   **Parameters:** `value` (boolean) - The desired expansion state.
*   **Returns:** Nothing.

### `Save(callback)`
*   **Description:** Serializes `persistdata` to JSON and writes it to persistent storage if the data is marked as dirty.
*   **Parameters:** `callback` (function) - Optional callback function called upon completion.
*   **Returns:** Nothing.

### `Load(callback)`
*   **Description:** Reads the persistent string from storage and parses it via `OnLoad`.
*   **Parameters:** `callback` (function) - Optional callback function called upon completion.
*   **Returns:** Nothing.

### `OnLoad(str, callback)`
*   **Description:** Internal handler that processes the loaded string. Decodes JSON and migrates legacy history data formats if detected.
*   **Parameters:**
    *   `str` (string) - The raw loaded data string.
    *   `callback` (function) - Optional callback function.
*   **Returns:** Nothing.
*   **Error states:** If `str` is nil or invalid, prints an error and calls the callback with `false`.

## Events & listeners
None identified.