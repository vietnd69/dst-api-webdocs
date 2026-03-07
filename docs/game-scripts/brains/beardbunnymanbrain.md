---
id: beardbunnymanbrain
title: Beardbunnymanbrain
description: An unused and unmaintained brain class intended for a WerePig-style AI behavior in DST.
tags: [ai, brain, unused]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: f2cfe18a
system_scope: brain
---

# Beardbunnymanbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`beardbunnymanbrain.lua` defines an unused and unmaintained brain class named `WerePigBrain` intended for an AI-controlled entity (likely a variant of Werepig). The comment at the top explicitly warns: *"Unused, not maintained, don't copy from this file."* It implements basic behavior via a behavior tree, including panic handling, food seeking (when safe), chasing/attacking, and wandering back toward a remembered home location. The brain depends on shared behavior helpers and components for movement, combat, eating, homing, and location tracking.

## Usage example
This brain is not intended for use in production code. As a reference, here is how one *might* attach it to an entity (though discouraged per source comments):

```lua
local WerePigBrain = require("brains/beardbunnymanbrain")
inst:AddBrain(WerePigBrain(inst))
```

## Dependencies & tags
**Components used:**  
- `combat` (to check `defaultdamage`, `target`, and target status)  
- `eater` (to determine edible targets via `CanEat`)  
- `follower` (to verify lack of leader)  
- `homeseeker` (to access and verify home location)  
- `knownlocations` (to remember and retrieve `"home"` position)  

**Tags:** None identified.

## Properties
No public properties are defined in this file.

## Main functions
### `FindFoodAction(inst)`
*   **Description:** Searches for an edible entity within `SEE_FOOD_DIST` (10 units) that is edible (`eater:CanEat`) and on a passable point. Returns a buffered `EAT` action on success, or `nil`.
*   **Parameters:** `inst` (entity instance) — the actor seeking food.
*   **Returns:** `BufferedAction` or `nil`.
*   **Error states:** Returns `nil` if no valid food target is found or if the `eater` component is missing.

### `GoHomeAction(inst)`
*   **Description:** Returns a `GOHOME` buffered action toward the entity’s home if no leader exists and the home location is valid and known. *Note: This function is defined but never used in the brain.*
*   **Parameters:** `inst` (entity instance).
*   **Returns:** `BufferedAction` or `nil`.
*   **Error states:** Returns `nil` if the entity has a leader, lacks the `homeseeker` component, or the home location is invalid/unset.

### `TargetIsAggressive(inst)`
*   **Description:** Checks whether the current combat target is actively attacking the entity (`target.combat.target == inst`) and deals damage (`defaultdamage > 0`). Used to toggle between eating and combat states.
*   **Parameters:** `inst` (entity instance).
*   **Returns:** `boolean`.
*   **Error states:** Returns `false` if no combat target exists, target lacks combat component, or target is not targeting `inst`.

### `WerePigBrain:OnStart()`
*   **Description:** Initializes the brain's behavior tree with a priority-based root node. Highest-priority behaviors are panic triggers (via `BrainCommon`), followed by safe eating, combat/chase, and finally wandering toward remembered home.
*   **Parameters:** None (instance method).
*   **Returns:** Nothing.
*   **Error states:** Behavior tree setup may fail if required components (`combat`, `eater`, `knownlocations`, etc.) are missing, but no explicit error handling is present.

### `WerePigBrain:OnInitializationComplete()`
*   **Description:** Records the entity’s current world position as `"home"` in `knownlocations` once initialization completes.
*   **Parameters:** None (instance method).
*   **Returns:** Nothing.

## Events & listeners
This file does not define any event listeners or events pushed. It relies on external systems (e.g., `ChaseAndAttack`, `Wander`, `DoAction`) to handle events internally.
