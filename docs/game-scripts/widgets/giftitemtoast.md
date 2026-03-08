---
id: giftitemtoast
title: Giftitemtoast
description: Manages the visual and interactive gift tab UI element in the player HUD, handling its display state, animations, and controller-triggered gift opening behavior.
tags: [ui, hud, controller, gift]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 6c2974f2
system_scope: ui
---

# Giftitemtoast

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`GiftItemToast` is a UI widget component responsible for rendering and controlling the gift tab in the player's HUD. It displays the number of available gifts, handles user interaction via mouse click or controller input, and coordinates animations for enabling/disabling states. It interacts with the `giftreceiver` and `playercontroller` components to open gifts and manage controller help text visibility. The toast slides vertically based on game state (e.g., crafting menu visibility, controller focus) and plays associated sound effects.

## Usage example
```lua
-- Typically instantiated by the PlayerHud and attached to the HUD widget hierarchy
local gift_toast = GiftItemToast(owner, controls)
owner.HUD:AddChild(gift_toast)

-- Triggered automatically when gift count updates
owner.components.giftreceiver:UpdateGifts(3)

-- Manually toggle UI states as needed
gift_toast:ToggleCrafting(true)   -- Hide when crafting menu opens
gift_toast:ToggleController(false) -- Show/hide based on controller visibility
```

## Dependencies & tags
**Components used:** `giftreceiver`, `playercontroller`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | `Entity` | — | The player entity the toast belongs to. |
| `controls` | `Table` | — | HUD control manager used for toast stacking management. |
| `tab_gift` | `UIAnimButton` | — | The main clickable/tappable UI button representing the gift tab. |
| `numitems` | number | `0` | Current count of gifts available. |
| `opened` | boolean | `false` | Whether the toast is currently in the "open" (slide-down) state. |
| `enabled` | boolean | `false` | Whether the gift tab is enabled for interaction. |
| `controller_hide` | boolean | `false` | Whether controller-based HUD elements should be hidden. |
| `craft_hide` | boolean | `false` | Whether crafting menu visibility should hide the toast. |
| `controller_help` | `Text` | `nil` | Tooltip-style label showing the controller action for opening gifts. |
| `hud_focus` | boolean | — | Whether the HUD is currently in focus (used for controller help visibility). |

## Main functions
### `UpdateElements()`
*   **Description:** Slides the toast vertically (up/down) based on `numitems`, `opened` state, `controller_hide`, and `craft_hide`. Plays sound effects and notifies the `controls` manager when shown/hidden.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No explicit failure conditions; moves or skips movement based on state comparisons.

### `OnToast(num)`
*   **Description:** Updates the gift count and refreshes the toast UI (e.g., enables/disables the tab button, triggers `UpdateElements`).
*   **Parameters:** `num` (number) - the new number of gifts.
*   **Returns:** Nothing.

### `DoOpenGift()`
*   **Description:** Attempts to open the next gift, respecting the `busy` tag and a `TIMEOUT` (1 second) debounce.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `owner` has the `"busy"` tag or if `TIMEOUT` has not elapsed since the last click. If not server authoritative (`not TheWorld.ismastersim`), sends an RPC to the server.

### `EnableClick()`
*   **Description:** Enables the gift tab button when gifts are available (`numitems > 0`), resets the click debounce timer, and activates animations if already opened.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DisableClick()`
*   **Description:** Disables the gift tab button and updates tooltip/help text when no gifts are available.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateControllerHelp()`
*   **Description:** Creates or updates the controller action help text (`"X Open Gift"`) and shows/hides it based on `enabled`, `opened`, `hud_focus`, and `controller_attack_target` state. Calls `StartUpdating`/`StopUpdating` to manage `OnUpdate` callbacks.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CheckControl(control, down)`
*   **Description:** Handles controller-triggered gift opening. Called by `PlayerHud:OnControl`.
*   **Parameters:**  
    *   `control` (number) — control constant (e.g., `CONTROL_CONTROLLER_ATTACK`).  
    *   `down` (boolean) — whether the control was pressed (not released).  
*   **Returns:** `true` if the gift opening action was handled; `false` otherwise. Returns early if `owner` is busy or another target is selected (`controller_attack_target ~= nil`).

### `ToggleHUDFocus(focus)`
*   **Description:** Sets the `hud_focus` flag (indicating HUD input focus) and updates controller help visibility via `UpdateControllerHelp`.
*   **Parameters:** `focus` (boolean) — whether the HUD is in focus.
*   **Returns:** Nothing.

### `ToggleController(hide)`
*   **Description:** Sets the `controller_hide` flag and updates the toast position.
*   **Parameters:** `hide` (boolean) — if `true`, the toast is hidden when controller HUD is hidden.
*   **Returns:** Nothing.

### `ToggleCrafting(hide)`
*   **Description:** Sets the `craft_hide` flag and updates the toast position.
*   **Parameters:** `hide` (boolean) — if `true`, the toast is hidden while the crafting menu is open.
*   **Returns:** Nothing.

### `OnClickEnabled()`
*   **Description:** Plays the active animation sequence and updates tooltip for the enabled gift tab.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if already playing `"active_pre"`/`"active_loop"`.

## Events & listeners
- **Listens to:**  
  - `"giftreceiverupdate"` — triggered on the owner to update gift count and enabled state.  
  - `"seamlessplayerswap"` — stops updates during player swap (source entity).  
  - `"finishseamlessplayerswap"` — resets `do_instant` flag for position sync (target entity).  
  - `"continuefrompause"` — refreshes controller help text after resuming gameplay.  
- **Pushes:**  
  - `"ms_opengift"` — fired via `giftreceiver:OpenNextGift()` on the server (not directly pushed by this widget, but triggered as a side effect).  
  - (Note: `GiftItemToast` itself does not fire any events.)