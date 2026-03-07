---
id: oceanfishingrod_replica
title: Oceanfishingrod Replica
description: Manages networked state for the ocean fishing rod, including hook target, line tension level, and maximum cast distance.
tags: [fishing, network, equipment]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 60ec6777
system_scope: network
---

# Oceanfishingrod Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`OceanFishingRod` is a network-replicated component that tracks the state of an ocean fishing rod for synchronization between server and clients. It exposes properties such as the hook's target entity, line tension (categorized into low/medium/high levels), and the maximum cast distance. This component is intended to be attached to entities representing fishing rods in ocean environments and works in conjunction with the `net_entity`, `net_tinybyte`, and `net_smallbyte` types to ensure reliable replication.

## Usage example
```lua
local rod = CreateEntity()
rod:AddComponent("oceanfishingrod_replica")
rod.components.oceanfishingrod_replica:SetClientMaxCastDistance(30)
rod.components.oceanfishingrod_replica:_SetTarget(some_entity)
rod.components.oceanfishingrod_replica:_SetLineTension(2.5)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_target` | `net_entity` | `nil` | Network-replicated handle to the hook's target entity (e.g., a fish). |
| `_line_tension` | `net_tinybyte` | `0` | Networked tension state encoded as `0` (low), `1` (good), or `2` (high), based on tuning thresholds. |
| `_max_cast_dist` | `net_smallbyte` | `0` | Networked maximum cast distance, clamped to `[0, 63]` and stored as a small integer. |

## Main functions
### `GetTarget()`
* **Description:** Returns the currently assigned hook target if valid; otherwise `nil`.
* **Parameters:** None.
* **Returns:** `TheEntity` or `nil`.
* **Error states:** Returns `nil` if the stored entity reference is invalid or has been destroyed.

### `_SetTarget(target)`
* **Description:** Sets the networked hook target. Typically called by the server.
* **Parameters:** `target` (`TheEntity` or `nil`) — the entity currently hooked or `nil` if no hook.
* **Returns:** Nothing.

### `_SetLineTension(line_tension)`
* **Description:** Maps the raw line tension value to one of three discrete levels and updates the networked state.
* **Parameters:** `line_tension` (number) — raw tension value (e.g., float or integer).
* **Returns:** Nothing.
* **Error states:** Tension values are quantized using `TUNING.OCEAN_FISHING.LINE_TENSION_GOOD` and `TUNING.OCEAN_FISHING.LINE_TENSION_HIGH` thresholds; out-of-range or negative inputs are clamped to `0`.

### `IsLineTensionHigh()`
* **Description:** Checks whether tension is currently in the high category.
* **Parameters:** None.
* **Returns:** `true` or `false`.

### `IsLineTensionGood()`
* **Description:** Checks whether tension is currently in the good (medium) category.
* **Parameters:** None.
* **Returns:** `true` or `false`.

### `IsLineTensionLow()`
* **Description:** Checks whether tension is currently in the low category.
* **Parameters:** None.
* **Returns:** `true` or `false`.

### `SetClientMaxCastDistance(dist)`
* **Description:** Sets the maximum cast distance for the fishing rod, intended for client-side use (e.g., UI feedback).
* **Parameters:** `dist` (number) — maximum cast distance in world units.
* **Returns:** Nothing.

### `GetMaxCastDist()`
* **Description:** Retrieves the networked maximum cast distance.
* **Parameters:** None.
* **Returns:** `number` — stored cast distance (integer in `[0, 63]`).

### `GetDebugString()`
* **Description:** Returns a debug-friendly string representation of current state for logging or overlays.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"Target: Entity0123, Tension: High"`.

## Events & listeners
None identified
