---
id: deerclopsbrain
title: Deerclopsbrain
description: Controls the decision-making behavior of the Deerclops boss, coordinating combat, movement, base destruction, and ice regeneration.
tags: [combat, ai, boss, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 108a1e93
system_scope: brain
---

# Deerclopsbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Deerclopsbrain` is a brain component that governs the AI behavior of the Deerclops boss entity. It uses a Behavior Tree (BT) architecture to orchestrate complex, state-aware actions including combat (chase, attack, face target), base destruction, ice regeneration, and wander patterns. It relies on the `combat`, `burnable`, and `knownlocations` components to make context-sensitive decisions, and integrates with custom behaviors (`ChaseAndAttack`, `Wander`, `DoAction`, `AttackWall`, `Leash`, `FaceEntity`).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:Class("DeerclopsBrain")
inst.components.brain:OnStart()
```

## Dependencies & tags
**Components used:** `combat`, `burnable`, `knownlocations`, `workable`, `transform`, `physics`  
**Tags:** Reads `entity`, `structure`, `wall`, `deerclops`; no tags added or removed directly by this brain.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree root node hierarchy. It constructs a priority-based BT that handles ice regeneration, wall attacks, cooldown evasion, combat approach/retreat (including ocean-specific distance logic), base destruction, and wander paths.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnInitializationComplete()`
* **Description:** Records the entity’s initial spawn position as `"spawnpoint"` in `knownlocations`. Prevents overwriting an existing `"spawnpoint"` if already set.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetTarget(inst)`
* **Description:** Convenience wrapper to retrieve the current combat target.
* **Parameters:** `inst` (entity) — the Deerclops instance.
* **Returns:** The current target entity (or `nil`).

### `IsTarget(inst, target)`
* **Description:** Checks whether the given entity is the current combat target.
* **Parameters:** `inst` (entity), `target` (entity or `nil`).
* **Returns:** `true` if `target == inst.components.combat.target`; otherwise `false`.

### `GetTargetPos(inst)`
* **Description:** Returns the world position of the current combat target, or `nil` if no target exists.
* **Parameters:** `inst` (entity).
* **Returns:** `Vector3` position of target, or `nil`.

### `BaseDestroy(inst)`
* **Description:** Attempts to find and attack a destroyable structure (e.g., wall) within sight if the `"targetbase"` location is remembered. Targets must have `workable.action == ACTIONS.HAMMER`, be a structure, be on valid ground, and not have the `"wall"` tag in `BASEDESTROY_CANT_TAGS` (note: `"wall"` is in the list, so it will be skipped — intended behavior is to *exclude* walls).
* **Parameters:** `inst` (entity).
* **Returns:** A `BufferedAction` if a target is found and action is issued; otherwise `nil`.

### `GetNewHome(inst)`
* **Description:** Computes and remembers a new `"home"` location via `GetWanderAwayPoint`, and schedules automatic forgetting of `"home"` after 30 seconds.
* **Parameters:** `inst` (entity).
* **Returns:** Nothing.

### `GetHomePos(inst)`
* **Description:** Returns the remembered `"home"` location, computing a new one if needed.
* **Parameters:** `inst` (entity).
* **Returns:** `Vector3` position of `"home"`, or `nil`.

### `GetWanderPos(inst)`
* **Description:** Returns a preferred wander destination in order of priority: `"targetbase"`, `"home"`, `"spawnpoint"`. Returns `nil` if none are set.
* **Parameters:** `inst` (entity).
* **Returns:** `Vector3` or `nil`.

### `ShouldGrowIce(inst)`
* **Description:** Determines whether the Deerclops should currently regenerate ice (e.g., eye ice, aura circle). Considers burn state, combat status, memory flags (`noice`, `noeyeice`, `circle`), and frenzy logic.
* **Parameters:** `inst` (entity).
* **Returns:** `true` if ice should be regenerated; otherwise `false`.

### `OceanChaseWaryDistance(inst, target)`
* **Description:** Returns a safe minimum chase distance when the target is on water. Returns `0` (can approach fully) if attack range can be reached from shore; otherwise returns a safe buffer distance (`OUTSIDE_CATAPULT_RANGE`) to avoid being too close.
* **Parameters:** `inst` (entity), `target` (entity).
* **Returns:** `number` distance.

## Events & listeners
- **Listens to:** None directly. (Event-driven actions like `"doicegrow"` are triggered internally via `inst:PushEvent` within the BT.)
- **Pushes:** `"doicegrow"` — fired when ice regeneration should begin (within the `ShouldGrowIce` condition branch of the BT).
