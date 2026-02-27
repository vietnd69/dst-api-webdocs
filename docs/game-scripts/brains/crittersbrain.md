---
id: crittersbrain
title: Crittersbrain
description: Implements AI behavior for small animal entities, handling following, playful interaction with other critters, and avoidance of ongoing combat.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: a73d083d
---

# Crittersbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `Crittersbrain` component provides behavior tree-based AI logic for small critter entities (e.g., butterflies, fireflies, small mammals). It orchestrates core behaviors such as following an owner, playing with other critters, avoiding active combat, and watching minigames. It relies on the Behavior Tree (`BT`) system and integrates with several components—including `follower`, `crittertraits`, `locomotor`, `sleeper`, `combat`, `grouptargeter`, and `minigame_participator`—to make context-aware decisions. This brain is typically attached to small, non-hostile, non-player entities that exhibit social or reactive behaviors.

## Dependencies & Tags
- **Components used:** `combat`, `crittertraits`, `follower`, `grouptargeter`, `locomotor`, `minigame_participator`, `sleeper`
- **Tags:** Reads `"flying"`, `"busy"`, `"_combat"`, `"_health"`, `"wall"`, `"INLIMBO"`; does not modify tags.

## Properties
The brain does not declare any direct instance properties in the constructor or `OnStart`. It relies entirely on local helper functions and closure-captured variables (`self.runawayfrom`, `self.playfultarget`) stored on `self` during behavior evaluation.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.runawayfrom` | `entity | nil` | `nil` | Stores the hostile entity currently being avoided during combat avoidance logic. Validated and cleared by `ValidateCombatAvoidance`. |
| `self.playfultarget` | `entity | nil` | `nil` | Stores the current critter being played with; updated by `FindPlaymate`. |

## Main Functions

### `GetOwner(inst)`
* **Description:** Helper function that retrieves the entity’s owner by delegating to `inst.components.follower:GetLeader()`. Returns `nil` if no follower component or leader is present.
* **Parameters:** `inst` (`entity`) — The critter instance.
* **Returns:** `entity | nil` — The owner entity or `nil`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Predicate used by `FaceEntity` to determine if the critter should face a given entity. Returns true only if the entity is the critter’s owner.
* **Parameters:** 
  - `inst` (`entity`) — The critter instance.
  - `target` (`entity`) — The entity to evaluate.
* **Returns:** `boolean` — True if `GetOwner(inst) == target`.

### `OwnerIsClose(inst)`
* **Description:** Checks whether the owner is within `MAX_FOLLOW_DIST` (4.5) units.
* **Parameters:** `inst` (`entity`) — The critter instance.
* **Returns:** `boolean` — True if owner exists and is within range.

### `LoveOwner(inst)`
* **Description:** Constructs a nuzzle action toward the owner if conditions (not busy, owner is valid and not a ghost, cooldown passed, and luck check succeeds) are met. Returns `nil` if conditions fail.
* **Parameters:** `inst` (`entity`) — The critter instance.
* **Returns:** `action | nil` — A nuzzle `BufferedAction` toward the owner, or `nil`.

### `TargetCanPlay(self, target, owner, max_dist_from_owner, is_flier)`
* **Description:** Determines whether a candidate critter is eligible to be a playmate.
* **Parameters:**
  - `self` (`CritterBrain`) — The brain instance.
  - `target` (`entity`) — The candidate playmate.
  - `owner` (`entity`) — The critter’s owner.
  - `max_dist_from_owner` (`number`) — The maximum distance the playmate may be from the owner.
  - `is_flier` (`boolean`) — Whether the critter is flying (playmates must be on passable ground unless flier).
* **Returns:** `boolean` — True if the target can play (i.e., is playful, in range, on passable terrain, and not asleep).

### `FindPlaymate(self)`
* **Description:** Attempts to find and retain a valid playmate for the critter. Respects the `playful` dominant trait, which extends the search and keep distances. Checks whether the current playmate remains valid first; if not, searches for a new one within range using `FindEntity`.
* **Parameters:** `self` (`CritterBrain`) — The brain instance.
* **Returns:** `boolean` — True if a valid playmate is found or retained.

### `_avoidtargetfn(self, target)`
* **Description:** Core logic for combat avoidance. Evaluates whether the given entity is currently involved in combat with the owner or other nearby entities, within defined distance thresholds (`COMBAT_TOO_CLOSE_DIST`, `COMBAT_SAFE_TO_WATCH_FROM_MAX_DIST`), and not expired (`COMBAT_TIMEOUT`).
* **Parameters:** 
  - `self` (`CritterBrain`) — The brain instance.
  - `target` (`entity | nil`) — The entity to check.
* **Returns:** `boolean` — True if the critter should avoid the target.

### `CombatAvoidanceFindEntityCheck(self)`
* **Description:** Returns a predicate function suitable for `FindEntity`. Pushes `"critter_avoidcombat"` event and stores the `runawayfrom` target if the entity triggers avoidance.
* **Parameters:** `self` (`CritterBrain`) — The brain instance.
* **Returns:** `function(entity): boolean` — A function to be passed to `FindEntity`.

### `ValidateCombatAvoidance(self)`
* **Description:** Verifies that the current `runawayfrom` target remains valid and within range for combat avoidance. Clears it and fires `"critter_avoidcombat"` with `{avoid=false}` if no longer applicable.
* **Parameters:** `self` (`CritterBrain`) — The brain instance.
* **Returns:** `boolean` — True if combat avoidance is still required.

### `WatchingMinigame(inst)`
* **Description:** Retrieves the minigame the critter’s owner is participating in, if any.
* **Parameters:** `inst` (`entity`) — The critter instance.
* **Returns:** `minigame | nil` — The active `Minigame` component instance, or `nil`.

### `WatchingMinigame_MinDist(inst)`, `WatchingMinigame_TargetDist(inst)`, `WatchingMinigame_MaxDist(inst)`
* **Description:** Delegating helper functions that return the `watchdist_min`, `watchdist_target`, and `watchdist_max` values (respectively) from the owner’s minigame, if available. Otherwise return `0`.
* **Parameters:** `inst` (`entity`) — The critter instance.
* **Returns:** `number` — The distance threshold from `TUNING`.

## Events & Listeners
- **Listens to:** None. This component does not register event listeners in its constructor or `OnStart`.
- **Pushes:**
  - `"critter_avoidcombat"` — Fired with `{avoid=true}` when entering combat avoidance and `{avoid=false}` when exiting it (via `CombatAvoidanceFindEntityCheck` and `ValidateCombatAvoidance`).
  - `"start_playwithplaymate"` — Fired with `{target=self.playfultarget}` when beginning play interaction (via `PlayWithPlaymate`).

None of the events are handled by this component itself; they are consumed by external systems or the stategraph.