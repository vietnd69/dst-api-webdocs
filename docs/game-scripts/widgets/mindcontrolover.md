---
id: mindcontrolover
title: Mindcontrolover
description: Manages the visual overlay animation for mind control status on the HUD.
tags: [ui, mindcontrol, overlay]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 658a5191
system_scope: ui
---

# Mindcontrolover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`MindControlOver` is a UI widget that displays the visual overlay for mind control effects. It inherits from `UIAnim` and reacts to `mindcontrollevel` events from its owner entity to animate transitions between states: empty (inactive), in-progress (level rising), loop (fully active), and out (fading out). It uses animated states (`empty`, `in`, `out`, `loop`) from the `mind_control_overlay` asset bank to provide feedback during mind control activation and decay.

## Usage example
```lua
local owner = GetPlayer()
local overlay = require("widgets/mindcontrolover")
local mindcontrol_over = overlay(owner)
owner:AddComponent("mindcontroller")
-- When mind control level changes via:
owner:PushEvent("mindcontrollevel", { level = 0.75 })
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity or `nil` | `nil` | The entity this overlay is attached to; used to listen for `mindcontrollevel` events. |
| `level` | number | `0` | Current internal level of the overlay animation (0.0 to 1.0). |
| `targetlevel` | number | `0` | Target level being approached; used to defer animation updates. |
| `task` | task or `nil` | `nil` | Delayed task handle used to decay the overlay after `PushLevel`. |

## Main functions
### `PushLevel(level)`
*   **Description:** Updates the overlay animation to reflect a new mind control level. Handles transitions between idle, fade-in, loop, and fade-out animations based on the level value.
*   **Parameters:** `level` (number) — A value clamped to `[0, 1]`. Levels `1` trigger a looping animation; levels `> 0` and `< 1` trigger an "in" animation; level `0` triggers "out" or returns to "empty".
*   **Returns:** Nothing.
*   **Error states:** No side effects if `level` is unchanged from current; does not cancel itself unless a decay task is pending.

### `OnUpdate(dt)`
*   **Description:** Called every frame (when not paused and server is not paused) to smoothly decay the overlay level when active. Handles animation progress and transition to "empty" state when decay completes.
*   **Parameters:** `dt` (number) — Delta time in seconds since last frame.
*   **Returns:** Nothing.
*   **Error states:** Exits early if `TheNet:IsServerPaused()` is true; decays at rate `1 / IN_TIME` per second.

## Events & listeners
- **Listens to:** `mindcontrollevel` — Fired by the owner entity when its mind control level changes; passes the new level value.
- **Pushes:** None identified