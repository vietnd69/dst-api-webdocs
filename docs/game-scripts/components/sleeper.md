---
id: sleeper
title: Sleeper
description: Manages an entity's sleep/wake cycle by evaluating environmental and internal conditions to transition between awake and sleeping states.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: ce76371b
---

# Sleeper

## Overview
The `Sleeper` component implements an entity's sleep behavior, dynamically switching between awake and sleeping states based on customizable test functions, time-based checks, and external triggers (e.g., combat, fire, freezing). It integrates with the entity’s brain, locomotion, and combat systems to suppress activity while asleep and supports persistent sleepiness buildup (e.g., from sedatives). Entities gain the `"sleeper"` tag upon initialization.

## Dependencies & Tags
- Adds the `"sleeper"` tag to the entity in `_ctor`.
- Listens to events: `"onignite"`, `"firedamage"`, `"attacked"`, `"newcombattarget"`.
- Relies on the following components (conditional on presence): `combat`, `burnable`, `freezable`, `health`, `locomotor`, `homeseeker`, `teamattacker`.
- No explicit component dependencies in `AddComponent` calls, but behavior assumes these components exist where relevant.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity. |
| `isasleep` | `boolean` | `false` | Whether the entity is currently sleeping. |
| `testperiod` | `number` | `4` | Base interval (in seconds) between sleep/wake condition checks. |
| `lasttransitiontime` | `number` | `GetTime()` at init | Unix timestamp of the last sleep/wake transition. |
| `lasttesttime` | `number` | `GetTime()` at init | Timestamp of the last condition test. |
| `sleeptestfn` | `function` | `DefaultSleepTest` | Function returning `true` if the entity *should* fall asleep. |
| `waketestfn` | `function` | `DefaultWakeTest` | Function returning `true` if the entity *should* wake up. |
| `resistance` | `number` | `1` | Sleepiness threshold needed to trigger sleep (higher = harder to sleep). |
| `sleepiness` | `number` | `0` | Current accumulated sleep pressure (increases via `AddSleepiness`). |
| `wearofftime` | `number` | `10` | Interval (in seconds) for periodic `WearOff` decay of `sleepiness`. |
| `hibernate` | `boolean` | `false` | If `true`, stops testing conditions when asleep (used for permanent sleep states). |
| `watchlight` | `boolean` | `false` | If `true`, entity ignores darkness in caves (treated as having a light source). |
| `testtask` | `Task` | `nil` | Handle to the repeating task that runs `sleeptestfn`/`waketestfn`. |
| `wearofftask` | `Task` | `nil` | Handle to the periodic task for sleepiness decay. |
| `diminishingtask` | `Task` | `nil` | Handle to the periodic task for `extraresist` decay (for bosses/unique entities). |
| `extraresist` | `number` | `0` | Additional resistance added via `SetExtraResist` (decays over time). |
| `diminishingreturns` | `boolean` | `nil` | Optional flag enabling extra resistance on first sleep (uncommented by default). |

## Main Functions
### `SetDefaultTests()`
* **Description:** Resets sleep/wake test functions to the default global functions (`DefaultSleepTest`, `DefaultWakeTest`).
* **Parameters:** None.

### `StopTesting()`
* **Description:** Cancels the active test task (`testtask`) to halt condition checks.
* **Parameters:** None.

### `SetNocturnal(b)`
* **Description:** Switches sleep/wake logic to nocturnal mode: sleep during the day (overworld or cave day), wake at night.
* **Parameters:**  
  - `b` (`boolean`): If `true`, enable nocturnal mode; otherwise revert to diurnal (default) mode.

### `SetWakeTest(fn, time)`
* **Description:** Updates the wake test function and immediately starts testing (typically used during wake-up events).
* **Parameters:**  
  - `fn` (`function`): A function returning `true` if the entity should wake.  
  - `time` (`number`, optional): Delay (in seconds) for the next wake test cycle.

### `SetSleepTest(fn)`
* **Description:** Updates the sleep test function and restarts testing (typically used when transitioning to awake state).
* **Parameters:**  
  - `fn` (`function`): A function returning `true` if the entity should sleep.

### `OnEntitySleep()`
* **Description:** Called when the entity enters a sleep state (e.g., via stategraph); stops further condition testing.
* **Parameters:** None.

