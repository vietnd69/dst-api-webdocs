---
id: catcoonbrain
title: Catcoonbrain
description: Defines the behavior tree AI for Catcoon entities, managing following, playing, hairball throwing, and homing behaviors.
tags: [ai, brain, catcoon, behavior]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: brains
source_hash: 69f1749c
system_scope: brain
---

# Catcoonbrain

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`CatcoonBrain` is a behavior tree brain that controls Catcoon AI entities in Don't Starve Together. It manages complex behaviors including following a leader entity, playing with cat toys, throwing hairballs at intervals, returning home when raining or inventory is full, and avoiding players. The brain integrates with multiple components to determine valid actions and prioritizes behaviors through a PriorityNode structure.

## Usage example
```lua
local CatcoonBrain = require "brains/catcoonbrain"
local inst = SpawnPrefab("catcoon")
RunBrain(inst, CatcoonBrain)
-- Brain automatically manages following, playing, hairball throwing, and homing
```

## Dependencies & tags
**External dependencies:**
- `behaviours/follow` -- Follow behavior node for leader tracking
- `behaviours/wander` -- Wander behavior node for idle movement
- `behaviours/faceentity` -- FaceEntity behavior for orientation toward leader
- `behaviours/runaway` -- RunAway behavior for player avoidance
- `behaviours/leash` -- Leash behavior for home tethering
- `brains/braincommon` -- Common brain utility functions (PanicWhenScared, PanicTrigger, ElectricFencePanicTrigger)

**Components used:**
- `homeseeker` -- Gets home position and validates home entity
- `burnable` -- Checks if home is burning via `IsBurning()`
- `follower` -- Gets leader via `GetLeader()` and loyalty via `GetLoyaltyPercent()`
- `inventory` -- Checks if inventory is full via `IsFull()`
- `cattoy` -- Checks toy state via `ShouldBypassLastAirTime()`

**Tags:**
- `cattoy`, `cattoyairborne`, `catfood` -- Target tags for play actions
- `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `stump`, `burnt`, `notarget`, `flight`, `fire`, `irreplaceable` -- Exclusion tags for entity search
- `player` -- Tag used for RunAway behavior avoidance

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bt` | BehaviorTree | `nil` | The behavior tree instance created in OnStart() |
| `inst` | Entity | `nil` | The Catcoon entity instance (inherited from Brain) |

## Main functions
### `CatcoonBrain(inst)`
* **Description:** Constructor that initializes the CatcoonBrain instance and calls the parent Brain constructor.
* **Parameters:** `inst` -- The Catcoon entity instance that will own this brain.
* **Returns:** CatcoonBrain instance.
* **Error states:** None

### `OnStart()`
* **Description:** Builds and assigns the behavior tree when the brain starts. Creates a PriorityNode with 14 behavior nodes including panic responses, hairball throwing, chasing, following, homing, playing, facing leader, leashing, running away, and wandering.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.inst` is nil when behavior nodes reference the entity.

### `restore_toy_tag(targ, tag)`
* **Description:** Local helper function that restores a tag to a target entity after play action completes.
* **Parameters:**
  - `targ` -- Target entity to restore tag on
  - `tag` -- String tag name to restore
* **Returns:** None
* **Error states:** None

### `PlayAction(inst)`
* **Description:** Finds and creates a play action for cat toys or cat food. Returns nil if entity is busy or air time cooldown is active. Removes target tag temporarily and schedules restoration after 30 seconds.
* **Parameters:** `inst` -- Catcoon entity instance
* **Returns:** BufferedAction for CATPLAYAIR or CATPLAYGROUND, or `nil` if no valid target or conditions not met.
* **Error states:** Errors if `inst.sg` is nil when checking state tags.

### `HasValidHome(inst)`
* **Description:** Checks if the Catcoon has a valid home entity that is not burning or burnt.
* **Parameters:** `inst` -- Catcoon entity instance
* **Returns:** `true` if home exists, is valid, and is not burning/burnt; `false` otherwise.
* **Error states:** None

### `GetLeader(inst)`
* **Description:** Retrieves the leader entity from the follower component.
* **Parameters:** `inst` -- Catcoon entity instance
* **Returns:** Leader entity instance or `nil` if no follower component or no leader set.
* **Error states:** None

### `GetNoLeaderHomePos(inst)`
* **Description:** Returns home position only if the Catcoon has no leader. Used by Leash behavior.
* **Parameters:** `inst` -- Catcoon entity instance
* **Returns:** Home position vector or `nil` if has leader or no valid home.
* **Error states:** None

### `GetFaceTargetFn(inst)`
* **Description:** Returns the leader entity for face entity behavior.
* **Parameters:** `inst` -- Catcoon entity instance
* **Returns:** Leader entity or `nil`.
* **Error states:** None

### `KeepFaceTargetFn(inst, target)`
* **Description:** Validates if the current face target is still the leader.
* **Parameters:**
  - `inst` -- Catcoon entity instance
  - `target` -- Current face target entity
* **Returns:** `true` if target equals leader, `false` otherwise.
* **Error states:** None

### `GoHomeAction(inst)`
* **Description:** Creates a GOHOME action to return to the Catcoon den. Schedules raining state if home is invalid or burning.
* **Parameters:** `inst` -- Catcoon entity instance
* **Returns:** BufferedAction for GOHOME, or `nil` if home is invalid.
* **Error states:** None

### `ShouldHairball(inst)`
* **Description:** Determines if the Catcoon should throw a hairball based on time intervals. Uses different intervals for friend (with leader) vs neutral (no leader) states.
* **Parameters:** `inst` -- Catcoon entity instance
* **Returns:** `true` if hairball should be thrown, `false` otherwise.
* **Error states:** None

### `HairballAction(inst)`
* **Description:** Creates a HAIRBALL action targeting the leader if present, or nil target otherwise.
* **Parameters:** `inst` -- Catcoon entity instance
* **Returns:** BufferedAction for HAIRBALL, or `nil` if entity is busy.
* **Error states:** Errors if `inst.sg` is nil when checking busy state tag.

### `WhineAction(inst)`
* **Description:** Creates a CATPLAYGROUND action toward leader when loyalty is very low (below 3%). Used to regain leader attention.
* **Parameters:** `inst` -- Catcoon entity instance
* **Returns:** BufferedAction for CATPLAYGROUND, or `nil` if entity is busy, no leader, or loyalty >= 3%.
* **Error states:** Errors if `inst.sg` is nil when checking busy state tag.

## Events & listeners
None identified.