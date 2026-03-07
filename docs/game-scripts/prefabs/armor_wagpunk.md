---
id: armor_wagpunk
title: Armor Wagpunk
description: A wearable armor item that grants increased speed and defense based on target tracking duration, with visual and audio feedback across multiple performance stages.
tags: [combat, armor, inventory, ai, sound]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5c982e5a
system_scope: inventory
---

# Armor Wagpunk

> Based on game build **7140014** | Last updated: 2026-03-04

## Overview
`armor_wagpunk` is a player-wearable armor item that dynamically enhances movement speed and defensive capabilities based on how long the wearer has been tracking a hostile target. It integrates closely with `targettracker` to monitor combat engagement, triggers visual "steam" effects on stage transitions, and plays an ambient sound whose pitch correlates with engagement duration. The component also supports repair logic (via `MakeForgeRepairable`) and skinning. Key interactions include `equippable`, `armor`, `planardefense`, and `inventory` components on the owner entity.

## Usage example
```lua
-- Typically instantiated automatically by the game for the player.
-- To manually equip:
local armor = SpawnPrefab("armorwagpunk")
player.components.inventory:PushItem(armor)
player.components.inventory:Equip(armor)

-- The armor responds to combat events like 'onattackother' and manages
-- its own state via target tracking; no further setup is required.
```

## Dependencies & tags
**Components used:** `equippable`, `armor`, `planardefense`, `inspectable`, `inventoryitem`, `targettracker`, `floater`, `colouraddersync`, `highlightchild`, `freezable`, `health`, `inventory`.  
**Tags added:** `metal`, `hardarmor`, `show_broken_ui`.  
**Tags conditionally managed:** `broken` (added on break, removed on repair).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fx` | entity or `nil` | `nil` | Reference to the attached visual FX entity (`armorwagpunk_fx`), managed during equip/unequip. |
| `_targettask` | task or `nil` | `nil` | Delayed task that updates the armor’s target after an attack. |
| `_potencialtarget` | entity or `nil` | `nil` | Candidate target for future tracking (used in the 2-second delay window). |
| `_spawnsteamfx` | task or `nil` | `nil` | Delayed task used to spawn steam FX effects. |

## Main functions
### `KillTargetTask()`
* **Description:** Cancels any pending target acquisition task and clears `_potencialtarget`.
* **Parameters:** None.
* **Returns:** Nothing.

### `SpawnSteamFX(inst, owner, fx_name)`
* **Description:** Spawns a steam effect (e.g., `"wagpunksteam_armor_up"`) on the owner after a short random delay, unless the armor is dead or frozen.
* **Parameters:**
  * `inst` (entity) — the armor entity instance.
  * `owner` (entity) — the entity wearing the armor; must be valid.
  * `fx_name` (string) — name of the FX prefab to spawn.
* **Returns:** Nothing.
* **Error states:** Returns early if `owner` is `nil` or invalid.

### `SetNewTarget(inst, target, owner)`
* **Description:** Initiates tracking of a new target if valid and not already tracked. Updates walk speed, FX level, and ambient sound. Also propagates target to a hat armor if present and untracked.
* **Parameters:**
  * `inst` (entity) — the armor entity.
  * `target` (entity) — target to track.
  * `owner` (entity) — the armor’s owner.
* **Returns:** Nothing.
* **Error states:** No-op if `target` is dead, invalid, or lacks a `health` component; also returns early if tracking already exists.

### `ResetBuff(inst)`
* **Description:** Resets speed multiplier to base (1.0), kills ambient sound, cancels target tracking tasks, and spawns a “steam down” effect if speed was elevated.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `TimeCheck(inst, targettime, lasttime)`
* **Description:** Updates speed multiplier and FX level based on how long the current target has been tracked (`targettime` in seconds). Triggers steam effects and sound parameter changes when crossing internal stage thresholds (`TUNING.ARMORPUNK_STAGE1`, `STAGE2`, `STAGE3`).
* **Parameters:**
  * `inst` (entity) — the armor entity.
  * `targettime` (number) — current accumulated tracking duration.
  * `lasttime` (number) — previous tracking duration.
* **Returns:** Nothing.
* **Stages:** 
  * Stage 0 (`<= STAGE1`): base speed (stage multiplier).
  * Stage 1 (`STAGE1 <= targettime < STAGE2`): speed multiplier increases, FX level 3.
  * Stage 2 (`STAGE2 <= targettime < STAGE3`): higher speed, FX level 4.
  * Stage 3 (`>= STAGE3`): maximum speed, FX level 5.

### `OnAttack(owner, data)`
* **Description:** Listener for `onattackother`; triggers a 2-second delayed call to `SetNewTarget` on the armor if a valid new target is hit.
* **Parameters:**
  * `owner` (entity) — the entity that performed the attack.
  * `data` (table) — attack event data containing `target`.
* **Returns:** Nothing.
* **Error states:** Ignores attacks against the owner itself.

### `OnEquip(inst, owner)`
* **Description:** Sets up animation overrides, spawns FX entity, and registers combat event listeners (`blocked`, `onattackother`). Also clones target from a head armor if present.
* **Parameters:** 
  * `inst` (entity) — the armor.
  * `owner` (entity) — the player wearing it.
* **Returns:** Nothing.

### `OnUnequip(inst, owner)`
* **Description:** Tears down equipment state: clears overrides, removes FX, cancels tasks, stops target tracking, kills ambient sound, and resets speed multiplier.
* **Parameters:** 
  * `inst` (entity) — the armor.
  * `owner` (entity) — the player.
* **Returns:** Nothing.

### `UnpauseFn(inst)`
* **Description:** Called when the armor’s target tracker resumes after pausing. Syncs `timetracking` time from a hat armor if the hat is tracking a longer duration.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `OnBroken(inst)`
* **Description:** Handles armor breakage: removes `equippable`, changes animation to `"broken"`, sets swap data and inspectable override, adds `broken` tag.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `OnRepaired(inst)`
* **Description:** Restores armor functionality after repair: reinstates `equippable`, resets animation, swap data, and removes `broken` tag and inspectable override.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `blocked` (on owner) — triggers `OnBlocked`, playing an armor impact sound.
  - `onattackother` (on owner) — triggers `OnAttack` to potentially acquire a new target.
  - `wagpunkarmor_leveldirty` (local client only) — updates FX animation bank based on `level` value.
- **Pushes:** None directly; event callbacks interact with owner and other entities.

## FX entity (`armorwagpunk_fx`)
The `armorwagpunk_fx` prefab (`fxfn`) manages a set of 9 follow-frame entities that reflect the armor’s tier visually. It synchronizes colour changes via `colouraddersync` and updates animation banks based on the `level` networked value (`1`–`5`). It attaches to the owner’s `"swap_body"` symbol and is non-persistent (`persists = false`).