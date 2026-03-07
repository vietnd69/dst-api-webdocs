---
id: combat
title: Combat
description: Manages combat logic including targeting, attack readiness, damage calculation, attack execution, and aggro behavior for entities.
tags: [combat, ai, ai-behavior, damage, targeting]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f3f83372
system_scope: combat
---

# Combat

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Combat` is a core entity component responsible for handling all combat-related behaviors for an entity, including targeting, attack readiness, damage calculation, attack execution, and aggro logic. It interfaces with components like `health`, `inventory`, `attackdodger`, `damagereflect`, `damagetyperesist`, `weapon`, `projectile`, and `complexprojectile`. The component manages attack cooldowns, range checks, area-of-effect (AOE) damage, and AI-driven target acquisition via retargeting functions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("combat")
inst.components.combat:SetDefaultDamage(10)
inst.components.combat:SetAttackPeriod(4)
inst.components.combat:SetRetargetFunction(1, function(entity) return entity.components.combat:GetBestTarget() end)
```

## Dependencies & tags
**Components used:**  
`health`, `inventory`, `attackdodger`, `damagereflect`, `damagetyperesist`, `weapon`, `projectile`, `complexprojectile`, `burnable`, `fueled`, `follower`, `leader`, `saddler`, `sleeper`, `talker`, `fueled`, `planarentity`, `electricattacks`, `rider`, `rideable`.  
**Tags:** Checks for `INLIMBO`, `notarget`, `noattack`, `flight`, `invisible`, `playerghost`, `stealth`, `structure`, `hostile`, `alwaysblock`, `burnt`, `extinguisher`, `rangedlighter`, `sharp`, `dull`, `rangedweapon`, `projectile`, `electric`, `player`, `toughfighter`, `tough`, `wet`, `weapon`, `activeprojectile`. Adds no tags itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `nextbattlecrytime` | number | `nil` | Timestamp of next allowed battle cry. |
| `battlecryenabled` | boolean | `true` | Whether the entity can trigger battle cries. |
| `attackrange` | number | `3` | Base attack range used for melee attacks (server-authoritative). |
| `hitrange` | number | `3` | Base hit range used for attack validation. |
| `areahitrange` | number | `nil` | Radius for AOE attack effects. |
| `areahitdamagepercent` | number | `nil` | Multiplier applied to damage in AOE attacks. |
| `areahitdisabled` | boolean | `nil` | If `true`, disables AOE attacks. |
| `defaultdamage` | number | `0` | Base damage value used when no weapon is equipped. |
| `min_attack_period` | number | `4` | Minimum seconds between successive attacks. |
| `laststartattacktime` | number | `0` | Timestamp of the last attack start. |
| `lastwasattackedtime` | number | `0` | Timestamp of last attack against this entity. |
| `target` | Entity | `nil` | Current combat target. |
| `panic_thresh` | number | `nil` | Health fraction below which entity enters panic state. |
| `canattack` | boolean | `true` | Whether the entity is currently allowed to attack. |
| `forcefacing` | boolean | `true` | If `true`, forces entity to face target before attacking. |
| `lasttargetGUID` | string | `nil` | GUID of the most recent target. |
| `blanktask` | Task | `nil` | Task managing the `BlankOutAttacks` timeout. |
| `retargettask` | PeriodicTask | `nil` | Task for scheduled retargeting. |
| `keeptargettimeout` | number | `0` | Countdown for `keeptargetfn` to maintain target. |
| `hiteffectsymbol` | string | `"marker"` | Symbol used for visual hit effects. |
| `externaldamagemultipliers` | SourceModifierList | (constructed) | Multiplier list for outgoing damage. |
| `externaldamagetakenmultipliers` | SourceModifierList | (constructed) | Multiplier list for incoming damage (post-armor). |
| `shouldaggrofn` | function | `nil` | Custom function to determine if entity should aggro a target. |
| `shouldavoidaggro` | table | `nil` | Set of entities to avoid aggro against. |
| `forbiddenaggrotags` | table | `nil` | List of tags that prevent targeting. |
| `targetfn` | function | `nil` | Custom retargeting function. |
| `retargetperiod` | number | `nil` | Interval (in seconds) for retargeting. |
| `keeptargetfn` | function | `nil` | Custom function to validate continued targeting. |
| `redirectdamagefn` | function | `nil` | Function to redirect damage to another entity. |
| `bonusdamagefn` | function | `nil` | Function to add bonus damage to attacks. |
| `customdamagemultfn` | function | `nil` | Custom multiplier function applied to damage. |
| `customspdamagemultfn` | function | `nil` | Custom multiplier function for special damage. |
| `tough` | boolean | `nil` | If `true`, entity requires a `toughfighter` tag or weapon to avoid recoil. |
| `shouldrecoilfn` | function | `nil` | Custom recoil function. |
| `conditionexternaldamagetakenmultipliers` | table | `nil` | List of condition-based damage taken multipliers. |

