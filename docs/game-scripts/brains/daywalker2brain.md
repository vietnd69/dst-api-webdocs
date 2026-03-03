---
id: daywalker2brain
title: Daywalker2Brain
description: AI brain controlling the Daywalker 2 boss, coordinating combat behavior including rummaging, stalk chasing, tackling, and avoidance of junk entities.
tags: [ai, combat, boss, locomotion]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: daca299e
system_scope: brain
---

# Daywalker2Brain

> Based on game build **714004** | Last updated: 2026-03-03

## Overview
`Daywalker2Brain` is the behavior tree-based AI controller for the Daywalker 2 boss entity. It orchestrates complex combat behaviors including targeting enemies, dodging by rummaging through junk loot, stalk-chasing during cooldown, and executing tackle attacks when conditions are met. It interacts closely with the `combat`, `entitytracker`, `rooted`, and `stuckdetection` components to dynamically select and transition between high-level behaviors such as Rummage, Stalking, Chasing, and Wander, based on game state, cooldown timers, and environmental factors.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("daywalker2")
inst:AddComponent("combat")
inst:AddComponent("entitytracker")
inst:AddComponent("stuckdetection")
inst:AddComponent("rooted")
inst.brain = Daywalker2Brain(inst)
inst.brain:OnStart()
```

## Dependencies & tags
**Components used:** `combat`, `entitytracker`, `stuckdetection`, `rooted`  
**Tags:** Adds `daywalker2`; checks state tags: `jumping`, `busy`, `stalking`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `lastjunk` | Entity or `nil` | `nil` | Previously tracked junk entity (used for caching). |
| `_thieflevel` | number | `nil` | Internal counter for thief warning state synchronization. |
| `cachedrummage` | boolean | `false` | Cached rummage decision used to persist rummage state across frames. |
| `bt` | BT | `nil` | Behavior tree instance (initialized in `OnStart`). |

## Main functions
### `OnStart()`
*   **Description:** Initializes the behavior tree with a priority-rooted hierarchy that evaluates state-dependent conditions (e.g., `ShouldRummage`, `ShouldStalk`, `ShouldChase`) and executes corresponding behavior nodes (e.g., `Leash`, `LeashAndAvoid`, `ChaseAndAttackAndAvoid`, `Wander`). Sets up listeners and initial behavior logic.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Requires that `combat`, `entitytracker`, `stuckdetection`, and `rooted` components be attached before calling.

## Events & listeners
- **Listens to:** None explicitly (relies on stategraph events for transitions).
- **Pushes:** `rummage`, `tackle`, `doattack` (via `combat:TryAttack`), `doattack` (via `Combat.TryAttack`).
