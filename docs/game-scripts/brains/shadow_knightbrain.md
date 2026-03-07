---
id: shadow_knightbrain
title: Shadow Knightbrain
description: Controls the AI behavior of the Shadow Knight entity, coordinating combat actions, movement, and despawning logic via a behavior tree.
tags: [ai, combat, boss, movement]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 06723aa5
system_scope: brain
---

# Shadow Knightbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shadow_KnightBrain` implements the AI logic for the Shadow Knight entity using a behavior tree (`BT`) built from common DST behavior components. It manages combat engagement (chasing and attacking when no target is active), evasive dodging (run away) when a target is locked on and attacking, facing the nearest player for visual alignment, and autonomous wandering while waiting for a timer to trigger a despawn event. This brain relies heavily on the `combat` and `health` components for real-time state evaluation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("shadowknight")
inst:AddComponent("combat")
inst:AddComponent("health")
inst:AddBrain("shadow_knightbrain")
```

## Dependencies & tags
**Components used:** `combat`, `health`  
**Tags:** Checks `notarget`, `playerghost` on potential targets; no tags added or removed by this component itself.

## Properties
No public properties.

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree root node with a priority structure. The tree evaluates combat state to decide between attacking (via `ChaseAndAttack`), dodging (via `RunAway`), facing a nearby player (via `FaceEntity`), and performing concurrent wandering with a timed despawn action.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None identified. Requires `self.inst.components.combat` and `self.inst.components.health` to be present for correct node evaluation.

## Events & listeners
- **Listens to:** None.
- **Pushes:** `despawn` — fired when the timed despawn counter reaches `TUNING.SHADOW_CHESSPIECE_DESPAWN_TIME` via an `ActionNode` in the behavior tree.
