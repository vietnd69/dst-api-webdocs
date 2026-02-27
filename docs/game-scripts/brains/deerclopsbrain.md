---
id: deerclopsbrain
title: Deerclopsbrain
description: Controls the behavior tree and decision-making logic for the Deerclops entity, including combat targeting, ice regeneration, base destruction, and wander movements.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 108a1e93
---

# Deerclopsbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`deerclopsbrain` defines the behavior tree (BT) controller for the Deerclops entity. It coordinates high-level decision-making across combat, movement, and environmental interaction by combining several behavior nodes such as `ChaseAndAttack`, `Wander`, `DoAction`, `Leash`, and `FaceEntity`. The brain integrates with the entity's `combat`, `burnable`, and `knownlocations` components to make context-aware choices—including when to grow ice, destroy player structures, or return to a home location. It also supports the Deerclops' unique mechanics such as frenzy states, ice regeneration, and catapault-aware pathing over water.

## Dependencies & Tags

- **Components used:**
  - `combat` — reads `target`, `InCooldown`, `HasTarget`, `TargetIs`, `battlecryenabled`
  - `burnable` — checks `IsBurning`
  - `knownlocations` — stores/retrieves `"spawnpoint"`, `"home"`, `"targetbase"` positions; calls `RememberLocation` and `ForgetLocation`
  - `workable` — accessed via `action == ACTIONS.HAMMER` to identify destroyable structures
  - `burnable` and `combat` — used in conjunction to determine ice-regrowth conditions
- **Tags:** 
  - `BASEDESTROY_CANT_TAGS = {"wall"}` — used by `FindEntity` to exclude walls from base destruction targets
- **Behaviors imported:**
  - `chaseandattack`, `wander`, `doaction`, `attackwall`, `leash`, `faceentity`
  - `giantutils` — provides utility functions: `GetWanderAwayPoint`, `CanProbablyReachTargetFromShore`, `BufferedAction`, `FindEntity`

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SEE_DIST` | number | `40` | Maximum search radius for base-destroy targets (in game units) |
| `CHASE_DIST` | number | `32` | Deerclops stops chasing beyond this distance |
| `CHASE_TIME` | number | `20` | Maximum chase duration before behavior node re-evaluation |
| `OUTSIDE_CATAPULT_RANGE` | number | Computed value | Minimum safe distance from shore when targeting entities on water, to avoid ranged attacks |
| `BASEDESTROY_CANT_TAGS` | table | `{"wall"}` | Tags that exclude entities from being targeted for base destruction |
| `inst.forgethometask` | Task | `nil` | Delayed task to forget `"home"` location after 30 seconds of inactivity |

## Main Functions

### `BaseDestroy(inst)`
* **Description:** Attempts to find and initiate an action to destroy a nearby hammerable structure (e.g., walls, floors). If a `"targetbase"` location has been remembered and a valid target is found, it returns a `BufferedAction` targeting that structure. Used by the `DoAction` behavior node.
* **Parameters:**
  - `inst` — The Deerclops entity instance.
* **Returns:** `BufferedAction` targeting a structure, or `nil` if no target found or `"targetbase"` not known.

### `GetWanderPos(inst)`
* **Description:** Determines a fallback wandering target position by prioritizing known locations: `"targetbase"`, `"home"`, then `"spawnpoint"`.
* **Parameters:**
  - `inst` — The Deerclops entity instance.
* **Returns:** `Vector3` position if a known location exists; `nil` otherwise.

### `GetNewHome(inst)`
* **Description:** Assigns a new `"home"` position using `GetWanderAwayPoint`, and schedules a task to forget this location after 30 seconds. Cancels any existing home-forget task.
* **Parameters:**
  - `inst` — The Deerclops entity instance.
* **Returns:** `nil`

### `GetHomePos(inst)`
* **Description:** Returns the `"home"` position, or generates a new one if none exists.
* **Parameters:**
  - `inst` — The Deerclops entity instance.
* **Returns:** `Vector3` — The current `"home"` position.

### `GetTarget(inst)`
* **Description:** Returns the current combat target.
* **Parameters:**
  - `inst` — The Deerclops entity instance.
* **Returns:** `Entity` or `nil` — The target entity stored in `inst.components.combat.target`.

### `IsTarget(inst, target)`
* **Description:** Checks whether the given entity is the current combat target.
* **Parameters:**
  - `inst` — The Deerclops entity instance.
  - `target` — `Entity` — Entity to compare against the current target.
* **Returns:** `boolean` — `true` if `target` matches the current target.

### `GetTargetPos(inst)`
* **Description:** Returns the world position of the current combat target, or `nil` if no target exists.
* **Parameters:**
  - `inst` — The Deerclops entity instance.
* **Returns:** `Vector3` or `nil`

### `ShouldGrowIce(inst)`
* **Description:** Evaluates whether Deerclops should regrow ice (e.g., ice ring, eye ice, body ice). Considers burning state, combat status, frenzy, and memory of missing ice (`sg.mem`). Logic covers both out-of-combat regeneration and combat phase-specific summoning/regrowth.
* **Parameters:**
  - `inst` — The Deerclops entity instance.
* **Returns:** `boolean` — `true` if ice regrowth should be started.

### `DeerclopsBrain:OnStart()`
* **Description:** Constructs and assigns the root behavior tree node. The behavior tree prioritizes:
  1. Ice regeneration (if `ShouldGrowIce` returns true)
  2. Battlecry activation (via `AttackWall` + `DoAction`)
  3. Cooldown phase — leash behavior, facing target
  4. Combat chase and attack
  5. Target base destruction (via `BaseDestroy`)
  6. Attempt to leave via wander-to-home
  7. General wandering via `GetWanderPos`
* **Parameters:** None
* **Returns:** `nil`

### `DeerclopsBrain:OnInitializationComplete()`
* **Description:** Records the Deerclops' spawn position under the `"spawnpoint"` key in `knownlocations`. The `dont_overwrite` flag is set to `true`, so it will only be stored once.
* **Parameters:** None
* **Returns:** `nil`

## Events & Listeners

- **Listens to:** None (no `inst:ListenForEvent` calls in this file)
- **Pushes:** 
  - `"doicegrow"` — Pushed by the `IceGrow` action node when ice regeneration is triggered

> Note: Event pushing is limited to one internal event (`"doicegrow"`), and no external event subscriptions are defined in this file.