---
id: grassgatorbrain
title: Grassgatorbrain
description: Controls the AI decision-making behavior of the grass gator entity, including combat aggression, fleeing from danger, patrolling, and directional orientation toward nearby players or threats.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 1875b88e
---

# Grassgatorbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `GrassgatorBrain` component implements the behavior tree logic for the grass gator entity in Don't Starve Together. It defines the priority-ordered behavioral hierarchy governing when and how the grass gator chases, attacks, flees, or wanders. The component relies on shared behavior nodes (e.g., `ChaseAndAttack`, `RunAway`, `FaceEntity`, `Wander`) and integrates with the `BrainCommon` utility for state-aware logic such as salt-avoidance behavior. Behavior selection is conditional and context-sensitive, using timers, location knowledge, and distance-based thresholds to orchestrate realistic movement and combat responses.

## Dependencies & Tags
- **Components used:**
  - `inst.components.knownlocations` — used to retrieve the entity's `home` location (via `GetLocation("home")`) for wandering when submerged.
  - `inst.components.timer` — used to manage and check the `"facetarget"` timer for orientation logic (`StartTimer`, `TimerExists`).
- **Behaviors imported:**
  - `behaviours/wander`
  - `behaviours/faceentity`
  - `behaviours/chaseandattack`
  - `behaviours/runaway`
- **Tags referenced:**
  - `"notarget"` — used to exclude entities from targeting via `target:HasTag("notarget")`.
  - `"character"` — used in `HUNTER_PARAMS` as a required tag for target selection.
- **No tags are added or removed** by this component itself.

## Properties
No public instance properties are initialized directly in the constructor. All state is encapsulated in the behavior tree (`self.bt`) and runtime evaluation of function closures.

## Main Functions

### `GrassgatorBrain:OnStart()`
* **Description:** Initializes the behavior tree root node and assigns it to `self.bt`. Constructs a hierarchical priority tree that evaluates conditions in order of urgency: panic triggers first, then combat (chase/attack), then fleeing with face-orientation, face-orientation alone, and finally wandering. It excludes the tree from running while the entity is `"diving"`.
* **Parameters:** None (`self` is the only argument, as it is a method).
* **Returns:** `nil`.

## Events & Listeners
No event listeners or events are registered or pushed by this component. All state management and response handling occur through the behavior tree and conditional function evaluation (e.g., `GetFaceTargetFn`, `KeepFaceTargetFn`).