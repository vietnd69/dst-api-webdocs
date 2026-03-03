---
id: weapon
title: Weapon
description: Manages weapon properties, attack behavior, and ranged projectile launch logic for combat entities.
tags: [combat, projectile, inventory]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: bbef9ac9
system_scope: combat
---
# Weapon

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Weapon` component defines and manages the combat characteristics of an item or entity, including damage, attack range, and projectile-based ranged attacks. It integrates with components like `finiteuses` (durability), `damagetypebonus` (target-based multipliers), and `efficientuser` (usage efficiency), and coordinates with `projectile` and `complexprojectile` to spawn and launch projectiles. The component automatically adds the `"weapon"` tag to its entity and synchronizes attack range changes to the `inventoryitem_replica` for networked clients.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("weapon")
inst.components.weapon:SetDamage(15)
inst.components.weapon:SetRange(2.5, 1.5)
inst.components.weapon:SetOnAttack(function(wpn, attacker, target) 
    print(attacker:GetName(), "attacked with", wpn.prefab)
end)
```

## Dependencies & tags
**Components used:** `finiteuses`, `damagetypebonus`, `efficientuser`, `projectile`, `complexprojectile`, `inventoryitem` (accessed via `inst.replica.inventoryitem`)
**Tags:** Adds `"weapon"` to the owning entity; removes `"weapon"` on component removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `damage` | number | `10` | Base damage value (may be overridden via `FunctionOrValue`). |
| `attackrange` | number or `nil` | `nil` | Maximum distance at which the weapon can initiate an attack. |
| `hitrange` | number or `nil` | `attackrange` (if set) | Maximum distance at which a target can be hit; defaults to `attackrange`. |
| `onattack` | function or `nil` | `nil` | Callback executed when the weapon is used in attack. |
| `onprojectilelaunch` | function or `nil` | `nil` | Callback fired *before* projectile spawn/launch. |
| `onprojectilelaunched` | function or `nil` | `nil` | Callback fired *after* projectile spawn/launch. |
| `projectile` | string or `nil` | `nil` | Prefab name of the projectile to spawn for ranged attacks. |
| `projectile_offset` | Vector3 or `nil` | `nil` | Offset from attacker position at which projectile is spawned (radians-aware). |
| `stimuli` | string or `nil` | `nil` | Stimuli type (e.g., `"electric"`) used for damage context. |
| `electric_damage_mult` | number or `nil` | `nil` | Multiplier applied to electric damage. |
| `electric_wet_damage_mult` | number or `nil` | `nil` | Multiplier applied to electric damage when target is wet. |
| `attackwear` | number or `nil` | `1` | Wear multiplier used per attack. |
| `tough` | boolean | `false` | Indicates if the weapon can participate in "tough" fights (e.g., against bosses). |

## Main functions
### `SetDamage(dmg)`
* **Description:** Sets the base damage value for this weapon.
* **Parameters:** `dmg` (number) — the new damage value.
* **Returns:** Nothing.

### `SetRange(attack, hit)`
* **Description:** Configures the attack and hit ranges. If `hit` is omitted, it defaults to `attack`.
* **Parameters:**  
  - `attack` (number) — the attack range.  
  - `hit` (number, optional) — the hit range; defaults to `attack`.
* **Returns:** Nothing.

### `SetOnAttack(fn)`
* **Description:** Sets the callback invoked when the weapon performs an attack.
* **Parameters:** `fn` (function) — signature `(weapon_entity, attacker_entity, target_entity)`.
* **Returns:** Nothing.

### `SetOnProjectileLaunch(fn)`
* **Description:** Sets a callback invoked *before* a projectile is spawned and launched.
* **Parameters:** `fn` (function) — signature `(weapon_entity, attacker_entity, target_entity)`.
* **Returns:** Nothing.

### `SetOnProjectileLaunched(fn)`
* **Description:** Sets a callback invoked *after* a projectile is spawned and launched.
* **Parameters:** `fn` (function) — signature `(weapon_entity, attacker_entity, target_entity, projectile_entity)`.
* **Returns:** Nothing.

### `SetProjectile(projectile)`
* **Description:** Specifies the projectile prefab to spawn for ranged attacks.
* **Parameters:** `projectile` (string) — prefab name of the projectile.
* **Returns:** Nothing.

### `SetProjectileOffset(offset)`
* **Description:** Defines the local offset from the attacker’s position where the projectile is spawned.
* **Parameters:** `offset` (Vector3 or `nil`) — spatial offset in world coordinates.
* **Returns:** Nothing.

### `SetElectric(damage_mult, wet_damage_mult)`
* **Description:** Enables electric stimuli and sets multipliers for electric damage under dry/wet conditions.
* **Parameters:**  
  - `damage_mult` (number) — multiplier applied to electric damage.  
  - `wet_damage_mult` (number) — additional multiplier when the target is wet.
* **Returns:** Nothing.

### `CanRangedAttack()`
* **Description:** Determines if the weapon supports ranged attacks (i.e., has a projectile defined).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `self.projectile ~= nil`, otherwise `false`.

### `GetDamage(attacker, target)`
* **Description:** Calculates total damage (primary + special damage) for a given target, applying bonuses (e.g., tag-based multipliers).
* **Parameters:**  
  - `attacker` (entity or `nil`) — the attacking entity.  
  - `target` (entity or `nil`) — the target entity.
* **Returns:**  
  - `dmg` (number) — primary damage after applying bonuses.  
  - `spdmg` (table) — special damage table, scaled by the same bonus multiplier.
* **Error states:** Returns `nil` values if `self.damage` is `nil` or invalid.

### `OnAttack(attacker, target, projectile)`
* **Description:** Executes the attack callback, handles durability consumption (via `finiteuses`), and respects efficiency multipliers and bounce immunity.
* **Parameters:**  
  - `attacker` (entity or `nil`) — the attacking entity.  
  - `target` (entity or `nil`) — the target entity.  
  - `projectile` (entity or `nil`) — projectile used in attack (if any).
* **Returns:** Nothing.
* **Error states:** Skips durability loss if:  
  - `finiteuses` is absent,  
  - `IgnoresCombatDurabilityLoss()` returns `true`, or  
  - projectile exists and `IsBounced()` returns `true`.

### `LaunchProjectile(attacker, target)`
* **Description:** Spawns and launches a projectile if one is configured. Supports both `projectile` and `complexprojectile` types.
* **Parameters:**  
  - `attacker` (entity) — the entity performing the attack.  
  - `target` (entity) — the intended target.
* **Returns:** Nothing.

### `EnableToughFight(tough)`
* **Description:** Enables or disables "tough" fight capability (e.g., for boss attacks).
* **Parameters:** `tough` (boolean) — if `true`, enables tough mode.
* **Returns:** Nothing.

### `CanDoToughFight()`
* **Description:** Checks if the weapon is enabled for tough fights.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `self.tough == true`, otherwise `false`.

## Events & listeners
- **Listens to:** None explicitly (uses `inst:PushEvent` and callbacks, not `ListenForEvent`).
- **Pushes:** `onthrown` — fired on projectile launch via `projectile:Throw`; `hostileprojectile` — pushed on target when projectile is thrown. (Note: These events are triggered in the `projectile` component, not directly in `weapon`, but the `weapon` component orchestrates them.)
