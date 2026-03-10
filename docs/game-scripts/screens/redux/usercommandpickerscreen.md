---
id: usercommandpickerscreen
title: Usercommandpickerscreen
description: Displays a scrollable list of user commands (player or server-specific) and handles user selection and execution.
tags: [ui, player, network, client]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: 03f1bfd1
system_scope: ui
---

# Usercommandpickerscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`UserCommandPickerScreen` is a UI screen component that presents a dynamic, scrollable menu of actionable commands applicable to either a specific player (via `targetuserid`) or the server as a whole. It retrieves available commands via `UserCommands`, populates buttons, updates their enabled state and hover text based on runtime conditions (e.g., voting restrictions), and handles execution of selected commands. It interacts with the `playervoter` and `worldvoter` components to validate vote-related actions.

## Usage example
```lua
-- Show the player command picker for a given target user
local screen = AddChild(UserCommandPickerScreen(player, targetuserid, function()
    print("Picker closed.")
end))
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** `playervoter`, `worldvoter`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity (typically the local player) on whose behalf commands are executed. |
| `targetuserid` | number or nil | `nil` | The network user ID of the target player, or `nil` for server-level commands. |
| `onclosefn` | function | `nil` | Optional callback executed when the screen is closed. |
| `actions` | table | `nil` | List of available command action definitions, updated periodically. |
| `buttons` | table | `{}` | List of UI buttons corresponding to each action. |
| `time_to_refresh` | number | `0` | Countdown timer before next automatic refresh of available commands. |

## Main functions
### `UpdateActions()`
* **Description:** Fetches the list of applicable commands (player or server) and filters out `kick` and `ban`, then sorts them by `menusort` and name.
* **Parameters:** None.
* **Returns:** Nothing.

### `RefreshButtons()`
* **Description:** Updates each button’s state (hover text, focusability) based on current game state and voter status. Sets initial focus for controller users.
* **Parameters:** None.
* **Returns:** Nothing.

### `RunAction(name)`
* **Description:** Executes the command associated with the given `name`, unless it’s a special-case internal command like `toggle_servername`.
* **Parameters:**  
  - `name` (string) – The `commandname` of the action to execute.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Periodically refreshes the command list and button states. Closes the screen if no commands are available.
* **Parameters:**  
  - `dt` (number) – Time since last frame.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input — specifically, the `CONTROL_CANCEL` control triggers screen dismissal.
* **Parameters:**  
  - `control` (number) – The control code pressed.  
  - `down` (boolean) – Whether the control is pressed (`true`) or released (`false`).
* **Returns:** `true` if the event was handled.

### `GetHelpText()`
* **Description:** Returns localized help text indicating how to cancel/exit the screen (e.g., "Esc Back").
* **Parameters:** None.
* **Returns:** `string` – Help text string.

### `OnDestroy()`
* **Description:** Invokes `onclosefn` (if set) before calling parent destroy logic.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** None.  
- **Listens to:** None directly. It responds to UI events (`OnControl`, `OnUpdate`, `OnDestroy`) but does not register `inst:ListenForEvent(...)` calls.