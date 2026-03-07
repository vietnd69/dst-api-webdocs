---
id: molebatbrain
title: Molebatbrain
description: Controls the AI behavior of the Molebat, managing movement, nest building, sleeping, and combat logic through a behavior tree.
tags: [ai, combat, nest]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 7c611842
system_scope: brain
---

# Molebatbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MolebatBrain` implements the decision-making system for the Molebat entity in DST. It uses a behavior tree (`BT`) composed of priority-ordered nodes to handle core behaviors: fleeing from threats, attacking when possible, cleaning up its burrow nest, building a new burrow if missing, sleeping at home, returning to its burrow location, foraging for food, and face-locking onto nearby players. It integrates with the `combat`, `entitytracker`, `knownlocations`, and `eater` components to make context-aware decisions.

## Usage example
This brain is automatically attached by the game to Molebat prefabs. Modders should not manually instantiate it. To modify its behavior, override or subclass `MolebatBrain` and assign it to the prefab's `brain` property during prefabs initialization.

```lua
-- Example mod integration pattern (not part of core codebase)
local MolebatBrain = require("brains/molebatbrain")
local CustomMolebatBrain = Class(MolebatBrain, function(self, inst)
    MolebatBrain._ctor(self, inst)
end)

-- Override or extend behavior as needed
function CustomMolebatBrain:OnStart()
    -- Custom logic here
    MolebatBrain.OnStart(self)
end

-- Assign to prefab
prefab.brain = CustomMolebatBrain
```

## Dependencies & tags
**Components used:** `combat`, `eater`, `entitytracker`, `knownlocations`  
**Tags:** Checks and uses `"molebathill"` (via `FindEntity`), `"FX"`, `"NOCLICK"`, `"DECOR"`, `"INLIMBO"`, `"notarget"`, `"outofreach"` as filters.

## Properties
No public properties are initialized in the constructor. The brain relies on properties attached to `self.inst` such as `_nest_needs_cleaning`, `_quaking`, and functions like `WantsToNap`.

## Main functions
### `OnStart()`
*   **Description:** Initializes and assigns the behavior tree root node to `self.bt`. The behavior tree evaluates priority-ordered nodes every tick to select the next action based on current state conditions.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None expected; relies on correctly initialized `self.inst` and its components.

### `CleanUpNest(inst)`
*   **Description:** Helper function used by the "Nest Needs Cleaning Up" node. Attempts to generate a `BREAK` action against the tracked burrow entity.
*   **Parameters:** `inst` (entity) — the Molebat instance.
*   **Returns:** `BufferedAction` if a burrow exists and cleaning is needed; otherwise `nil`. May return `nil` silently if the burrow was removed externally.
*   **Error states:** Returns `nil` immediately if `inst.components.entitytracker:GetEntity("burrow")` yields `nil`.

### `ShouldBuildHome(inst)`
*   **Description:** Determines whether the Molebat should attempt to construct a new burrow.
*   **Parameters:** `inst` (entity) — the Molebat instance.
*   **Returns:** `true` if a burrow does not exist, the Molebat is not busy, and it does not want to nap; otherwise `false`.
*   **Error states:** Tracks found burrows via `entitytracker:TrackEntity("burrow", nearby_home)` before returning `false`.

### `CreateBurrow(inst)`
*   **Description:** Generates a `MAKEMOLEHILL` action at a valid nearby position.
*   **Parameters:** `inst` (entity) — the Molebat instance.
*   **Returns:** `BufferedAction` with target position offset by a walkable random location; or `nil` if no offset was found (note: current code *always* returns a `BufferedAction` even if `offset == nil`, but `nil` is passed to `BufferedAction`).
*   **Error states:** `offset` may be `nil`, which results in the action being created at the original position (likely invalid).

### `ShouldGoSleepAtHome(inst)`
*   **Description:** Checks if the Molebat should move to and sleep at its burrow.
*   **Parameters:** `inst` (entity) — the Molebat instance.
*   **Returns:** `true` if not busy, `WantsToNap()` returns `true`, and a burrow exists; otherwise `false`.

### `GoSleepAtHomeAction(inst)`
*   **Description:** Returns a `TRAVEL` action toward the burrow.
*   **Parameters:** `inst` (entity) — the Molebat instance.
*   **Returns:** `BufferedAction` with `ACTIONS.TRAVEL` targeting the burrow position, or `nil`.

### `ShouldGoHome(inst)`
*   **Description:** Determines if the Molebat is too far from its recorded home location to remain there.
*   **Parameters:** `inst` (entity) — the Molebat instance.
*   **Returns:** `true` if home location exists and squared distance to home exceeds `GO_HOME_DSQ` (`900`, i.e., 30 units); otherwise `false`.

### `GoHomeAction(inst)`
*   **Description:** Generates a `WALKTO` action toward the home location, but only if no active combat target is present.
*   **Parameters:** `inst` (entity) — the Molebat instance.
*   **Returns:** `BufferedAction` or `nil` (if there is a combat target or no home location).

### `EatFoodAction(inst)`
*   **Description:** Locates and selects a nearby edible item for consumption, provided it is not too far from home and has existed for at least 8 seconds.
*   **Parameters:** `inst` (entity) — the Molebat instance.
*   **Returns:** `BufferedAction` with `ACTIONS.EAT` targeting the found food, or `nil` if nothing suitable is found or the Molebat is busy.
*   **Error states:** `FindEntity` may return `nil` if no item matches criteria (`CanEat`, age, passability, distance, tags, and edible tags).

### `GetFaceTargetFn(inst)`
*   **Description:** Returns the nearest nearby player for the Molebat to face, within `START_FACE_DIST` (`6` units), excluding players tagged `"notarget"`.
*   **Parameters:** `inst` (entity) — the Molebat instance.
*   **Returns:** `player` entity or `nil`.

### `KeepFaceTargetFn(inst, target)`
*   **Description:** Returns `true` if the target is still within `KEEP_FACE_DIST` (`8` units) and not tagged `"notarget"`.
*   **Parameters:** `inst` (entity), `target` (entity).
*   **Returns:** `true` or `false`.

### `GetRunAwayTarget(inst)`
*   **Description:** Returns the current combat target as the source to flee from.
*   **Parameters:** `inst` (entity) — the Molebat instance.
*   **Returns:** `inst.components.combat.target` (entity or `nil`).

## Events & listeners
- **Listens to:** `summon` — pushed when the "Summon Allies" condition is met; no listener is defined here (handled elsewhere).
- **Pushes:** `summon` — fired by the "Summon Allies" action node when triggered.
