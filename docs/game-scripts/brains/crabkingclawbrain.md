---
id: crabkingclawbrain
title: Crabkingclawbrain
description: Controls the behavior of the Crab King's claw minions, including combat targeting, circling logic around boats, leash management, and wandering.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 17d6113d
---

# Crabkingclawbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
`Crabkingclawbrain` is a brain component responsible for directing the behavior of Crab King claw minions. It uses a behavior tree to orchestrate key actions such as attacking targets, circling boats during combat, maintaining leash distance from the Crab King, and wandering near spawn points. It relies on the `combat`, `hull`, and `knownlocations` components for target acquisition, positional calculations, and memory of the spawn location.

## Dependencies & Tags
- **Components used:** `combat`, `hull`, `knownlocations`
- **Tags:** None identified.

## Properties
No public properties are initialized directly in the constructor. All configuration is handled via local constants and internal functions.

## Main Functions
### `CrabkingClawBrain:OnStart()`
* **Description:** Initializes and assigns the root node of the behavior tree. The behavior tree is prioritized and evaluates actions in the order listed, using buffered actions for combat and movement. It handles attack targeting, circling logic, leash-based movement, and wandering.
* **Parameters:** None.
* **Returns:** None.

### `CrabkingClawBrain:OnInitializationComplete()`
* **Description:** Records the current world position of the claw minion as the "spawnpoint" in the `knownlocations` component. This location is later used for wandering behavior.
* **Parameters:** None.
* **Returns:** None.

### `AttackTarget(inst)`
* **Description:** A utility function that prepares an attack buffered action against the combat target if the minion is not in cooldown, the target exists, and is within attack range. It also orients the minion toward the target before returning the buffered action.
* **Parameters:** `inst` – the entity instance representing the claw minion.
* **Returns:** `BufferedAction` if the target is valid and ready to attack; otherwise, `nil`.

### `CircleBoat(inst)`
* **Description:** Calculates a position around the combat target's platform (e.g., a boat) to facilitate circling behavior. It computes a tangent offset based on the angle from the platform to the target and extends outward by one unit beyond the platform’s radius.
* **Parameters:** `inst` – the entity instance representing the claw minion.
* **Returns:** `Vector3` – a position for the minion to move toward; or `nil` if target, platform, or calculated position is invalid.

## Events & Listeners
None identified.