---
id: stuckdetection
title: Stuckdetection
description: Monitors an entity's movement to determine if it has remained motionless for a specified duration.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 23570661
---

# StuckDetection

## Overview
This component tracks an entity's position over time to detect whether it has become "stuck"—i.e., remained within a very small spatial threshold (`0.05` world units RMS distance squared) for a configurable duration (`timetostuck`, defaulting to 2 seconds). It is typically used to trigger fallback behavior (e.g., repositioning or animations) when an entity fails to move despite expected motion.

## Dependencies & Tags
- **Dependencies**: Uses `self.inst.Transform:GetWorldPosition()` and `GetTime()` from the global time system.
- **Tags**: None added or removed.

## Properties
| Property       | Type   | Default Value | Description |
|----------------|--------|---------------|-------------|
| `timetostuck`  | number | `2`           | Time in seconds an entity must remain within `STUCK_DIST_SQ` (0.0025 units²) of its previous position to be considered "stuck". |
| `starttime`    | number \| nil | `nil`      | Internal: timestamp (via `GetTime()`) of the last movement event. Accessed only through component methods. |
| `lastx`, `lastz` | number \| nil | `nil`     | Internal: world X and Z coordinates of the last non-stuck position. Accessed only through component methods. |

> **Note**: The properties `starttime`, `lastx`, and `lastz` are initialized as `nil` implicitly (commented in source but initialized in logic) and are updated during `IsStuck()` calls.

## Main Functions

### `SetTimeToStuck(t)`
* **Description:** Sets the duration (in seconds) the entity must remain stationary to be considered stuck.
* **Parameters:**  
  `t` (number): New stuck threshold in seconds. Must be ≥ 0.

### `IsStuck()`
* **Description:** Checks whether the entity is currently stuck. Updates internal tracking state (position and timestamp) if significant movement is detected. Returns `true` if the entity has been stationary for ≥ `timetostuck` seconds.
* **Parameters:** None.

### `GetRemainingTime()`
* **Description:** Returns how much time remains before the entity will be considered stuck, based on current progress toward the threshold. Returns `-1` if no position tracking has started yet.
* **Parameters:** None.

### `Reset()`
* **Description:** Resets stuck tracking by updating `lastx`, `lastz`, and `starttime` to the current position and time. Should be called after repositioning the entity to prevent false positives.
* **Parameters:** None.

## Events & Listeners
- No events are emitted or listened for by this component.