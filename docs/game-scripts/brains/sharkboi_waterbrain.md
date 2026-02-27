---
id: sharkboi_waterbrain
title: Sharkboi Waterbrain
description: Defines the behavior tree for the Sharkboi entity when submerged in water, primarily using a simple wander task.
tags: [ai, brain, water, movement]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 4ff708f2
---

# Sharkboi Waterbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`SharkboiWaterBrain` is a brain component responsible for governing the behavior of the Sharkboi entity while it is in the water. It inherits from `Brain` and sets up a basic behavior tree (`BT`) with a single high-priority node: a `Wander` task. This component is used to give the Sharkboi a passive, non-aggressive swimming pattern underwater, avoiding complex decision-making and focusing on random movement.

The component relies on the external `behaviours/wander.lua` module to supply the `Wander` behavior node used in the behavior tree root.

## Usage example
```lua
local inst = WorldEntities.CreateEntity("sharkboi")
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("sharkboi_waterbrain")
inst.components.brain:Start()
```

## Dependencies & tags
**Components used:** None explicitly accessed beyond the base `Brain` class and its behavior tree infrastructure.
**Tags:** None identified.

## Properties
No public properties are initialized or documented in the constructor.

## Main functions
### `OnStart()`
* **Description:** Initializes the brain's behavior tree (`BT`) with a root node containing a single `Wander` task. The behavior tree is set up with a priority weight of `0.5`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None documented.

## Events & listeners
None documented.