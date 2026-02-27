---
id: birchnutdrakebrain
title: Birchnutdrakebrain
description: Implements AI behavior for the Birchnutdrake entity by defining its behavior tree, including panic responses, leash mechanics, combat, and home position tracking.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 96e3aff6
---

# Birchnutdrakebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This component implements the behavior tree for the Birchnutdrake entity, an AI-controlled character in Don't Starve Together. It defines how the entity responds to threats (panic), navigates within a leashed range from its spawn point, pursues and attacks targets, and manages idle states. The component relies on common behavior utilities and integrates with the `knownlocations` component to track the entity's home position.

## Dependencies & Tags
- **Components used:** `knownlocations` (used via `inst.components.knownlocations` for `GetLocation` and `RememberLocation`)
- **Tags:** None identified

## Properties
No public properties are initialized in the constructor. All state is encapsulated within the class methods.

## Main Functions
### `BirchNutDrakeBrain:OnStart()`
* **Description:** Initializes and assigns the entity's behavior tree. The behavior tree root is built using a priority sequence of behaviors: panic triggers (electric fence, general panic), leash logic, chase and attack, and a final fallback action to exit combat/idle.
* **Parameters:** None
* **Returns:** None

### `BirchNutDrakeBrain:OnInitializationComplete()`
* **Description:** Records the entity's current position as the "spawnpoint" home location using the `knownlocations` component. This position is used later by the leashed behavior to determine how far the entity may wander.
* **Parameters:** None
* **Returns:** None

### `GetHomePos(inst)`
* **Description:** Helper function used by the leashed behavior to retrieve the stored spawn point location. Used to compute distance for leash enforcement.
* **Parameters:**
  * `inst` — The entity instance. Expected to have a `knownlocations` component.
* **Returns:** `Vector3` — The position stored under the key `"spawnpoint"`.

## Events & Listeners
- **Listens to:** None
- **Pushes:**
  - `"exit"` — Fired in the fallback action node of the behavior tree (used to signal the entity should stop active behaviors and enter an idle state). Payload includes `{ force = true, idleanim = true }`.

## Notes
- Uses `PriorityNode` with timeout `0.25` for behavior evaluation.
- The `ChaseAndAttack` behavior is configured with attack ranges `12` and `21`.
- The `Leash` behavior allows wandering up to `20` units from home before pulling the entity back within `5` units.