---
id: rockybrain
title: Rockybrain
description: Controls the AI behavior of Rocky, a boss character that manages combat, shield usage, loyalty retention under stress, and goal-driven actions like eating and wandering.
tags: [ai, combat, boss, loyalty, shield]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: ddb54202
system_scope: brain
---

# Rockybrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`RockyBrain` is a behavior tree–driven AI brain for the boss entity Rocky. It orchestrates high-level decision-making including combat engagement with chase/attack logic, shield deployment when damaged, panic-driven loyalty loss, and opportunistic eating or item pickup. The brain extends `BrainCommon` and integrates components for combat, follower loyalty, inventory, and known locations to coordinate emergent behavior during boss encounters.

## Usage example
```lua
local inst = CreateEntity()
inst:AddBrain("rockybrain")
-- The brain automatically activates on stategraph start and begins managing behavior via its behavior tree
```

## Dependencies & tags
**Components used:** `combat`, `eater`, `follower`, `inventory`, `inventoryitem`, `knownlocations`  
**Tags:** Checks `notarget`, `edible_ELEMENTAL`, `_inventoryitem`, `INLIMBO`, `fire`, `catchable`, `outofreach`; does not add or remove tags.

## Properties
No public properties

## Main functions
### `OnStop()`
* **Description:** Cleans up the "epicscare" event listener and resets the scare timer. Called when the brain stops executing (e.g., when the stategraph exits its root state).
* **Parameters:** None.
* **Returns:** Nothing.

### `OnStart()`
* **Description:** Initializes and starts the behavior tree. Registers an `"epicscare"` callback to extend panic duration, and constructs a prioritized root node containing sequential sub-trees for panic response, combat, eating/pickup, following, facing, and wandering.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `epicscare` – updates `scareendtime` to extend the panic window (used by `ScaredLoseLoyalty` to potentially drop loyalty).
- **Pushes:** None directly; delegates events to stategraph and behavior tree infrastructure.
