---
id: glommerbrain
title: Glommerbrain
description: Defines the behavior tree for Glommer, governing movement, following, wandering, and panic responses in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: f320cd79
---

# Glommerbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `glommerbrain` component implements the decision-making logic for the Glommer entity in Don't Starve Together. It defines a behavior tree (`BT`) that orchestrates core movement and reaction behaviors: following its leader, wandering when no leader is present or conditions permit, facing its leader, and responding to panic-inducing stimuli such as proximity to electric fences or other threats. The brain inherits from `Brain` and uses shared utilities (`BrainCommon`) and custom helper functions to determine targets and positions.

This component interacts directly with the `follower` component to resolve the current leader and relies on behavior classes (`Follow`, `Wander`, `FaceEntity`) to execute specific movement patterns.

## Dependencies & Tags

- **Components used:**
  - `follower` (used via `inst.components.follower:GetLeader()`)
- **Tags:** None identified.

## Properties

No explicit public properties are defined in the constructor. The component stores its behavior tree in `self.bt` during initialization but does not declare additional state beyond inherited `Brain` fields.

## Main Functions

### `GlommerBrain:OnStart()`
* **Description:** Initializes the behavior tree root node. This method is called automatically when the brain component starts and sets up a priority-based behavior tree (`PriorityNode`) with six decision branches evaluated in order. Execution falls through from high-priority behaviors (e.g., panic) to lower-priority ones (e.g., wandering) based on triggering conditions.
* **Parameters:** None.
* **Returns:** None.

#### Behavior Tree Structure (Internal)

The `root` node is constructed as a `PriorityNode` with the following ordered sub-nodes:

1. **`BrainCommon.PanicTrigger(self.inst)`**  
   Triggers panic behavior (e.g., fleeing) under threat conditions.

2. **`BrainCommon.ElectricFencePanicTrigger(self.inst)`**  
   Triggers panic specifically when Glommer approaches an active electric fence.

3. **`DoAction(self.inst, WanderOff)`**  
   Executes the `WanderOff` action, which issues a `GOHOME` action if `inst.ShouldLeaveWorld` is true.

4. **`Follow(...)`**  
   Activates follow behavior: moves Glommer toward its leader, maintaining a target distance of 4 units, with minimum and maximum follow distances of 0 and 6 respectively.

5. **`FaceEntity(...)`**  
   Ensures Glommer always faces its leader. Uses `GetFaceTargetFn` to resolve the target and `KeepFaceTargetFn` to verify the target hasn't changed.

6. **`Wander(...)`**  
   If no higher-priority behavior executes, initiates wandering within a radius of 10 units around the leader’s position.

All behaviors are evaluated every tick, with the highest-priority enabled branch taking precedence.

## Events & Listeners

None identified. The brain does not register any event listeners or push custom events directly. Its logic is driven entirely by behavior tree evaluation and component interaction (`follower` component state changes implicitly affect behavior via helper functions).