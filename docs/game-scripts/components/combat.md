---
id: combat
title: Combat
description: This component manages an entity's combat-related states, actions, targeting, and damage calculations.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
source_hash: f3f83372
---

# Combat

## Overview
The Combat component is a core part of an entity's ability to engage in hostile interactions within Don't Starve Together. It handles all aspects of combat, including defining attack ranges and periods, managing the entity's current target, calculating damage dealt and received (including area damage and reflections), determining aggro logic, and handling combat cooldowns and state transitions. It integrates with other components to provide a comprehensive combat experience, such as health, inventory, and special attack behaviors.

## Dependencies & Tags
**Dependencies:**
*   `health`: Essential for taking and resolving damage, and for determining panic thresholds or if an entity is dead.
*   `inventory`: Used to retrieve equipped weapons, armor, and apply damage modifiers from items.
*   `attackdodger`: Accessed to check if an entity can dodge an incoming attack.
*   `rideable` & `saddler`: Used if the entity is mounted, to incorporate mount/saddle combat properties and damage.
*   `damagetyperesist`: Provides resistance values based on damage type.
*   `planarentity`: Modifies damage absorption for planar entities and handles undefended planar attacks.
*   `follower` & `leader`: Involved in logic for dropping targets if they become allies or if the leader changes.
*   `sleeper`: Prevents retargeting while the entity is in deep sleep.
*   `talker`: Used for playing battle cries or give-up messages.
*   `weapon`, `projectile`, `complexprojectile`: Components expected on equipped items to determine attack properties, damage, and projectile behavior.
*   `damagereflect`: Components on the target or its equipped items to calculate reflected damage.
*   `damagetypebonus`: Provides bonus damage based on damage type.
*   `rider`: Checks if the entity is currently riding a mount.
*   `burnable`: Accessed on targets to determine if they can be extinguished or lit.
*   `electricattacks`: Determines if the entity's attacks should be electric.
*   `replica.combat`: The client-side replica component that syncs combat-related state from the server.
*   `CommonHandlers`: Provides a utility function for resetting hit recovery delay.

**Tags Checked on Other Entities:**
*   `INLIMBO`, `notarget`, `noattack`, `flight`, `invisible`, `playerghost`, `stealth`, `alwaysblock`, `structure`, `hostile`, `wall`, `object`, `burnt`, `toughfighter`, `projectile`, `rangedweapon`, `extinguisher`, `sharp`, `dull`, `electric`, `hiding`.
*   `_combat`: Used when finding entities for `ShareTarget` and `DoAreaAttack`.

