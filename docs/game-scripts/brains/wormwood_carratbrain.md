---
id: wormwood_carratbrain
title: Wormwood Carratbrain
description: AI behavior tree controller that governs Carrat movement and interaction with the environment and leader in Don't Starve Together.
tags: [ai, brain, follower, behavior_tree]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 99891912
---

# Wormwood Carratbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This component implements the AI behavior tree for the Carrat entity (from the *Reign of Giants* DLC). It orchestrates movement, prey behavior, and leader-following logic using a priority-based behavior tree (`BT`). The brain integrates with core systems like movement (`Wander`, `Follow`, `RunAway`), pickup handling, and leader detection via the `Follower` and `Eater` components. It ensures Carrats flee from players/pets during PVP, follow their leader within a defined distance range, and opportunistically pick up edible items.

## Usage example

This brain is attached automatically by the `carrat` prefab definition. Typical usage for modders is to extend or replace this brain in custom Carrat variants:

```lua
local CarratBrain = require("brains/wormwood_carratbrain")
inst:AddBrain(CarratBrain(inst))
```

Note: Brains in DST are singleton components per entity; adding it multiple times will override previous instances.

## Dependencies & tags
**Components used:**  
- `follower`: To retrieve the leader entity via `GetLeader()`.
- `eater`: To determine if an item is edible via `CanEat()`.
- `inventoryitem`: To check if an item is currently held via `IsHeld()`.
- `petleash`: To identify if a player is the Carrat’s pet owner via `IsPet()`.

**Tags:**  
- Tags used for run-away behavior: `"scarytoprey"` (passed to `RunAway` behavior via `NORMAL_RUNAWAY_DATA`).
- Internal checks use `"planted"` and `"held"` indirectly (not added/removed tags; only queried).

## Properties
No public properties are declared in the constructor. All configuration is static (module-level constants) and internal to `OnStart()`.

## Main functions

### `CarratBrain:OnStart()`
* **Description:** Initializes the behavior tree root node. Sets up priorities for panic (electric fence, players), leader-following, pickup handling, wandering, and movement. Called automatically when the brain is attached and activated.
* **Parameters:** None (`self` only).
* **Returns:** `nil`.
* **Error states:** None documented; relies on valid component presence (e.g., `follower`, `eater`, `petleash`) for correct operation.

## Helper Functions (Internal)

### `GetLeader(inst)`
* **Description:** Retrieves the leader of this entity via the `follower` component, if present.
* **Parameters:**  
  - `inst`: The entity instance (the Carrat).
* **Returns:** `entity | nil` — The leader entity or `nil` if no leader exists.

### `GetLeaderLocation(inst)`
* **Description:** Returns the leader’s world position, or `nil` if there is no leader.
* **Parameters:**  
  - `inst`: The entity instance.
* **Returns:** `{x, y, z} | nil` — Leader’s 3D position or `nil`.

### `ShouldRunFromScary(other, inst)`
* **Description:** Determines if `other` should trigger the Carrat to flee. Excludes fleeing from one’s own leader or owner (even if a player/pet) in PVP mode.
* **Parameters:**  
  - `other`: The potential threat entity.  
  - `inst`: The Carrat entity.
* **Returns:** `boolean` — `true` if the Carrat should flee, `false` otherwise.

### `IsItemEdible(inst, item)`
* **Description:** Checks if a given item qualifies as edible *for pickup* by this Carrat. Enforces that the item is edible, not planted, not currently held, and on the same platform/passable point.
* **Parameters:**  
  - `inst`: The Carrat entity.  
  - `item`: The item entity to evaluate.
* **Returns:** `boolean` — `true` if the item is pickable and edible.

### `PickUpFilter(inst, target, leader)`
* **Description:** Filter function used by `BrainCommon.NodeAssistLeaderPickUps`. Delegates to `IsItemEdible(leader, target)` — i.e., only edible items for the *leader* (the Carrat) are considered.
* **Parameters:**  
  - `inst`, `target`, `leader`: Standard parameters from the pick-up helper node.

## Events & listeners
None. This component does not register or fire events directly; it uses synchronous behavior tree evaluation and component queries.