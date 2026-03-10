---
id: usercommandpickerscreen
title: Usercommandpickerscreen
description: Displays a scrollable list of user-specific or server-level administrative command options in the UI, enabling vote-based or direct execution of commands like kick or ban.
tags: [ui, network, admin, voting]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: e4b20d3c
system_scope: ui
---

# Usercommandpickerscreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`UserCommandPickerScreen` is a UI screen widget that presents a dynamically populated list of administrative commands available to the current player for a specific target user or the server. It handles rendering button labels, enabling/disabling buttons based on command validity (including vote restrictions and user permissions), and executing commands via the `UserCommands` module. It is typically instantiated when a player opens a command context menu for another user or the server.

The screen interacts with `playervoter` and `worldvoter` components to determine if voting is currently active or blocked, and adjusts button states accordingly.

## Usage example
```lua
-- Example usage in a game context (e.g., on right-clicking a player or opening server menu)
local screen = UserCommandPickerScreen(player, targetuserid or nil, function()
    print("Command picker closed.")
end)
TheFrontEnd:PushScreen(screen)
```

## Dependencies & tags
**Components used:** `playervoter`, `worldvoter`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | — | The local player entity issuing the command. |
| `targetuserid` | number or `nil` | `nil` | User ID of the target user (if `nil`, server-wide commands are shown). |
| `onclosefn` | function | `nil` | Callback invoked when the screen is destroyed. |
| `time_to_refresh` | number | `0` | Timer tracking when to re-poll actions for validity. |
| `actions` | table | `nil` | List of command action objects (populated in `UpdateActions`). |
| `buttons` | table | `nil` | Table of `ImageButton` widgets representing commands. |

## Main functions
### `UpdateActions()`
* **Description:** Populates `self.actions` with available commands for the owner/target, excluding `kick` and `ban`. Actions are sorted alphabetically by `prettyname`.
* **Parameters:** None.
* **Returns:** Nothing.

### `RefreshButtons()`
* **Description:** Updates the state (enabled/disabled/selected) and hover text of each button based on command validity and voting state. Sets initial keyboard/controller focus if applicable.
* **Parameters:** None.
* **Returns:** Nothing.

### `RunAction(name)`
* **Description:** Executes the command associated with `name` via `UserCommands.RunUserCommand`, including target user context if applicable.
* **Parameters:** `name` (string) — internal command name to execute.
* **Returns:** Nothing.
* **Error states:** Returns early if `self.actions` is `nil` or no matching action is found.

### `OnUpdate(dt)`
* **Description:** Periodically refreshes the action list and button states. Pops the screen if no actions remain, or if the game is fading out.
* **Parameters:** `dt` (number) — Delta time since last frame.
* **Returns:** Nothing.

### `OnControl(control, down)`
* **Description:** Handles input; specifically, pressing `CONTROL_CANCEL` (e.g., Esc) closes the screen.
* **Parameters:** 
  * `control` — Input control constant (e.g., `CONTROL_CANCEL`).
  * `down` (boolean) — Whether the control was pressed (`true`) or released (`false`).
* **Returns:** `true` if the control was handled; `false` otherwise.

### `GetHelpText()`
* **Description:** Returns localized help text indicating how to cancel/close the screen (e.g., `"Esc Back"`).
* **Parameters:** None.
* **Returns:** `string` — Help text string.

### `OnDestroy()`
* **Description:** Invokes `onclosefn` if present and cleans up the screen.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (does not register event listeners).
- **Pushes:** None (does not fire custom events).