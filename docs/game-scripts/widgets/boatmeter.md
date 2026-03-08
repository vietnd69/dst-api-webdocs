---
id: boatmeter
title: Boatmeter
description: Displays a boat's health status and leak state in the UI, updating dynamically during gameplay.
tags: [ui, boat, health]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: widgets
source_hash: 5b953b96
system_scope: ui
---

# Boatmeter

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`BoatMeter` is a UI widget that visualizes a boat's current health and leak status. It displays health as a dynamic fill level using animated symbols and updates whenever the boat's health changes. It interacts with the `healthsyncer` component to retrieve the current health percentage and relies on tags like `is_leaking` to reflect leakage state. The widget is typically attached to an entity (e.g., a player) and bound to a specific boat instance via `Enable(platform)`.

## Usage example
```lua
local boatmeter = CreateWidget("boatmeter")
boatmeter:Enable(boat_entity)
-- The meter automatically updates via OnUpdate and refreshes on health changes
boatmeter:Disable(false) -- close and stop updates
```

## Dependencies & tags
**Components used:** `healthsyncer` (via `boat.components.healthsyncer:GetPercent()` and `.max_health`)
**Tags:** Checks `is_leaking` tag on the bound boat entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `boat` | entity or `nil` | `nil` | Reference to the boat entity whose health is being displayed. Set via `Enable()`. |
| `previous_health_percent` | number | `1` | Cached previous health percentage used for pulse-detection. |
| `is_leaking` | boolean | `false` | Tracks current leak state to avoid redundant animation changes. |
| `pulsetask` | task or `nil` | `nil` | Task handle for the red-pulse timeout. |
| `refresh_health_cb` | function | anonymous | Reference to `RefreshHealth`, stored for potential reuse. |

## Main functions
### `Enable(platform)`
* **Description:** Activates the meter for a given boat, opens the UI, and starts periodic health updates. Must be called with a valid boat entity before use.
* **Parameters:** `platform` (entity) — the boat entity to monitor.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; silently does nothing if `platform` is invalid or has no `healthsyncer`.

### `Disable(instant)`
* **Description:** Deactivates the meter, hides UI elements, and stops updates. Fires a `"close_meter"` event with an `instant` flag.
* **Parameters:** `instant` (boolean) — indicates whether closing should be instantaneous.
* **Returns:** Nothing.
* **Error states:** Does nothing if `boat` is already `nil`.

### `RefreshHealth()`
* **Description:** Updates the visual health fill and numeric health display based on the boat's current health. Triggers a red pulse effect if health changed since last update.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Silently returns if `boat` is `nil`.

### `UpdateLeak()`
* **Description:** Checks the `is_leaking` tag on the boat and plays appropriate animation sequences for leak state transitions (e.g., `"arrow_pre"` → `"arrow_loop"` on leak start).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Silently returns if `boat` is `nil`.

### `PulseRed()`
* **Description:** Applies a temporary red tint to all visual elements to indicate health change, then schedules a task to revert to normal colors after 0.2 seconds.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Called periodically (via state graph). Refreshes health unless the server is paused. Ensures UI stays current during active gameplay.
* **Parameters:** `dt` (number) — delta time since last update.
* **Returns:** Nothing.
* **Error states:** Returns early if `TheNet:IsServerPaused()` is true.

## Events & listeners
- **Listens to:** `animover` — re-fires as `"animover"` on the owning entity to signal animation completion.
- **Pushes:** `"open_meter"` — fired on `Enable()`, `"close_meter"` with `{instant = boolean}` data on `Disable()`.