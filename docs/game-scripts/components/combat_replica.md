---
id: combat_replica
title: Combat Replica
description: Client-side replica of the combat component that synchronizes combat state across the network for multiplayer gameplay.
tags: [combat, network, replication]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: components
source_hash: 9b3c2840
system_scope: network
---

# Combat Replica

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`Combat Replica` is the client-side counterpart to the server-side `combat` component. It synchronizes combat-related state (target, attack range, panic state, cooldowns) across the network using net variables and classified player data. This component allows clients to perform combat validation locally while deferring authoritative decisions to the server. It mirrors most functions from `combat` but uses replica components and network-synchronized values instead of direct server state.

## Usage example
```lua
-- Access the combat replica on a player entity
local combat_replica = player.replica.combat

-- Set and get combat target
combat_replica:SetTarget(target_entity)
local current_target = combat_replica:GetTarget()

-- Check if entity can attack
local can_attack = combat_replica:CanAttack(target_entity)

-- Get attack range with equipped weapon
local range = combat_replica:GetAttackRangeWithWeapon()

-- Check cooldown state
local in_cooldown = combat_replica:InCooldown()
```

## Dependencies & tags
**External dependencies:**
- `TheWorld` -- checks `ismastersim` for server/client differentiation
- `TheNet` -- checks `GetPVPEnabled()` for player-versus-player rules
- `GetTime()` -- used for cooldown timing calculations
- `distsq()` -- 3D distance squared calculations for range checks

**Components used:**
- `combat` -- server-side component referenced when available on master sim
- `inventory` replica -- accesses equipped weapon via `replica.inventory:GetEquippedItem()`
- `rider` replica -- checks if entity is riding a mount
- `follower` replica -- determines leader/follower relationships for ally checks
- `sanity` replica -- checks sanity state for shadow creature targeting rules
- `classified` -- player classified data for network-optimized state storage

**Tags:**
- `busy` -- checked to prevent attacks during busy states
- `hit` -- allows attacks even when busy if hit state is active
- `extinguisher` -- checked for fire extinguishing capability
- `rangedlighter` -- checked for ranged lighting capability
- `canlight` -- target must have this tag to be lightable
- `fire`, `burnt`, `smolder` -- fire state tags for target validation
- `weapon`, `projectile`, `rangedweapon` -- weapon type identification
- `INLIMBO`, `notarget`, `debugnoattack` -- exclusion tags for targeting
- `invisible`, `spawnprotection` -- protection state tags
- `shadow`, `playerghost`, `crazy` -- sanity and ghost state tags
- `alwayshostile`, `companion`, `domesticated` -- ally relationship tags
- `peacefulmount`, `propweapon`, `noplayertarget` -- special combat rule tags
- `flight`, `noattack`, `nightmarecreature`, `shadowcreature`, `locomotor` -- creature state tags

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `---` | The entity instance that owns this component. |
| `_target` | net_entity | `---` | Network-synchronized target entity reference. |
| `_ispanic` | net_bool | `---` | Network-synchronized panic state flag. |
| `_attackrange` | net_float | `---` | Network-synchronized base attack range value. |
| `_laststartattacktime` | number | `nil` | Timestamp of last attack start for cooldown calculation. |
| `classified` | table | `nil` | Player classified data container for network optimization. |
| `ondetachclassified` | function | `nil` | Callback function triggered when classified data detaches. |

## Main functions
### `AttachClassified(classified)`
* **Description:** Attaches player classified data container and sets up cleanup listener for when classified data is removed. Resets attack cooldown timer.
* **Parameters:** `classified` -- player classified data table from `inst.player_classified`
* **Returns:** None
* **Error states:** None

### `DetachClassified()`
* **Description:** Detaches player classified data container and clears related references. Resets attack cooldown timer.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `SetTarget(target)`
* **Description:** Sets the combat target entity via network-synchronized net_entity variable.
* **Parameters:** `target` -- entity instance to set as target
* **Returns:** None
* **Error states:** None

