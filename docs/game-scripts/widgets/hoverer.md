---
id: hoverer
title: Hoverer
description: Renders and manages dynamic tooltip text near the mouse cursor, displaying contextual UI information such as item actions, entity names, and control hints.
tags: [ui, hud, text]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 738a27f8
system_scope: ui
---

# Hoverer

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Hoverer` is a UI widget that displays contextual hover text and action hints beneath or near the mouse cursor. It is responsible for synthesizing and rendering tooltip strings based on game state—such as the currently hovered object, active left/right mouse actions, and wetness status—and displaying them as primary and secondary text lines. It integrates with the `playercontroller` and `HUD.controls` components to pulltooltip data, and it dynamically adjusts its screen position to stay within viewport bounds.

## Usage example
```lua
local hoverer = HoverText(owner)
owner.HUD.hoverer = hoverer
-- Hoverer automatically updates on `OnUpdate` and follows mouse position
-- Text content is derived from playercontroller and HUD state
```

## Dependencies & tags
**Components used:** `playercontroller`, `inspectable`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity (typically the player) that owns this hoverer. |
| `isFE` | boolean | `false` | Flag indicating if this is a FE (Front End) tooltip source. |
| `shown` | boolean | `nil` | Internal state tracking tooltip visibility (not explicitly initialized in constructor). |
| `forcehide` | boolean | `nil` | Internal flag to override automatic show/hide behavior. |
| `default_text_pos` | Vector3 | `Vector3(0, 40, 0)` | Default position offset for primary text. |
| `text` | Text | instance | Primary text widget. |
| `secondarytext` | Text | instance | Secondary text widget for RMB hints or extra context. |
| `str`, `secondarystr`, `lastStr` | string | `""` / `nil` | Cached tooltip strings for change detection and delayed rendering. |
| `strFrames` | number | `0` | Frame counter used to delay text updates for smooth transitions. |
| `followhandler` | function | `nil` | Mouse move handler callback registered via `TheInput`. |

## Main functions
### `OnUpdate()`
* **Description:** Called each frame to update tooltip content, visibility, position, and appearance based on game state (mouse usage, hovered object, actions).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; silently skips updates if `playercontroller` is missing or mouse is not in use.

### `UpdatePosition(x, y)`
* **Description:** Computes and sets widget position to clamp tooltip within screen bounds, accounting for text size and offsets.
* **Parameters:**  
  `x` (number) – Mouse X screen coordinate.  
  `y` (number) – Mouse Y screen coordinate.  
* **Returns:** Nothing.

### `FollowMouseConstrained()`
* **Description:** Registers a mouse-move handler to update position dynamically and immediately positions the widget at the current cursor location.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.