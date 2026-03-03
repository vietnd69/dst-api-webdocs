---
id: sleeper
title: Sleeper
description: Manages sleep/wake cycles for entities based on environmental conditions, sleepiness accumulation, and custom test functions.
tags: [ai, sleep, state, boss]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ce76371b
system_scope: entity
---
# Sleeper

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Sleeper` component enables entities to enter and exit sleep states based on configurable conditions. It is commonly used for bosses and passive creatures to implement fatigue-based sleep or natural circadian behavior. The component periodically evaluates sleep/wake test functions and manages transitions, sleepiness accumulation, and resistance. It interacts closely with `combat`, `health`, `locomotor`, `burnable`, `freezable`, and `homeseeker` components to respect gameplay constraints (e.g., no sleeping while burning or engaged in combat).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sleeper")
inst.components.sleeper:SetDefaultTests()
inst.components.sleeper:SetResistance(5) -- Must accumulate 5 "sleepiness" units to sleep
inst.components.sleeper:AddSleepiness(2) -- Increases sleepiness; may trigger sleep
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`, `burnable`, `freezable`, `homeseeker`, `teamattacker`  
**Tags:** Adds `sleeper`; checks `cavedweller`, `busy`, `nosleep`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Reference to the entity that owns this component. |
| `isasleep` | boolean | `false` | Whether the entity is currently sleeping. |
| `testperiod` | number | `4` | Base interval (seconds) between sleep/wake checks. |
| `lasttransitiontime` | number | `GetTime()` | Timestamp of last sleep/wake transition. |
| `lasttesttime` | number | `GetTime()` | Timestamp of the last test function execution. |
| `sleeptestfn` | function | `DefaultSleepTest` | Function determining if the entity *should* sleep. |
| `waketestfn` | function | `DefaultWakeTest` | Function determining if the entity *should* wake. |
| `resistance` | number | `1` | Amount of `sleepiness` required to initiate sleep. |
| `sleepiness` | number | `0` | Current accumulated sleepiness. |
| `wearofftime` | number | `10` | Interval (seconds) for `sleepiness` decay when not at peak resistance. |
| `hibernate` | boolean | `false` | If true, disables wake tests after waking from deep sleep. |
| `watchlight` | boolean | `false` | If true, enables light-awareness logic for sleep/wake conditions. |
| `extraresist` | number? | `nil` | Additional sleep resistance (used for boss fatigue diminishing returns). |
| `diminishingreturns` | boolean? | `nil` | If true, applies diminishing sleep resistance via `extraresist`. |
| `diminishingtask` | `Task`? | `nil` | Task handling `extraresist` decay. |

## Main functions
### `SetDefaultTests()`
* **Description:** Resets sleep/wake test functions to the standard day/night-based defaults.
* **Parameters:** None.
* **Returns:** Nothing.

### `StopTesting()`
* **Description:** Cancels the periodic test task. Typically called when entering deep sleep or when no longer active.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetWakeTest(fn, time)`
* **Description:** Sets a custom wake test function and restarts the test cycle. Used to override wake conditions (e.g., with a timeout for scheduled wake-ups).
* **Parameters:**  
  - `fn` (function) – wake condition function.  
  - `time` (number?) – optional time delay before wake test triggers.  
* **Returns:** Nothing.

### `SetSleepTest(fn)`
* **Description:** Sets a custom sleep test function and restarts the test cycle.
* **Parameters:**  
  - `fn` (function) – sleep condition function.  
* **Returns:** Nothing.

### `OnEntitySleep()`
* **Description:** Called when the entity enters the sleep state; cancels active test tasks.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnEntityWake()`
* **Description:** Called when the entity wakes; resumes test tasks.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetResistance(resist)`
* **Description:** Updates the amount of `sleepiness` required to fall asleep.
* **Parameters:**  
  - `resist` (number) – new sleep resistance value.  
* **Returns:** Nothing.

### `StartTesting(time)`
* **Description:** Starts or restarts the sleep/wake test cycle. If sleeping, uses wake test; otherwise, uses sleep test.
* **Parameters:**  
  - `time` (number?) – optional delay before first wake test (only used if already asleep).  
* **Returns:** Nothing.

### `IsAsleep()`
* **Description:** Returns whether the entity is currently sleeping.
* **Parameters:** None.
* **Returns:** `boolean` – `true` if sleeping, `false` otherwise.

### `IsHibernating()`
* **Description:** Returns whether hibernation mode is active (prevents automatic waking).
* **Parameters:** None.
* **Returns:** `boolean` – `true` if hibernating.

### `IsInDeepSleep()`
* **Description:** Returns whether the entity is sleeping *and* has non-zero `sleepiness` (indicating it was drugged or exhausted).
* **Parameters:** None.
* **Returns:** `boolean` – `true` if in deep sleep.

### `GetTimeAwake()`
* **Description:** Returns the duration (in seconds) since the entity last woke up, or `0` if currently sleeping.
* **Parameters:** None.
* **Returns:** `number` – time spent awake (seconds).

### `GetTimeAsleep()`
* **Description:** Returns the duration (in seconds) since the entity last fell asleep, or `0` if currently awake.
* **Parameters:** None.
* **Returns:** `number` – time spent asleep (seconds).

### `GetDebugString()`
* **Description:** Returns a formatted debug string describing current sleep state, timing, sleepiness, and resistance.
* **Parameters:** None.
* **Returns:** `string` – formatted status string.

### `AddSleepiness(sleepiness, sleeptime)`
* **Description:** Adds to the entity's `sleepiness`. Triggers sleep if `sleepiness` exceeds `resistance`. Manages decay task and delayed sleep onset if at resistance threshold.
* **Parameters:**  
  - `sleepiness` (number) – amount to add to current `sleepiness`.  
  - `sleeptime` (number?) – duration of sleep (seconds), if triggered.  
* **Returns:** Nothing.

### `SetExtraResist(resist)`
* **Description:** Sets additional resistance (for boss fatigue mechanics) and manages decay task. Value is clamped to `[0, wearofftime]`.
* **Parameters:**  
  - `resist` (number) – extra resistance to add.  
* **Returns:** Nothing.

### `GetSleepTimeMultiplier()`
* **Description:** Returns a multiplier applied to sleep duration when `extraresist` is active (decreases as resistance increases).
* **Parameters:** None.
* **Returns:** `number` – multiplier (e.g., `0.8`), minimum `0.2`.

### `GoToSleep(sleeptime)`
* **Description:** Initiates sleep state. Cancels combat/target, stops movement, clears wake test, and sets wake timer if `sleeptime` provided. Pushes `gotosleep` event once per transition.
* **Parameters:**  
  - `sleeptime` (number?) – duration of sleep (seconds).  
* **Returns:** Nothing.

### `WakeUp()`
* **Description:** Ends sleep state, resets `sleepiness`, and reactivates sleep test cycle. Pushes `onwakeup` event. Cannot wake if dead.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetNocturnal(b)`
* **Description:** Enables or disables nocturnal sleep behavior (sleeps during day, wakes at night).
* **Parameters:**  
  - `b` (boolean) – `true` to use nocturnal tests.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `onignite` – triggers `WakeUp()` if attacked by fire.  
  - `firedamage` – triggers `WakeUp()` during fire damage.  
  - `attacked` – triggers `WakeUp()` on physical attack.  
  - `newcombattarget` – triggers `StartTesting()` if a combat target is assigned.  
- **Pushes:**  
  - `gotosleep` – fired once when entering sleep.  
  - `onwakeup` – fired once when exiting sleep.  
