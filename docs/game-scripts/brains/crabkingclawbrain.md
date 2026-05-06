---
id: crabkingclawbrain
title: Crabkingclawbrain
description: AI behavior tree for the Crab King's claw entity, managing combat, positioning, and wandering behaviors.
tags: [ai, brain, boss, combat]
sidebar_position: 10
last_updated: 2026-04-18
build_version: 722832
change_status: stable
category_type: brains
source_hash: 797755c5
system_scope: brain
---

# Crabkingclawbrain

> Based on game build **722832** | Last updated: 2026-04-18

## Overview
`Crabkingclawbrain` defines the AI behavior tree for the Crab King's claw entity in Don't Starve Together. This brain coordinates combat actions, boat-circling maneuvers, leash behavior, and wandering patterns. It integrates with the `combat` component for attack logic and `knownlocations` for spawn point tracking. The behavior tree uses a priority node structure where higher-priority actions (attacking) take precedence over movement behaviors. Configuration constants such as `WAMDER_DIST`, `TARGET_LEASH_DIST`, and `CRABKING_RADIUS` are defined at the module level (local variables) to tune movement constraints. These are not instance properties and cannot be modified per-entity.

## Usage example
```lua
local CrabkingClawBrain = require("brains/crabkingclawbrain")
local inst = CreateEntity()
inst:AddComponent("combat")
inst:AddComponent("knownlocations")
inst.crabking = crabking_entity -- reference to parent Crab King

-- Instantiate and run the brain
local brain = CrabkingClawBrain(inst)
RunBrain(inst, brain)
```

## Dependencies & tags
**External dependencies:**
- `behaviours/chaseandattack` -- chase and attack behavior node
- `behaviours/runaway` -- flee behavior node
- `behaviours/wander` -- wandering behavior node
- `behaviours/doaction` -- action execution behavior node
- `behaviours/attackwall` -- wall attack behavior node
- `behaviours/panic` -- panic behavior node
- `behaviours/minperiod` -- minimum period behavior node
- `behaviours/leash` -- leash constraint behavior node
- `behaviours/leashandavoid` -- leash with avoidance behavior node

**Components used:**
- `combat` -- checks `InCooldown()`, accesses `target` and `attackrange` properties
- `knownlocations` -- calls `GetLocation()` and `RememberLocation()` for spawn point tracking
- `hull` -- calls `GetRadius()` on platform entities for circle boat calculation

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bt` | table | `nil` | Behavior tree instance created in OnStart() |

## Main functions
### `CrabkingClawBrain(inst)`
* **Description:** Constructor that initializes the brain for the given entity instance. Calls parent Brain constructor.
* **Parameters:** `inst` -- the entity instance this brain controls
* **Returns:** Brain instance
* **Error states:** None

### `OnStart()`
* **Description:** Initializes the behavior tree root node with priority-ordered behaviors. Sets up attack, circle boat, leash/avoid, and wander nodes in descending priority order.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.inst.components.combat` or `self.inst.components.knownlocations` are not present on the entity.

### `OnInitializationComplete()`
* **Description:** Records the entity's current world position as the "spawnpoint" location for wander behavior reference.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.inst` is nil or if `self.inst.components.knownlocations` is not present on the entity. Errors if `self.inst.Transform` is nil when calling `GetWorldPosition()`.

### `findavoidanceobjectfn(inst)`
* **Description:** Returns the Crab King entity reference for avoidance calculations.
* **Parameters:** `inst` -- the claw entity instance
* **Returns:** Crab King entity instance or `nil` if `inst.crabking` is not set
* **Error states:** None

### `AttackTarget(inst)`
* **Description:** Creates an attack action if combat cooldown is ready, target exists, and target is within attack range. Faces the target before attacking.
* **Parameters:** `inst` -- the claw entity instance
* **Returns:** `BufferedAction` instance if attack conditions met, `nil` otherwise
* **Error states:** Errors if `inst.components.combat` is nil. Errors if `target:GetPosition()` returns nil (no guard before `inst:FacePoint()` call).

### `CircleBoat(inst)`
* **Description:** Calculates a circular positioning point around the target's boat platform. Used for leash and avoid behavior to maintain distance while circling.
* **Parameters:** `inst` -- the claw entity instance
* **Returns:** `Vector3` position for circling, or `nil` if target or platform not found
* **Error states:** Errors if `inst.components.combat` is nil. Errors if `platform.components.hull` is nil (no guard before `GetRadius()` call). Errors if `target.Transform` or `platform.Transform` is nil (no guard before `GetWorldPosition()` calls).

## Events & listeners
None.