---
id: shadowthrall_centipede_brain
title: Shadowthrall Centipede Brain
description: Manages AI behavior for Shadowthrall Centipede segments, coordinating control negotiation, miasma consumption, and wandering.
tags: [ai, combat, entity, boss]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: dfc92d32
---

# Shadowthrall Centipede Brain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This brain component governs the behavior of individual segments in the Shadowthrall Centipede entity. It implements a behavior tree that orchestrates two primary modes: seeking and consuming miasma (which can trigger body growth) and wandering when not actively feeding. The brain participates in a segment-level control negotiation system where segments compete for control based on their current intent—eating miasma has higher priority than wandering. When a segment gains control, it executes its behavior tree; otherwise, it waits in a requesting state.

Key interactions include the `centipedebody` component (for control status and segment growth), `eater` (for identifying edible miasma clouds), `timer` (to track feeding cooldowns), and `knownlocations` (for home position, though currently unused).

## Usage example
Typically, this brain is automatically added and assigned to each Shadowthrall Centipede segment entity during prefab initialization. Modders should not need to instantiate it manually.

```lua
-- Not typically used directly by modders
-- The brain is attached automatically via the prefab's OnSpawn function:
inst:AddBrain("brains/shadowthrall_centipede_brain")
```

## Dependencies & tags
**Components used:**
- `centipedebody`: `SegmentHasControl()`, `GrowNewSegment()`
- `eater`: `CanEat()`, `GetEdibleTags()`
- `timer`: `TimerExists()`, `StartTimer()`

**Tags:**
- `shadowthrall_centipede` (used in `TestWanderPoint` for spatial queries)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `control_priority` | `integer` | `PRIORITY_BEHAVIOURS.WANDERING` | Priority level for control negotiation. Set to `EATING` when actively consuming miasma, otherwise `WANDERING`. |
| `miasma_counter` | `integer` | `0` | Tracks consecutive miasma consumed. Reset after growth or feeding delay. |
| `cached_rotation` | `number` | `nil` | Cached forward direction used to compute interaction angle for miasma. |
| `cached_forwardvector` | `Vector3` | `nil` | Cached forward vector (recomputed when rotation changes). |

## Main functions
The brain class itself does not expose public methods beyond the constructor. All logic resides in nested helper functions used within the behavior tree.

### `ShadowThrallCentipedeBrain:OnStart()`
* **Description:** Initializes the behavior tree. Sets up two major node groups: one for requesting control and one for executing behavior while in control. The root priority node decides between these based on whether the segment currently holds control.
* **Parameters:** None (part of the `Brain` class lifecycle).
* **Returns:** `nil`
* **Error states:** None. Relies on behavior tree infrastructure (`PriorityNode`, `WhileNode`, `ConditionNode`, `DoAction`, `Wander`) to manage transitions and execution.

### `CanInteractPosWithinAngle(inst, pos)`
* **Description:** Helper that determines if a target position lies within the centipede segment's forward-facing interaction cone.
* **Parameters:**
  - `inst` (`Entity`): The segment entity whose forward direction is used.
  - `pos` (`Vector3`): The target position to test.
* **Returns:** `boolean` — `true` if within `ANGLE_INTERACT_WIDTH` degrees of the segment's forward direction.
* **Error states:** None.

### `GetHome(inst)`
* **Description:** Provides the current position as the wandering home location. (The `spawnpoint` location lookup is commented out.)
* **Parameters:**
  - `inst` (`Entity`): The segment entity.
* **Returns:** `Vector3` — The segment's current position.
* **Error states:** None.

### `TestForMiasma(item, inst)`
* **Description:** Predicate used to filter valid miasma targets. Checks age, edibility, and angular proximity.
* **Parameters:**
  - `item` (`Entity`): Potential miasma cloud.
  - `inst` (`Entity`): The centipede segment.
* **Returns:** `boolean`
* **Error states:** Returns `false` if miasma is too new (`<1` second alive), not edible, or outside the interaction angle.

### `FindValidMiasma(inst)`
* **Description:** Scans nearby entities for a valid miasma target. Excludes miasma if the segment's current stategraph has the `"busy"` tag.
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `Entity?` — First valid miasma entity found, or `nil`.
* **Error states:** Returns `nil` if no valid miasma exists within range or if the segment is `"busy"`.

### `DoFindAndEatMiasmaAction(inst)`
* **Description:** Creates a buffered action to eat a target miasma. On success, increments the miasma counter and triggers segment growth when the threshold (`EAT_MIASMA_MAX`) is reached.
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `BufferedAction?` — Action if a target miasma exists, otherwise `nil`.
* **Error states:** Returns `nil` if no valid miasma target is found.

### `GetWanderDirection(inst)`
* **Description:** Generates a random wander direction within +/- 90 degrees of the segment's current facing.
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `number` — Angle in radians.
* **Error states:** None.

### `TestWanderPoint(pt)`
* **Description:** Validates a potential wander destination to prevent overcrowding and hazardous placement (holes, under overhangs).
* **Parameters:**
  - `pt` (`Vector3`).
* **Returns:** `boolean` — `true` if no other segment is within `2` units, not near a hole, and on land.
* **Error states:** None.

### `TakeControlToEat(inst)`
* **Description:** Requests control for eating. Sets priority to `EATING`.
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `boolean` — `true` if a valid miasma target is found (and request succeeds), otherwise `false`.
* **Error states:** None.

### `TakeControlToWander(inst)`
* **Description:** Requests control for wandering. Sets priority to `WANDERING`.
* **Parameters:**
  - `inst` (`Entity`).
* **Returns:** `boolean` — Always `true`.
* **Error states:** None.

## Events & listeners
None. This component does not register or fire any events.