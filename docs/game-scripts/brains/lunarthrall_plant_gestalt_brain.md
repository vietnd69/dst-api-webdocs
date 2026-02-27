---
id: lunarthrall_plant_gestalt_brain
title: Lunarthrall Plant Gestalt Brain
description: Controls the behavior of a Lunarthrall Plant Gestalt entity by coordinating movement toward a target plant, infesting it, or moving offscreen when no players are near.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: entity
source_hash: 00560fd8
---

# Lunarthrall Plant Gestalt Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component governs the behavior of Lunarthrall Plant Gestalt entities — mobile entities that seek to infest specific plants. It implements a behavior tree (`BT`) that prioritizes movement logic based on plant proximity and player visibility. When a valid target plant exists and the gestalt is within close range, it triggers the `"infest"` state. If the target is too far or invalid, or no target is available, it generates randomized movement paths to stay offscreen while waiting for respawn opportunities. It relies on the `lunarthrall_plantspawner` component for plant validation and offscreen teleportation logic.

## Dependencies & Tags
- **Components used:**
  - `inst.components.timer` — to check for the `"justspawned"` timer (via `TimerExists("justspawned")`)
  - `TheWorld.components.lunarthrall_plantspawner` — to:
    - call `FindPlant()` for plant revalidation
    - call `MoveGestaltToPlant(inst)` for offscreen positioning
- **Tags:** None identified.
- **Behaviors used:** `follow`, `wander`, `standstill`, `faceentity` are imported but not directly used in the current implementation.

## Properties
The constructor does not define any explicit instance properties. All state is carried on `inst`, which is the entity instance to which the brain is attached.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.plant_target` | `Entity` or `nil` | `nil` | Reference to the target plant the gestalt is moving toward. Set externally or updated in `MoveToPointAction`. |
| `inst.randomdirection` | `number` (radians) | `nil` | Persisted random direction used for wandering; initialized on first use. |
| `inst.sg` | `StateGraph` | — | Reference to the entity's state graph, accessed during action resolution. |
| `inst.bt` | `BT` | — | Behavior tree root assigned in `OnStart`. |

## Main Functions
### `MoveToPointAction(inst)`
* **Description:** Helper function that computes a target position for the gestalt to move toward. It evaluates the entity's `plant_target` and current player visibility. It may cause the entity to infest a plant, move toward the plant, or generate a random position offscreen.
* **Parameters:**
  - `inst` (`Entity`): The entity instance (typically the gestalt) requesting movement action.
* **Returns:** 
  - `BufferedAction` or `nil`: A buffered walk action toward the computed `pos`, or `nil` if no position was set.

### `LunarThrall_Plant_Gestalt_Brain:OnStart()`
* **Description:** Initializes the brain's behavior tree on start. Sets up a root `PriorityNode` that continuously executes `MoveToPointAction` while the entity is in the `"idle"` state tag.
* **Parameters:** None.
* **Returns:** None. Assigns `self.bt` to a `BT` instance with a behavior tree rooted in a `PriorityNode`.

## Events & Listeners
None identified.