---
id: bird_mutant_rift_brain
title: Bird Mutant Rift Brain
description: Controls the decision-making logic for the Mutated Bird Rift entity, determining when it should flee, eat food, or mine Lunar Hail Buildup based on environmental and state conditions.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 3f579641
---

# Bird Mutant Rift Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component implements the behavior tree for the Mutated Bird Rift entity (`prefabs/bird_mutant_rift.lua`). It manages high-level decisions such as fleeing from threats (environmental or living), consuming edible items, and mining Lunar Hail Buildup. It extends the base `Brain` class and constructs a priority-based behavior tree during initialization. The brain relies on multiple component states and properties, including `health` (fire damage), `burnable` (burning status), `eater` (diet preferences), and `hauntable` (panic state), to evaluate current conditions and select appropriate actions.

## Dependencies & Tags
- **Components used:** `burnable`, `eater`, `hauntable`, `health`
- **Tags checked (for filtering entities or items):**
  - `SHOULDFLYAWAY_CANT_TAGS`: `notarget`, `INLIMBO`, `lunar_aligned`
  - `SHOULDFLYAWAY_ONEOF_TAGS`: `player`, `monster`, `scarytoprey`
  - `FOOD_CANT_TAGS`: `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `outofreach`
  - `LUNARHAIL_BUILDUP_MUST_TAGS`: `LunarBuildup`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (injected by `Class`) | The entity instance this brain controls |
| `bt` | `BT` | `nil` (assigned in `OnStart`) | The behavior tree root node |
| `threat` | `Entity?` | `nil` (assigned on-demand) | Cached threat entity used by `ShouldFlyAwayFromThreat` |

## Main Functions

### `MutatedBirdBrain:OnStart()`
* **Description:** Initializes and constructs the behavior tree root node for the brain. Sets up priority-based logic using `PriorityNode` and populates it with conditional and event-driven nodes (`WhileNode`, `IfNode`, `EventNode`, `ActionNode`, `DoAction`). The resulting tree is assigned to `self.bt`.
* **Parameters:** None.
* **Returns:** None.

### `IsSgBusy(inst)`
* **Description:** Helper function that determines if the entity's current stategraph state has a tag indicating it is sleeping, busy, or in flight. Used to prevent conflicting behaviors (e.g., flying away while already in flight).
* **Parameters:**
  - `inst`: `Entity` — the entity instance to inspect.
* **Returns:** `boolean` — `true` if the stategraph state has any tag in `{"sleeping", "busy", "flight"}`, otherwise `false`.

### `ShouldFlyAway(inst)`
* **Description:** Determines if the entity should flee due to unfavorable environmental conditions: (1) during nighttime in a new or quarter moon phase, or (2) when taking fire damage *without* being currently burning. It also ensures the entity is not already in a busy stategraph state.
* **Parameters:**
  - `inst`: `Entity` — the entity instance to evaluate.
* **Returns:** `boolean` — `true` if the entity should fly away, otherwise `false`.

### `ShouldFlyAwayFromThreat(inst)`
* **Description:** Checks for the presence of a living threat within flight distance using `FindEntity`. Uses cached `self.brain.threat` when possible. Only evaluates if the entity is not in a busy state. Threats must match at least one tag in `{"player", "monster", "scarytoprey"}` and lack all tags in `{"notarget", "INLIMBO", "lunar_aligned"}`.
* **Parameters:**
  - `inst`: `Entity` — the entity instance to evaluate.
* **Returns:** `boolean` — `true` if a living threat is detected, otherwise `false`.

### `FlyAway(inst)`
* **Description:** Triggers the "flyaway" event on the entity instance to initiate a flight behavior (e.g., transition to a flight stategraph).
* **Parameters:**
  - `inst`: `Entity` — the entity instance to act upon.
* **Returns:** None.

### `IsFood(item, inst)`
* **Description:** Validates whether a given item is edible by the entity and is positioned on a passable tile.
* **Parameters:**
  - `item`: `Entity` — the candidate item to evaluate.
  - `inst`: `Entity` — the entity instance (used to check diet via `eater` component).
* **Returns:** `boolean` — `true` if the item is edible and passable, otherwise `false`.

### `FindFoodAction(inst)`
* **Description:** Searches for the nearest valid food source within `TUNING.RIFT_BIRD_FOOD_RANGE` using `FindEntity`. Uses `IsFood` as the predicate and filters with `FOOD_CANT_TAGS` and edible item tags obtained from `eater:GetEdibleTags()`. If found, returns a `BufferedAction` for `ACTIONS.EAT`.
* **Parameters:**
  - `inst`: `Entity` — the entity instance to perform the search.
* **Returns:** `BufferedAction?` — a buffered eat action targeting the nearest edible item, or `nil` if no such item exists.

### `FindAndMineLunarHailBuildup(inst)`
* **Description:** Searches for the nearest Lunar Hail Buildup within `TUNING.RIFT_BIRD_FOOD_RANGE` using `FindEntity`. Filters by `LUNARHAIL_BUILDUP_MUST_TAGS` and excludes items with `FOOD_CANT_TAGS`. If found, returns a `BufferedAction` for `ACTIONS.REMOVELUNARBUILDUP`.
* **Parameters:**
  - `inst`: `Entity` — the entity instance to perform the search.
* **Returns:** `BufferedAction?` — a buffered action to remove Lunar Hail Buildup, or `nil` if none exists.

## Events & Listeners
- **Listens to:**
  - `"threatnear"` — triggers a `fly_away_fn` action via `EventNode`.
  - `"gohome"` — triggers a `fly_away_fn` action via `EventNode`.
- **Pushes:**
  - `"flyaway"` — fired by `FlyAway` when initiating departure.