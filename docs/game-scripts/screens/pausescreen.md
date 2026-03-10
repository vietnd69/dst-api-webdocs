---
id: pausescreen
title: Pausescreen
description: Manages the pause menu UI, including unpause functionality, options navigation, and host/client quit confirmation workflows.
tags: [ui, pause, navigation]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: f5ebcb74
system_scope: ui
---

# Pausescreen

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`PauseScreen` is a UI screen component that renders the pause menu interface. It manages core gameplay state (pausing/unpausing), provides navigation options (Continue, Options, Disconnect), and handles quit confirmation for hosts and clients separately. It extends `Screen` and integrates with `TheFrontEnd`, `TheInput`, and `TheNet` systems to control screen transitions, input, and network context.

## Usage example
```lua
TheFrontEnd:PushScreen(PauseScreen())
```
This pushes the pause menu onto the front-end stack, displaying the pause interface and calling `SetPause(true)`. User selections trigger appropriate actions (e.g., unpause, open options, or quit).

## Dependencies & tags
**Components used:** `health` — specifically `IsDead()` to determine if saving is allowed.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `active` | boolean | `true` | Whether the screen is currently active (and thus keeping the game paused). |
| `black` | ImageButton | `nil` | Full-screen invisible overlay that triggers unpause on click. |
| `proot` | Widget | `nil` | Root widget container for all visible menu elements. |
| `bg` | Widget | `nil` | The main curly-window panel container. |
| `title` | Text | `nil` | Title text widget (e.g., "Don't Starve Together"). |
| `subtitle` | Text | `nil` | Subtitle text widget (e.g., "Paused"). |
| `menu` | Menu | `nil` | The menu container for action buttons. |
| `default_focus` | Menu | `self.menu` | Default UI focus target. |

## Main functions
### `unpause()`
* **Description:** Resumes gameplay by unpause the game world, removes the screen from the front-end stack, and broadcasts the `continuefrompause` event.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `doconfirmquit()`
* **Description:** Displays a platform-specific confirmation dialog before quitting (disconnecting from session). Behavior differs for hosts vs. clients.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `OnControl(control, down)`
* **Description:** Handles controller and keyboard input. Specifically, pressing `CONTROL_PAUSE` or `CONTROL_CANCEL` (when `down == false`) unpause the game and plays a click sound.
* **Parameters:**  
  `control` (enum) — The input control code.  
  `down` (boolean) — Whether the control is pressed (`true`) or released (`false`).  
* **Returns:** `true` if the input was consumed; `false` otherwise.

### `OnUpdate(dt)`
* **Description:** Ensures the game remains paused while the screen is active by calling `SetPause(true)` each frame.
* **Parameters:** `dt` (number) — Delta time since last frame.
* **Returns:** Nothing.

### `OnBecomeActive()`
* **Description:** Called when this screen becomes active. Hides the top fade overlay to prevent it from obscuring the menu.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `OnControl` — overridden to handle pause/cancel inputs and unpause.  
  `OnUpdate` — overridden to maintain pause state.  
  `OnBecomeActive` — overridden to manage fade overlays.  
- **Pushes:**  
  None directly, but triggers `TheWorld:PushEvent("continuefrompause")` via `unpause()`.