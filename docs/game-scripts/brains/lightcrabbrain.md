---
id: lightcrabbrain
title: Lightcrabbrain
description: Controls the AI behavior of a light-crab entity by managing state execution through a behavior tree, including fleeing from threats, seeking bait, wandering, and returning home.
tags: [ai, brain, movement, predation]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: cc717915
system_scope: brain
---

# Lightcrabbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LightCrabBrain` implements the AI logic for a light-crab entity using a behavior tree (`BT`). It inherits from the base `Brain` class and defines a priority-based behavior tree in `OnStart`. The AI prioritizes escaping danger (via panic triggers and `RunAway`), then attempts to eat accessible bait, followed by wandering. It integrates with the `homeseeker` component to return home when appropriate and respects state tags (e.g., `trapped`, `jumping`). This brain is designed for a small, prey-like creature that avoids larger entities and seeks food.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:LoadBrain("lightcrabbrain")
-- The brain activates automatically on entity spawn via stategraph transitions
```

## Dependencies & tags
**Components used:** `homeseeker`, `eater`, `bait`  
**Tags checked:** `INLIMBO`, `outofreach`, `planted`, `scarytoprey`  
**Tags added:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree with a priority-ordered list of nodes. It constructs a `PriorityNode` tree where the highest-priority valid action executes each tick.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Does not return errors; builds and assigns `self.bt` (the behavior tree instance).

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
