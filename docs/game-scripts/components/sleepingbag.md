---
id: sleepingbag
title: Sleepingbag
description: Manages sleep state and associated gameplay effects for entities interacting with a sleeping bag (e.g., healing, hunger loss, sanity restoration).
tags: [sleep, healing, inventory, multiplayer]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f72b74d9
system_scope: player
---

# Sleepingbag

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`SleepingBag` is a component attached to sleeping bag prefabs (e.g., `sleepingbag`) that handles sleep interactions, including tracking who is currently sleeping in the bag, applying periodic stat adjustments (health, hunger, sanity), and managing the sleeping phase requirement (e.g., night). It works closely with the `sleepingbaguser` component attached to the sleeping entity to coordinate state transitions and networked behavior.

## Usage example
```lua
local bag = SpawnPrefab("sleepingbag")
bag:AddComponent("sleepingbag")

-- Optional: customize behavior
bag.components.sleepingbag:SetSleepPhase("day")
bag.components.sleepingbag:SetTemperatureTickFn(my_temp_check_fn)

-- Start a player sleeping
bag.components.sleepingbag:DoSleep(player)

-- Stop a player sleeping
bag.components.sleepingbag:DoWakeUp()
```

## Dependencies & tags
**Components used:** `sleepingbaguser`, `player_classified`
**Tags:** Adds `hassleeper` when a sleeper is present; removes it when the sleeper leaves.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `healthsleep` | boolean | `true` | Whether the sleeping entity receives health healing during sleep. |
| `dryingrate` | number or nil | `nil` | (Unused in this file; likely for future or contextual drying logic.) |
| `sleeper` | Entity instance or nil | `nil` | Reference to the entity currently sleeping in this bag. |
| `onsleep` | function or nil | `nil` | Optional callback fired when sleep begins (`fn(inst, doer)`). |
| `onwake` | function or nil | `nil` | Optional callback fired when sleep ends (`fn(inst, sleeper, nostatechange)`). |
| `tick_period` | number | `TUNING.SLEEP_TICK_PERIOD` | Interval in seconds between sleep stat updates. |
| `hunger_tick` | number | `TUNING.SLEEP_HUNGER_PER_TICK` | Hunger lost per sleep tick. |
| `health_tick` | number | `TUNING.SLEEP_HEALTH_PER_TICK` | Health restored per sleep tick. |
| `sanity_tick` | number | `TUNING.SLEEP_SANITY_PER_TICK` | Sanity restored per sleep tick. |
| `sleep_phase` | string | `"night"` | World phase during which the sleeping bag is effective (e.g., `"night"`). |

## Main functions
### `SetSleepPhase(phase)`
* **Description:** Sets the world phase (e.g., `"night"`) required for sleep to be valid.  
* **Parameters:** `phase` (string) – the world phase during which sleeping is allowed.  
* **Returns:** Nothing.

### `GetSleepPhase()`
* **Description:** Returns the currently configured sleep phase.  
* **Parameters:** None.  
* **Returns:** string – the configured sleep phase.

### `SetTemperatureTickFn(fn)`
* **Description:** Assigns a custom function to handle per-tick temperature-related logic during sleep (e.g., temperature loss/gain).  
* **Parameters:** `fn` (function) – a function of signature `fn(self, sleeper)` to be called each tick.  
* **Returns:** Nothing.

### `DoSleep(doer)`
* **Description:** Registers the given entity (`doer`) as the current sleeper and initiates the sleep state. It requires that no sleeper is currently active and that `doer` does not already use another sleeping bag.  
* **Parameters:** `doer` (Entity instance) – the entity beginning sleep.  
* **Returns:** Nothing.  
* **Error states:** Early-exits with no effect if `self.sleeper ~= nil` or `doer.sleepingbag ~= nil`.

### `DoWakeUp(nostatechange)`
* **Description:** Ends the current sleep session. Removes the sleeper reference, cancels sleep tasks, fires the `onwake` callback, and instructs the sleeper's `sleepingbaguser` component to handle state transition.  
* **Parameters:** `nostatechange` (boolean) – if `true`, suppresses state graph transitions for the sleeper.  
* **Returns:** Nothing.  
* **Error states:** Early-exits with no effect if `self.sleeper == nil` or if the sleeper is not bound to this sleeping bag.

### `InUse()`
* **Description:** Returns whether the sleeping bag is currently occupied.  
* **Parameters:** None.  
* **Returns:** boolean – `true` if a sleeper is active, otherwise `false`.

## Events & listeners
- **Listens to:** `healthsleep`, `sleeper` – internal watchpoints managed by the `Class` helper to trigger associated callbacks (`onhealthsleep`, `onsleeper`) when these properties are updated.
- **Pushes:** None directly. However, `DoSleep` and `DoWakeUp` trigger events indirectly via `sleepingbaguser` and optional callbacks.
