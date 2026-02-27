---
id: quagmire_hangriness
title: Quagmire Hangriness
description: Tracks and manages a player's hangriness state in Quagmire mode, including progression mechanics, acceleration tiers, rumble effects, and network synchronization.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: 0e7df35c
---

# Quagmire Hangriness

## Overview
This component implements the hangriness progression system used for Quagmire mode, tracking how hungrier a player becomes over time. It calculates hangriness values using variable acceleration based on thresholds, handles client-server synchronization, triggers rumble and sound effects, and supports level-start matching logic for cooperative play.

## Dependencies & Tags
- **Components used:** None explicitly added or required on `inst`.
- **Tags added/removed:** None identified.
- **Network usage:** Relies on custom net variables (`net_float`, `net_bool`) scoped to the entity GUID.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed to constructor) | Reference to the owning entity (typically a player). |
| `_world` | `TheWorld` | `TheWorld` | Reference to the world context. Used for event dispatching and sound effects. |
| `_ismastersim` | `boolean` | `TheWorld.ismastersim` | Flag indicating whether the current instance is running in master simulation. |
| `_updating` | `boolean` | `false` | Whether the hangriness system is actively tracking time (i.e., level has started). |
| `_netvars.current` | `net_float` | `MAX_HANGRY` | Current hangriness value, clamped to `[0, MAX_HANGRY]`. |
| `_netvars.speed` | `net_float` | `0` | Current rate of hangriness increase (velocity-like quantity). |
| `_netvars.levelstart` | `net_float` | `0` | Remaining time at the start of a level; triggers updates when > 0. |
| `_netvars.rumbled` | `net_bool` | `false` | Whether the hangriness has triggered a major rumble event (level > 2). |
| `_netvars.matched` | `net_bool` | `false` | Whether the player has successfully matched with a craving (for co-op synchronization). |

## Main Functions

### `GetCurrent()`
* **Description:** Returns the current hangriness value.
* **Parameters:** None.

### `GetPercent()`
* **Description:** Returns the current hangriness as a fraction of `MAX_HANGRY` (i.e., percentage in range `[0, 1]`).
* **Parameters:** None.

### `GetLevel()`
* **Description:** Returns a difficulty level (1–3) based on current hangriness and speed. Level 3 if hungrier than threshold or speed is high; level 2 for medium speed; otherwise level 1.
* **Parameters:** None.

### `GetTimeRemaining()`
* **Description:** Computes and returns the estimated time (in seconds) until hangriness reaches 0, using piecewise constant acceleration defined in `ACCEL_THRESHOLDS`.
* **Parameters:** None.

### `Start(levelstart)`
* **Description:** (Master-only) Begins the hangriness tracking for a new level. Initializes internal timers and registers event callbacks for matching behavior.
* **Parameters:**  
  - `levelstart` (`number`): Time (in seconds) before the level timer begins reducing hangriness.

### `Stop()`
* **Description:** (Master-only) Stops hangriness tracking for the current level, clearing timers and callbacks.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** (Master-only, called automatically during update loop) Advances hangriness simulation by `dt` seconds, applying piecewise acceleration to reduce hangriness and update speed. Manages rumble timing, periodic syncing, and triggers sound events.
* **Parameters:**  
  - `dt` (`number`): Delta time in seconds since last frame.

## Events & Listeners
- Listens for `"levelstartdirty"` → triggers `OnLevelStartDirty()`, which starts or stops the update loop and registers/unregisters craving match/mismatch handlers.
- Listens for `"rumbleddirty"` (client-only) → triggers `OnRumbled()` to replay rumble sounds.
- Listens for `"matcheddirty"` (client-only) → triggers `OnMatched()` to notify listeners of matching status changes.
- Pushes `"quagmirehangrinessrumbled"` event via `_world:PushEvent(...)` when rumble occurs.
- Pushes `"quagmirehangrinessmatched"` event via `_world:PushEvent(...)` when matching state changes.