---
id: combat
title: Combat
description: Core combat component managing attacks, damage calculation, targeting, and aggro systems for entities.
tags: [combat, damage, targeting, aggro]
sidebar_position: 10

last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 7118412c
system_scope: combat
---

# Combat

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Combat` is the central component handling all combat-related functionality for entities in Don't Starve Together. It manages attack cooldowns, damage calculation with multipliers and bonuses, target acquisition and tracking, aggro systems, area attacks, and damage reflection. This component works closely with `health`, `weapon`, `inventory`, and `sleeper` components to process incoming and outgoing damage, handle armor absorption, and coordinate combat state machines via stategraphs.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("combat")
inst.components.combat:SetDefaultDamage(10)
inst.components.combat:SetRange(3, 3)
inst.components.combat:SetTarget(player)
inst.components.combat:TryAttack()
```

## Dependencies & tags
**External dependencies:**
- `util/sourcemodifierlist` -- creates SourceModifierList for damage multipliers
- `components/spdamageutil` -- handles special damage type calculations

**Components used:**
- `health` -- checks death state, applies damage via DoDelta, checks invincibility
- `weapon` -- retrieves equipped weapon, gets weapon damage and attack range
- `inventory` -- applies armor absorption, checks equipped items for resistance
- `attackdodger` -- checks and executes dodge mechanics
- `rideable` / `rider` / `saddler` -- handles mounted combat damage calculations
- `damagetyperesist` -- applies damage type resistance multipliers
- `damagetypebonus` -- applies damage type bonus multipliers
- `planarentity` -- handles planar damage absorption
- `follower` / `leader` -- manages follower relationships during combat
- `sleeper` -- checks sleep state for retargeting
- `talker` -- plays battle cries and give-up dialogue
- `burnable` -- checks burning/smoldering state for light/extinguish actions
- `projectile` / `complexprojectile` -- launches projectile attacks
- `electricattacks` -- applies electric stimulus to attacks

**Tags:**
- `INLIMBO`, `notarget`, `noattack`, `flight`, `invisible`, `playerghost` -- excluded from area attacks
- `structure`, `hostile`, `stealth` -- affects aggro decisions
- `toughfighter` -- bypasses tough combat recoil
- `sharp`, `dull` -- determines weapon impact sound type
- `wall`, `object` -- determines impact sound type
- `extinguisher`, `rangedlighter`, `burnt` -- fire-related combat actions
- `projectile`, `rangedweapon` -- ranged attack detection
- `electric` -- electric stimulus attacks
- `attack`, `busy`, `hit` -- stategraph combat states
- `iframeskeepaggro`, `hiding`, `alwaysblock` -- special combat conditions

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `nextbattlecrytime` | number | `nil` | Timestamp when next battle cry can be played. |
| `battlecryenabled` | boolean | `true` | Whether battle cries are enabled for this entity. |
| `attackrange` | number | `3` | Base attack range in units. |
| `hitrange` | number | `3` | Base hit detection range in units. |
| `areahitrange` | number | `nil` | Range for area-of-effect attacks, nil disables. |
| `temprange` | number | `nil` | Temporary override for attack range. |
| `areahitdamagepercent` | number | `nil` | Damage multiplier for area attacks. |
| `defaultdamage` | number | `0` | Base damage when no weapon is equipped. |
| `shouldaggrofn` | function | `nil` | Custom function to determine if entity should aggro on target. |
| `shouldavoidaggro` | table | `nil` | Table of entities to temporarily avoid aggroing on. |
| `forbiddenaggrotags` | table | `nil` | List of tags that prevent aggro. |
| `lastwasattackedbytargettime` | number | `0` | Timestamp of last attack from current target. |
| `externaldamagemultipliers` | SourceModifierList | `SourceModifierList(self.inst)` | Multipliers for damage dealt to others. |
| `min_attack_period` | number | `4` | Minimum time between attacks in seconds. |
| `onhitfn` | function | `nil` | Callback fired when this entity is hit. |
| `onhitotherfn` | function | `nil` | Callback fired when this entity hits another. |
| `laststartattacktime` | number | `0` | Timestamp of last attack start. |
| `lastwasattackedtime` | number | `0` | Timestamp of last time entity was attacked. |
| `keeptargetfn` | function | `nil` | Function to validate if target should be kept. |
| `keeptargettimeout` | number | `0` | Timeout for keep target validation. |
| `hiteffectsymbol` | string | `"marker"` | Symbol name for hit effects. |
| `canattack` | boolean | `true` | Whether entity can currently attack. |
| `lasttargetGUID` | number | `nil` | GUID of last target for tracking. |
| `target` | Entity | `nil` | Current combat target entity. |
| `panic_thresh` | number | `nil` | Health percentage threshold for panic behavior. |
| `forcefacing` | boolean | `true` | Whether to force face target during attacks. |
| `bonusdamagefn` | function | `nil` | Function to calculate bonus damage. |
| `externaldamagetakenmultipliers` | SourceModifierList | `SourceModifierList(self.inst)` | Multipliers for damage taken by this entity (post armour reduction). |


