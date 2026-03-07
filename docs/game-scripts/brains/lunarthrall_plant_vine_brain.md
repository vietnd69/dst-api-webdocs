---
id: lunarthrall_plant_vine_brain
title: Lunarthrall Plant Vine Brain
description: Controls the movement and行为 logic for a Lunar Thrall gestalt entity tasked with moving toward and infesting a lunar plant target.
tags: [ai, locomotion, plant, boss]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: e70fb1e5
system_scope: brain
---

# Lunarthrall Plant Vine Brain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Lunarthrall_Plant_Vine_Brain` is a behavior tree–driven brain component that governs the movement and infestation behavior of a Lunar Thrall gestalt entity (e.g., a plant vine form). It prioritizes navigating toward a assigned `plant_target`, infesting it upon close proximity, or relocating offscreen if no valid target or player visibility rules apply. The brain leverages the `MoveToPointAction` helper function and integrates with the `lunarthrall_plantspawner` component to select or reposition the target plant.

## Usage example
This brain is typically assigned to an entity during prefabrication (e.g., in a prefab file):
```lua
inst:AddBrain("lunarthrall_plant_vine_brain")
```
No direct manual calls are required — the brain automatically starts when the entity’s state graph transitions to a state where the brain is active.

## Dependencies & tags
**Components used:**  
- `inst.components.lunarthrall_plantspawner` (via `TheWorld.components.lunarthrall_plantspawner`) — to locate and reposition gestalt entities.  
**Tags:** None identified.

## Properties
No public properties are declared in the constructor or otherwise accessible externally.

## Main functions
### `MoveToPointAction(inst)`
*   **Description:** Computes a movement target position for the entity. If a valid `plant_target` exists and is nearby (within `CLOSE_DIST`), it attempts to walk toward the plant; if within `ATTACH_DIST`, it triggers the `"infest"` state. If the plant is too far or invalid, or no target exists, it moves to an offscreen location to prepare for teleportation back to the spawner. It returns a buffered walk action if a valid position is computed.
*   **Parameters:** `inst` (Entity) — the entity instance whose brain is invoking this action.
*   **Returns:** `BufferedAction` — for walking to the computed position, or `nil` if no movement is generated (e.g., entity removed or invalid).
*   **Error states:**  
    - If `inst.plant_target` becomes invalid during execution, it is cleared (`inst.plant_target = nil`).  
    - If the world lacks the `lunarthrall_plantspawner` component and no plant target remains, the entity may be removed via `inst:Remove()`.

### `OnStart()`
*   **Description:** Initializes the behavior tree for this brain. Sets a `PriorityNode` root that repeatedly executes `MoveToPointAction` while the state graph has the `"idle"` tag, enabling continuous re-evaluation and movement.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
None identified.
