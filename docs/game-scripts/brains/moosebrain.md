---
id: moosebrain
title: Moosebrain
description: Controls the AI behavior tree for the Moose entity, managing operations like returning home, leashing, chasing targets, laying eggs, facing players, and wandering.
tags: [ai, brain, locomotion, combat, reproduction]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 34b572c5
system_scope: brain
---

# Moosebrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MooseBrain` is the AI controller for the Moose entity in Don't Starve Together. It defines a priority-based behavior tree (`BT`) that orchestrates high-level actions like fleeing ("Go Away"), staying within range of a landmark (`Leash`), combat (`ChaseAndAttack`), reproduction (`LayEgg`), orientation toward nearby players (`FaceEntity`), and idle wandering. It depends on the `combat`, `entitytracker`, and `knownlocations` components to make context-aware decisions.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("moosebrain")
inst.components.brain:OnStart()
inst.components.brain:OnInitializationComplete()
```

## Dependencies & tags
**Components used:** `combat`, `entitytracker`, `knownlocations`  
**Tags:** Checks `notarget`, `busy`; no tags added or removed.

## Properties
No public properties

## Main functions
### `OnStart()`
* **Description:** Initializes and attaches the behavior tree root node, which contains prioritized sub-behaviors including GoAway, Leash, ChaseAndAttack, LayEgg, FaceEntity, and Wander.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

### `OnInitializationComplete()`
* **Description:** Records the Moose's spawn position as `"spawnpoint"` in `knownlocations` for potential future use.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None.

## Events & listeners
None identified.