## Main functions
### `SetLastTarget(target)`
* **Description:** Sets the last target GUID and replicates it to clients. Used for tracking recent targets.
* **Parameters:** `target` -- entity instance or nil
* **Returns:** None
* **Error states:** None

### `SetAttackPeriod(period)`
* **Description:** Sets the minimum attack period (cooldown) between attacks.
* **Parameters:** `period` -- number in seconds
* **Returns:** None
* **Error states:** None

### `TargetIs(target)`
* **Description:** Checks if the given entity is the current target.
* **Parameters:** `target` -- entity instance to check
* **Returns:** `true` if target matches, `false` otherwise

### `InCooldown()`
* **Description:** Checks if the entity is currently in attack cooldown.
* **Parameters:** None
* **Returns:** `true` if in cooldown, `false` otherwise

### `GetCooldown()`
* **Description:** Returns the remaining cooldown time in seconds.
* **Parameters:** None
* **Returns:** Number representing remaining cooldown, or `0` if none

### `ResetCooldown()`
* **Description:** Resets the attack cooldown by clearing the last attack time.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `RestartCooldown()`
* **Description:** Restarts the attack cooldown from the current time.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OverrideCooldown(cd)`
* **Description:** Overrides the cooldown to a specific value by adjusting last attack time.
* **Parameters:** `cd` -- number representing desired cooldown remaining
* **Returns:** None
* **Error states:** None

### `SetRange(attack, hit)`
* **Description:** Sets the attack range and hit range values.
* **Parameters:**
  - `attack` -- number for attack range
  - `hit` -- number for hit range (defaults to attack value if nil)
* **Returns:** None
* **Error states:** None

### `SetPlayerStunlock(stunlock)`
* **Description:** Sets the player stun lock behavior setting.
* **Parameters:** `stunlock` -- PLAYERSTUNLOCK value or nil
* **Returns:** None
* **Error states:** None

### `SetAreaDamage(range, percent, areahitcheck)`
* **Description:** Configures area-of-effect damage parameters.
* **Parameters:**
  - `range` -- number for area damage radius
  - `percent` -- damage multiplier for area hits (default `1`)
  - `areahitcheck` -- function to validate area attack targets
* **Returns:** None
* **Error states:** None

### `EnableAreaDamage(enable)`
* **Description:** Enables or disables area damage.
* **Parameters:** `enable` -- boolean (false disables)
* **Returns:** None
* **Error states:** None

### `BlankOutAttacks(fortime)`
* **Description:** Temporarily prevents the entity from attacking for a duration.
* **Parameters:** `fortime` -- number in seconds
* **Returns:** None
* **Error states:** None

### `ShareTarget(target, range, fn, maxnum, musttags)`
* **Description:** Shares aggro on a target with nearby entities that have combat components.
* **Parameters:**
  - `target` -- entity to share as target
  - `range` -- number for search radius
  - `fn` -- optional filter function for helpers
  - `maxnum` -- maximum number of helpers to share with
  - `musttags` -- optional table of required tags for helpers
* **Returns:** None
* **Error states:** None

### `SetDefaultDamage(damage)`
* **Description:** Sets the default damage value when no weapon is equipped.
* **Parameters:** `damage` -- number
* **Returns:** None
* **Error states:** None

### `SetOnHit(fn)`
* **Description:** Sets the callback function fired when this entity is hit.
* **Parameters:** `fn` -- function(inst, attacker, damage, spdamage)
* **Returns:** None
* **Error states:** None

### `SetCanSuggestTargetFn(fn)`
* **Description:** Sets a function to determine if a target can be suggested.
* **Parameters:** `fn` -- function(inst, target) returning boolean
* **Returns:** None
* **Error states:** None

### `SuggestTarget(target)`
* **Description:** Attempts to set a new target if no current target exists and passes validation.
* **Parameters:** `target` -- entity instance
* **Returns:** `true` if target was set, `false` otherwise
* **Error states:** None

### `SetKeepTargetFunction(fn)`
* **Description:** Sets a function to validate whether to keep the current target.
* **Parameters:** `fn` -- function(inst, target) returning boolean
* **Returns:** None
* **Error states:** None

### `TryRetarget()`
* **Description:** Attempts to find and set a new target using the retarget function.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetRetargetFunction(period, fn)`
* **Description:** Sets up periodic retargeting with a callback function.
* **Parameters:**
  - `period` -- number in seconds between retarget attempts
  - `fn` -- function(inst) returning new target and force change flag
