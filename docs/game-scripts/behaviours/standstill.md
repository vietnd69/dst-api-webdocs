---
id: standstill
title: Standstill
description: A behavior node that forces an entity to stop moving and remain stationary, conditionally invoking start/keep functions to determine ongoing validity.
tags: [ai, behavior, locomotion]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: ai
source_hash: 7d49f085
system_scope: locomotion
---

# Standstill

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`StandStill` is a behavior node used in the decision-making system of entities (e.g., AI characters) to enforce a stationary state. It inherits from `BehaviourNode` and halts the entity's movement by calling `LocoMotor:Stop()`. It optionally accepts two callback functions: `startfn` (evaluated on entry) and `keepfn` (evaluated while running) — if either returns `false`, the node fails; otherwise, it remains in the `RUNNING` state and periodically sleeps to avoid blocking the scheduler.

This component is typically part of a larger behavior tree and integrates with the `locomotor` component to control movement termination.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("locomotor")

local standStillNode = StandStill(inst,
    function() return inst:HasTag("player") end,
    function() return not inst:HasTag("moving") end
)

-- Later, in behavior tree execution:
standStillNode:Visit()
```

## Dependencies & tags
**Components used:** `locomotor`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance to which this behavior applies. |
| `startfn` | function or `nil` | `nil` | Optional predicate function called when the node enters `READY` state; must return `true` to proceed. |
| `keepfn` | function or `nil` | `nil` | Optional predicate function called during `RUNNING` state; must return `true` to continue. |

## Main functions
### `Visit()`
* **Description:** Executes the behavior logic. If the node is `READY`, it evaluates `startfn`; if `true`, it stops locomotion and transitions to `RUNNING`. While `RUNNING`, it evaluates `keepfn` each tick and sleeps for 0.5 seconds before re-evaluating. Fails if either callback returns `false`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None explicitly handled; behavior fails silently if callbacks return `false` or throw errors (due to lack of try/catch).

## Events & listeners
- **Listens to:** None.
- **Pushes:** None — depends on the event system only through `locomotor:Stop()` (which pushes `locomote`), but does not push events directly.

`<`!-- YAML frontmatter closing delimiter -->
