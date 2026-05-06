---
id: corpse_gestalt_brain
title: Corpse Gestalt Brain
description: AI behaviour tree for the Corpse Gestalt entity, managing movement toward tracked corpses and infestation state transitions based on proximity thresholds.
tags: [brain, ai, gestalt, behaviour-tree]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: brains
source_hash: 307d1fd6
system_scope: brain
---

# Corpse Gestalt Brain

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`CorpseGestaltBrain` is the AI behaviour tree for the Corpse Gestalt prefab. It controls movement toward a tracked corpse entity, transitioning to the `infest_corpse` state when within attachment range. The brain prioritises corpse tracking while idle, and removes the entity if it moves out of player view while not infesting. Brains are paused when the entity is far from any player and resume automatically on player proximity. Brains are attached via `inst:SetBrain(brain)` during prefab construction.

## Usage example
```lua
-- Brains are attached during prefab construction:
local CorpseGestaltBrain = require("brains/corpse_gestalt_brain")
local brain = CorpseGestaltBrain(inst)
inst:SetBrain(brain)

-- The framework calls OnStart() to obtain the behaviour tree.
-- Manual access to the running tree:
if inst.brain ~= nil and inst.brain.bt ~= nil then
    -- inspect or reset the running behaviour tree
end
```

## Dependencies & tags
**External dependencies:**
- `brains/braincommon` -- provides `PossessChassisNode` behaviour node factory

**Components used:**
- `entitytracker` -- queried via `GetEntity(CORPSE_TRACK_NAME)` to find tracked corpse
- `sg` (stategraph) -- checks `idle` and `infesting` state tags; triggers `infest_corpse` state

**Tags:**
- `idle` -- checked to determine if movement logic should run
- `infesting` -- checked to prevent removal when out of view; entity persists while infesting

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ATTACH_DIST_SQ` | constant (local) | `1` | Squared distance threshold for immediate attachment to corpse. At this range, entity teleports to corpse position and enters `infest_corpse` state. |
| `CLOSE_DIST_SQ` | constant (local) | `64` | Squared distance threshold for close-range movement. Between `ATTACH_DIST_SQ` and this value, entity moves directly to corpse position. |
| `SCREEN_DIST_SQ` | constant (local) | `PLAYER_CAMERA_SEE_DISTANCE_SQ` | Squared distance defining player camera view range. Used to determine if entity should self-remove when out of sight. |
| `CORPSE_TRACK_NAME` | constant (local) | `"corpse"` | Entity tracker name used to look up the target corpse via `entitytracker:GetEntity()`. |
| `UPDATE_RATE` | constant (local) | `0.25` | Behaviour tree update interval in seconds. Controls how frequently movement decisions are evaluated. |

## Main functions
### `OnStart()` (Brain method)
* **Description:** Constructs the root PriorityNode of the behaviour tree. While the entity has the `idle` state tag, it executes a sub-tree containing `PossessChassisNode` (from BrainCommon) and `MoveToPointAction` movement logic. Called once when the brain is attached and on resume after pause.
* **Parameters:** `self` -- the brain instance (implicit via method syntax)
* **Returns:** None (assigns `self.bt` with the BehaviourTree)
* **Error states:** Errors if `self.inst` is nil when OnStart fires (no nil guard before `self.inst.sg` access).

### `CalcNewPosition(inst, radius, angle)` (local)
* **Description:** Calculates a random offset position for movement. Applies a random angular deviation of up to `PI * 0.45` radians (either positive or negative) to the base angle, then computes the offset vector using polar coordinates.
* **Parameters:**
  - `inst` -- entity owning the brain
  - `radius` -- distance from current position for the offset
  - `angle` -- base angle in radians
* **Returns:** Vector3 position offset from `inst:GetPosition()`
* **Error states:** Errors if `inst` is nil or invalid (no `inst:IsValid()` guard before `inst:GetPosition()` call).

### `MoveToPointAction(inst)` (local)
* **Description:** Returns a `BufferedAction` for movement or nil. Logic flow:
  - If tracked corpse exists and is within `ATTACH_DIST_SQ`: teleports entity to corpse position and triggers `infest_corpse` state; returns nil (no movement action needed).
  - If within `CLOSE_DIST_SQ`: moves directly to corpse position.
  - If farther than `CLOSE_DIST_SQ`: calculates random approach position at 75% of current distance (capped at radius 16).
  - If no corpse target and not infesting: checks if any player is within `SCREEN_DIST_SQ`. If no players nearby, removes the entity entirely. Otherwise, calculates random wander position.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** `BufferedAction` for `ACTIONS.WALKTO`, or `nil` if entity removed or teleporting
* **Error states:** Errors if `inst.components.entitytracker` is nil (no guard present before `GetEntity` call).

## Events & listeners
None — brain trees react to component state, not engine events directly. Event handling is done in the brain's host stategraph or via component subscriptions.