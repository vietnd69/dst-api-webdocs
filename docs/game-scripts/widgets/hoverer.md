---
id: hoverer
title: HoverText
description: A UI widget that displays dynamic hover tooltips following the mouse cursor, constrained to screen bounds.
tags: [widget, ui, tooltip]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: widgets
source_hash: b0f25289
system_scope: ui
---

# HoverText

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`HoverText` is a UI widget extending `Widget`. It renders primary and secondary text strings that track the mouse position, automatically clamping to screen edges to prevent overflow. It integrates with the player's `HUD` and `PlayerController` to display context-sensitive action strings (LMB/RMB), tooltip data, and item status colors (e.g., wet vs. normal). Typically instantiated as a child of the player's HUD screen.

## Usage example
```lua
local HoverText = require("widgets/hoverer")

-- Inside a HUD screen constructor:
self.hover = self:AddChild(HoverText(ThePlayer))
self.hover:SetPosition(0, 0, 0)
self.hover:FollowMouseConstrained()

-- Force text position settlement on move (optional hack for inspecting):
self.hover:ForceSettleTextPositionOnMove(true)
```

## Dependencies & tags
**External dependencies:**
- `widgets/widget` -- Widget base class
- `widgets/text` -- Text child widget for rendering strings
- `constants` -- Defines `WET_TEXT_COLOUR`, `NORMAL_TEXT_COLOUR`, `CONTROL_PRIMARY`, etc.
- `TheInput` -- Global input manager for mouse position and control bindings
- `TheSim` -- Screen size retrieval for clamping logic

**Components used:**
- `playercontroller` (on owner) -- Accessed via `owner.components.playercontroller` for action strings and mouse state.
- `inspectable` (on targets) -- Checked via `lmb.target.components.inspectable` for profile stats.
- `stackable` (on targets) -- Accessed via `lmb.target.replica.stackable` for stack size display.

**Tags:**
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | --- | The player entity owning this widget; source for HUD controls and actions. |
| `text` | Text | --- | Primary text child widget; displays the main tooltip or action string. |
| `secondarytext` | Text | --- | Secondary text child widget; displays RMB action or cancel hint. |
| `isFE` | boolean | `false` | Toggles between Front End mode (uses `owner:GetTooltipPos`) and In-Game mode (uses `HUD.controls`). |
| `default_text_pos` | Vector3 | `(0, 40, 0)` | Fallback position if tooltip position calculation fails. |
| `force_settle_text` | boolean | `nil` | If true, `SettleTextPosition` is called during `UpdatePosition`. |
| `followhandler` | handler | `nil` | Reference to the input move handler registered by `FollowMouseConstrained`. |
| `str` | string | `nil` | Current primary string content being displayed. |
| `secondarystr` | string | `nil` | Current secondary string content being displayed. |
| `lastStr` | string | `""` | Tracks previous string to detect changes for throttling. |
| `strFrames` | number | `0` | Frame counter for `SHOW_DELAY` throttling logic. |
| `forcehide` | boolean | `nil` | If true, prevents `Show()` even if `OnUpdate` conditions are met. |
| `YOFFSETUP` | constant (local) | `-80` | Vertical offset for upper screen bound clamping in UpdatePosition(). |
| `YOFFSETDOWN` | constant (local) | `-50` | Vertical offset for lower screen bound clamping in UpdatePosition(). |
| `XOFFSET` | constant (local) | `10` | Horizontal offset for screen edge clamping in UpdatePosition(). |
| `SHOW_DELAY` | constant (local) | `0` | Frame delay threshold for text change throttling in OnUpdate(). |

## Main functions
### `_ctor(owner)`
*   **Description:** Initialises the widget, calls `Widget._ctor`, creates `text` and `secondarytext` children, and starts the update loop.
*   **Parameters:**
    - `owner` -- Player entity instance; used to access HUD controls and PlayerController.
*   **Returns:** nil
*   **Error states:** Errors if `owner` is nil or lacks required HUD/Component structure (unguarded access in `OnUpdate`).

### `OnUpdate()`
*   **Description:** **Widget lifecycle.** Called every frame while widget is active. Determines visibility, fetches tooltip/action strings from `owner`, calculates text colors based on target state (wet/normal), and updates text content. Throttles text changes via `strFrames` to prevent flickering.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** Errors if `owner.HUD` or `owner.HUD.controls` is nil in non-FE mode (no nil guard before access).

### `UpdatePosition(x, y)`
*   **Description:** Calculates the widget's screen position based on mouse coordinates `x, y`. Clamps position to ensure text bounds stay within screen edges (`TheSim:GetScreenSize`), accounting for text region size and scale. Calls `SettleTextPosition` if `force_settle_text` is true.
*   **Parameters:**
    - `x` -- number screen X coordinate
    - `y` -- number screen Y coordinate
*   **Returns:** None
*   **Error states:** None

### `SettleTextPosition()`
*   **Description:** Updates the internal text child position based on `isFE` mode. In FE mode, uses `owner:GetTooltipPos()`; in Game mode, uses `owner.HUD.controls:GetTooltipPos()`.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** Errors if `owner.HUD.controls` is nil in Game mode.

### `ForceSettleTextPositionOnMove(boolval)`
*   **Description:** Sets the `force_settle_text` flag. Used as a hack for specific UI states (e.g., `UpgradeModulesDisplay_Inspecting`) to override standard tooltip positioning logic during movement.
*   **Parameters:**
    - `boolval` -- boolean to enable or disable forced settling
*   **Returns:** None
*   **Error states:** None.

### `FollowMouseConstrained()`
*   **Description:** Registers a global input move handler via `TheInput:AddMoveHandler` that calls `UpdatePosition` on mouse move. Initializes position immediately. Ensures only one handler is registered (`followhandler` check).
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** None.

## Events & listeners
None — Widget uses global `TheInput` handlers instead of entity events.