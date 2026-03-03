---
id: bird_mutant_brain
title: Bird Mutant Brain
description: Controls AI behavior for mutant bird entities, including swarming, combat, skeleton breaking, and (for spitters) projectile spitting.
tags: [ai, combat, boss, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 8581e4ae
system_scope: brain
---

# Bird Mutant Brain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BirdMutantBrain` is an AI brain component that governs the behavior of mutant bird entities in Don't Starve Together. It defines a behavior tree (`BT`) containing sequences and conditional nodes that handle movement toward a tracked swarm target, combat engagement, wall-patrolling, skeleton breaking, and conditional spit attacks (for spitter variants). The brain integrates with core systems such as `combat`, `entitytracker`, `workable`, and `timer`, and uses common helper behaviors like `chaseandattack`, `panic`, and `leash`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("bird_mutant_spitter") -- optional, enables spit logic
inst:AddComponent("combat")
inst:AddComponent("entitytracker")
inst:AddComponent("timer")
inst:AddComponent("workable")
inst:AddComponent("follower")
inst:AddBrain("bird_mutant_brain")
```

## Dependencies & tags
**Components used:** `combat`, `entitytracker`, `timer`, `workable`, `follower`.  
**Tags:** Checks `bird_mutant_spitter` (alters behavior tree); uses `player`, `playerskeleton`, `HAMMER_workable`.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree (`self.bt`) based on entity state and tags. Constructs the root `PriorityNode` with the full behavior sequence, including conditional spit/spit-wait logic if `bird_mutant_spitter` is present.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified.

## Helper Functions (Internal)
The following helper functions are defined locally and used within the behavior tree:
- `GetSwarmTarget(inst)`: Returns the entity stored under `"swarmTarget"` in `entitytracker`.
- `GetSwarmTargetPos(inst)`: Returns the world position of the swarm target, or `nil`.
- `CanBirdAttack(inst)`: Returns a valid combat target if conditions (cooldown, state, range, or nearby players) are met; otherwise `nil`.
- `AttackTarget(inst)`: Invokes `combat:TryAttack` on the target returned by `CanBirdAttack`.
- `BreakSkeletons(inst)`: Finds a nearby skeleton tagged with `playerskeleton` or `HAMMER_workable`, and calls `workable:WorkedBy(self.inst, 1)`.
- `shouldspit(inst)`: Returns `true` if a valid combat target is within `TUNING.MUTANT_BIRD_SPIT_RANGE` and the `"spit_cooldown"` timer does not exist.
- `spit(inst)`: Returns a buffered `TOSS` action on the combat target.
- `shouldwaittospit(inst)`: Returns `true` if the combat target is within 4 game units (2 tiles) and is valid.
