---
id: bird_mutant_brain
title: Bird Mutant Brain
description: Controls the AI behavior of the Mutant Bird (both pecker and spitter variants), coordinating combat, movement, skeleton breaking, and spitting mechanics via behavior tree execution.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 8581e4ae
---

# Bird Mutant Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `BirdMutantBrain` component implements the behavior tree logic for Mutant Birds (both `bird_mutant` and `bird_mutant_spitter` variants) in Don't Starve Together. It coordinates core behaviors such as panic, wall breaking, skeleton shattering, chasing and attacking swarm targets, and—specifically for spitter variants—spitting projectiles. This brain uses a priority-based behavior tree to evaluate high-priority triggers (e.g., panic, electric fences) before falling back to routine tasks like movement and combat.

Key external dependencies include the `combat` component for attack targeting and cooldown management, `entitytracker` for locating swarm targets, and several predefined behaviors (`chaseandattack`, `panic`, `attackwall`, `leash`, `standstill`) imported via the behaviors module.

## Dependencies & Tags
- **Components used:** `combat`, `entitytracker`, `follower`, `timer`, `workable`
- **Tags:** `bird_mutant_spitter` (conditional logic branch), `playerskeleton`, `HAMMER_workable`

## Properties
No public properties are initialized or exposed by this brain component itself. Behavior state is maintained internally via the behavior tree node hierarchy and component-accessed variables (e.g., `inst.components.combat.target`).

## Main Functions
No public methods are defined outside the constructor. The core behavior logic resides in the `OnStart()` method, which constructs and initializes the behavior tree.

### `BirdMutantBrain:OnStart()`
* **Description:** Constructs and assigns the behavior tree for the Mutant Bird. Builds a priority-ordered sequence of behavior nodes, optionally extending it for spitter variants with spitting logic.
* **Parameters:** None (method of the class).
* **Returns:** `nil`. The constructed `PriorityNode` tree is stored in `self.bt`.

The behavior tree sequence (in order of priority) includes:
1. Panic triggers (electric fence, general panic).
2. For *spitter variants only*:
   - `WhileNode` for continuous spitting while in range (`shouldspit`).
   - `IfNode` to enter a `StandStill` node when very close to target (`shouldwaittospit`).
3. Skeleton breaking and wall attacking sequence (always executed first among core actions).
4. Attack node, triggered if a valid target is within range (`CanBirdAttack`).
5. Movement node (chase swarm target via `Leash`).
6. Stand-still node (to approach/swarm near target).
7. General panic fallback.

## Events & Listeners
This component does not register any event listeners or fire custom events directly. Behavior transitions and state management are handled entirely through the behavior tree nodes and their action functions.