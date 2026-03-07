---
id: doaction
title: Doaction
description: Executes a dynamically retrieved action on an entity and manages its lifecycle within a behaviour tree.
tags: [ai, behaviour, action]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviours
source_hash: b0b89653
system_scope: ai
---

# Doaction

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Doaction` is a behaviour tree node that executes a single action on an entity. It retrieves an action via a provided callback function, initiates it using the `locomotor` component, and tracks its success, failure, or timeout. It is designed for AI logic where complex actions (e.g., attacking, moving, using items) need to be composed within behaviour trees. It depends on the `locomotor` component to dispatch and manage the actual action execution.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("locomotor")

local getActionFn = function(entity)
    return ACTIONS.ATTACK(entity.components.combat and entity.components.combat.target)
end

local doActionNode = Doaction(inst, getActionFn, "AttackTarget", false, 3)
-- When used in a behaviour tree:
-- doActionNode:Visit()
```

## Dependencies & tags
**Components used:** `locomotor` — calls `PushAction()`.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *required* | The entity instance this node acts on. |
| `shouldrun` | `function` or `boolean` | *provided* | Determines whether the action should run (passed to `FunctionOrValue()`). |
| `action` | `BufferedAction` or `nil` | `nil` | The currently executing action. |
| `getactionfn` | `function` | *provided* | Callback returning the `BufferedAction` to execute. |
| `time` | number or `nil` | `nil` | Timestamp when action started (used for timeout). |
| `timeout` | number or `nil` | `nil` | Maximum duration in seconds before failing the action. |

## Main functions
### `OnFail()`
* **Description:** Marks the node for failure by setting `pendingstatus` to `FAILED`.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnSucceed()`
* **Description:** Marks the node for success by setting `pendingstatus` to `SUCCESS`.
* **Parameters:** None.
* **Returns:** Nothing.

### `Visit()`
* **Description:** Main execution logic. Evaluates and starts the action if `status == READY`, or monitors its progress if `RUNNING`, checking for timeout, explicit success/failure, or action invalidation.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** 
  - Returns early with `status = FAILED` if `getactionfn()` returns `nil`.
  - Sets `status = FAILED` if the action exceeds `timeout` or becomes invalid (e.g., target destroyed).
  - Sets `status = FAILED` if `action:TestForStart()` fails internally (via `locomotor`).

## Events & listeners
- **Listens to:** Internal — listens to `action`’s `OnFail`/`OnSuccess` callbacks (not via `inst:ListenForEvent`).
- **Pushes:** None — does not fire server/client events directly.
