---
id: slurtlebrain
title: Slurtlebrain
description: Controls AI behavior for slurtle entities, coordinating actions like fleeing, attacking, eating, stealing food, and returning home using a behavior tree.
tags: [ai, combat, inventory, navigation, eating]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 700ff9d5
---

# Slurtlebrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`SlurtleBrain` is a brain component that defines the AI behavior for slurtle and snurtle entities. It uses a behavior tree (`BT`) with prioritized nodes to coordinate complex actions such as seeking shelter, avoiding damage (including via a shield mechanic), stealing food from other entities, consuming food, and navigating back to a home location when hungry. The brain integrates with several components—`homeseeker`, `eater`, `inventory`, `burnable`, `container`, `pickable`, and `knownlocations`—to make context-aware decisions. It is designed to interact dynamically with the game world, prioritize self-preservation, and exploit available food sources.

## Usage example
Typically, this brain component is assigned to a slurtle or snurtle entity instance during its prefab definition. The component itself is instantiated by the game's AI system and does not require manual intervention. However, for demonstration, here is how the brain might be added and activated on an entity:

```lua
local SlurtleBrain = require("brains/slurtlebrain")
inst:AddBrain(SlurtleBrain(inst))
```

Once added, the brain automatically manages state transitions and behavior selection via its internal behavior tree.

## Dependencies & tags
**Components used:** `homeseeker`, `burnable`, `inventory`, `eater`, `edible`, `container`, `pickable`, `knownlocations`, `inventoryitem`, `bufferedaction`.

**Tags:** This component does not directly add or remove entity tags; it checks existing tags via `HasTag`, `HasDebuff`, and `IsOnValidGround` to make decisions.

## Properties
No public properties are defined in the constructor; this brain relies entirely on behaviors and external component states.

## Main functions
This brain defines only one primary method, `OnStart`, which initializes the behavior tree.

### `SlurtleBrain:OnStart()`
* **Description:** Constructs and assigns the behavior tree root node by evaluating prioritized behaviors: using shield when damaged, panicking at hazards (e.g., electric fences), chasing and attacking targets, eating or stealing food, returning home if hungry, and wandering near home otherwise.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None documented; fails silently if referenced components (e.g., `homeseeker`, `inventory`) are missing.

### Supporting action functions (not methods)
The following functions are defined locally within the file and passed to `DoAction` nodes:

#### `GoHomeAction(inst)`
* **Description:** Returns a buffered action for the entity to go to its assigned home if the home is valid and not burning.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `BufferedAction` or `nil` if conditions are not met.
* **Error states:** Returns `nil` if `homeseeker` or its `home` is invalid, or if the home is burning.

#### `ShouldGoHome(inst)`
* **Description:** Determines whether the entity is sufficiently hungry to return home.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `boolean` — `true` if the time since last meal exceeds `HUNGER_TOLERANCE` (70 seconds).
* **Error states:** None.

#### `IsFoodValid(item, inst)`
* **Description:** Validates that a potential food item is safe and edible.
* **Parameters:** 
  - `item` — the food entity to check.
  - `inst` — the slurtle instance.
* **Returns:** `boolean` — `true` if the item has been alive for at least 8 seconds, is on valid ground, and is edible by the slurtle.
* **Error states:** None.

#### `EatFoodAction(inst)`
* **Description:** Attempts to eat food from inventory or pick up nearby food if hungry and not busy.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if the entity is busy (`HasStateTag("busy")`), has no inventory or eater component, or no valid food is found.

#### `StealFoodAction(inst)`
* **Description:** Scans nearby entities for food in their inventories, containers, or as `slurtlepickable` items, and attempts to steal one via a buffered steal action.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if the entity is busy, no nearby valid targets exist, or no edible items are found in target inventories/containers/pickables. Also skips items belonging to entities with `healingsalve_acidbuff` or owned by other slurtles.

## Events & listeners
This brain does not register or push any events directly. All behavioral decisions are driven by the behavior tree evaluation cycle and component state queries.