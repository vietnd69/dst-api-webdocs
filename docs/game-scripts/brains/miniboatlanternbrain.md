---
id: miniboatlanternbrain
title: Miniboatlanternbrain
description: Controls the movement behavior of the Mini Boat Lantern entity, making it wander while staying in ocean tiles and maintaining a reference to its home location.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: d3dcc53e
---

# Miniboatlanternbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `MiniBoatLanternBrain` is a brain component that governs the autonomous movement logic for the Mini Boat Lantern entity. It uses a behavior tree to implement conditional wandering: the entity moves only when it is located in an ocean tile, has a valid `fueled` component, and the component is not empty. During movement, it wanders within a defined radius around a remembered "home" location. The brain also ensures the entity records its initial position as its "home" location upon initialization.

## Dependencies & Tags
- **Components used:** `fueled`, `knownlocations`
- **Tags:** None identified.

## Properties
No public properties are explicitly declared or initialized in the constructor.

## Main Functions
### `MiniBoatLanternBrain:OnStart()`
* **Description:** Initializes and starts the behavior tree root node. It creates a priority node containing a single `WhileNode` that checks `ShouldMove()`. If true, the entity executes a `Wander` behavior toward its "home" location using a custom direction function.
* **Parameters:** None.
* **Returns:** None.

### `MiniBoatLanternBrain:OnInitializationComplete()`
* **Description:** Records the entity's current world position as its "home" location. It uses `KnownLocations:RememberLocation("home", ...)` with `dont_overwrite` set to `true`, ensuring the initial position is preserved and not overwritten later.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
This brain does not register any event listeners or push custom events.

## Helper Functions
### `getdirectionFn(inst)`
* **Description:** Computes a randomized angular offset to apply to the entity's current rotation, influencing its wandering direction.
* **Parameters:** `inst` — The entity instance.
* **Returns:** A rotation value in degrees, calculated as `(current_rotation + r^3 * 40) * DEGREES`, where `r` is a random float in `[-1, 1]`.

### `ShouldMove(inst)`
* **Description:** Determines whether the entity should begin moving. Returns `true` only if the entity is on an ocean tile, has a `fueled` component, and that component is not empty.
* **Parameters:** `inst` — The entity instance.
* **Returns:** `true` if the entity should move; otherwise `false`.