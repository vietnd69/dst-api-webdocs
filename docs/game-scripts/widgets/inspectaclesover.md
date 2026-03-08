---
id: inspectaclesover
title: InspectaclesOver
description: Manages the Winona Inspectacles overlay UI, including idle animation, activation/deactivation transitions, and directional pinger tracking.
tags: [ui, vision, hud, winona]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 24b78685
system_scope: ui
---

# InspectaclesOver

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`InspectaclesOver` is a UI widget that renders the visual overlay effect for Winona's Inspectacles item. It displays an idle animation when active and triggers a directional pinger when an object is within the Inspectacles' detection range. It listens for `inspectaclesvision` and `inspectaclesping` events on the owner entity to toggle visibility and update the pinger's position. The widget extends `UIAnim`, leveraging its animation system and lifecycle hooks.

## Usage example
```lua
local owner = ThePlayer
local overlay = InspectaclesOver(owner)
owner:AddChild(overlay)
-- The overlay automatically reacts to events like:
-- owner:PushEvent("inspectaclesvision", { enabled = true })
-- owner:PushEvent("inspectaclesping", { tx = 10, tz = -5 })
```

## Dependencies & tags
**Components used:** `playervision` — queried via `owner.components.playervision:HasInspectaclesVision()` to check initial state on instantiation.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | `nil` | The entity (typically a player) that owns the Inspectacles overlay. |
| `shown` | boolean | `false` | Internal flag tracking whether the overlay is currently shown. |
| `tx`, `tz` | number | `0`, `0` | Target world coordinates for the pinger. Reset to `nil, nil` on stop. |
| `hidetask` | Task | `nil` | Task scheduled to hide the widget after deactivation animation. |
| `pingtask` | Task | `nil` | Task scheduled to stop the pinger animation after one cycle. |
| `BUFFEROVERRIDES` | boolean | `false` | Passed to `GetIndicatorLocationAndAngle`; currently hardcoded to `false`. |
| `pinger` | UIAnim | Child widget | Small HUD element used to display the radar ping; uses `winona_inspectacles_fx` bank. |

## Main functions
### `Toggle(show)`
* **Description:** Shows or hides the overlay based on `show` state. Handles transitions (`Enable`/`Disable`) and manages the `shown` flag to avoid redundant operations.
* **Parameters:** `show` (boolean) — whether the overlay should be visible.
* **Returns:** Nothing.

### `Enable()`
* **Description:** Activates the overlay: plays the "over_pre" animation, then loops "over_idle". Plays activation sound. Cancels any pending hide task and calls `Show()`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Disable()`
* **Description:** Deactivates the overlay: plays the "over_pst" fade-out animation. Schedules `Hide()` after animation length (+ `FRAMES`). Cancels pending hide task, stops pinging, and plays deactivation sound.
* **Parameters:** None.
* **Returns:** Nothing.

### `StartPing()`
* **Description:** Starts the radar ping animation on the `pinger` child widget. Plays ping sound, sets up a task to auto-stop after one animation cycle, and begins per-frame updates to track the target.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopPing()`
* **Description:** Immediately stops the radar ping: cancels the ping task, hides the `pinger`, stops per-frame updates, and resets target coordinates to `nil`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Runs each frame while pinging. Calculates screen-space position and rotation for the pinger relative to the overlay's owner, then updates the pinger's position and rotation. The position calculation biases the indicator outward (`r = 150`) for better visibility.
* **Parameters:** `dt` (number) — delta time since last frame (unused, but included per `OnUpdate` signature).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `inspectaclesvision` — toggles visibility when owner's Inspectacles vision state changes (data: `{ enabled = boolean }`).  
- **Listens to:** `inspectaclesping` — updates the pinger target location (`tx`, `tz`) and starts/stops ping based on distance to owner (data: `{ tx = number, tz = number }`).  
- **Pushes:** None.