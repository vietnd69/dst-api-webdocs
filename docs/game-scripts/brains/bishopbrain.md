---
id: bishopbrain
title: Bishopbrain
description: Manages the behavior tree for the Clockwork Bishop entity, orchestrating combat, navigation, and social behaviors like following and facing.
tags: [ai, boss, combat, navigation]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: f19ee654
system_scope: brain
---

# Bishopbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BishopBrain` implements the behavior tree for the Clockwork Bishop, a boss entity in Don't Starve Together. It coordinates high-level AI decisions such as engaging enemies, returning to its home position, following a leader, and maintaining orientation toward targets or the leader. This component relies on the `brain` base class and integrates behaviors from `behaviours/` to construct a prioritized action sequence. It uses `clockwork_common` utilities for home positioning and trader waiting logic, and interacts with the `combat` and `follower` components to determine target and leadership state.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("boss")
inst:AddComponent("combat")
inst:AddComponent("follower")
inst.brain = BishopBrain(inst)
inst.brain:OnStart()
```

## Dependencies & tags
**Components used:** `combat`, `follower`
**Tags:** None added or removed by this component (though the Bishop prefab it is attached to may use tags such as `boss`, `clockwork`, or `notarget` on entities).

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree root node for the Bishop. It constructs a priority-based decision tree that includes panic responses, trader waiting, combat engagement, homing movement, leader following, target-facing, and idle standing.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None documented.

## Events & listeners
- **Listens to:** None identified (this component does not register any event listeners directly).
- **Pushes:** None identified (this component does not fire events directly).
