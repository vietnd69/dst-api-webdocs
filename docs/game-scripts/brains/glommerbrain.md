---
id: glommerbrain
title: Glommerbrain
description: Controls the AI behavior for Glommer, an entity that follows its leader while avoiding danger and wandering within proximity limits.
tags: [ai, brain, follower, wander, panic]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: f320cd79
system_scope: brain
---

# Glommerbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GlommerBrain` is an AI brain component that implements behavior for Glommer, a follower entity in DST. It defines a behavior tree (`BT`) that prioritizes panic responses (e.g., electric fences or proximity-based triggers), then handles roaming, following, facing, and wandering behaviors. It relies on the `follower` component to identify the leader and uses `follow`, `wander`, and `faceentity` behavior modules to govern movement and orientation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("follower")
inst:AddBrain("glommerbrain")
-- When a leader is assigned via inst.components.follower:SetLeader(target),
-- Glommer will automatically follow, wander, and respond to threats.
```

## Dependencies & tags
**Components used:** `follower` (via `GetLeader` helper), `behaviour` system (`follow`, `wander`, `faceentity`), and `braincommon` utilities (`PanicTrigger`, `ElectricFencePanicTrigger`, `DoAction`)
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `GlommerBrain:OnStart()`
* **Description:** Initializes the behavior tree root node. Constructs a priority-based tree that executes panic responses first, followed by custom actions (e.g., leaving the world), then movement behaviors (follow, face, wander).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Assumes all required behaviors (`Follow`, `Wander`, `FaceEntity`) are constructed with valid function arguments and that `BrainCommon` helpers return correct node types.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.

## Notes
- This brain does not expose public methods beyond `OnStart`, as behavior is fully encapsulated in its behavior tree.
- Distance constants (`MIN_FOLLOW_DIST`, `MAX_FOLLOW_DIST`, `TARGET_FOLLOW_DIST`, `MAX_WANDER_DIST`) are hardcoded and affect all Glommer entities globally.