* **Returns:** None
* **Error states:** None

### `OnEntitySleep()`
* **Description:** Called when entity goes to sleep; cancels retarget task.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnEntityWake()`
* **Description:** Called when entity wakes up; restarts retarget task and target tracking.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `OnUpdate(dt)`
* **Description:** Updates target validation and keep target timeout. Called periodically when entity has a target.
* **Parameters:** `dt` -- delta time in seconds
* **Returns:** None
* **Error states:** None

### `IsRecentTarget(target)`
* **Description:** Checks if target is current or was the last target.
* **Parameters:** `target` -- entity instance
* **Returns:** `true` if target is recent, `false` otherwise

### `StartTrackingTarget(target)`
* **Description:** Sets up event listeners to track target lifecycle events.
* **Parameters:** `target` -- entity instance
* **Returns:** None
* **Error states:** None

### `StopTrackingTarget(target)`
* **Description:** Removes event listeners for target tracking.
* **Parameters:** `target` -- entity instance
* **Returns:** None
* **Error states:** None

### `DropTarget(hasnexttarget)`
* **Description:** Clears the current target and stops tracking. Pushes droppedtarget event.
* **Parameters:** `hasnexttarget` -- boolean indicating if another target will be set
* **Returns:** None
* **Error states:** None

### `EngageTarget(target)`
* **Description:** Sets a new target and starts tracking. Pushes newcombattarget event.
* **Parameters:** `target` -- entity instance
* **Returns:** None
* **Error states:** None

### `SetShouldAggroFn(fn)`
* **Description:** Sets custom function to determine aggro eligibility.
* **Parameters:** `fn` -- function(inst, target) returning boolean
* **Returns:** None
* **Error states:** None

### `SetShouldAvoidAggro(target)`
* **Description:** Adds a target to the avoid aggro list (reference counted).
* **Parameters:** `target` -- entity instance
* **Returns:** None
* **Error states:** None

### `RemoveShouldAvoidAggro(target)`
* **Description:** Removes a target from the avoid aggro list (reference counted).
* **Parameters:** `target` -- entity instance
* **Returns:** None
* **Error states:** None

### `ShouldAggro(target, ignore_forbidden)`
* **Description:** Determines if entity should aggro on the given target based on all aggro rules.
* **Parameters:**
  - `target` -- entity instance
  - `ignore_forbidden` -- boolean to skip forbidden tag checks
* **Returns:** `true` if should aggro, `false` otherwise

### `AddNoAggroTag(tag)`
* **Description:** Adds a tag to the forbidden aggro tags list.
* **Parameters:** `tag` -- string tag name
* **Returns:** None
* **Error states:** None

### `RemoveNoAggroTag(tag)`
* **Description:** Removes a tag from the forbidden aggro tags list.
* **Parameters:** `tag` -- string tag name
* **Returns:** None
* **Error states:** None

### `SetNoAggroTags(tags)`
* **Description:** Sets the entire forbidden aggro tags list.
* **Parameters:** `tags` -- table of tag strings in ipairs format
* **Returns:** None
* **Error states:** None

### `SetTarget(target)`
* **Description:** Sets the combat target after validation. Drops old target and engages new one.
* **Parameters:** `target` -- entity instance or nil
* **Returns:** None
* **Error states:** None

### `IsValidTarget(target)`
* **Description:** Checks if target is valid via replica combat component.
* **Parameters:** `target` -- entity instance
* **Returns:** `true` if valid, `false` otherwise

### `ValidateTarget()`
* **Description:** Validates current target and drops it if invalid.
* **Parameters:** None
* **Returns:** `true` if target is valid, `nil` if target was nil or dropped

### `GetDebugString()`
* **Description:** Returns debug information string with target, damage, range, and cooldown status.
* **Parameters:** None
* **Returns:** String with debug information

### `GetGiveUpString(target)`
* **Description:** Returns dialogue string for giving up on target. Override in subclasses.
* **Parameters:** `target` -- entity instance
* **Returns:** String and string ID, or `nil`

### `GiveUp()`
* **Description:** Gives up on current target, plays dialogue if available, and drops target.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `GetBattleCryString(target)`
* **Description:** Returns battle cry dialogue string. Override in subclasses.
* **Parameters:** `target` -- entity instance
* **Returns:** String and string ID from subclass override, or `nil` in base implementation.

### `ResetBattleCryCooldown(t)`
* **Description:** Resets the battle cry cooldown timer.
* **Parameters:** `t` -- optional timestamp (defaults to GetTime())
* **Returns:** None
* **Error states:** None

### `BattleCry()`
* **Description:** Plays battle cry if enabled and cooldown has elapsed.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetHurtSound(sound)`
* **Description:** Sets the sound to play when entity is hurt.
* **Parameters:** `sound` -- string sound name
* **Returns:** None
* **Error states:** None

