---
id: worldresettimer
title: Worldresettimer
description: Manages the world reset dialog UI, including countdown display, survival time, and admin-triggered world resets.
tags: [ui, world, network]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: b1c8e548
system_scope: ui
---

# Worldresettimer

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`WorldResetTimer` is a UI widget that presents a visual interface for world reset events. It displays the current world cycle count, survival time, and a countdown to world reset. It supports both keyboard/mouse and controller input, with a special hold-to-reset mechanic for controllers. The widget is owned by a player entity and responds to world-level events (`showworldreset`, `hideworldreset`, `cycleschanged`, `worldresettick`). It is typically added to the HUD and only functions for server admins during active reset periods.

## Usage example
```lua
-- Typically instantiated and attached internally by the HUD system.
-- Manual usage example for modding reference:
local owner = ThePlayer
local widget = WorldResetTimer(owner)
owner.HUD:AddChild(widget)
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None added, removed, or checked by this widget.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `root` | Widget | — | Root widget container for all UI elements. |
| `owner` | Entity | `nil` | The player entity that owns this widget. |
| `y_pos` | number | `closedY` | Current vertical position for slide-in/out animation. |
| `started` | boolean | `false` | Whether a reset countdown is currently active. |
| `reset_hold_time` | number | `0` | Accumulated time (seconds) the pause button is held on controller. |
| `_oncontinuefrompause` | function | `nil` | Event listener for `continuefrompause` to refresh layout. |
| `_oncycleschanged` | function | `nil` | Event listener for `cycleschanged` to update cycle count. |
| `_onworldresettick` | function | `nil` | Event listener for `worldresettick` to update countdown. |
| `_lastshowntime` | number? | `nil` | Stores the last countdown time shown to avoid redundant updates. |

## Main functions
### `RefreshLayout()`
* **Description:** Adjusts the UI layout and controls based on whether a gamepad is attached. For controllers, it replaces the reset button with a text prompt indicating how to hold to reset.
* **Parameters:** None.
* **Returns:** Nothing.

### `RefreshButtons()`
* **Description:** Enables/disables the reset button or toggles visibility of the controller hold-text based on input focus and reset state.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Handles animation (slide-in/out), controller hold-to-reset logic, and stopping updates when hidden.
* **Parameters:** `dt` (number) — delta time in seconds since last frame.
* **Returns:** Nothing.
* **Error states:** None.

### `StartTimer()`
* **Description:** Begins the reset countdown UI session. Registers listeners for `cycleschanged` and `worldresettick`, shows the widget, and starts updating.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `started` is already `true`.

### `StopTimer()`
* **Description:** Ends the reset countdown session. Unregisters event listeners and prepares for hiding.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `started` is `false`.

### `Reset()`
* **Description:** Sends a world reset request to the server if the local player is a server admin and the timer is running.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns silently if the player is not a server admin or `started` is `false`.

### `UpdateCycles(cycles)`
* **Description:** Updates the title text to show the current world cycle count (adjusted for ghost player status).
* **Parameters:** `cycles` (number) — the current world cycle count.
* **Returns:** Nothing.

### `UpdateCountdown(time)`
* **Description:** Updates the countdown message with the remaining time until reset, and plays a tick sound. Suppresses duplicate updates.
* **Parameters:** `time` (number?) — remaining time in seconds; `nil` indicates generic countdown message.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `showworldreset` (on `TheWorld`) — triggers `StartTimer()`.
  - `hideworldreset` (on `TheWorld`) — triggers `StopTimer()`.
  - `cycleschanged` (on `TheWorld`, via `_oncycleschanged`) — calls `UpdateCycles()`.
  - `worldresettick` (on `TheWorld`, via `_onworldresettick`) — calls `UpdateCountdown()`.
  - `continuefrompause` (on `TheWorld`, via `_oncontinuefrompause`) — calls `RefreshLayout()`.
- **Pushes:** No events are directly pushed by this component.