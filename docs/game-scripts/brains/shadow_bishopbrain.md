---
id: shadow_bishopbrain
title: Shadow Bishopbrain
description: Controls the AI behavior of the Shadow Bishop boss entity, handling movement, facing, taunting, and timed despawn logic.
tags: [ai, boss, combat, behavior]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: 6c793321
---

# Shadow Bishopbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The `Shadow_BishopBrain` component implements the behavior tree for the Shadow Bishop boss entity in DST. It manages high-level actions including chasing and attacking when appropriate, maintaining orientation toward a target (player), periodically taunting, and automatically triggering a despawn event after a fixed duration. The component depends on the `combat` and `health` components to determine target validity, cooldown state, and combat readiness.

## Usage example

```lua
inst:AddBrain("Shadow_BishopBrain")
inst.components.combat:SetUpTargetLogic(nil, true)
inst:AddTag("shadowboss")
```

## Dependencies & tags
**Components used:** `combat`, `health`
**Tags:** `shadowboss` (implied from context; no explicit tag management in this file)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_shouldchase` | `boolean` | `false` | Internal cache of the chase decision state, updated by `ShouldChase` to prevent oscillation. |

## Main functions
### `Shadow_BishopBrain:OnStart()`
* **Description:** Initializes and assigns the behavior tree (BT) root node. Sets up priority-based task execution including chase/attack, face-target with taunt loop, and a timed despawn sequence paired with wandering.
* **Parameters:** None.
* **Returns:** `nil`.
* **Error states:** None documented; assumes all required components and tags are present on `self.inst`.

### `ShouldChase(self)`
* **Description:** Determines whether the Shadow Bishop should enter the chase state based on the combat status and target distance. Evaluates if there is no current target, if the attack cooldown has expired, or if the target has moved too far beyond the attack range.
* **Parameters:**
  * `self` — The `Shadow_BishopBrain` instance.
* **Returns:** `boolean` — `true` if the entity should chase; `false` otherwise.
* **Error states:** May return inconsistent values if called concurrently with rapid state changes (uses cached `_shouldchase` value to mitigate flickering).

### `GetFaceTargetFn(inst)`
* **Description:** Helper function to identify the current face target. Prefers the entity's assigned combat target; otherwise searches for the nearest player within a specified distance.
* **Parameters:**
  * `inst` — The entity instance.
* **Returns:** `entity?` — A valid target entity or `nil` if none found or target is invalid (`notarget`, `playerghost`, or missing).
* **Error states:** Returns `nil` if `FindClosestPlayerToInst` returns `nil`, or if the target entity lacks a `health` component or is tagged `notarget`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Validates whether the current face target remains valid for face alignment. Ensures the target is alive, has a `health` component, is not a ghost, not tagged `notarget`, and is within the keep-face distance.
* **Parameters:**
  * `inst` — The entity instance.
  * `target` — The candidate target entity.
* **Returns:** `boolean` — `true` if target remains valid; `false` otherwise.
* **Error states:** Returns `false` if `target.components.health` is missing or `target:HasTag("playerghost")` is true.

## Events & listeners
- **Listens to:** None.
- **Pushes:** `"despawn"` — Fired when the timed despawn sequence completes (`TUNING.SHADOW_CHESSPIECE_DESPAWN_TIME` seconds after behavior tree starts).