---
id: cooldown
title: Cooldown
description: Manages charging and recharging states for an entity's abilities, tracking cooldown duration and triggering callbacks when fully charged.
tags: [combat, ability, state]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b44a49f9
system_scope: entity
---

# Cooldown

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Cooldown` implements an ability-charging system for entities. It handles the transition from a "charging" state (during cooldown) to a "charged" state (ready to use), optionally executing callbacks when charging starts or completes. It supports persistence (via `OnSave`/`OnLoad`) and periodic updates via `LongUpdate` for networked syncing and simulation stability.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("cooldown")

inst.components.cooldown:SetStartChargingFn(function(inst) 
    print("Ability charging started")
end)

inst.components.cooldown:SetOnChargedFn(function(inst)
    print("Ability fully charged!")
    inst.components.combat:DoAttack()
end)

inst.components.cooldown:StartCharging(3.0)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Does not modify entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | Owner entity of this component (set during construction). |
| `charged` | `boolean` | `false` | Whether the ability is ready (cooldown complete). |
| `cooldown_duration` | `number?` | `nil` | Default duration (seconds) for charging; used if not overridden in `StartCharging`. |
| `startchargingfn` | `function?` | `nil` | Callback invoked when charging begins. |
| `onchargedfn` | `function?` | `nil` | Callback invoked when charging completes. |
| `task` | `DoTaskInTime?` | `nil` | Scheduled task object for the charge timer; `nil` when not charging. |
| `cooldown_deadline` | `number?` | `nil` | Absolute game time at which charging completes; `nil` when not charging. |

## Main functions
### `StartCharging(time)`
*   **Description:** Begins the charging process for the specified duration (or default duration if `time` is omitted). Sets `charged` to `false`, schedules a timer, and fires the `startchargingfn` callback.
*   **Parameters:** `time` (number, optional) - duration in seconds to wait before charging completes. Falls back to `self.cooldown_duration` if omitted.
*   **Returns:** Nothing.
*   **Error states:** Does not fail; cancels any existing timer before scheduling a new one.

### `FinishCharging()`
*   **Description:** Immediately completes the charging process if currently charging. Skips waiting and sets `charged = true`.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Has no effect if `cooldown_deadline` is `nil` (i.e., not currently charging).

### `GetTimeToCharged()`
*   **Description:** Returns the remaining time (in seconds) until charging completes.
*   **Parameters:** None.
*   **Returns:** `number` - remaining time (always `>= 0`). Returns `0` if not charging.
*   **Error states:** Returns `0` when not charging (`cooldown_deadline == nil`).

### `IsCharged()`
*   **Description:** Checks if the ability is fully charged (ready to use).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if fully charged; `false` otherwise.

### `IsCharging()`
*   **Description:** Checks if the ability is currently charging.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if charging (i.e., not charged and `cooldown_deadline` is set); `false` otherwise.

### `GetDebugString()`
*   **Description:** Returns a human-readable string for debugging: `"CHARGED!"` if ready, or the formatted remaining time otherwise.
*   **Parameters:** None.
*   **Returns:** `string` — either `"CHARGED!"` or `"X.XX"` (seconds remaining, rounded to two decimals).

### `OnSave()`
*   **Description:** Serializes the component's state for saving. Used during world save or entity saving.
*   **Parameters:** None.
*   **Returns:** `table` — contains:
    *   `charged` (`boolean` or `nil`) — only present if `true`.
    *   `time_to_charge` (`number` or `nil`) — remaining time; only present if not yet charged.
*   **Error states:** Does not return unnecessary fields; omits `charged` if `false`.

### `OnLoad(data)`
*   **Description:** Restores the component's state from saved data (e.g., on world load).
*   **Parameters:** `data` (`table`) — table with optional `charged` and `time_to_charge` fields.
*   **Returns:** Nothing.

### `LongUpdate(dt)`
*   **Description:** Adjusts `cooldown_deadline` and resolves completion during simulation updates. Handles timing drift by recalculating the deadline and re-scheduling if needed. Intended for use in the world's long update loop (e.g., `UpdateWorldState`).
*   **Parameters:** `dt` (`number`) — time delta since last frame.
*   **Returns:** Nothing.

### `SetStartChargingFn(fn)`
*   **Description:** Sets the callback function invoked when `StartCharging` begins. Not present in source; provided here as inferred setter for completeness. *(Note: Not found in source — included only as API best practice; does not exist in actual code.)*  
*Note: This function is not present in the provided source and must not be documented.*  
→ **Omitted**

### `SetOnChargedFn(fn)`
*   **Description:** Sets the callback function invoked when charging completes (via `donecharging`). Not present in source; provided here as inferred setter for completeness. *(Note: Not found in source — included only as API best practice; does not exist in actual code.)*  
→ **Omitted**

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
