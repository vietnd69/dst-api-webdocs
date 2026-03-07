---
id: slingshotammo_debuffs
title: Slingshotammo Debuffs
description: Defines slingshot ammo-specific debuff prefabs and their logic, including planar damage application, visual effects, and flash animation handling for debuffs like Pure Brilliance, Horror Fuel, and Slow.
tags: [combat, debuff, fx, slingshot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0746de4b
system_scope: combat
---

# Slingshotammo Debuffs

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines multiplePrefab factories for slingshot ammo debuffs used in DST — specifically `PureBrilliance`, `HorrorFuel`, and `Slow`. Each debuff applies planar damage, responds to attack events via debuff lifecycle hooks (`OnAttached`, `OnDetached`, `OnExtended`), and manages visual feedback including colour flashes (via the `colouradder` component) and animation assets. The prefabs are non-persistent, server-side only, and often attached to the target of a slingshot attack to visually and mechanically mark them.

## Usage example
```lua
-- Spawn and attach a Pure Brilliance debuff to a target entity
local debuff = SpawnPrefab("slingshotammo_purebrilliance_debuff")
if debuff ~= nil and debuff:IsValid() then
    debuff.components.debuff:Attach(target_entity, "debuffsymbol", Vector3(0,0,0), { level = 2 })
end

-- Spawn and restart a Horror Fuel FX unit
local fx = SpawnPrefab("slingshotammo_horrorfuel_debuff_fx")
if fx ~= nil and fx:IsValid() then
    fx:Restart(attacker_entity, target_entity, variation, quick)
end
```

## Dependencies & tags
**Components used:** `updatelooper`, `planardamage`, `damagetypebonus`, `debuff`, `colouradder`, `combat`, `health`, `burnable`, `freezable`, `spdamageutil`  
**Tags added:** `CLASSIFIED`, `attacktriggereddebuff`, `FX`, `NOCLICK`, `notarget`, `smallcreature`, `largecreature`, `epic`, `lunar_aligned`, `shadow_aligned`  
**Tags checked:** `smallcreature`, `largecreature`, `epic`, `attacktriggereddebuff`, `lunar_aligned`, `shadow_aligned`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `flashtarget` | `Entity` or `nil` | `nil` | The entity currently being flashed; set during `StartFlash`. |
| `flashstep` | `number` or `nil` | `nil` | Current step in the flash sequence (1–4); used by `UpdateFlash`. |
| `flashcolour` | `{r,g,b,a}` or `nil` | `nil` | Base RGB colour used for flashing, e.g., `PUREBRILLIANCE_FLASH_COLOUR`. |
| `_task` | `Task` or `nil` | `nil` | Timeout task used to expire debuff (Pure Brilliance). |
| `_owner` | `Entity` or `nil` | `nil` | Entity that owns or summoned this debuff (Pure Brilliance). |
| `_fx` | `Entity` or `nil` | `nil` | Debuff visual FX entity attached to target (Pure Brilliance). |
| `_back` | `Entity` or `nil` | `nil` | Back-layer FX entity for Pure Brilliance FX unit. |
| `size` | `number` (1–3) | `2` | Size variation for FX animation (used by Pure Brilliance FX and Slow FX). |
| `_level` | `number` | `1` | Level for Slow FX animation variation. |
| `_size` | `string` | `""` | Size string (`"small"`, `"med"`, `"large"`) determined from target at runtime. |
| `_inittask` | `Task` or `nil` | `nil` | Initial cleanup task for Slow FX. |
| `killed` | `boolean` | `false` | Flag to prevent duplicate animation triggers in Slow FX. |

## Main functions
### `buff_OnLongUpdate(inst, dt)`
*   **Description:** Handles debuff expiry timing on the server. Called periodically via `OnLongUpdate`. Cancels and reschedules the timer based on remaining time and delta.
*   **Parameters:**  
    - `inst` (`Entity`) – The debuff entity.  
    - `dt` (`number`) – Delta time in seconds.  
*   **Returns:** Nothing.

### `StartFlash(inst, target, flashcolour)`
*   **Description:** Starts a 4-step colour flash animation on the target entity by adding a temporary `colouradder` layer. Registers `UpdateFlash` with `updatelooper` and stores state for cleanup.
*   **Parameters:**  
    - `inst` (`Entity`) – The debuff instance managing the flash.  
    - `target` (`Entity`) – The entity to flash.  
    - `flashcolour` (`{number,number,number,number}`) – RGBA base colour (e.g., `{1,1,1,0}`).  
*   **Returns:** Nothing.

### `CancelFlash(inst)`
*   **Description:** Stops and cleans up an active flash. Removes the `UpdateFlash` callback and removes the associated `colouradder` layer from the target.
*   **Parameters:** `inst` (`Entity`) – The debuff instance.  
*   **Returns:** Nothing.

### `PureBrilliance_OnAttached(inst, target, followsymbol, followoffset, data)`
*   **Description:** Runs when the Pure Brilliance debuff attaches to a target. Attaches FX, sets up expiry task, listens for `death`, and registers `attacked` event on the target to trigger planar damage.
*   **Parameters:**  
    - `inst` (`Entity`) – The debuff entity.  
    - `target` (`Entity`) – The target entity receiving the debuff.  
    - `followsymbol` (`string` or `nil`) – Symbol to attach FX to (unused).  
    - `followoffset` (`Vector3` or `nil`) – Offset for attachment (unused).  
    - `data` (`table` or `nil`) – Debuff attach data (unused).  
*   **Returns:** Nothing.

### `PureBrilliance_OnDetached(inst, target)`
*   **Description:** Runs when Pure Brilliance is removed. Plays post animation on the FX, cleans up event listeners, and removes the debuff entity.
*   **Parameters:**  
    - `inst` (`Entity`) – The debuff entity.  
    - `target` (`Entity`) – The target entity.  
*   **Returns:** Nothing.

### `PureBrilliance_OnExtended(inst)`
*   **Description:** Extends debuff duration by cancelling and rescheduling the expiry task.
*   **Parameters:** `inst` (`Entity`) – The debuff entity.  
*   **Returns:** Nothing.

### `PureBrilliance_OnOwnerAttacked(inst, owner, data)`
*   **Description:** Handles attack events on the owner (the debuff target). Calculates planar damage (including `damagetypebonus` multipliers), inflicts damage via `combat:GetAttacked`, triggers hit FX, and starts a colour flash if `data.attacker` exists.
*   **Parameters:**  
    - `inst` (`Entity`) – The debuff entity.  
    - `owner` (`Entity`) – The target entity that was attacked.  
    - `data` (`table` or `nil`) – Combat damage event data (see `combat` component).  
*   **Returns:** Nothing. Returns early if `data.redirected`, attacker lacks planar damage, or attacker is itself.

### `HorrorFuel_Restart(inst, attacker, target, variation, quick)`
*   **Description:** Restarts a Horror Fuel FX entity at a new location or target. Starts the `idle` animation, schedules `HorrorFuel_DoAttack` on a hit frame, and sets up the target-follow logic via `Follower`.
*   **Parameters:**  
    - `inst` (`Entity`) – The FX entity.  
    - `attacker` (`Entity`) – The slingshot attacker.  
    - `target` (`Entity`) – The intended target.  
    - `variation` (`number`) – Animation variation ID (e.g., `1`, `2`).  
    - `quick` (`boolean`) – If true, skips initial frames for faster hit.  
*   **Returns:** Nothing.

### `PureBrillianceMarkFx_GetBestSymbolAndSize(inst, target)`
*   **Description:** Determines the optimal symbol and size for the Pure Brilliance FX attachment based on the target’s components (`burnable`, `freezable`, `combat`). Returns `symbol, size`.
*   **Parameters:**  
    - `inst` (`Entity`) – The FX entity.  
    - `target` (`Entity`) – The target entity.  
*   **Returns:** `symbol` (`string` or `nil`), `size` (`number` in `1..3`).  
*   **Error states:** May return `nil, 2` if no symbol found.

### `Slow_StartFX(inst, target, delay)`
*   **Description:** Starts the Slow FX animation sequence on the target after a delay (or immediately). Determines `small/med/large` size and begins pre/loop animation.
*   **Parameters:**  
    - `inst` (`Entity`) – The FX entity.  
    - `target` (`Entity`) – The target.  
    - `delay` (`number` or `nil`) – Optional delay before starting.  
*   **Returns:** Nothing.

### `Slow_SetFXLevel(inst, level)`
*   **Description:** Updates the Slow FX level, restarting the loop animation if necessary.
*   **Parameters:**  
    - `inst` (`Entity`) – The FX entity.  
    - `level` (`number`) – New level (1–N).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"death"` (on target) – Stops the debuff when target dies.  
  - `"attacked"` (on debuff owner/target) – Triggers planar damage for Pure Brilliance.  
  - `"onremove"` (on target) – Cleans up follower and parent relationships for Horror Fuel FX.  
  - `"animover"` (on FX) – Triggers removal after post-animation ends.  
- **Pushes:**  
  - `"attacked"` (via `target:PushEvent`) – For Horror Fuel, if target has no current target.  
  - No events are fired directly by `inst:PushEvent` in this file.