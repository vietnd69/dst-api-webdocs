---
id: weapon
title: Weapon
description: Provides combat damage and attack logic for weapon entities, including projectile handling, durability, and electric damage multipliers.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: combat
source_hash: bbef9ac9
---

# Weapon

## Overview
The Weapon component enables entities (typically held items) to perform attacks by dealing damage, supporting both melee and ranged combat. It manages properties such as damage output, attack range, projectile spawning, and durability consumption. It also integrates with the durability and damage type bonus systems, and supports electric and wet-environment-specific damage modifications. When attached to an entity, it automatically adds the `"weapon"` tag.

## Dependencies & Tags
- Adds the `"weapon"` tag to the entity upon construction.
- May interact with the following components if present on the same or related entities:
  - `finiteuses`: To reduce item durability on attack.
  - `damagetypebonus`: To apply bonus multipliers based on target type.
  - `efficientuser`: To apply efficiency multipliers to durability loss.
  - `inventoryitem_replica`: To sync attack range to the client.
- Requires `SpDamageUtil` and `SourceModifierList` utilities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `damage` | `number` | `10` | Base damage dealt per attack. Can be a function or numeric value. |
| `attackrange` | `number?` | `nil` | Max distance at which the weapon can initiate an attack. |
| `hitrange` | `number?` | `nil` | Max distance at which a hit is registered (defaults to `attackrange` if not set). |
| `onattack` | `function?` | `nil` | Optional callback function `(inst, attacker, target)` triggered on successful attack. |
| `onprojectilelaunch` | `function?` | `nil` | Optional callback before projectile spawn. |
| `onprojectilelaunched` | `function?` | `nil` | Optional callback after projectile spawn with the projectile instance. |
| `projectile` | `string?` | `nil` | Prefab name of the projectile to spawn for ranged attacks. |
| `stimuli` | `string?` | `nil` | stimuli type (e.g., `"electric"`); used by `SpDamageUtil`. |
| `attackwearmultipliers` | `SourceModifierList` | — | Modifier list for computing per-attack durability loss. |
| `attackwear` | `number?` | `1` (implicit) | Base wear multiplier applied to durability loss. |
| `electric_damage_mult` | `number?` | `nil` | Multiplier for electric damage when stimuli is `"electric"`. |
| `electric_wet_damage_mult` | `number?` | `nil` | Extra multiplier for electric damage in wet conditions. |
| `projectile_offset` | `Vector3?` | `nil` | Offset to apply to projectile spawn position relative to attacker. |
| `tough` | `boolean?` | `nil` | Flag indicating if the weapon can deal damage to "tough" targets (e.g., bosses). |

## Main Functions

### `SetDamage(dmg)`
* **Description:** Sets the weapon’s base damage value. Accepts either a number or a function returning a number.
* **Parameters:**
  - `dmg`: `number` or `function(self, attacker, target): number`

### `SetRange(attack, hit)`
* **Description:** Configures the weapon’s attack and hit ranges. If `hit` is omitted, `hitrange` defaults to `attackrange`.
* **Parameters:**
  - `attack`: `number` — Max range to perform an attack.
  - `hit`: `number?` — Max range to register a hit; defaults to `attack`.

### `SetOnAttack(fn)`
* **Description:** Registers a function to be invoked after a successful attack.
* **Parameters:**
  - `fn`: `function(inst, attacker, target)` — Callback to run on attack.

### `SetOnProjectileLaunch(fn)`
* **Description:** Registers a callback invoked just before projectile spawning.
* **Parameters:**
  - `fn`: `function(inst, attacker, target)` — Callback before spawn.

### `SetOnProjectileLaunched(fn)`
* **Description:** Registers a callback invoked after projectile spawning.
* **Parameters:**
  - `fn`: `function(inst, attacker, target, projectile)` — Callback after spawn, with projectile instance.

### `SetProjectile(projectile)`
* **Description:** Sets the projectile prefab name for ranged attacks.
* **Parameters:**
  - `projectile`: `string` — Prefab name to spawn (e.g., `"arrow"`).

### `SetProjectileOffset(offset)`
* **Description:** Sets the spawn offset for projectiles relative to the attacker’s position.
* **Parameters:**
  - `offset`: `Vector3` — Offset vector.

### `SetElectric(damage_mult, wet_damage_mult)`
* **Description:** Configures electric damage behavior by setting stimuli type and multipliers.
* **Parameters:**
  - `damage_mult`: `number` — Base multiplier for electric damage.
  - `wet_damage_mult`: `number` — Additional multiplier applied when target is wet.

### `SetOverrideStimuliFn(fn)`
* **Description:** Allows overriding how stimuli type is determined (e.g., conditional logic).
* **Parameters:**
  - `fn`: `function` — Custom function to determine stimuli (currently unused but reserved for future use).

### `CanRangedAttack()`
* **Description:** Returns `true` if the weapon supports ranged attacks (i.e., has a projectile defined).
* **Returns:** `boolean`

### `GetDamage(attacker, target)`
* **Description:** Computes the final damage and special damage (e.g., electric) for the given target, applying bonuses and multipliers.
* **Parameters:**
  - `attacker`: `Entity` — Attacking entity (used to evaluate dynamic damage functions).
  - `target`: `Entity` — Target entity (used to apply damage-type bonuses).
* **Returns:** `number, number` — `(damage, special_damage)`

### `OnAttack(attacker, target, projectile)`
* **Description:** Handles post-attack logic, including durability reduction if applicable. Skips durability loss if the attack is bounced or ignores durability.
* **Parameters:**
  - `attacker`: `Entity`
  - `target`: `Entity`
  - `projectile`: `Entity?` — Projectile used, if any.

### `LaunchProjectile(attacker, target)`
* **Description:** Spawns, positions, and launches a projectile toward the target.
* **Parameters:**
  - `attacker`: `Entity`
  - `target`: `Entity`

### `EnableToughFight(tough)`
* **Description:** Enables or disables the ability to deal damage to "tough" targets.
* **Parameters:**
  - `tough`: `boolean?` — Defaults to `true` if `tough ~= false`.

### `CanDoToughFight()`
* **Description:** Returns `true` if the weapon can damage tough targets.
* **Returns:** `boolean`

## Events & Listeners
- **Lists to:** No events are registered via `inst:ListenForEvent`.
- **Triggers:** No events are pushed via `inst:PushEvent`.

### `onattackrange` (setter hook)
- **Triggered when:** `attackrange` property is assigned.
- **Action:** Updates the replica’s `inventoryitem` attack range, or resets to `-1` on removal. Used for client-server syncing.