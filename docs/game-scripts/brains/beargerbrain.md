---
id: beargerbrain
title: Beargerbrain
description: Manages the AI decision-making and behavior tree for the Bearger character, including combat, food gathering, foraging, and seasonal movement patterns.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: db526e95
---

# Beargerbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `BeargerBrain` component implements the core AI logic for the Bearger character in `Don't Starve Together`. It constructs and maintains a behavior tree (`self.bt`) that orchestrates complex, context-sensitive behaviors such as chasing and attacking enemies, seeking and consuming food, stealing food from structures, harvesting resources (e.g., beehives, farms), and seasonal wander patterns. It integrates with multiple components to make decisions based on game state (e.g., season, base proximity) and entity properties (e.g., tags, health, position). This brain is responsible for autonomous decision-making during both active (summer) and migratory (autumn) phases, and it respects seasonal tuning parameters like travel distance and attack range.

## Dependencies & Tags

- **Components used:**
  - `combat`: for targeting,CanTarget checks, and `target` property.
  - `eater`: for food compatibility (`CanEat`, `GetEdibleTags`), used in food search.
  - `inventory`: for checking if inventory is full, and finding edible items.
  - `container`: for checking container emptiness and finding items via `FindItem`.
  - `stewer`, `dryer`, `crop`, `harvestable`, `pickable`: to determine readiness for harvesting and interaction.
  - `timer`: for checking timer existence (e.g., "GroundPound").
  - `knownlocations`: to store/retrieve spawn point location for seasonal home logic.
  - `workable`: used implicitly via `item.components.workable` checks (though no direct method is called on `workable` in this script).
- **Tags added/checked:**
  - `structure`, `beehive`, `honeyed`, `lunar_aligned`, `busy`, `wantstoeat`, `running`, `jumping`, `staggered`.
  - Tags excluded from search (`NO_TAGS`): `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `burnt`, `outofreach`.
  - `BASE_TAGS`: `{ "structure" }`, used to detect proximity to player structures.
  - `PICKABLE_FOODS`: internal lookup table (`berries`, `cave_banana`, `carrot`, `red_cap`, `blue_cap`, `green_cap`).

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.seenbase` | boolean | `false` | Tracks whether the Bearger has entered the vicinity of a player structure; becomes `true` once 2 or more `structure` tagged entities are within `SEE_STRUCTURE_DIST`. |
| `inst.wanderdirection` | number | `nil` | Stores the current wander angle (in radians) set by `SetWanderDirection` and used by `GetWanderDirection`. |
| `inst.canrunningbutt` | boolean | inferred (not set here) | Controls whether the `ChaseAndRam` behavior should terminate early if `GroundPound` timer is active. |

## Main Functions

### `EatFoodAction(inst)`
* **Description:** Constructs a priority-based food-gathering action. First checks inventory for edible items to eat. If none found and Bearger is not busy, scans nearby entities (within `SEE_FOOD_DIST`) for edible, unharvested food. Prioritizes picking up `honeyed` items first (via `PICKUP`), then other edible items (via `PICKUP`).
* **Parameters:**
  - `inst`: The Bearger entity instance.
* **Returns:** `BufferedAction` if a valid target and action (`EAT`, `PICKUP`) is identified; otherwise `nil`.

### `StealFoodAction(inst)`
* **Description:** Implements a priority-based foraging and stealing behavior. Scans nearby structures (within `SEE_STRUCTURE_DIST`) and categorizes them into priority tiers: cooking pots/stewers and drying racks/crops/honeyed structures (fridge/chest/backpack) take precedence over unprocessed food sources (beeboxes, mushroom farms, raw plants). Prioritizes `honeyed` items when possible, and returns appropriate actions (e.g., `HARVEST`, `HAMMER`, `STEAL`, `PICK`).
* **Parameters:**
  - `inst`: The Bearger entity instance.
* **Returns:** `BufferedAction` for the highest-priority food source found, or `nil`.

### `AttackHiveAction(inst)`
* **Description:** Finds and targets a beehive within `SEE_STRUCTURE_DIST` that is targetable (`combat:CanTarget`) and on valid ground, returning an `ATTACK` buffered action.
* **Parameters:**
  - `inst`: The Bearger entity instance.
* **Returns:** `BufferedAction(inst, hive, ACTIONS.ATTACK)` if a valid hive is found; otherwise `nil`.

