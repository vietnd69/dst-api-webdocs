---
id: standandattack
title: StandAndAttack
description: BehaviourNode that makes an entity stand in place and attack a target until it dies or timeout expires.
tags: [behaviour, ai, combat, behaviour-tree]
sidebar_position: 10

last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: behaviours
source_hash: 625963a9
system_scope: brain
---

# StandAndAttack

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`StandAndAttack` is a custom BehaviourNode that causes an entity to remain stationary while attacking a designated target. Returns READY/RUNNING/SUCCESS/FAILED in the standard BehaviourNode contract. The node tracks attack count and enforces an optional timeout, failing if the target dies, becomes invalid, or the time limit is exceeded. Used by brains as a reusable combat subtree fragment composed inside SelectorNode/SequenceNode.

## Usage example
```lua
-- Embed inside a brain's behaviour tree:
local StandAndAttack = require("behaviours/standandattack")

local function FindTarget(inst)
    return TheWorld:FindEntity(inst:GetPosition(), 10, function(entity)
        return entity:HasTag("monster")
    end)
end

local root = SelectorNode{
    StandAndAttack(self.inst, FindTarget, 30),  -- attack target, 30s timeout
    Wander(self.inst, GetHomePos, WANDER_DIST),
}
```

## Dependencies & tags
**External dependencies:**
- `behaviourtree` -- BehaviourNode base class, status constants (READY, RUNNING, SUCCESS, FAILED)

**Components used:**
- `combat` -- queried for target, calls ValidateTarget, BattleCry, SetTarget, TryAttack
- `locomotor` -- calls Stop to halt movement during attack
- `health` (on target) -- checks IsDead to determine success condition

**Tags:**
- `canrotate` -- checked via HasStateTag to determine if entity should face target

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | Entity owning the behaviour. Set by constructor. |
| `findnewtargetfn` | function | --- | Function `(inst) -> entity` to find a new target when none exists. |
| `timeout` | number | `nil` | Optional time limit in seconds; node returns FAILED if exceeded. |
| `numattacks` | number | `0` | Internal counter tracking total attacks performed during this node execution. |
| `starttime` | number | `nil` | Internal: timestamp when Visit() first transitioned to RUNNING state. |
| `onattackfn` | function | --- | Internal callback registered for onattackother/onmissother events. |
| `status` | number | `READY` | Inherited from BehaviourNode; current node status (READY/RUNNING/SUCCESS/FAILED). |

## Main functions
### `_ctor(inst, findnewtargetfn, timeout)`
*   **Description:** Initialises a StandAndAttack node bound to `inst`, using `findnewtargetfn` to acquire targets, with optional `timeout`. Calls `BehaviourNode._ctor(self, "StandAndAttack")` and registers event listeners for attack events. Node requires combat component to function — Visit() will error if missing.
*   **Parameters:**
    - `inst` -- entity owning the behaviour
    - `findnewtargetfn` -- function `(inst) -> entity` to find new targets when current target is nil
    - `timeout` -- optional number, seconds before forced FAILED status
*   **Returns:** nil
*   **Error states:** None

### `__tostring()`
*   **Description:** Returns debug string representation showing the current combat target. Used by brain debugger overlay.
*   **Parameters:** None
*   **Returns:** string formatted as `"target <target tostring>"`
*   **Error states:** Errors if `self.inst.components.combat` is nil — no nil guard before accessing .target property.

### `OnStop()`
*   **Description:** Called when the behaviour node is stopped or preempted. Removes the event callbacks registered in the constructor to prevent memory leaks and stale references.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None.

### `OnAttackOther(target)`
*   **Description:** Callback triggered when the entity attacks or misses another entity. Increments the attack counter and resets the start time to extend the timeout window.
*   **Parameters:**
    - `target` -- entity that was attacked or missed
*   **Returns:** nil
*   **Error states:** None.

### `Visit()`
*   **Description:** Called each tick by the parent node. Manages state transitions: READY → RUNNING when target acquired; RUNNING → SUCCESS when target dies; RUNNING → FAILED when target invalid or timeout exceeded. While RUNNING, stops locomotion, faces target, and attempts attacks with 0.125s sleep between attempts.
*   **Parameters:** None (uses self.inst, self.status, self.timeout, self.starttime)
*   **Returns:** nil — sets self.status as side effect
*   **Error states:** Errors if `self.inst.components.combat` is nil — no nil guard before accessing combat methods. Errors if `combat.target.components.health` is nil — calls IsDead() without guard.

### `Reset()`
*   **Description:** Inherited from BehaviourNode base class. Not overridden in this file. Resets the behaviour node to initial state.
*   **Parameters:** None
*   **Returns:** nil
*   **Error states:** None

### `DBString()`
*   **Description:** Inherited from BehaviourNode base class. Not overridden in this file. Returns debug string for behaviour tree visualization.
*   **Parameters:** None
*   **Returns:** string
*   **Error states:** None

## Events & listeners
**Listens to:**
- `onattackother` — triggers OnAttackOther; increments attack counter and resets timeout timer. Data: `{target = entity}`
- `onmissother` — triggers OnAttackOther; increments attack counter and resets timeout timer. Data: `{target = entity}`