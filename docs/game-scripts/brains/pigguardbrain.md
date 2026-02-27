---
id: pigguardbrain
title: Pigguardbrain
description: Controls the AI behavior of pig guard NPCs, managing combat, navigation, and environmental interactions via a behavior tree.
tags: [ai, combat, npc, brain, behavior-tree]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 57224f52
---

# Pigguardbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This component defines the AI behavior tree for pig guard NPCs in Don't Starve Together. It coordinates high-level actions—such as combat, fleeing, homing to their designated torch, seeking food, and patrolling—through a priority-based behavior tree rooted in `PriorityNode`. It relies heavily on external components for state and utility (`combat`, `inventory`, `eater`, `homeseeker`, `knownlocations`) and integrates with common brain utilities (`BrainCommon`) and movement/action behaviors (`ChaseAndAttack`, `RunAway`, `Wander`, `FaceEntity`). The behavior tree executes in a loop, re-evaluating nodes every frame to ensure responsive adaptation to changing conditions.

## Usage example

```lua
-- Attaching the PigGuardBrain to an entity (e.g., in a prefab definition)
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("brains/pigguardbrain")
```

## Dependencies & tags

**Components used:**
- `combat`: to check for targets, cooldowns, and combat state
- `inventory`: to locate food items and torch fuel
- `eater`: to determine edible items
- `homeseeker`: to identify and verify the home torch location
- `knownlocations`: to retrieve the "home" location

**Tags:**
- This component does not directly add or remove tags on the entity.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bt` | `BT` (Behavior Tree) | `nil` | Initialized in `OnStart`; the active behavior tree instance for decision-making. |

*Note:* The `PigGuardBrain` class inherits from `Brain`, and its primary state (`self.bt`) is set up in `OnStart`. No additional public properties are declared in the constructor.

## Main functions

### `GoHomeAction(inst)`
* **Description:** Returns an action to walk to the pig guard's home location (typically the torch) if no combat target is present and the guard is too far away. Used by the behavior tree to trigger movement to the torch when necessary.
* **Parameters:**
  - `inst`: Entity instance—the pig guard NPC.
* **Returns:** `BufferedAction` if a home location exists and distance exceeds `GO_HOME_DIST`; otherwise `nil`.
* **Error states:** Returns `nil` if `inst.components.combat.target` is set or if `"home"` location is not registered.

### `AddFuelAction(inst)`
* **Description:** Attempts to refuel the pig guard's home torch if it is low (section `<= 1`). First searches inventory for `"pigtorch_fuel"`; if none exists, spawns and gives one. Returns an action to add fuel to the torch.
* **Parameters:**
  - `inst`: Entity instance—the pig guard NPC.
* **Returns:** `BufferedAction` to add fuel to the torch if fuel is available; otherwise `nil`.
* **Error states:** Returns `nil` if home is `nil`, fuel is unavailable, or the torch section is above `1`.

### `FindFoodAction(inst)`
* **Description:** Searches the pig guard's inventory for an item it can eat (via `eater:CanEat`) and returns an `EAT` action to consume it.
* **Parameters:**
  - `inst`: Entity instance—the pig guard NPC.
* **Returns:** `BufferedAction` to eat edible food if found; otherwise `nil`.
* **Error states:** Returns `nil` if `inventory` or `eater` component is missing, or no edible item is found.

### `GetFaceTargetFn(inst)`
* **Description:** Finds the closest nearby player (within `START_FACE_DIST`) eligible for the guard to face. Skips targets tagged `"notarget"`.
* **Parameters:**
  - `inst`: Entity instance—the pig guard NPC.
* **Returns:** Target `Entity` if found and not `notarget`; otherwise `nil`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Determines whether the guard should continue facing a target (used during face behavior maintenance). Returns `true` if the target remains within `KEEP_FACE_DIST` and is not `"notarget"`.
* **Parameters:**
  - `inst`: Entity instance—the pig guard NPC.
  - `target`: `Entity`—the entity being faced.
* **Returns:** `boolean` indicating whether to keep facing the target.

### `ShouldGoHome(inst)`
* **Description:** Checks whether the guard should return to its home location because it is too far away (`GO_HOME_DIST`).
* **Parameters:**
  - `inst`: Entity instance—the pig guard NPC.
* **Returns:** `boolean`; `true` if `"home"` location exists and squared distance to it exceeds `GO_HOME_DIST * GO_HOME_DIST`.

### `GetRunAwayTarget(inst)`
* **Description:** Returns the current combat target as the source of danger to flee from.
* **Parameters:**
  - `inst`: Entity instance—the pig guard NPC.
* **Returns:** `Entity`—the combat target (often a player or enemy attacking the guard).

### `OnStart()`
* **Description:** Constructs and initializes the behavior tree's root node with a priority-ordered list of behaviors, including panic responses, combat logic (chase/attack, dodge), homing, eating, fueling, facing targets, and wandering.
* **Parameters:** None.
* **Returns:** None.
* **Implementation details:** The behavior tree is built using `PriorityNode` with sub-nodes like `ChattyNode`, `WhileNode`, `ChaseAndAttack`, `RunAway`, `DoAction`, `FaceEntity`, and `Wander`. All action selectors are wrapped in `WhileNode` or conditional guards (`ChattyNode`) to respond dynamically to state changes.

## Events & listeners

This component does not register any event listeners or push custom events. It relies entirely on the behavior tree's node evaluation loop and component state queries for updates.