---
id: playerdeathnotification
title: Playerdeathnotification
description: Manages the UI notification shown to players upon death, including revival options and world regeneration countdown for server admins.
tags: [ui, player, death, network]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: c2eb92b9
system_scope: ui
---

# Playerdeathnotification

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`PlayerDeathNotification` is a UI widget that displays the player death screen after a player character dies. It presents the player’s avatar and messages about survival time, and provides options to revive using touch stones or portal totems (if available). For server admins, it also manages the world regeneration countdown and reset functionality, including visual feedback and hold-to-reset interactions. The widget is typically attached to the local player entity and responds to world-level events such as `showworldreset` and `hideworldreset`.

## Usage example
```lua
local inst = ThePlayer
inst:AddComponent("playerdeathnotification")
-- Notification is shown automatically upon death; to programmatically trigger:
inst.components.playerdeathnotification:SetGhostMode(true)
inst.components.playerdeathnotification:StartRegenTimer() -- admin-only for server-side world reset countdown
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None added, removed, or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | `nil` | The entity (player) that owns this notification; set on construction. |
| `closing` | boolean | `true` | Flag indicating whether the notification is in closing state. |
| `started` | boolean | `false` | Flag indicating whether the world regeneration countdown is active. |
| `target_y` | number | `nil` | Target vertical position used for animation transitions. |
| `reset_hold_time` | number | `0` | Accumulated time (in seconds) that the pause button is held for world reset. |
| `time_sound_count` | number | `0` | Counter used to limit sound replay during countdown. |
| `_lastshowntime` | number | `nil` | Cached last displayed countdown time to avoid redundant updates. |
| `_onworldresettick` | function | `nil` | Callback registered to handle `worldresettick` events. |
| `_oncontinuefrompause` | function | `nil` | Callback registered to refresh layout when resuming from pause. |
| `revgen_confirm` | PopupDialogScreen | `nil` | Reference to the confirmation dialog shown before resetting. |

## Main functions
### `RefreshLayout()`
* **Description:** Updates the layout and visibility of UI elements based on input device (controller vs keyboard/mouse), ghost state, and admin status. Manages transitions between open, open-with-countdown, and closed positions.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetGhostMode(isghost)`
* **Description:** Configures the notification for ghost mode. If `isghost` is `true`, displays survival time message and opens the UI; otherwise, closes it if not already.
* **Parameters:** `isghost` (boolean) — whether the player is now a ghost.
* **Returns:** Nothing.

### `StartRegenTimer()`
* **Description:** Starts the world regeneration countdown for server admins. Displays a countdown timer with periodic ticks and enables hold-to-reset functionality. Internally registers for `worldresettick` events.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `started` is already `true`.

### `StopRegenTimer()`
* **Description:** Stops the world regeneration countdown, cancels pending confirmation dialogs, and unregisters event callbacks.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if `started` is `false`.

### `Reset()`
* **Description:** Prompts an admin-only confirmation dialog to reset the world (if the player is a server admin and countdown is active).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if `started` is `false` or player is not server admin.

### `DoRegenWorld()`
* **Description:** Sends a request to the server to reset the world. Called after hold-to-reset timeout or via `Reset()` confirmation.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does nothing if `started` is `false` or player is not server admin.

### `UpdateRegenCountdown(time)`
* **Description:** Updates the countdown text display and plays ticking sound based on remaining time. Handles volume fade-out logic for early countdown.
* **Parameters:** `time` (number | `nil`) — remaining seconds until world reset; `nil` means 0 seconds.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `showworldreset` — triggers `StartRegenTimer()` when world regeneration begins.
  - `hideworldreset` — triggers `StopRegenTimer()` when world regeneration is cancelled.
  - `continuefrompause` — refreshes layout when the game is resumed from pause.
  - `worldresettick` — fires `UpdateRegenCountdown()` with remaining time during countdown.
- **Pushes:** None identified.