### `GetAttacked(attacker, damage, weapon, stimuli, spdamage)`
* **Description:** Processes incoming attack, applies armor, calculates damage, and applies to health. Handles dodging, reflection, and special damage.
* **Parameters:**
  - `attacker` -- entity instance dealing damage
  - `damage` -- number base damage
  - `weapon` -- weapon entity or nil
  - `stimuli` -- string stimulus type (e.g., "electric")
  - `spdamage` -- table of special damage types
* **Returns:** `true` if not blocked, `false` if blocked
* **Error states:** None

### `GetImpactSound(target, weapon)`
* **Description:** Determines the appropriate impact sound based on target type and weapon.
* **Parameters:**
  - `target` -- entity instance being hit
  - `weapon` -- weapon entity or nil
* **Returns:** Sound name string or `nil`

### `StartAttack()`
* **Description:** Initiates an attack by facing target and restarting cooldown.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `CancelAttack()`
* **Description:** Alias for ResetCooldown. Cancels the current attack.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `CanTarget(target)`
* **Description:** Checks if entity can target the given entity via replica.
* **Parameters:** `target` -- entity instance
* **Returns:** `true` if can target, `false` otherwise

### `HasTarget()`
* **Description:** Checks if entity currently has a target.
* **Parameters:** None
* **Returns:** `true` if has target, `false` otherwise

### `CanAttack(target)`
* **Description:** Checks if entity can attack the target based on cooldown, range, and state.
* **Parameters:** `target` -- entity instance or uses current target
* **Returns:** `true` if can attack, `false` otherwise (second return indicates invalid target)

### `LocomotorCanAttack(reached_dest, target)`
* **Description:** Checks if entity can attack from locomotion perspective, including ground validation.
* **Parameters:**
  - `reached_dest` -- boolean if destination reached
  - `target` -- entity instance
* **Returns:** `reached_dest`, `not valid`, `in_cooldown`

### `TryAttack(target)`
* **Description:** Attempts to perform an attack if conditions are met. Pushes doattack event.
* **Parameters:** `target` -- entity instance or uses current target
* **Returns:** `true` if attack initiated, `false` otherwise

