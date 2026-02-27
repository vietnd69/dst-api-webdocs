---
id: kitcoonbrain
title: Kitcoonbrain
description: Controls the decision-making logic for Kitcoon entities, handling behaviors like following the owner, avoiding combat, playing with toys, and interacting with minigames.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 0a44d87e
---

# Kitcoonbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `KitcoonBrain` component implements the behavior tree logic for Kitcoon entities in Don't Starve Together. It orchestrates high-level decision making, prioritizing behaviors such as staying near and following the owner, avoiding active combat, playing with toys or other Kitcoons, and watching minigames when the owner participates. The brain integrates several behaviors (`Follow`, `Wander`, `FaceEntity`, `Panic`, `RunAway`, `StandStill`, `Leash`) and dynamically selects the most appropriate action based on context provided by multiple components.

## Dependencies & Tags
- **Components used:**
  - `burnable` (via `IsBurning`)
  - `combat` (to check combat participation)
  - `entitytracker` (to locate owner, home den, and nearby entities)
  - `follower` (to retrieve owner/leader)
  - `grouptargeter` (to check if entity is targeting the owner)
  - `locomotor` (to check if owner is moving)
  - `minigame` (to access minigame watch distances)
  - `minigame_participator` (to detect if owner is in a minigame)
  - `sleeper` (to avoid playing with sleeping entities)
  - `timer` (to check for panic state)
- **Tags:** The brain references tags such as `"busy"`, `"playerghost"`, `"kitcoon"`, `"cattoy"`, `"cattoyairborne"`, `"catfood"`, `"scarytoprey"`, `"_combat"`, `"_health"`, `"wall"`, `"INLIMBO"`, `"FX"`, `"NOCLICK"`, `"DECOR"`, `"stump"`, `"burnt"`, `"notarget"`, `"flight"`, `"fire"`, `"irreplaceable"` for filtering and conditionals. It does not directly manipulate tags but reads them via `FindEntity` and `HasTag` calls.

## Properties
The `KitcoonBrain` class has no public properties beyond inherited Behavior Tree (`BT`) state. All internal logic is driven by local functions and node data captured in the behavior tree.

## Main Functions
### `KitcoonBrain:OnStart()`
* **Description:** Initializes the behavior tree by constructing a priority-based hierarchy of behavior nodes. This method defines the full behavioral sequence, including combat avoidance, minigame watching, toy play, affection, and wandering.
* **Parameters:** None.
* **Returns:** None.

### `GetOwner(inst)`
* **Description:** Helper that retrieves the Kitcoon’s owner/leader from the `follower` component.
* **Parameters:** `inst` — the Kitcoon entity instance.
* **Returns:** The leader instance, or `nil` if not present.

### `OwnerIsClose(inst)`
* **Description:** Determines if the owner is within a maximum follow distance.
* **Parameters:** `inst` — the Kitcoon entity instance.
* **Returns:** `true` if owner exists and is within `MAX_FOLLOW_DIST` units; otherwise `false`.

### `GetDenPos(inst)`
* **Description:** Retrieves the position of the Kitcoon’s den (home entity) tracked via `entitytracker`.
* **Parameters:** `inst` — the Kitcoon entity instance.
* **Returns:** Position vector of the den, or `nil` if den is not found.

### `LoveOwner(inst)`
* **Description:** Attempts to initiate a nuzzle action toward the owner, respecting timing and luck constraints.
* **Parameters:** `inst` — the Kitcoon entity instance.
* **Returns:** Action result (via `BufferedAction`), or `nil` if conditions are not met.

### `_avoidtargetfn(self, target)`
* **Description:** Core combat-avoidance predicate. Determines if a given entity represents a dangerous combat situation the Kitcoon should avoid.
* **Parameters:**  
  - `self` — the behavior context.  
  - `target` — the entity to evaluate for combat threat.
* **Returns:** `true` if the target poses a combat risk to the owner (per proximity, active targeting, or recent combat); otherwise `false`.

### `CombatAvoidanceFindEntityCheck(self)`
* **Description:** Factory function returning a filter predicate for `FindEntity`, used to locate combat threats for avoidance.
* **Parameters:** `self` — the behavior context.
* **Returns:** A function `(ent) -> boolean` that evaluates if `ent` should trigger combat avoidance.

### `ValidateCombatAvoidance(self)`
* **Description:** Re-validates an active combat avoidance state to ensure the threat persists and remains in range before terminating it.
* **Parameters:** `self` — the behavior context.
* **Returns:** `true` if the combat threat remains valid and within range; otherwise `false`.

### `ShouldPanic(inst)`
* **Description:** Checks if the Kitcoon should enter a panic state (due to explicit panic timer or a burning den).
* **Parameters:** `inst` — the Kitcoon entity instance.
* **Returns:** `true` if panic timer exists or den is burning; otherwise `false`.

### `FindPlaymate(self)`
* **Description:** Attempts to locate or retain a nearby Kitcoon playmate, respecting play cooldowns, proximity to owner, and sleep state.
* **Parameters:** `self` — the behavior context.
* **Returns:** `true` if a valid playmate is found or retained; otherwise `false`.

### `TargetCanPlay(self, target, owner)`
* **Description:** Verifies if a given entity is eligible to play (e.g., not busy, not sleeping, on passable terrain).
* **Parameters:**  
  - `self` — the behavior context.  
  - `target` — the candidate playmate.  
  - `owner` — the Kitcoon’s owner.
* **Returns:** `true` if the target can play; otherwise `false`.

### `PlayAction(inst)`
* **Description:** Attempts to play with a nearby toy or food item, reserving it briefly to prevent concurrent access.
* **Parameters:** `inst` — the Kitcoon entity instance.
* **Returns:** A `BufferedAction` or `nil` if no valid target or cooldown active.

### `GetFollowToy(inst)`
* **Description:** Retrieves the current toy object being followed, if valid and not in limbo.
* **Parameters:** `inst` — the Kitcoon entity instance.
* **Returns:** The toy entity, or `nil`.

### `WatchingMinigame(inst)`
* **Description:** Returns the minigame the Kitcoon’s owner is participating in, if any.
* **Parameters:** `inst` — the Kitcoon entity instance.
* **Returns:** The `minigame` component instance, or `nil`.

### `WatchingMinigame_MinDist(inst)`, `WatchingMinigame_TargetDist(inst)`, `WatchingMinigame_MaxDist(inst)`
* **Description:** Convenience helpers returning minigame watch distance thresholds (`watchdist_min`, `watchdist_target`, `watchdist_max`) from the owner’s minigame component.
* **Parameters:** `inst` — the Kitcoon entity instance.
* **Returns:** Float value of the respective distance threshold, or `0` if no minigame.

## Events & Listeners
- **Pushes:**
  - `"critter_avoidcombat"` with `{avoid=true}` or `{avoid=false}` — to notify system of combat avoidance entry/exit.
  - `"start_playwithplaymate"` with `{target=playfultarget}` — to signal intent to interact with playmate.
  - `"on_played_with"` with `target` — fired after successfully playing with a toy.

- **Listens to:**
  - None defined in this brain (all event usage is via pushing; listening is handled by external systems like state graphs or other components).