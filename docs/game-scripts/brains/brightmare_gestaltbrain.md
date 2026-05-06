---
id: brightmare_gestaltbrain
title: Brightmare Gestaltbrain
description: Defines the behavior tree AI for the Brightmare Gestalt entity with level-based combat and avoidance patterns.
tags: [ai, brain, boss, combat]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: brains
source_hash: c803692b
system_scope: brain
---

# Brightmare Gestaltbrain

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`Brightmare Gestaltbrain` is a behavior tree brain that controls the AI for the Brightmare Gestalt entity. It implements multi-level behavior patterns that change based on `behaviour_level` (1, 2, or 3), with increasing aggression and combat capabilities at higher levels. The brain handles relocation, shadow creature avoidance, player avoidance/chase logic, and wandering behavior. It integrates with the `combat` component for attack targeting and cooldown management.

## Usage example
```lua
local inst = SpawnPrefab("brightmare_gestalt")
local BrainClass = require("brains/brightmare_gestaltbrain")
RunBrain(inst, BrainClass)

-- Behavior changes based on level
inst.behaviour_level = 2
-- Brain automatically adjusts AI priorities based on level
```

## Dependencies & tags
**External dependencies:**
- `behaviours/follow` -- provides Follow behavior node for chasing targets
- `behaviours/wander` -- provides Wander behavior node for random movement
- `behaviours/standstill` -- provides StandStill behavior node for stationary states
- `brains/braincommon` -- provides shared brain utility functions including PossessChassisNode

**Components used:**
- `combat` -- accesses `target` property, calls `DropTarget()` and `InCooldown()` methods

**Tags:**
- `nightmarecreature`, `shadowcreature`, `shadow`, `shadowminion`, `stalker`, `stalkerminion`, `nightmare`, `shadow_fire` -- checked in SHADOW_TAGS for avoidance behavior
- `jumping`, `busy` -- state tags checked to determine relocation eligibility

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions
### `GestaltBrain:new(inst)`
* **Description:** Constructor that initializes the brain instance. Calls the parent Brain constructor to set up the basic brain structure attached to the entity.
* **Parameters:** `inst` -- the entity instance that will own this brain
* **Returns:** New GestaltBrain instance
* **Error states:** None

### `GestaltBrain:OnStart()`
* **Description:** Initializes and builds the behavior tree when the brain starts running. Creates a PriorityNode root with nested behavior nodes for relocation, avoidance, combat, and wandering. The tree structure changes based on `inst.behaviour_level` (1, 2, or 3) with different aggression patterns at each level.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.inst` is nil when accessing components or stategraph methods. Errors if `combat` component is not present on the entity when combat-related nodes execute.

### `ShouldRelocate(inst)`
* **Description:** Determines if the entity should relocate based on current state. Returns true if the entity is not ignoring relocation, not in a busy state, and either has no tracking target or is far from players.
* **Parameters:** `inst` -- the entity instance to check
* **Returns:** boolean -- true if relocation should occur
* **Error states:** Errors if `inst.sg` (stategraph) is nil or missing `HasStateTag` method. Errors if `inst:IsNearPlayer` method does not exist.

### `Relocate(inst)`
* **Description:** Triggers the relocate state on the entity's stategraph. Called when ShouldRelocate returns true to initiate relocation behavior.
* **Parameters:** `inst` -- the entity instance to relocate
* **Returns:** None
* **Error states:** Errors if `inst.sg` is nil or `GoToState` method is unavailable.

### `onrunaway(target, inst)`
* **Description:** Callback function executed when the entity runs away from a target. Drops the current combat target to disengage from fighting during avoidance behavior.
* **Parameters:**
  - `target` -- the entity being avoided
  - `inst` -- the entity performing the runaway behavior
* **Returns:** boolean -- always returns true to indicate successful runaway
* **Error states:** Errors if `inst.components.combat` is nil or `DropTarget` method is unavailable.

## Events & listeners
- **Listens to:** None identified
- **Pushes:** None identified