### `GetTarget()`
* **Description:** Returns the current combat target entity from network-synchronized variable.
* **Parameters:** None
* **Returns:** Entity instance or `nil` if no target set

### `SetLastTarget(target)`
* **Description:** Sets the last combat target in classified data for recent target tracking.
* **Parameters:** `target` -- entity instance to record as last target
* **Returns:** None
* **Error states:** None

### `IsRecentTarget(target)`
* **Description:** Checks if target is the current or recently attacked target. Falls back to server combat component if available, otherwise checks classified data or current target.
* **Parameters:** `target` -- entity instance to check
* **Returns:** `true` if target is recent, `false` otherwise
* **Error states:** None

### `SetIsPanic(ispanic)`
* **Description:** Sets the panic state via network-synchronized net_bool variable.
* **Parameters:** `ispanic` -- boolean panic state
* **Returns:** None
* **Error states:** None

### `SetAttackRange(attackrange)`
* **Description:** Sets the base attack range via network-synchronized net_float variable.
* **Parameters:** `attackrange` -- number representing attack range in units
* **Returns:** None
* **Error states:** None

### `GetAttackRangeWithWeapon()`
* **Description:** Returns total attack range including weapon bonus. Falls back to server combat component if available, otherwise calculates from replica data.
* **Parameters:** None
* **Returns:** Number representing total attack range, or `0` if no weapon
* **Error states:** None

### `GetWeaponAttackRange()`
* **Description:** Returns only the weapon's attack range bonus from replica inventory data.
* **Parameters:** None
* **Returns:** Number representing weapon attack range bonus, or `0` if no weapon
* **Error states:** None

### `GetWeapon()`
* **Description:** Returns the currently equipped weapon entity from replica inventory. Handles projectile and ranged weapon special cases, excludes weapons when riding unless ranged.
* **Parameters:** None
* **Returns:** Weapon entity instance or `nil` if no valid weapon equipped
* **Error states:** None

### `SetMinAttackPeriod(minattackperiod)`
* **Description:** Sets the minimum attack period (cooldown) in classified data.
* **Parameters:** `minattackperiod` -- number representing cooldown duration in seconds
* **Returns:** None
* **Error states:** None

### `MinAttackPeriod()`
* **Description:** Returns the minimum attack period (cooldown duration). Falls back to server combat component if available, otherwise reads from classified data.
* **Parameters:** None
* **Returns:** Number representing cooldown duration in seconds, or `0` if unavailable
* **Error states:** None

### `SetCanAttack(canattack)`
* **Description:** Sets the can-attack state flag in classified data.
* **Parameters:** `canattack` -- boolean indicating if entity can attack
* **Returns:** None
* **Error states:** None

### `StartAttack()`
* **Description:** Initiates an attack and records the start time for cooldown tracking. Falls back to server combat component if available.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `CancelAttack()`
* **Description:** Cancels the current attack and clears the attack start time. Falls back to server combat component if available.
* **Parameters:** None
* **Returns:** None
* **Error states:** None

### `InCooldown()`
* **Description:** Checks if the entity is currently in attack cooldown period. Falls back to server combat component if available, otherwise calculates from local timestamp.
* **Parameters:** None
* **Returns:** `true` if in cooldown, `false` otherwise
* **Error states:** None

### `CanAttack(target)`
* **Description:** Validates if entity can attack the specified target. Checks target validity, attack permission, cooldown state, busy state, and range. Falls back to server combat component if available. Includes position error compensation (`-.5`) for client prediction.
* **Parameters:** `target` -- entity instance to validate as attack target
* **Returns:** `true` if attack is valid, `false` otherwise. (Note: Second return value for invalid target only applies to server combat component, not client replica.)
* **Error states:** None

