---
id: wereness
title: Wereness
description: Manages the wereness meter and its dynamic behavior, including draining and state persistence for player entities.
tags: [combat, player, state]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 57ec51d3
system_scope: player
---

# Wereness

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Wereness` is a component that manages the wereness value (a progress-like meter) for a player entity. It supports setting and updating the current wereness level, controlling the drain rate (e.g., during transformations), and persists state across saves. The component integrates with network replication via `player_classified.currentwereness` and `werenessdrainrate` when available, ensuring client-server consistency.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("wereness")

inst.components.wereness:SetWereMode("normal")
inst.components.wereness:SetPercent(0.75, false)
inst.components.wereness:SetDrainRate(-0.5)  -- negative rate for draining
inst.components.wereness:StartDraining()
```

## Dependencies & tags
**Components used:** None identified (uses `inst.player_classified` if present, but does not require other components directly).  
**Tags:** Adds `"wereness"` to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max` | number | `100` | Maximum value of the wereness meter. |
| `current` | number | `0` | Current wereness value (clamped to `[0, max]`). |
| `rate` | number | `0` | Drain/charge rate per second (negative = drain, positive = charge). |
| `draining` | boolean | `false` | Whether the wereness meter is actively being updated. |
| `weremode` | string \| nil | `nil` | Identifier for the current weremode state (e.g., `"normal"`, `"fullmoon"`). |

## Main functions
### `SetWereMode(weremode)`
* **Description:** Sets the current weremode identifier (e.g., `"normal"` or `"fullmoon"`), typically used to track transformation state.
* **Parameters:** `weremode` (string \| nil) – A string identifier for the mode, or `nil` to clear.
* **Returns:** Nothing.

### `GetWereMode()`
* **Description:** Returns the currently stored weremode identifier.
* **Parameters:** None.
* **Returns:** `(string \| nil)` – The stored weremode string, or `nil`.

### `SetDrainRate(rate)`
* **Description:** Sets the per-second change rate for wereness. Negative values cause draining; positive values increase wereness.
* **Parameters:** `rate` (number) – Rate of change per second (e.g., `-0.5` drains 0.5 units per second).
* **Returns:** Nothing.

### `StartDraining()`
* **Description:** Begins the draining process by starting component updates. Only starts if currently inactive and `current > 0`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `draining` is already `true`.

### `StopDraining()`
* **Description:** Stops component updates and sets `draining` to `false`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** No-op if `draining` is already `false`.

### `DoDelta(delta, overtime)`
* **Description:** Applies a change (`delta`) to the wereness value, clamps it to `[0, max]`, and fires the `"werenessdelta"` event with percent and overtime info.
* **Parameters:**  
  `delta` (number) – Amount to add to `current`.  
  `overtime` (boolean) – Whether the change occurred during a delta update (e.g., from `OnUpdate`).
* **Returns:** Nothing.
* **Error states:** Automatically stops draining if `current` reaches `0`.

### `GetPercent()`
* **Description:** Returns the wereness level as a fraction of `max`.
* **Parameters:** None.
* **Returns:** `(number)` – A value in `[0, 1]` representing current wereness percentage.

### `SetPercent(percent, overtime)`
* **Description:** Sets `current` to `max * percent` and triggers a delta update.
* **Parameters:**  
  `percent` (number) – Desired percentage (e.g., `0.5` for 50%).  
  `overtime` (boolean) – Passed to `DoDelta` for event context.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Called periodically while draining is active. Applies `rate * dt` to wereness via `DoDelta`.
* **Parameters:** `dt` (number) – Time since last update.
* **Returns:** Nothing.
* **Error states:** No-op if `rate == 0` or `dt == 0`.

### `OnSave()`
* **Description:** Returns save data if `current > 0`, otherwise `nil`.
* **Parameters:** None.
* **Returns:** `(table \| nil)` – A table with keys `current` (number) and `mode` (string), or `nil`.

### `OnLoad(data)`
* **Description:** Restores wereness state from saved data if valid.
* **Parameters:** `data` (table) – Contains `current` (number) and optionally `mode` (string).
* **Returns:** Nothing.
* **Error states:** Only loads if `data.current > 0`; otherwise ignores silently.

### `GetDebugString()`
* **Description:** Returns a human-readable string for debugging the wereness state.
* **Parameters:** None.
* **Returns:** `(string)` – Format: `"current/max (±rate/s)"`, e.g., `"50.00/100.00 (-0.50/s)"`.

## Events & listeners
- **Pushes:**  
  - `"werenessdelta"` – Fired by `DoDelta` when `current` changes. Payload: `{ oldpercent = number, newpercent = number, overtime = boolean }`.  
- **Listens to:** None (network replication callbacks `oncurrent` and `onrate` are internal setters, not event listeners).
