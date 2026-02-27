---
id: carnival_hostbrain
title: Carnival Hostbrain
description: Manages the AI behavior of the Carnival Host entity, controlling its reactions to minigames and wander patterns during gameplay.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: dbe4a681
---

# Carnival Hostbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `carnival_hostbrain` component implements the behavior tree for the Carnival Host entity. It defines how the host reacts to minigame events (e.g., cheering, idle movement, prize tossing), manages wandering between locations, and responds to the presence of minigames via spectating. The brain integrates with components such as `minigame_spectator`, `minigame`, `prototyper`, `knownlocations`, and `talker` to determine dialogue, movement, and interaction timing.

## Dependencies & Tags

- **Components used:**
  - `knownlocations` (via `inst.components.knownlocations:GetLocation`)
  - `minigame` (via `minigame_spectator:GetMinigame().components.minigame`)
  - `minigame_spectator` (via `inst.components.minigame_spectator:GetMinigame`)
  - `prototyper` (via `inst.components.prototyper.doers`)
  - `talker` (via `inst.components.talker:Say`)
- **Tags:** None identified.

## Properties

No public properties are initialized directly in the constructor. Behavior is defined via local constants and function references.

| Property        | Type   | Default Value | Description |
|-----------------|--------|---------------|-------------|
| `GIVE_PLAZAKIT_DIST` | number | 15 | Distance threshold used for proximity checks (unused in current brain implementation). |
| `GIVE_PLAZAKIT_GIVE_DIST` | number | 4 | Distance threshold for giving plaza kits (unused in current brain implementation). |
| `MAX_LEASH_DIST` | number | 20 | Maximum leash range for the host (unused in current brain implementation). |
| `INNER_LEASH_DIST` | number | 15 | Inner leash boundary (unused in current brain implementation). |
| `MAX_WANDER_DIST` | number | 15 | Maximum wandering radius from the home location. |

## Main Functions

### `CarnivalHostBrain:OnStart()`

* **Description:** Initializes and assigns the behavior tree for the Carnival Host. Constructs a priority-based tree that prioritizes minigame watching, followed by prototyper facing, plaza announcements, and idle wandering.
* **Parameters:** None.
* **Returns:** None.

### Local Helper Functions

#### `GetFaceTargetFn(inst)`
* **Description:** Returns the first active doer from the `prototyper` component if available; otherwise returns `nil`.
* **Parameters:**
  - `inst` (Entity): The Carnival Host entity instance.
* **Returns:** Entity or `nil`.

#### `KeepFaceTargetFn(inst, target)`
* **Description:** Determines whether the entity should continue facing a given target by checking if the target exists in the `prototyper.doers` map.
* **Parameters:**
  - `inst` (Entity): The Carnival Host entity instance.
  - `target` (Entity): The candidate target entity.
* **Returns:** Boolean (`true` if target exists in `doers`; `false` otherwise).

#### `GetHomePos(inst)`
* **Description:** Retrieves the stored "home" location from `knownlocations` component.
* **Parameters:**
  - `inst` (Entity): The Carnival Host entity instance.
* **Returns:** Vector (positional coordinates) or `nil`.

#### `GetWanderLines(inst)`
* **Description:** Returns a randomly selected generic announcement line for wandering events.
* **Parameters:**
  - `inst` (Entity): The Carnival Host entity instance.
* **Returns:** String (localized line key).

#### `WatchingMinigame(inst)`
* **Description:** Returns the current minigame instance if the host is spectating one.
* **Parameters:**
  - `inst` (Entity): The Carnival Host entity instance.
* **Returns:** `Minigame` component instance or `nil`.

#### `IsWatchingMinigameIntro(inst)`
* **Description:** Checks if the currently watched minigame is in its intro phase.
* **Parameters:**
  - `inst` (Entity): The Carnival Host entity instance.
* **Returns:** Boolean.

#### `WatchingMinigame_MinDist(inst)`
* **Description:** Returns the minigame's minimum spectating distance threshold.
* **Parameters:**
  - `inst` (Entity): The Carnival Host entity instance.
* **Returns:** Number (distance).

#### `WatchingMinigame_TargetDist(inst)`
* **Description:** Returns the minigame's target spectating distance threshold.
* **Parameters:**
  - `inst` (Entity): The Carnival Host entity instance.
* **Returns:** Number (distance).

#### `WatchingMinigame_MaxDist(inst)`
* **Description:** Returns the minigame's maximum spectating distance threshold.
* **Parameters:**
  - `inst` (Entity): The Carnival Host entity instance.
* **Returns:** Number (distance).

#### `IsWatchingMinigameOutro(inst)`
* **Description:** Checks if the currently watched minigame is in its outro phase.
* **Parameters:**
  - `inst` (Entity): The Carnival Host entity instance.
* **Returns:** Boolean.

#### `DoTossReward(inst)`
* **Description:** Spawns a `carnival_prizeticket` prefab and launches it toward the current minigame.
* **Parameters:**
  - `inst` (Entity): The Carnival Host entity instance.
* **Returns:** None.

#### `OnEndOfGame(inst)`
* **Description:** Handles post-game actions: speaks a cheering/bored line based on score, and tosses reward tickets (one per 5 points, with slight random offsets).
* **Parameters:**
  - `inst` (Entity): The Carnival Host entity instance.
* **Returns:** None.

#### `GetWatchingMinigameLines(inst)`
* **Description:** Returns a randomly selected cheering or bored line based on minigame excitement and phase.
* **Parameters:**
  - `inst` (Entity): The Carnival Host entity instance.
* **Returns:** Table of strings (localized line keys) or `nil`.

#### `GetMinigameOutroGameLines(inst)`
* **Description:** Returns cheering or bored lines specifically for minigame outro based on final score.
* **Parameters:**
  - `inst` (Entity): The Carnival Host entity instance.
* **Returns:** Table of strings (localized line keys).

## Events & Listeners

None. This component does not register or push events directly. It uses behavior tree nodes (`WhileNode`, `PriorityNode`, `ChattyNode`, `FaceEntity`, `Follow`, `Wander`, `RunAway`) for reactive decision-making.