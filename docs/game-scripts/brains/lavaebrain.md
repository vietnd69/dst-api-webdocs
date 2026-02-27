---
id: lavaebrain
title: Lavaebrain
description: Controls the behavior tree of the Lavae entity, managing its movement and combat logic including resetting to a lava pool when no targets are present.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: dda0f5de
---

# Lavaebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This component implements the behavior tree for the `Lavae` entity. It determines high-level decision-making logic such as whether the entity should reset and move to a designated lava pool (its "home") when no combat target is active, or engage in standard combat behaviors like chasing, attacking, and evading walls. It inherits from the base `Brain` class and constructs a priority-based behavior tree in `OnStart()` using common behavior modules from the `behaviours` directory and utility functions like `BrainCommon.PanicTrigger`.

The key responsibility of `LavaeBrain` is to handle the special "go home" logic: if `inst.reset` is true, the entity exits combat and attempts to move to the nearest lava pool entity within a 50-unit radius. If no such pool is found, it defaults to staying in place.

## Dependencies & Tags
- **Components used:** None explicitly accessed via `inst.components.X` (no component interactions detected).
- **Tags:** Uses the `"lava"` tag to locate nearby lava pools via `TheSim:FindEntities`.

## Properties
No public instance properties are initialized in the constructor or elsewhere in the provided code.

## Main Functions

### `LavaeBrain:OnStart()`
* **Description:** Initializes the entity's behavior tree (`self.bt`) by constructing a root priority node. The tree prioritizes (in order): (1) resetting to lava pool if needed, (2) panic reactions, (3) wall-attacking, (4) chasing and attacking, and (5) standing still.
* **Parameters:** None.
* **Returns:** None.

### `ShouldResetFight(inst)`
* **Description:** A predicate function used by the behavior tree to determine if the entity should interrupt combat and attempt to return to a lava pool. Returns `true` if `inst.reset` is truthy.
* **Parameters:**
  * `inst` (`entity`): The entity instance being evaluated.
* **Returns:** `boolean` — `true` if `inst.reset` is true, otherwise `false`.

### `FindHome(inst)`
* **Description:** Locates the nearest lava pool entity within a 50-unit radius centered on the entity. Used to determine the "home" destination for reset logic.
* **Parameters:**
  * `inst` (`entity`): The entity whose position is used as the search center.
* **Returns:** `entity?` — A randomly selected lava pool entity from those found; `nil` if none exist.

### `GoHome(inst)`
* **Description:** Creates and returns a buffered action that moves the entity toward its home (as determined by `FindHome`). If no home is found, the action defaults to acting on the entity itself (i.e., no movement).
* **Parameters:**
  * `inst` (`entity`): The entity performing the action.
* **Returns:** `BufferedAction` — An action configured with `ACTIONS.GOHOME`, targeting either the nearest lava pool or the entity itself.

## Events & Listeners
None. No event listeners are registered, and no events are pushed in this component.