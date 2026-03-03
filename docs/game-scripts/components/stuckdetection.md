---
id: stuckdetection
title: Stuckdetection
description: Monitors an entity's positional movement to determine if it has become stuck for a specified duration.
tags: [locomotion, physics, ai]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 23570661
system_scope: locomotion
---
# Stuckdetection

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`StuckDetection` is a lightweight component that detects whether an entity is stationary (or nearly stationary) for a configurable amount of time. It tracks positional updates in the XZ plane and compares them against a minimum movement threshold (`STUCK_DIST_SQ = 0.0025`) to determine if the entity is stuck. It does not interact with other components and operates solely based on position data retrieved from the entity's `Transform` component.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("stuckdetection")
inst.components.stuckdetection:SetTimeToStuck(1.5)

if inst.components.stuckdetection:IsStuck() then
    print("Entity is stuck!")
end

print("Remaining time until stuck:", inst.components.stuckdetection:GetRemainingTime())
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity that owns this component (set automatically). |
| `timetostuck` | number | `2` | The duration (in seconds) of immobility required before the entity is considered stuck. |
| `starttime` | number? | `nil` | Timestamp when the last significant position change was recorded (internal use). |
| `lastx`, `lastz` | number? | `nil` | Last known world X and Z coordinates of the entity (internal use). |

## Main functions
### `SetTimeToStuck(t)`
* **Description:** Sets the time threshold (in seconds) the entity must remain stationary before being considered stuck.
* **Parameters:** `t` (number) — required stuck duration in seconds. Must be non-negative; values less than `0` are not explicitly validated.
* **Returns:** Nothing.

### `IsStuck()`
* **Description:** Checks whether the entity has been immobile for longer than `timetostuck`. Updates internal tracking state on each call.
* **Parameters:** None.
* **Returns:** `true` if the entity has been immobile for more than `timetostuck` seconds; otherwise `false`.
* **Error states:** Returns `false` on first call if `starttime` is `nil` (initialization pending first movement).也可能 return `false` if the entity has moved beyond `STUCK_DIST_SQ` since the last update.

### `GetRemainingTime()`
* **Description:** Returns how much time remains until the entity reaches the stuck threshold. Useful for UI or predictive logic.
* **Parameters:** None.
* **Returns:** A number representing the time (in seconds) until the entity is considered stuck, or `-1` if no tracking has started yet (`starttime == nil`).

### `Reset()`
* **Description:** Resets the stuck timer by updating the last known position and `starttime` to the current frame. Only takes effect if `starttime` is not `nil` (i.e., after at least one position update).
* **Parameters:** None.
* **Returns:** Nothing.

## Events & listeners
None identified
