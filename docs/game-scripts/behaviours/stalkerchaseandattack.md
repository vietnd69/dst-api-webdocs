---
id: stalkerchaseandattack
title: Stalkerchaseandattack
description: A deprecated behaviour component that extends ChaseAndAttackAndAvoid with fixed avoidance distance (6 units) for stalker-type entities; retained only for backward compatibility with existing mods.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: 3cda3791
---

# Stalkerchaseandattack

## Overview
`StalkerChaseAndAttack` is a deprecated behaviour component intended for use by entities that need to chase, attack, and avoid specific obstacles—specifically designed for "stalker"-type enemies (e.g., Stalkers in the game). It inherits from `ChaseAndAttackAndAvoid` and hardcodes the avoidance distance to `6` units (meant to accommodate the stargate radius, stalker radius, and minimal breathing room). As noted in the source, this component is retained solely for mod backward compatibility, and modders are explicitly encouraged to use `ChaseAndAttackAndAvoid` directly instead.

It does not introduce new logic but configures the parent class with fixed parameters optimized for the stalker archetype.

## Dependencies & Tags
- **Components used:** None directly accessed via `inst.components.X`; relies entirely on parent class `ChaseAndAttackAndAvoid`.
- **Tags:** None added, removed, or checked.

## Properties
No public properties are declared or initialized in `StalkerChaseAndAttack`. All behavior is delegated to `ChaseAndAttackAndAvoid` after constructor configuration.

## Main Functions
### `StalkerChaseAndAttack(inst, findavoidanceobjectfn, max_chase_time, give_up_dist, max_attacks, findnewtargetfn, walk)`
* **Description:** Constructor. Initializes the behaviour by calling the parent `ChaseAndAttackAndAvoid._ctor` with fixed `avoid_dist = 6`, plus the provided parameters. This function sets up AI logic for chasing a target, attacking on contact, and avoiding specific objects within the specified distance.
* **Parameters:**
  - `inst`: The entity instance to which this behaviour is attached.
  - `findavoidanceobjectfn`: A function returning an avoidance target object (e.g., a stargate).
  - `max_chase_time`: Maximum time (in seconds) the entity will chase a target before giving up.
  - `give_up_dist`: Distance threshold beyond which the entity stops chasing if it can’t close the gap.
  - `max_attacks`: Maximum number of consecutive attacks before pausing or resetting.
  - `findnewtargetfn`: A function to locate a new valid target (if current target becomes invalid).
  - `walk`: Boolean indicating whether to move by walking (as opposed to running/sprinting).
* **Returns:** `nil`. The constructed instance is attached to `self`.

## Events & Listeners
None identified. This component does not directly register or fire events; event handling is inherited from `ChaseAndAttackAndAvoid`.