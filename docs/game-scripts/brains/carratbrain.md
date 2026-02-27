---
id: carratbrain
title: Carratbrain
description: Brain component that controls AI behavior for the Carrat entity, handling racing logic, panic states, prey-predator interactions, and basic foraging behaviors.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: f66527f5
---

# Carratbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`CarratBrain` is a brain component responsible for controlling the behavior of the Carrat entity in Don't Starve Together. It implements a behavior tree (`BT`) with conditional execution flows based on the Carrat's racing state (`yotc_racecompetitor.racestate`) and other environmental factors (e.g., fire, enemies, food availability). It coordinates with components such as `health`, `burnable`, `eater`, `hauntable`, and `yotc_racecompetitor`/`yotc_racestats` to respond dynamically to in-game conditions. The brain integrates standard behaviors (`Wander`, `RunAway`, `Panic`, `FaceEntity`, `Leash`) and defines custom action triggers (e.g., `eat_food_action`, `returntobeefalo`).

## Dependencies & Tags

- **Components used:**
  - `health` (`self.inst.components.health`)
  - `burnable` (`self.inst.components.burnable`)
  - `eater` (`self.inst.components.eater`)
  - `entitytracker` (`self.inst.components.entitytracker`)
  - `hauntable` (`self.inst.components.hauntable`)
  - `inventoryitem` (`self.inst.components.inventoryitem`)
  - `yotc_racecompetitor` (`self.inst.components.yotc_racecompetitor`)
  - `yotc_racestats` (`self.inst.components.yotc_racestats`)
- **Tags checked/avoided:**
  - `INLIMBO`, `outofreach`, `scarytoprey`, `character`, `beefalo`, `baby`, `HasCarrat`, `planted`, `Held`
- **Behaviors imported:**
  - `doaction`, `faceentity`, `leash`, `panic`, `runaway`, `wander`
  - `behaviors/doaction`, `behaviors/faceentity`, `behaviors/leash`, `behaviors/panic`, `behaviors/runaway`, `behaviors/wander`
- **Constants:**
  - `AVOID_PLAYER_DIST`, `AVOID_PLAYER_DIST_SQ`, `AVOID_PLAYER_STOP`
  - `SEE_BAIT_DIST`, `MAX_WANDER_DIST`
  - `RACE_WANDER_DURATION`, `RACE_WANDER_MAX_DIST`, `RACE_WANDER_TIMES`, `RACE_WANDER_DATA`

## Properties

No public instance properties are explicitly declared in the constructor or elsewhere. Behavior state is managed internally via the `self.bt` behavior tree and helper functions.

## Main Functions

### `CarratBrain:OnStart()`
* **Description:** Initializes the behavior tree for the Carrat. Constructs a priority-based root node that handles states such as `OnFire`, `AvoidElectricFence`, racing (with sub-states `prerace`, `postrace`, `raceover`, `racing`, `panic_race_start`), panic from haunting, fleeing from scary entities, eating food, returning to beefalo, and wandering. The tree is assigned to `self.bt`.
* **Parameters:** None.
* **Returns:** None. Assigns the root behavior tree to `self.bt`.

### Helper Functions (Internal)

#### `racing_get_checkpoint(inst)`
* **Description:** Returns the next race checkpoint entity if the entity is a race competitor; otherwise `nil`.
* **Parameters:** 
  - `inst` (EntityInstance): The Carrat entity instance.
* **Returns:** `EntityInstance?` — The next checkpoint entity or `nil`.

#### `racing_get_checkpoint_pt(inst)`
* **Description:** Returns the world position (Vector3) of the next race checkpoint, or `nil`. Triggers the `"carrat_error_walking"` event if the Carrat has speed `0` and has not yet spoken about walking issues (tracked via `walkspeechdone`).
* **Parameters:** 
  - `inst` (EntityInstance): The Carrat entity instance.
* **Returns:** `Vector3?` — The checkpoint position or `nil`.

#### `get_race_direction(inst)`
* **Description:** Computes a perturbed heading toward the next race checkpoint, incorporating directional variance based on the Carrat's `yotc_racestats.direction_modifier`.
* **Parameters:** 
  - `inst` (EntityInstance): The Carrat entity instance.
* **Returns:** `number?` — The calculated heading in radians, or `nil` if no checkpoint exists.

#### `is_racecompetitor(inst)`
* **Description:** Checks whether the entity has the `yotc_racecompetitor` component.
* **Parameters:** 
  - `inst` (EntityInstance): The Carrat entity instance.
* **Returns:** `boolean`.

#### `is_waiting_for_race_to_start(inst)`
* **Description:** Checks if the Carrat is in the `"prerace"` state.
* **Parameters:** 
  - `inst` (EntityInstance): The Carrat entity instance.
* **Returns:** `boolean`.

#### `get_trainer(inst)`
* **Description:** Retrieves the trainer entity (via `entitytracker` key `"yotc_trainer"`), if present.
* **Parameters:** 
  - `inst` (EntityInstance): The Carrat entity instance.
* **Returns:** `EntityInstance?` — The trainer entity or `nil`.

#### `get_nearby_trainer_pt(inst)`
* **Description:** Returns the trainer's position if within `TUNING.YOTC_RACER_TRAINER_DIST`; otherwise `nil`.
* **Parameters:** 
  - `inst` (EntityInstance): The Carrat entity instance.
* **Returns:** `Vector3?` — The trainer's position or `nil`.

#### `edible(inst, item)`
* **Description:** Determines if `item` is edible for the Carrat based on multiple conditions (e.g., `CanEat`, is bait, not held, not planted, on passable terrain, same platform).
* **Parameters:** 
  - `inst` (EntityInstance): The Carrat entity instance.
  - `item` (EntityInstance): The potential food item.
* **Returns:** `boolean`.

#### `eat_food_action(inst)`
* **Description:** Searches for edible bait items within `SEE_BAIT_DIST`, avoiding items too close to `scarytoprey` entities (respects `AVOID_PLAYER_DIST`). Returns a buffered `EAT` action for the nearest safe food, or `nil` if no valid target is found.
* **Parameters:** 
  - `inst` (EntityInstance): The Carrat entity instance.
* **Returns:** `BufferedAction?` — An action targeting an edible item or `nil`.

#### `returntobeefalo(inst)`
* **Description:** If `inst.beefalo_carrat` is true, searches for a nearby beefalo (excluding babies and those already carrying a Carrat), and returns a `GOHOME` buffered action.
* **Parameters:** 
  - `inst` (EntityInstance): The Carrat entity instance.
* **Returns:** `BufferedAction?` — A `GOHOME` action targeting a beefalo or `nil`.

## Events & Listeners

- **Pushes:**
  - `"carrat_error_walking"` — Triggered inside `racing_get_checkpoint_pt` when the Carrat has speed `0` and has not yet marked `walkspeechdone` as true. Used for speech or UI feedback in race contexts.