### `ShouldEatFoodFn(inst)`
* **Description:** Predicate function that returns `true` if the Bearger is at or near a player base (i.e., has encountered 2 or more `structure` entities within `SEE_STRUCTURE_DIST`). Used by the behavior tree to enable eating/stealing prioritization when near bases.
* **Parameters:**
  - `inst`: The Bearger entity instance.
* **Returns:** `true` if `inst.seenbase` is `true` or base proximity condition is met during call; otherwise `false`.

### `GetHome(inst)`
* **Description:** Returns the spawn point location during `summer` (via `knownlocations:GetLocation("spawnpoint")`); returns `nil` in other seasons. Used by `Wander` as the home point for movement.
* **Parameters:**
  - `inst`: The Bearger entity instance.
* **Returns:** Vector position of spawn point in summer, `nil` otherwise.

### `GetTargetDistance(inst)`
* **Description:** Returns season-dependent movement distance via `TUNING.BEARGER_SHORT_TRAVEL` (summer) or `TUNING.BEARGER_LONG_TRAVEL` (autumn); returns `0` otherwise.
* **Parameters:**
  - `inst`: The Bearger entity instance.
* **Returns:** Numeric distance threshold for Wander behavior based on season.

### `GetWanderDirection(inst)`
* **Description:** Returns the stored wander direction (angle in radians) from `inst.wanderdirection`.
* **Parameters:**
  - `inst`: The Bearger entity instance.
* **Returns:** Number (radian angle) or `nil`.

### `SetWanderDirection(inst, angle)`
* **Description:** Stores the given `angle` (radians) in `inst.wanderdirection`.
* **Parameters:**
  - `inst`: The Bearger entity instance.
  - `angle`: Number (radian angle) to store.
* **Returns:** Nothing.

### `OceanDistanceTest(inst, target)`
* **Description:** Determines the maximum range at which Bearger can attack a target, respecting boat/water obstacles and special conditions. Returns `TUNING.BEARGER_ATTACK_RANGE - 0.25` if Bearger can reach the target from shore (using `CanProbablyReachTargetFromShore`) and target is not a beehive or while `GroundPound` timer is inactive; otherwise returns a large offset (`OUTSIDE_CATAPULT_RANGE`).
* **Parameters:**
  - `inst`: The Bearger entity instance.
  - `target`: Entity to test distance against.
* **Returns:** Numeric distance threshold (e.g., `TUNING.BEARGER_ATTACK_RANGE - 0.25`) or `OUTSIDE_CATAPULT_RANGE`.

### `InRamDistance(inst, target)`
* **Description:** Predicate used to determine if the Bearger should initiate a charge/ram based on target proximity. Returns `false` if target is within 10 units (i.e., already in melee range); otherwise returns `true` for land targets, or for off-land targets (boats/water) if `CanProbablyReachTargetFromShore` allows approaching within attack range.
* **Parameters:**
  - `inst`: The Bearger entity instance.
  - `target`: Entity to test distance against.
* **Returns:** `true` if ram/charge is appropriate; `false` otherwise.

### `BeargerBrain:OnStart()`
* **Description:** Initializes the behavior tree (`self.bt`) with a hierarchical priority node structure that governs Bearger’s behavior. The root handles non-busy states, with sub-priorities for panic (if not lunar-aligned), charging/ramming, combat, base-near behavior (eating/stealing), wander, and idle. Integrates custom `DoAction` nodes (`EatFoodAction`, `StealFoodAction`, `AttackHiveAction`) and behavioral utilities (`ChaseAndAttack`, `ChaseAndRam`, `Wander`, `StandStill`). Uses tuning parameters for chase duration, distance thresholds, and ocean reachability.
* **Parameters:** None (uses `self.inst`).
* **Returns:** Nothing.

### `BeargerBrain:OnInitializationComplete()`
* **Description:** Registers the Bearger’s current position as `"spawnpoint"` in `knownlocations`, preserving it for seasonal use (e.g., return to spawn in summer).
* **Parameters:** None (uses `self.inst`).
* **Returns:** Nothing.

## Events & Listeners

- **Listens to:** None.
- **Pushes:** None.

> Note: This brain does not directly register event listeners or push events; it relies on stategraph transitions and the behavior tree for reaction to game state changes.