### `ForceAttack()`
* **Description:** Forces an attack attempt regardless of normal conditions.
* **Parameters:** None
* **Returns:** `true` if attack initiated, `false` otherwise

### `GetWeapon()`
* **Description:** Returns the currently equipped weapon from inventory.
* **Parameters:** None
* **Returns:** Weapon entity or `nil`

### `GetLastAttackedTime()`
* **Description:** Returns the timestamp of the last time entity was attacked.
* **Parameters:** None
* **Returns:** Number timestamp

### `CalcDamage(target, weapon, multiplier)`
* **Description:** Calculates final damage including all multipliers, bonuses, and special damage.
* **Parameters:**
  - `target` -- entity instance receiving damage
  - `weapon` -- weapon entity or nil
  - `multiplier` -- optional damage multiplier
* **Returns:** `damage` number, `spdamage` table

### `CalcReflectedDamage(targ, dmg, weapon, stimuli, reflect_list, spdmg)`
* **Description:** Calculates reflected damage from target and equipped items.
* **Parameters:**
  - `targ` -- entity instance that may reflect
  - `dmg` -- number base damage
  - `weapon` -- weapon entity
  - `stimuli` -- string stimulus type
  - `reflect_list` -- table to track reflection sources
  - `spdmg` -- special damage table
* **Returns:** `reflected_dmg` number, `reflected_spdmg` table

### `GetAttackRange()`
* **Description:** Returns effective attack range including weapon bonus.
* **Parameters:** None
* **Returns:** Number representing attack range

### `CalcAttackRangeSq(target)`
* **Description:** Calculates squared attack range including target physics radius.
* **Parameters:** `target` -- entity instance or uses current target
* **Returns:** Number representing squared range

### `GetHitRange()`
* **Description:** Returns effective hit range including weapon bonus.
* **Parameters:** None
* **Returns:** Number representing hit range

### `CalcHitRangeSq(target)`
* **Description:** Calculates squared hit range including target physics radius.
* **Parameters:** `target` -- entity instance or uses current target
* **Returns:** Number representing squared range

### `CanExtinguishTarget(target, weapon)`
* **Description:** Checks if entity can extinguish a burning target.
* **Parameters:**
  - `target` -- entity instance
  - `weapon` -- weapon entity or nil
* **Returns:** `true` if can extinguish, `false` otherwise

### `CanLightTarget(target, weapon)`
* **Description:** Checks if entity can light a target on fire.
* **Parameters:**
  - `target` -- entity instance
  - `weapon` -- weapon entity
* **Returns:** `true` if can light, `false` otherwise

### `CanHitTarget(target, weapon)`
* **Description:** Comprehensive check if entity can hit the target with given weapon.
* **Parameters:**
  - `target` -- entity instance
  - `weapon` -- weapon entity or nil
* **Returns:** `true` if can hit, `false` otherwise

### `ClearAttackTemps()`
* **Description:** Clears temporary attack position and range overrides.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `DoAttack(targ, weapon, projectile, stimuli, instancemult, instrangeoverride, instpos)`
* **Description:** Executes a full attack sequence including damage calculation, reflection, and area attacks.
* **Parameters:**
  - `targ` -- target entity or nil for current target
  - `weapon` -- weapon entity or nil for equipped
  - `projectile` -- projectile entity or nil
  - `stimuli` -- string stimulus type
  - `instancemult` -- optional instance damage multiplier
  - `instrangeoverride` -- optional range override
  - `instpos` -- optional position override
* **Returns:** None
* **Error states:** None

### `SetRequiresToughCombat(tough)`
* **Description:** Sets whether entity requires tough combat to be damaged.
* **Parameters:** `tough` -- boolean
* **Returns:** None
* **Error states:** None

### `SetShouldRecoilFn(fn)`
* **Description:** Sets custom function to determine recoil on hit.
* **Parameters:** `fn` -- function(inst, attacker, weapon, damage)
* **Returns:** None
* **Error states:** None

### `ShouldRecoil(attacker, weapon, damage)`
* **Description:** Determines if attack should recoil based on tough combat rules.
* **Parameters:**
  - `attacker` -- entity instance attacking
  - `weapon` -- weapon entity
  - `damage` -- number damage value
