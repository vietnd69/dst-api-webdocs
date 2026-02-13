---
id: combat_replica
title: Combat Replica
description: This component synchronizes and provides client-side combat information and logic for entities, often mirroring or approximating the master simulation's combat component.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: combat
---

# Combat Replica

## Overview
The `Combat Replica` component is responsible for managing and providing client-side access to combat-related properties and functions for an entity. As a replica component, its primary role is to reflect the state of the master simulation's `combat` component, especially for networked properties. It provides client-side approximations for combat calculations (e.g., attack range, cooldown, target validation) when the master `combat` component is not directly available, ensuring a more responsive client experience. It delegates to the `inst.components.combat` (master simulation) when present, otherwise it utilizes its own networked variables and local logic.

## Dependencies & Tags
This component interacts with various other components and checks for specific entity tags to determine combat capabilities and targeting rules.

**Components Checked:**
*   `inst.components.combat` (master simulation combat component)
*   `inst.player_classified` (for player-specific combat stats and networked properties)
*   `inst.replica.inventory`
*   `inst.replica.rider`
*   `inst.replica.sanity`
*   `inst.replica.follower`
*   `target.replica.combat`
*   `target.replica.inventoryitem`

**Tags Used/Checked:**
*   `weapon`, `projectile`, `complexprojectile`, `rangedweapon`
*   `extinguisher`, `rangedlighter`
*   `smolder`, `fire`, `canlight`, `burnt`
*   `noplayertarget`, `alwayshostile`, `companion`, `domesticated`
*   `shadow`, `playerghost`, `crazy`, `shadowcreature`, `nightmarecreature`
*   `noattack`, `invisible`, `INLIMBO`, `notarget`, `debugnoattack`, `flight`, `spawnprotection`
*   `propweapon`
*   `locomotor`
*   `peacefulmount`
*   `busy`, `hit` (state graph tags)

## Properties
| Property | Type | Default Value | Description |
| :------- | :--- | :------------ | :---------- |
| `_target` | `net_entity` | `nil` | The current entity targeted for combat. |
| `_ispanic` | `net_bool` | `false` | A boolean indicating if the entity is currently in a panic state. |
| `_attackrange` | `net_float` | `0` | The base attack range of the entity. |
| `_laststartattacktime` | `number` or `nil` | `nil` | The game time when the entity last initiated an attack, used for client-side cooldown calculations. |
| `classified` | `Component` or `nil` | `nil` | A reference to `inst.player_classified` or a similar classified component, providing access to networked player-specific combat properties such as `lastcombattarget`, `minattackperiod`, and `canattack`. |
| `ondetachclassified` | `function` or `nil` | `nil` | An internal callback function used to detach the `classified` component. |
| `temp_iframes_keep_aggro` | `nil` | `nil` | An internal property mentioned in combat logic, though not explicitly initialized or used in this specific replica component's constructor. |

## Main Functions
### `AttachClassified(classified)`
*   **Description:** Attaches a `classified` component (typically `player_classified`) to this replica. This enables access to networked player-specific combat properties and sets up an event listener to detach it when the classified entity is removed.
*   **Parameters:**
    *   `classified`: (`Component`) The `classified` component to attach.

### `DetachClassified()`
*   **Description:** Detaches the currently associated `classified` component, clears the internal `ondetachclassified` callback, and resets `_laststartattacktime`.
*   **Parameters:** None.

### `SetTarget(target)`
*   **Description:** Sets the networked current combat target of the entity.
*   **Parameters:**
    *   `target`: (`Entity`) The entity to set as the target.

### `GetTarget()`
*   **Description:** Retrieves the current networked combat target of the entity.
*   **Parameters:** None.

### `SetLastTarget(target)`
*   **Description:** Sets the last combat target on the associated `classified` component, if one is available.
*   **Parameters:**
    *   `target`: (`Entity`) The entity to set as the last combat target.

### `IsRecentTarget(target)`
*   **Description:** Checks if the given target is either the current target or the last combat target recorded in the `classified` component. Delegates to the master combat component if present.
*   **Parameters:**
    *   `target`: (`Entity`) The entity to check.

### `SetIsPanic(ispanic)`
*   **Description:** Sets the networked panic state of the entity.
*   **Parameters:**
    *   `ispanic`: (`boolean`) `true` if the entity is panicking, `false` otherwise.

### `SetAttackRange(attackrange)`
*   **Description:** Sets the networked base attack range of the entity.
*   **Parameters:**
    *   `attackrange`: (`number`) The new base attack range value.

### `GetAttackRangeWithWeapon()`
*   **Description:** Calculates the effective attack range, combining the entity's base attack range with any additional range provided by an equipped weapon. Delegates to the master combat component if present.
*   **Parameters:** None.

### `GetWeaponAttackRange()`
*   **Description:** Returns the additional attack range provided specifically by the currently equipped weapon, if any.
*   **Parameters:** None.

### `GetWeapon()`
*   **Description:** Identifies and returns the currently equipped weapon in the `EQUIPSLOTS.HANDS` slot, considering specific weapon tags (e.g., "weapon", "projectile", "rangedweapon") and rider status. Delegates to the master combat component if present.
*   **Parameters:** None.

