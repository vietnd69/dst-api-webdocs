---
id: leifbrain
title: Leifbrain
description: AI brain for Leif that manages behavior via a behavior tree, prioritizing wall attacks, combat, and wandering.
tags: [ai, brain, combat]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 45fb82e4
system_scope: brain
---

# Leifbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Leifbrain` is the AI brain component for Leif, implementing decision-making logic using a behavior tree (BT). It defines the order of behavior priorities via a `PriorityNode` containing `AttackWall`, `ChaseAndAttack`, and `Wander` actions. This brain is responsible for executing high-priority combat or environmental interaction behaviors before falling back to idle wandering.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("leifbrain")
-- The brain automatically initializes its behavior tree on `OnStart()`
-- No manual initialization required after adding the component.
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree root with a priority-ordered list of behaviors: `AttackWall`, `ChaseAndAttack`, and `Wander`. This must be called when the brain begins processing.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:**None.

## Events & listeners
- **Listens to:** None identified  
- **Pushes:** None identified
