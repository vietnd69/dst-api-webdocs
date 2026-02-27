---
id: chesterbrain
title: Chesterbrain
description: Manages the behavior tree for Chester, controlling movement logic including following the player, wandering near home, facing targets, and reacting to environmental threats.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: d225140a
---

# Chesterbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
The `ChesterBrain` component implements the behavior tree for Chester, a boss entity in Don't Starve Together. It coordinates high-level movement and decision-making logic through a priority-based behavior tree. The component inherits from the base `Brain` class and initializes a set of hierarchical behaviors—including following the player (via `Follow`), wandering near the "home" location (via `Wander`), facing the leader (`FaceEntity`), and triggering panic responses to electric fences or environmental danger (`PanicTrigger`, `ElectricFencePanicTrigger`). It relies on the `follower` and `knownlocations` components to resolve dynamic targets and locations at runtime.

## Dependencies & Tags
- **Components used:** 
  - `follower` — used to retrieve the current leader via `GetLeader()`.
  - `knownlocations` — used to fetch the stored "home" location for wandering behavior.
- **Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (inherited from `Brain`) | The entity instance this brain controls. Passed via constructor. |
| `bt` | `BT` | `nil` (initialized in `OnStart`) | The behavior tree instance used to execute decision logic. Set during `OnStart`. |

## Main Functions
### `ChesterBrain:OnStart()`
* **Description:** Initializes the behavior tree root node with a prioritized sequence of behaviors. This method is called automatically when the brain becomes active.
* **Parameters:** None.
* **Returns:** `nil`.

### Behavior Tree Nodes (Internally Used)
The `OnStart` method constructs a `PriorityNode` root containing the following behaviors in order:
- `BrainCommon.PanicTrigger(self.inst)` — triggers panic if health is critically low.
- `BrainCommon.ElectricFencePanicTrigger(self.inst)` — triggers panic when near an active electric fence.
- `Follow(...)` — moves toward the leader (retrieved via `GetLeader`) within specified distance bounds.
- `FaceEntity(...)` — rotates the entity to face the current leader.
- `Wander(...)` — moves randomly within a radius around the "home" location if no higher-priority behavior is active.

## Events & Listeners
None identified.