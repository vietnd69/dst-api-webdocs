---
id: pinnable
title: Pinnable
description: This component manages the state and behavior of entities that can be pinned (e.g., by goo), including animations, wear-off mechanics, and response to damage or death.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 0e479f73
---

# Pinnable

## Overview
The `pinnable` component allows an entity to transition between a free state and a "pinned" state—typically caused by interaction with goo-based projectiles. While pinned, the entity becomes immobile, stops targeting, plays an animated goo symbol, and gradually wears off over time or due to damage. It handles visual effects, timing, and event callbacks to coordinate with other systems like combat and animation.

## Dependencies & Tags
**Dependencies:**
- Relies on the presence of optional components: `health`, `combat`, `locomotor`, and `brain` (used via `inst:StopBrain("pinned")` and `inst:RestartBrain("pinned")`).
- Uses `TUNING.PINNABLE_WEAR_OFF_TIME`, `TUNING.PINNABLE_ATTACK_WEAR_OFF`, and `TUNING.PINNABLE_RECOVERY_LEEWAY`.

**Tags:**
- Adds the `"pinned"` tag when stuck.
- Removes the `"pinned"` tag when unstuck.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `canbepinned` | boolean | `true` | Controls whether the entity is eligible to be pinned. |
| `stuck` | boolean | `false` | Indicates whether the entity is currently pinned. |
| `wearofftime` | number | `TUNING.PINNABLE_WEAR_OFF_TIME` | Total duration (in seconds) for the pin to wear off under ideal conditions. |
| `wearofftask` | Task | `nil` | Task handle for scheduling wear-off completion. |
| `attacks_since_pinned` | number | `0` | Number of attacks received since being pinned; reduces effective wear-off time. |
| `last_unstuck_time` | number | `0` | Timestamp of the last unpinned state change. |
| `last_stuck_time` | number | `0` | Timestamp when the entity was last pinned. |
| `fxlevel` | number | `1` | Placeholder for effect intensity (currently unused in logic). |
| `fxdata` | table | `{}` | Unused field; reserved for future effect data. |
| `goo_build` | string | `nil` | Name of the goo build asset used in animation override (set on `Stick`). |
| `splashfxlist` | table | `nil` | Custom list of splash FX prefabs to use instead of default (set on `Stick`). |

## Main Functions
### `Stick(goo_build, splashfxlist)`
* **Description:** Attempts to pin the entity. Only succeeds if `canbepinned` is true, the entity is visible, and not dead. Sets `stuck = true`, disables brain/locomotion/combat targeting, plays a goo animation symbol, and schedules wear-off. Emits `"pinned"` event.
* **Parameters:**
  * `goo_build` (string, optional): Name of the animation symbol override build to use for the goo. Defaults to `"goo"` if `nil`.
  * `splashfxlist` (table, optional): Array of FX prefabs to use when shattering. Defaults to `splashprefabs` if `nil`.

### `Unstick()`
* **Description:** Ends the pinned state. Resets `stuck`, cancels wear-off task, spawns shatter FX, restarts the pinned brain, clears animation override, and emits `"onunpin"` event.
* **Parameters:** None.

### `UpdateStuckStatus()`
* **Description:** Evaluates whether the current pin should persist. If `remainingRatio <= 0`, unpins. Otherwise, updates the animation symbol based on remaining time and schedules the wear-off task.
* **Parameters:** None.

### `IsStuck()`
* **Description:** Returns the current `stuck` state.
* **Parameters:** None.

### `IsValidPinTarget()`
* **Description:** Checks whether the entity can currently be pinned: must be eligible (`canbepinned`), not already stuck, and have waited long enough since last unpinned (`last_unstuck_time + PINNABLE_RECOVERY_LEEWAY`).
* **Parameters:** None.

### `RemainingRatio()`
* **Description:** Calculates the fraction of pin duration remaining (0.0 to 1.0). Accounts for time elapsed and damage received.
* **Parameters:** None.

### `StartWearingOff(wearofftime)`
* **Description:** Schedules the `WearOff` callback after `wearofftime` seconds. If a task already exists, it is cancelled first.
* **Parameters:**
  * `wearofftime` (number): Time in seconds until wear-off completes.

### `SpawnShatterFX(ratio)`
* **Description:** Spawns a shatter effect based on how much of the pin remains (`ratio`). Chooses from `splashprefabs` (or `splashfxlist` if overridden) based on remaining fraction.
* **Parameters:**
  * `ratio` (number, optional): Remaining pin ratio (0.0–1.0). If omitted, `RemainingRatio()` is used.

### `SetDefaultWearOffTime(wearofftime)`
* **Description:** Overrides the default wear-off time for this instance.
* **Parameters:**
  * `wearofftime` (number): New base wear-off duration.

## Events & Listeners
- **Listens for `"unpinned"`** → calls `OnUnpinned` (triggers `Unstick()`).
- **Listens for `"attacked"`** → calls `OnAttacked` (increments `attacks_since_pinned`, triggers shatter FX, and updates pin status if stuck).
- **Listens for `"death"`** → calls `OnUnpinned` (unpins on death).
- **Triggers `"pinned"`** event when transitioning to stuck state (in `Stick()`).
- **Triggers `"onunpin"`** event when transitioning to unstuck state (in `Unstick()`).