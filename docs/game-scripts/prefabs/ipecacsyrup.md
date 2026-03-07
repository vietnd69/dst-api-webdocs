---
id: ipecacsyrup
title: Ipecacsyrup
description: A consumable item that applies a debuff causing periodic poison damage and poop spawning over time.
tags: [consumable, debuff, combat, damage]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 8f1b0032
system_scope: inventory
---

# Ipecacsyrup

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `ipecacsyrup` prefab represents a consumable item that, when eaten by a character currently in the `ipecacpoop` state, applies a debuff (`ipecacsyrup_buff`) that triggers recurring damage and poop-spawning effects over time. The debuff is implemented as a separate non-networked entity (`ipecacsyrup_buff`) that tracks a tick counter and fires timed events. It integrates with the `edible`, `debuff`, `timer`, and `periodicspawner` systems.

## Usage example
```lua
local inst = SpawnPrefab("ipecacsyrup")
inst.components.edible.healthvalue -- yields -TUNING.HEALING_MED
inst.components.edible:SetOnEatenFn(my_custom_on_eaten_fn)
```

## Dependencies & tags
**Components used:** `edible`, `stackable`, `tradable`, `inspectable`, `inventoryitem`, `debuff`, `timer`, `periodicspawner`, `health`.  
**Tags:** Adds `CLASSIFIED` to `ipecacsyrup_buff` entity (for internal logic).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_tick_count` | number | `TUNING.IPECAC_POOP_COUNT` | Remaining ticks before the debuff ends. Initialized in `fn_buff`. |
| `prefab` | string | `"ipecacsyrup"` or `"ipecacsyrup_buff"` | Prefab identifier passed to `Prefab()` constructor. |

## Main functions
### `syrup_OnEaten(inst, eater)`
* **Description:** Handler executed when the syrup is consumed. Checks if the eater is in the `ipecacpoop` state and, if so, applies the `ipecacsyrup_buff` debuff.
* **Parameters:**  
  `inst` (Entity) — the syrup item instance.  
  `eater` (Entity) — the entity that ate the syrup.  
* **Returns:** Nothing.  
* **Error states:** Only triggers debuff if `eater.sg ~= nil` and `eater.sg:HasState("ipecacpoop")` returns true.

### `buff_OnAttached(inst, target)`
* **Description:** Callback invoked when the debuff is attached to a target. Sets the buff entity as a child of the target, resets tick count, and starts the tick timer. Registers listeners for `death` and `onremove` events to clean up.
* **Parameters:**  
  `inst` (Entity) — the `ipecacsyrup_buff` entity.  
  `target` (Entity) — the entity receiving the debuff.  
* **Returns:** Nothing.

### `buff_DoTick(inst)`
* **Description:** Executes one tick of the debuff: decrements the tick counter, spawns a `poop` at the target’s position, applies damage, fires the `ipecacpoop` event, and restarts the timer for the next tick (if not exhausted).
* **Parameters:**  
  `inst` (Entity) — the `ipecacsyrup_buff` entity.  
* **Returns:** Nothing.  
* **Error states:** If `_tick_count <= 0`, stops the debuff instead of spawning or damaging.

### `buff_OnTimerDone(inst, data)`
* **Description:** Event callback for `timerdone`; dispatches `buff_DoTick` if the timer name matches `IPECAC_TICK_TIMERNAME`.
* **Parameters:**  
  `inst` (Entity) — the `ipecacsyrup_buff` entity.  
  `data` (table) — timer data, expected to contain `name`.  
* **Returns:** Nothing.

### `buff_OnExtended(inst, target)`
* **Description:** Resets the tick count to `TUNING.IPECAC_POOP_COUNT` when the debuff is reapplied (prevents stacking). Does not extend duration — only resets remaining ticks.
* **Parameters:**  
  `inst` (Entity) — the `ipecacsyrup_buff` entity.  
  `target` (Entity) — the debuffed entity (unused).  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `timerdone` — handled by `buff_OnTimerDone`.  
  `death` (on target) — triggers `debuff:Stop()`.  
  `onremove` (on target) — triggers `debuff:Stop()`.
- **Pushes:**  
  `ipecacpoop` — fired on the debuffed target during each tick.