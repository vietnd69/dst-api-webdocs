---
id: wormwood_fruitdragonbrain
title: Wormwood Fruitdragonbrain
description: AI brain component for the Wormwood Fruit Dragon entity that manages its movement and combat behavior using a behavior tree.
tags: [ai, brain, movement, combat]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 95132fdc
---

# Wormwood Fruitdragonbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This component defines the AI behavior for the Wormwood Fruit Dragon entity in Don't Starve Together. It implements a behavior tree-based AI system that coordinates panic responses, leader following, chasing/attacking enemies, and random wandering. The brain uses core DST behavior classes (`Wander`, `Follow`, `ChaseAndAttack`) and common utility triggers (`PanicTrigger`, `ElectricFencePanicTrigger`) to determine the entity's actions.

The component depends on the `follower` component to identify its leader and uses behavior logic provided by external modules (`behaviours/` folder and `brains/braincommon.lua`). It initializes a priority-based behavior tree in `OnStart()` that evaluates behaviors in order of priority and executes the highest-priority one whose condition is met.

## Usage example
This brain is intended to be assigned to an entity instance during its prefab initialization (typically in a prefab file). Example usage is implicit and handled by the game engine:

```lua
inst:AddBrain("wormwood_fruitdragonbrain")
```

The brain component does not expose manual configuration or function calls post-initialization; behavior is driven entirely by the internal behavior tree evaluation loop.

## Dependencies & tags
**Components used:**
- `follower` — accessed via `inst.components.follower:GetLeader()` to determine the entity's current leader.

**Tags:** None identified.

## Properties
No public properties are initialized in the constructor. All state is encapsulated within the behavior tree structure and internal functions.

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree root node. This function is called automatically when the brain component starts managing the entity's AI.
* **Parameters:** None (uses `self.inst`, which is the entity instance).
* **Returns:** `nil`.
* **Error states:** May fail silently if required modules (`Follow`, `ChaseAndAttack`, `Wander`, `BrainCommon`) are not loaded or if dependencies (e.g., `follower` component) are missing. No explicit error handling is present.

## Events & listeners
None. This brain component does not register or fire any events directly. Its behavior is driven by the internal behavior tree and shared behavior modules.