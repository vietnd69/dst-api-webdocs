---
id: beefbloodover
title: Beefbloodover
description: Displays a visual overlay indicating when the player's mount is hurt, with smooth opacity transitions and a pulse effect.
tags: [ui, visual, mount]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 96b34969
system_scope: ui
---

# Beefbloodover

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`Beefbloodover` is a UI widget that renders a semi-transparent blood overlay on the screen when the player's mount (e.g., Beefalo) is damaged. It dynamically adjusts its opacity based on the mount's health status using linear interpolation, and adds a flashing pulse effect on mount damage or redirection events. The widget is owned by the player entity and integrates with the `rider` component to detect mount-related events.

## Usage example
```lua
local inst = ThePlayer
inst:AddWidget("beefbloodover")
-- The widget auto-initializes and listens to mount events
-- No further manual setup is required
```

## Dependencies & tags
**Components used:** `rider` (accessed via `self.owner.replica.rider`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `owner` | Entity | `nil` | The entity (typically the player) that owns this widget. |
| `bg` | Image | `nil` | The background image component displaying the blood texture. |
| `base_level` | number | `0` | Target opacity level for smooth transition. |
| `level` | number | `0` | Current opacity level (smoothly interpolated). |
| `k` | number | `1` | Interpolation rate constant for opacity transitions. |
| `time_since_pulse` | number | `0` | Time elapsed since the last pulse cycle. |
| `pulse_period` | number | `1` | Duration in seconds between pulse cycles. |

## Main functions
### `UpdateState()`
*   **Description:** Checks the mount's health status via the `rider` component and turns the overlay on or off accordingly.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `TurnOn()`
*   **Description:** Activates the overlay by setting the target opacity to `0.5`, starting the update loop, and resetting the pulse timer.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `TurnOff()`
*   **Description:** Deactivates the overlay by setting the target opacity to `0` and keeping the update loop running until `level` reaches `0`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Updates the overlay's opacity using linear interpolation toward `base_level`. Applies a subtle pulse effect when active and not paused. Updates the texture tint alpha.
*   **Parameters:** `dt` (number) — Delta time since the last frame (must be `> 0` and `<= 0.1`; larger values cause early return).
*   **Returns:** Nothing.
*   **Error states:** Returns early if `dt <= 0` or `dt > 0.1`.

### `Flash()`
*   **Description:** Immediately sets the overlay to full opacity (`level = 1`) for a brief visual alert (e.g., on hit redirection), using a faster interpolation constant (`k = 1.33`).
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  - `attacked` (on `owner`) — Triggers `Flash()` if the attack was redirected and the player is currently riding.
  - `mounthurt` (on `owner`) — Triggers `UpdateState()` to reflect mount health changes.
- **Pushes:** None identified.