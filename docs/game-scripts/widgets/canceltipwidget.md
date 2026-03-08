---
id: canceltipwidget
title: Canceltipwidget
description: Displays a localized UI tip indicating how to press and hold the cancel button to disconnect from a session.
tags: [ui, input, notification]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: bce008be
system_scope: ui
---

# Canceltipwidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`CancelTipWidget` is a UI widget that shows a context-aware instruction text during input disconnection prompts (e.g., when a player is about to be disconnected for pressing and holding the cancel button). It is part of the `widgets` hierarchy and extends `Widget`. It uses the `Text` widget to render localized strings that dynamically adapt to keyboard or controller input contexts.

The widget manages its own visibility, updates, and fading behavior based on frontend fade state and internal state flags (`is_enabled`, `initialized`, `forceShowNextFrame`). It does not depend on or modify any entity components or network state.

## Usage example
```lua
-- Assuming CancelTipWidget is defined and available:
local cancel_tip = CancelTipWidget()
cancel_tip:SetEnabled(true)  -- Show the tip
-- Optional: ensure it appears next frame if update cycle has already passed
cancel_tip:ShowNextFrame()
-- The widget automatically hides and stops updating after fading below threshold
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `global_widget` | boolean | `true` | Marks this widget as global (not tied to a specific screen or entity). |
| `initialized` | boolean | `false` | Tracks whether the child `Text` widget has been created. |
| `forceShowNextFrame` | boolean | `false` | Forces `KeepAlive` to treat the widget as newly enabled on next update. |
| `is_enabled` | boolean | `false` | Indicates whether the tip should be actively shown/updated. |
| `cancel_tip_widget` | Text (only after initialization) | `nil` | The child `Text` widget containing the instruction string. |
| `cached_fade_level` | number | `0.0` | Stores the last computed fade level (squared) for opacity control. |

## Main functions
### `SetEnabled(enabled)`
*   **Description:** Toggles the widget’s active state. When enabled, it shows and begins updating; when disabled, it hides and stops updating. Setting to `true` resets `initialized` so the text re-initializes on next update.
*   **Parameters:** `enabled` (boolean) — whether to show and active the widget.
*   **Returns:** Nothing.

### `ShowNextFrame()`
*   **Description:** Marks the widget to be treated as newly enabled (refreshing its fade and visibility state) on the next `OnUpdate` cycle. This ensures the tip appears even if it was previously hidden and not updated in the current frame.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `KeepAlive(auto_increment)`
*   **Description:** Maintains the widget’s visibility and fade behavior. Initializes the `Text` widget on first call if needed, then updates its opacity based on `TheFrontEnd:GetFadeLevel()` (or defaults to full opacity if no frontend is present). Automatically disables and hides the widget when `cached_fade_level` drops below `0.01`.
*   **Parameters:** `auto_increment` (boolean) — if `true`, defaults to `cached_fade_level = 1.0` instead of querying `TheFrontEnd`.
*   **Returns:** Nothing.
*   **Error states:** If `TheFrontEnd` is `nil`, opacity is forced to full (`1.0`). The widget disables itself if `cached_fade_level < 0.01`.

### `OnUpdate()`
*   **Description:** Called each frame (via `StartUpdating`) to keep the widget alive. It invokes `KeepAlive(true)` when `forceShowNextFrame` is set, otherwise calls `KeepAlive(false)`, and resets the force flag.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified