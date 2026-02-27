---
id: minperiod
title: Minperiod
description: Ensures that a child behaviour node executes no more frequently than a specified minimum time interval, acting as a rate-limiting decorator in behaviour trees.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: behaviour
system_scope: entity
source_hash: 28fe2d1f
---

# Minperiod

## Overview
`Minperiod` is a behaviour tree node that enforces a minimum time interval between successful executions of its child node. It functions as a decorator—wrapping a single child node—and prevents the child from succeeding more often than every `minperiod` seconds. This is commonly used to avoid excessive or redundant actions (e.g., preventing rapid-fire attacks or resource checks). It extends `BehaviourNode` and integrates with DST’s behaviour tree system by overriding `Visit()` and `DBString()` methods.

## Dependencies & Tags
- **Components used:** None identified.
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `minperiod` | `number` | (provided) | Minimum number of seconds required to elapse between successful executions of the child node. |
| `lastsuccesstime` | `number` or `nil` | `GetTime()` (if `immediate` is `false`) | Timestamp of the last successful completion of the child. Used to enforce the cooldown. Not set if `immediate` is `true`. |
| `inst` | `Entity` | (provided) | The entity instance that owns this behaviour node (inherited via `BehaviourNode`). |

## Main Functions

### `MinPeriod:Visit()`
* **Description:** Executes the child node and enforces the minimum period constraint. If the node is in `READY` status and the time since the last success is less than `minperiod`, it immediately fails without invoking the child. Otherwise, it delegates to the child; if the child succeeds, it updates `lastsuccesstime` to the current time.
* **Parameters:** None.
* **Returns:** `nil` (updates internal `self.status` and the child's status).

### `MinPeriod:DBString()`
* **Description:** Returns a human-readable diagnostic string for debugging the current state of the node (e.g., in the Behaviour Tree Debugger). Indicates whether the node is ready to succeed or waiting for the cooldown to expire.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"OK (min period is 2.00)"` or `"Waiting for 0.50 (min period is 2.00)"`.

## Events & Listeners
None.