---
id: eyeofterror_minibrain
title: Eyeofterror Minibrain
description: Controls the AI behavior of the Eye of Terror entity, managing its pathfinding, combat, and foraging actions via a behavior tree.
tags: [ai, combat, boss, navigation]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: c2a19656
system_scope: brain
---

# Eyeofterror Minibrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`EyeOfTerrorMiniBrain` is a `MiniBrain` component that defines the behavioral logic for the Eye of Terror entity in Don't Starve Together. It uses a priority-based behavior tree to prioritize panic responses (e.g., electric fences, combat), followed by eating food and wandering to a remembered spawn point. It relies on the `eater` component to identify edible items and the `knownlocations` component to store and retrieve its spawn position.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst:AddComponent("eater")
inst:AddComponent("knownlocations")
inst:AddComponent("combat")
inst:AddComponent("locomotor")

-- Assign the mini-brain to the entity
inst.brain = EyeOfTerrorMiniBrain(inst)
inst.brain:OnStart()
inst.brain:OnInitializationComplete()
```

## Dependencies & tags
**Components used:** `eater`, `knownlocations`, `combat` (implicitly via `ChaseAndAttack`), `locomotor` (implicitly via behavior tree), `transform` (for position), `physics` (for world coordinates).  
**Tags:** Checks `busy` (state tag), `outofreach`, and `INLIMBO` (used in `FindEntity` filtering).

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree for the Eye of Terror. The root node prioritizes escaping danger (panic triggers, electric fence), then combat, then eating food, and finally wandering near the remembered spawn point—unless currently charging.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None documented.

### `OnInitializationComplete()`
* **Description:** Records the entity’s current world position (with `y = 0`) as the `"spawnpoint"` location. This point is later used as the target for the `Wander` behavior.
* **Parameters:** None.
* **Returns:** Nothing.

### `EatFoodAction(inst)` *(local helper)*
* **Description:** Constructs an `Action` to find and eat a nearby edible item. Fails if the entity is in a `busy` state, no valid food is within range (`FOOD_DISTANCE = 20`), or the item is unreachable or in limbo.
* **Parameters:** `inst` (Entity) — the Eye of Terror entity instance.
* **Returns:** `BufferedAction` instance for `ACTIONS.EAT`, or `nil`.
* **Error states:** Returns `nil` if `inst.sg:HasStateTag("busy")` is true, or if `FindEntity` yields no valid food.

### `GetSpawnPoint(inst)` *(local helper)*
* **Description:** Retrieves the previously stored `"spawnpoint"` location from `knownlocations`.
* **Parameters:** `inst` (Entity) — passed for API consistency but unused.
* **Returns:** Vector position (`pos.x`, `pos.y`, `pos.z`) or `nil` if `"spawnpoint"` was never recorded.

## Events & listeners
None. This component does not register or push events directly.
