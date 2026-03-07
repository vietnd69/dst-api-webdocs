---
id: fused_shadelingbrain
title: Fused Shadelingbrain
description: AI brain component for the fused shadeling enemy that manages combat behavior including leashing, chasing, and combat jumps.
tags: [ai, combat, boss, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 7b50ab65
system_scope: brain
---

# Fused Shadelingbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Fused_ShadelingBrain` is the behavior tree-based AI brain for the fused shadeling entity. It orchestrates high-level decision-making by composing lower-level behaviors: `ChaseAndAttack`, `Leash`, and `Wander`, with specialized handling for a combat jump mechanic. The brain enforces constraints such as aggro range relative to a fixed spawn point and cooldown-based jump triggers, ensuring the enemy behaves responsively while remaining anchored to its designated zone.

## Usage example
```lua
local inst = CreateEntity()
-- ... setup combat, timer, and knownlocations components ...
inst:AddBrain("fused_shadelingbrain")
-- The brain automatically starts when the entity enters the world
```

## Dependencies & tags
**Components used:** `combat`, `knownlocations`, `timer`
**Tags:** Checks state tag `jumping` via `inst.sg:HasStateTag("jumping")`; does not modify tags directly.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes and attaches the behavior tree to the entity. The root node is a `PriorityNode` that evaluates behaviors in order of priority, starting with blocking while jumping, then handling combat jumps, followed by chasing/attacking, leashing, and finally wandering.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does not return early; always constructs and assigns `self.bt`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** `try_jump` — fired when the entity should perform a combat jump toward the target's position. Triggered by the `WhileNode` in the behavior tree when `should_combat_jump()` returns true.
