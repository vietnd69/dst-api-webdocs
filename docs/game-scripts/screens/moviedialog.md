---
id: moviedialog
title: Moviedialog
description: Displays a fullscreen video playback dialog and handles user interaction to skip or finish playback.
tags: [ui, video, screen]
sidebar_position: 10

last_updated: 2026-03-09
build_version: 714014
change_status: stable
category_type: screens
source_hash: c6238138
system_scope: ui
---

# Moviedialog

> Based on game build **714014** | Last updated: 2026-03-09

## Overview
`Moviedialog` is a UI screen component that overlays a fullscreen video playback on top of the game interface. It manages the video widget, a dark overlay, and user controls to either skip or wait until playback completes. It inherits from `Screen` and is intended for playing cinematics or cutscenes during gameplay.

## Usage example
```lua
TheFrontEnd:PushScreen(MovieDialog("path/to/video", function() 
    print("Video finished") 
end, true))
```

## Dependencies & tags
**Components used:** None identified.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `cb` | function | `nil` | Callback function executed when playback ends or is cancelled. |
| `do_fadeback` | boolean | `nil` | Controls whether to fade the screen back (`true`) or pop the screen (`false`) upon completion. |
| `end_delay` | number | `2` | Seconds to wait after video completion before finishing the dialog. |
| `cancelled` | boolean | `false` (runtime) | Tracks whether the user manually cancelled the dialog. |

## Main functions
### `OnUpdate(dt)`
* **Description:** Called each frame to check playback status. Handles automatic termination after video completion or user skip.
* **Parameters:** `dt` (number) – delta time in seconds since last frame.
* **Returns:** Nothing.
* **Error states:** No failure modes documented; safely handles missing or nil video references.

### `OnControl(control, down)`
* **Description:** Handles user input controls. Allows skipping playback via `CONTROL_MENU_START` or `CONTROL_ACCEPT`.
* **Parameters:**  
  - `control` (number) – control code (e.g., `CONTROL_ACCEPT`).  
  - `down` (boolean) – whether the control was pressed (`true`) or released (`false`).
* **Returns:** `true` if input was handled; otherwise `false`.
* **Error states:** Delegates unhandled controls to the base screen class.

### `Cancel()`
* **Description:** Manually stops video playback and marks the dialog as cancelled.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified.