---
id: smallghostbrain
title: Smallghostbrain
description: AI brain controlling small ghost behavior, including following leader, locating lost toys, hinting with jump-in actions, and avoiding combat.
tags: [ai, ghost, behavior_tree]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 241b1cae4
---

# Smallghostbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

`smallghostbrain` defines the behavior tree for small ghost entities in Don't Starve Together. It orchestrates core ghost behaviors: following a leader, searching for lost toys (especially those dropped near the leader), providing hints via jump-in actions to guide the leader toward nearby toys, and retreating when combat becomes too dangerous. It uses custom action functions and a hierarchical behavior tree built with `PriorityNode`, `WhileNode`, `SequenceNode`, and decorator nodes.

This brain is tightly coupled with the `follower`, `health`, `grouptargeter`, `knownlocations`, `talker`, and `combat` components. It makes decisions based on relative positions, time-based cooldowns, and state flags stored in the stategraph's memory (`inst.sg.mem`).

## Usage example

The brain is instantiated as a component and attached to a small ghost entity via the brain system. It is not intended to be manually added or modified in mod code. A typical instantiation pattern (handled internally) looks like:

```lua
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("smallghostbrain")
```

No direct method calls are required; the brain activates automatically on stategraph start via `OnStart()`.

## Dependencies & tags

**Components used:**  
- `follower` (via `GetLeader()`)  
- `health` (to check if targets are dead)  
- `grouptargeter` (to verify targeting relationship)  
- `knownlocations` (to retrieve home location)  
- `talker` (to trigger speech events)  
- `combat` (implicitly via combat avoidance logic)

**Tags:**  
- None added or removed by this script.  
- Uses tags for filtering in combat avoidance: `"_combat"` and `"_health"` (allowed), `"wall"` and `"INLIMBO"` (excluded).

## Properties

No public properties are initialized or exposed by the constructor itself. Internal state is managed via instance variables on `self` and `inst`, including:
- `inst._toys`: Likely populated externally (e.g., by a parent `toy_owner` component) for use in `get_closest_toy()`.
- `inst.sg.mem.is_hinting`: Boolean flag set during hinting.
- `inst._has_done_speech`: Boolean flag preventing repeated speech on toy search triggers.
- `inst._next_leader_toy_search_speech_time`: Timestamp for speech cooldown.

## Main functions

The core logic resides in helper functions called from behavior tree nodes. The brain itself is implemented as a class with a single entrypoint, `OnStart`, which constructs the behavior tree.

### `SmallGhostBrain:OnStart()`
* **Description:** Initializes the behavior tree on stategraph start. Constructs a priority-ordered root node tree implementing ghost gameplay loops: toy retrieval, combat avoidance, hinting, searching, and idle wandering.
* **Parameters:** None (instance method).
* **Returns:** Nothing. Assigns `self.bt` to a new `BT` instance with the constructed root tree.
* **Error states:** None documented.

### `get_closest_toy(toy_owner, dist_inst, dsq_gate)`
* **Description:** Finds the closest toy owned by `toy_owner` to `dist_inst`, optionally bounded by a squared distance threshold (`dsq_gate`). Used by hint, pickup, and search logic.
* **Parameters:**
  - `toy_owner`: Entity that owns a `_toys` table of toy entities.
  - `dist_inst`: Reference entity for distance measurement.
  - `dsq_gate`: Optional squared distance threshold (number). If provided, only toys within this distance are considered.
* **Returns:** `toy` entity (Inst), or `nil` if no eligible toys exist or `toy_owner._toys` is empty/nil.
* **Error states:** Returns `nil` if `toy_owner._toys` is nil or empty, or if `dist_inst` is nil.

### `pickup_lost_toy(inst)`
* **Description:** Attempts to pick up the closest lost toy within `TUNING.GHOST_HUNT.PICKUP_DSQ`. Invoked by a `DoAction` node during the behavior tree root priority check.
* **Parameters:**
  - `inst`: The ghost entity instance.
* **Returns:** A `BufferedAction` toward the toy and `ACTIONS.PICKUP`, or `nil` if the ghost is busy or no toy is nearby.
* **Error states:** Returns `nil` if the ghost’s stategraph has the `"busy"` tag.

### `get_hint_location(inst)`
* **Description:** Computes a jump-in hint position near the leader and the closest toy, if the leader is at an appropriate distance to benefit from a hint. Marks `inst.sg.mem.is_hinting = true` when hinting starts.
* **Parameters:**
  - `inst`: The ghost entity instance.
* **Returns:** A `BufferedAction` with `ACTIONS.JUMPIN` to a position offset from the closest toy toward the leader (with randomness), or `nil` if no leader, no toy, or leader-toy distance is too close/far.
* **Error states:** Returns `nil` if leader or closest toy is missing, or if the leader-toy distance lies outside `[MIN_HINT_DSQ, MAX_HINT_DSQ]`.

### `test_for_finished_hinting(inst)`
* **Description:** Evaluates whether hinting should end (e.g., due to reaching the leader, toy being lost, or leader moving too far). Clears `inst.sg.mem.is_hinting` when appropriate.
* **Parameters:**
  - `inst`: The ghost entity instance.
* **Returns:** Nothing (side-effect only).
* **Error states:** None; always safely exits if `inst.sg.mem.is_hinting` is false or missing.

### `test_for_toy_in_search_range(inst)`
* **Description:** Checks if any toy is within the minimum hint distance of the leader, indicating the ghost should enter search mode.
* **Parameters:**
  - `inst`: The ghost entity instance.
* **Returns:** `true` if a toy is within `MIN_HINT_DSQ` of the leader; otherwise `false`.
* **Error states:** Returns `false` if leader or toys are missing.

### `try_toy_search_speech(inst)`
* **Description:** Triggers a randomized speech line and hints the leader when a toy search begins, respecting a per-search cooldown.
* **Parameters:**
  - `inst`: The ghost entity instance.
* **Returns:** Nothing (side-effect only via `talker:Say` and scheduled delayed action).
* **Error states:** Skips if `inst._has_done_speech` is `true`, or if `leader.components.talker` is absent.

### `_avoidtargetfn(self, target)`
* **Description:** Core predicate used to determine if `self.inst` should avoid a given combat participant (`target`). Considers leader proximity, combat activity timeouts, and targeting relationships.
* **Parameters:**
  - `self`: The brain instance (required for closure access to `self.inst`).
  - `target`: Potential enemy entity to avoid.
* **Returns:** `true` if `self.inst` should run away from `target`; `false` otherwise.
* **Error states:** Returns `false` if `target` is invalid, lacks `combat`/`health`, or is too far to pose a threat.

### `validate_combat_avoidance(self)`
* **Description:** Validates that the currently tracked `runawayfrom` entity remains a valid combat avoidance target. Resets `self.runawayfrom` to `nil` if conditions are no longer met.
* **Parameters:**
  - `self`: The brain instance.
* **Returns:** `true` if `runawayfrom` remains valid and should continue avoidance; `false` otherwise.
* **Error states:** Resets `self.runawayfrom` to `nil` on exit if validation fails.

### `toy_nearby_wander_home(inst)`
* **Description:** Helper for `Wander` behavior when a toy is nearby — returns the leader’s position as wander destination (if available).
* **Parameters:**
  - `inst`: The ghost entity instance.
* **Returns:** `leader:GetPosition()` or `nil` if leader is missing.

### `toy_nearby_wander_angle(inst)`
* **Description:** Helper for `Wander` behavior — returns a randomized angle around the line from the closest toy to the leader.
* **Parameters:**
  - `inst`: The ghost entity instance.
* **Returns:** Random angle (number) or `TWOPI * math.random()` for fully random direction if no toy/leader.

### `KeepFacingTarget(inst, target)`
* **Description:** Condition for the `FaceEntity` behavior during combat avoidance — ensures the ghost faces its leader only if the target matches.
* **Parameters:**
  - `inst`: The ghost entity instance.
  - `target`: The entity being faced.
* **Returns:** `true` if `GetLeader(inst) == target`; `false` otherwise.

## Events & listeners

This script does not register or fire any events directly via `inst:ListenForEvent` or `inst:PushEvent`. All state transitions and responses are managed through the behavior tree execution and stategraph memory (`inst.sg.mem`).