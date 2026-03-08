---
id: votedialog
title: Votedialog
description: Manages the vote UI dialog for player-initiated votes in multiplayer matches, handling visual rendering, animation, and integration with the player voter component and controller screen.
tags: [ui, multiplayer, voting]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 90437e7c
system_scope: ui
---

# Votedialog

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`VoteDialog` is a UI widget component that renders and animates the vote dialog interface during active votes in Don't Starve Together multiplayer sessions. It displays vote options, counts, and a countdown timer, and manages user input (both keyboard/mouse and controller). It integrates with the `playervoter` component to submit votes and with `playercontroller` to show controller hints. The widget responds to world-level events (`showvotedialog`, `hidevotedialog`, `worldvotertick`, `votecountschanged`) and player-local events (`playervotechanged`) to stay synchronized with game state.

## Usage example
```lua
-- Assuming `owner` is a valid player entity instance:
owner:AddComponent("votedialog")
owner.components.votedialog:ShowDialog({
    starterclient = { name = "Alice", colour = {1, 0, 0, 1} },
    targetclient = { name = "Bob" },
    votetitlefmt = "Vote to ban %s?",
    options = {
        { description = "Yes", vote_count = 2 },
        { description = "No", vote_count = 1 }
    }
})
```

## Dependencies & tags
**Components used:**  
- `playervoter` (`self.owner.components.playervoter`) — to submit votes and check vote eligibility  
- `playercontroller` (`self.owner.components.playercontroller`) — for controller target and inspect action checks  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | `nil` | The player entity that owns this vote dialog. |
| `controller_mode` | `boolean` | `false` | Whether a controller is currently attached. |
| `controller_hint_delay` | `number` | `0` | Delay before showing controller instructions (in seconds). |
| `started` | `boolean` | `false` | Whether the vote dialog is currently active and animating. |
| `settled` | `boolean` | `false` | Whether the dialog has finished its entrance animation and is at rest. |
| `canvote` | `boolean` | `false` | Whether the owner is currently allowed to submit a vote. |
| `controllerselection` | `number?` | `nil` | The index of the selection made in the controller vote screen. |
| `num_options` | `number` | `0` | Number of vote options displayed. |
| `buttons` | `table` | `{}` | Array of `ImageButton` widgets for vote options. |
| `labels_desc` | `table` | `{}` | Array of `Text` widgets displaying vote option descriptions. |
| `dialogroot` | `Widget` | `nil` | Root widget container for dialog elements (background, text, options). |
| `root` | `Widget` | `nil` | Top-level widget container for animated positioning. |

## Main functions
### `ShowDialog(option_data)`
* **Description:** Displays and animates the vote dialog for a new vote. Parses vote options, sets title, timer, and starter name, then initiates a slide-down animation.  
* **Parameters:**  
  - `option_data` (table) — vote payload containing `starterclient`, `targetclient`, `votetitlefmt`, and `options` (array of vote option tables with `description` and optional `vote_count`).  
* **Returns:** Nothing.  
* **Error states:** Early return if `option_data` is `nil`.

### `RefreshLayout()`
* **Description:** Recalculates positions of all UI elements (background, text, buttons) based on the number of vote options. Also handles controller-specific layout adjustments and updating controller hints.  
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:** None identified.

### `RefreshController()`
* **Description:** Controls visibility of the controller instruction text (e.g., "A to vote"). Shows/hides the instruction based on controller mode, input focus, `playercontroller` state, and controller screen status.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `UpdateOptions(option_data, norefresh)`
* **Description:** Updates the vote options list (descriptions and vote counts) and adjusts UI element visibility.  
* **Parameters:**  
  - `option_data` (table) — vote payload with `options` array.  
  - `norefresh` (boolean) — if `true`, skips calling `RefreshLayout()` to avoid duplicate refreshes during initialization.  
* **Returns:** Nothing.  
* **Error states:** Early return if `self.started` is `false`.

### `UpdateSelection(selected_index, canvote)`
* **Description:** Updates button textures to indicate the currently selected vote option and enables/disables all buttons based on voting eligibility.  
* **Parameters:**  
  - `selected_index` (number?) — 1-based index of the currently selected option (`nil` if none).  
  - `canvote` (boolean) — whether the owner may submit a vote.  
* **Returns:** Nothing.

### `OnOpenControllerVoteScreen()`
* **Description:** Opens the dedicated `ControllerVoteScreen` overlay when the owner presses the inspect control on a controller. Handles screen transitions, animations, and focus setup.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `OnCloseControllerVoteScreen(selection)`
* **Description:** Closes the `ControllerVoteScreen`, restores UI state, and updates internal selection state. *Must not be called directly; use `CloseControllerVoteScreen()` instead.*  
* **Parameters:**  
  - `selection` (number?) — the selected option index from the controller screen.  
* **Returns:** Nothing.

### `CheckControl(control, down)`
* **Description:** Handles controller input (`CONTROL_INSPECT`) to open the controller vote screen if the instruction is visible.  
* **Parameters:**  
  - `control` (number) — the `CONTROL_*` constant being pressed.  
  - `down` (boolean) — `true` if the control is pressed, not released.  
* **Returns:** `true` if input was consumed, otherwise `false`.  
* **Error states:** Returns `false` if dialog not visible, not enabled, or `CONTROL_INSPECT` not pressed.

### `IsOpen()`
* **Description:** Returns whether the vote dialog is currently active (`self.started == true`).  
* **Parameters:** None.  
* **Returns:** `boolean`.

### `HideDialog()`
* **Description:** Hides the dialog and initiates a slide-up exit animation. Stops vote-related input handling.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `UpdateTimer(remaining)`
* **Description:** Updates the vote timer display with the remaining time in seconds.  
* **Parameters:**  
  - `remaining` (number?) — remaining time in seconds (optional).  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `showvotedialog` (world event) — triggers `ShowDialog(data)` to begin vote display.  
  - `hidevotedialog` (world event) — triggers `HideDialog()`.  
  - `worldvotertick` (world event) — calls `UpdateTimer(data.time)` to update countdown.  
  - `votecountschanged` (world event) — calls `UpdateOptions(data)` to refresh vote counts.  
  - `playervotechanged` (player event) — calls `UpdateSelection(data.selection, data.canvote)` to update selection state.  
  - `continuefrompause` (world event) — re-checks controller attachment and refreshes layout.  
- **Pushes:** None (does not fire any custom events).