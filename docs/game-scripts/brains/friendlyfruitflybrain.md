---
id: friendlyfruitflybrain
title: Friendlyfruitflybrain
description: Controls the behavior of friendly fruit flies by coordinating movement, following a leader, facing the leader, and foraging for farm plants using a behavior tree.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 231d928d
---

# Friendlyfruitflybrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component defines the behavioral logic for friendly fruit flies in the game. It constructs and runs a behavior tree (`BT`) that prioritizes responses to danger (panic triggers), foraging for farm plants, following their leader within defined distance bounds, maintaining orientation toward the leader, and wandering when no higher-priority task is active. It relies on common behavior types from the `behaviours/` directory and integrates with the `follower` component to determine the current leader via `GetLeader()`.

## Dependencies & Tags
- **Components used:** `follower` (accessed via `inst.components.follower:GetLeader()`)
- **Tags:** None identified.

## Properties
No public properties are initialized directly in the constructor. The component inherits from `Brain` and initializes a private behavior tree (`self.bt`) during `OnStart()`.

## Main Functions
### `FriendlyFruitFlyBrain:OnStart()`
* **Description:** Initializes and starts the behavior tree. This method is called automatically when the brain component begins managing the entity. It sets up a priority-based behavior tree with the following tasks, evaluated in order:
  1. `PanicTrigger` and `ElectricFencePanicTrigger`: Immediate reaction to danger.
  2. `FindFarmPlant`: Forages for interactable farm plants using `GetFollowPos` as the reference position.
  3. `Follow`: Moves toward the leader to maintain a target distance range of 0–10 units, with a preferred distance of 5.
  4. `FaceEntity`: Rotates the entity to face the leader.
  5. `Wander`: Moves randomly within a 20-unit radius around the leader's position.
* **Parameters:** None.
* **Returns:** None.

## Events & Listeners
None. This component does not register or fire any events directly.