## Properties
| Property                       | Type          | Default Value     | Description                                                                                             |
| :----------------------------- | :------------ | :---------------- | :------------------------------------------------------------------------------------------------------ |
| `nextbattlecrytime`            | `number`      | `nil`             | The `GetTime()` at which the entity can next perform a battle cry.                                      |
| `battlecryenabled`             | `boolean`     | `true`            | If `true`, the entity can perform battle cries.                                                         |
| `attackrange`                  | `number`      | `3`               | The base range at which the entity can initiate an attack.                                              |
| `hitrange`                     | `number`      | `3`               | The base range at which an attack is considered to make contact with a target.                          |
| `areahitrange`                 | `number`      | `nil`             | The radius for area-of-effect (AoE) attacks. If `nil`, no AoE attack.                                  |
| `temprange`                    | `number`      | `nil`             | A temporary override for the `hitrange`.                                                                |
| `areahitdamagepercent`         | `number`      | `nil`             | The percentage of normal damage applied to targets within an AoE attack.                                |
| `defaultdamage`                | `number`      | `0`               | The base damage dealt by the entity when no weapon is equipped.                                         |
| `shouldaggrofn`                | `function`    | `nil`             | A custom function `(inst, target)` that returns `true` if the entity should aggro on the `target`.     |
| `shouldavoidaggro`             | `table`       | `nil`             | A table where keys are entities to temporarily avoid aggroing, and values are reference counts.         |
| `forbiddenaggrotags`           | `table`       | `nil`             | An array of string tags that prevent the entity from aggroing targets possessing any of these tags.     |
| `lastwasattackedbytargettime`  | `number`      | `0`               | The `GetTime()` when the entity was last attacked by its current target.                                |
| `externaldamagemultipliers`    | `SourceModifierList` | `SourceModifierList()` | Manages external multipliers applied to damage dealt by this entity.                                    |
| `externaldamagetakenmultipliers` | `SourceModifierList` | `SourceModifierList()` | Manages external multipliers applied to damage taken by this entity (post-armour).                      |
| `min_attack_period`            | `number`      | `4`               | The minimum time (in seconds) that must pass between attacks.                                           |
| `onhitfn`                      | `function`    | `nil`             | A callback function `(inst, attacker, damage, spdamage)` invoked when this entity *hits another* entity. |
| `onhitotherfn`                 | `function`    | `nil`             | A callback function `(attacker, target, damage, stimuli, weapon, damageresolved, spdamage, redirected)` invoked when this entity *hits another* entity (legacy/redundant). |
| `laststartattacktime`          | `number`      | `0`               | The `GetTime()` when the last attack sequence began.                                                    |
| `lastwasattackedtime`          | `number`      | `0`               | The `GetTime()` when this entity was last attacked by any source.                                       |
| `keeptargetfn`                 | `function`    | `nil`             | A custom function `(inst, target)` that returns `true` if the entity should continue targeting.         |
| `keeptargettimeout`            | `number`      | `0`               | A countdown timer used for periodically checking `keeptargetfn`.                                        |
| `hiteffectsymbol`              | `string`      | `"marker"`        | The symbol used for visual hit effects (though not explicitly processed by this component).             |
| `canattack`                    | `boolean`     | `true`            | If `true`, the entity is currently able to initiate attacks.                                            |
| `lasttargetGUID`               | `GUID`        | `nil`             | The GUID of the last entity that was targeted.                                                          |
| `target`                       | `entity`      | `nil`             | The entity's current target.                                                                            |
| `panic_thresh`                 | `number`      | `nil`             | A health percentage threshold (0-1) below which the entity might enter a panic state.                   |
| `forcefacing`                  | `boolean`     | `true`            | If `true`, the entity will automatically face its target before attacking.                              |
| `bonusdamagefn`                | `function`    | `nil`             | A custom function `(attacker, target, damage, weapon)` that returns additional damage to be added.      |
| `losetargetcallback`           | `function`    | (internal)        | Internal callback for target `onremove` and `enterlimbo` events.                                        |
| `transfertargetcallback`       | `function`    | (internal)        | Internal callback for target `transfercombattarget` event.                                              |
| `allycheckcallback`            | `function`    | (internal)        | Internal callback for target `leaderchanged` event to check for new ally status.                        |

## Main Functions
### `SetLastTarget(target)`
*   **Description:** Sets the `lasttargetGUID` property and updates the replica with the target's GUID.
*   **Parameters:**
    *   `target`: (`entity` or `nil`) The entity to set as the last target.

### `SetAttackPeriod(period)`
*   **Description:** Sets the minimum time (in seconds) required between attacks.
*   **Parameters:**
    *   `period`: (`number`) The new minimum attack period.

### `TargetIs(target)`
*   **Description:** Checks if the currently set target is the specified entity.
*   **Parameters:**
    *   `target`: (`entity`) The entity to compare with the current target.

### `InCooldown()`
*   **Description:** Determines if the entity is currently in its attack cooldown period.
*   **Parameters:** None.

### `GetCooldown()`
*   **Description:** Returns the remaining time (in seconds) until the entity's attack cooldown finishes.
*   **Parameters:** None.

### `ResetCooldown()`
*   **Description:** Resets the attack cooldown, making the entity able to attack immediately.
*   **Parameters:** None.

