---
id: desync
title: Desync
description: Manages the visual desync HUD indicator, displaying connection state and network performance warnings to the player.
tags: [network, ui, hud]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 24701d2b
system_scope: network
---

# Desync

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Desync` is a UI widget that displays the current network desync state and performance indicators to the player. It shows visual cues such as blinking icons for waiting, buffering, connection warnings, and host performance alerts. The widget reacts to network events pushed by the engine and periodically evaluates client/host performance metrics to update its display.

## Usage example
```lua
local owner = ThePlayer
local desync_widget = Desync(owner)
desync_widget:ShowHostPerf(true) -- Enable host performance display
desync_widget:OnUpdate(dt) -- Called each frame during UI updates
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | entity | `nil` | The entity (typically the player) that owns this widget. |
| `_icon` | widget child (Image) | `nil` | The icon image used to display the current desync state. |
| `_state` | string or `nil` | `nil` | Current active state (`waiting`, `buffering`, `warning`, `alert`, etc.). |
| `_perf` | string or `nil` | `nil` | Last-evaluated performance state (used when state is `nil` but `_perf` is set). |
| `_showhostperf` | boolean or `nil` | `nil` | Flag indicating whether to display host-side performance metrics. |
| `_blinkspeed` | number | `10` | Speed of blinking animation (pixels per update step). |
| `_step` | number | `0` | Current animation step counter (0–510) for fade-in/out. |
| `_delay` | number | `SHOW_DELAY` | Remaining time before next blink phase update. |
| `_perfdelay` | number | `PERF_INTERVAL_INITIAL` | Remaining time until next performance refresh. |
| `_statedirty` | boolean | `false` | Flag indicating whether the current state has changed and needs to be applied. |

## Main functions
### `ShowHostPerf(show)`
*   **Description:** Enables or disables host-side performance monitoring display. When enabled, the widget checks host performance and network score instead of client-only metrics.
*   **Parameters:** `show` (boolean, optional) — if `false`, disables host perf display. Defaults to showing host perf.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Called each frame to update the widget’s animation and appearance. Handles blinking, state transitions, and delayed icon updates.
*   **Parameters:** `dt` (number) — time elapsed since last frame.
*   **Returns:** Nothing.
*   **Error states:** Skips updates if the widget is hidden; does nothing if no state change is pending.

### `RefreshPerf()`
*   **Description:** Evaluates the current network performance and updates the widget's `_perf` state accordingly. When `_showhostperf` is enabled, it inspects all connected clients’ performance; otherwise, it inspects the local client.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `SetPerf(perf)`
*   **Description:** Updates the performance-related internal state and, if necessary, triggers a state change to reflect a new performance level (e.g., `warning`, `alert`, `hostwarning`, `hostalert`).
*   **Parameters:** `perf` (string or `nil`) — one of `"alert"`, `"warning"`, `"hostalert"`, `"hostwarning"`, or `nil` for healthy state.
*   **Returns:** Nothing.

### `SetState(state)`
*   **Description:** Directly sets or updates the current state of the widget (e.g., `"waiting"`, `"buffering"`). If the new state differs from the current one, it marks the state as dirty and ensures the widget is shown.
*   **Parameters:** `state` (string or `nil`) — one of the keys from `STATES` table, or `nil` to revert to `_perf`-based state.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `desync_waiting` — sets state to `"waiting"`.
  - `desync_buffering` — sets state to `"buffering"`.
  - `desync_resumed` — clears state (`nil`), effectively hiding the indicator.
- **Pushes:** None identified.