* **Returns:** `recoil` boolean, `remaining_damage` number or nil

### `AddConditionExternalDamageTakenMultiplier(fn)`
* **Description:** Adds a conditional damage taken multiplier function.
* **Parameters:** `fn` -- function(inst, attacker, weapon) returning multiplier
* **Returns:** None
* **Error states:** None

### `RemoveConditionExternalDamageTakenMultiplier(fn)`
* **Description:** Removes a conditional damage taken multiplier function.
* **Parameters:** `fn` -- function to remove
* **Returns:** None
* **Error states:** None

### `ApplyConditionExternalDamageTakenMultiplier(damage, attacker, weapon)`
* **Description:** Applies all conditional damage taken multipliers to damage value.
* **Parameters:**
  - `damage` -- number base damage
  - `attacker` -- entity instance
  - `weapon` -- weapon entity
* **Returns:** Number with multipliers applied

### `GetDamageReflect(target, damage, weapon, stimuli)`
* **Description:** Deprecated. Triggers damage reflection on target.
* **Parameters:**
  - `target` -- entity instance
  - `damage` -- number
  - `weapon` -- weapon entity
  - `stimuli` -- string
* **Returns:** None

### `DoAreaAttack(target, range, weapon, validfn, stimuli, excludetags, onlyontarget)`
* **Description:** Performs area-of-effect attack on entities within range.
* **Parameters:**
  - `target` -- center entity for area
  - `range` -- number radius
  - `weapon` -- weapon entity
  - `validfn` -- optional validation function
  - `stimuli` -- string stimulus type
  - `excludetags` -- table of tags to exclude
  - `onlyontarget` -- boolean to only hit center target
* **Returns:** Number of entities hit

### `CanBeAlly(guy)`
* **Description:** Checks if entity can be an ally via replica.
* **Parameters:** `guy` -- entity instance
* **Returns:** `true` if can be ally, `false` otherwise

### `IsAlly(guy)`
* **Description:** Checks if entity is currently an ally via replica.
* **Parameters:** `guy` -- entity instance
* **Returns:** `true` if is ally, `false` otherwise

### `TargetHasFriendlyLeader(target)`
* **Description:** Deprecated. Checks if target has a friendly leader.
* **Parameters:** `target` -- entity instance
* **Returns:** `true` if has friendly leader, `false` otherwise

### `CanBeAttacked(attacker)`
* **Description:** Checks if entity can be attacked by the given attacker via replica.
* **Parameters:** `attacker` -- entity instance
* **Returns:** `true` if can be attacked, `false` otherwise

### `OnRemoveFromEntity()`
* **Description:** Cleanup function called when component is removed from entity. Cancels tasks and removes listeners.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

## Events & listeners
- **Listens to:** `knockback` - resets hit recovery delay via CommonHandlers
- **Listens to:** `enterlimbo` (on target) - triggers target loss
- **Listens to:** `onremove` (on target) - triggers target loss
- **Listens to:** `transfercombattarget` (on target) - handles target transfer
- **Listens to:** `leaderchanged` (on target) - checks ally status
- **Pushes:** `attacked` - fired when entity is hit with damage details
- **Pushes:** `blocked` - fired when attack is blocked/recoiled
- **Pushes:** `onhitother` - fired on attacker when this entity hits another
- **Pushes:** `killed` - fired on attacker when this entity dies
- **Pushes:** `giveuptarget` - fired when giving up on target
- **Pushes:** `droppedtarget` - fired when target is dropped
- **Pushes:** `newcombattarget` - fired when engaging new target
- **Pushes:** `losttarget` - fired when target validation fails
- **Pushes:** `doattack` - fired when attack is initiated
- **Pushes:** `onattackother` - fired when attacking another entity
- **Pushes:** `onmissother` - fired when attack misses
- **Pushes:** `onareaattackother` - fired for each entity hit by area attack
- **Pushes:** `onreflectdamage` - fired on entities that reflected damage
- **Pushes:** `weapontooweak` - fired when weapon cannot penetrate tough combat
- **Pushes:** `recoil_off` - fired when recoil state ends
