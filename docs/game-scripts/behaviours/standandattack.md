---
id: standandattack
title: Standandattack
description: Controls an entity to remain stationary while pursuing and attacking a target until a timeout or target death occurs, commonly used for combat AI.
tags: [combat, ai, behaviour]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 424fb4b4
system_scope: entity
---

# Standandattack

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`StandAndAttack` is a behaviour tree node used to implement stationary combat AI. It manages the logic for selecting a target, issuing attacks, and exiting the state under conditions such as target death, timeout, or loss of target validity. It integrates with the `combat`, `health`, and `locomotor` components, and can optionally stop locomotion before each attack attempt.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("combat")
inst:AddComponent("health")
inst:AddComponent("locomotor")

-- Create a FindNewTargetFn (e.g., nearest living enemy)
local function findTarget(e)
    return FindEntity(e, 10, nil, { "combat", "heart" })
end

-- Add the StandAndAttack behaviour node
inst:AddTag("standandattack")
inst.behaviourtree:AddNode("standandattack", StandAndAttack(inst, findTarget, 10, true))
```

## Dependencies & tags
**Components used:** `combat`, `health`, `locomotor`  
**Tags:** Checks `canrotate`; no tags added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance this behaviour controls. |
| `findnewtargetfn` | `function?` | `nil` | Optional callback to find a new target if none is set. |
| `timeout` | `number?` | `nil` | Maximum time (seconds) to remain in this state before failing. |
| `shouldstoplocomotor` | `boolean?` | `nil` | If true, stops locomotion before each attack attempt. |
| `numattacks` | `number` | `0` | Counter for total attacks/misses recorded since activation. |
| `starttime` | `number?` | `nil` | Timestamp when the state entered RUNNING. |

## Main functions
### `Visit()`
* **Description:** Core logic for the behaviour node. Evaluates target state, updates timeout, handles attacks, and transitions between `READY`, `RUNNING`, `SUCCESS`, and `FAILED` states.
* **Parameters:** None.
* **Returns:** Nothing (state transitions modify `self.status` internally).
* **Error states:** Returns early if state is neither `READY` nor `RUNNING`. Fails if `combat.target` is invalid or missing, timeout exceeded, or target becomes dead.

### `OnAttackOther(target)`
* **Description:** Callback triggered by `onattackother` and `onmissother` events. Increments `numattacks` and resets the timeout timer (`starttime`).
* **Parameters:** `target` (`Entity?`) — the entity that was attacked or missed.
* **Returns:** Nothing.

### `OnStop()`
* **Description:** Cleans up event listeners when the behaviour node is removed or terminated.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `onattackother` — triggers `OnAttackOther` to count attacks.
- **Listens to:** `onmissother` — also triggers `OnAttackOther` to count misses.
- **Pushes:** No events directly; relies on `combat:TryAttack()` and internal state changes for side effects.
