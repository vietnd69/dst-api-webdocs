---
id: panic
title: Panic
description: Causes an entity to move in a random direction repeatedly with brief pauses, simulating a panic-flee behavior.
tags: [ai, locomotion, behaviour]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviours
source_hash: f52d2d23
system_scope: locomotion
---

# Panic

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Panic` is a behaviour node that implements a simple flee-or-scare reaction: the entity moves in a randomly chosen direction, pauses briefly, then picks a new direction and repeats. It extends `BehaviourNode` and integrates into the DST behaviour tree system, primarily for use by passive or non-combat creatures during high-stress events (e.g., lightning strikes, predator encounters). It directly consumes the `locomotor` component to drive motion.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("locomotor")
inst:AddComponent("behaviourtree")
inst.components.behaviourtree:PushNode("panic")
```

## Dependencies & tags
**Components used:** `locomotor`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `waittime` | number | `0` | Timestamp when the current movement phase ends and a new direction will be selected. |

## Main functions
### `Visit()`
* **Description:** The core behaviour node callback executed each tick. On first visit (`status == READY`), it immediately selects a new direction and enters `RUNNING` state. On subsequent ticks, it waits until `waittime` has passed before selecting a new direction, and then pauses via `Sleep`.
* **Parameters:** None.
* **Returns:** Nothing.

### `PickNewDirection()`
* **Description:** Sets a new random movement direction (0–360 degrees) and schedules the next direction change ~0.25–0.5 seconds in the future.
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
- **Pushes:** None.  
  (Note: The `locomotor:RunInDirection` call internally fires a `locomote` event on the entity, but `Panic` itself does not fire custom events.)
