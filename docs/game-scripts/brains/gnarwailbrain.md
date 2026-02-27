---
id: gnarwailbrain
title: Gnarwailbrain
description: Brain component for the Gnarwail creature that manages its behavior in relation to boats, leaders, combat, trading, and tossing food.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: d0bbe0fe
---

# Gnarwailbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `GnarwailBrain` component defines the decision-making logic for the Gnarwail NPC, determining its behavior in response to environmental conditions, leader presence, combat targets, and available food items. It coordinates movement, combat, trading, and tossing interactions using a behavior tree (BT) architecture. The brain integrates closely with components such as `combat`, `follower`, `trader`, `eater`, `boatphysics`, and `inventoryitem` to evaluate dynamic game state and select appropriate actions.

## Dependencies & Tags
- **Components used:** `combat`, `follower`, `trader`, `eater`, `boatphysics`, `inventoryitem`
- **Tags:** `INLIMBO`, `outofreach`, `FX`, `fishmeat`, `oceanfish`, `_inventoryitem`, `walkableplatform`, `smallcreature`, `busy`, `jumping`

## Properties
The component does not define custom public properties in its constructor. Behavior configuration is handled via constants and function references passed to behavior nodes.

## Main Functions

### `HasValidWaterTarget(inst)`
* **Description:** Determines whether the Gnarwail has a valid combat target located on invalid ground (i.e., on a boat or directly on water), which is required for initiating or maintaining combat behavior.
* **Parameters:** `inst` (Entity instance) — the Gnarwail entity.
* **Returns:** `true` if `inst.components.combat.target` exists, is not on valid ground, and combat is not in cooldown; otherwise `false`.

### `GetNearbyTossTarget(inst)`
* **Description:** Searches for a nearby item that the Gnarwail can toss, provided it is not on passable terrain and does not possess excluded tags.
* **Parameters:** `inst` (Entity instance).
* **Returns:** A single item entity if found and `inst.ready_to_toss` is true; otherwise `nil`.

### `TryToTossNearestItem(inst)`
* **Description:** Initiates the toss state machine for the nearest valid toss target, optionally specifying the leader as the toss destination unless the item is oceanfish.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `nil`. Invokes `inst.sg:GoToState("toss_pre", toss_data)` if a target is found.

### `GetLeaderFollowPosition(inst)`
* **Description:** Computes the target position for the Gnarwail to follow its leader, adjusting for whether the leader is on a platform, moving boat physics, or on open water.
* **Parameters:** `inst` (Entity instance).
* **Returns:** A `Vector3` position or `nil` if no leader exists.

### `GetLeaderFollowDistance(inst)`
* **Description:** Returns the maximum follow distance based on the leader’s platform speed. When the platform is moving fast, the Gnarwail follows much closer.
* **Parameters:** `inst` (Entity instance).
* **Returns:** A scalar distance (float). Returns `0.5` when the leader’s platform speed squared exceeds `TUNING.GNARWAIL.WALK_SPEED^2`; otherwise `MAX_BOAT_FOLLOW_DIST`.

### `ShouldLeashRun(inst)`
* **Description:** Determines whether the Gnarwail should run (leash condition) when the leader’s platform speed is high.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `true` if the leader’s platform speed squared is greater than or equal to `GNARWAIL_WALK_SQ`; otherwise `false`.

### `GetTrader(inst)`
* **Description:** Scans for nearby players attempting to trade with the Gnarwail within `TRADE_DISTANCE`.
* **Parameters:** `inst` (Entity instance).
* **Returns:** A player entity if one is found attempting a trade action; otherwise `nil`.

### `FindFoodAction(inst)`
* **Description:** Finds and returns a buffered eat action for a nearby edible item that has been in the world for at least 3 seconds and is not held or on passable terrain.
* **Parameters:** `inst` (Entity instance).
* **Returns:** A `BufferedAction` object if conditions are met; otherwise `nil`.

### `GetWanderDirection(inst)`
* **Description:** Computes a wander direction opposite to the nearest boat if the Gnarwail is near one, using a randomized angular offset.
* **Parameters:** `inst` (Entity instance).
* **Returns:** An angle in radians or `nil` if no nearby boat is found.

### `GetFollowTargetFn(inst)`
* **Description:** Returns the current combat target if it exists, is not small, and the Gnarwail is not jumping.
* **Parameters:** `inst` (Entity instance).
* **Returns:** Entity target or `nil`.

### `KeepFaceTargetFn(inst)`
* **Description:** Returns `true` if the current combat target is on water (invalid ground), prompting the Gnarwail to face the target while following.
* **Parameters:** `inst` (Entity instance).
* **Returns:** `true` or `false`.

### `GnarwailBrain:OnStart()`
* **Description:** Initializes the behavior tree root node with priority-based decisions handling horn-breaking panic, electric fences, combat, leashing, trading, eating, tossing, and wandering. Each condition is evaluated periodically by the behavior tree.
* **Parameters:** None.
* **Returns:** None. Constructs and assigns `self.bt` with the root `BT` node.

## Events & Listeners
The `GnarwailBrain` component does not register or fire events directly. It relies on the state graph’s event handling and the behavior tree’s periodic evaluation of predicates.