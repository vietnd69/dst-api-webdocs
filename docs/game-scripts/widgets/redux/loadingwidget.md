---
id: loadingwidget
title: Loadingwidget
description: Manages the loading screen UI, including background images, tip display, and loading animation effects during game transitions.
tags: [ui, loading, frontend]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 8214e4eb
system_scope: ui
---

# Loadingwidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`LoadingWidget` is a UI component responsible for rendering the loading screen interface, including dynamic background selection, animated loading text with ellipsis, and optional loading tips (e.g., gameplay hints). It integrates with `TheLoadingTips` to display context-aware tips and supports special-case background configurations for specific assets. As a `Widget`, it is built atop DST’s widget hierarchy and operates in both classic and new UI modes.

## Usage example
```lua
local loading_widget = LoadingWidget(session_random_index)
loading_widget:SetEnabled(true)
-- During game loop or frontend updates:
loading_widget:OnUpdate(dt)
-- To manually trigger next-frame show:
loading_widget:ShowNextFrame()
```

## Dependencies & tags
**Components used:** None (pure UI widget with no entity components)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `global_widget` | boolean | `true` | Indicates this widget is globally managed. |
| `is_enabled` | boolean | `false` | Whether the loading screen is currently visible. |
| `forceShowNextFrame` | boolean | `false` | Flag to force visibility on next update cycle. |
| `image_random` | number | `nil` | Selected index for background image (positive for new backgrounds, negative for legacy). |
| `selected_key` | string | `nil` | Key identifying the currently selected background asset. |
| `_specialbg` | table or `nil` | `nil` | Metadata for special background positioning (e.g., custom loading text location). |
| `loading_tip_text` | `Text` | `nil` | Widget displaying tip text. |
| `loading_tip_icon` | `Image` | `nil` | Widget displaying tip icon. |
| `loading_widget` | `ShadowedText` | `nil` | Animated loading text widget. |
| `cached_string` | string | `""` | Cached loading string state. |
| `elipse_state` | number | `0` | Index tracking ellipsis animation state (0–2). |
| `cached_fade_level` | number | `0` | Cached fade level for opacity interpolation. |
| `step_time` | number | `GetStaticTime()` | Timestamp for ellipsis animation timing. |
| `tipcycledelay` | number | `TIP_CYCLE_DELAY` (0.5) | Cooldown timer for tip cycling during dev mode. |

## Main functions
### `RepickImage()`
*   **Description:** Randomly selects a new background image from available options, used when exiting the loading screen to vary visuals on subsequent loads.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Skips repicking if no valid image options exist or if `image_random` is `nil`.

### `ShowNextFrame()`
*   **Description:** Sets a flag to ensure the loading widget becomes visible on the next UI update.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetEnabled(enabled)`
*   **Description:** Controls visibility and activity state of the loading screen. Enables tip picking and animation when enabled; disables, hides, and repicks image when disabled.
*   **Parameters:** `enabled` (boolean) – whether to show or hide the loading screen.
*   **Returns:** Nothing.

### `KeepAlive(auto_increment)`
*   **Description:** Updates fade level, ellipsis animation, and opacity for all loading UI elements on every frame. Also auto-disables the widget if fade level drops near zero (indicating transition completion).
*   **Parameters:** `auto_increment` (boolean) – if `true`, forces ellipsis step progression and uses full opacity.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Main update loop for the widget. Calls `KeepAlive()`, handles dev-mode debugging keys (e.g., tip cycling, font/size toggling), and processes fade-level transitions.
*   **Parameters:** `dt` (number) – delta time since last frame.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** None (no `inst:PushEvent` calls).