---
id: stalkerchaseandattack
title: Stalkerchaseandattack
description: A deprecated AI behavior component that implements chasing, attacking, and avoidance logic by delegating to ChaseAndAttackAndAvoid with fixed avoidance distance.
tags: [ai, combat, deprecated]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: deprecated
category_type: components
source_hash: 3cda3791
system_scope: ai
---

# Stalkerchaseandattack

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Stalkerchaseandattack` is a deprecated AI behavior component designed for entities that need to chase targets, engage in combat, and avoid specific objects (e.g., hazards). It inherits from `ChaseAndAttackAndAvoid` and hardcodes the avoidance distance to `6` units. It exists solely for backward compatibility with older mods and should no longer be used in new development.

## Usage example
```lua
-- NOT RECOMMENDED: Use ChaseAndAttackAndAvoid directly instead.
local inst = CreateEntity()
inst:AddComponent("stalkerchaseandattack")

-- Parameters for constructor:
-- findavoidanceobjectfn: function returning avoidance target or nil
-- max_chase_time: maximum time (seconds) to pursue a target
-- give_up_dist: distance beyond which target is considered lost
-- max_attacks: max consecutive attacks before breaking off
-- findnewtargetfn: optional function to locate a new target
-- walk: whether to walk instead of run when chasing
inst.components.stalkerchaseandattack:PerformAttack()  -- example inherited method
```

## Dependencies & tags
**Components used:** None directly — relies entirely on inherited behavior from `ChaseAndAttackAndAvoid`.
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `ChaseAndAttackAndAvoid._ctor(...)`
*   **Description:** Constructor inherited from `ChaseAndAttackAndAvoid`. Initializes chase, attack, and avoidance logic with fixed `avoid_dist = 6`. Called during `StalkerChaseAndAttack` construction.
*   **Parameters:** See `ChaseAndAttackAndAvoid` documentation (not included here per constraints).
*   **Returns:** Nothing.
*   **Error states:** Not applicable.

## Events & listeners
**Listens to:** Inherited from `ChaseAndAttackAndAvoid` (not specified in source).
**Pushes:** Inherited from `ChaseAndAttackAndAvoid` (not specified in source).
