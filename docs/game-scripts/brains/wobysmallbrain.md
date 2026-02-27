---
id: wobysmallbrain
title: Wobysmallbrain
description: Implements the AI behavior tree for the Woby small variant, handling combat avoidance, playful interaction with other critters, affection towards its owner, and helper actions such as fetching and foraging.
tags: [ai, behavior-tree, companion, combat-avoidance, affection]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: f601ae52
---

# Wobysmallbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `WobySmallBrain` component defines the behavior tree logic for the small Woby variant, a companion entity in `Don't Starve Together`. It orchestrates decision-making using a priority-based behavior tree (`BT`) to manage state transitions between following its owner, avoiding nearby combat, playing with other critters, showing affection, and performing helper tasks (foraging, retrieving ammo, etc.). It integrates closely with the `Follower`, `Combat`, `Locomotor`, `Sleeper`, and `CritterTraits` components, and relies on several custom behaviors from the `behaviours/` directory and shared helper functions from `wobycommon.lua`.

## Usage example

Typically instantiated by adding the component to a Woby entity during its prefab definition:

```lua
inst:AddComponent("wobysmallbrain")
```

The component automatically initializes its behavior tree when the entity enters the world and begins execution. No manual function calls are required; behavior transitions are driven internally via the behavior tree root node.

## Dependencies & tags

**Components used:**
- `follower` — for retrieving the owner via `GetLeader()`
- `combat` — for detecting active combat and timing
- `crittertraits` — for checking dominant "playful" trait via `IsDominantTrait`
- `grouptargeter` — for verifying if another entity is targeting the owner
- `locomotor` — for checking movement intent via `WantsToMoveForward`
- `sleeper` — for verifying if a potential playmate is asleep

**Tags:**
- `flying` — used during playmate selection to bypass ground pathing constraints
- `busy` — used to block affection and playmate interactions via state tags
- `_combat`, `_health`, `wall`, `INLIMBO` — used internally during entity filtering in combat avoidance

## Properties

No explicit public properties are defined in the constructor beyond the inherited behavior tree state. All state is stored on `self` within the behavior tree root definition.

## Main functions

### `WobySmallBrain:OnStart()`
* **Description:** Constructs and assigns the root behavior tree (`self.bt`) used for decision-making. Defines a multi-level priority structure handling combat avoidance, recall, helper tasks, playful interactions, affection, and idle states.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** None known; behavior tree root must be non-nil for AI execution.

### `GetOwner(inst)`
* **Description:** Helper function that returns the owner of the instance by querying `inst.components.follower:GetLeader()`.
* **Parameters:** `inst` — the entity instance.
* **Returns:** The leader entity or `nil` if no owner is assigned.
* **Error states:** Returns `nil` if the `follower` component is missing or `GetLeader()` returns `nil`.

### `OwnerIsClose(inst, distance)`
* **Description:** Checks whether the owner is within a given distance (default `MAX_FOLLOW_DIST = 4.5`).
* **Parameters:** 
  - `inst` — the entity instance.
  - `distance` (optional) — numeric threshold for distance check.
* **Returns:** `true` if owner exists and is within distance; otherwise `false`.
* **Error states:** Returns `false` if `GetOwner(inst)` returns `nil`.

### `LoveOwner(inst)`
* **Description:** Attempts to perform a "nuzzle" action toward the owner if conditions (not busy, owner not a ghost, cooldown passed, and luck roll succeeds) are met.
* **Parameters:** `inst` — the entity instance.
* **Returns:** A `BufferedAction` result or `nil`.
* **Error states:** Returns `nil` if any condition fails (e.g., `busy` state tag, invalid owner, cooldown active, or luck failure).

### `TargetCanPlay(self, target, owner, max_dist_from_owner, is_flier)`
* **Description:** Validates whether a target entity can be selected as a playmate based on playfulness, proximity, ground availability, and sleep state.
* **Parameters:** 
  - `self` — the brain instance (used for trait checks).
  - `target` — candidate entity.
  - `owner` — the owner entity.
  - `max_dist_from_owner` — maximum distance the target can be from the owner to be valid.
  - `is_flier` — whether the owner can ignore ground constraints.
* **Returns:** `true` if the target satisfies all play criteria; otherwise `false`.
* **Error states:** Returns `false` if `target.IsPlayful` is not `nil` and `target:IsPlayful()` returns `false`, or if `target.components.sleeper:IsAsleep()` is `true`.

### `FindPlaymate(self)`
* **Description:** Attempts to locate or retain a valid playmate within proximity of the owner. Prioritizes current playmate if still valid, otherwise searches for new playmates based on dominant trait and location.
* **Parameters:** `self` — the brain instance.
* **Returns:** `true` if a playmate is found or retained; `false` otherwise.
* **Error states:** May return `false` if no candidate meets `TargetCanPlay`, owner is far away, or owner is moving (`WantsToMoveForward()` is `true`).

### `_avoidtargetfn(self, target)`
* **Description:** Determines whether a given entity is a threat requiring avoidance. Considers active combat, recent combat timing, and proximity to the owner.
* **Parameters:** `self` — the brain instance.
* **Returns:** `true` if `target` should be avoided; otherwise `false`.
* **Error states:** Returns `false` if either owner or `target` lacks `combat` component, or if combat distance thresholds are exceeded.

### `ValidateCombatAvoidance(self)`
* **Description:** Verifies whether the current `runawayfrom` target is still a valid threat and within effective range. Fires `"critter_avoidcombat"` events as needed.
* **Parameters:** `self` — the brain instance.
* **Returns:** `true` if combat avoidance remains active; otherwise `false`.
* **Error states:** Sets `self.runawayfrom = nil` and emits `"critter_avoidcombat"` with `{avoid=false}` if the threat is no longer valid or out of range.

### `CombatAvoidanceFindEntityCheck(self)`
* **Description:** Returns a predicate function used by `FindEntity` to locate threats requiring avoidance.
* **Parameters:** `self` — the brain instance.
* **Returns:** A function `function(ent) ... end` that evaluates whether `ent` should be avoided.
* **Error states:** Emits `"critter_avoidcombat"` with `{avoid=true}` upon finding a threat.

### `PlayWithPlaymate(self)`
* **Description:** Fires the `"start_playwithplaymate"` event with the current `playfultarget` to notify systems of the start of playful interaction.
* **Parameters:** `self` — the brain instance.
* **Returns:** None.
* **Error states:** None known.

## Events & listeners

- **Listens to:**
  - None explicitly defined in this file (the component does not register listeners for external events directly).
- **Pushes:**
  - `"critter_avoidcombat"` — fired with `{avoid=true}` when a threat is first detected, and `{avoid=false}` when avoidance is no longer needed.
  - `"start_playwithplaymate"` — fired when a valid playmate interaction begins, including the `playfultarget` in the event data.

> Note: While `inst:ListenForEvent` is not called directly here, listeners are likely registered via external stategraph or prefabs using this brain. This file only defines the brain logic, not event subscription.