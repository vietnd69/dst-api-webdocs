---
id: wx78_possessedbodybrain_no_package
title: WX-78 Possessed Body Brain
description: AI behavior tree for WX-78's possessed body entity, currently implementing only stand-still behavior with configurable update rate.
tags: [brain, ai, wx78, behaviour-tree]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: brains
source_hash: 2341a657
system_scope: brain
---

# WX-78 Possessed Body Brain

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Wx78_PossessedBodyBrain` is the AI behavior tree for WX-78's possessed body prefab. It currently implements only a `StandStill` behavior node, causing the entity to remain stationary. Brains are paused automatically when the entity is far from players and resume on player proximity. The behavior tree is attached via `inst:SetBrain(Wx78_PossessedBodyBrain)`.

## Usage example
```lua
-- Brains are attached during prefab construction:
local brain = require("brains/wx78_possessedbodybrain_no_package")
inst:SetBrain(brain)

-- The framework calls OnStart() to obtain the behaviour tree.
-- Manual access to the running tree:
if inst.brain ~= nil and inst.brain.bt ~= nil then
    -- inspect or reset the running behaviour tree
end
```

## Dependencies & tags
**External dependencies:**
- `behaviours/wander` -- Wander behavior node factory (imported but not used in current implementation)
- `behaviours/faceentity` -- FaceEntity behavior node factory (imported but not used in current implementation)
- `behaviours/chaseandattack` -- ChaseAndAttack behavior node factory (imported but not used in current implementation)
- `behaviours/doaction` -- DoAction behavior node factory (imported but not used in current implementation)
- `behaviours/leash` -- Leash behavior node factory (imported but not used in current implementation)
- `behaviours/standstill` -- StandStill behavior node factory (actively used)
- `brains/braincommon` -- imported but not referenced (unused import)

**Components used:**
None identified — behavior nodes access components internally; this brain file does not directly access `inst.components.X`.

**Tags:**
None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `UPDATE_RATE` | constant (local) | `0.5` | Behavior tree update interval in seconds. Passed to PriorityNode to control how often the tree evaluates behavior conditions. |

## Main functions
### `OnStart()`
* **Description:** Constructs the root PriorityNode of the behavior tree containing only a `StandStill` behavior. Assigns the resulting BehaviorTree to `self.bt`. Called once when the brain is attached and on resume after pause.
* **Parameters:** `self` -- the brain instance (implicit via method syntax)
* **Returns:** None (assigns `self.bt` internally)
* **Error states:** None

### `OnStop()`
* **Description:** Cleanup callback when the brain is stopped or detached. Currently empty — no cleanup logic required for this brain.
* **Parameters:** `self` -- the brain instance (implicit via method syntax)
* **Returns:** None
* **Error states:** None

## Events & listeners
None — brain trees react to component state through behavior nodes, not engine events directly. Event handling is done in the brain's host stategraph or via component subscriptions.