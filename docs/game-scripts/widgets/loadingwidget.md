---
id: loadingwidget
title: Loadingwidget
description: Manages the visual loading screen UI, including animated background images and a dynamic ellipsis text effect during loading states.
tags: [ui, loading, animation]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: fba898f4
system_scope: ui
---

# Loadingwidget

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`LoadingWidget` is a UI widget responsible for rendering the loading screen during transitions, such as world generation or scene changes. It displays a background image that varies by active special event (e.g., Halloween, Winter's Feast), shows the localized "Loading..." text with a cycling ellipsis animation, and fades in/out based on the frontend fade level. It inherits from `Widget` and operates by updating its visual elements each frame while enabled.

## Usage example
```lua
local LoadingWidget = require "widgets/loadingwidget"
local loader = LoadingWidget()
loader:SetEnabled(true)
loader:ShowNextFrame()
-- The widget will auto-update the ellipsis and fade state every frame
-- until fade level drops below 0.01, at which point it disables itself.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags; uses no component-based dependencies.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `forceShowNextFrame` | boolean | `false` | If `true`, forces the ellipsis to advance on the next `KeepAlive` call regardless of time. |
| `is_enabled` | boolean | `false` | Whether the loading screen is currently active and updating. |
| `image_random` | number | `math.random(#images)` | Index into the `images` array determining which background image set is used. |
| `bg` | Widget | (via `TEMPLATES.BackgroundSpiral()`) | The spiral background widget. |
| `root_classic` | Widget | (hidden child widget) | Container for classic UI layout elements (vignette, background image). |
| `active_image` | Image | `nil` initially | The background image widget displayed in classic mode. |
| `vig` | Image | `nil` initially | The vignette overlay image. |
| `loading_widget` | Text | (configured Text widget) | The UI text widget showing "Loading..." with ellipsis animation. |
| `cached_string` | string | `""` | Cached copy of the last displayed string (unused in current implementation). |
| `elipse_state` | number | `0` | Index (0–2) tracking the current ellipsis state (`.` / `..` / `...`). |
| `cached_fade_level` | number | `0.0` | Cached fade level from `TheFrontEnd:GetFadeLevel()` used for alpha calculations. |
| `step_time` | number | `GetStaticTime()` at creation | Timestamp used to control ellipsis update frequency (1 second per step). |

## Main functions
### `ShowNextFrame()`
*   **Description:** Sets an internal flag to force the ellipsis to advance on the next update, regardless of the elapsed time. Typically called once before enabling the widget to ensure immediate animation update.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetEnabled(enabled)`
*   **Description:** Enables or disables the loading widget. When enabled, it shows the UI, starts the update loop (`StartUpdating`); when disabled, it hides the UI and stops updating.
*   **Parameters:** `enabled` (boolean) — `true` to activate and show the widget, `false` to hide it.
*   **Returns:** Nothing.

### `KeepAlive(auto_increment)`
*   **Description:** Performs per-frame updates for the widget, including ellipsis cycling, fade-level-based alpha adjustments for background and text elements, and auto-disabling when the fade level becomes negligible.
*   **Parameters:** `auto_increment` (boolean) — if `true`, forces the ellipsis to advance immediately; otherwise, ellipsis advancement is time-gated to `NEXT_STATE = 1.0` seconds.
*   **Returns:** Nothing.
*   **Error states:** If `self.is_enabled` is `false`, the function exits early with no side effects.

### `OnUpdate()`
*   **Description:** Called automatically when the widget is in the update loop. Invokes `KeepAlive` with `forceShowNextFrame` as the `auto_increment` parameter, then resets the flag.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified