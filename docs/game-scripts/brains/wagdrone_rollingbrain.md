---
id: wagdrone_rollingbrain
title: Wagdrone Rollingbrain
description: Controls the targeting and movement logic for the Wagdrone in rolling mode, managing locomotion, recoil correction, and work target selection within a deploy radius.
tags: [ai, locomotion, boss]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 5fd7562f
system_scope: brain
---

# Wagdrone Rollingbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`WagdroneRollingBrain` is a brain component that governs the behavior of the Wagdrone when in rolling mode. It manages target acquisition, destination computation, and locomotion adjustments—particularly handling recoil-induced angular deflection during rotation. The brain integrates with the `Locomotor` component to apply temporary speed modifiers during recoil recovery, and leverages `Workable` and `Health` components to validate nearby work targets and flying drones. It uses a behavior tree (`BT`) with custom state guards and decorators to respond to player pickup attempts and leash constraints.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst.components.brain:SetBrainClass("wagdrone_rollingbrain")
inst:AddComponent("locomotor")
inst:AddComponent("health")
inst:AddComponent("knowndynamiclocations")
inst.components.knowndynamiclocations:AddDynamicLocation("deploypoint", Vector3(0, 0, 0), true)
inst.components.brain:Start()
```

## Dependencies & tags
**Components used:** `health`, `knowndynamiclocations`, `locomotor`, `playercontroller`, `workable`  
**Tags:** Listens to events; no persistent tags added/removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | EntityScript or nil | `nil` | The current work target entity (a valid workable or drone). |
| `dest` | Vector3 | `Vector3()` | The computed destination position for the drone. |
| `recoildest` | Vector3 | `Vector3()` | The adjusted destination during recoil recovery. |
| `recoilangleoffset` | number or nil | `nil` | Angle offset (radians) between intended heading and actual heading during recoil. |
| `recoiltime` | number or nil | `nil` | Timestamp when recoil began (used for decay calculations). |
| `recoilspeedmult` | number | `1` | Current speed multiplier applied during recoil deceleration. |
| `recoilacceltime` | number or nil | `nil` | Timestamp when recoil acceleration phase began. |

## Main functions
### `UpdateTargetDest()`
*   **Description:** Recomputes the drone's destination and target based on deploy point, work radius, and nearby valid entities. Handles recoil timing to adjust the destination vector during angular correction.
*   **Parameters:** None.
*   **Returns:** `Vector3` or `nil` — the updated destination (`self.dest` or `self.recoildest` if recoil is active).
*   **Error states:** Returns `nil` if no valid target or destination can be computed; calls `ResetTargets()` on failure.

### `SetRecoilAngle(recoilangle)`
*   **Description:** Initiates recoil correction mode by computing the angular offset between the intended heading and `recoilangle`, and applying a deceleration multiplier via the `Locomotor`.
*   **Parameters:** `recoilangle` (number) — the measured recoil angle in degrees (converted internally to radians).
*   **Returns:** Nothing.
*   **Error states:** No-op if `self.target` is `nil` or destination vector is zero.

### `AccelAfterRecoil()`
*   **Description:** Applies a smooth acceleration curve during the recoil recovery phase, using `easing.inQuad`, then removes the recoil speed multiplier when complete.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `ResetTargets()`
*   **Description:** Clears the current target and recoil state, and removes any active recoil speed multiplier.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnStart()`
*   **Description:** Initializes the behavior tree root with guards for `persists`, `off` state tag, and player pickup attempts. Registers a listener for the `"spinning_recoil"` event to invoke `SetRecoilAngle`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnStop()`
*   **Description:** Cleans up resources: unregisters the recoil event listener, clears target/recoil state, and removes the recoil speed multiplier.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `"spinning_recoil"` — fired when the drone experiences angular deflection, triggering recoil correction.
- **Pushes:** None.
