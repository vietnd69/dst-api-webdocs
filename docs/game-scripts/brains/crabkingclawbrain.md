---
id: crabkingclawbrain
title: Crabkingclawbrain
description: Controls the AI behavior of a Crab King claw unit, coordinating attack, circling, leashing, and wandering actions using a behavior tree.
tags: [ai, combat, boss, locomotion, brain]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 17d6113d
system_scope: brain
---

# Crabkingclawbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Crabkingclawbrain` is a behavior tree–driven AI component that manages the movement and combat actions of a Crab King claw entity. It prioritizes attacking the current combat target, circling around platforms (e.g., boats), staying within leash distance, and wandering when no target is available. It relies on the `combat`, `hull`, and `knownlocations` components to make decisions and interact with the world.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("crabkingclawbrain")
inst:AddComponent("combat")
inst:AddComponent("hull")
inst:AddComponent("knownlocations")
-- After setup, the brain automatically initializes its behavior tree on first activation
```

## Dependencies & tags
**Components used:** `combat`, `hull`, `knownlocations`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree root node, constructing a priority-based decision tree with attack, platform circling, leash-and-avoid, and wander sub-trees. This method is called when the brain begins execution.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** May fail if required dependencies (`combat`, `hull`, `knownlocations`) are missing or misconfigured.

### `OnInitializationComplete()`
* **Description:** Records the entity’s initial world position as `"spawnpoint"` in the `knownlocations` component for use in wandering behavior.
* **Parameters:** None.
* **Returns:** Nothing.

### `AttackTarget(inst)`
* **Description:** Helper function used by the `DoAction` behavior. Attempts to return a combat action against the current target if the combat cooldown has elapsed, the target exists, and is within attack range.
* **Parameters:** `inst` (Entity instance) — the entity whose brain is executing.
* **Returns:** `BufferedAction` if conditions are met, otherwise `nil`.
* **Error states:** Returns `nil` if combat is in cooldown, no target is set, target is out of range, or target position cannot be accessed.

### `CircleBoat(inst)`
* **Description:** Calculates a point on a circular path around the platform (e.g., boat) occupied by the combat target. It computes the angle to the target from the platform center and uses the hull radius plus an offset to determine a position on the circle.
* **Parameters:** `inst` (Entity instance) — the entity whose brain is executing.
* **Returns:** `Vector3` point on the circle if the target and platform are valid and position is computeable; otherwise `nil`.
* **Error states:** Returns `nil` if the target has no platform, platform has no `hull` component, or position calculation results in `NaN` coordinates.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
