---
id: yotbtoast
title: Yotbtoast
description: Manages the display and animation of the Year of the Boar (YOTB) gift toast UI element, including controller help text and visibility logic based on game state and player input.
tags: [ui, controller, animation, hud]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 1a85182e
system_scope: ui
---

# Yotbtoast

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`YotbToast` is a UI widget component that controls the presentation and behavior of the "Year of the Boar" (YOTB) gift tab in the player HUD. It handles sliding the toast into view (when the player has the YOTB skin and the tab should be active), animating states, managing controller-specific help text, and responding to input events such as controller attacks. It depends on the `player_classified` component to determine skin eligibility and interacts with `PlayerController` to avoid interfering with active targeting.

## Usage example
```lua
-- Add the YotbToast widget to a HUD or root UI entity
local toast = YotbToast(owner, controls)
owner.hud:AddChild(toast)

-- Trigger visibility updates (e.g., when player classification changes)
owner:PushEvent("yotbskinupdate")

-- Toggle UI visibility based on game state
toast:ToggleController(true)  -- Hide toast during pause or HUD-inhibiting states
toast:ToggleCrafting(false)   -- Show toast when crafting menu is closed
```

## Dependencies & tags
**Components used:**  
- `player_classified` — checked for `hasyotbskin` value to determine toast visibility  
- `playercontroller` — accessed via `GetControllerAttackTarget()` for input sensitivity  

**Tags:** None added, removed, or checked by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `controls` | table | `nil` | Reference to the parent HUD/controls manager for toast lifecycle coordination. |
| `owner` | `ThePlayer` or player entity | `nil` | The player instance the toast belongs to. |
| `root` | `Widget` | Created internally | The root visual container for the toast UI. |
| `tab_gift` | `UIAnimButton` | Created internally | The interactive button representing the gift tab. |
| `controller_help` | `Text` or `nil` | `nil` | Dynamically created label showing controller prompt when active. |
| `controller_hide` | boolean | `false` | If `true`, hides the toast regardless of skin state. |
| `craft_hide` | boolean | `false` | If `true`, hides the toast (e.g., during crafting menu open). |
| `opened` | boolean | `false` | Indicates whether the toast is currently in the extended (visible) state. |
| `hud_focus` | boolean | Derived from `owner.HUD.focus` | Tracks whether the HUD is currently focused for help text display. |

## Main functions
### `UpdateElements()`
* **Description:** Updates the toast's position based on skin eligibility and UI state. Slides the toast down (extends) if the player has the YOTB skin and the tab should be shown; otherwise, slides it up (hides). Also coordinates with `controls` to manage toast lifecycle.  
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:** May skip animation if current and target positions are identical. Requires `player_classified.hasyotbskin` to be defined and valid.

### `ToggleHUDFocus(focus)`
* **Description:** Sets whether the HUD is currently focused and updates controller help visibility accordingly.  
* **Parameters:** `focus` (boolean) — whether the HUD currently has focus (e.g., not paused).  
* **Returns:** Nothing.

### `ToggleController(hide)`
* **Description:** Toggles the controller visibility flag (e.g., during pause). Triggers `UpdateElements()` to refresh toast state.  
* **Parameters:** `hide` (boolean) — if `true`, forces the toast to be hidden.  
* **Returns:** Nothing.

### `ToggleCrafting(hide)`
* **Description:** Toggles the crafting menu visibility flag. If the crafting menu is open (`hide = true`), hides the toast.  
* **Parameters:** `hide` (boolean) — if `true`, hides the toast (e.g., while crafting).  
* **Returns:** Nothing.

### `CheckControl(control, down)`
* **Description:** Handles raw controller input to detect whether the YOTB gift tab should be activated. Specifically responds to the controller attack control when no attack target is set.  
* **Parameters:**  
  - `control` (number) — Control constant (e.g., `CONTROL_CONTROLLER_ATTACK`)  
  - `down` (boolean) — Whether the control was pressed (`true`) or released (`false`)  
* **Returns:** `boolean` — Returns `true` if the input should be consumed by this toast (i.e., no further processing); `false` otherwise.

### `UpdateControllerHelp()`
* **Description:** Creates or hides the controller prompt text (`CONTROL_CONTROLLER_ATTACK` + "Open Gift") based on controller presence, toast state (`opened`), and HUD focus. Starts/stops the `OnUpdate` loop accordingly.  
* **Parameters:** None.  
* **Returns:** Nothing.

### `OnUpdate()`
* **Description:** (Internal update handler) Toggles visibility of the controller help text based on whether the player currently has an attack target. Runs only while controller help is active.  
* **Parameters:** None.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `yotbskinupdate` — triggers `UpdateElements()` when the player’s skin status changes.  
  - `continuefrompause` — triggers `UpdateControllerHelp()` to refresh help text after unpausing.  
- **Pushes:** None — this widget does not fire custom events.