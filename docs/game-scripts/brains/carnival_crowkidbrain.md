---
id: carnival_crowkidbrain
title: Carnival Crowkidbrain
description: Controls the behavior tree and AI logic for the Carnival Crowkid entity, handling interactions with minigames, campfires, carnival decorations, home seeking, and ambient chatter.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 902b1780
---

# Carnival Crowkidbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `carnival_crowkidbrain` component implements the behavior tree for the Carnival Crowkid entity, orchestrating its AI decisions in response to game state, nearby entities, and environmental conditions. It dynamically selects behaviors such as watching minigames, stoking campfires, activating carnival decorations, chatting with players, wandering near its home, or fleeing danger via flight behavior. This component relies heavily on the `behaviour` system and integrates with several components (`homeseeker`, `minigame_spectator`, `minigame`, `burnable`, `fueled`, `carnivaldecorranker`) to coordinate decision-making.

## Dependencies & Tags

- **Components used:**
  - `homeseeker` — for home position tracking and homelessness detection.
  - `minigame_spectator` — to access the current minigame and determine intro/outro states.
  - `minigame` — accessed via `minigame_spectator`, used to read minigame type, state, and distance parameters.
  - `burnable` — to check if a campfire or home is burning (prevents engagement with burning targets).
  - `fueled` — used to determine if a campfire needs fuel via `GetPercent()`.
  - `carnivaldecorranker` — to determine decor rank and select appropriate chatter strings.

- **Tags:**
  - Checks tags: `notarget`, `INLIMBO`, `hostile`, `inactive`, `carnivaldecor`, `campfire`, `fire`, `burnt`.
  - Does not add or remove tags itself (only reads them for decision logic).

## Properties

No public instance properties are explicitly initialized in the constructor. All persistent state is stored as keys on `inst`, such as `inst.next_activate_time`, `inst._watch_campfire`, and `inst.ShouldFlyAway`.

## Main Functions

### `HasValidHome(inst)`
* **Description:** Determines if the entity has a valid, non-burning home that is still registered and not burnt.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `true` if the home exists, is valid, not burnt, and not currently burning; otherwise `false`.

### `GetHomePos(inst)`
* **Description:** Returns the 3D world position of the entity’s home if it exists and is valid.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `{x, y, z}` position table or `nil` if home is invalid.

### `GetFaceTargetFn(inst)`
* **Description:** Finds the nearest player within a 3-tile radius who is not on cooldown for chatter; if found, triggers a talk cooldown and returns the player as a face target.
* **Parameters:** `inst` — the entity instance.
* **Returns:** Player entity if conditions met, otherwise `nil`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Verifies the current face target is still valid (same player, within 3-tile radius).
* **Parameters:** `inst`, `target` — the previously selected player entity.
* **Returns:** `true` if target is still valid; `false` otherwise.

### `IsHomeless(inst)`
* **Description:** Determines if the entity lacks a `homeseeker` component or has no home set.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `true` if no `homeseeker` component or no home assigned; `false` otherwise.

### `ShouldFlyAway(inst)`
* **Description:** Evaluates whether the entity should flee (e.g., during lunar hailing, if in danger, or not currently occupied by state tags like `sleeping`, `busy`, `flight`).
* **Parameters:** `inst` — the entity instance.
* **Returns:** `true` if conditions for flight are met (e.g., nearby hostile entities or special world states), `false` otherwise.

### `FlyHome(inst)`
* **Description:** If `ShouldFlyAway` is `true`, triggers a `GOHOME` action toward the entity’s home.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `BufferedAction` result or `nil`.

### `ActivateDecor(inst)`
* **Description:** Attempts to activate or stoke a nearby carnival decoration or campfire (if fuel is low). Has chain-delay logic to prevent spam activation.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `BufferedAction` result (e.g., `ADDFUEL` or `ACTIVATE`) or `nil`.

### `WatchCampfireFn(inst)`
* **Description:** Locates a nearby campfire at night and stores it as `_watch_campfire`. Verifies if the stored campfire is still valid and burning.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `true` if a valid, burning campfire is found and watched; `false` otherwise.

### `GetCurrentCampfirePos(inst)`
* **Description:** Returns the world position of the currently watched campfire if valid.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `{x, y, z}` position table or `nil`.

### `WatchingMinigame(inst)`
* **Description:** Returns the current minigame this entity is spectating via its `minigame_spectator` component.
* **Parameters:** `inst` — the entity instance.
* **Returns:** Minigame entity or `nil`.

### `IsWatchingMinigameIntro(inst)`
* **Description:** Checks if the current minigame is in its intro phase.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `true` if minigame intro is active; `false` otherwise.

### `WatchingMinigame_MinDist(inst)`
* **Description:** Returns the `watchdist_min` parameter of the current minigame.
* **Parameters:** `inst` — the entity instance.
* **Returns:** Numeric distance threshold (from `minigame.watchdist_min`).

### `WatchingMinigame_TargetDist(inst)`
* **Description:** Returns the `watchdist_target` parameter of the current minigame.
* **Parameters:** `inst` — the entity instance.
* **Returns:** Numeric distance threshold (from `minigame.watchdist_target`).

### `WatchingMinigame_MaxDist(inst)`
* **Description:** Returns the `watchdist_max` parameter of the current minigame.
* **Parameters:** `inst` — the entity instance.
* **Returns:** Numeric distance threshold (from `minigame.watchdist_max`).

### `IsWatchingMinigameOutro(inst)`
* **Description:** Checks if the current minigame is in its outro phase.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `true` if minigame outro is active; `false` otherwise.

### `DoTossReward(inst)`
* **Description:** Spawns a `carnival_prizeticket` and launches it toward the minigame location.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `nil` (side-effect only).

### `GetMinigameParticipantsLuckChance(inst)`
* **Description:** Calculates reward chance for the crowkid based on participant luck and scores.
* **Parameters:** `inst` — the entity instance.
* **Returns:** Numeric probability (increased by luck factor).

### `OnEndOfGame(inst)`
* **Description:** Handles post-minigame logic: evaluates success, sets `_good_ending`, pushes `minigame_spectator_start_outro`, and optionally schedules a reward toss if score or luck thresholds are met.
* **Parameters:** `inst` — the entity instance.
* **Returns:** `nil` (side-effect only).

## Events & Listeners

- **Pushes:**
  - `"minigame_spectator_start_outro"` — pushed by `OnEndOfGame()` when minigame ends.

- **Listens to:** None (no `inst:ListenForEvent` calls are present).

---