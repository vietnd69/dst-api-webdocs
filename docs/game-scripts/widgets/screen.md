---
id: screen
title: Screen
description: Base class for UI screens that manage event handlers, focus states, and activation/deactivation logic.
tags: [ui]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 076259e0
system_scope: ui
---

# Screen

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Screen` is a base widget class for UI screens in the game. It extends `Widget` and provides core functionality for managing screen lifecycle, event handling, and focus management. Screens are typically used to represent distinct UI states (e.g., pause menu, character select), and integrate with the game’s UI system by registering/unregistering with `TheSim` as the active UI root.

## Usage example
```lua
local Screen = require "widgets/screen"
local MyScreen = Class(Screen, function(self, name)
    Screen._ctor(self, name)
    -- Custom initialization
end)

function MyScreen:OnCreate()
    -- Setup UI elements
end

local screen = MyScreen("myscreen")
screen:OnCreate()
screen:OnBecomeActive()
screen:RemoveEventHandler("someevent", myHandler)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `handlers` | table | `{}` | Event handler registry mapping event names to function sets. |
| `is_screen` | boolean | `true` | Flag indicating this object is a screen. |
| `last_focus` | Widget or nil | `nil` | Tracks the last focused widget when screen becomes inactive. |
| `default_focus` | Widget or nil | `nil` | Widget to receive focus when the screen becomes active (if no `last_focus` is available). |

## Main functions
### `OnBecomeActive()`
*   **Description:** Activates the screen by setting it as the active UI root and restoring or setting focus to a widget.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnBecomeInactive()`
*   **Description:** Records the currently focused widget (deepest in focus stack) before the screen becomes inactive.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnCreate()`
*   **Description:** Called during screen creation. Intended to be overridden by subclasses for initialization logic.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnDestroy()`
*   **Description:** Cleans up the screen during destruction by calling `Kill()`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called each frame during screen activity. Default implementation returns `true` (no error).
*   **Parameters:** `dt` (number) — Delta time since last frame.
*   **Returns:** `true` — indicating successful update.

### `AddEventHandler(event, fn)`
*   **Description:** Registers an event handler function for a given event type.
*   **Parameters:**  
    `event` (string) — Name of the event.  
    `fn` (function) — Handler function to invoke when event is fired.  
*   **Returns:** `fn` — The handler function, for convenience.

### `RemoveEventHandler(event, fn)`
*   **Description:** Removes a previously registered event handler.
*   **Parameters:**  
    `event` (string) — Name of the event.  
    `fn` (function) — Handler function to remove.  
*   **Returns:** Nothing.

### `HandleEvent(type, ...)`
*   **Description:** Invokes all registered handlers for a given event type.
*   **Parameters:**  
    `type` (string) — Event name.  
    `...` — Variable arguments passed to handlers.  
*   **Returns:** Nothing.

### `SetDefaultFocus()`
*   **Description:** Attempts to set focus to the `default_focus` widget.
*   **Parameters:** None.
*   **Returns:** `true` if `default_focus` exists and `SetFocus()` is called; `nil` otherwise.

## Events & listeners
None identified  
(This component does not register or fire events itself.)