---
id: miniboatlanternbrain
title: Miniboatlanternbrain
description: Controls the movement behavior of a small lantern-carrying entity that navigates ocean terrain using a wander-based AI.
tags: [ai, locomotion, ocean]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: brain
source_hash: d3dcc53e
system_scope: locomotion
---

# Miniboatlanternbrain

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`MiniBoatLanternBrain` is a behavior tree-based AI controller for a small entity (e.g., the Boat Lantern) that patrols ocean terrain. It uses a `Wander` behavior when the entity is positioned on ocean water, has a non-empty `fueled` component, and is not grounded. It records the starting position as `"home"` upon initialization for use as a wander reference point.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fueled")
inst:AddComponent("knownlocations")
inst:AddBrain("miniboatlanternbrain")

-- The brain automatically records "home" on initialization and begins wandering when conditions are met.
```

## Dependencies & tags
**Components used:** `fueled`, `knownlocations`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnStart()`
* **Description:** Initializes and assigns the behavior tree. Sets up a priority root node that executes a `Wander` behavior only when `ShouldMove()` returns `true` — i.e., the entity is on ocean terrain, has a `fueled` component, and the fuel is not empty.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** The `Wander` behavior uses `"home"` location via `knownlocations:GetLocation("home")`, which must have been previously set.

### `OnInitializationComplete()`
* **Description:** Records the entity’s current world position as `"home"` in the `knownlocations` component. Prevents overwriting if `"home"` already exists.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
Not applicable.