### `RestartCooldown()`
*   **Description:** Sets the current time as the start of a new attack cooldown period.
*   **Parameters:** None.

### `OverrideCooldown(cd)`
*   **Description:** Sets the attack cooldown to a specific duration, effectively making the entity able to attack after `cd` seconds relative to the current time, but within the bounds of `min_attack_period`.
*   **Parameters:**
    *   `cd`: (`number`) The duration of the cooldown override.

### `SetRange(attack, hit)`
*   **Description:** Sets the base attack and hit ranges for the entity.
*   **Parameters:**
    *   `attack`: (`number`) The new base attack range.
    *   `hit`: (`number`, optional) The new base hit range. If `nil`, `hitrange` defaults to `attackrange`.

### `SetPlayerStunlock(stunlock)`
*   **Description:** Sets the player stunlock behavior (commented out in the source, likely unimplemented or deprecated).
*   **Parameters:**
    *   `stunlock`: (`constant`) A value defining stunlock behavior.

### `SetAreaDamage(range, percent, areahitcheck)`
*   **Description:** Configures the entity's area-of-effect (AoE) attack properties.
*   **Parameters:**
    *   `range`: (`number`) The radius of the AoE attack. Set to `nil` to disable AoE.
    *   `percent`: (`number`, optional) The percentage of normal damage to apply in the AoE. Defaults to 1 if `range` is set.
    *   `areahitcheck`: (`function`, optional) A custom function `(target, inst)` to validate if an entity should be hit by the AoE.

### `EnableAreaDamage(enable)`
*   **Description:** Enables or disables the entity's area-of-effect (AoE) attacks.
*   **Parameters:**
    *   `enable`: (`boolean`) `true` to enable, `false` to disable.

### `BlankOutAttacks(fortime)`
*   **Description:** Temporarily prevents the entity from attacking for a specified duration.
*   **Parameters:**
    *   `fortime`: (`number`) The duration (in seconds) to disable attacks.

### `ShareTarget(target, range, fn, maxnum, musttags)`
*   **Description:** Attempts to suggest the current target to other nearby entities that are capable of combat.
*   **Parameters:**
    *   `target`: (`entity`) The entity to suggest as a target.
    *   `range`: (`number`) The search radius for potential helpers.
    *   `fn`: (`function`, optional) A custom filter function `(v, self.inst)` to determine if `v` should be a helper.
    *   `maxnum`: (`number`) The maximum number of helpers to suggest the target to.
    *   `musttags`: (`table`, optional) An array of tags that helper entities must possess. Defaults to `{"_combat"}`.

### `SetDefaultDamage(damage)`
*   **Description:** Sets the base damage dealt by the entity when no weapon is equipped.
*   **Parameters:**
    *   `damage`: (`number`) The new default damage value.

### `SetOnHit(fn)`
*   **Description:** Sets a callback function to be executed when this entity successfully hits another entity.
*   **Parameters:**
    *   `fn`: (`function`) A function `(inst, attacker, damage, spdamage)` to be called.

### `SetCanSuggestTargetFn(fn)`
*   **Description:** Sets a custom function to determine if this entity can accept a suggested target.
*   **Parameters:**
    *   `fn`: (`function`) A function `(inst, target)` that returns `true` if a target can be suggested.

### `SuggestTarget(target)`
*   **Description:** Suggests a target to the entity. If the entity has no current target and the suggested target is valid, it becomes the new target.
*   **Parameters:**
    *   `target`: (`entity`) The entity to suggest as a target.

### `SetKeepTargetFunction(fn)`
*   **Description:** Sets a custom function to determine if the entity should continue to keep its current target. This function is called periodically.
*   **Parameters:**
    *   `fn`: (`function`) A function `(inst, target)` that returns `true` if the target should be kept.

### `TryRetarget()`
*   **Description:** Attempts to find and set a new target based on the `targetfn` if it exists and the entity is not dead or sleeping.
*   **Parameters:** None.

