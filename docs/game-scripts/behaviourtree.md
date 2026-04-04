---
id: behaviourtree
title: Behaviourtree
description: Implements a behavior tree system for AI entity decision-making and task execution.
tags: [ai, brain, behavior, entity]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 5126e164
system_scope: brain
---

# Behaviourtree

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`behaviourtree.lua` provides a complete behavior tree implementation for AI entities in Don't Starve Together. It defines a hierarchical node system where entities can make decisions, execute actions, wait for conditions, and respond to events. The `BT` class manages the tree lifecycle, while various node types (`ConditionNode`, `ActionNode`, `SequenceNode`, `SelectorNode`, etc.) compose the actual behavior logic. This system is foundational to the `brains/` directory where entity AI behaviors are defined.

## Usage example
```lua
local BT = require("behaviourtree")

local root = BT.SequenceNode({
    BT.ConditionNode(function() return inst.components.hunger:Percent() < 0.5 end, "Is Hungry"),
    BT.ActionNode(function() inst.components.locomotor:GoToFood() end, "Find Food")
})

local brain = BT.BT(inst, root)
brain:Update()
```

## Dependencies & tags
**Components used:** None directly (behavior trees are attached to entity `inst.brain` property)
**Tags:** None identified (tags are managed by specific brain implementations, not this core system)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.inst` | entity | `nil` | The entity instance that owns this behavior tree. |
| `self.root` | BehaviourNode | `nil` | The root node of the behavior tree. |
| `self.forceupdate` | boolean | `false` | Forces the tree to update on the next tick regardless of sleep time. |
| `self.status` | string | `READY` | Current execution status (`SUCCESS`, `FAILED`, `READY`, `RUNNING`). |
| `self.children` | table | `nil` | Array of child nodes for composite node types. |
| `self.nextupdatetime` | number | `nil` | Scheduled time for the next node update. |

## Main functions
### `BT(inst, root)`
*   **Description:** Constructor that creates a new behavior tree instance attached to an entity.
*   **Parameters:** `inst` (entity) - the entity owning this brain; `root` (BehaviourNode) - the root node of the tree.
*   **Returns:** New `BT` instance.

### `Update()`
*   **Description:** Executes one tick of the behavior tree, visiting nodes and processing their logic.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** May return early if tree is not properly initialized.

### `Reset()`
*   **Description:** Resets the entire tree to `READY` state, clearing all node progress.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Stop()`
*   **Description:** Halts tree execution and calls `OnStop()` on all nodes.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ForceUpdate()`
*   **Description:** Marks the tree to update on the next tick regardless of sleep timing.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetSleepTime()`
*   **Description:** Returns the time in seconds until the next tree update is needed.
*   **Parameters:** None.
*   **Returns:** `number` - seconds until next update, or `0` if forced update is pending.

### `BehaviourNode(name, children)`
*   **Description:** Base constructor for all behavior tree nodes.
*   **Parameters:** `name` (string) - node identifier; `children` (table) - optional child nodes.
*   **Returns:** New `BehaviourNode` instance.

### `ConditionNode(fn, name)`
*   **Description:** Creates a node that evaluates a condition function each visit.
*   **Parameters:** `fn` (function) - returns `true` for success; `name` (string) - node identifier.
*   **Returns:** New `ConditionNode` instance.

### `ActionNode(action, name)`
*   **Description:** Creates a node that executes an action function when visited.
*   **Parameters:** `action` (function) - the action to execute; `name` (string) - node identifier.
*   **Returns:** New `ActionNode` instance.

### `WaitNode(time)`
*   **Description:** Creates a node that waits for a specified duration before succeeding.
*   **Parameters:** `time` (number or function) - wait duration in seconds.
*   **Returns:** New `WaitNode` instance.

### `SequenceNode(children)`
*   **Description:** Creates a node that executes children in order until one fails or all succeed.
*   **Parameters:** `children` (table) - array of child nodes.
*   **Returns:** New `SequenceNode` instance.

### `SelectorNode(children)`
*   **Description:** Creates a node that tries children until one succeeds or all fail.
*   **Parameters:** `children` (table) - array of child nodes.
*   **Returns:** New `SelectorNode` instance.

### `PriorityNode(children, period, noscatter)`
*   **Description:** Creates a node that evaluates children with priority at regular intervals.
*   **Parameters:** `children` (table) - array of child nodes; `period` (number) - evaluation interval; `noscatter` (boolean) - disable random scatter.
*   **Returns:** New `PriorityNode` instance.

### `EventNode(inst, event, child, priority)`
*   **Description:** Creates a node that listens for an entity event and triggers child execution.
*   **Parameters:** `inst` (entity) - entity to listen on; `event` (string) - event name; `child` (BehaviourNode) - node to execute on event; `priority` (number) - event priority.
*   **Returns:** New `EventNode` instance.
*   **Error states:** Automatically unregisters event listener on `OnStop()`.

### `ParallelNode(children, name)`
*   **Description:** Creates a node that runs all children simultaneously.
*   **Parameters:** `children` (table) - array of child nodes; `name` (string) - optional node identifier.
*   **Returns:** New `ParallelNode` instance.

### `LoopNode(children, maxreps)`
*   **Description:** Creates a node that loops through children a specified number of times.
*   **Parameters:** `children` (table) - array of child nodes; `maxreps` (number) - maximum loop iterations.
*   **Returns:** New `LoopNode` instance.

### `RandomNode(children)`
*   **Description:** Creates a node that randomly selects and executes one child.
*   **Parameters:** `children` (table) - array of child nodes.
*   **Returns:** New `RandomNode` instance.

### `WhileNode(cond, name, node)`
*   **Description:** Helper function creating a parallel node with condition and action.
*   **Parameters:** `cond` (function) - condition checked every update; `name` (string) - node identifier; `node` (BehaviourNode) - action to execute.
*   **Returns:** `ParallelNode` instance.

### `IfNode(cond, name, node)`
*   **Description:** Helper function creating a sequence node with condition and action.
*   **Parameters:** `cond` (function) - condition checked once; `name` (string) - node identifier; `node` (BehaviourNode) - action to execute.
*   **Returns:** `SequenceNode` instance.

### `LatchNode(inst, latchduration, child)`
*   **Description:** Creates a node that only allows child execution after a duration has passed.
*   **Parameters:** `inst` (entity) - owning entity; `latchduration` (number or function) - latch time in seconds; `child` (BehaviourNode) - child to execute.
*   **Returns:** New `LatchNode` instance.

## Events & listeners
- **Listens to:** Dynamic events registered via `EventNode` - any entity event can be listened to by creating an `EventNode` with the event name.
- **Pushes:** None directly (behavior trees respond to events but do not push their own events).