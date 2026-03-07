---
id: nonslipgrit
title: Nonslipgrit
description: Applies a temporary non-slip buff to entities while consuming fuel over time, optionally spawning ice pools when boosted.
tags: [buff, fuel, environment, fx]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7e000ac6
system_scope: entity
---

# Nonslipgrit

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`nonslipgrit` is a consumable item prefab that grants a temporary non-slip buff to the player upon consumption. It is implemented as a multi-part prefab system involving the main item (`nonslipgrit` and `nonslipgritboosted`), temporary buff entities (`nonslipgrit_buff` and `nonslipgrit_buff_fx`), and ice pools (`nonslipgritpool`). The item uses the `fueled` component to manage fuel consumption and the `nonslipgritsource` component (custom) to trigger buff application or pool spawning at fixed intervals. The buff entity integrates with the `debuff` and `timer` components for lifecycle management.

## Usage example
```lua
local grit = SpawnPrefab("nonslipgritboosted")
-- Grit will automatically spawn ice pools while active and deplete its fuel
-- or manually attach the buff to an entity:
grit.components.inventoryitem:GiveToEntity(player)
player.components.inventory:Equip(player.components.inventory.rightHand)
```

## Dependencies & tags
**Components used:** `fueled`, `nonslipgritsource`, `debuff`, `timer`, `nonslipgritpool`, `inspectable`, `inventoryitem`, `animstate`, `transform`, `network`, `soundemitter`, `vfxeffect`, `timer`
**Tags:** `donotautopick`, `NOCLICK`, `nonslipgritpool`, `FX`, `CLASSIFIED`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `MAX_FUEL_LEVEL` | number | `100` | Total fuel capacity for the item. |
| `TOTAL_USE_TIME` | number | `TUNING.NONSLIPGRIT_TOTAL_USE_TIME` | Duration in seconds for full consumption (used for burn rate calculation). |
| `POOL_RADIUS` | number | `3` | Radius (in world units) around the item position where a pool can be spawned. |
| `NUMBER_OF_POOLS` | number | `TUNING.NONSLIPGRITBOOSTED_NUMBER_OF_POOLS` | Number of ice pools spawned per use when boosted. |
| `BUFF_DURATION` | number | `0.25` | Duration (seconds) of each buff tick applied by `nonslipgrit_buff`. |
| `POOL_RADIUS_SQ` | number | `9` | Squared radius (`3 * 3`) used for proximity checks. |

## Main functions
### `OnDelta(inst, dt)`
*   **Description:** Called periodically by the `nonslipgritsource` component to apply a short-lived non-slip buff and consume a proportional amount of fuel.
*   **Parameters:** `dt` (number) - Time delta in seconds since the last call.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; relies on valid `inst.components.fueled` and `AddDebuff` availability.

### `OnDelta_Boosted(inst, dt)`
*   **Description:** Called periodically by the `nonslipgritsource` component in boosted mode to spawn one ice pool at the item's location and consume fuel for each pool.
*   **Parameters:** `dt` (number) - Time delta in seconds (unused in function body).
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; relies on valid transform and `SpawnPrefab` success.

### `IsGritAtPoint(inst, x, y, z)`
*   **Description:** Checks whether a given world point is within the effective radius of the ice pool.
*   **Parameters:**  
    `inst` (Entity) — The pool entity.  
    `x`, `y`, `z` (numbers) — World coordinates to test.
*   **Returns:** `boolean` — `true` if the point is within the pool radius; otherwise `false`.
*   **Error states:** Returns `false` if transform position retrieval fails.

### `OnAttached_buff(inst, target, followsymbol, followoffset, data)`
*   **Description:** Triggered when the buff is applied to a target entity. Creates and parents the visual FX prefab (`nonslipgrit_buff_fx`) and starts a timer to expire the buff.
*   **Parameters:**  
    `inst` (Entity) — The buff entity instance.  
    `target` (Entity) — The entity receiving the buff.  
    `followsymbol`, `followoffset`, `data` — Unused in this implementation.
*   **Returns:** Nothing.
*   **Error states:** No explicit error handling; `SpawnPrefab` or `SetParent` may fail silently.

### `OnDetached_buff(inst, target)`
*   **Description:** Triggered when the buff is removed. Removes the associated FX entity and cleans up the buff instance.
*   **Parameters:**  
    `inst` (Entity) — The buff entity instance.  
    `target` (Entity) — The entity that previously had the buff.
*   **Returns:** Nothing.
*   **Error states:** None documented; assumes `inst.bufffx` is valid or `nil`.

### `OnExtendedbuff(inst, target, followsymbol, followoffset, data)`
*   **Description:** Extends the remaining time of the buff if the new duration exceeds the current remaining time.
*   **Parameters:**  
    `inst` (Entity) — The buff entity instance.  
    `target`, `followsymbol`, `followoffset`, `data` — Unused in this implementation.
*   **Returns:** Nothing.
*   **Error states:** Only extends if current time remaining is `nil` or less than the new duration.

### `OnTimerDone_buff(inst, data)`
*   **Description:** Handles timer expiration for the buff entity and stops the debuff.
*   **Parameters:** `data` (table) — Timer callback data; must contain `name == "buffover"`.
*   **Returns:** Nothing.
*   **Error states:** No explicit handling; silently exits if `data.name` is not `"buffover"`.

## Events & listeners
- **Listens to:**  
    `timerdone` — In `nonslipgritpool` and `nonslipgrit_buff`, triggers dissolution or removal.  
    `death` — In `nonslipgrit_buff`, stops the debuff if the target dies.  
    `animover` — In `nonslipgritpool`, triggers entity removal after the post-animation completes.  
    `entitywake`, `entitysleep` — In `nonslipgritpool`, defers sound playback until the world is active.  
    `onfueldsectionchanged` — Implicitly handled by the `fueled` component; calls `inst.Remove` when depleted.  
- **Pushes:**  
    `buff_expired` — Implicitly via `debuff:Stop()` and entity removal (no explicit event name in source).  
    `death`, `animover`, `timerdone`, `onfueldsectionchanged` — All via internal components or standard DST event system.