### `SetRetargetFunction(period, fn)`
*   **Description:** Sets a function to be called periodically to potentially find a new target for the entity.
*   **Parameters:**
    *   `period`: (`number`) The time (in seconds) between retargeting attempts. If `nil`, disables retargeting.
    *   `fn`: (`function`) A function `(inst)` that returns a new target entity and an optional boolean to force the target change.

### `OnEntitySleep()`
*   **Description:** Cancels any active retargeting task when the entity goes to sleep.
*   **Parameters:** None.

### `OnEntityWake()`
*   **Description:** Resumes the retargeting task if one was previously set, and starts updating the component if `keeptargetfn` is active.
*   **Parameters:** None.

### `OnUpdate(dt)`
*   **Description:** Called every frame if the entity is active and `keeptargetfn` is set. It periodically checks `keeptargetfn` to determine if the current target should be dropped.
*   **Parameters:**
    *   `dt`: (`number`) The time elapsed since the last frame.

### `IsRecentTarget(target)`
*   **Description:** Checks if the given target is either the current target or the last remembered target (by GUID).
*   **Parameters:**
    *   `target`: (`entity`) The entity to check.

### `StartTrackingTarget(target)`
*   **Description:** Begins listening for events (`enterlimbo`, `onremove`, `transfercombattarget`, `leaderchanged`) on the current target to automatically handle target changes or drops.
*   **Parameters:**
    *   `target`: (`entity`) The entity to start tracking.

### `StopTrackingTarget(target)`
*   **Description:** Stops listening for the target-related events set up by `StartTrackingTarget`.
*   **Parameters:**
    *   `target`: (`entity`) The entity to stop tracking.

### `DropTarget(hasnexttarget)`
*   **Description:** Clears the current target, stops tracking it, and updates the `lasttargetGUID`. Pushes a "droppedtarget" event unless `hasnexttarget` is true.
*   **Parameters:**
    *   `hasnexttarget`: (`boolean`, optional) If `true`, indicates that a new target is immediately being set, suppressing the "droppedtarget" event.

### `EngageTarget(target)`
*   **Description:** Sets a new target, starts tracking it, and pushes a "newcombattarget" event. Handles follower logic if the target is also the leader.
*   **Parameters:**
    *   `target`: (`entity`) The entity to engage as the new target.

### `SetShouldAggroFn(fn)`
*   **Description:** Sets a custom function to determine if the entity should aggro on a given target.
*   **Parameters:**
    *   `fn`: (`function`) A function `(inst, target)` returning `true` if aggro is allowed.

### `SetShouldAvoidAggro(target)`
*   **Description:** Adds a temporary flag to avoid aggroing a specific target. This is reference counted.
*   **Parameters:**
    *   `target`: (`entity`) The entity to avoid aggroing.

### `RemoveShouldAvoidAggro(target)`
*   **Description:** Decrements the reference count for avoiding aggro on a specific target. Removes the flag if the count reaches zero.
*   **Parameters:**
    *   `target`: (`entity`) The entity to stop avoiding aggro on.

### `ShouldAggro(target, ignore_forbidden)`
*   **Description:** Determines if the entity should aggro on the given target, considering custom functions, avoid lists, and forbidden tags.
*   **Parameters:**
    *   `target`: (`entity`) The entity to check for aggro.
    *   `ignore_forbidden`: (`boolean`, optional) If `true`, ignores `forbiddenaggrotags` check.

### `AddNoAggroTag(tag)`
*   **Description:** Adds a tag to the `forbiddenaggrotags` list, preventing the entity from aggroing targets with this tag.
*   **Parameters:**
    *   `tag`: (`string`) The tag to add.

### `RemoveNoAggroTag(tag)`
*   **Description:** Removes a tag from the `forbiddenaggrotags` list.
*   **Parameters:**
    *   `tag`: (`string`) The tag to remove.

### `SetNoAggroTags(tags)`
*   **Description:** Sets the entire list of `forbiddenaggrotags`.
*   **Parameters:**
    *   `tags`: (`table`) An array of string tags.

