---
id: powerload
title: Powerload
description: Stores and manages a numeric power load value and idle state for an entity.
tags: [power, state, storage]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: e9c6d378
system_scope: entity
---

# Powerload

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Powerload` is a simple utility component that tracks a numeric `load` value (defaulting to `1`) and a boolean `isidle` flag. It provides methods to read, update, and inspect these values. It is designed to be lightweight and is typically attached to entities requiring power-level tracking.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("powerload")
inst.components.powerload:SetLoad(0.75, true)
print(inst.components.powerload:GetLoad()) -- 0.75
print(inst.components.powerload:IsIdle())  -- true
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type   | Default Value | Description                     |
|----------|--------|---------------|---------------------------------|
| `load`   | number | `1`           | Current power load value.       |
| `isidle` | boolean| `false`       | Whether the power load is idle. |

## Main functions
### `SetLoad(_load, idle)`
* **Description:** Updates the power load value and optionally sets the idle state.
* **Parameters:**
  * `_load` (number) — the new power load value.
  * `idle` (boolean, optional) — if `true`, marks the load as idle; defaults to `false` if omitted or not `true`.
* **Returns:** Nothing.

### `GetLoad()`
* **Description:** Returns the current power load value.
* **Parameters:** None.
* **Returns:** `number` — the stored `load` value.

### `IsIdle()`
* **Description:** Returns whether the power load is currently marked as idle.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if `isidle` is set; otherwise `false`.

## Events & listeners
None identified
