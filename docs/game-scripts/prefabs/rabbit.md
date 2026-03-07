---
id: rabbit
title: Rabbit
description: Manages the lifecycle, transformations, loot, and interactions of rabbit entities, including seasonal morphing and nightmare-state conversion into beardlings.
tags: [locomotion, ai, transformation, loot, entity]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 519a85cf
system_scope: entity
---

# Rabbit

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `rabbit` prefab implements behavior for the in-game rabbit, a small animal that transforms between seasonal forms (normal and winter) and can be forced into a nightmare state ("beardling") via world events. It integrates with multiple systems including cooking, sanity, inventory, combat, and loot, and handles state transitions via timers and world-state listeners (`iswinter`). Key behaviors include seasonal morphing, sanity aura emission, transformation effects, and conditional loot generation based on transform state or observer sanity.

## Usage example
```lua
local inst = Prefab("rabbit", fn, assets, prefabs)()
inst:AddComponent("health")
inst.components.health:SetMaxHealth(25)
inst:AddTag("rabbit")
inst.components.lootdropper:SetLoot({"smallmeat"})
```

## Dependencies & tags
**Components used:** `locomotor`, `drownable`, `eater`, `inventoryitem`, `sanityaura`, `cookable`, `knownlocations`, `timer`, `health`, `lootdropper`, `combat`, `inspectable`, `sleeper`, `tradable`, `followable`, `hauntable`.  
**Tags added:** `animal`, `prey`, `rabbit`, `smallcreature`, `canbetrapped`, `cattoy`, `catfood`, `stunnedbybomb`, `cookable`.  
**Tags checked:** `INLIMBO`, `dappereffects`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `sounds` | table (nil) | `nil` | Holds sound paths for scream/hurt events; set by `BecomeRabbit`, `BecomeWinterRabbit`, or `BecomeBeardling`. |
| `task` | task handle (nil) | `nil` | Timer task for delayed seasonal transformation. Cancelled and reassigned during morphs. |
| `has_nightmare_state` | boolean | `true` | Indicates this entity supports transformation to beardling state. Used by shadow_trap interaction. |

## Main functions
### `BecomeRabbit(inst)`
* **Description:** Transforms the rabbit to its normal form. Sets animation build, inventory image, and sound set. Cannot occur if nightmare state is active or dead. Cancels pending transformation tasks.
* **Parameters:** `inst` (Entity) — the rabbit instance.
* **Returns:** Nothing.
* **Error states:** Early return if `IsForcedNightmare(inst)` is true or `inst.components.health:IsDead()` is true.

### `BecomeWinterRabbit(inst)`
* **Description:** Transforms the rabbit to its winter form. Sets animation build, inventory image, and sound set. Cannot occur if nightmare state is active or dead.
* **Parameters:** `inst` (Entity) — the rabbit instance.
* **Returns:** Nothing.
* **Error states:** Early return if `IsForcedNightmare(inst)` is true or `inst.components.health:IsDead()` is true.

### `BecomeBeardling(inst, duration)`
* **Description:** Transforms the rabbit into a beardling (nightmare state) for a specified duration. Sets animation/build to `beard_monster`, sound set, and schedules a timer to revert. Listens for `timerdone`, `enterlimbo`, and `exitlimbo` events.
* **Parameters:**  
  - `inst` (Entity) — the rabbit instance.  
  - `duration` (number or nil) — duration in seconds for nightmare state; nil means do not schedule timer (used during save/load).
* **Returns:** Nothing.
* **Error states:** Early return if `inst.components.health:IsDead()` is true. If a `forcenightmare` timer exists, extends only if new duration is longer.

### `OnForceNightmareState(inst, data)`
* **Description:** Callback for `ms_forcenightmarestate` event. Triggers shadow effects and beardling transformation with the provided duration.
* **Parameters:**  
  - `inst` (Entity) — the rabbit instance.  
  - `data` (table or nil) — event data; expects `data.duration` to be a number.
* **Returns:** Nothing.

### `OnIsWinter(inst, iswinter)`
* **Description:** Listener for world-state changes to `iswinter`. Triggers seasonal transformation (normal ↔ winter) with a small random delay unless forced into nightmare state.
* **Parameters:**  
  - `inst` (Entity) — the rabbit instance.  
  - `iswinter` (boolean) — current winter state of the world.
