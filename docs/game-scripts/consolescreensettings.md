---
id: consolescreensettings
title: Consolescreensettings
description: Manages persistent storage and history for the console screen, including command history, word prediction state, and save/load operations.
tags: [console, ui, persistence, network]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: b6e41e69
system_scope: ui
---

# Consolescreensettings

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`ConsoleScreenSettings` handles persistent configuration and history for the in-game console screen. It stores command history (up to `MAX_SAVED_COMMANDS` entries) and word prediction widget state in persistent storage, and provides methods to load, save, and manipulate this data. It is used exclusively on the client for UI state management and does not interact with server-side entities or replication.

## Usage example
```lua
local settings = ConsoleScreenSettings()
settings:Load()

-- Add a command to history
settings:AddLastExecutedCommand("c_give(master, 'log')", false)

-- Check and set word prediction state
if not settings:IsWordPredictionWidgetExpanded() then
    settings:SetWordPredictionWidgetExpanded(true)
end

-- Persist changes to disk
settings:Save()
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `persistdata` | table | `{}` | Internal dictionary storing all persisted settings (e.g., `"historylines"`, `"expanded"`). |
| `profanityservers` | table | `{}` | Reserved placeholder; unused in current implementation. |
| `dirty` | boolean | `true` | Flag indicating whether unsaved changes exist. |

## Main functions
### `Reset()`
* **Description:** Clears all persistent settings, marks the instance as dirty, and triggers an immediate save.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetConsoleHistory()`
* **Description:** Returns the current list of saved console command history lines.
* **Parameters:** None.
* **Returns:** `{ { str = string, remote = boolean }, ... }` — list of command entries; each entry contains `str` (command text) and `remote` (execution context flag). Returns empty array if none exist.

### `AddLastExecutedCommand(command_str, toggle_remote_execute)`
* **Description:** Adds a command to the history if not empty or a repeat of `c_repeatlastcommand()`. Ensures no duplicate entries and maintains max `MAX_SAVED_COMMANDS` items by shifting duplicates to the end and removing oldest entries as needed.
* **Parameters:**
  * `command_str` (string) — The console command string to add.
  * `toggle_remote_execute` (boolean or nil) — Whether the command should be executed remotely. Converted to `true` or `nil`.
* **Returns:** Nothing.
* **Error states:** Does nothing if `command_str` is empty or exactly `"c_repeatlastcommand()"`.

### `IsWordPredictionWidgetExpanded()`
* **Description:** Checks whether the word prediction widget UI is currently expanded.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if expanded, otherwise `false`.

### `SetWordPredictionWidgetExpanded(value)`
* **Description:** Sets the expanded state of the word prediction widget.
* **Parameters:** `value` (boolean) — The new expanded state.
* **Returns:** Nothing.

### `GetSaveName()`
* **Description:** Returns the persistent storage key used for saving/loading.
* **Parameters:** None.
* **Returns:** `string` — `"consolescreen"` for non-dev builds; `"consolescreen_"..BRANCH` for dev builds.

### `Save(callback)`
* **Description:** Serializes `persistdata` to JSON and writes it to persistent storage if `dirty` is `true`. Calls `callback` upon completion.
* **Parameters:** `callback` (function or nil) — Optional function receiving `(success: boolean)` as argument.
* **Returns:** Nothing directly; `callback` receives success status.

### `Load(callback)`
* **Description:** Initiates loading of saved settings from persistent storage using `TheSim:GetPersistentString`.
* **Parameters:** `callback` (function or nil) — Optional function receiving `(success: boolean)` as argument.
* **Returns:** Nothing.

### `OnLoad(str, callback)`
* **Description:** Handles loaded string data: decodes JSON, migrates legacy `"history"`/`"localremotehistory"` keys to new `"historylines"` format, and calls `callback`.
* **Parameters:**
  * `str` (string) — Raw persistent string from disk.
  * `callback` (function or nil) — Optional function receiving `(success: boolean)` as argument.
* **Returns:** Nothing.

## Events & listeners
None identified.