### `LocomotorCanAttack(reached_dest, target)`
* **Description:** Validates attack capability during locomotion. Checks target validity, attack permission, busy state, and range. Performs void ground testing for non-ranged weapons when player is within range `> 2`. Returns three values for reached destination, validity, and cooldown state.
* **Parameters:**
  - `reached_dest` -- boolean indicating if destination was reached (optional, calculated if nil)
  - `target` -- entity instance to validate as attack target
* **Returns:** Three values: `reached_dest` (boolean), `not valid` (boolean), `in cooldown` (boolean)
* **Error states:** None

### `CanExtinguishTarget(target, weapon)`
* **Description:** Checks if entity can extinguish the target's fire. Falls back to server combat component if available, otherwise checks extinguisher tags and fire state tags.
* **Parameters:**
  - `target` -- entity instance to check
  - `weapon` -- weapon entity instance (optional)
* **Returns:** `true` if target can be extinguished, `false` otherwise
* **Error states:** None

### `CanLightTarget(target, weapon)`
* **Description:** Checks if entity can light the target on fire. Falls back to server combat component if available, otherwise checks rangedlighter tag, canlight tag, and fire/burnt state exclusion.
* **Parameters:**
  - `target` -- entity instance to check
  - `weapon` -- weapon entity instance (optional)
* **Returns:** `true` if target can be lit, `false` otherwise
* **Error states:** None

### `CanHitTarget(target)`
* **Description:** Validates if entity can hit the specified target. Checks target validity, limbo state, extinguish/light/attack capability, and range with position error compensation (`0.5`). Falls back to server combat component if available.
* **Parameters:** `target` -- entity instance to validate as hit target
* **Returns:** `true` if target can be hit, `false` otherwise
* **Error states:** None

### `IsValidTarget(target)`
* **Description:** Comprehensive target validation checking entity validity, visibility, self-targeting, and multiple exclusion rules including shadow creatures, player ghosts, sanity state, PVP settings, and height restrictions.
* **Parameters:** `target` -- entity instance to validate
* **Returns:** `true` if target is valid, `false` otherwise
* **Error states:** None

### `CanTarget(target)`
* **Description:** Full targeting validation combining `IsValidTarget()` with panic state, exclusion tags, invisible state, combat reciprocity, and mount riding rules.
* **Parameters:** `target` -- entity instance to validate for targeting
* **Returns:** `true` if target can be targeted, `false` otherwise
* **Error states:** None

### `CanBeAlly(guy)`
* **Description:** Determines if another entity should be considered an ally based on leader/follower relationships, player alignment, domestication state, bedazzled state, and PVP settings.
* **Parameters:** `guy` -- entity instance to check for ally status
* **Returns:** `true` if entity can be ally, `false` otherwise
* **Error states:** None

### `IsAlly(guy)`
* **Description:** Checks if entity is actually an ally by verifying `CanBeAlly()` and ensuring the entity is not currently targeting this entity.
* **Parameters:** `guy` -- entity instance to check for ally status
* **Returns:** `true` if entity is ally, `false` otherwise
* **Error states:** None

### `TargetHasFriendlyLeader(target)`
* **Description:** **Deprecated** - Use `IsAlly()` or `CanBeAlly()` instead. Checks if target shares a friendly leader relationship. Will assert on dev branch.
* **Parameters:** `target` -- entity instance to check
* **Returns:** `true` if target has friendly leader, `false` otherwise
* **Error states:** Asserts on dev branch with message "Deprecated! Use IsAlly/CanBeAlly."

### `CanBeAttacked(attacker)`
* **Description:** Validates if this entity can be attacked by the specified attacker. Checks ghost state, flight state, invisibility, player targeting restrictions, PVP rules, follower relationships, sanity state, and shadow creature rules.
* **Parameters:** `attacker` -- entity instance attempting to attack (optional)
* **Returns:** `true` if entity can be attacked, `false` otherwise
* **Error states:** None

## Events & listeners
- **Listens to:** `onremove` - triggers `DetachClassified()` when classified data is removed from entity