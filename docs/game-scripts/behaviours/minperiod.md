---
id: minperiod
title: Minperiod
description: Enforces a minimum time interval between successful executions of a child behaviour node in the AI decision tree.
tags: [ai, behaviour, cooldown]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviours
source_hash: 28fe2d1f
system_scope: brain
---

# Minperiod

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Minperiod` is a behaviour node decorator that wraps a single child behaviour to enforce a minimum time interval (cooldown) between successful executions. It extends `BehaviourNode` and is used in AI decision trees to prevent behaviours from firing too frequently — for example, to avoid repetitive movement or attacks. If the time elapsed since the last success is less than the configured `minperiod`, the node immediately fails without executing its child.

## Usage example
```lua
-- Wrap an attack behaviour with a 2-second minimum period
local attack_node = AttackNode(inst)
local throttled_attack = MinPeriod(inst, 2.0, false, attack_node)

-- In the AI brain's decision tree:
self.brain:AddNode(throttled_attack)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *none* | The entity that owns the behaviour tree context. |
| `minperiod` | number | *none* | Minimum required interval (in seconds) between successful child executions. |
| `lastsuccesstime` | number? | `GetTime()` (on init if not immediate) | Timestamp (from `GetTime()`) of the last successful child execution. Initialized lazily. |

## Main functions
### `Visit()`
*   **Description:** Evaluates the node. If the node is in `READY` status and insufficient time has passed since the last success, it sets status to `FAILED` and returns early. Otherwise, it visits the child node; if the child succeeds, it records the current time as the new `lastsuccesstime`.
*   **Parameters:** None.
*   **Returns:** Nothing (modifies internal state via `self.status`).
*   **Error states:** None. The node safely handles `nil` `lastsuccesstime` on first run.

### `DBString()`
*   **Description:** Returns a human-readable debug string describing the node's current state and remaining cooldown (if any). Used for behaviour tree visualization and debugging.
*   **Parameters:** None.
*   **Returns:** `string` — e.g., `"OK (min period is 2.00)"` or `"Waiting for 1.23 (min period is 2.00)"`.

## Events & listeners
None identified
