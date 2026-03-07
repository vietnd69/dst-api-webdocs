---
id: slingshotammo
title: Slingshotammo
description: Defines the behavior and properties of slingshot ammunition types, including projectile logic, hit effects, stacking behavior, and interaction with components like combat, locomotion, and projectile systems.
tags: [combat, projectile, inventory, fx, slingshot]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e33ec55d
system_scope: combat
---

# Slingshotammo

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `slingshotammo.lua` file defines a collection of slingshot ammunition prefabs and their runtime behavior. It implements both inventory items (held in the inventory) and projectile prefabs (fired from the slingshot), with behavior customized by an `ammo_def` table passed into the constructor. This file coordinates complex game mechanics including area-of-effect (AOE) attacks, status effects (e.g., slow, honey, gelblob, horrorfuel), elemental interactions, and lighting overrides. It relies on the `projectile`, `weapon`, `inventoryitem`, `locomotor`, `combat`, `colouradder`, and `updatelooper` components, among others.

## Usage example
```lua
-- Example of retrieving a specific ammo prefab
local ammo_prefabs = require("prefabs/slingshotammo")
-- The ammo_prefabs table contains Prefab objects (e.g., for "slingshotammo_rock", "slingshotammo_slow_proj", etc.)
-- The slingshot component uses this module via Prefab("slingshotammo_rock", ...) internally.
```

## Dependencies & tags
**Components used:** `projectile`, `weapon`, `inventoryitem`, `stackable`, `locomotor`, `combat`, `colouradder`, `freezable`, `burnable`, `edible`, `sleeper`, `planardamage`, `damagetypebonus`, `fuel`, `sleeper`, `updatelooper`, `reloaditem`, `tradable`, `inspectable`, `bait`.  
**Tags:** Adds `projectile`, `slingshotammo`, `reloaditem_ammo`, `molebait` (elemental ammo), `dreadstoneammo`, `recoverableammo`, `extinguisher` (ice), and others conditionally. Uses `INLIMBO`, `notarget`, `noattack`, `flight`, `invisible`, `playerghost`, `companion`, `player`, `wall` for target filtering.

## Properties
No public properties are defined directly on the component or function scope. All configuration is passed via the `ammo_def` table to `projectile_fn` or `inv_fn`. Internal properties on projectiles (e.g., `inst.magicamplified`, `inst._crithit`) are set dynamically at runtime.

## Main functions
### `projectile_fn(ammo_def)`
* **Description:** Creates a projectile prefab instance. This function is invoked once per ammo type to generate the networked projectile entity that is fired. It attaches the `projectile`, `weapon`, `planardamage`, `damagetypebonus`, and `updatelooper` components as needed, sets up visual animations and symbols, and registers hit callbacks (`onprehit`, `onhit`, `onmiss`, `onthrown`).
* **Parameters:** `ammo_def` (table) — A configuration table specifying properties like `name`, `damage`, `symbol`, `onhit`, `onlaunch`, `canmagicamp`, `planar`, `damagetypebonus`, `tags`, etc.
* **Returns:** An entity instance (`inst`) representing the projectile prefab.

### `inv_fn(ammo_def)`
* **Description:** Creates the inventory item prefab for a given ammo type. This is the entity held in inventory, used to load the slingshot. It sets up `inventoryitem`, `stackable`, `edible`, `fuel`, `reloaditem`, `tradable`, `bait`, and `inspectable` components as appropriate.
* **Parameters:** `ammo_def` (table) — Same structure as in `projectile_fn`.
* **Returns:** An entity instance (`inst`) representing the inventory ammo item.

### `DoAOECallback(inst, x, z, radius, cb, attacker, target)`
* **Description:** Helper that performs circular AOE detection and invokes a callback for each valid target within range. It respects PVP rules and tags (`AOE_TARGET_MUST_TAGS`, `AOE_TARGET_CANT_TAGS[_PVP]`), filtering by combat compatibility and ally status.
* **Parameters:**  
  - `inst` (Entity): The projectile entity.  
  - `x, z` (number): Center coordinates of the AOE.  
  - `radius` (number): AOE radius (plus padding internally).  
  - `cb` (function): Callback to invoke per valid target: `cb(inst, attacker, target)`.  
  - `attacker`, `target` (Entity/nil): The firing entity and the primary target.  
* **Returns:** Nothing.

