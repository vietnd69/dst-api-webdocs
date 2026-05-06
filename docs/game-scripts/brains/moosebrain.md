---
id: moosebrain
title: Moosebrain
description: Defines the AI behavior tree for the Moose entity, managing combat, egg-laying, and territorial behaviors.
tags: [ai, brain, boss, behavior]
sidebar_position: 10
last_updated: 2026-04-22
build_version: 722832
change_status: stable
category_type: brains
source_hash: c437955d
system_scope: brain
---

# Moosebrain

> Based on game build **722832** | Last updated: 2026-04-22

## Overview
`MooseBrain` is a behavior tree brain that controls the AI for the Moose entity. It manages priority-based behaviors including combat engagement, egg-laying mechanics, territorial leashing, and player-facing interactions. The brain uses a `PriorityNode` structure where higher-priority behaviors interrupt lower ones.

## Usage example
```lua
local inst = SpawnPrefab("moose")
local brain = require("brains/moosebrain")
RunBrain(inst, brain)

-- Brain automatically handles:
-- - Combat via ChaseAndAttack
-- - Egg laying when WantsToLayEgg is true
-- - Leashing to landpoint location
-- - Facing nearby players
```

## Dependencies & tags
**External dependencies:**
- `behaviours/faceentity` -- provides FaceEntity behavior node for player-facing
- `behaviours/chaseandattack` -- provides ChaseAndAttack behavior node for combat
- `behaviours/leash` -- provides Leash behavior node for territorial bounds

**Components used:**
- `combat` -- checks `target` property to determine if engaged in combat
- `entitytracker` -- calls `GetEntity("egg")` to check for existing egg entity
- `knownlocations` -- calls `GetLocation("landpoint")` for leash bounds and `RememberLocation("spawnpoint")` for spawn tracking

**Tags:**
- `notarget` -- checked on target entities to exclude from facing behavior
- `busy` -- state tag checked to prevent facing during busy animations

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `bt` | BehaviorTree | `nil` | Reference to the behavior tree instance created in OnStart(). |

## Main functions
### `OnStart()`
* **Description:** Initializes the behavior tree with priority-ordered behavior nodes. Sets up combat, egg-laying, leashing, facing, and wandering behaviors. Higher priority nodes interrupt lower ones.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.inst` is nil when accessing components or calling behavior functions. Errors if `knownlocations` component is missing when calling `GetLocation()`.

### `OnInitializationComplete()`
* **Description:** Records the entity's spawn position to the knownlocations component under the "spawnpoint" key. Called when brain initialization finishes.
* **Parameters:** None
* **Returns:** None
* **Error states:** Errors if `self.inst` is nil or if `knownlocations` component is not present on the entity.

### `GoHome(inst)` (local)
* **Description:** Returns a BufferedAction for the GOHOME action if the entity should go away and has no combat target. Used by the WhileNode in the behavior tree.
* **Parameters:** `inst` -- the entity instance
* **Returns:** BufferedAction instance or `nil` if conditions not met
* **Error states:** None

### `GetFaceTargetFn(inst)` (local)
* **Description:** Finds the closest player within START_FACE_DIST that does not have the "notarget" tag and when the entity is not in a busy state. Used by FaceEntity behavior.
* **Parameters:** `inst` -- the entity instance
* **Returns:** Player entity instance or `nil` if no valid target found
* **Error states:** None

### `KeepFaceTargetFn(inst, target)` (local)
* **Description:** Validates whether the entity should continue facing a target. Returns false if entity is busy, has notarget tag, or is beyond KEEP_FACE_DIST from target.
* **Parameters:**
  - `inst` -- the entity instance
  - `target` -- the target entity being faced
* **Returns:** boolean -- true if should keep facing, false otherwise
* **Error states:** None

### `LayEgg(inst)` (local)
* **Description:** Returns a BufferedAction for the LAYEGG action if the entity wants to lay an egg and no egg entity is currently tracked. Used by DoAction in the behavior tree.
* **Parameters:** `inst` -- the entity instance
* **Returns:** BufferedAction instance or `nil` if conditions not met
* **Error states:** None

## Events & listeners
- **Listens to:** None identified
- **Pushes:** None identified