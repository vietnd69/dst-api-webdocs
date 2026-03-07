---
id: werepigbrain
title: Werepigbrain
description: Manages AI behavior for Werepigs, including panic responses, food-seeking when safe, combat aggression, and wandering with home-based navigation.
tags: [ai, brain, combat, wander, monster]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 5e33e3dd
---

# Werepigbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `WerePigBrain` component implements the behavior tree for Werepig entities. It orchestrates core AI behaviors including panic reactions to hazards, opportunistic eating of edible items (when not under threat), chasing and attacking aggressive targets, and wandering within a fixed radius from a remembered "home" location. The behavior prioritizes survival and aggression: panic triggers override all other actions, followed by safe eating, combat, and finally idle wandering.

## Usage example
This component is typically added automatically by the game engine when spawning a Werepig entity (e.g., via the `werepig` prefab definition). It is not intended for direct manual instantiation in mod code. A minimal example of how it integrates into an entity's setup is shown below:

```lua
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("werepigbrain")
```

## Dependencies & tags
**Components used:**
- `combat` — accessed via `inst.components.combat.target` and `inst.components.combat.defaultdamage`
- `eater` — accessed via `inst.components.eater:CanEat()` and `inst.components.eater:GetEdibleTags()`
- `knownlocations` — accessed via `inst.components.knownlocations:GetLocation("home")` and `inst.components.knownlocations:RememberLocation("home", ...)`

**Tags:** None identified (no tags are added, removed, or checked directly in this file).

## Properties
No public instance properties are explicitly initialized in the constructor or behavior setup. All logic is embedded in methods and local functions.

## Main functions

### `WerePigBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree (BT) for the Werepig. It constructs a priority-based behavior tree root node that evaluates panic triggers first, then safe eating, followed by combat, and finally wandering.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None documented. Behavior composition depends on external behavior modules (`behaviours/wander`, `behaviours/chaseandattack`) and `BrainCommon` helpers.

### `WerePigBrain:OnInitializationComplete()`
* **Description:** Records the entity's current world position as the "home" location using `knownlocations:RememberLocation`. This position is used later by the `Wander` behavior as a base point.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** May error if `Point` or `GetWorldPosition` fails due to transform issues (not explicitly handled in this file).

### `IsFoodValid(item, inst)`
* **Description:** Local helper function used by the food-finding logic. Determines if an item is valid for eating based on whether the eater can consume it and whether the item is on a passable point.
* **Parameters:**
  - `item`: Entity representing a potential food item.
  - `inst`: The Werepig instance (owner of this component).
* **Returns:** `true` if `inst.components.eater:CanEat(item)` is `true` and `item:IsOnPassablePoint()` is `true`; otherwise `false`.
* **Error states:** None documented.

### `FindFoodAction(inst)`
* **Description:** Attempts to locate an edible item within `SEE_FOOD_DIST` (10 units) and returns a buffered action to eat it. Uses `FindEntity` with tags derived from `eater:GetEdibleTags()` and excludes items with tags in `FINDFOOD_CANT_TAGS`.
* **Parameters:**
  - `inst`: The Werepig instance.
* **Returns:** A `BufferedAction` targeting the found food and using `ACTIONS.EAT`, or `nil` if no valid food is found.
* **Error states:** Returns `nil` if `FindEntity` finds no valid target.

### `TargetIsAggressive(inst)`
* **Description:** Local helper that checks if the Werepig's current combat target is actively aggressive — specifically, if the target has a `combat` component, deals positive damage, and is targeting the Werepig back.
* **Parameters:**
  - `inst`: The Werepig instance.
* **Returns:** `true` if all conditions are met (`target`, `target.components.combat`, `defaultdamage > 0`, and `target == inst`); otherwise `false`.
* **Error states:** Returns `false` if any component check fails (e.g., `combat` is `nil`, `target` is `nil`).

## Events & listeners
None — this component does not register or push any events.