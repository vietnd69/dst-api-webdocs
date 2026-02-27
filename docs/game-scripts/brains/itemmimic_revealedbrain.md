---
id: itemmimic_revealedbrain
title: Itemmimic Revealedbrain
description: Controls the behavior of a revealed ItemMimic entity, implementing a behavior tree that avoids players, seeks mimicable targets, and enters mimicry mode.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: fd2bb287
---

# Itemmimic Revealedbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This component defines the brain logic for a revealed `ItemMimic` entity. It inherits from `Brain` and constructs a behavior tree (`self.bt`) that orchestrates AI decision-making. The core responsibilities include avoiding nearby players via the `RunAway` behavior, periodically scanning for valid mimicable entities within range, initiating mimicry via a `NUZZLE` action, and pausing mimicry attempts during or after mimicry. The behavior tree prioritizes escape over mimicry when players are close, then scans for targets during safe periods, and defaults to wandering.

## Dependencies & Tags
- **Components used:** `inst.components.locomotor`, `inst.components.timer`
- **Tags:** This component does not directly add or remove tags on `self.inst`; however, it references `itemmimic_data.MUST_TAGS` and `itemmimic_data.CANT_TAGS` to filter candidate entities for mimicry.
- **External references:** `behaviours/runaway`, `prefabs/itemmimic_data`, and `TheSim:FindEntities`.

## Properties
The constructor initializes no custom properties directly. However, the following internal state variables are used across methods:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `UPDATE_RATE` | number | `0.5` | Interval (in seconds) at which the behavior tree root node re-evaluates its children. |
| `AVOID_PLAYER_DIST` | number | `4.0` | Distance threshold (in units) to trigger avoidance behaviors. |
| `AVOID_PLAYER_STOP` | number | `6.0` | Distance (in units) at which avoidance behaviors cease. |
| `_mimicry_queued` | boolean | `false` | Indicates whether a mimicry action is pending or in progress. Set during action setup and cleared on success or failure. |
| `_try_mimic_task` | Task or `nil` | `nil` | A delayed task scheduled to initiate mimicry after a delay; cancelled on valid mimicry trigger or when a mimicry blocker timer is active. |

> Note: `inst._mimicry_queued` and `inst._try_mimic_task` are stored on the entity instance, not as explicit properties of the component class.

## Main Functions
### `ItemMimic_RevealedBrain:OnStart()`
* **Description:** Initializes the behavior tree by constructing a hierarchical `PriorityNode` and assigning it to `self.bt`. The tree structure enforces priority: (1) avoid players immediately after spawn, (2) flee from players if nearby, (3) scan for mimicable entities, (4) block mimicry attempts during action, and (5) wander otherwise.
* **Parameters:** None.
* **Returns:** `nil`.

## Events & Listeners
- **Pushes:**
  - `"eye_up"`: Fired when a potential mimicable entity is detected and the `initiate_mimicry` delay task is scheduled. Indicates the entity is "looking" for something to mimic.
  - `"eye_down"`: Fired when a mimicry attempt fails (e.g., no valid target found during the delay or target becomes invalid). Resets the "looking" state.
  - `"bufferedcastaoe"`: May be pushed via `inst:PushEvent` in `LocoMotor:PushAction` when a buffered `CastsAOE` action succeeds (indirectly relevant; used by mimicry action logic).
  - `"actionfailed"`: Pushed on the instance when the `NUZZLE` action fails (e.g., out of range); handled externally if listeners exist.

> Note: This component does not register any listeners via `inst:ListenForEvent`. Event handling is implicit in external state graph transitions (e.g., `"eye_up"` and `"eye_down"` may drive visual states in the state graph).