### `SetTarget(target)`
*   **Description:** Attempts to set the entity's current target. It first validates the target and checks aggro rules. If valid, it drops the old target and engages the new one.
*   **Parameters:**
    *   `target`: (`entity`) The entity to set as the new target.

### `IsValidTarget(target)`
*   **Description:** Checks if a given entity is a valid target according to the replica's combat rules (e.g., not dead, not in limbo, etc.).
*   **Parameters:**
    *   `target`: (`entity`) The entity to validate.

### `ValidateTarget()`
*   **Description:** Checks if the current target is still valid. If not, it drops the target.
*   **Parameters:** None.

### `GetDebugString()`
*   **Description:** Returns a string containing useful debug information about the combat component's state (target, damage, ranges, cooldown, etc.).
*   **Parameters:** None.

### `GetGiveUpString(target)`
*   **Description:** Returns a string or string ID for the entity to say when giving up on a target (intended for custom implementation).
*   **Parameters:**
    *   `target`: (`entity`) The target the entity is giving up on.

### `GiveUp()`
*   **Description:** Makes the entity give up its current target, potentially playing a "give up" message via its talker component.
*   **Parameters:** None.

### `GetBattleCryString(target)`
*   **Description:** Returns a string or string ID for the entity to say as a battle cry (intended for custom implementation).
*   **Parameters:**
    *   `target`: (`entity`) The entity's current target.

### `ResetBattleCryCooldown(t)`
*   **Description:** Resets the cooldown for the entity's battle cry.
*   **Parameters:**
    *   `t`: (`number`, optional) The current `GetTime()`. If `nil`, `GetTime()` is called.

### `BattleCry()`
*   **Description:** If battle cries are enabled and not on cooldown, performs a battle cry. This may involve playing a sound, a custom talker message, or triggering a taunt state.
*   **Parameters:** None.

### `SetHurtSound(sound)`
*   **Description:** Sets the sound to play when this entity gets hurt.
*   **Parameters:**
    *   `sound`: (`string`) The asset path to the hurt sound.

### `GetAttacked(attacker, damage, weapon, stimuli, spdamage)`
*   **Description:** The primary function for processing an incoming attack on this entity. It calculates final damage after resistances, armor, special effects, and applies it to the health component. It also handles damage redirection, impact sounds, and pushes "attacked" or "blocked" events.
*   **Parameters:**
    *   `attacker`: (`entity`) The entity that initiated the attack.
    *   `damage`: (`number`) The base damage value of the attack.
    *   `weapon`: (`entity`, optional) The weapon used in the attack.
    *   `stimuli`: (`string`, optional) The type of stimulus (e.g., "electric").
    *   `spdamage`: (`table`, optional) Special damage structure.

### `GetImpactSound(target, weapon)`
*   **Description:** Determines the appropriate impact sound based on the target and the weapon used. Considers armor, target tags ("wall", "object"), and default creature sounds.
*   **Parameters:**
    *   `target`: (`entity`) The entity being hit.
    *   `weapon`: (`entity`, optional) The weapon used.

### `StartAttack()`
*   **Description:** Initiates an attack sequence. Forces the entity to face its target (if `forcefacing` is true) and restarts the attack cooldown.
*   **Parameters:** None.

### `CanTarget(target)`
*   **Description:** Checks if the entity can target another entity, delegating to the replica for server-side validation.
*   **Parameters:**
    *   `target`: (`entity`) The entity to check.

### `HasTarget()`
*   **Description:** Checks if the entity currently has a target.
*   **Parameters:** None.

### `CanAttack(target)`
*   **Description:** Determines if the entity is capable of attacking the specified target, considering cooldown, current state, and attack range.
*   **Parameters:**
    *   `target`: (`entity`) The potential target.