### `SetMinAttackPeriod(minattackperiod)`
*   **Description:** Sets the minimum attack period (cooldown duration) on the associated `classified` component, if available.
*   **Parameters:**
    *   `minattackperiod`: (`number`) The minimum time in seconds required between attacks.

### `MinAttackPeriod()`
*   **Description:** Retrieves the minimum attack period from either the master combat component or the `classified` component.
*   **Parameters:** None.

### `SetCanAttack(canattack)`
*   **Description:** Sets whether the entity is allowed to attack, storing this boolean value in the `classified` component.
*   **Parameters:**
    *   `canattack`: (`boolean`) `true` if the entity can attack, `false` otherwise.

### `StartAttack()`
*   **Description:** Notifies the master combat component of an attack start or, for client players, records the current game time for client-side cooldown calculations.
*   **Parameters:** None.

### `CancelAttack()`
*   **Description:** Notifies the master combat component of an attack cancellation or, for client players, clears the recorded `_laststartattacktime`.
*   **Parameters:** None.

### `InCooldown()`
*   **Description:** Checks if the entity is currently within an attack cooldown period. Delegates to the master combat component if present, otherwise uses a client-side calculation based on `_laststartattacktime` and `minattackperiod`.
*   **Parameters:** None.

### `CanAttack(target)`
*   **Description:** Determines if the entity can perform a basic attack against a given target. This client-side approximation checks target validity, cooldown status, entity state tags (e.g., "busy"), and whether the target is within attack range.
*   **Parameters:**
    *   `target`: (`Entity`) The potential target.

### `LocomotorCanAttack(reached_dest, target)`
*   **Description:** Determines if the entity's locomotor system allows for an attack. This client-side approximation considers movement goals (`reached_dest`), target validity, attack range, state tags, and specific weapon types (e.g., ranged).
*   **Parameters:**
    *   `reached_dest`: (`boolean`) `true` if the entity has reached its movement destination, potentially allowing a melee attack.
    *   `target`: (`Entity`) The potential target.

### `CanExtinguishTarget(target, weapon)`
*   **Description:** Checks if the entity, potentially using a specified weapon, possesses the capability to extinguish the given target (i.e., if the weapon or entity has the "extinguisher" tag and the target has "smolder" or "fire" tags).
*   **Parameters:**
    *   `target`: (`Entity`) The entity to check for extinguishing.
    *   `weapon`: (`Entity`, optional) The weapon being used.

### `CanLightTarget(target, weapon)`
*   **Description:** Checks if the entity, using a specific "rangedlighter" weapon, can light the given target (i.e., if the target has the "canlight" tag and is not already "on fire" or "burnt").
*   **Parameters:**
    *   `target`: (`Entity`) The entity to check for lighting.
    *   `weapon`: (`Entity`, optional) The weapon being used.

### `CanHitTarget(target)`
*   **Description:** Determines if the entity can physically "hit" (attack, extinguish, or light) the target. This involves checking if the target is valid, attackable (via its own replica combat component), and within the effective range. Delegates to the master combat component if present.
*   **Parameters:**
    *   `target`: (`Entity`) The potential target.

### `IsValidTarget(target)`
*   **Description:** Performs a comprehensive client-side check to determine if an entity is a generally valid target for combat interactions. This includes checks for validity, visibility, self-targeting, "spawnprotection", "shadow" or "playerghost" tags (relative to attacker sanity/craziness), and player-vs-player rules.
*   **Parameters:**
    *   `target`: (`Entity`) The potential target.

### `CanTarget(target)`
*   **Description:** Determines if the entity can logically acquire a given target. This takes into account the entity's panic state, various immunity tags on the target (e.g., "INLIMBO", "notarget", "invisible"), and restrictions related to riding peaceful mounts.
*   **Parameters:**
    *   `target`: (`Entity`) The potential target.

### `CanBeAlly(guy)`
*   **Description:** Checks if the given entity can be considered an ally. This is based on factors such as shared leaders, player status, companion tags, and whether the entity is hostile by default.
*   **Parameters:**
    *   `guy`: (`Entity`) The entity to check for alliance.

### `IsAlly(guy)`
*   **Description:** Determines if the given entity is an ally and is not currently targeting this entity.
*   **Parameters:**
    *   `guy`: (`Entity`) The entity to check.

### `TargetHasFriendlyLeader(target)`
*   **Description:** Checks if the target's leader is considered friendly to the current entity's leader. This is primarily used in scenarios involving followers, pets, and player-vs-player (PVP) settings.
*   **Parameters:**
    *   `target`: (`Entity`) The target entity to examine its leader.

### `CanBeAttacked(attacker)`
*   **Description:** Determines if the current entity can be attacked by a specified attacker. This comprehensive client-side check considers the entity's own immunity tags ("playerghost", "noattack", "invisible", "flight"), the attacker's type (player, insane), PVP status, and specific rules for shadow creatures.
*   **Parameters:**
    *   `attacker`: (`Entity`, optional) The entity attempting to attack this entity.

## Events & Listeners
*   `inst:ListenForEvent("onremove", self.ondetachclassified, classified)`: When a `classified` component is attached via `AttachClassified`, this component listens for the `onremove` event on that `classified` entity to automatically call `DetachClassified()`.