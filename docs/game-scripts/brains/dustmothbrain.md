---
id: dustmothbrain
title: Dustmothbrain
description: Controls the behavior tree of the DustMoth entity, coordinating threat avoidance, food consumption, den repair, dusting actions, and wandering via state-dependent prioritized node logic.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 53717b90
---

# Dustmothbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `DustMothBrain` component implements the decision-making logic for the DustMoth entity using a behavior tree. It coordinates responses to threats (e.g., fleeing from entities with the `scarytoprey` tag), eating `dustmothfood`, repairing the home den via `RepairDenAction`, dusting nearby `dustable` objects, and idle wandering. The behavior tree is constructed in `OnStart()` using prioritized `PriorityNode` conditions and custom `DoAction` nodes backed by helper functions. This brain leverages common utilities from `BrainCommon`, inventory access, known locations, and workable states to adapt behavior dynamically.

## Dependencies & Tags
- **Components used:**
  - `homeseeker` — accessed for `home` location (`inst.components.homeseeker.home`) and validity checks.
  - `inventory` — accessed via `GetItemInSlot(1)` to check currently held item.
  - `knownlocations` — accessed via `GetLocation("home")` to retrieve the home location for wandering.
  - `workable` — checked via `inst.components.homeseeker.home.components.workable.workable` to determine if the den needs repair.
- **Tags:**
  - `"INLIMBO"` — excluded from `NOTAGS`, and used to filter out invalid entities during entity searches.
  - `"player"` and `"NOCLICK"` — excluded via `HUNTERPARAMS_NOPLAYER`.
  - `"scarytoprey"` — included in threat detection (`HUNTERPARAMS_NOPLAYER` and `RunAway`).
  - `"dustmothfood"` — included for food search in `EatFoodAction`.
  - `"dustable"` — included for dusting targets in `DustOffAction`.
- **External scripts:**
  - `behaviours/runaway`, `behaviours/doaction`, `behaviours/wander`
  - `brains/braincommon`

## Properties
No explicit public properties are initialized in the constructor beyond standard `Brain` inheritance. Internal state is managed via instance variables attached to `self.inst` during runtime.

## Main Functions
### `DustMothBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree root node. Constructs a prioritized sequence of conditions and actions that define DustMoth behavior, including panic responses, stuck detection/unstuck logic, repair, eating, dusting, and wandering.
* **Parameters:** None.
* **Returns:** `nil`.

### `AttemptPlaySearchAnim(inst, target)`
* **Description:** Conditionally triggers the `"dustmothsearch"` event and rotates the entity toward `target` to visually indicate search activity. Respects a cooldown (`TUNING.DUSTMOTH.SEARCH_ANIM_COOLDOWN`) and a random chance (`SEARCH_ANIM_CHANCE`).
* **Parameters:**
  - `inst` (Entity): The entity instance owning this brain.
  - `target` (Entity or `nil`): The target entity to face; may be `nil`.
* **Returns:** `nil`.

### `RepairDenAction(inst)`
* **Description:** Attempts to generate a buffered `REPAIR` action if the DustMoth is not busy (`busy` state tag), is fully charged (`_charged` is `true`), has a valid home den, and the den is not currently workable (indicating it needs repair).
* **Parameters:**
  - `inst` (Entity): The entity instance.
* **Returns:** `BufferedAction` (if conditions met and action valid), otherwise `nil`.

### `EatFoodAction(inst)`
* **Description:** Attempts to generate a buffered `EAT` action. First checks if the inventory slot 1 contains `dustmothfood`; if not, searches within `EAT_FOOD_DIST` for valid food items (alive ≥ 1 second and on valid ground). Triggers a search animation before consuming.
* **Parameters:**
  - `inst` (Entity): The entity instance.
* **Returns:** `BufferedAction` (if food found), otherwise `nil`.

### `DustOffAction(inst)`
* **Description:** Attempts to generate a buffered `PET` action (used as a "dust off" proxy) on the nearest `dustable` entity within `DUSTOFF_DIST`, provided the entity is not busy and `_find_dustables` is `true`. Includes a custom distance calculation to allow close proximity interaction.
* **Parameters:**
  - `inst` (Entity): The entity instance.
* **Returns:** `BufferedAction` (if a valid `dustable` is found), otherwise `nil`.

## Events & Listeners
- **Pushes:**
  - `"dustmothsearch"` — fired by `AttemptPlaySearchAnim` to trigger visual feedback when searching for food or dustables.
- **Listens to:**
  - None explicitly defined in this file (relies on parent `Brain` class or stategraph events implicitly).