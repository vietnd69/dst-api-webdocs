---
id: alterguardian_phase2brain
title: Alterguardian Phase2Brain
description: Controls the decision-making behavior of the Alterguardian boss during its second combat phase, prioritizing chasing and attacking players while maintaining orientation and wander patterns.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 78582173
---

# Alterguardian Phase2Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This brain component defines the AI behavior for the Alterguardian during Phase 2 of its encounter. It uses a behavior tree (BT) to orchestrate high-level decision-making, combining `ChaseAndAttack`, `FaceEntity`, and `Wander` behaviors. The brain ensures the boss rotates toward the nearest valid player within range, pursues and attacks targets aggressively, and periodically wanders near its spawn point when no valid targets are present. It integrates with the `knownlocations` component to remember and reference its initial position as a home point for wandering.

## Dependencies & Tags
- **Components used:** `knownlocations` (accessed via `inst.components.knownlocations`)
- **Tags:** The brain references the `"notarget"` tag when evaluating potential targets but does not add or remove it itself.

## Properties
No public instance properties are initialized in the constructor beyond inherited brain state. The behavior tree (`self.bt`) is assigned during `OnStart`.

## Main Functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree root node. This sets up a hierarchical priority structure: the boss performs `ChaseAndAttack` if a target is within range, otherwise orients itself toward the closest valid player (`FaceEntity`), and falls back to `Wander` near its spawn point if neither condition applies. A conditional wrapper (`WhileNode`) prevents all these behaviors from running while the entity is in the `"spin"` state tag (i.e., during spin attacks).
* **Parameters:** None.
* **Returns:** None.

### `OnInitializationComplete()`
* **Description:** Records the Alterguardian's current position as `"spawnpoint"` in its `knownlocations` component. This location is later used by the `Wander` behavior as its home point.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
No explicit event listeners are registered in this component. The behavior tree handles state transitions internally and does not rely on custom event firing or listening in this class.