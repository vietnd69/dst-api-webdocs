---
id: expertsailor
title: Expertsailor
description: Controls configuration values that modify boat sailing physics and anchor behavior for a boat entity.
tags: [boat, physics, sailing, vehicle]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6815d302
system_scope: entity
---

# Expertsailor

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Expertsailor` is a configuration component attached to boat entities that stores and exposes numeric parameters affecting rowing force, maximum velocity, anchor raising speed, and sail strength. It does not implement logic itself but acts as a data container for boat-related sailing behaviors defined elsewhere (e.g., in the boat's state graph or locomotion systems). It is used to allow precise tuning of boat performance—particularly for expert or modified boat variants—without altering core logic.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("expertsailor")
inst.components.expertsailor:SetRowForceMultiplier(1.5)
inst.components.expertsailor:SetRowExtraMaxVelocity(2.0)
inst.components.expertsailor:SetAnchorRaisingSpeed(0.75)
inst.components.expertsailor:SetLowerSailStrength(1.2)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `row_force_mult` | number | `1.0` | Multiplier applied to rowing force. |
| `extra_max_velocity` | number | `0.0` | Additional velocity cap added to maximum boat speed. |
| `anchor_raise_speed` | number | `1.0` | Multiplier affecting how quickly the anchor is raised. |
| `lower_sail_strength` | number | `1.0` | Strength modifier applied when lowering or using sails. |

## Main functions
### `GetRowForceMultiplier()`
* **Description:** Returns the current row force multiplier used when rowing the boat.
* **Parameters:** None.
* **Returns:** `number` — the row force multiplier.

### `SetRowForceMultiplier(force)`
* **Description:** Sets the row force multiplier for the boat.
* **Parameters:** `force` (number) — the multiplier to apply to rowing force.
* **Returns:** Nothing.

### `GetRowExtraMaxVelocity()`
* **Description:** Returns the extra velocity bonus added to the boat’s maximum speed.
* **Parameters:** None.
* **Returns:** `number` — the extra maximum velocity.

### `SetRowExtraMaxVelocity(vel)`
* **Description:** Sets the extra maximum velocity for the boat.
* **Parameters:** `vel` (number) — the speed bonus to add to the base max velocity.
* **Returns:** Nothing.

### `GetAnchorRaisingSpeed()`
* **Description:** Returns the multiplier applied to anchor raising speed.
* **Parameters:** None.
* **Returns:** `number` — the anchor raising speed multiplier.

### `SetAnchorRaisingSpeed(speed)`
* **Description:** Sets the anchor raising speed multiplier.
* **Parameters:** `speed` (number) — the multiplier for how fast the anchor is raised.
* **Returns:** Nothing.

### `GetLowerSailStrength()`
* **Description:** Returns the multiplier applied to sail strength when lowering sails.
* **Parameters:** None.
* **Returns:** `number` — the sail strength multiplier.

### `SetLowerSailStrength(strength)`
* **Description:** Sets the sail strength multiplier used when lowering sails.
* **Parameters:** `strength` (number) — the multiplier for sail strength.
* **Returns:** Nothing.

## Events & listeners
Not applicable.
