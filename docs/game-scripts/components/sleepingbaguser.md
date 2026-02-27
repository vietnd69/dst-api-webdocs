---
id: sleepingbaguser
title: Sleepingbaguser
description: Manages a player entity's sleeping behavior while using a sleeping bag, including entering/exiting sleep, processing sleep ticks, and applying bonuses based on equipped items.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: f758d8f8
---

# Sleepingbaguser

## Overview
This component handles the mechanics of a player (or other entity) sleeping inside a sleeping bag. It manages transitioning into and out of sleep, periodic sleep ticks that restore hunger/health/sanity, and dynamic wake-up behavior (e.g., during daytime or starvation). It also supports configurable bonus multipliers and custom sleep eligibility logic.

## Dependencies & Tags
- Relies on: `inventory`, `hunger`, `health`, `sanity`, `sleepingbag` (on the bed), `statemachine` (via `sg`)
- Adds/uses: Entity state `bedroll`, event `"phase"` (world state)
- Uses tag: `good_sleep_aid` (on equipped head item)

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in) | Reference to the owning entity (typically a player). |
| `healthsleep` | `boolean` | `true` | Whether health regeneration occurs during sleep (inherited from the bed). |
| `dryingrate` | `number?` | `nil` | Unused in current implementation. |
| `sleeper` | `string?` | `nil` | Unused in current implementation. |
| `onsleep` | `function?` | `nil` | Unused in current implementation. |
| `onwake` | `function?` | `nil` | Unused in current implementation. |
| `hunger_bonus_mult` | `number` | `1` | Multiplier applied to hunger restored per tick. |
| `health_bonus_mult` | `number` | `1` | Multiplier applied to health restored per tick. |
| `sanity_bonus_mult` | `number` | `1` | Base multiplier for sanity restored per tick. |
| `bed` | `Entity?` | `nil` | Reference to the sleeping bag entity currently being used. |
| `sleeptask` | `TimerTask?` | `nil` | Periodic task scheduled during sleep to process sleep ticks. |
| `cansleepfn` | `function?` | `nil` | Optional custom function to determine if the entity can sleep. |

## Main Functions

### `SetHungerBonusMult(bonus)`
* **Description:** Sets the multiplier used to scale hunger restored per sleep tick.
* **Parameters:** `bonus` — A numeric multiplier (e.g., `1.5` for 50% more hunger restored).

### `SetHealthBonusMult(bonus)`
* **Description:** Sets the multiplier used to scale health restored per sleep tick.
* **Parameters:** `bonus` — A numeric multiplier (e.g., `0.5` for half health regeneration).

### `SetSanityBonusMult(bonus)`
* **Description:** Sets the base multiplier for sanity restored per sleep tick (good sleep aid modifies this further).
* **Parameters:** `bonus` — A numeric multiplier.

### `SetCanSleepFn(cansleepfn)`
* **Description:** Assigns a custom function to override the default sleep permission logic. The function receives the owner entity and must return `success` (boolean) and optionally `reason` (string).
* **Parameters:** `cansleepfn` — A function `(entity) -> success, reason`.

### `DoSleep(bed)`
* **Description:** Initiates sleep using the given sleeping bag. Registers a world-state watcher to wake up at phase changes (e.g., daytime), cancels any prior sleep task, and starts a periodic tick task based on the bed’s tick period.
* **Parameters:** `bed` — The sleeping bag entity (must have a `sleepingbag` component).

### `DoWakeUp(nostatechange)`
* **Description:** Ends the sleep state. Cancels the sleep tick task, stops phase monitoring, and triggers the `"wakeup"` state in the entity’s state machine (unless `nostatechange` is `true`). Checks for `good_sleep_aid` headgear to influence state behavior.
* **Parameters:** `nostatechange` — If `true`, skips state machine transition (e.g., for in-code wakeups).

### `ShouldSleep()`
* **Description:** Determines if the entity is allowed to sleep. Uses the custom `cansleepfn` if provided; otherwise, returns `true`.
* **Returns:** `success` (boolean), `reason?` (string, if custom function returns it).

### `SleepTick()`
* **Description:** Processes a single sleep tick: restores hunger, sanity, and (if applicable) health. Applies multipliers and considers `good_sleep_aid` for extra sanity gain. Wakes the player up if they become starving.
* **Behavior:** Reads current tick values from `bed.components.sleepingbag` and applies bonus multipliers. Supports custom temperature handling via `temperaturetickfn`.

## Events & Listeners
- **Listens to:** `"phase"` world state (`WatchWorldState("phase", WakeUpTest)`) — triggers wake-up if the world phase changes while sleeping.
- **Stops listening on wake-up:** `StopWatchingWorldState("phase", WakeUpTest)`
- **Triggers via `WakeUpTest`:** Calls `bed:DoWakeUp()` when phase mismatch is detected.