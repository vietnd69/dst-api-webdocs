---
id: skilltreetoast
title: Skilltreetoast
description: Manages the visual toast UI element for skill point notifications in the player HUD, animating appearance/disappearance and handling controller focus and interaction.
tags: [ui, hud, player, controller, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 0212a5e7
system_scope: ui
---

# Skilltreetoast

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`SkillTreeToast` is a UI widget that displays and animates a toast notification when a new skill point becomes available. It manages visibility, animation states, and controller-specific help text. It is attached to an entity (typically `ThePlayer`) and responds to game state events like `newskillpointupdated`, `continuefrompause`, and controller input. It integrates with the `PlayerHUD` and `playercontroller` components for coordination.

## Usage example
```lua
local toast = SkillTreeToast(ThePlayer, ThePlayer.HUD.controls)
ThePlayer:AddComponent("skilltreetoast")
ThePlayer.components.skilltreetoast = toast
-- The component listens for events and updates automatically.
-- External toggling:
ThePlayer.components.skilltreetoast:ToggleController(true)  -- Hide due to controller override
ThePlayer.components.skilltreetoast:ToggleCrafting(false)   -- Re-enable
```

## Dependencies & tags
**Components used:** `playercontroller` (via `ThePlayer.components.playercontroller`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `table` | `nil` | The entity (typically `ThePlayer`) that owns this toast. |
| `controls` | `table` | `nil` | The `PlayerHud` controls manager used to manage toast lifecycle (`ManageToast`). |
| `root` | `Widget` | — | Root container widget for positioning the toast. |
| `tab_gift` | `UIAnimButton` | — | Interactive button widget for the skill tab, animates and triggers the skill screen on click. |
| `controller_help` | `Text` | `nil` | Optional text widget displaying controller button prompt when focused. |
| `enabled` | `boolean` | `false` | Whether the toast interaction is enabled (affected by `EnableClick`/`DisableClick`). |
| `opened` | `boolean` | `false` | Whether the toast is currently in the "active" (dropped-down) state. |
| `controller_hide` | `boolean` | `false` | Flag to hide the toast when a controller UI overlay is active (e.g., crafting). |
| `craft_hide` | `boolean` | `false` | Flag to hide the toast during crafting menu interaction. |
| `hud_focus` | `boolean` | `owner.HUD.focus` | Whether the HUD currently has input focus (from `ThePlayer.HUD.focus`). |

## Main functions
### `EnableClick()`
*   **Description:** Enables user interaction with the toast tab (click/controller input), updates animation to the active loop, and triggers `UpdateControllerHelp`. Typically called after the toast animates into view.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DisableClick()`
*   **Description:** Disables user interaction with the toast tab, updates state to `enabled = false`, and refreshes controller help text.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateElements()`
*   **Description:** Calculates whether a new skill point is available and animates the toast up (drop-down) or down (retract). Plays appropriate sounds (`skin_drop_slide_gift_DOWN`/`UP`) and notifies the `controls` manager via `ManageToast`. Also calls `UpdateControllerHelp`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if `owner.player_classified` is missing or `ThePlayer.new_skill_available_popup` is falsy. Skips animation if position already matches target.

### `ToggleHUDFocus(focus)`
*   **Description:** Updates internal `hud_focus` state and triggers `UpdateElements` and `UpdateControllerHelp`.
*   **Parameters:** `focus` (boolean) — Whether the HUD currently holds input focus.
*   **Returns:** Nothing.

### `ToggleController(hide)`
*   **Description:** Sets the `controller_hide` flag (e.g., when a controller overlay like inventory opens/closes), then calls `UpdateElements` to show/hide the toast accordingly.
*   **Parameters:** `hide` (boolean) — `true` to hide the toast due to controller UI, `false` to show it.
*   **Returns:** Nothing.

### `ToggleCrafting(hide)`
*   **Description:** Sets the `craft_hide` flag (e.g., during crafting menu interaction), then calls `UpdateElements`.
*   **Parameters:** `hide` (boolean) — `true` to hide the toast during crafting, `false` to show it.
*   **Returns:** Nothing.

### `UpdateControllerHelp()`
*   **Description:** Creates or hides the controller help `Text` widget based on controller presence, `opened` state, and `hud_focus`. Displays localized button prompt (e.g., "X Inspect Self").
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate()`
*   **Description:** Updates animation and help text visibility per-frame while the toast is active. Plays the `active_loop` animation when the inspect action is *not* available, and switches to the `off` animation when it *is* available (e.g., controller targeting). Controls visibility of `controller_help`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CheckControl(control, down)`
*   **Description:** Handles input passthrough during focused toast state. Returns `true` if the `CONTROL_INSPECT_SELF` button is pressed while the toast is shown, allowing `PlayerHud` to consume the input.
*   **Parameters:**  
    `control` (string) — Control identifier (e.g., `"inspect_self"`).  
    `down` (boolean) — Whether the control is pressed down.
*   **Returns:** `true` if `self.shown` and `down` and `control == "inspect_self"`, else `nil`.

## Events & listeners
- **Listens to:**  
  - `newskillpointupdated` on `ThePlayer` — calls `UpdateElements` to reflect new skill point availability.  
  - `continuefrompause` on `TheWorld` — calls `UpdateControllerHelp` to refresh help text after unpausing.  
- **Pushes:** None identified.