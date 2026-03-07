---
id: hunger
title: Hunger
description: Manages hunger and starvation mechanics, including decay, damage application, and synchronization with the health component.
tags: [player, entity, metabolism, damage]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9084000e
system_scope: entity
---

# Hunger

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Hunger` manages the hunger level (a value between `0` and `max`) and its decay over time. It triggers starvation when `current` reaches `0`, and can apply health damage via the `health` component. The component uses a periodic task to decrement hunger and integrates with the network replication system (`replica.hunger`) to synchronize state between server and clients.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("hunger")
inst.components.hunger:SetMax(100)
inst.components.hunger:SetCurrent(80)
inst.components.hunger:Resume()
```

## Dependencies & tags
**Components used:** `health` — accessed only for `DoDelta` and `IsInvincible`.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max` | number | `100` | Maximum hunger value. |
| `current` | number | `max` | Current hunger value; constrained to `[0, max]`. |
| `hungerrate` | number | `1` | Base rate of hunger loss per second. |
| `hurtrate` | number | `1` | Health damage rate applied per second while starving. |
| `burnrate` | number | `1` | **Deprecated**; use `burnratemodifiers` instead. |
| `burnratemodifiers` | SourceModifierList | Instance | List of modifiers to scale burn rate. |
| `overridestarvefn` | function or nil | `nil` | Custom function to call instead of default starvation damage. |
| `burning` | boolean | `true` | Whether hunger is currently active (i.e., not paused). |
| `updatetask` | Task or nil | Periodic task | Reference to the scheduled task; `nil` when paused. |
| `redirect` | function or nil | `nil` | Optional redirect callback for hunger changes. |

## Main functions
### `SetMax(amount)`
*   **Description:** Sets the maximum hunger value and resets current hunger to match.
*   **Parameters:** `amount` (number) — new maximum hunger value.
*   **Returns:** Nothing.

### `SetRate(rate)`
*   **Description:** Sets the base hunger decay rate.
*   **Parameters:** `rate` (number) — new hunger loss per second.
*   **Returns:** Nothing.

### `SetKillRate(rate)`
*   **Description:** Sets the health damage rate applied per second while starving.
*   **Parameters:** `rate` (number) — new health damage per second.
*   **Returns:** Nothing.

### `SetOverrideStarveFn(fn)`
*   **Description:** Assigns a custom function to handle starvation behavior instead of calling `health:DoDelta`.
*   **Parameters:** `fn` (function) — function of signature `fn(inst, dt)`.
*   **Returns:** Nothing.

### `IsPaused()`
*   **Description:** Returns whether hunger decay is currently paused.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if hunger is paused, otherwise `false`.

### `IsStarving()`
*   **Description:** Returns whether the entity is currently starving (current hunger ≤ `0`).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if starving, otherwise `false`.

### `Pause()`
*   **Description:** Pauses hunger decay and cancels the update task.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Resume()`
*   **Description:** Resumes hunger decay by restarting the update task if needed.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetPercent()`
*   **Description:** Returns current hunger as a fraction of `max`.
*   **Parameters:** None.
*   **Returns:** `number` in `[0, 1]`.

### `SetPercent(p, overtime)`
*   **Description:** Sets current hunger to `p * max`.
*   **Parameters:**  
    - `p` (number) — fraction of max (clamped to `[0, 1]`).  
    - `overtime` (boolean) — whether the change should be applied over time (currently only used for event context).
*   **Returns:** Nothing.

### `SetCurrent(current, overtime)`
*   **Description:** Sets hunger to a specific value, clamped to `[0, max]`. Fires `hungerdelta`, `startstarving`, and `stopstarving` events as appropriate.
*   **Parameters:**  
    - `current` (number) — new hunger value.  
    - `overtime` (boolean) — passed to `hungerdelta` event.
*   **Returns:** Nothing.
*   **Error states:** None.

### `DoDelta(delta, overtime, ignore_invincible)`
*   **Description:** Adjusts hunger by `delta`, respecting invincibility via the `health` component and optional redirect.
*   **Parameters:**  
    - `delta` (number) — amount to add to current hunger.  
    - `overtime` (boolean) — passed to `SetCurrent`.  
    - `ignore_invincible` (boolean) — if `true`, bypasses health invincibility check.
*   **Returns:** Nothing.
*   **Error states:** Returns early if `redirect` is set (does nothing else), or if health is invincible/teleporting.

### `DoDec(dt, ignore_damage)`
*   **Description:** Applies hunger decay for `dt` seconds. If starvation begins and `ignore_damage` is `false`, applies health damage.
*   **Parameters:**  
    - `dt` (number) — time delta in seconds.  
    - `ignore_damage` (boolean) — if `true`, skips health damage even while starving.
*   **Returns:** Nothing.

### `LongUpdate(dt)`
*   **Description:** Equivalent to `DoDec(dt, true)`; used for long-time-step updates without health damage.
*   **Parameters:** `dt` (number).
*   **Returns:** Nothing.

### `TransferComponent(newinst)`
*   **Description:** Copies current hunger state (as a percentage) to another entity's `hunger` component.
*   **Parameters:** `newinst` (Entity) — target entity instance.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Returns a table containing hunger data only if non-full; used for save optimization.
*   **Parameters:** None.
*   **Returns:** `{ hunger = number }` if `current ~= max`, otherwise `nil`.

### `OnLoad(data)`
*   **Description:** Loads hunger value from save data.
*   **Parameters:** `data` (table) — must contain `data.hunger` to apply.
*   **Returns:** Nothing.
*   **Error states:** No effect if `data.hunger` is missing or matches `current`.

### `OnRemoveFromEntity()`
*   **Description:** Cleans up the periodic update task when the component is removed.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted string for debugging the current hunger state.
*   **Parameters:** None.
*   **Returns:** `string` — e.g., `"75.0/100.0 | Rate: 1.00 (1.0*1.0) | Paused: false"`.

## Events & listeners
- **Listens to:** `ticking` (via `DoPeriodicTask`) — triggers `OnTaskTick` every `UPDATE_PERIOD` seconds (1.0s).
- **Pushes:**  
  - `hungerdelta` — fired whenever `current` changes, with `{ oldpercent, newpercent, overtime, delta }`.  
  - `startstarving` — fired when `current` transitions from >0 to ≤0.  
  - `stopstarving` — fired when `current` transitions from ≤0 to >0.
