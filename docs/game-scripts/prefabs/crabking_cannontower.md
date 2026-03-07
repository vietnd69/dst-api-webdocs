---
id: crabking_cannontower
title: Crabking Cannontower
description: A stationary defensive turret belonging to the Crab King that fires mortar projectiles at boats or nearby enemies and reacts to collisions.
tags: [combat, boss, ai, physics, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 94c3c639
system_scope: environment
---

# Crabking Cannontower

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `crabking_cannontower` is a boss-associated environmental prefab functioning as a stationary mortar turret. It is part of the Crab King's defenses and operates autonomously: it scans for boats within range, then targets large creatures or player-associated entities to fire mortar projectiles. It features dynamic health-based damage reduction, reload timing, and visual upgrades based on its red gem count. The component integrates with physics via boat collisions, floating on water, and custom projectile launch logic using the `complexprojectile`, `health`, and `floater` components.

## Usage example
```lua
-- This prefab is instantiated internally by the game and not typically spawned manually by mods.
-- Example of how its core methods are invoked during gameplay:
local tower = SpawnPrefab("crabking_cannontower")
tower.redgemcount = 8  -- Upgrades mortar visual and damage
tower:UpdateMortarArt()
tower:TryShootCannon()  -- Attempt to fire if loaded
```

## Dependencies & tags
**Components used:** `boatphysics`, `combat`, `complexprojectile`, `floater`, `follower`, `health`, `lootdropper`, `inspectable`  
**Tags added:** `cannontower`, `hostile`, `crabking_ally`, `soulless`, `lunar_aligned`, `ignorewalkableplatformdrowning`, `electricdamageimmune`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `redgemcount` | number? | `nil` | Controls mortar projectile visual level, damage scaling, and size (levels: `<=4`, `5–7`, `>=8`). |
| `yellowgemcount` | number? | `nil` | Modifies collision damage multiplier when hit by a boat (`mult = 0.3/0.6/0.8/1.0` based on thresholds). |
| `reloadtask` | Task? | `nil` | Stores the scheduled reload task; canceled when cannon fires or reload completes. |

## Main functions
### `GetShootTargetPosition(target)`
*   **Description:** Generates a randomized position near the target, offset up to 6 units radius, to avoid hitting the exact center and allow for spread.
*   **Parameters:** `target` (Entity) — the entity to target.
*   **Returns:** `Vector3` — target position with randomized lateral offset.
*   **Error states:** None; always returns a valid `Vector3`.

### `LaunchProjectile(target, projectile_name)`
*   **Description:** Spawns and configures a mortarball projectile, calculates launch speed using linear easing based on distance, and sets damage/scaling based on `redgemcount`.
*   **Parameters:**  
    - `target` (Entity) — the entity being targeted.  
    - `projectile_name` (string?) — optional override for projectile prefab (`"mortarball"` by default).  
*   **Returns:** Entity (projectile instance).
*   **Error states:** If `projectile.components.complexprojectile` is missing, it adds the component automatically.

### `TryShootCannon()`
*   **Description:** Evaluates targeting priority: boat first (within `FIND_BOAT_DIST = 18`), then individual creatures or player-allied units (within `FIND_TARGET_DIST = 12`). Fires if a target is found; otherwise, schedules a reload task.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if not loaded (stategraph `empty` tag); triggers reload instead.

### `DoShootCannon(ent)`
*   **Description:** Fires a projectile at `ent`, clears pending reload task, pushes `ck_shootcannon` event, and initiates reload test.
*   **Parameters:** `ent` (Entity) — the targeted entity.
*   **Returns:** Nothing.
*   **Error states:** If called while empty, it still attempts to fire and may launch a misaligned projectile.

### `StartReloadTask(time)`
*   **Description:** Schedules `TryShootCannon` after `time` seconds. Cancels any existing reload task first.
*   **Parameters:** `time` (number) — delay in seconds before reloading/attempting to shoot.
*   **Returns:** Nothing.

### `TestForReload()`
*   **Description:** Checks if the tower is empty (`sg:HasStateTag("empty")`). If so, pushes `ck_loadcannon` event and schedules a reload (6–10 seconds). Otherwise, rechecks after 1 second.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `UpdateMortarArt()`
*   **Description:** Updates visual overrides (mortar build) and anim state when `redgemcount` exceeds thresholds (>4, >7).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Saves current `redgemcount` and `yellowgemcount` to persistence data.
*   **Parameters:**  
    - `inst` (Entity) — the instance being saved.  
    - `data` (table) — the save data table.  
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Restores `redgemcount`/`yellowgemcount` from save data and reapplies visual upgrades.
*   **Parameters:**  
    - `inst` (Entity) — the instance being loaded.  
    - `data` (table?) — the loaded save data (may be `nil`).  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `on_collide` — triggers collision damage via `_OnCollide` handler when colliding with a boat.  
  - `onsink` — triggers floater landing logic via `_OnSink` (if water interacts).  
- **Pushes:**  
  - `ck_shootcannon` — fired after successfully launching a projectile.  
  - `ck_loadcannon` — fired when initiating a reload sequence.