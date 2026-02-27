---
id: oceanfishingrod_replica
title: Oceanfishingrod Replica
description: Manages networked state and properties of an ocean fishing rod replica entity, including hook target, line tension, and cast distance.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 60ec6777
---

# Oceanfishingrod Replica

## Overview
This component encapsulates the replica-side state and logic for an ocean fishing rod entity in Don't Starve Together. It synchronizes and exposes key fishing rod properties—including the current hook target entity, line tension level, and maximum cast distance—via networked variables, and provides utility methods to query and update them.

## Dependencies & Tags
- Depends on `net_entity`, `net_tinybyte`, and `net_smallbyte` types (custom networking wrappers), indicating it is designed for client/server state synchronization.
- No explicit component dependencies or entity tags are added/removed by this component itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_target` | `net_entity` | `nil` | Networked reference to the current hook target entity (e.g., fish or item). |
| `_line_tension` | `net_tinybyte` | `0` | Networked line tension state, mapped to 0 (low), 1 (good), or 2 (high) based on tuning values. |
| `_max_cast_dist` | `net_smallbyte` | `0` | Networked maximum casting distance, clamped to 0–63. |

Note: `inst` is the owning entity passed to the constructor but is not a public property exposed via `self.inst` in the final object; it is used internally.

## Main Functions

### `GetTarget()`
* **Description:** Returns the current hook target entity if it exists and is valid; otherwise returns `nil`.
* **Parameters:** None.

### `_SetTarget(target)`
* **Description:** Updates the networked `_target` value to the specified entity.
* **Parameters:**  
  `target` (entity or `nil`): The entity to set as the hook target.

### `_SetLineTension(line_tension)`
* **Description:** Maps the numeric line tension value to one of three discrete levels (0–2) using tuning thresholds, then updates the networked `_line_tension` variable.
* **Parameters:**  
  `line_tension` (number): Raw tension value used to compute the tension level.

### `IsLineTensionHigh()`
* **Description:** Returns `true` if the current line tension level is "high" (value 2).
* **Parameters:** None.

### `IsLineTensionGood()`
* **Description:** Returns `true` if the current line tension level is "good" (value 1).
* **Parameters:** None.

### `IsLineTensionLow()`
* **Description:** Returns `true` if the current line tension level is "low" (value 0).
* **Parameters:** None.

### `SetClientMaxCastDistance(dist)`
* **Description:** Sets the networked maximum cast distance, clamped to an integer via `math.floor`.
* **Parameters:**  
  `dist` (number): Desired maximum cast distance (typically units of tiles).

### `GetMaxCastDist()`
* **Description:** Returns the currently stored maximum cast distance.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string summarizing the target and line tension state.  
  *Note:* Contains a typo—calls `self:IsTensionHigh()` (undefined method) instead of `self:IsLineTensionHigh()`—and will throw an error at runtime.
* **Parameters:** None.

## Events & Listeners
None.