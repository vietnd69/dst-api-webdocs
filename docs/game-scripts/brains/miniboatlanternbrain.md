---
id: miniboatlanternbrain
title: Miniboatlanternbrain
description: Controls the behavior of the Mini Boat Lantern entity by determining when and how it wanders over ocean terrain while fuel is available.
tags: [ai, brain, navigation, boat, lantern]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: d3dcc53e
system_scope: brain
---

# Miniboatlanternbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MiniBoatLanternBrain` is a behavior tree–based AI component for the Mini Boat Lantern entity. It implements logic that allows the lantern to move autonomously when it is positioned on ocean terrain and has fuel remaining. The brain relies on the `KnownLocations` component to remember its spawn position as `"home"` and uses the `Fueled` component to verify it is not empty before initiating movement. It does not define custom behavior beyond initiating wander movement under the stated conditions.

## Dependencies & tags
**Components used:**  
- `fueled` — checks `IsEmpty()` to ensure fuel remains.  
- `knownlocations` — records `"home"` location on initialization; retrieves it for navigation.

**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree. Creates a `PriorityNode` root with a single `WhileNode` that triggers when `ShouldMove()` returns true. The while condition runs a `Wander` behavior using `"home"` as the reference point, configurable distance, and custom direction logic.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnInitializationComplete()`
* **Description:** Records the entity's initial world position as `"home"` location in the `knownlocations` component. The `dont_overwrite` flag is set to `true`, ensuring the location is only stored if not already present.
* **Parameters:** None.
* **Returns:** Nothing.

### `ShouldMove(inst)`
* **Description:** Helper function (not a class method) that determines whether the Mini Boat Lantern should move. Returns `true` if the lantern is on ocean terrain, has a `fueled` component attached, and that component is not empty.
* **Parameters:**  
  - `inst`: (Entity) — the entity instance to check.
* **Returns:** `boolean` — `true` if conditions for movement are met; otherwise `false`.

### `getdirectionFn(inst)`
* **Description:** Helper function (not a class method) that computes a random direction offset based on the entity's current rotation. The offset is skewed by cubing a uniform random value and scaled by `40` degrees.
* **Parameters:**  
  - `inst`: (Entity) — used to read current rotation.
* **Returns:** `number` — direction in radians.

## Events & listeners
None identified.

## Usage example
```lua
-- The brain is automatically attached and initialized for the Mini Boat Lantern prefab.
-- It does not need to be manually added or invoked.
-- Typical lifecycle is:
-- 1. On prefab spawn, OnInitializationComplete() records "home".
-- 2. On each tick, OnStart() behavior evaluates ShouldMove() and triggers Wander if true.