* **Returns:** Nothing.

### `OnWake(inst)`
* **Description:** Handles rabbit waking from sleep. Re-applies seasonal morph if needed and resumes watching `iswinter` world state.
* **Parameters:** `inst` (Entity) — the rabbit instance.
* **Returns:** Nothing.

### `OnSleep(inst)`
* **Description:** Handles rabbit sleeping. Stops listening for `iswinter` changes and cancels pending transformation tasks.
* **Parameters:** `inst` (Entity) — the rabbit instance.
* **Returns:** Nothing.

### `OnLoad(inst)`
* **Description:** Restores nightmare state timer and transform on load. Pauses/resumes `forcenightmare` timer based on limbo status.
* **Parameters:** `inst` (Entity) — the rabbit instance.
* **Returns:** Nothing.

### `LootSetupFunction(lootdropper)`
* **Description:** Configures loot drop rules based on transformation state and cause of death. Applies beardling loot if forced, otherwise checks if killer was a dapper beardling, else default rabbit loot.
* **Parameters:** `lootdropper` (LootDropper) — the component instance.
* **Returns:** Nothing.

### `CalcSanityAura(inst, observer)`
* **Description:** Computes sanity aura based on whether this rabbit is a beardling or the observer is in dapper insanity mode.
* **Parameters:**  
  - `inst` (Entity) — the rabbit instance.  
  - `observer` (Entity or nil) — the observing entity.
* **Returns:** `-TUNING.SANITYAURA_MED` if beardling or observer is dapper insane, else `0`.

### `GetCookProductFn(inst, cooker, chef)`
* **Description:** Returns product name for cooking: `cookedmonstermeat` if beardling or chef is dapper insane, else `cookedsmallmeat`.
* **Parameters:**  
  - `inst` (Entity) — the rabbit instance.  
  - `cooker` (Entity) — the cooking pot entity.  
  - `chef` (Entity or nil) — the chef entity.
* **Returns:** `"cookedmonstermeat"` or `"cookedsmallmeat"` (string).

### `OnCookedFn(inst, cooker, chef)`
* **Description:** Plays the appropriate hurt sound when cooked based on transformation state or chef type.
* **Parameters:**  
  - `inst` (Entity) — the rabbit instance.  
  - `cooker` (Entity) — the cooking pot entity.  
  - `chef` (Entity or nil) — the chef entity.
* **Returns:** Nothing.

### `OnAttacked(inst, data)`
* **Description:** When attacked, gathers up to five nearby rabbits (tags: must be `rabbit`, must not be `INLIMBO`) and pushes `gohome` event to scatter them.
* **Parameters:**  
  - `inst` (Entity) — the rabbit instance.  
  - `data` (table or nil) — attack event data; ignored if beardling state and event is internally triggered.
* **Returns:** Nothing.

### `DrawImageOverride(inst, canvas, viewer)`
* **Description:** Returns inventory image name `beard_monster` for observers in dapper mode or beardlings, else matches transformation state.
* **Parameters:**  
  - `inst` (Entity) — the rabbit instance.  
  - `canvas` (Entity or nil) — rendering canvas (unused).  
  - `viewer` (Entity or nil) — the observing entity.
* **Returns:** `"beard_monster"` or `"rabbit"` / `"rabbit_winter"` (string).

## Events & listeners
- **Listens to:**  
  - `ms_forcenightmarestate` — triggers beardling transformation via `OnForceNightmareState`.  
  - `attacked` — scatters nearby rabbits via `OnAttacked`.  
  - `timerdone` — triggers seasonal reversion when `forcenightmare` timer completes via `OnTimerDone`.  
  - `enterlimbo` — pauses `forcenightmare` timer via `OnEnterLimbo`.  
  - `exitlimbo` — resumes `forcenightmare` timer via `OnExitLimbo`.  
  - `OnEntityWake` — world-state and morph reapplication.  
  - `OnEntitySleep` — stops world-state watch.  
  - `OnLoad` — restores nightmare state on save load.

- **Pushes:**  
  - `gohome` — pushed to nearby rabbits upon attack (via `OnAttacked`).  
  - `imagechange` — fired internally via `InventoryItem.ChangeImageName`.
