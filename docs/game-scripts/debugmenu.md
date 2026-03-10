---
id: debugmenu
title: Debugmenu
description: Provides a text-based interactive menu system for debugging UI, allowing dynamic configuration via numeric toggles, checkboxes, submenus, and actions.
tags: [debug, ui, menu]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: b5d64f97
system_scope: ui
---

# Debugmenu

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `debugmenu` module provides a lightweight, stack-based text menu system used for internal debugging purposes. It defines several option types (`DoAction`, `Submenu`, `NumericToggle`, `CheckBox`) and the core `TextMenu` class that manages navigation, rendering, and event dispatching for hierarchical debug menus. The system is self-contained and does not interact with the ECS—no components are added to entities, nor are any tags manipulated. It is typically used in console or developer builds to tweak game state interactively.

## Usage example
```lua
local debugmenu = require "debugmenu"

local speed = 1.0
local godmode = false

local root = {
    debugmenu.NumericToggle("Walk Speed", 0.1, 10.0, function() return speed end, function(v) speed = v end),
    debugmenu.CheckBox("God Mode", function() return godmode end, function(v) godmode = v end),
    debugmenu.DoAction("Exit", function(menu) menu:Pop() end),
}

local menu = debugmenu.TextMenu("SETTINGS")
menu:PushOptions(root)

menu:Down()
menu:Right()
menu:Accept()
print(tostring(menu))
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `title` | string | `"MENU"` | The display name of the menu, shown in the header. |
| `optionsstack` | table of tables | `{}` | Stack of option arrays for navigation history (supporting submenus). |
| `cursor_index_stack` | table of numbers | `{}` | Stack of cursor positions for returning to parent menu states. |
| `name_stack` | table of strings | `{}` | Stack of menu names for navigating menu hierarchy. |
| `index` | number | `1` | Current cursor position in the active options list. |
| `name` | string | `""` | Name of the current menu context. |

## Main functions
### `TextMenu:PushOptions(options, name)`
* **Description:** Pushes a new set of options onto the menu stack, entering a new menu context (e.g., a submenu).
* **Parameters:**  
  `options` (table) — Array of `MenuOption` objects (e.g., `DoAction`, `NumericToggle`, `Submenu`).  
  `name` (string, optional) — Display name for the new menu context.
* **Returns:** Nothing.

### `TextMenu:Pop()`
* **Description:** Pops the current menu context, returning to the parent menu (if available). Restores previous cursor position and menu name.
* **Parameters:** None.
* **Returns:** `true` if successfully popped and a parent context exists; `false` if already at root.
* **Error states:** No-op and returns `false` when called at root level (`AtRoot()` is `true`).

### `TextMenu:Up()`
* **Description:** Moves the cursor up one position, wrapping to the bottom if at the top.
* **Parameters:** None.
* **Returns:** Nothing.

### `TextMenu:Down()`
* **Description:** Moves the cursor down one position, wrapping to the top if at the bottom.
* **Parameters:** None.
* **Returns:** Nothing.

### `TextMenu:Left()`
* **Description:** Invokes `Left(self)` on the currently selected option (e.g., decreases a numeric value or unchecks a box).
* **Parameters:** None.
* **Returns:** Nothing.

### `TextMenu:Right()`
* **Description:** Invokes `Right(self)` on the currently selected option (e.g., increases a numeric value or checks a box).
* **Parameters:** None.
* **Returns:** Nothing.

### `TextMenu:Accept()`
* **Description:** Invokes `Accept(self)` on the currently selected option (e.g., executes an action or opens a submenu).
* **Parameters:** None.
* **Returns:** Nothing.

### `TextMenu:Cancel()`
* **Description:** Invokes `Cancel(self)` on the currently selected option (typically triggers `menu:Pop()`).
* **Parameters:** None.
* **Returns:** Result of `option:Cancel(menu)` (usually `true` if pop succeeded).
* **Error states:** May return `nil` if no option is selected.

### `TextMenu:GetOption()`
* **Description:** Returns the currently selected option based on `index`.
* **Parameters:** None.
* **Returns:** `MenuOption` instance or `nil` if stack is empty or index is out of bounds.

### `TextMenu:AtRoot()`
* **Description:** Returns whether the menu is at its top-level context.
* **Parameters:** None.
* **Returns:** `true` if only the root menu stack level exists; `false` otherwise.

### `MenuOption:__tostring()`
* **Description:** Provides the string representation of a menu option for display. Customized by subclasses.
* **Parameters:** None.
* **Returns:** `string` — formatted display text (e.g., `"Walk Speed    [ 1.0 ]"`).

### `NumericToggle:Left(menu)` / `NumericToggle:Right(menu)`
* **Description:** Decreases or increases the toggled numeric value within `[min, max]`, clamped and stepped.
* **Parameters:** `menu` (`TextMenu`) — passed for context (unused in implementation).
* **Returns:** Nothing.

### `CheckBox:Left(menu)` / `CheckBox:Right(menu)`
* **Description:** Sets the checkbox value to `false` or `true`.
* **Parameters:** `menu` (`TextMenu`) — passed for context (unused in implementation).
* **Returns:** Nothing.

### `DoAction:Accept(menu)`
* **Description:** Executes the stored callback function.
* **Parameters:** `menu` (`TextMenu`) — passed as an argument to the callback.
* **Returns:** Nothing.

### `Submenu:Accept(menu)`
* **Description:** Pushes the submenu’s options onto the stack, appending a `"Back"` action.
* **Parameters:** `menu` (`TextMenu`) — target menu instance.
* **Returns:** Nothing.

## Events & listeners
None identified.