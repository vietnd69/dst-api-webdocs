---
id: avoidlight
title: Avoidlight
description: Controls an entity's movement to avoid being in direct light by changing direction periodically or when transitioning between light and shadow.
tags: [ai, locomotion, lighting]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: ai
source_hash: 49248a7f
system_scope: locomotion
---

# Avoidlight

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Avoidlight` is a behaviour node used in DST's AI system to make entities avoid illuminated areas. It extends `BehaviourNode` and interacts with the `locomotor` component to control directional movement, and with `LightWatcher` (implicitly) to detect the current light angle. The entity alternates between waiting (stationary) and walking toward a calculated direction opposite to the light source, with added randomness to prevent overly predictable motion.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("lightwatcher")
inst:AddComponent("locomotor")
inst:AddBehaviourNode("avoidlight")
-- In stategraph or behaviour tree:
inst:DoTaskInTime(0, function() inst.behaviourtree:Start("avoidlight") end)
```

## Dependencies & tags
**Components used:** `locomotor`, `lightwatcher`, `physics`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` | The entity instance the behaviour operates on. |
| `waiting` | boolean | `false` | Whether the entity is currently in a waiting (stopped) phase. |
| `phasechangetime` | number | `0` | Timestamp at which the next phase (wait ↔ walk) transition is allowed. |
| `waittime` | number | *(unset)* | Absolute timestamp used only by the `Wait` method to schedule sleep. |
| `angle` | number | *(unset)* | Target direction (in degrees) for walking during a non-waiting phase. |

## Main functions
### `Wait(t)`
* **Description:** Sets a future time for `phasechangetime` and schedules a sleep interval of `t` seconds within the behaviour tree. Typically used to pause movement briefly before resuming.
* **Parameters:** `t` (number) — duration in seconds to wait.
* **Returns:** Nothing.
* **Error states:** Does not validate `t`; expects valid non-negative values.

### `PickNewAngle()`
* **Description:** Calculates a safe direction away from light by checking adjacent grid tiles for passability and selecting the angle with the largest angular separation from the current light source (or a random angle if no light is detected).
* **Parameters:** None.
* **Returns:** `number` — A direction angle (in degrees) optimized to avoid light, with ±45° randomness added.
* **Error states:** Returns `0` if no grid offsets are passable (e.g., fully surrounded).

### `Visit()`
* **Description:** Core logic executed each tick of the behaviour node. Alternates between a *waiting* state (calling `Stop` on the locomotor) and a *walking* state (calling `WalkInDirection` with an angle away from light), using timing and light-level checks to determine transitions.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Does not check whether `self.inst.components.locomotor` exists before calling methods — expects the component to be present.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.