### `OnHit_Slow(inst, attacker, target)`
* **Description:** Applies a movement speed debuff stack to the target. Supports up to `TUNING.SLINGSHOT_AMMO_MOVESPEED_MAX_STACKS` stacks, each lasting `TUNING.SLINGSHOT_AMMO_MOVESPEED_DURATION` seconds. Higher stacks increase penalty multiplicatively (via `TUNING.SLINGSHOT_AMMO_MOVESPEED_MULT`). A visual FX (`slingshotammo_slow_debuff_fx`) tracks the stack count. May apply an `attacked` event. If `magicamplified`, performs AOE via `DoAOECallback`.
* **Parameters:**  
  - `inst` (Entity): The projectile.  
  - `attacker`, `target` (Entity): See above.  
* **Returns:** Nothing.

### `OnHit_Gunpowder(inst, attacker, target)`
* **Description:** Tracks gunpowder dust state on the target (increasing critical strike chance on subsequent hits). If the current hit triggers a critical strike (via `OnPreHit_Gunpowder`), it deals AOE damage (`DoAOEDamage`), spawns an explosion FX, shakes the camera of nearby players, and resets the dust stack. If `magicamplified`, performs AOE as well.
* **Parameters:** As above.
* **Returns:** Nothing.

### `OnHit_Honey(inst, attacker, target)`
* **Description:** Applies a honey trail effect over time. It spawns honey trails (or ocean splashes over water) periodically, reduces movement speed via `locomotor:SetExternalSpeedMultiplier`, and adds/removes the `honey_ammo_afflicted` tag. May fire `start_honey_ammo_afflicted` and `stop_honey_ammo_afflicted` events. Does not trigger aggro unless `no_aggro` returns false.
* **Parameters:** As above.
* **Returns:** Nothing.

### `OnHit_HorrorFuel(inst, attacker, target)`
* **Description:** Applies a horror effect that periodically spawns scary FX (`slingshotammo_horrorfuel_debuff_fx`) for up to 4 concurrent ticks. Spawns flash FX using `StartFlash`. Modifies lighting override via `_horror_UpdateLightOverride`, which listens to sanity changes. If `magicamplified`, performs AOE.
* **Parameters:** As above.
* **Returns:** Nothing.

### `SetChargedMultiplier(inst, mult)`
* **Description:** Modifies weapon damage, projectile speed, and planar damage multiplier based on slingshot charge level (`mult` in `[0,1]`). Also enables tail FX by calling `OnHasTail`.
* **Parameters:** `mult` (number) — Charge ratio (0 = uncharged, 1 = max charge).
* **Returns:** Nothing.

### `SetMagicAmplified(inst)`
* **Description:** Enables `magicamplified` flag for ammo types that support AOE expansion, and enables tail FX.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `StartFlash(inst, target, r, g, b)`
* **Description:** Creates a temporary flash effect on the target’s colour by toggling `colouradder` colour entries over ~4 frames (0.05 intensity steps), then cleans up.
* **Parameters:** `r, g, b` (number) — RGB components for the flash.
* **Returns:** Nothing.

### `no_aggro(attacker, target)`
* **Description:** Utility to determine if the target is currently aggro’d to another entity (not the attacker) within 4 seconds, and the target is still alive. Used to avoid retroactively aggro’ing enemies during utility ammo effects.
* **Parameters:** `attacker`, `target` (Entity/nil).
* **Returns:** `true` if aggro should be skipped (e.g., for distraction or utility effects), otherwise `false`.

## Events & listeners
- **Listens to:**  
  - `ammoloaded`, `ammounloaded`, `onremove` — handled by ammo-specific load/unload callbacks (`onloadammo`, `onunloadammo`).  
  - `on_landed` — used for dreadstone ammo to attempt stacking.  
  - `sanitydelta`, `onremove` — horrorfuelammo listens for player sanity changes to update lighting overrides.  
  - `playeractivated` — horrorfuelammo watches player activation to update sanity listeners.  
  - `hastaildirty` — client-side synchronization of tail FX.  
- **Pushes:**  
  - `attacked` — generic hit event for utility ammo (damage may be `0`).  
  - `start_honey_ammo_afflicted`, `stop_honey_ammo_afflicted` — honey ammo lifecycle events.  
  - `start_gelblob_ammo_afflicted`, `stop_gelblob_ammo_afflicted` — gelblob ammo lifecycle events.  
  - `buff_expired` — via internal task cancellation, though not explicitly named.  
  - `onextinguish`, `burnt`, `onwakeup` — triggered indirectly via `burnable`/`sleeper` callbacks in `OnHit_Ice`.  
  - `stacksizechange` — via `stackable:Put` calls in dreadstone logic.  
  - `droppedtarget` — via `combat:DropTarget` in distraction ammo.
