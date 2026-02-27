---
id: sleepingbag
title: Sleepingbag
description: This component manages sleep interactions for a sleeping bag entity, including tracking the current sleeper, applying sleep-based healing, and handling entering/leaving sleep states.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
source_hash: f72b74d9
---

# Sleepingbag

## Overview
This component enables a sleeping bag entity to host and coordinate player sleep sessions. It maintains a reference to the current sleeper, manages sleep-related state (such as `healthsleep`), handles initialization and cleanup during sleep/wake cycles, and notifies related systems (e.g., via callbacks or the `sleepingbaguser` component) when sleep states change.

## Dependencies & Tags
- **Component dependency:** Requires the sleeper entity to have a `sleepingbaguser` component (accessed via `sleeper.components.sleepingbaguser`).
- **Tags added/removed:**
  - Adds `"hassleeper"` tag when a sleeper is assigned.
  - Removes `"hassleeper"` tag when the sleeper is cleared.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `healthsleep` | `boolean` | `true` | Indicates whether the sleeping bag provides sleep-based healing (controls `issleephealing` state on sleeper). |
| `sleeper` | `Entity` or `nil` | `nil` | Reference to the player currently using the sleeping bag. |
| `tick_period` | `number` | `TUNING.SLEEP_TICK_PERIOD` | Interval (in seconds) between sleep-related gameplay ticks (e.g., hunger/health/sanity decay). |
| `hunger_tick` | `number` | `TUNING.SLEEP_HUNGER_PER_TICK` | Amount of hunger lost per sleep tick. |
| `health_tick` | `number` | `TUNING.SLEEP_HEALTH_PER_TICK` | Amount of health gained per sleep tick. |
| `sanity_tick` | `number` | `TUNING.SLEEP_SANITY_PER_TICK` | Amount of sanity gained per sleep tick. |
| `sleep_phase` | `string` | `"night"` | Current phase of the sleep session (e.g., `"night"`, `"day"`). |
| `onsleep` | `function` or `nil` | `nil` | Optional callback invoked when a player begins sleeping. |
| `onwake` | `function` or `nil` | `nil` | Optional callback invoked when a player wakes up. |
| `temperaturetickfn` | `function` or `nil` | `nil` | Optional callback used to handle temperature changes during sleep. |
| `ambient_temp` | `number` or `nil` | `nil` | Current ambient temperature (used with `temperaturetickfn`). |
| `sleep_temp_min` | `number` or `nil` | `nil` | Minimum ambient temperature threshold for safe sleep. |
| `sleep_temp_max` | `number` or `nil` | `nil` | Maximum ambient temperature threshold for safe sleep. |

## Main Functions

### `SetSleepPhase(phase)`
* **Description:** Updates the current sleep phase (e.g., `"night"` or `"day"`). Used to track whether the player is sleeping during night or daytime (e.g., via a sleeping bag in a sheltered area).
* **Parameters:**  
  `phase` (`string`) — The new sleep phase value.

### `GetSleepPhase()`
* **Description:** Returns the current sleep phase.
* **Parameters:** None.  
* **Returns:** `string` — The current sleep phase.

### `SetTemperatureTickFn(fn)`
* **Description:** Assigns a custom temperature handling function to be called each sleep tick.
* **Parameters:**  
  `fn` (`function`) — A callback function to handle temperature effects during sleep (signature likely `fn(inst, sleeper, ambient_temp)`).

### `DoSleep(doer)`
* **Description:** Initiates a sleep session for the given entity. Assigns the `sleeper`, sets up bidirectional references, calls `sleepingbaguser:DoSleep`, and triggers the `onsleep` callback if defined.
* **Parameters:**  
  `doer` (`Entity`) — The player entity beginning sleep.

### `DoWakeUp(nostatechange)`
* **Description:** Ends the current sleep session. Clears sleeper references, calls `sleepingbaguser:DoWakeUp`, and triggers the `onwake` callback if defined.
* **Parameters:**  
  `nostatechange` (`boolean`, optional) — If `true`, prevents certain state transitions (e.g., not waking to full day). Default behavior assumed by caller.

### `InUse()`
* **Description:** Checks if the sleeping bag is currently occupied.
* **Parameters:** None.  
* **Returns:** `boolean` — `true` if a sleeper is assigned; otherwise `false`.

## Events & Listeners
- Listens for `"healthsleep"` property changes and updates the sleeper’s `issleephealing` state accordingly.
- Listens for `"sleeper"` property changes to:
  - Clear `issleephealing` on the old sleeper (if any),
  - Add/remove the `"hassleeper"` tag on itself,
  - Update the new sleeper’s `issleephealing` state (if applicable).