## Main functions
### `GetAttacked(attacker, damage, weapon, stimuli, spdamage)`
*   **Description:** Processes incoming damage from an attacker. Applies armor, resistances, special damage, damage reflection, planar absorption, and modifies health accordingly. Triggers appropriate events and sound effects.
*   **Parameters:**  
    - `attacker` (Entity) - The entity initiating the attack.  
    - `damage` (number) - Base damage value (positive for damage, zero or negative for blocked/parried attacks).  
    - `weapon` (Entity or `nil`) - Weapon entity used in the attack.  
    - `stimuli` (string or `nil`) - Type of attack stimuli (e.g., `"electric"`).  
    - `spdamage` (table or `nil`) - Special damage table.  
*   **Returns:** `true` if damage was applied (not blocked), `false` otherwise.  
*   **Error states:** Returns `true` immediately if `health` is dead or `damage` is `nil` and `redirected`.

### `DoAttack(target, weapon, projectile, stimuli, instancemult, instrangeoverride, instpos)`
*   **Description:** Executes an attack on a target. Handles range checks, area-of-effect damage, weapon projectile launch, and damage application. Applies reflection and triggers combat events.
*   **Parameters:**  
    - `target` (Entity or `nil`) - Target entity (defaults to `self.target`).  
    - `weapon` (Entity or `nil`) - Weapon entity used (defaults to equipped item in hands).  
    - `projectile` (Entity or `nil`) - Projectiles for hit validation.  
    - `stimuli` (string or `nil`) - Attack stimuli type.  
    - `instancemult` (number or `nil`) - Damage multiplier for this specific attack instance.  
    - `instrangeoverride` (number or `nil`) - Temporary range override.  
    - `instpos` (Vector3 or `nil`) - Temporary attack origin position.  
*   **Returns:** Nothing.

### `CalcDamage(target, weapon, multiplier)`
*   **Description:** Calculates total damage for an attack, applying multipliers, bonuses, special damage, mount/saddle bonuses, and resistance multipliers.
*   **Parameters:**  
    - `target` (Entity) - Target entity.  
    - `weapon` (Entity or `nil`) - Weapon entity used.  
    - `multiplier` (number or `nil`) - Additional multiplier applied to base damage.  
*   **Returns:**  
    - `number` - Total calculated damage.  
    - `table or nil` - Special damage table (if any).  

### `CanAttack(target)`
*   **Description:** Checks if the entity can currently attack the target (respecting cooldown, validity, state tags, and range).
*   **Parameters:** `target` (Entity or `nil`) - Target entity.  
*   **Returns:**  
    - `boolean` - Whether the attack is possible.  
    - `boolean` (optional) - Whether the target is invalid (always `false` if first return is `true`).

### `CanTarget(target)`
*   **Description:** Checks if the target is valid and can be aggroed based on internal aggro rules.
*   **Parameters:** `target` (Entity or `nil`) - Target entity.  
*   **Returns:** `boolean` - Whether the entity can target the passed entity.

### `SetTarget(target)`
*   **Description:** Attempts to set the specified target as current combat target, verifying validity and aggro conditions.
*   **Parameters:** `target` (Entity or `nil`) - Target entity.  
*   **Returns:** Nothing.

### `DropTarget(hasnexttarget)`
*   **Description:** Drops the current target, stops tracking events, clears updates, and fires events.
*   **Parameters:** `hasnexttarget` (boolean) - If `true`, suppresses the `droppedtarget` event.  
*   **Returns:** Nothing.

### `StartAttack()`
*   **Description:** Starts an attack by forcing facing (if enabled) and restarting the attack cooldown timer.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `ResetCooldown()`
*   **Description:** Clears the attack cooldown so the next attack can start immediately.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `RestartCooldown()`
*   **Description:** Starts a new attack cooldown based on `min_attack_period`.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `GetCooldown()`
*   **Description:** Returns the remaining cooldown time in seconds.
*   **Parameters:** None.  
*   **Returns:** `number` - Cooldown time (≥ 0).

### `InCooldown()`
*   **Description:** Checks whether the entity is currently in the attack cooldown period.
*   **Parameters:** None.  
*   **Returns:** `boolean` - `true` if in cooldown, `false` otherwise.

### `SetAttackPeriod(period)`
*   **Description:** Sets the minimum time in seconds required between attacks.
*   **Parameters:** `period` (number) - New attack period in seconds.  
*   **Returns:** Nothing.

### `SetRange(attack, hit)`
*   **Description:** Sets both attack and hit ranges for melee combat.
*   **Parameters:**  
    - `attack` (number) - New attack range.  
    - `hit` (number or `nil`) - New hit range (defaults to `attack` if `nil`).  
*   **Returns:** Nothing.

### `SetDefaultDamage(damage)`
*   **Description:** Sets the default damage value when no weapon is equipped.
*   **Parameters:** `damage` (number) - Default damage amount.  
*   **Returns:** Nothing.

### `SetRetargetFunction(period, fn)`
*   **Description:** Sets a periodic retargeting function and starts/updates the retargeting task.
*   **Parameters:**  
    - `period` (number or `nil`) - Seconds between retarget attempts.  
    - `fn` (function or `nil`) - Function returning `(newtarget, forcechange)`.  
