---
id: itemmimic_revealedbrain
title: Itemmimic Revealedbrain
description: AI behaviour tree for the revealed Item Mimic entity, managing player avoidance, leash constraints, and mimicry target selection.
tags: [brain, ai, mimic, behaviour-tree]
sidebar_position: 10

last_updated: 2026-04-26
build_version: 722832
change_status: stable
category_type: brains
source_hash: 37cdc99a
system_scope: brain
---

# Itemmimic Revealedbrain

> Based on game build **722832** | Last updated: 2026-04-26

## Overview
`Itemmimic_RevealedBrain` is the AI behaviour tree for the revealed Item Mimic prefab. It prioritises player avoidance within `AVOID_PLAYER_DIST`, enforces leash range constraints from a known location, and periodically searches for valid mimicable entities to target. The brain pauses automatically when the entity is far from players and resumes on proximity. Brain trees are attached via `RunBrain(inst, Itemmimic_RevealedBrain)` or `inst:SetBrain(Itemmimic_RevealedBrain)`.

## Usage example
```lua
-- Brains are attached during prefab construction:
local brain = require("brains/itemmimic_revealedbrain")
inst:SetBrain(brain)

-- The framework calls OnStart() to obtain the behaviour tree.
-- Manual access to the running tree:
if inst.brain ~= nil and inst.brain.bt ~= nil then
    -- inspect or reset the running behaviour tree
end

-- Listen for mimicry state events:
inst:ListenForEvent("eye_up", function() print("Searching for target") end)
inst:ListenForEvent("eye_down", function() print("Mimicry failed") end)
```

## Dependencies & tags
**External dependencies:**
- `behaviours/runaway` -- RunAway behaviour node factory for player avoidance
- `prefabs/itemmimic_data` -- MUST_TAGS and CANT_TAGS for valid mimic targets

**Components used:**
- `locomotor` -- PushAction to queue NUZZLE action for mimicry
- `timer` -- StartTimer/TimerExists for mimic_blocker and recently_spawned checks
- `knownlocations` -- GetLocation to retrieve leash position

**Tags:**
- `jumping` -- checked via stategraph HasStateTag to skip brain logic while jumping

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `UPDATE_RATE` | constant (local) | `0.5` | Behaviour tree update interval in seconds. |
| `AVOID_PLAYER_DIST` | constant (local) | `4.0` | Distance in units at which the RunAway node triggers player avoidance. |
| `AVOID_PLAYER_STOP` | constant (local) | `6.0` | Distance at which the entity stops fleeing from players. |
| `LEASH_RANGE` | constant (local) | `TUNING.SKILLS.WX78.MIMICHEART_SPAWN_DENSITY_RANGE * 0.5` | Maximum radius from leash position the entity can wander. |
| `_mimicry_queued` | instance variable | `nil` | Flag set when mimicry action is queued; cleared on success/failure. |
| `_try_mimic_task` | instance variable | `nil` | Scheduled task handle for delayed mimicry initiation. |

## Main functions
### `OnStart()` (Brain method)
* **Description:** Constructs the root PriorityNode of the behaviour tree. Priority order: leash constraint > recently spawned panic > player runaway > mimic target search > mimicry block check > wandering. Called once when the brain is attached and on resume after pause.
* **Parameters:** None (implicit `self` via method syntax)
* **Returns:** None (assigns `self.bt` with the BehaviourTree)
* **Error states:** Errors if `self.inst` is nil at the moment OnStart fires (engine guarantees non-nil; included for completeness).

### `GetClosestPlayer(inst)` (local)
* **Description:** Helper passed to PanicAndAvoid node. Returns the closest player entity within `AVOID_PLAYER_DIST` squared range. Used during the "Just Spawned" phase for panic behaviour.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Player entity instance or `nil` if no player within range
* **Error states:** Errors if `inst` or `inst.Transform` is nil (no nil guard before GetWorldPosition call).

### `initiate_mimicry(inst, mimicable_entity)` (local)
* **Description:** Initiates the mimicry action sequence. Creates a BufferedAction with ACTIONS.NUZZLE against the target entity, sets `_mimicry_queued` flag, and schedules cleanup tasks. Starts a "mimic_blocker" timer to prevent rapid re-attempts. Cancels any existing `_try_mimic_task`.
* **Parameters:**
  - `inst` -- entity owning the brain
  - `mimicable_entity` -- target entity to mimic
* **Returns:** None
* **Error states:** Errors if `inst.components.locomotor` is nil (no guard present). Errors if `inst.components.timer` is nil (no guard present).

### `GetLeashPos(inst)` (local)
* **Description:** Helper passed to Leash and Wander nodes. Retrieves the "leash" location from the knownlocations component. Returns nil if no leash position is recorded (entity is unbound).
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** Position table `{x, y, z}` or `nil` if no leash location exists
* **Error states:** None — guards `inst.components.knownlocations` with nil check before calling GetLocation.

### `IsInLeashRange(inst, ent)` (local)
* **Description:** Validates whether an entity is within the leash constraint radius. Returns true if no leash position exists (unbound entity is always in range). Otherwise compares squared distance against `LEASH_RANGE`.
* **Parameters:**
  - `inst` -- entity owning the brain
  - `ent` -- candidate entity to check
* **Returns:** boolean
* **Error states:** Errors if `ent` is nil (no nil guard before ent:GetDistanceSqToPoint call).

### `LookForMimicAction(inst)` (local)
* **Description:** Scans for valid mimicable entities within 15 unit radius. Filters by `itemmimic_data.MUST_TAGS` and `CANT_TAGS`, excludes entities with `itemmimic` component, and validates leash range. If a valid target is found, schedules `initiate_mimicry` after 7 ticks and pushes "eye_up" event. Skips if `_try_mimic_task` exists or "mimic_blocker" timer is active.
* **Parameters:** `inst` -- entity owning the brain
* **Returns:** None
* **Error states:** Errors if `inst.components.timer` is nil (no guard present for TimerExists call). Errors if `inst.Transform` is nil (no guard present for GetWorldPosition).

## Events & listeners
**Pushes:**
- `eye_up` -- fired when a valid mimicable target is found and mimicry task is scheduled
- `eye_down` -- fired when mimicry action fails (via AddFailAction callback)