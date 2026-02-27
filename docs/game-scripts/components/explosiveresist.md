---
id: explosiveresist
title: Explosiveresist
description: Provides temporary resistance to explosive damage that decays over time, reducing incoming explosive damage proportionally to the current resistance level.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: combat
source_hash: cb5de85b
---

# Explosiveresist

## Overview
This component implements a temporary explosive damage resistance system. When an entity takes explosive damage, the resistance rises and begins to decay after a short delay. The resistance reduces incoming explosive damage by a proportional amount (e.g., 50% resistance halves the damage). It is active only when resistance > 0 and automatically updates during gameplay to handle decay.

## Dependencies & Tags
- Relies on `inst`: an entity instance (typically a player or mob).
- Uses `TUNING.EXPLOSIVE_MAX_RESIST_DAMAGE`, `TUNING.EXPLOSIVE_RESIST_DECAY_TIME`, and `TUNING.EXPLOSIVE_RESIST_DECAY_DELAY`.
- Starts/stops its own update loop via `inst:StartUpdatingComponent(self)` / `inst:StopUpdatingComponent(self)`.
- No tags added or removed.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `resistance` | `number` | `0` | Current resistance level, clamped to [0, 1]. |
| `maxresistdamage` | `number` | `TUNING.EXPLOSIVE_MAX_RESIST_DAMAGE` | Threshold for full resistance buildup; damage ≥ this adds 1.0 resistance. |
| `decaytime` | `number` | `TUNING.EXPLOSIVE_RESIST_DECAY_TIME` | Duration (in seconds) over which resistance fully decays once delay expires. |
| `decaydelay` | `number` | `TUNING.EXPLOSIVE_RESIST_DECAY_DELAY` | Seconds of delay before decay begins after a damage event. |
| `delayremaining` | `number` | `0` | Remaining delay time before decay starts; decremented each frame. |

## Main Functions

### `OnExplosiveDamage(damage, src)`
* **Description:** Handles incoming explosive damage. Increases resistance based on damage magnitude and resets the decay delay.
* **Parameters:**
  - `damage` (`number`): Amount of explosive damage taken. Only non-zero values trigger resistance increase.
  - `src`: Source of the damage (unused internally but present per event signature).

### `GetResistance()`
* **Description:** Returns the current resistance level (0.0 to 1.0).
* **Parameters:** None.

### `DoDelta(delta)`
* **Description:** Adjusts resistance by a delta amount, then clamps it to [0, 1]. Controls update loop activation.
* **Parameters:**
  - `delta` (`number`): Change to apply to `self.resistance` (e.g., positive for increase, negative for decay).

### `SetResistance(resistance)`
* **Description:** Sets resistance to the given value after clamping. Enables/disables the update loop depending on whether resistance is non-zero.
* **Parameters:**
  - `resistance` (`number`): Target resistance value; will be clamped to [0, 1].

### `OnUpdate(dt)`
* **Description:** Called every game tick while active. Manages decay: holds resistance for `delayremaining` seconds, then linearly decreases it over `decaytime`.
* **Parameters:**
  - `dt` (`number`): Delta time (seconds) since last frame.

### `OnSave()`
* **Description:** Saves resistance state for persistence. Returns a table with `resistance` (as integer percentage) if resistance ≥ 1%, else `nil`.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores resistance state from saved data (percentage → fractional value).
* **Parameters:**
  - `data` (`table?`): Saved data containing `resistance` as integer percentage.

### `GetDebugString()`
* **Description:** Returns a formatted debug string for inspection (e.g., in console).
* **Parameters:** None.

## Events & Listeners
- Listens for `explosivedamage` event (via `inst:ListenForEvent("explosivedamage", ...)` not shown in code but implied by function name and usage).
- No internal events are pushed by this component.