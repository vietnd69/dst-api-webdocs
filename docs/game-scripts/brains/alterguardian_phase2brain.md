---
id: alterguardian_phase2brain
title: Alterguardian Phase2Brain
description: Manages the AI behavior tree for the Alterguardian boss during Phase 2, coordinating movement, targeting, and state-aware actions.
tags: [ai, boss, combat, navigation]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: entity
source_hash: 78582173
system_scope: brain
---

# Alterguardian Phase2Brain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`AlterGuardian_Phase2Brain` defines the decision-making logic for the Alterguardian boss during its second combat phase. It uses a behavior tree to prioritize actions such as chasing and attacking players, maintaining orientation toward targets, and wandering within a defined range. The brain relies on the `knownlocations` component to remember the spawn point for wander homing and coordinates with the entity’s state graph to suppress movement while spinning.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("alterguardian_phase2brain")
-- Once initialized, the brain automatically sets up behavior and remembers spawn position
```

## Dependencies & tags
**Components used:** `knownlocations` (for remembering and retrieving spawn point)
**Tags:** None explicitly added, removed, or checked by this component.

## Properties
No public properties

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree with prioritized behaviors: `ChaseAndAttack`, `FaceEntity`, and `Wander`. The tree skips movement behaviors when the state graph has the `"spin"` tag.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Behavior setup depends on correct `TUNING` values; invalid ranges may cause unexpected AI behavior.

### `OnInitializationComplete()`
* **Description:** Records the entity’s current position as the `"spawnpoint"` in the `knownlocations` component. Used to anchor the wander behavior.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified.
