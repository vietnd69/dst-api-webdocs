---
id: lunarthrall_plant_vine_brain
title: Lunarthrall Plant Vine Brain
description: Controls movement and targeting logic for a gestalt entity that seeks to infest plants during the Lunar Thrall event.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: e70fb1e5
---

# Lunarthrall Plant Vine Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `LunarThrall_Plant_Vine_Brain` component implements the decision-making behavior for a gestalt entity created during the Lunar Thrall event that targets and attempts to infest specific plants. Its primary responsibility is to compute movement actions that guide the entity toward a valid `plant_target`, with special logic to maintain distance from players while moving toward the target or repositioning offscreen when players are too close.

This brain uses a Behavior Tree (`BT`) root node that prioritizes continuous movement via `MoveToPointAction` when the entity is in an `idle` state. It interacts directly with the `lunarthrall_plantspawner` component to validate and reassign `plant_target`, and to trigger offscreen repositioning when needed.

## Dependencies & Tags
- **Components used:**
  - `TheWorld.components.lunarthrall_plantspawner`: Used to locate a valid plant and move the entity offscreen.
  - `inst.plant_target`: A reference to a plant entity expected to have the `lunarthrall_plant` tag/property.
- **Tags checked:**
  - `"idle"`: Used in `self.inst.sg:HasStateTag("idle")` to control behavior tree priority.
- **Behaviors required (via `require`):**
  - `follow`, `wander`, `standstill`, `faceentity` (loaded but not directly used in this script).

## Properties
No explicit instance properties are initialized in this script's constructor.

## Main Functions

### `MoveToPointAction(inst)`
* **Description:** Computes a destination position for the entity to move toward, based on its `plant_target` and proximity to players. If `plant_target` is valid and within range, it returns an action to walk toward the plant; otherwise, it calculates a random offscreen position. If the entity is inside player view and no valid target exists, it repositions the entity offscreen using `lunarthrall_plantspawner:MoveGestaltToPlant`.
* **Parameters:**
  - `inst`: The entity instance whose brain is running this action.
* **Returns:** A `BufferedAction` that invokes `ACTIONS.WALKTO` toward the computed `pos`, or `nil` if no position is set.

### `LunarThrall_Plant_Vine_Brain:OnStart()`
* **Description:** Initializes the brain's behavior tree. Creates a `PriorityNode` root that repeatedly executes `MoveToPointAction` while the entity's stategraph has the `"idle"` tag. A small priority tolerance (0.25) is used.
* **Parameters:** None.
* **Returns:** None. Sets `self.bt` to the constructed behavior tree.

## Events & Listeners
None.