---
id: batover
title: BatOver
description: Manages visual and audio effects for bat-themed overlay animations triggered by the batspooked event, synchronized to screen resolution.
tags: [ui, fx, audio]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: bb14d094
system_scope: ui
---

# BatOver

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`BatOver` is a UI widget that displays a bat-themed overlay animation in response to the `batspooked` event. It inherits from `UIAnim` and handles dynamic screen scaling, playback of appropriate animation sequences based on screen aspect ratio, and periodic bat-flapping sound effects using easing functions for volume control. It is typically instantiated as a child widget associated with an owner entity (e.g., the player).

## Usage example
```lua
local batover = SpawnPrefab("batover")
batover:ListenForEvent("batspooked", function(owner) batover.components.batover:TriggerBats() end, owner)
```

## Dependencies & tags
**Components used:** None identified (direct `inst.components.X` access is absent).
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity or `nil` | `nil` | The entity whose `batspooked` event triggers the bat animation. |
| `scrnw` | number | `nil` | Current screen width ( pixels), updated on scaling or update. |
| `scrnh` | number | `nil` | Current screen height (pixels), used for resolution-based scaling. |
| `soundlevel` | number | `0` | Controls sound volume envelope — decreases over time. |
| `sounddelay` | number | `0` | Countdown until next bat flap sound is played (in frames). |

## Main functions
### `TriggerBats()`
*   **Description:** Initiates the bat overlay animation and audio playback. Sets `soundlevel` to `1`, starts the update loop, shows the widget, and plays the appropriate animation based on screen dimensions.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateScale()`
*   **Description:** Queries the current screen size and rescales the widget proportionally using `RESOLUTION_Y` as reference.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called each frame while the widget is active. Handles screen scaling, and manages sound playback with easing-based volume decay.
*   **Parameters:** `dt` (number) — Delta time in seconds since last frame.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `TheNet:IsServerPaused()` is `true`.

## Events & listeners
- **Listens to:**
  - `animover` — Automatically hides the widget and stops updating when the animation completes.
  - `batspooked` (on `owner`) — Triggers the bat overlay animation via `TriggerBats()`.
- **Pushes:** None identified.