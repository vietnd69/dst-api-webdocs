---
id: lightninggoatbrain
title: Lightninggoatbrain
description: Implements the behavior tree for the Lightning Goat entity, managing its responses to threats, targeting, navigation, and salt-lick anchoring.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: c55cf3aa
---

# Lightninggoatbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component defines the behavior tree for the Lightning Goat entity. It orchestrates high-level actions—including chasing and attacking targets, fleeing from danger, wandering, and anchoring to saltlicks—by prioritizing sequences of low-level behaviors such as `ChaseAndAttack`, `RunAway`, `Wander`, and `FaceEntity`. It integrates closely with the `combat`, `knownlocations`, and `BrainCommon` modules to make context-aware decisions based on game state (e.g., day/night) and entity status.

## Dependencies & Tags
- **Components used:**
  - `combat`: accessed via `self.inst.components.combat.target` to check for active targeting.
  - `knownlocations`: used to store (`RememberLocation`) and retrieve (`GetLocation`) world positions, notably for herd and spawnpoint anchoring.
- **Tags:** Uses and respects the `"notarget"` tag to filter valid targets (e.g., in `GetFaceTargetFn` and `HUNTER_PARAMS`).
- **Behaviors imported:** `chaseandattack`, `runaway`, `wander`, `doaction`, `attackwall`, `minperiod`, and `BrainCommon`.

## Properties
No public instance properties are explicitly initialized in the constructor. All state is encapsulated in the behavior tree root (`self.bt`) and internal helper functions (`GetFaceTargetFn`, `KeepFaceTargetFn`, `GetWanderDistFn`).

## Main Functions

### `LightningGoatBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree root node. It constructs a priority-ordered sequence that dictates how the Lightning Goat behaves under different conditions—prioritizing panic, target engagement, combat, orientation, evasion, anchoring, and idle wandering.
* **Parameters:** None.
* **Returns:** None.

### `LightningGoatBrain:OnInitializationComplete()`
* **Description:** Records the Lightning Goat’s initial position as `"spawnpoint"` in its `knownlocations` component for potential later use (e.g., returning to a base).
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
None identified. This brain does not register any event listeners or push custom events directly; it operates entirely through behavior tree execution.