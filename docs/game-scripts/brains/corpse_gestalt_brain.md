---
id: corpse_gestalt_brain
title: Corpse Gestalt Brain
description: Controls movement and behavior of a corpse-infesting entity in relation to its tracked corpse target and nearby players.
tags: [ai, brain, movement, boss, corpse]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 0146e001
system_scope: brain
---

# Corpse Gestalt Brain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CorpseGestaltBrain` is a behavior tree–driven brain component that governs the movement logic of a gestalt-style entity that spawns from and periodically infests a corpse. It tracks a specific corpse entity using `EntityTracker`, adjusts its position based on distance (attaching, approaching, or orbiting), and automatically removes itself if it leaves all players’ view distance. This brain integrates with the entity’s state graph to transition into the `"infest_corpse"` state when in close proximity.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("entitytracker")
inst:AddBrain("corpse_gestalt_brain")
inst.components.entitytracker:AddEntity("corpse", corpse_entity)
```

## Dependencies & tags
**Components used:** `entitytracker` — used via `inst.components.entitytracker:GetEntity(CORPSE_TRACK_NAME)`
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `MoveToPointAction(inst)`
*   **Description:** Calculates and returns a movement action (`BufferedAction`) for the entity toward its tracked corpse or a random location when out of player view. It handles three distance zones: close enough to attach to the corpse (`<= ATTACH_DIST_SQ`), within approach range (`<= CLOSE_DIST_SQ`), or far away (orbiting around the corpse with random angular offset). Also handles cleanup if the entity is too far from all players (`> SCREEN_DIST_SQ`).
*   **Parameters:** `inst` (entity instance) — the entity using this brain.
*   **Returns:** A `BufferedAction` targeting `ACTIONS.WALKTO` if movement is needed and the entity is still valid; `nil` otherwise (e.g., attached or invalid).
*   **Error states:** Returns `nil` if no target is found, the entity becomes invalid, or the entity is already infesting.

### `CorpseGestaltBrain:OnStart()`
*   **Description:** Initializes the behavior tree with a root `PriorityNode`. The root contains a `WhileNode` that continuously evaluates whether the state graph is idle (`HasStateTag("idle")`). If so, it executes `MoveToPointAction` to determine movement.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** None — sets up the brain’s behavior tree once.

## Events & listeners
None.
