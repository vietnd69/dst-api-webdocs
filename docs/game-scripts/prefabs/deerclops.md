---
id: deerclops
title: Deerclops
description: A large, seasonal boss entity that attacks player structures and becomes aggressive when its structures-destroyed threshold is not met.
tags: [boss, combat, seasonal, ai, structure]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 4be206bc
system_scope: entity
---

# Deerclops

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`deerclops.lua` defines the `Deerclops` and `mutateddeerclops` prefabs—large, aggressive seasonal bosses that target player structures during Winter. The entity tracks `structuresDestroyed` and enters a sated state after destroying `STRUCTURES_PER_HARASS` (5) structures. When sated and not engaged in combat for 120 seconds, it may leave the world. The mutated variant introduces planar damage, frenzy mechanics, and integration with lunar rift systems via `lunarriftmutationsmanager`. It uses a custom stategraph (`SGdeerclops`) and brain (`deerclopsbrain`) for behavior control.

## Usage example
```lua
-- Typical usage is internal to the game; prefabs are created via Prefab() calls.
-- Example of creating a standard Deerclops instance:
local inst = Prefab("deerclops", normalfn, normal_assets, normal_prefabs)

-- Access key properties and methods:
inst.structuresDestroyed = 0
inst.IsSated = IsSated  -- checks if structuresDestroyed >= 5
inst.WantsToLeave = WantsToLeave  -- returns true if sated, idle, and alive > 120s
inst.SwitchToEightFaced()  -- toggles 8-faced rendering (e.g., for lunar effects)
```

## Dependencies & tags
**Components used:**
`locomotor`, `sanityaura`, `burnable`, `health`, `combat`, `explosiveresist`, `lootdropper`, `inspectable`, `drownable`, `knownlocations`, `sleeper`, `freezable`, `timer`, `planarentity`, `planardamage`

**Tags added:**
`epic`, `monster`, `hostile`, `deerclops`, `scarytoprey`, `largecreature`, `lunar_aligned`, `gestaltmutant`, `noepicmusic`, `soulless`

**Static properties used:**
`TUNING.DEERCLOPS_*`, `TUNING.MUTATED_DEERCLOPS_*`, `TUNING.SANITYAURA_*`, `TUNING.ACHIEVEMENT_RADIUS_FOR_GIANT_KILL`, `STRUCTURES_PER_HARASS`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `structuresDestroyed` | number | `0` | Count of player structures destroyed; triggers sated state at `STRUCTURES_PER_HARASS`. |
| `freezepower` | number | `2` (normal), `3` (mutated) | Coldness applied to targets on hit. |
| `ignorebase` | boolean | `false` (normal), `true` (mutated) | When `true`, disables base-targeting logic. |
| `haslaserbeam`, `hasiceaura`, `hasknockback`, `hasicelance`, `hasfrenzy` | boolean | `false`/`true` (variant-specific) | Feature flags for mutated abilities. |
| `_temp8faced` | boolean | `nil` | Internal flag indicating temporary 8-faced state. |
| `frenzied`, `frenzy_starttime`, `frenzy_starthp` | boolean/number | `nil` | State variables for frenzy tracking in mutated variant. |
| `yule` | boolean | `nil` | Set `true` when loaded during Winter's Feast event. |

## Main functions
### `IsSated(inst)`
* **Description:** Returns `true` if the Deerclops has destroyed `STRUCTURES_PER_HARASS` (5) structures and is considered sated.
* **Parameters:** `inst` (Entity) — The Deerclops instance.
* **Returns:** `boolean`

### `WantsToLeave(inst)`
* **Description:** Determines if the Deerclops should leave the world (e.g., after Winter ends or when sated and idle). Checks season settings, combat status, sated status, and alive time.
* **Parameters:** `inst` (Entity) — The Deerclops instance.
* **Returns:** `boolean`

### `CalcSanityAura(inst)`
* **Description:** Dynamic sanity aura function: returns `-TUNING.SANITYAURA_HUGE` if targeting a player, otherwise `-TUNING.SANITYAURA_LARGE`.
* **Parameters:** `inst` (Entity) — The Deerclops instance.
* **Returns:** `number` — Sanity aura radius magnitude (negative = draining).

### `RetargetFn(inst)`
* **Description:** AI retargeting function: searches for valid combat targets within `TARGET_DIST` (`16`) units, prioritizing those targeting the Deerclops or nearby.
* **Parameters:** `inst` (Entity) — The Deerclops instance.
* **Returns:** Entity or `nil`.

### `FindBaseToAttack(inst, target)`
* **Description:** Scans for the closest player structure within `40` units and remembers its position. Updates head animation to show aggression.
* **Parameters:** `inst` (Entity), `target` (Entity) — The attacking player.
* **Returns:** `nil`.

### `AfterWorking(inst, data)`
* **Description:** Callback after destroying a structure; increments `structuresDestroyed`. Sates entity and resets head animation when `STRUCTURES_PER_HARASS` is reached.
* **Parameters:** `inst` (Entity), `data` (table) — Contains `target` (destroyed structure).
* **Returns:** `nil`.

### `OnHitOther(inst, data)`
* **Description:** On successful hit: applies coldness, cools target temperature, and spawns shatter FX. Works with `freezable` and `temperature` components.
* **Parameters:** `inst` (Entity), `data` (table) — Contains `target` (hit entity).
* **Returns:** `nil`.

### `Mutated_OnIgnite(inst, source, doer)`
* **Description:** Mutated-specific effect: spawns `deerclops_spikefire_fx` when ignited under specific conditions.
* **Parameters:** `inst` (Entity), `source` (any), `doer` (Entity) — Ignition source.
* **Returns:** `nil`.

### `Mutated_OnExtinguish(inst)`
* **Description:** Cleanup when fire is extinguished: removes spikefire FX and cancels stagger task.
* **Parameters:** `inst` (Entity).
* **Returns:** `nil`.

### `Mutated_ShouldStayFrenzied(inst)`
* **Description:** Determines if mutated Deerclops remains in frenzy: ends if minimum time elapsed and enough HP damage taken.
* **Parameters:** `inst` (Entity).
* **Returns:** `boolean`.

## Events & listeners
- **Listens to:**  
  `working` → `AfterWorking`  
  `entitysleep` → `OnEntitySleep`  
  `attacked` → `OnAttacked`  
  `onhitother` → `OnHitOther`  
  `death` → `OnDead`, `Mutated_OnDead`  
  `onremove` → `OnRemove`  
  `newcombattarget` → `OnNewTarget`  
  `droppedtarget` (mutated only) → `Mutated_OnDroppedTarget`  
  `newstate` (Yule mode only) → `YuleOnNewState`  
  `temp8faceddirty` (mutated client only) → `Mutated_OnTemp8Faced`

- **Pushes:**  
  `hasslerremoved`, `hasslerkilled`, `storehassler` (via `TheWorld:PushEvent`)  
  `triggeredevent` with name `"gestaltmutant"` (mutated client)  

- **Watched world states:**  
  `stopwinter` → `OnStopWinter`
