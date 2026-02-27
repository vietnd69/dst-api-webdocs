---
id: beefalobrain
title: Beefalobrain
description: Manages the AI decision-making and behavior tree for beefalo entities, governing states like greeting, loitering, wandering, following, and hitching based on proximity to players and environment.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 32285bac
---

# Beefalobrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`Beefalobrain` is the AI component responsible for controlling the behavior of beefalo entities in Don't Starve Together. It implements a Behavior Tree (BT) that orchestrates high-priority combat and panic responses, followed by social and foraging behaviors such as following owners (via `follower` and `domesticatable`), greeting players (especially those holding Beefalo bells), loitering in anticipation of food, and wandering based on time of day and herd location.

Key interactions include:
- Using `domesticatable` to check domestication status for greeting triggers
- Using `follower` and `knownlocations` to follow leaders and remember herd/saltlick positions
- Using `hitchable` to handle hitching/unhitching from posts
- Using `rideable`, `combat`, `writeable`, and `inventory` components to condition behavior (e.g., wait for heavy lifters)

## Dependencies & Tags
- **Components used:**
  - `combat`: to check `self.inst.components.combat.target`
  - `domesticatable`: for `IsDomesticated()`, `GetDomestication()`
  - `follower`: for `GetLeader()`
  - `hitchable`: for `Unhitch()`
  - `inventory`: for `IsHeavyLifting()`
  - `inventoryitem`: for `GetGrandOwner()`
  - `knownlocations`: for `GetLocation()`, `RememberLocation()`
  - `rideable`: for `canride`
  - `writeable`: for `IsBeingWritten()`
- **Tags:**
  - `"hitched"` (checked with `HasTag("hitched")`)
  - `"notarget"` (checked with `HasTag("notarget")`)
  - `"playerghost"` (checked with `HasTag("playerghost")`)
  - `"bell"` (checked with `HasTag("bell")`)
  - `"pocketdimension_container"` (checked with `HasTag("pocketdimension_container")`)

## Properties
No public properties are declared directly in the `BeefaloBrain` constructor. All logic is encapsulated within the Behavior Tree and helper functions using `self.inst` and local state.

## Main Functions
The following functions are used internally by the Behavior Tree to implement decision logic and actions. They are not called directly by external code.

### `GetFaceTargetFn(inst)`
* **Description:** Returns a valid face target for the beefalo only if it is not domesticated, not seeking salt, and a player is within `START_FACE_DIST`. Excludes `notarget` and `playerghost` targets.
* **Parameters:**
  - `inst`: The beefalo entity instance.
* **Returns:** The closest player target if conditions are met, otherwise `nil`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Determines whether the beefalo should continue facing a given target. Ensures both instances are valid, not ghosts, within `KEEP_FACE_DIST`, and not seeking salt.
* **Parameters:**
  - `inst`: The beefalo entity instance.
  - `target`: The entity the beefalo is facing.
* **Returns:** `true` if conditions hold, otherwise `false`.

### `GetWanderDistFn(inst)`
* **Description:** Returns the wandering radius based on time of day: `WANDER_DIST_DAY` during day, `WANDER_DIST_NIGHT` at night.
* **Parameters:**
  - `inst`: The beefalo entity instance.
* **Returns:** `number` — The wandering radius.

### `GetLoiterTarget(inst)`
* **Description:** Returns the closest player within `LOITER_SEARCH_RADIUS` (on land).
* **Parameters:**
  - `inst`: The beefalo entity instance.
* **Returns:** The closest player or `nil`.

### `GetGreetTarget(inst)`
* **Description:** Prioritizes the beefalo's own bell (`inst._beef_bell`) if within `GREET_SEARCH_RADIUS`. Otherwise, returns the closest player on land within the same radius.
* **Parameters:**
  - `inst`: The beefalo entity instance.
* **Returns:** The target entity (bell or player) or `nil`.

### `GetGreetTargetPosition(inst)`
* **Description:** Returns the position of the greet target; defaults to the beefalo’s own position if no greet target exists.
* **Parameters:**
  - `inst`: The beefalo entity instance.
* **Returns:** `Vector` — The 3D position of the greet target or `inst:GetPosition()`.

### `GetLoiterAnchor(inst)`
* **Description:** Manages and returns a loiter anchor point, updating it based on herd location or distance. Ensures anchor is remembered via `knownlocations`.
* **Parameters:**
  - `inst`: The beefalo entity instance.
* **Returns:** `Vector` — The loiter anchor position.

### `TryBeginLoiterState(inst)`
* **Description:** Prevents entering loiter if the beefalo is in a mood (`GetIsInMood()`). Otherwise, resets loiter timer if currently greeting.
* **Parameters:**
  - `inst`: The beefalo entity instance.
* **Returns:** `boolean` — `true` if loiter should begin (or is resuming), `false` otherwise.

### `TryBeginGreetingState(inst)`
* **Description:** Begins greeting state if the beefalo is domesticated (domestication > `0.0`) and a greet target (player/bell) exists. Records `inst._startgreettime`.
* **Parameters:**
  - `inst`: The beefalo entity instance.
* **Returns:** `boolean` — `true` if greeting should begin, otherwise `false`.

### `ShouldWaitForHeavyLifter(inst, target)`
* **Description:** Checks if the target is a heavy lifter (via `inventory:IsHeavyLifting()`) and moving *toward* the beefalo (via dot product of facing and relative direction). Returns `true` if the beefalo should wait.
* **Parameters:**
  - `inst`: The beefalo entity instance.
  - `target`: The potential heavy-lifting entity (resolves grand owner via `inventoryitem:GetGrandOwner()`).
* **Returns:** `boolean` — `true` if waiting is required.

### `GetWaitForHeavyLifter(inst)`
* **Description:** Returns the greet target if `ShouldWaitForHeavyLifter()` returns `true` for it.
* **Parameters:**
  - `inst`: The beefalo entity instance.
* **Returns:** `Entity` or `nil`.

### `gotta hitchspot(inst)`
* **Description:** Performs the action to hitch to `inst.hitchingspot` using `BufferedAction`. Unhitches first if currently hitched.
* **Parameters:**
  - `inst`: The beefalo entity instance.
* **Returns:** `Action` — The hitching action.

### `InState(inst, state)`
* **Description:** Determines which state the beefalo is currently in (`GREETING`, `LOITERING`, or `WANDERING`) based on time elapsed since `inst._startgreettime`.
* **Parameters:**
  - `inst`: The beefalo entity instance.
  - `state`: One of `"greeting"`, `"loitering"`, `"wandering"`.
* **Returns:** `boolean` — `true` if the current time falls within the state’s window.

### `GetLeader(inst)`
* **Description:** Returns the leader via `follower:GetLeader()` if available.
* **Parameters:**
  - `inst`: The beefalo entity instance.
* **Returns:** `Entity` or `nil`.

## Events & Listeners
The `BeefaloBrain` component itself does not register or push events directly. Event callbacks are handled at the `inst` level via the Behavior Tree and helper functions (e.g., `onnewcombattarget` is removed via `inst:RemoveEventCallback("newcombattarget",onnewtarget)` in `hitchable:Unhitch()`), but this is external to the brain script.

The Behavior Tree nodes (`ChaseAndAttack`, `Follow`, `Wander`, etc.) may internally manage event callbacks (e.g., on target loss or movement completion), but those are defined in `behaviours/` and `brains/braincommon.lua`, not here.