---
id: dpstracker
title: DpsTracker
description: Tracks damage per second (DPS) by monitoring health changes over a sliding time window.
tags: [combat, tracking, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: c3996e98
system_scope: combat
---

# DpsTracker

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`DpsTracker` calculates and maintains the current damage per second (DPS) for an entity by recording health values at timestamps in a circular buffer. It listens for `healthdelta` events to update its internal state and computes DPS based on the health loss over a configurable time window (default 2 seconds). It interacts directly with the `health` component to access current health values and can notify external code of updates via a custom callback.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("dpstracker")
inst.components.dpstracker:SetOnDpsUpdateFn(function(entity, dps)
    print(entity.prefab .. " DPS:", dps)
end)
```

## Dependencies & tags
**Components used:** `health`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `max_size` | number | `100` | Maximum number of entries in the ring buffer. |
| `max_window` | number | `2` | Time window (in seconds) over which DPS is calculated. |
| `dps` | number | `0` | Current DPS value. |
| `tbl` | table | `{}` | Ring buffer storing timestamped health entries. |
| `i0` | number | `1` | Head index of the ring buffer. |
| `sz` | number | `0` | Current number of valid entries in the buffer. |
| `ondpsupdatefn` | function or nil | `nil` | Optional callback invoked on DPS update: `fn(inst, dps)`. |

## Main functions
### `DoUpdate()`
* **Description:** Updates the DPS calculation using the current health and the ring buffer. Removes outdated entries and computes DPS as `(health_loss) / (time_window)`.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** If the computed time delta `dt` is zero or negative, it defaults to `max_window` to avoid division by zero.

### `SetOnDpsUpdateFn(fn)`
* **Description:** Sets a callback function to invoke whenever DPS is updated (i.e., after `DoUpdate` runs).
* **Parameters:** `fn` (function or nil) — callback expecting two arguments: `(inst, dps)`.
* **Returns:** Nothing.

### `GetDps()`
* **Description:** Returns the most recently calculated DPS value.
* **Parameters:** None.
* **Returns:** number — current DPS.

## Events & listeners
- **Listens to:** `healthdelta` — triggers `DoUpdate` when health changes.
- **Pushes:** None identified.

## Special behavior
- The ring buffer (`tbl`) stores entries as tables of the form `{t = timestamp, hp = currenthealth}`.
- The buffer wraps around when full (`max_size = 100`). If the oldest entry lies outside the `max_window` time frame, it is discarded.
- DPS is computed only when at least two valid entries exist in the window.
- If `healthdelta` events occur faster than the time step resolution (e.g., multiple events per frame), only one entry per timestamp `t = GetTime()` is retained; subsequent events with the same timestamp overwrite the existing entry.
