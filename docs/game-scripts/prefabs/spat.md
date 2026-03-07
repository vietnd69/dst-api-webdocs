---
id: spat
title: Spat
description: A large creature component that manages AI behavior, combat, projectile attacks with sticky phlegm, periodic poop spawning, and temporary hiding mechanics via prop simulation.
tags: [combat, ai, boss, locomotion, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 29ef2c2c
system_scope: entity
---

# Spat

> Based on game build **7140014** | Last updated: 2026-03-07

## Overview
The `spat` prefab defines a large, hostile animal entity in DST with sophisticated behavior: it chases and attacks players using both melee strikes and sticky phlegm projectiles that pin targets. It periodically spawns poop, hides when startled (using a koalefant corpse as a visual prop), and resumes activity upon player proximity. The component integrates tightly with `combat`, `locomotor`, `sleeper`, `prophider`, `periodicspawner`, `eater`, and `inventory` systems to deliver its full behavioral suite.

## Usage example
While not a generic utility component, the `spat` prefab can be instantiated directly via `SpawnPrefab("spat")`. Its behavior and configuration are fully defined in its constructor (`fn`), and external code typically interacts with it through its components:

```lua
-- Example of spawning and briefly inspecting a Spat
local spat = SpawnPrefab("spat")
if spat and spat:IsValid() then
    print("Spat health:", spat.components.health.currenthealth)
    print("Equipped melee weapon damage:", spat.weaponitems.meleeweapon.components.weapon.damage)
end
```

## Dependencies & tags
**Components used:** `combat`, `health`, `inventory`, `lootdropper`, `inspectable`, `periodicspawner`, `locomotor`, `sleeper`, `prophider`, `eater`, `complexprojectile`, `pinnable`, `weapon`, `inventoryitem`, `equippable`, `hauntable`, `burnable`, `freezable`.

**Tags:** `spat`, `animal`, `largecreature`, `projectile`, `complexprojectile`, `snotbomb`, `meleeweapon`, `nosteal`.

## Properties
No public properties are initialized directly in the constructor beyond those handled by attached components. Non-networked `weaponitems` table is populated internally.

## Main functions
### `Retarget(inst)`
*   **Description:** Finds a new valid combat target within range (`TUNING.SPAT_TARGET_DIST`) that satisfies `combat:CanTarget`. Returns `nil` if none found or if the Spat is in Limbo.
*   **Parameters:** `inst` (Entity) — the Spat instance.
*   **Returns:** `Entity` or `nil`.
*   **Error states:** Returns `nil` if no eligible targets exist or if `inst:IsInLimbo()` is true.

### `KeepTarget(inst, target)`
*   **Description:** Determines if the current target remains valid based on proximity (`TUNING.SPAT_CHASE_DIST`). Used as the keep-target function in combat.
*   **Parameters:** `inst` (Entity), `target` (Entity).
*   **Returns:** `boolean` — `true` if target is near; otherwise `false`.

### `EquipWeapons(inst)`
*   **Description:** Creates and equips two non-persistent weapons: a snotbomb projectile weapon (phlegm) and a melee weapon. Weapons are attached to the Spat's inventory and removed when dropped.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.
*   **Error states:** Returns early if `inst.components.inventory` is missing or hands are already occupied.

### `OnAttacked(inst, data)`
*   **Description:** Reacts when the Spat is attacked: switches target to the attacker unless the current target is already stuck with phlegm (in which case it stays on that target).
*   **Parameters:** `inst` (Entity), `data` (table) — event data containing `attacker`.
*   **Returns:** Nothing.

### `CustomOnHaunt(inst)`
*   **Description:** Called during Haunt panic events. Immediately spawns one poop before returning control.
*   **Parameters:** `inst` (Entity).
*   **Returns:** `true`.

### `OnForceSleep(inst)`
*   **Description:** Adds a fixed amount of sleepiness to trigger sleep state after being pan-fluted.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `doprojectilehit(inst, attacker, other)`
*   **Description:** Core logic executed when a phlegm projectile hits. Plays hit sound, spawns FX, performs attack damage (if `attacker` exists), and attempts to pin the hit entity.
*   **Parameters:** `inst` (Entity — the projectile), `attacker` (Entity), `other` (Entity — actual hit target).
*   **Returns:** `other` or `nil` (the entity that was stuck/pinned).
*   **Error states:** Skips damage/pinning if `attacker` or `other` is invalid, or if the splash radius is exceeded.

### `OnProjectileHit(inst, attacker, other)`
*   **Description:** Projectile callback that delegates to `doprojectilehit`, then destroys the projectile entity.
*   **Parameters:** `inst` (Entity), `attacker` (Entity), `other` (Entity).
*   **Returns:** Nothing.

### `oncollide(inst, other)`
*   **Description:** Physics collision callback used to break stealth/wall-hiding; triggers damage and pinning on colliding entities.
*   **Parameters:** `inst` (Entity — the projectile), `other` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `attacked` — triggers target re-evaluation; `spawnedforhunt` — handles special initialization for hunt scenarios (e.g., prop hiding or forced sleep).
- **Pushes:** None (only responds to events; the Spat entity itself may push events via child components like `pinnable:pinned`, but not directly from this script).