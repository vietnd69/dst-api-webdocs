---
id: shadowheart_infusedbrain
title: Shadowheart Infusedbrain
description: Provides AI behavior for shadowheart-infused entities by prioritizing fleeing from players over standing still.
tags: [ai, brain, combat]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 0495c040
---

# Shadowheart Infusedbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`ShadowheartInfusedBrain` is a Brain component that defines behavior for entities infused with shadowheart energy. It inherits from `Brain` and implements a behavior tree rooted on a `PriorityNode` that alternates between two behaviors: `RunAway` from players within a defined distance, and `StandStill` when no player is nearby. This brain is intended for use with entities that should actively avoid player proximity while remaining idle otherwise.

## Usage example
```lua
local inst = Entity()
inst:AddTag("shadowheart_infused")
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("shadowheart_infusedbrain")
```

## Dependencies & tags
**Components used:** `brain` (via `inst.components.brain` implicitly in behavior setup)
**Tags:** None identified

## Properties
No public properties are explicitly initialized in the constructor or elsewhere in the code.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree with a priority-based root node. Prioritizes `RunAway` behavior over `StandStill`, with a 0.25-second update interval for the priority node.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None.

## Events & listeners
None.