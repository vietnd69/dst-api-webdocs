---
id: oasis
title: Oasis
description: Checks entity proximity to a circular oasis area and calculates proximity levels relative to its boundary.
tags: [world, environment, proximity]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 541db6d8
system_scope: environment
---

# Oasis

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Oasis` is a lightweight component that defines a circular area (the "oasis") centered on its owner entity. It provides utility methods to determine whether another entity is inside the oasis radius and to compute a smooth proximity level (from `0` to `1`) based on distance to the boundary. This is typically used for environmental effects or gameplay mechanics that trigger gradually as an entity approaches or enters the oasis zone.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("oasis")
inst:AddComponent("oasis")
-- Optionally customize radius
inst.components.oasis.radius = 5

local player = TheEntityFactory("waxwell")
if inst.components.oasis:IsEntityInOasis(player) then
    print("Player is inside the oasis")
end

local proximity = inst.components.oasis:GetProximityLevel(player, 2)
-- proximity is 1 inside, 0 outside, and linearly interpolated in between
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Checks for `oasis` tag on `self.inst` (implied via usage), but does not modify tags directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `radius` | number | `1` | Radius of the circular oasis area. Entities within this distance are considered inside. |

## Main functions
### `IsEntityInOasis(ent)`
*   **Description:** Determines whether the given entity is fully inside the oasis circle (i.e., distance ≤ `radius`).
*   **Parameters:** `ent` (Entity) - The entity to test.
*   **Returns:** `true` if the entity is inside or exactly on the boundary; otherwise `false`.

### `GetProximityLevel(ent, range)`
*   **Description:** Computes a normalized proximity value (`0` to `1`) indicating how close the entity is to the oasis boundary.  
    * `1`: at or within the oasis (`distance ≤ radius`)  
    * `0`: at or beyond `radius + range`  
    * Between: linear interpolation based on distance.
*   **Parameters:**  
    * `ent` (Entity) - The entity to measure proximity for.  
    * `range` (number) - The transition zone width beyond the oasis boundary over which proximity declines from `1` to `0`.
*   **Returns:** `number` between `0` and `1`, clamped to that range.
*   **Error states:** Returns `0` if `range ≤ 0` (since the transition zone becomes undefined).

## Events & listeners
None identified