### `LocomotorCanAttack(reached_dest, target)`
*   **Description:** Extended check for locomotor-based attacks, considering if the destination has been reached, attack validity, and cooldown. Includes special checks for ranged player weapons over invalid ground.
*   **Parameters:**
    *   `reached_dest`: (`boolean`) Whether the entity has reached its locomotion destination.
    *   `target`: (`entity`) The potential target.

### `TryAttack(target)`
*   **Description:** Attempts to perform an attack on the specified target. If successful, it pushes a "doattack" event.
*   **Parameters:**
    *   `target`: (`entity`, optional) The entity to attack. Defaults to `self.target`.

### `ForceAttack()`
*   **Description:** Forces an attack on the current target. If no target, it pushes a "doattack" event without a target.
*   **Parameters:** None.

### `GetWeapon()`
*   **Description:** Retrieves the equipped weapon (if any) from the entity's inventory, ensuring it's a valid weapon for combat.
*   **Parameters:** None.

### `GetLastAttackedTime()`
*   **Description:** Returns the `GetTime()` when this entity was last attacked.
*   **Parameters:** None.

### `CalcDamage(target, weapon, multiplier)`
*   **Description:** Calculates the raw damage value to be dealt to a target, considering the weapon, various multipliers (base, external, damage type, player-specific, PvP), bonus damage, and special damage.
*   **Parameters:**
    *   `target`: (`entity`) The entity that will receive damage.
    *   `weapon`: (`entity`, optional) The weapon being used.
    *   `multiplier`: (`number`, optional) An additional damage multiplier.

### `CalcReflectedDamage(targ, dmg, weapon, stimuli, reflect_list, spdmg)`
*   **Description:** Calculates the total damage reflected by a target (and its mount/saddle if riding) based on `damagereflect` components.
*   **Parameters:**
    *   `targ`: (`entity`) The entity that is potentially reflecting damage.
    *   `dmg`: (`number`) The original damage dealt to the target.
    *   `weapon`: (`entity`, optional) The weapon used.
    *   `stimuli`: (`string`, optional) The type of stimuli.
    *   `reflect_list`: (`table`) A table to populate with details of each reflection instance.
    *   `spdmg`: (`table`, optional) The original special damage dealt.

### `GetAttackRange()`
*   **Description:** Returns the total effective attack range, combining the base `attackrange` with any equipped weapon's attack range.
*   **Parameters:** None.

### `CalcAttackRangeSq(target)`
*   **Description:** Calculates the squared distance for the effective attack range, considering the target's physics radius and the entity's effective attack range.
*   **Parameters:**
    *   `target`: (`entity`, optional) The target entity. Defaults to `self.target`.

### `GetHitRange()`
*   **Description:** Returns the total effective hit range, combining the base `hitrange` with any equipped weapon's hit range, or using a temporary override.
*   **Parameters:** None.

### `CalcHitRangeSq(target)`
*   **Description:** Calculates the squared distance for the effective hit range, considering the target's physics radius and the entity's effective hit range.
*   **Parameters:**
    *   `target`: (`entity`, optional) The target entity. Defaults to `self.target`.

### `CanExtinguishTarget(target, weapon)`
*   **Description:** Checks if the entity can extinguish a target (if the target is smoldering/burning and the attacker/weapon has the "extinguisher" tag).
*   **Parameters:**
    *   `target`: (`entity`) The entity to check.
    *   `weapon`: (`entity`, optional) The weapon being used.

### `CanLightTarget(target, weapon)`
*   **Description:** Checks if the entity can light a target (if the weapon is a "rangedlighter" and the target is burnable and not already burning/burnt).
*   **Parameters:**
    *   `target`: (`entity`) The entity to check.
    *   `weapon`: (`entity`, optional) The weapon being used.

### `CanHitTarget(target, weapon)`
*   **Description:** Determines if the entity can successfully hit the target, considering if it can be extinguished/lit, if it can be attacked, and if it's within effective hit range. For projectiles, it checks the projectile's hit distance.
*   **Parameters:**
    *   `target`: (`entity`) The potential target.
    *   `weapon`: (`entity`, optional) The weapon being used.

