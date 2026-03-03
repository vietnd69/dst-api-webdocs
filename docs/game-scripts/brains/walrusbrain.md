---
id: walrusbrain
title: Walrusbrain
description: AI controller for walrus entities, managing movement, combat, homing, and social behaviors like following leaders.
tags: [ai, locomotion, combat, social]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 9f4c7428
system_scope: brain
---

# Walrusbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WalrusBrain` is the behavior tree-based AI controller for walrus entities. It coordinates behaviors such as fleeing from predators (`RunAway`), chasing and attacking targets (`ChaseAndAttack`), following a leader (`Follow`), returning home at night (`GoHomeAction`), eating nearby food, wandering when idle, and orienting toward players or the leader. It integrates with components like `combat`, `follower`, `leader`, and `homeseeker`, using helper functions to query entity state and distant locations.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("walrusbrain")
-- The brain is automatically started by the parent stategraph on entity spawn.
-- No further manual initialization is required.
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `leader`, `homeseeker`  
**Tags checked:** `walrus`, `notarget`, `character`, `monster`, `edible_MEAT`, `INLIMBO`, `outofreach`, `taunt_attack`, `flare_summoned`, `hound`  
**Tags added:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns a behavior tree (`BT`) to the entity. The tree is constructed from priority-ordered behavior nodes that define when and how the walrus reacts to various stimuli (e.g., panic, fleeing, following, attacking, eating).
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None documented; assumes `Brain._ctor` has already been called in the constructor.

## Events & listeners
- **Listens to:** None documented.
- **Pushes:** None documented.

> Note: This brain relies entirely on behavior tree logic; it does not register or fire events directly.
