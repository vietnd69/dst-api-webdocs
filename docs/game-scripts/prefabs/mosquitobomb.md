---
id: mosquitobomb
title: Mosquitobomb
description: A throwable weapon that explodes on impact to spawn temporary mosquito followers and deal area damage to enemies.
tags: [combat, throwable, pet, weapon, aoedamage]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 234437cb
system_scope: combat
---

# Mosquitobomb

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mosquitobomb` prefab represents a throwable item used to launch a burst of mosquitoes upon detonation. It is equipped as a weapon and thrown via projectile mechanics. When it hits a target or terrain, it deals AoE damage in a small radius and spawns several mosquito followers (up to `TUNING.MOSQUITOBOMB_MOSQUITOS`, increased by a skill), each assigned to attack nearby valid targets or follow the thrower. The prefab integrates with multiple components: `reticule` for targeting, `complexprojectile` for flight physics, `weapon` for damage handling, and `equippable` for visual and logic on equip/unequip. It is not persistent (`persists = false`) and self-destructs after animation.

## Usage example
```lua
-- Example of spawning and throwing a mosquitobomb (typically handled by player input)
local bomb = SpawnPrefab("mosquitobomb")
player.components.inventory:PushItem(bomb)

-- When thrown:
bomb.components.complexprojectile:Launch(Vector3(10, 0, 0), player)
-- On hit, the bomb triggers OnHit, spawns mosquitos, deals damage, and destroys itself.
```

## Dependencies & tags
**Components used:** `reticule`, `complexprojectile`, `weapon`, `equippable`, `inspectable`, `inventoryitem`, `locomotor`, `stackable`, `soundemitter`, `animstate`, `transform`, `network`.

**Tags added:** `weapon`, `projectile`, `complexprojectile`, `NOCLICK` (temporary, after throw).

**Target filtering tags used (internal):**
- `TARGET_CANT_TAGS`: `"INLIMBO"`, `"invisible"`, `"notarget"`, `"noattack"`, `"playerghost"`, `"mosquito"`
- `TARGET_ONEOF_TAGS`: `"character"`, `"animal"`, `"monster"`
- `IMPACT_DAMAGE_MUST_TAGS`: `"_combat"`, `"_health"`
- `IMPACT_DAMAGE_CANT_TAGS`: `"INLIMBO"`, `"flight"`, `"invisible"`, `"notarget"`, `"noattack"`, `"mosquito"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_weapondamage` | number | `TUNING.BOMB_MOSQUITO_DAMAGE` | Damage value displayed in scrapbook. |
| `SpawnMosquitos` | function | `nil` | Public method reference to `SpawnMosquitos(inst, attacker)`. |
| `DoImpactDamage` | function | `nil` | Public method reference to `DoImpactDamage(inst, attacker, pvpattacker)`. |
| `_funnyidletask`, `_killsoundtask` | Task | `nil` | Internal tasks for idle sound loop management. |
| `persists` | boolean | `false` | Prevents the bomb from saving in world saves (it's disposable). |
| `IS_ACTIVE` | boolean | `false` | Not used directly in this file, inherited from standard prefab structure. |

## Main functions
### `SpawnMosquitos(inst, attacker)`
* **Description:** Spawns 6–9 mosquitos (default or skill-modified) around the bomb's location and assigns each a target or leader. Each mosquito is leashed to the attacker if provided.
* **Parameters:** 
  - `attacker` (entity or `nil`) – the entity that threw the bomb; used as leader/follower target. May be `nil`.
* **Returns:** Nothing.
* **Error states:** Safely skips spawning if `SpawnPrefab("mosquito")` returns `nil`. Does not fail if attacker lacks `skilltreeupdater` or skill isn't activated.

### `DoImpactDamage(inst, attacker, pvpattacker)`
* **Description:** Deals damage to all valid entities in `TUNING.BOMB_MOSQUITO_RANGE` radius. Validates that targets are valid, not dead, and not PvP-immune unless attacker is player vs player.
* **Parameters:** 
  - `attacker` (entity or `nil`) – the thrower, used to suggest new targets after damage.
  - `pvpattacker` (entity or `nil`) – player entity for PvP context; used to skip PvP immunity for non-player targets.
* **Returns:** Nothing.
* **Error states:** Does nothing if entity is invalid, in limbo, or already dead. The `GetAttacked` callback may remove the combat component mid-loop, which is handled gracefully.

### `ReticuleTargetFn()`
* **Description:** Computes a valid ground target position for aim assist, scanning from 6.5 to 3.5 units in front of the player to find a passable, unblocked point.
* **Parameters:** None.
* **Returns:** `Vector3` – world position where the bomb should land.
* **Error states:** Defaults to origin `Vector3(0,0,0)` if no valid point found.

### `OnThrown(inst, attacker)`
* **Description:** Called on launch. Prepares the bomb for flight: sets physics, starts spinning animation, begins looping sound, and marks as non-interactive.
* **Parameters:** 
  - `attacker` (entity) – currently unused in this function (passed to hit handlers later).
* **Returns:** Nothing.

### `OnHit(inst, attacker, target)`
* **Description:** Called on impact. Triggers explosion sound, executes impact damage, spawns mosquitos, plays used animation, and schedules removal after animation completes.
* **Parameters:** 
  - `attacker` (entity) – thrower entity.
  - `target` (entity) – the object hit (e.g., ground or enemy); may be `nil`.
* **Returns:** Nothing.
* **Error states:** Immediately registers `animover` callback to `Remove` the entity—safe idempotent cleanup.

### `OnEquip(inst, owner)`
* **Description:** Handles visual changes when equipped: shows carry arm animation, hides normal arm, and overrides sprite symbol with "swap_mosquitobomb".
* **Parameters:** 
  - `owner` (entity) – the entity equipping the item.
* **Returns:** Nothing.

### `OnUnequip(inst, owner)`
* **Description:** Reverses equip visual changes: hides carry arm, shows normal arm.
* **Parameters:** 
  - `owner` (entity) – the entity unequipping the item.
* **Returns:** Nothing.

### `PlayFunnyIdle(inst)`
* **Description:** Starts and loops idle animations and sound. Randomly chooses one or two idle loops, and schedules the next idle cycle.
* **Parameters:** 
  - `inst` (entity) – the mosquitobomb instance.
* **Returns:** Nothing.
* **Error states:** Self-cancels if sleep/wake events happen during task execution (handled by `OnEntitySleep`/`OnEntityWake`).

### `KillIdleSound(inst)`
* **Description:** Stops the current idle loop sound.
* **Parameters:** 
  - `inst` (entity) – the mosquitobomb instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  - `"exitlimbo"` → `OnEntityWake` – resumes idle animation after exiting limbo.
  - `"enterlimbo"` → `OnEntitySleep` – cancels idle tasks on entering limbo.
  - `"animover"` → `inst.Remove` – cleanup trigger on projectile animation finish.
- **Pushes:** None directly (uses external component events like `animover`, `leaderchanged`, etc., internally but does not fire custom events).