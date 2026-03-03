---
id: chest_mimicbrain
title: Chest Mimicbrain
description: Controls the AI behavior of the chest mimic entity, governing actions such as item gathering, wandering, hiding, and combat.
tags: [ai, combat, entity, inventory]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: f9affd5c
system_scope: brain
---

# Chest Mimicbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Chest_MimicBrain` implements the behavior tree logic for the chest mimic entity in DST. It orchestrates high-level decision-making using a priority-based behavior tree to handle states such as item collection, evasion (via hiding), wandering, and combat with players and other creatures. It integrates closely with `timer`, `inventory`, `eater`, `knownlocations`, and stategraph components, and it inherits from the base `Brain` class via `BrainCommon`.

## Usage example
This brain is automatically assigned to the chest mimic prefab during entity creation and is not typically added manually by modders. However, a modder might reference or extend it as follows:

```lua
-- Example of checking behavior state (not direct instantiation)
local mimic = TheSim:FindFirstEntityWithTag("mimic")
if mimic and mimic.brain then
    print("Mimic is currently", mimic.brain.bt and "active" or "inactive")
end
```

## Dependencies & tags
**Components used:** `timer`, `inventory`, `eater`, `knownlocations`, `inventoryitem`  
**Tags:** Checks for `busy` (via `inst.sg:HasStateTag`), `flight`, `jumping`; uses no explicit tag additions/removals.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree for the mimic when the brain is activated (typically when the stategraph starts). Constructs a priority-based behavior tree with nodes for panic, hiding when inventory is full, and separate logic for non-jumping states including item collection, combat, and wandering.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** May fail silently if dependencies like `FindEntity` or `FindWalkableOffset` return `nil`.

### `OnInitializationComplete()`
* **Description:** Records the mimic’s initial position as `"spawnpoint"` using `knownlocations`. Used for navigation reference (e.g., when wandering).
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified.

## Helper Functions
### `TryToHide(inst)`
* **Description:** Attempts to generate an action to hide (transform back into a chest) by moving to a nearby walkable position. Only runs if the stategraph is not currently `busy`.
* **Parameters:** `inst` (Entity) — the mimic entity instance.
* **Returns:** A `BufferedAction` for `ACTIONS.MOLEPEEK`, or `nil` if conditions are not met or no valid position found.
* **Error states:** Returns `nil` if `FindWalkableOffset` fails (e.g., no free space within radius).

### `FindGroundItemAction(inst)`
* **Description:** Searches for and generates an action to pick up or eat a nearby ground item if the mimic’s inventory is not full and cooldown is inactive.
* **Parameters:** `inst` (Entity) — the mimic entity instance.
* **Returns:** A `BufferedAction` with `ACTIONS.PICKUP` or `ACTIONS.EAT`, or `nil` if no valid target or internal conditions block action.
* **Error states:** Returns `nil` if `inst.sg:HasStateTag("busy")`, `INTERACT_COOLDOWN_NAME` timer exists, `inventory:IsFull()` is true, or no target passes the filter.

### `GetWanderPoint(inst)`
* **Description:** Computes a target point for wandering: nearest player’s position (if any), otherwise the remembered `"spawnpoint"`, or `nil` if neither exists.
* **Parameters:** `inst` (Entity) — the mimic entity instance.
* **Returns:** A `Vector3` position or `nil`.
* **Error states:** Returns `nil` if no nearest player and `"spawnpoint"` location is unset.