### `ClearAttackTemps()`
*   **Description:** Resets temporary overrides for position (`temppos`) and range (`temprange`) used during an attack.
*   **Parameters:** None.

### `DoAttack(targ, weapon, projectile, stimuli, instancemult, instrangeoverride, instpos)`
*   **Description:** Executes the actual attack logic. It validates the target, triggers "onmissother" if the target cannot be hit, handles area attacks, calculates damage, applies it to the target (or reflects it), and triggers weapon-specific attack events.
*   **Parameters:**
    *   `targ`: (`entity`, optional) The specific target for this attack. Defaults to `self.target`.
    *   `weapon`: (`entity`, optional) The weapon used. Defaults to `self:GetWeapon()`.
    *   `projectile`: (`entity`, optional) The projectile entity if this is a projectile attack.
    *   `stimuli`: (`string`, optional) The type of stimuli for the attack (e.g., "electric").
    *   `instancemult`: (`number`, optional) An additional damage multiplier for this specific attack instance.
    *   `instrangeoverride`: (`number`, optional) A temporary override for the hit range.
    *   `instpos`: (`vector3`, optional) A temporary override for the attacker's position.

### `SetRequiresToughCombat(tough)`
*   **Description:** Sets whether this entity requires "tough combat" to be damaged effectively, making it recoil from non-"toughfighter" attackers or non-"CanDoToughFight" weapons.
*   **Parameters:**
    *   `tough`: (`boolean`) `true` to enable tough combat.

### `SetShouldRecoilFn(fn)`
*   **Description:** Sets a custom function to determine if the entity should recoil from an attack and, optionally, adjust the damage.
*   **Parameters:**
    *   `fn`: (`function`) A function `(inst, attacker, weapon, damage)` that returns `recoil_boolean` and `remaining_damage`.

### `ShouldRecoil(attacker, weapon, damage)`
*   **Description:** Determines if the entity should recoil from an attack, based on `shouldrecoilfn` or `tough` combat rules.
*   **Parameters:**
    *   `attacker`: (`entity`) The attacking entity.
    *   `weapon`: (`entity`, optional) The weapon used.
    *   `damage`: (`number`) The incoming damage.

### `AddConditionExternalDamageTakenMultiplier(fn)`
*   **Description:** Adds a function to a list that applies additional damage multipliers based on specific conditions when damage is taken.
*   **Parameters:**
    *   `fn`: (`function`) A function `(inst, attacker, weapon)` that returns a damage multiplier.

### `RemoveConditionExternalDamageTakenMultiplier(fn)`
*   **Description:** Removes a previously added conditional damage taken multiplier function.
*   **Parameters:**
    *   `fn`: (`function`) The function to remove.

### `ApplyConditionExternalDamageTakenMultiplier(damage, attacker, weapon)`
*   **Description:** Applies all registered conditional external damage taken multipliers to an incoming damage value.
*   **Parameters:**
    *   `damage`: (`number`) The initial damage value.
    *   `attacker`: (`entity`) The attacking entity.
    *   `weapon`: (`entity`, optional) The weapon used.

### `DoAreaAttack(target, range, weapon, validfn, stimuli, excludetags, onlyontarget)`
*   **Description:** Performs an area-of-effect (AoE) attack around a specified target. Finds entities within `range`, filters them, calculates damage, and applies it.
*   **Parameters:**
    *   `target`: (`entity`) The center of the AoE attack.
    *   `range`: (`number`) The radius of the AoE.
    *   `weapon`: (`entity`, optional) The weapon used for the attack.
    *   `validfn`: (`function`, optional) A custom validation function `(ent, self.inst)` for each potential AoE hit.
    *   `stimuli`: (`string`, optional) The type of stimuli for the attack.
    *   `excludetags`: (`table`, optional) An array of tags to exclude from the AoE search.
    *   `onlyontarget`: (`boolean`, optional) If `true`, only applies damage to the specified `target` without searching for other entities.

