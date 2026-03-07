---
id: leash
title: Leash
description: Controls entity movement to enforce a "leash" distance from a home point, guiding the entity toward home if it strays too far.
tags: [ai, locomotion, behavior]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: behaviours
source_hash: 36fb1960
system_scope: locomotion
---

# Leash

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Leash` is a behaviour node used in state-graph AI logic to restrict an entity’s movement within a specified radial distance from a home location. It integrates with the `locomotor` component to move the entity toward the home point when it exceeds the return distance, and stops movement if the entity is already within the leash boundary. It is typically used for entities that should not wander too far from a reference point (e.g., pets, mounts, or tethered creatures).

## Usage example
```lua
local homepos = Vector3(10, 0, 20)
local inst = CreateEntity()
inst:AddComponent("locomotor")

local leash = Leash(inst, homepos, 8, 4, false)
inst.sg:GoToState("idle", { leash = leash })
-- In the stategraph, call `leash:Visit()` periodically in the dofile
```

## Dependencies & tags
**Components used:** `locomotor`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `homepos` | function or Vector3 | `nil` | The home location (may be a static vector or a function taking `inst`). |
| `maxdist` | function or number | `nil` | Maximum leash radius (distance from home beyond which the entity is considered outside the leash). |
| `returndist` | function or number | `nil` | Radius within which the entity may stop moving and transition to `SUCCESS`. |
| `running` | function or boolean | `false` | Determines whether to run (`true`) or walk (`false`) when returning to home. |
| `inst` | Entity | `nil` | The entity instance the behaviour acts upon. |
| `status` | string | `READY` | Internal state (`READY`, `RUNNING`, `SUCCESS`, or `FAILED`). |

## Main functions
### `Visit()`
* **Description:** Executes the core logic of the behaviour node, evaluating the entity’s position relative to the home point and instructing the `locomotor` to move or stop accordingly.
* **Parameters:** None.
* **Returns:** None.
* **Error states:** If `GetHomePos()` returns `nil`, sets `status` to `FAILED`.

### `GetHomePos()`
* **Description:** Returns the resolved home position by calling `FunctionOrValue` on `self.homepos` with `self.inst`.
* **Parameters:** None.
* **Returns:** `Vector3` or `nil` — the home coordinates.

### `GetDistFromHomeSq()`
* **Description:** Computes the squared distance between the entity and home position.
* **Parameters:** None.
* **Returns:** `number` or `nil` — squared distance, or `nil` if home position is `nil`.

### `IsInsideLeash()`
* **Description:** Checks whether the entity is within the leash radius (`maxdist`).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if inside, `false` otherwise.

### `IsOutsideReturnDist()`
* **Description:** Checks whether the entity is beyond the return threshold (`returndist`).
* **Parameters:** None.
* **Returns:** `boolean` — `true` if outside the return radius, `false` otherwise.

### `DBString()`
* **Description:** Returns a debug string representation of the leash state, for logging or inspector display.
* **Parameters:** None.
* **Returns:** `string` — formatted as `"<homepos>, <distance>"`.

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.
