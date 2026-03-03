---
id: sleepingbaguser
title: Sleepingbaguser
description: Manages a player's sleeping behavior and associated stat regeneration while using a sleeping bag.
tags: [sleep, player, stat, inventory]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f758d8f8
system_scope: player
---

# Sleepingbaguser

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Sleepingbaguser` handles the logic for a player entity when sleeping in a sleeping bag (bed). It coordinates stat regeneration (health, hunger, sanity), tracks the sleep phase to wake up at dawn, manages sleep-specific bonuses (e.g., from equipment), and initiates wake-up actions. It works closely with the `sleepingbag` component on the sleeping bag entity and requires `health`, `hunger`, `sanity`, and `inventory` components on the sleeping entity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sleepingbaguser")
inst:AddComponent("health")
inst:AddComponent("hunger")
inst:AddComponent("sanity")
inst:AddComponent("inventory")

-- Optional: set bonus multipliers and custom sleep check
inst.components.sleepingbaguser:SetHealthBonusMult(1.5)
inst.components.sleepingbaguser:SetCanSleepFn(function(e) return not e:HasTag("player") end)

-- Start sleeping in a bed
local bed = GetBedEntity()
inst.components.sleepingbaguser:DoSleep(bed)

-- Wake up manually
inst.components.sleepingbaguser:DoWakeUp()
```

## Dependencies & tags
**Components used:** `health`, `hunger`, `sanity`, `inventory`, `sleepingbag`  
**Tags:** Does not add/remove tags directly; checks `good_sleep_aid` tag on equipped headgear.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `healthsleep` | boolean | `true` | Whether health should regenerate during sleep. |
| `dryingrate` | number or nil | `nil` | *(Not used in current implementation)* |
| `sleeper` | entity or nil | `nil` | Reference to the entity using this sleeping bag (set externally by `sleepingbag`). |
| `bed` | entity or nil | `nil` | Reference to the sleeping bag entity currently in use. |
| `sleeptask` | task or nil | `nil` | Periodic task running `SleepTick()` during sleep. |
| `onsleep` | function or nil | `nil` | Callback triggered on sleep start (if any). |
| `onwake` | function or nil | `nil` | Callback triggered on wake up (if any). |
| `hunger_bonus_mult` | number | `1` | Multiplier applied to hunger regeneration rate. |
| `health_bonus_mult` | number | `1` | Multiplier applied to health regeneration rate. |
| `sanity_bonus_mult` | number | `1` | Multiplier applied to sanity regeneration rate. |
| `cansleepfn` | function or nil | `nil` | Optional predicate function `(inst) -> success, reason` determining if sleep is allowed. |

## Main functions
### `SetHungerBonusMult(bonus)`
*   **Description:** Sets the multiplier applied to the hunger stat regeneration rate during sleep.
*   **Parameters:** `bonus` (number) - multiplier factor for hunger tick.
*   **Returns:** Nothing.

### `SetHealthBonusMult(bonus)`
*   **Description:** Sets the multiplier applied to the health stat regeneration rate during sleep.
*   **Parameters:** `bonus` (number) - multiplier factor for health tick.
*   **Returns:** Nothing.

### `SetSanityBonusMult(bonus)`
*   **Description:** Sets the multiplier applied to the sanity stat regeneration rate during sleep.
*   **Parameters:** `bonus` (number) - multiplier factor for sanity tick.
*   **Returns:** Nothing.

### `SetCanSleepFn(cansleepfn)`
*   **Description:** Assigns a custom predicate function to determine if the entity is allowed to sleep. If set, `ShouldSleep()` will call this function; otherwise, sleep is always permitted.
*   **Parameters:** `cansleepfn` (function) - function with signature `(inst) -> success (boolean), reason (string?)`.
*   **Returns:** Nothing.

### `DoSleep(bed)`
*   **Description:** Begins the sleep process using the specified `bed` entity. Sets up a periodic tick task and watches the world phase to wake up at dawn.
*   **Parameters:** `bed` (entity) - the sleeping bag entity to sleep in; must have a `sleepingbag` component.
*   **Returns:** Nothing.
*   **Error states:** Returns early if the `bed` has no `sleepingbag` component (no explicit check; may cause runtime errors). Cancels any existing `sleeptask` before starting.

### `DoWakeUp(nostatechange)`
*   **Description:** Ends the current sleep session. Cancels the sleep tick task, stops watching for phase changes, and transitions the entity to the `"wakeup"` state unless `nostatechange` is `true`.
*   **Parameters:** `nostatechange` (boolean) - if `true`, skips the `"wakeup"` state transition (e.g., for internal wake-ups like starvation).
*   **Returns:** Nothing.

### `ShouldSleep()`
*   **Description:** Checks whether the entity is allowed to sleep, using an optional custom predicate (`cansleepfn`) or defaulting to `true`.
*   **Parameters:** None.
*   **Returns:** `success` (boolean), `reason` (string?, optional) — reason if `success` is `false`.
*   **Error states:** Returns `true, nil` if no custom predicate is set.

### `SleepTick()`
*   **Description:** Runs periodically during sleep to apply stat regenerations based on sleeping bag tick values and multipliers. Wakes the entity if it becomes starving.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does not regenerate health if the entity is starving. Sanity regenerates only if below 100% after penalty. Health regenerates only if `sleepingbag.healthsleep` is `true`. Uses `TUNING.GOODSLEEP_SANITY` if a `good_sleep_aid` headgear is equipped.

## Events & listeners
- **Listens to:** `phase` (world state) — triggers `WakeUpTest` to exit sleep when the phase changes (e.g., from night to day).
- **Pushes:** No events directly; interacts with `health`, `hunger`, `sanity` components via their own events (e.g., `healthdelta`, `sanitydelta`).
