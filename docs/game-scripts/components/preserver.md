---
id: preserver
title: Preserver
description: Controls how perish and temperature decay rates are multiplied for an entity's items or contents.
tags: [inventory, decay, utilities]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2d5c1697
system_scope: entity
---

# Preserver

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Preserver` is a utility component that allows an entity to modify the rate at which items it contains or owns decay due to perish or temperature effects. It does not directly control decay itself, but exposes configurable multipliers used by other systems (e.g., the `itemspawner` or inventory decay logic). It supports both static and dynamic (function-based) multiplier values via `FunctionOrValue`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("preserver")
inst.components.preserver:SetPerishRateMultiplier(0.5)
inst.components.preserver:SetTemperatureRateMultiplier(2.0)
-- Later, a decay system may call:
local multiplier = inst.components.preserver:GetPerishRateMultiplier(item)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `perish_rate_multiplier` | number or function | `1` | Multiplier applied to the base perish rate. Can be a constant or a function `fn(inst, item) -> number`. |
| `temperature_rate_multiplier` | number or function | `1` | Multiplier applied to the base temperature decay rate. Can be a constant or a function `fn(inst, item) -> number`. |

## Main functions
### `SetPerishRateMultiplier(rate)`
* **Description:** Sets the multiplier used when computing perish decay rate for items associated with the entity. Accepts either a number or a function.
* **Parameters:** `rate` (number or function) — the new multiplier.
* **Returns:** Nothing.

### `GetPerishRateMultiplier(item)`
* **Description:** Returns the current perish rate multiplier, resolving it if it is a function.
* **Parameters:** `item` (entity) — the item for which the multiplier is being requested (passed to the function if `perish_rate_multiplier` is a function).
* **Returns:** number — the resolved multiplier, or `1` if resolution returns `nil`.
* **Error states:** Returns `1` if `FunctionOrValue` yields `nil` (e.g., function returns `nil`).

### `SetTemperatureRateMultiplier(rate)`
* **Description:** Sets the multiplier used when computing temperature decay rate for items associated with the entity.
* **Parameters:** `rate` (number or function) — the new multiplier.
* **Returns:** Nothing.

### `GetTemperatureRateMultiplier(item)`
* **Description:** Returns the current temperature rate multiplier, resolving it if it is a function.
* **Parameters:** `item` (entity) — the item for which the multiplier is being requested (passed to the function if `temperature_rate_multiplier` is a function).
* **Returns:** number — the resolved multiplier, or `1` if resolution returns `nil`.
* **Error states:** Returns `1` if `FunctionOrValue` yields `nil`.

### `GetDebugString()`
* **Description:** Returns a human-readable string summarizing the current multiplier configuration, useful for debugging.
* **Parameters:** None.
* **Returns:** string — formatted as `"PerishRate: X, TemperatureRate: Y"`, where `X`/`Y` are either `"FN"` (function), a numeric string, or `"1"` if `nil`.

## Events & listeners
None identified
