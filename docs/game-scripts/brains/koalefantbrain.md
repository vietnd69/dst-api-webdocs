---
id: koalefantbrain
title: Koalefantbrain
description: Manages the behavior tree logic for the Koalefant, handling aggression, fleeing, wandering, and salt-lick anchoring based on game state and proximity.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 96e2a41c
---

# Koalefantbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`Koalefantbrain` is a brain component responsible for defining the Koalefant's AI behavior through a priority-based behavior tree. It orchestrates high-priority reactive actions (e.g., panic, fleeing, aggression) and lower-priority ambient behaviors (e.g., wandering, anchoring to saltlicks). The component relies on shared brain utilities from `braincommon.lua`, particularly `PanicTrigger`, `ElectricFencePanicTrigger`, and `AnchorToSaltlick`, as well as custom logic for face-targeting and ran-away behavior. It integrates standard DST behavior nodes (`ChaseAndAttack`, `RunAway`, `Wander`, `FaceEntity`) into a prioritized hierarchy to determine the Koalefant's current action based on environmental and state conditions.

## Dependencies & Tags
- **Components used:** None directly accessed via `inst.components.X` in this file (dependencies are limited to behavior and brain utilities).
- **Tags checked:** `notarget` (used to filter out invalid face/rage targets during pursuit or facing decisions).
- **Tags added/removed:** None identified.

## Properties
No public instance properties are initialized in the constructor or `OnStart`. The component primarily holds an internal `self.bt` (behavior tree) reference set in `OnStart`, but this is not exposed as a documented property.

## Main Functions
### `KoalefantBrain:OnStart()`
* **Description:** Initializes the behavior tree root node. This function configures the Koalefant's behavior tree using a `PriorityNode`, ordering behaviors by priority: panic (highest), aggression/chase, flee + face sequence, solo facing, salt-lick anchoring, and finally wandering (lowest). The tree is assigned to `self.bt`.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
This component does not register or fire any events directly. It operates entirely within the DST behavior tree system, relying on behavior node internals for state updates and event propagation.

## Additional Notes
- **`MAX_CHASE_TIME` (6)**: Maximum duration (in seconds) the Koalefant will continue chasing a target.
- **`WANDER_DIST_DAY` (20)** and **`WANDER_DIST_NIGHT` (5)**: Distance thresholds used for wandering behavior; note these are referenced in `wander.lua` but not directly used in this file.
- **`RUN_AWAY_DIST` (6)** and **`STOP_RUN_AWAY_DIST` (12)**: Distances controlling when Koalefant begins and ceases fleeing from hunters.
- **`START_FACE_DIST` (14)** and **`KEEP_FACE_DIST` (20)**: Distances determining when Koalefant initiates and maintains facing behavior toward a target.
- **`HUNTER_PARAMS`**: A table `{ tags = { "character" }, notags = { "notarget" } }` used to define valid targets for `RunAway`.