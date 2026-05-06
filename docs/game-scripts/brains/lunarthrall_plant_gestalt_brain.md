---
id: lunarthrall_plant_gestalt_brain
title: Lunarthrall Plant Gestalt Brain
description: Controls AI behavior for Lunar Thrall Gestalt entities, managing movement toward infestable plants and offscreen teleportation logic.
tags: [ai, brain, lunar, thrall]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: brains
source_hash: 75430ebc
system_scope: brain
---

# Lunarthrall Plant Gestalt Brain

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`LunarThrall_Plant_Gestalt_Brain` defines the behavior tree for Lunar Thrall Gestalt entities. It manages movement toward valid Lunar Thrall plants for infestation, handles offscreen teleportation when players are nearby, and coordinates with the `lunarthrall_plantspawner` world component to find suitable plant targets. The brain operates on a 0.25 second update rate and prioritizes plant attachment when within range.

## Usage example
```lua
local inst = SpawnPrefab("lunarthrall_plant_gestalt")
local brain = require("brains/lunarthrall_plant_gestalt_brain")
RunBrain(inst, brain)

-- The brain automatically starts and manages:
-- 1. Movement toward infestable plants
-- 2. Offscreen teleportation when players are in range
-- 3. State transitions to "infest" when attached to a plant
```

## Dependencies & tags
**External dependencies:**
- `behaviours/follow` -- required for follow behavior node definitions
- `behaviours/wander` -- required for wander behavior node definitions
- `behaviours/standstill` -- required for standstill behavior node definitions
- `behaviours/faceentity` -- required for face entity behavior node definitions
- `brains/braincommon` -- provides `PossessChassisNode` for chassis possession logic

**Components used:**
- `stategraph` -- checks for "idle" state tag, transitions to "infest" state
- `transform` -- gets and sets entity position for movement and teleportation
- `timer` -- checks for "justspawned" timer existence to control movement logic
- `lunarthrall_plantspawner` (world component) -- finds valid plants and moves gestalt offscreen

**Tags:**
- `idle` -- checked via stategraph to determine if movement should occur
- `infest` -- state tag entered when gestalt attaches to a plant

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bt` | BehaviorTree | `nil` | The behavior tree instance created in OnStart. |
| `inst` | Entity | `nil` | The entity instance this brain controls (set by Brain._ctor). |

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree with a priority node structure that checks for idle state, attempts chassis possession, and executes movement actions. Sets `self.bt` to the created behavior tree.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.inst` is nil when accessing `self.inst.sg` or `self.inst.Transform` — no nil guard present in the node functions.

### `MoveToPointAction(inst)`
* **Description:** Local helper function that generates a `BufferedAction` for walking to a target position. Handles plant target validation, distance checks, offscreen teleportation logic, and random direction movement when no plant target is available. Calls `inst:Remove()` when plant target is invalid and `lunarthrall_plantspawner` world component is nil (expected conditional behavior, not an error).
* **Parameters:** `inst` -- the gestalt entity instance
* **Returns:** `BufferedAction` for WALKTO action, or `nil` if no valid position found
* **Error states:** Errors if `inst` lacks `timer` component (no nil guard before `inst.components.timer:TimerExists` access — causes nil dereference crash).

## Events & listeners
None identified. This brain uses behavior tree nodes rather than direct event listening.