### `OnEntityWake()`
* **Description:** Called when the entity enters an awake state; restarts condition testing.
* **Parameters:** None.

### `SetResistance(resist)`
* **Description:** Sets the `resistance` value, raising the sleepiness threshold required to initiate sleep.
* **Parameters:**  
  - `resist` (`number`): New resistance value.

### `StartTesting(time)`
* **Description:** Starts the periodic condition-testing task using the appropriate function (`ShouldSleep` or `ShouldWakeUp`) based on `isasleep` status.
* **Parameters:**  
  - `time` (`number`, optional): Delay (in seconds) for the first wake test; ignored for sleep tests.

### `IsAsleep()`
* **Description:** Returns whether the entity is currently sleeping.
* **Parameters:** None.  
* **Returns:** `boolean`.

### `IsHibernating()`
* **Description:** Returns whether hibernation mode is active (sleeping indefinitely without auto-wake checks).
* **Parameters:** None.  
* **Returns:** `boolean`.

### `IsInDeepSleep()`
* **Description:** Returns `true` if the entity is asleep *and* has non-zero `sleepiness` (indicating it cannot wake for combat due to sedation).
* **Parameters:** None.  
* **Returns:** `boolean`.

### `GetTimeAwake()`
* **Description:** Returns time (in seconds) elapsed since last waking.
* **Parameters:** None.  
* **Returns:** `number`.

### `GetTimeAsleep()`
* **Description:** Returns time (in seconds) elapsed since last sleeping.
* **Parameters:** None.  
* **Returns:** `number`.

### `GetDebugString()`
* **Description:** Returns a formatted debug string summarizing sleep status, duration, test timers, sleepiness, resistance, and decay info.
* **Parameters:** None.  
* **Returns:** `string`.

### `AddSleepiness(sleepiness, sleeptime)`
* **Description:** Increases the entity’s `sleepiness` level. May immediately trigger sleep if `sleepiness ≥ resistance`, or schedule it via `OnGoToSleep`. Starts periodic `WearOff` task if needed.
* **Parameters:**  
  - `sleepiness` (`number`): Amount to increase sleep pressure.  
  - `sleeptime` (`number`, optional): Duration (in seconds) to sleep if triggered.

### `SetExtraResist(resist)`
* **Description:** Sets additional sleep resistance (for long-lived entities like bosses); triggers a decay task to gradually reduce `extraresist`.
* **Parameters:**  
  - `resist` (`number`): Extra resistance value (clamped to `[0, wearofftime]`).

### `GetSleepTimeMultiplier()`
* **Description:** Returns a multiplier (≥ 0.2) to reduce `sleeptime` based on accumulated `extraresist` (used in `GoToSleep`).
* **Parameters:** None.  
* **Returns:** `number`.

### `GoToSleep(sleeptime)`
* **Description:** Transitions the entity into sleep state: halts brain/locomotion, clears combat target, pushes `"gotosleep"` event, and schedules wake test. Skips if dead or invisible.
* **Parameters:**  
  - `sleeptime` (`number`, optional): Duration (in seconds) for the next wake test (scaled by `GetSleepTimeMultiplier()`).

### `WakeUp()`
* **Description:** Wakes the entity from sleep: restarts brain, resets `sleepiness`, pushes `"onwakeup"` event, and schedules sleep test. Skips if dead.
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes `extraresist` for persistence if positive.
* **Parameters:** None.  
* **Returns:** `table` or `nil`.

### `OnLoad(data)`
* **Description:** Restores `extraresist` from saved data.
* **Parameters:**  
  - `data` (`table`): Contains `extraresist` if saved.

### `SetTest(fn, time)`
* **Description:** Helper to start/replace the periodic condition-testing task with a custom function.
* **Parameters:**  
  - `fn` (`function`): The function to run periodically (e.g., `ShouldWakeUp`).  
  - `time` (`number`, optional): Initial delay before running `fn`.

## Events & Listeners
- Listens for `"onignite"` → triggers `WakeUp()` via `onattacked`.
- Listens for `"firedamage"` → triggers `WakeUp()` via `onattacked`.
- Listens for `"attacked"` → triggers `WakeUp()` via `onattacked`.
- Listens for `"newcombattarget"` → triggers `StartTesting()` via `onnewcombattarget`.
- Pushes `"gotosleep"` on successful transition to sleep.
- Pushes `"onwakeup"` on successful transition to awake state.