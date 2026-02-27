---
id: catcoonbrain
title: Catcoonbrain
description: Controls the behavior tree and decision-making logic for the Catcoon entity, including following, playing with toys, returning home, and reacting to environmental threats.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 244fc721
---

# Catcoonbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `CatcoonBrain` component implements the AI decision-making system for the Catcoon entity using a Behavior Tree (`BT`). It prioritizes actions based on game state, inventory status, environmental conditions (e.g., rain), and the presence of a leader. Key responsibilities include following a leader, playing with toys or food, returning home (especially during rain or when the inventory is full), initiating hairball attacks on friends, avoiding players, fleeing from threats, and wandering when idle. The brain integrates closely with components like `follower`, `homeseeker`, `inventory`, and `burnable`, and defines custom action handlers (e.g., `PlayAction`, `HairballAction`) that use `BufferedAction` to queue interaction-based behaviors.

## Dependencies & Tags
- **Components used:**
  - `burnable`: Checks `IsBurning()` on home or target.
  - `follower`: Retrieves leader via `GetLeader()` and loyalty percentage via `GetLoyaltyPercent()`.
  - `homeseeker`: Retrieves home position via `GetHomePos()` and checks validity (`home:IsValid()`).
  - `inventory`: Checks fullness via `IsFull()`.
- **Tags:**
  - `NO_TAGS`: Excludes targets with tags `FX`, `NOCLICK`, `DECOR`, `INLIMBO`, `stump`, `burnt`, `notarget`, `flight`, `fire`, `irreplaceable`.
  - `PLAY_TAGS`: Includes targets with tags `cattoy`, `cattoyairborne`, `catfood`.
  - Internally, `cattoy`, `cattoyairborne`, and `catfood` tags are temporarily removed during play interactions and restored after 30 seconds.

## Properties
No public properties are initialized directly in the constructor. Instance properties are set dynamically at runtime or via game tuning. The following properties are referenced during behavior execution:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.raining` | `boolean` | `nil` (initially unset) | Controls whether the Catcoon attempts to return home. |
| `inst.hairball_friend_interval` | `number` | `nil` (set dynamically) | Cooldown interval for hairball actions when a leader is present. |
| `inst.hairball_neutral_interval` | `number` | `nil` (set dynamically) | Cooldown interval for hairball actions when no leader is present. |
| `inst.last_play_air_time` | `number` | `nil` | Timestamp of the last airborne toy interaction. |
| `inst.last_hairball_time` | `number` | `nil` | Timestamp of the last hairball action. |

## Main Functions
All key functions are referenced internally by the Behavior Tree via action handlers or node conditions.

### `CatcoonBrain:OnStart()`
* **Description:** Initializes the Behavior Tree (`BT`) for the Catcoon. Constructs a `PriorityNode` root tree with ordered action checks, enabling the Catcoon to evaluate and execute high-priority behaviors (e.g., panic, hairball, chasing) before lower-priority ones (e.g., wandering). Sets `self.bt` to the constructed tree.
* **Parameters:** None.
* **Returns:** None.

### `PlayAction(inst)`
* **Description:** Finds a valid play target (toy, airborne toy, or food) within range, checks airborne toy timing constraints, and returns a `BufferedAction` to initiate `CATPLAYAIR` or `CATPLAYGROUND`. Temporarily removes the play tag and schedules its restoration after 30 seconds. Returns `nil` if no valid target exists or if the Catcoon is busy.
* **Parameters:**
  - `inst` (`Entity`): The Catcoon entity instance.
* **Returns:** `BufferedAction` or `nil`.

### `HasValidHome(inst)`
* **Description:** Checks if the Catcoon has a valid, non-burning home. Returns `true` only if the home exists, is valid, is not marked `burnt`, and is not currently burning.
* **Parameters:**
  - `inst` (`Entity`): The Catcoon entity instance.
* **Returns:** `boolean`.

### `GetLeader(inst)`
* **Description:** Retrieves the Catcoon's current leader from the `follower` component. Helper wrapper for `follower:GetLeader()`.
* **Parameters:**
  - `inst` (`Entity`): The Catcoon entity instance.
* **Returns:** `Entity?` — The leader entity, or `nil` if no leader exists.

### `GetNoLeaderHomePos(inst)`
* **Description:** Returns the home position only if the Catcoon has no leader *and* a valid home exists. Otherwise, returns `nil`.
* **Parameters:**
  - `inst` (`Entity`): The Catcoon entity instance.
* **Returns:** `Vector3?` — The home position, or `nil`.

### `GoHomeAction(inst)`
* **Description:** Returns a `BufferedAction` to `GOHOME` if a valid, non-burning home exists. Otherwise, schedules a "raining" event to prompt future home-return behavior.
* **Parameters:**
  - `inst` (`Entity`): The Catcoon entity instance.
* **Returns:** `BufferedAction?` — Action to go home, or `nil`.

### `ShouldHairball(inst)`
* **Description:** Determines whether the Catcoon is ready to perform a hairball action based on elapsed time and leader presence. Resets the hairball interval dynamically using `TUNING` values.
* **Parameters:**
  - `inst` (`Entity`): The Catcoon entity instance.
* **Returns:** `boolean`.

### `HairballAction(inst)`
* **Description:** Returns a `BufferedAction` to perform `HAIRBALL` on the leader if present, or on `nil` (self-targeted) if no leader exists.
* **Parameters:**
  - `inst` (`Entity`): The Catcoon entity instance.
* **Returns:** `BufferedAction?`.

### `WhineAction(inst)`
* **Description:** Returns a `BufferedAction` to `CATPLAYGROUND` on the leader *only* if the Catcoon has a leader and loyalty is critically low (`< 3%`).
* **Parameters:**
  - `inst` (`Entity`): The Catcoon entity instance.
* **Returns:** `BufferedAction?`.

### `GetFaceTargetFn(inst)`
* **Description:** Returns the leader entity as the target for `FaceEntity` behavior.
* **Parameters:**
  - `inst` (`Entity`): The Catcoon entity instance.
* **Returns:** `Entity?`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Verifies if the current target for facing matches the leader.
* **Parameters:**
  - `inst` (`Entity`): The Catcoon entity instance.
  - `target` (`Entity?`): The candidate target entity.
* **Returns:** `boolean`.

## Events & Listeners
This component does not directly register or push events. Event-driven logic is implemented internally via the `BehaviorTree` node structure (e.g., `IfNode`, `WhileNode`) and custom action handlers (e.g., `DoAction`). Event scheduling (e.g., tag restoration) uses `DoTaskInTime`.