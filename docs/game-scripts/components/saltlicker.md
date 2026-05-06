---
id: saltlicker
title: SaltLicker
description: Manages entity behavior for seeking and consuming salt from saltlick objects over time.
tags: [entity, behavior, resource]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: 261c9d35
system_scope: entity
---

# SaltLicker

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`SaltLicker` enables an entity to seek out nearby saltlick objects and consume uses from them over a timed duration. It periodically searches for valid saltlicks within range, starts a timer when one is found, and consumes a configured number of uses per lick interval. The component integrates with `timer`, `sleeper`, and `freezable` components to pause behavior during sleep, freeze, or limbo states.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("timer")
inst:AddComponent("saltlicker")
inst.components.saltlicker:SetUp(3)  -- 3 uses consumed per lick interval
inst.components.saltlicker:SetSalted(true)
```

## Dependencies & tags
**Components used:**
- `timer` -- required; manages the salt consumption timer (asserted in constructor)
- `finiteuses` -- accessed on saltlick entity to consume uses per lick
- `sleeper` -- checked to pause behavior when entity is asleep
- `freezable` -- checked to pause behavior when entity is frozen

**Tags:**
- `saltlicker` -- added in constructor; marks entity as having this component
- `saltlicker_salted` -- added/removed via property watcher when `salted` changes

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `salted` | boolean | `false` | Whether the entity is currently salted. Assignment fires `onsalted` watcher. |
| `saltedduration` | number | `TUNING.SALTLICK_DURATION` | Duration in seconds for each salt consumption cycle. |
| `uses_per_lick` | number \| nil | `nil` | Number of finite uses consumed from saltlick per timer interval. |
| `_task` | task \| nil | `nil` | Periodic task reference for seeking behavior. |
| `saltlick` | entity \| nil | `nil` | Reference to the currently targeted saltlick entity. |

## Main functions
### `SetUp(uses_per_lick)`
* **Description:** Initializes the saltlicker behavior with a configured uses-per-lick value. Registers all event listeners and starts the seeking timer if valid.
* **Parameters:**
  - `uses_per_lick` -- number of uses to consume from saltlick per interval, or `nil` to disable
* **Returns:** nil
* **Error states:** Errors if `self.inst` has no `timer` component (asserted in constructor).

### `Stop()`
* **Description:** Halts all saltlicker activity. Removes all event listeners, stops the salt timer, cancels seeking task, and resets state. Called automatically in `OnRemoveFromEntity`.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `SetSalted(salted)`
* **Description:** Sets the salted state. Only pushes `saltchange` event if the value actually changes.
* **Parameters:**
  - `salted` -- boolean target state
* **Returns:** nil
* **Error states:** None

### `OnRemoveFromEntity()`
* **Description:** Cleanup handler called when component is removed from entity. Stops all activity and removes both `saltlicker` and `saltlicker_salted` tags.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `OnSave()`
* **Description:** Returns save data if the entity is currently salted. Only saves when `self.salted` is true to avoid triggering LoadPostPass unnecessarily.
* **Parameters:** None
* **Returns:** `{ salted = true }` if salted, `nil` otherwise

### `LoadPostPass()`
* **Description:** Restores salted state after world load by checking if the timer component still has the salt timer active.
* **Parameters:** None
* **Returns:** nil
* **Error states:** None

### `GetDebugString()`
* **Description:** Returns debug information including salted state, time remaining on salt timer, seeking task next time, duration, and uses per lick.
* **Parameters:** None
* **Returns:** string debug output

### `onsalted(self, salted)` (local)
* **Description:** Property watcher callback fired when `self.salted` is assigned. Adds or removes the `saltlicker_salted` tag based on the new value.
* **Parameters:**
  - `self` -- component instance
  - `salted` -- boolean new value
* **Returns:** nil
* **Error states:** None

### `_checkforsaltlick(inst, self)` (local)
* **Description:** Searches for a valid saltlick entity within `TUNING.SALTLICK_CHECK_DIST`. If found, stores reference, starts salt timer, stops seeking, and sets salted to true.
* **Parameters:**
  - `inst` -- entity instance
  - `self` -- component instance
* **Returns:** `true` if saltlick found, `false` otherwise
* **Error states:** None

### `_onsaltlickplaced(inst, data)` (local)
* **Description:** Event handler for `saltlick_placed`. If no salt timer exists and the placed saltlick is within range, starts consuming from it immediately.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- event data with `data.inst` being the placed saltlick
* **Returns:** nil
* **Error states:** None

### `_StopSeeking(self)` (local)
* **Description:** Cancels the periodic seeking task and removes the `saltlick_placed` event listener.
* **Parameters:**
  - `self` -- component instance
* **Returns:** nil
* **Error states:** None

### `_StartSeeking(self)` (local)
* **Description:** Starts periodic seeking for saltlicks. Cancels any existing task, registers `saltlick_placed` listener, and creates a new periodic task with period = `saltedduration * 0.125`.
* **Parameters:**
  - `self` -- component instance
* **Returns:** nil
* **Error states:** None

### `_ontimerdone(inst, data)` (local)
* **Description:** Timer completion handler. Consumes `uses_per_lick` from the saltlick's `finiteuses` component if valid. Then checks if entity should remain salted or resume seeking based on limbo/sleep/freeze state.
* **Parameters:**
  - `inst` -- entity instance
  - `data` -- timer event data with `data.name`
* **Returns:** nil
* **Error states:** None

### `OnPause(inst)` (local)
* **Description:** Pauses saltlicker behavior when entity enters limbo, sleep, or freeze state. Stops the salt timer and seeking task.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** None

### `TryUnpause(inst)` (local)
* **Description:** Attempts to resume saltlicker behavior when entity exits limbo, sleep, or freeze. Only resumes if no salt timer is already running and entity is in valid state.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** None

### `OnDeath(inst)` (local)
* **Description:** Death event handler. Calls `Stop()` to clean up all saltlicker activity when the entity dies.
* **Parameters:**
  - `inst` -- entity instance
* **Returns:** nil
* **Error states:** None

## Events & listeners
- **Listens to:**
  - `timerdone` -- triggers `_ontimerdone`; consumes uses from saltlick when timer expires
  - `enterlimbo` -- triggers `OnPause`; pauses behavior when entity enters limbo
  - `exitlimbo` -- triggers `TryUnpause`; attempts to resume behavior when exiting limbo
  - `gotosleep` -- triggers `OnPause`; pauses behavior when entity falls asleep
  - `onwakeup` -- triggers `TryUnpause`; attempts to resume behavior when waking up
  - `freeze` -- triggers `OnPause`; pauses behavior when entity freezes
  - `unfreeze` -- triggers `TryUnpause`; attempts to resume behavior when thawing
  - `death` -- triggers `OnDeath`; stops all saltlicker activity on entity death
  - `saltlick_placed` -- triggers `_onsaltlickplaced`; handles nearby saltlick placement events

- **Pushes:**
  - `saltchange` -- fired when `SetSalted()` changes the salted state. Data: `{ salted = boolean }`