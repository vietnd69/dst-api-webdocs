---
id: mandrakebrain
title: Mandrakebrain
description: Implements the behavior tree for the Mandrake entity, managing its movement and orientation relative to its leader using follow, face, and wander subbehaviors.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: ba9cf6b0
---

# Mandrakebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component defines the behavioral logic for the Mandrake entity in Don't Starve Together. It utilizes a behavior tree (`BT`) to orchestrate high-level actions such as panicking, following its leader, maintaining orientation toward the leader, and wandering when no leader is present. The brain inherits from `Brain` and composes lower-level behaviors (`Follow`, `FaceEntity`, `Wander`) provided by the game's behavior library. It leverages the `follower` component to locate the current leader and supports dynamic leader changes.

## Dependencies & Tags
- **Components used:**
  - `follower` — accessed via `inst.components.follower:GetLeader()` to retrieve the entity's leader.
- **Tags:** None identified.
- **Behaviors used:** `Follow`, `FaceEntity`, `Wander` (loaded from `behaviours/` directory).

## Properties
No public instance properties are declared in the constructor or elsewhere. Internal state is maintained via `self.bt` (behavior tree) and inherited `Brain` properties.

## Main Functions

### `MandrakeBrain:OnStart()`
* **Description:** Initializes the behavior tree root node with a prioritized sequence of subbehaviors. This function is called automatically when the brain component starts governing the entity's behavior.
* **Parameters:** None.
* **Returns:** None.

The root behavior tree is constructed as a `PriorityNode` with the following children, evaluated in order:
1. `BrainCommon.PanicTrigger(self.inst)` — high-priority panic response (e.g., flee from fire, enemies).
2. `BrainCommon.ElectricFencePanicTrigger(self.inst)` — high-priority response to electric fences.
3. `Follow(self.inst, GetLeader, MIN_FOLLOW_DIST, TARGET_FOLLOW_DIST, MAX_FOLLOW_DIST)` — moves the entity to maintain a distance between 2 and 8 units from its leader, preferring a distance of 3 units.
4. `FaceEntity(self.inst, GetLeader, KeepFaceTargetFn)` — ensures the entity faces its leader, using `KeepFaceTargetFn` to confirm the leader remains valid.
5. `Wander(self.inst)` — fallback wandering behavior when no leader is present.

The `PriorityNode` allows the behavior tree to execute the first applicable behavior from this list. The `GetLeader` helper function is used consistently to fetch the leader from the `follower` component.

## Events & Listeners
None identified. This component does not register or emit events directly; it relies on the behavior tree framework and the game's event-driven behavior system (e.g., panics, movement updates) to react to the game state.