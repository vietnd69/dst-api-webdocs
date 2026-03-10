---
id: behaviourtree
title: Behaviourtree
description: Implements a behavior tree system for AI logic, providing core node types and execution control.
tags: [ai, behavior-tree, logic]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 5126e164
system_scope: brain
---

# Behaviourtree

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Behaviourtree` provides a behavior tree implementation for AI decision-making. It defines a hierarchy of node types (conditions, actions, decorators, composites) that execute in a tree structure. The `BT` class serves as the controller, managing updates, resets, and sleep timing. Nodes inherit from `BehaviourNode` or its subclasses (`ConditionNode`, `ActionNode`, `DecoratorNode`, `SelectorNode`, `SequenceNode`, `ParallelNode`, etc.) to define AI logic. It is typically integrated into entities with a `brain` component.

## Usage example
```lua
local root = SequenceNode{
    ConditionNode(function() return inst.components.health and inst.components.health:IsDead() end, "Is Dead?"),
    WaitNode(1),
    ActionNode(function() inst:DoTaskInstantly("die") end, "Die Now"),
}
local bt = BT(inst, root)
inst.components.brain:SetTree(bt)
```

## Dependencies & tags
**Components used:** None (standalone utility).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance owning the behavior tree. |
| `root` | `BehaviourNode` | `nil` | The root node of the behavior tree. |
| `forceupdate` | `boolean` | `false` | If `true`, forces the tree to update immediately regardless of sleep time. |

## Main functions
### `ForceUpdate()`
* **Description:** Forces the next `Update()` call to execute immediately, ignoring sleep timing.
* **Parameters:** None.
* **Returns:** Nothing.

### `Update()`
* **Description:** Executes one tick of the behavior tree: visits nodes, saves status, and steps execution. Resets `forceupdate` after completion.
* **Parameters:** None.
* **Returns:** Nothing.

### `Reset()`
* **Description:** Resets all nodes in the tree to `READY` status, clearing execution state.
* **Parameters:** None.
* **Returns:** Nothing.

### `Stop()`
* **Description:** Stops the tree, invoking `OnStop()` on nodes and recursively stopping child nodes.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetSleepTime()`
* **Description:** Returns the time (in seconds) until the next update is required. Returns `0` if `forceupdate` is true; otherwise, defers to the root node's sleep logic.
* **Parameters:** None.
* **Returns:** `number` or `nil` — sleep duration in seconds, or `nil` if no timing constraint applies.

### `__tostring()`
* **Description:** Returns a string representation of the entire behavior tree for debugging.
* **Parameters:** None.
* **Returns:** `string` — hierarchical tree view with node statuses and sleep times.

### `Visit()`
* **Description:** (Node method) Evaluates the node's condition or action and sets `status` to `SUCCESS`, `FAILED`, or `RUNNING`.
* **Parameters:** None.
* **Returns:** Nothing (modifies internal `self.status`).

### `Reset()`
* **Description:** (Node method) Resets the node to `READY` status and recursively resets children.
* **Parameters:** None.
* **Returns:** Nothing.

### `Step()`
* **Description:** (Node method) Handles recursive execution after `Visit()`, resetting nodes as needed and stepping children.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetTreeString(indent)`
* **Description:** (Node method) Returns a formatted multi-line string representation of the subtree rooted at this node.
* **Parameters:** `indent` (`string`, optional) — prefix for indentation (default: `""`).
* **Returns:** `string` — formatted tree view.

### `Sleep(t)`
* **Description:** (Node method) Sets a future wake time based on the current simulation time plus `t` seconds.
* **Parameters:** `t` (`number`) — duration to sleep in seconds.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
  - `EventNode` registers listeners via `inst:ListenForEvent(self.event, self.eventfn)` for its event type.
  - On event trigger, `EventNode` forces an immediate brain update (`inst.brain:ForceUpdate()`) and notifies parents (e.g., resets `PriorityNode` timing).
- **Pushes:** 
  - `EventNode`: No explicit events pushed; relies on `inst.brain:ForceUpdate()` to trigger re-evaluation.  
  *(No other components in this file push events.)*