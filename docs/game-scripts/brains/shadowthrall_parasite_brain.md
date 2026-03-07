---
id: shadowthrall_parasite_brain
title: Shadowthrall Parasite Brain
description: Controls the movement and lifecycle behavior of a shadow thrall parasite entity by removing it when no players are nearby and fleeing from players and shadow rift portals.
tags: [ai, brain, movement, combat]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: d1cce63d
system_scope: brain
---

# Shadowthrall Parasite Brain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ShadowThrall_Parasite_Brain` is a behavior tree-based AI component for shadow thrall parasites. Its primary responsibility is to manage the entity's lifecycle and movement in response to environmental conditions: it schedules the entity for removal if no players are within viewing distance, and forces it to flee from the nearest player or nearest shadow rift portal if either is present. This component inherits from `Brain` and uses the behavior tree (`BT`) system to coordinate its logic.

The component relies on external behavior modules (`follow`, `wander`, `standstill`, `faceentity`) and utility functions (`FindClosestPlayerToInst`, `IsAnyPlayerInRange`, `TheSim:FindEntities`) to implement its decision-making.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("shadowthrall_parasite")
inst:AddBrain("shadowthrall_parasite_brain")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks for `shadowrift_portal` via entity tags during search.

## Properties
No public properties

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree. Sets up a priority root node that first evaluates whether the entity should be removed, and if not, activates a `RunAway` behavior targeting the closest player or nearest shadow rift portal.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None — always sets up a new behavior tree with a fixed root node.

## Events & listeners
Not applicable

## Helper Functions
### `TestForRemove(inst)`
* **Description:** Checks if any player is currently in range (within `PLAYER_CAMERA_SEE_DISTANCE`). If not, schedules the entity for removal via `inst:Remove()`.
* **Parameters:** `inst` (entity instance) — the entity being tested.
* **Returns:** Nothing.

### `GetRunAwayTarget(inst)`
* **Description:** Determines the appropriate target to flee from. First attempts to find the closest player; if none found, searches for the nearest entity tagged with `shadowrift_portal`.
* **Parameters:** `inst` (entity instance) — the entity computing the target.
* **Returns:** Entity instance or `nil` — the nearest player or shadow rift portal, whichever exists and is closer.
* **Error states:** Returns `nil` if no players and no shadow rift portals are within `PLAYER_CAMERA_SEE_DISTANCE`.
