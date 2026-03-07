---
id: minotaur
title: Minotaur
description: The Minotaur is a large boss entity that patrols a predefined area, enters combat when threatened, and periodically phases into a weakened state to spawn environmental hazards and shadow tentacles.
tags: [combat, boss, ai, environment, phase]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7489741f
system_scope: entity
---

# Minotaur

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `minotaur` prefab implements a large, AI-driven boss entity used in the Ruins dungeon. It uses a hybrid StateGraph and Brain system to manage behavior phases, retargeting, and sleep/wake cycles. Key responsibilities include:
- Managing combat with `combat`, `health`, and `locomotor` components.
- Executing area-based attacks using `groundpounder`.
- Phasing into a weakened state at `health < 60%` to trigger environmental effects.
- Dropping loot from a predefined table when defeated.

The entity includes supporting prefabs for chest spawners (`minotaurchestspawner`) and blood effects with tentacle spawns (`minotaur_blood_big`), which integrate via callbacks like `startobstacledrop` and `SpawnTentacle`.

## Usage example
```lua
-- Typical usage is internal to the game; spawning is done via worldgen/tasksets.
-- Example modder hook into Minotaur phase transition:
local function on_minotaur_phase_change(inst, data)
    if inst.atphase2 then
        print("Minotaur entered Phase 2 (weakened)!")
    end
end

TheMod:WatchEvent("attacked", on_minotaur_phase_change, "minotaur")
```

## Dependencies & tags
**Components used:**  
- `locomotor`
- `drownable`
- `sleeper`
- `combat`
- `groundpounder`
- `health`
- `lootdropper`
- `timer`
- `inspectable`
- `knownlocations`
- `maprevealable`

**Tags added:** `cavedweller`, `monster`, `hostile`, `minotaur`, `epic`, `shadow_aligned` (added conditionally on phase transition).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PHASE1` | number | `0.6` | Health threshold (60%) at which the Minotaur enters its weakened phase. |
| `atphase2` | boolean | `false` | State flag indicating whether the Minotaur has transitioned to Phase 2. |
| `tentacletask` | task reference | `nil` | Periodic task ID for spawning tentacle/drop FX during Phase 2. |
| `spawnlocation` | Vector3 or `nil` | `nil` | Coordinates remembered at spawn time; used for obstacle drop area. |
| `recentlycharged` | table | `{}` | Tracks recently collided entities to prevent duplicate charge impacts. |
| `maxradius` | number | `1.75` | Maximum physics radius for character passthrough behavior during movement. |

## Main functions
### `LaunchProjectile(inst, targetpos)`
* **Description:** Spawns a `minotaurphlem` projectile and launches it toward `targetpos`. Speed is scaled linearly based on distance to ensure consistent range.
* **Parameters:**  
  - `inst` (entity) – the Minotaur instance.  
  - `targetpos` (Vector3) – the destination point for the projectile.  
* **Returns:** Nothing.

### `OnAttacked(inst, data)`
* **Description:** Handles damage events: triggers Phase 2 transition, sets attack target on the attacker, shares aggro with nearby chess piece entities, and starts the tentacle drop periodic task when entering Phase 2.
* **Parameters:**  
  - `inst` (entity) – the Minotaur instance.  
  - `data` (table or `nil`) – contains `attacker` if applicable.  
* **Returns:** Nothing.  
* **Error states:** No-op if the attacker has tag `chess`.

### `Retarget(inst)`
* **Description:** Called periodically to find a new valid target. Considers `TUNING.MINOTAUR_TARGET_DIST`, filters out own leader, and enforces must/cant/oneof tags.
* **Parameters:** `inst` (entity).  
* **Returns:** `target` (entity or `nil`).

### `ShouldSleep(inst)` / `ShouldWake(inst)`
* **Description:** Used by `sleeper` component to determine sleep state. Checks distance to remembered "home" location (`knownlocations`) and proximity of characters or hazards (burning/frozen).
* **Parameters:** `inst` (entity).  
* **Returns:** `true`/`false`.

### `startobstacledrop(inst)`
* **Description:** Spawns `ruins_cavein_obstacle` prefabs near the Minotaur's `spawnlocation` if within 25 units. Used during Phase 2.
* **Parameters:** `inst` (entity).  
* **Returns:** Nothing.

### `SpawnTentacle(inst, pt)`
* **Description:** Spawns a `bigshadowtentacle` at the given point (or Minotaur's position).
* **Parameters:**  
  - `inst` (entity) – the blood effect or Minotaur instance.  
  - `pt` (Vector3 or `nil`) – spawn point.  
* **Returns:** Nothing.

### `SpawnBigBloodDrop(inst, pt)`
* **Description:** Spawns a `minotaur_blood_big` blood pool if fewer than 5 tentacles are present nearby; rotates to face away from center.
* **Parameters:**  
  - `inst` (entity).  
  - `pt` (Vector3 or `nil`) – base spawn point.  
* **Returns:** Nothing.

### `OnAttacked(inst)` (no data argument, internal hook)
* **Description:** Called once on initialization to prime aggro on spawn (in case an enemy is nearby).
* **Parameters:** `inst` (entity).  
* **Returns:** Nothing.

### `dospawnchest(inst, loading)`
* **Description:** Called after a delay (3 seconds) to spawn the loot chest and populate it using `chest_loot` table. Handles special effects and minimap icon removal if the boss is dead.
* **Parameters:**  
  - `inst` (entity) – the spawner instance.  
  - `loading` (boolean) – whether called during save/restore.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `attacked` – handled by `OnAttacked`.  
  - `death` – handled by `OnDeath`.  
  - `timerdone` – handled by `checkstunend`.  
  - `animover` – used by `minotaur_blood_big` to self-destruct after animation completes.  
- **Pushes:**  
  - `gotnewitem`, `itemget` – via `container` component during chest setup.  
  - `ms_miniquake`, `shake` – via `cause_obstacle_quake` during charge collision.  
  - `collision_stun` – during `jumpland` and `onothercollide`.  
  - `endstun` – during stun recovery (via `checkstunend`).