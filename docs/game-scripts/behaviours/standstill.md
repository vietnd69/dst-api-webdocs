---
id: standstill
title: Standstill
description: A behaviour node that forces an entity to remain stationary by stopping its locomotor and optionally evaluating conditional logic to maintain or terminate the state.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: 7d49f085
---

# Standstill

## Overview
`StandStill` is a behaviour node used within DST's state machine/behaviour system to enforce a stationary state on an entity. It inherits from `BehaviourNode` and halts the entity's movement by calling `locomotor:Stop()` on the associated entity. The node supports optional callbacks (`startfn` and `keepfn`) to determine whether the entity *should* begin or *continue* standing still. If either callback returns `false`, the node transitions to `FAILED`; otherwise, it remains in `RUNNING` and periodically re-checks the `keepfn` condition while re-invoking `locomotor:Stop()` every 0.5 seconds.

This component is typically used in conjunction with a state graph or behaviour tree to enforce idle, waiting, or interrupted states where movement must be explicitly blocked regardless of AI goals.

## Dependencies & Tags
- **Components used:**  
  - `locomotor` — accessed via `self.inst.components.locomotor:Stop()` to halt movement.
- **Tags:**  
  - None identified.

## Properties
| Property  | Type     | Default Value | Description |
|-----------|----------|---------------|-------------|
| `inst`    | `Entity` | `nil`         | The entity instance this behaviour belongs to. |
| `startfn` | `function?` | `nil`       | Optional callback invoked on entry to determine if standing still should begin. Takes `inst` as argument and returns a `boolean`. |
| `keepfn`  | `function?` | `nil`       | Optional callback invoked periodically while running to determine if the entity should continue standing still. Takes `inst` as argument and returns a `boolean`. |

## Main Functions
### `StandStill:Visit()`
* **Description:** Core execution method called by the behaviour tree manager on each tick. Handles transitions between `READY`, `RUNNING`, and `FAILED` states. Checks `startfn`/`keepfn` conditions and ensures `locomotor:Stop()` is called at appropriate times.
* **Parameters:** None.
* **Returns:** `nil`.

## Events & Listeners
- None.