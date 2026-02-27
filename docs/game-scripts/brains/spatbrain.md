---
id: spatbrain
title: Spatbrain
description: Controls the behavioral logic for the Spat creature, managing combat prioritization, movement, weapon switching, and threat response via a behavior tree.
tags: [ai, combat, movement, behavior-tree]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 67216ffd
---

# Spatbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`spatbrain` implements the behavior tree for the Spat entity, a boss creature in Don't Starve Together. It manages high-priority threat responses such as panic triggers, weapon-specific attacks (melee and phlegm/projectile), fleeing when targeted by enemies, orientation toward nearby players, and routine wandering. The brain integrates with the `Brain` base class and leverages external behavior modules (`ChaseAndAttack`, `RunAway`, `FaceEntity`, `Wander`) and combat-related components (`combat`, `inventory`, `equippable`, `pinnable`) to orchestrate complex AI behavior dynamically.

## Usage example
This component is typically attached to an entity (e.g., `inst`) during its initialization. No direct manual calling of public methods is required—the brain activates automatically when `inst.components.brain:Start()` is invoked.

```lua
inst:AddComponent("brain")
inst.brain = Spatbrain(inst)
-- The behavior tree is constructed in Spatbrain:OnStart(), triggered by Brain component's Start() call.
```

## Dependencies & tags
**Components used:**
- `combat` (used for `target`, `InCooldown()`, `ResetCooldown()`)
- `inventory` (used for `Equip()` calls)
- `equippable` (used for `IsEquipped()` checks on weapons)
- `pinnable` (used for `IsValidPinTarget()` checks on combat targets)

**Tags:** None identified as directly added/removed by `spatbrain` itself. The behavior tree uses tag-based filtering (`HUNTER_PARAMS`) for target selection in `RunAway`.

## Properties
No public properties are declared in the constructor or method definitions. The class inherits from `Brain` and holds only `self.bt` (the behavior tree instance), which is assigned in `OnStart()`. All relevant state is encapsulated via functions and constants.

## Main functions
### `Spatbrain:OnStart()`
* **Description:** Initializes and constructs the behavior tree root node for the Spat. This function is called when the entity's brain component starts. It creates a priority-based behavior tree with nodes for panic handling, melee/phlegm attack conditions, fleeing, face-targeting, and wandering.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** If `BrainCommon.PanicTrigger`, `RunAway`, `FaceEntity`, `Wander`, or `ChaseAndAttack` are undefined or misconfigured, the behavior tree will fail to construct at runtime. No validation is performed at startup.

### `CanMeleeNow(inst)`
* **Description:** Determines whether the Spat should execute a melee attack. Returns true only if a valid target exists, the combat cooldown has expired, and the target is either not pinning-eligible or is a valid pin target (and thus should not be melee'd—see note), and the Spat is within `FORCE_MELEE_DIST` of the target.
* **Parameters:**
  - `inst`: The Spat entity instance.
* **Returns:** `true` if melee is appropriate, otherwise `false`.
* **Error states:** Returns `false` if `inst.components.combat.target` is `nil`, or if the combat cooldown is active, or if the `pinnable` component exists on the target but `IsValidPinTarget()` returns `true`.

### `EquipMeleeAndResetCooldown(inst)`
* **Description:** Equips the melee weapon (`inst.weaponitems.meleeweapon`) and resets the combat cooldown. Used when preparing to attack a target the Spat is stuck on or needs immediate melee engagement.
* **Parameters:**
  - `inst`: The Spat entity instance.
* **Returns:** None.
* **Error states:** Does nothing if the melee weapon is already equipped.

### `EquipMelee(inst)`
* **Description:** Equips the melee weapon without resetting cooldown. Used for general melee preparation when cooldown management is not required.
* **Parameters:**
  - `inst`: The Spat entity instance.
* **Returns:** None.
* **Error states:** Does nothing if the melee weapon is already equipped.

### `CanPhlegmNow(inst)`
* **Description:** Determines whether the Spat should shoot phlegm (projectile). Returns true only if a target exists, the target has the `pinnable` component and is a valid pin target, and the combat cooldown has expired.
* **Parameters:**
  - `inst`: The Spat entity instance.
* **Returns:** `true` if phlegm attack is appropriate, otherwise `false`.
* **Error states:** Returns `false` if `inst.components.combat.target` is `nil`, the target lacks `pinnable`, `IsValidPinTarget()` returns `false`, or the combat cooldown is active.

### `EquipPhlegm(inst)`
* **Description:** Equips the phlegm weapon (`inst.weaponitems.snotbomb`). Used to switch to the projectile weapon before launching phlegm.
* **Parameters:**
  - `inst`: The Spat entity instance.
* **Returns:** None.
* **Error states:** Does nothing if the phlegm weapon is already equipped.

## Events & listeners
None identified. The brain does not register or fire any events directly. It reacts to runtime conditions evaluated in node guards (e.g., `CanMeleeNow`, `CanPhlegmNow`) and uses the behavior tree execution loop for flow control.