*   **Returns:** Nothing.

### `TryRetarget()`
*   **Description:** Invokes the `targetfn` and attempts to set a new target if valid.
*   **Parameters:** None.  
*   **Returns:** Nothing.

### `ShareTarget(target, range, fn, maxnum, musttags)`
*   **Description:** Finds and notifies nearby entities to also target the same enemy.
*   **Parameters:**  
    - `target` (Entity) - Target to share aggro for.  
    - `range` (number) - Search radius.  
    - `fn` (function or `nil`) - Filter function `(helper, source) => bool`.  
    - `maxnum` (number) - Maximum number of helpers to share with.  
    - `musttags` (table or `nil`) - Tags required for search; defaults to `{ "_combat" }`.  
*   **Returns:** Nothing.

### `BlankOutAttacks(fortime)`
*   **Description:** Disables attack capability for a specified duration.
*   **Parameters:** `fortime` (number) - Duration in seconds.  
*   **Returns:** Nothing.

### `CanHitTarget(target, weapon)`
*   **Description:** Validates whether the entity can hit the target based on proximity, state, and weapon conditions (e.g., extinguish or light logic).
*   **Parameters:**  
    - `target` (Entity) - Target entity.  
    - `weapon` (Entity or `nil`) - Weapon entity.  
*   **Returns:** `boolean` - Whether the target can be hit.

### `DoAreaAttack(target, range, weapon, validfn, stimuli, excludetags, onlyontarget)`
*   **Description:** Performs area-of-effect damage around a target or center point.
*   **Parameters:**  
    - `target` (Entity) - Center of AOE.  
    - `range` (number) - Radius of effect.  
    - `weapon` (Entity or `nil`) - Weapon used.  
    - `validfn` (function or `nil`) - Optional filter `(ent, source) => bool`.  
    - `stimuli` (string or `nil`) - Attack stimuli type.  
    - `excludetags` (table) - Tags to exclude from AOE (e.g., `{ "INLIMBO", "notarget", ... }`).  
    - `onlyontarget` (boolean) - If `true`, only hit the target (not neighbors).  
*   **Returns:** `number` - Number of entities hit.

### `CalcReflectedDamage(targ, dmg, weapon, stimuli, reflect_list, spdmg)`
*   **Description:** Calculates damage reflected from the target (and optionally its mount/saddle) back to the attacker.
*   **Parameters:**  
    - `targ` (Entity) - Target entity.  
    - `dmg` (number) - Base damage dealt.  
    - `weapon` (Entity or `nil`) - Weapon used.  
    - `stimuli` (string or `nil`) - Attack stimuli.  
    - `reflect_list` (table) - List of reflection sources (populated by reference).  
    - `spdmg` (table or `nil`) - Special damage.  
*   **Returns:**  
    - `number` - Total reflected damage.  
    - `table or nil` - Reflected special damage.  

### `GetAttackRange()`
*   **Description:** Calculates the full attack range (base + weapon modifier).
*   **Parameters:** None.  
*   **Returns:** `number` - Total attack range.

### `GetHitRange()`
*   **Description:** Calculates the full hit range (base + weapon modifier).
*   **Parameters:** None.  
*   **Returns:** `number` - Total hit range.

### `IsRecentTarget(target)`
*   **Description:** Checks if the target is the current or most recent target.
*   **Parameters:** `target` (Entity or `nil`) - Entity to check.  
*   **Returns:** `boolean` - Whether the entity is a recent target.

### `SetLastTarget(target)`
*   **Description:** Updates the `lasttargetGUID` and network replica for tracking purposes.
*   **Parameters:** `target` (Entity or `nil`) - Entity to record.  
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"knockback"` - Resets hit recovery delay via `CommonHandlers.ResetHitRecoveryDelay`.  
  - `"enterlimbo"`, `"onremove"` (on target) - Triggers `losttarget`.  
  - `"transfercombattarget"` (on target) - Triggers `transfertargetcallback`.  
  - `"leaderchanged"` (on target) - Triggers `allycheckcallback`.  

- **Pushes:**  
  - `"newcombattarget"`, `"droppedtarget"`, `"losttarget"`, `"giveuptarget"`  
  - `"doattack"`, `"onattackother"`, `"onmissother"`, `"weapontooweak"`  
  - `"attacked"`, `"blocked"`, `"onhitother"`, `"blocked"`, `"onareaattackother"`  
  - `"recoil_off"`, `"onreflectdamage"`, `"killed"` (via health)  

- **Replica events:**  
  - Uses `inst.replica.combat:SetAttackRange`, `SetMinAttackPeriod`, `SetCanAttack`, `SetTarget`, `SetIsPanic`, `SetLastTarget`, `IsValidTarget`, `CanTarget`, `CanBeAttacked`, `CanBeAlly`, `IsAlly`, `TargetHasFriendlyLeader` to sync state to clients.
