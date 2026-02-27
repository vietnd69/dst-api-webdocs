---
id: wereness
title: Wereness
description: Manages theWereness level (a hidden gameplay stat) for players, handling value changes, draining mechanics, and state persistence across sessions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 57ec51d3
---

# Wereness

## Overview
The `Wereness` component tracks and manages a player's "wereness" level—a hidden stat that influences transformation behavior in the game. It supports incrementing/decrementing the value, automatic draining based on a configurable rate, and persistence of state via save/load hooks. It also coordinates with `player_classified.currentwereness` and `player_classified.werenessdrainrate` (likely UI or engine-side representations) to propagate changes.

## Dependencies & Tags
- Adds the tag `"wereness"` to the entity (`inst:AddTag("wereness")`).
- Requires the presence of an `inst.player_classified` sub-object to update read-only `currentwereness` and `werenessdrainrate` properties via setters.
- No other component dependencies are directly added by this script.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max` | `number` | `100` | Maximum allowed Wereness value. Read-only after initialization if `inst.player_classified` exists. |
| `current` | `number` | `0` | Current Wereness value; clamped to `[0, max]`. |
| `_old` | `number` | `self.current` (at construction) | Stores previous `current` value before `DoDelta` for delta comparison. |
| `rate` | `number` | `0` | Draining rate (negative), in units per second. Positive values are clamped to 0 internally for draining logic. |
| `draining` | `boolean` | `false` | Indicates whether the component is actively updating and draining. |
| `weremode` | `any` | `nil` | Stores the current "were-mode" state (e.g., `"wolf"`), or `nil` if not transformed. |

## Main Functions
### `Wereness:SetWereMode(weremode)`
* **Description:** Sets the current were-mode (e.g., human/wolf form). Stored internally for save/load and logic branching.
* **Parameters:**
  * `weremode`: Any value (typically a string) representing the transformation state.

### `Wereness:GetWereMode()`
* **Description:** Returns the stored were-mode value.
* **Parameters:** None.

### `Wereness:SetDrainRate(rate)`
* **Description:** Sets the Wereness drain rate (per second). Values are expected to be ≤ 0 and ≥ -10; valid range enforced via assertion in `onrate` callback.
* **Parameters:**
  * `rate`: `number` — Negative number indicating how fast Wereness decreases (e.g., `-0.5` = 0.5 units/sec).

### `Wereness:StartDraining()`
* **Description:** Begins automatic draining if not already active *and* current Wereness > 0. Starts periodic updates via `StartUpdatingComponent`.
* **Parameters:** None.

### `Wereness:StopDraining()`
* **Description:** Halts automatic draining and stops component updates.
* **Parameters:** None.

### `Wereness:DoDelta(delta, overtime)`
* **Description:** Applies a change (`delta`) to the current Wereness, clamps the result to `[0, max]`, emits a `"werenessdelta"` event, and stops draining if value reaches 0.
* **Parameters:**
  * `delta`: `number` — Amount to add to `current` (may be negative).
  * `overtime`: `boolean` — Indicates whether the delta was applied over time (e.g., via `OnUpdate`).

### `Wereness:GetPercent()`
* **Description:** Returns the current Wereness as a fraction (0.0–1.0).
* **Parameters:** None.

### `Wereness:SetPercent(percent, overtime)`
* **Description:** Directly sets Wereness to a percentage of `max`, then calls `DoDelta` to normalize and emit events.
* **Parameters:**
  * `percent`: `number` — Target fraction (0.0 to 1.0).
  * `overtime`: `boolean` — Passed to `DoDelta` to indicate context.

### `Wereness:OnUpdate(dt)`
* **Description:** Callback invoked every tick while draining is active. Applies rate × dt as a delta to Wereness.
* **Parameters:**
  * `dt`: `number` — Delta time in seconds since last frame.

### `Wereness:OnSave()`
* **Description:** Returns serialization data if `current > 0`, including `current` and `weremode`; otherwise returns `nil`.
* **Parameters:** None.

### `Wereness:OnLoad(data)`
* **Description:** Restores Wereness state from save data. If `data.current` exists and > 0, restores values and restarts draining.
* **Parameters:**
  * `data`: `table?` — Save data table with optional `current` and `mode` keys.

### `Wereness:GetDebugString()`
* **Description:** Returns a formatted debug string (e.g., `"42.00/100.00 (-0.50/s)"`) for logging or debug UI.
* **Parameters:** None.

## Events & Listeners
- **Emits events:**
  - `"werenessdelta"` — Pushed by `DoDelta`, with payload `{ oldpercent, newpercent, overtime }`.
- **Callback hooks:**
  - `current = oncurrent` — Triggered when `player_classified.currentwereness:set()` is updated (internal synchronization).
  - `rate = onrate` — Triggered when `player_classified.werenessdrainrate:set()` is updated (internal synchronization).
- **No `ListenForEvent` listeners are defined in this component.**