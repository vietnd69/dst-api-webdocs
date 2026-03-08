---
id: mousetracker
title: Mousetracker
description: Tracks mouse movement relative to a joystick widget and triggers direction-specific animations for UI interaction.
tags: [ui, input, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 94b23450
system_scope: ui
---

# Mousetracker

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MouseTracker` is a UI widget subclass that enables joystick-style mouse interaction. It listens for mouse movement over an associated `UIAnim` joystick and dynamically updates the joystick's animation based on the angle of the mouse relative to the joystick's center. It also supports a configurable click handler for when the joystick area is clicked. The component is specifically used for interactive UI elements like the joystick in the tradescreen.

## Usage example
```lua
local MouseTracker = require "widgets/mousetracker"

-- Assuming `anim` is a valid animation build name and `on_click` is a callback function
local tracker = MouseTracker("joystick_anm", function()
    print("Joystick clicked!")
end)

-- Add to a widget or screen container
screen:AddChild(tracker)
tracker:Start()   -- begin tracking mouse movement
-- tracker:Stop()  -- to pause tracking
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Does not manipulate entity tags; pure UI component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `onclickFn` | function or `nil` | `nil` | Callback function invoked when the joystick area is clicked. |
| `joystick` | `UIAnim` widget | — | Child widget used to display the animated joystick graphic. |
| `joystickmover` | `MoveHandler` or `nil` | `nil` | Internal handler registered to track mouse movement while active. |

## Main functions
### `Start()`
* **Description:** Begins tracking mouse movement. Registers a mouse move handler that calculates the angle between the joystick center and the mouse position, then updates the joystick animation to match the direction.
* **Parameters:** None.
* **Returns:** Nothing.

### `Stop()`
* **Description:** Stops mouse tracking, removes the move handler, and resets the joystick animation to the `"idle"` state.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetAnim(angle)`
* **Description:** Maps a given angle (in radians) to a named animation string corresponding to 8-directional orientations (e.g., `"3"`, `"1:30"`, `"12"`).
* **Parameters:**  
  `angle` (number) — Angle in radians, measured counter-clockwise from the positive X axis (`-math.pi < angle <= math.pi`).
* **Returns:** `string` — A directional animation name based on the angle quadrant.
* **Error states:** Returns `"3"` for angles at or beyond boundary thresholds (eight discrete directions).

## Events & listeners
- **Listens to:** Mouse move events via `TheInput:AddMoveHandler(...)` — internally triggered while `Start()` is active.
- **Pushes:** None identified.