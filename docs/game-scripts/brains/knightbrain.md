---
id: knightbrain
title: Knightbrain
description: Controls the AI behavior of gilded knights, managing combat, formation movement, stage seating, and coordinated actions with other horsemen.
tags: [ai, boss, combat, formation, coordinated]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 550c4dab
system_scope: brain
---

# Knightbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Knightbrain` is an AI brain component for gilded knights that orchestrates complex behavioral logic including combat engagement, formation following, stage seating during Charlie's宴, and dynamic leader switching for coordinated wandering. It relies heavily on the `combat`, `follower`, `entitytracker`, `stageactor`, and `locomotor` components to manage state and interactions in real time.

The brain implements a behavior tree (`BT`) constructed in its `OnStart` method. It supports two primary modes: standard `gilded_knight` behavior with formation awareness and seating logic, and fallback behavior for non-gilded cases. Behavior priority is managed via `PriorityNode`, with conditional `WhileNode` blocks for situational activation (e.g., `GildedFormation`, `GildedStageSeating`).

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("combat")
inst:AddComponent("follower")
inst:AddComponent("entitytracker")
inst:AddComponent("stageactor")
inst:AddComponent("locomotor")
inst:AddTag("gilded_knight")

inst.brain = inst:AddBrain("knightbrain")
inst.brain.OnStart()
```

## Dependencies & tags
**Components used:** `combat`, `follower`, `entitytracker`, `stageactor`, `locomotor`
**Tags:** Checks `gilded_knight`, `notarget`; adds none directly (tags used conditionally in logic)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GameObject` | *none* | The entity instance this brain controls. Passed into constructor and used throughout. |
| `bt` | `BT` | *none* | The constructed behavior tree root, assigned in `OnStart`. |
| `inst.horseman_type` | string | *nil* | Used to identify this knight's type in `YOTH_HORSE_NAMES` list; critical for formation indexing. |
| `inst.canjoust` | boolean | *nil* | If true, allows `TryJoust` logic to evaluate and fire `dojoust` event. |
| `inst.is_sitting` | boolean | *nil* | Set by `GetStageSeatPosition` to indicate seating state during `GildedStageSeating`. |

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree by constructing the root `PriorityNode` with conditional child nodes for gilded/non-gilded knights. Sets parameters (e.g., chase distance, follower distances) based on the `gilded_knight` tag.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None. Behavior tree construction is always performed; fallback behavior is embedded in node logic (e.g., `gilded_stage_nodes` is empty if `gilded` is false).

## Events & listeners
- **Listens to:** None (no explicit `inst:ListenForEvent` calls in this file).
- **Pushes:** 
  - `dojoust` — fired via `inst:PushEvent("dojoust", target)` when `TryJoust` succeeds; includes target as event data.
