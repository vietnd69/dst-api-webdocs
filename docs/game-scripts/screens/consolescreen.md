---
id: consolescreen
title: Consolescreen
description: Manages the in-game debug console screen, handling input, command execution (local or remote), and autocomplete features.
tags: [ui, console, debug, network]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: ff680524
system_scope: ui
---

# Consolescreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`Consolescreen` is a `Screen` subclass that implements the debug console interface for Don't Starve Together. It provides a UI for entering and executing console commands, supports local versus remote execution (for server admins or console clients), and includes autocomplete for commands (`c_*`/`d_*`) and prefabs. It integrates with `ConsoleScreenSettings` for command history persistence and interacts with `TheNet` for remote execution when applicable.

## Usage example
```lua
-- Launch the console screen programmatically
local ConsoleScreen = require "screens/consolescreen"
TheFrontEnd:PushScreen(ConsoleScreen())
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks `TheNet:GetIsClient()`, `TheNet:GetIsServerAdmin()`, `IsConsole()`, `InGamePlay()`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `runtask` | Task? | `nil` | A pending delayed task for executing the command; cancelled on screen deactivation or re-entry. |
| `ctrl_pasting` | boolean | `false` | Tracks whether a Ctrl+V paste operation is in progress. |
| `toggle_remote_execute` | boolean | `false` | Current mode: `true` for remote execution, `false` for local. |
| `history_idx` | number? | `nil` | Current 1-based index in the console history buffer for up/down navigation. |
| `edit_width` | number | `900` | Width of the command input area. |
| `label_height` | number | `50` | Height of the input field. |
| `console_edit` | TextEdit | — | The main command input field widget. |
| `console_remote_execute` | Text | — | Label indicating current execute mode (local/remote). |
| `console_history` | ConsoleHistoryWidget? | `nil` | Only present in dev builds; displays history dropdown. |

## Main functions
### `OnBecomeActive()`
* **Description:** Activates the console screen. Brings up the console log, focuses the edit field, enables editing, and sets the execute mode based on player role (client/server/admin/console).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnBecomeInactive()`
* **Description:** Deactivates the console screen. Cancels any pending run task (`runtask`).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnDestroy()`
* **Description:** Cleans up the screen. Disables console auto-pause and calls parent destroy logic.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles control inputs. Immediately returns `true` if a remote execution task is pending. Closes the console on ESC (CANCEL) or OpenDebugConsole when key is released (`down == false`).
* **Parameters:** `control` (CONTROL), `down` (boolean).
* **Returns:** `true` if input is consumed.

### `ToggleRemoteExecute(force)`
* **Description:** Toggles or forces the execute mode between local and remote. Only enables remote mode if the client has admin rights or is a console.
* **Parameters:** `force` (boolean?; optional) — if provided (`true`/`false`), sets the mode explicitly; otherwise toggles.
* **Returns:** Nothing.
* **Error states:** Remote UI is hidden if not in a valid context (`TheNet:GetIsClient()` and admin/console), and mode defaults to server state if forced.

### `OnRawKeyHandler(key, down)`
* **Description:** Handles raw keyboard events. Implements console history navigation (Up/Down arrows), toggles remote mode on Ctrl release, and clears paste state.
* **Parameters:** `key` (KEY_*), `down` (boolean).
* **Returns:** Always `true` to consume the key event.

### `Run()`
* **Description:** Executes the current console command string. Sends to `TheNet:SendRemoteExecute` if remote mode is active and allowed; otherwise calls `ExecuteConsoleCommand`. Records usage via `SuUsedAdd("console_used")`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Close()`
* **Description:** Closes the console screen and hides the console log. Re-enables debug toggle and restores input.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnTextEntered()`
* **Description:** Triggered when the user presses Enter on the console input. Schedules a delayed execution of `Run()` via a one-frame task, then closes the screen unless `closeonrun` is enabled (logs stay visible).
* **Parameters:** None.
* **Returns:** Nothing.

### `DoInit()`
* **Description:** Initializes the screen UI components: root widget hierarchy, background image, remote mode label, `TextEdit` input, autocomplete dictionaries (prefabs, `c_*`, `d_*`), and dev-mode history widget. Also configures input handling and default state.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"onhistoryupdated"` — updates the input text and remote mode based on history index changes.  
  - `"onconsolehistoryitemclicked"` (dev only) — syncs remote mode when history item is clicked.  
  - `"onwordpredictionupdated"` (dev only) — hides the history dropdown and resets remote mode if console is inactive.  
  - `"onconsolehistoryupdated"` — emitted internally when navigating history.

- **Pushes:** `"onconsolehistoryupdated"` — emitted from history navigation (`KEY_UP`, `KEY_DOWN`) to notify other widgets.