### `CanBeAlly(guy)`
*   **Description:** Checks if the given entity is considered an ally according to the replica's combat rules.
*   **Parameters:**
    *   `guy`: (`entity`) The entity to check.

### `IsAlly(guy)`
*   **Description:** Checks if the given entity is currently an ally of this entity, delegating to the replica.
*   **Parameters:**
    *   `guy`: (`entity`) The entity to check.

### `TargetHasFriendlyLeader(target)`
*   **Description:** Checks if the target's leader (if any) is considered friendly to this entity, delegating to the replica.
*   **Parameters:**
    *   `target`: (`entity`) The entity whose leader to check.

### `CanBeAttacked(attacker)`
*   **Description:** Determines if this entity can be attacked by the specified attacker, delegating to the replica's combat rules.
*   **Parameters:**
    *   `attacker`: (`entity`) The potential attacker.

### `OnRemoveFromEntity()`
*   **Description:** Cleans up the component when it's removed from an entity, stopping any active tasks and removing event callbacks.
*   **Parameters:** None.

## Events & Listeners
*   **Listens For:**
    *   `knockback` (from `self.inst`): Resets hit recovery delay via `CommonHandlers.ResetHitRecoveryDelay`.
    *   `enterlimbo` (from `target`): Triggers `self.losetargetcallback` to drop the target.
    *   `onremove` (from `target`): Triggers `self.losetargetcallback` to drop the target.
    *   `transfercombattarget` (from `target`): Triggers `self.transfertargetcallback` to potentially transfer the target.
    *   `leaderchanged` (from `target`): Triggers `self.allycheckcallback` to check for new ally status and drop target if necessary.

*   **Pushes/Triggers:**
    *   `losttarget`: Triggered when the component stops tracking a target due to `keeptargetfn` failing.
    *   `droppedtarget`: Triggered when `DropTarget()` is explicitly called (unless `hasnexttarget` is `true`). Data: `{target = oldtarget}`.
    *   `newcombattarget`: Triggered when a new target is successfully engaged. Data: `{target = newtarget, oldtarget = oldtarget}`.
    *   `killed` (by `attacker`): Pushed by the attacker on itself when it successfully kills a victim. Data: `{victim = self.inst, attacker = attacker}`.
    *   `attacked`: Triggered when the entity successfully takes damage from an attack. Data: `{attacker, damage, damageresolved, original_damage, weapon, stimuli, spdamage, redirected, noimpactsound}`.
    *   `onhitother`: Pushed by the attacker on itself when it successfully hits another entity. Data: `{target, damage, damageresolved, stimuli, spdamage, weapon, redirected}`.
    *   `blocked`: Triggered when the entity blocks an incoming attack. Data: `{attacker, damage, spdamage, original_damage}`.
    *   `doattack`: Triggered when the entity is cleared to perform an attack. Data: `{target}`.
    *   `onmissother`: Triggered when the entity attempts an attack but misses the target or cannot hit it. Data: `{target, weapon}`.
    *   `recoil_off`: Triggered by the attacking entity if the target recoils from its attack. Data: `{target}`.
    *   `weapontooweak`: Triggered by the attacking entity if its weapon is too weak to cause damage when the target recoils.
    *   `onattackother`: Triggered by the attacking entity when it successfully initiates an attack against another entity. Data: `{target, weapon, projectile, stimuli}`.
    *   `onreflectdamage`: Triggered by an entity (or its equipped item) that reflects damage. Data: `{inst = reflecting_entity, attacker = attacking_entity, reflected_dmg = damage, reflected_spdmg = spdamage}`.
    *   `giveuptarget`: Triggered when the entity explicitly gives up its target. Data: `{target = currenttarget}`.
    *   `onareaattackother`: Triggered by the attacker when an area attack hits another entity. Data: `{target = hit_entity, weapon, stimuli}`.