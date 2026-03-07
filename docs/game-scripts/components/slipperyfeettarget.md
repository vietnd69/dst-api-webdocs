---
id: slipperyfeettarget
title: Slipperyfeettarget
description: Marks an entity as a target location where slippery surface effects can be evaluated.
tags: [physics, environment, slippery]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 0d105353
system_scope: physics
---
# Slipperyfeettarget

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Slipperyfeettarget` is a lightweight component that marks an entity as a point of interest for slippery surface logic. It allows other systems (e.g., character locomotion or environment effects) to query whether the entity is "slippery at feet" (i.e., at a given position relative to the entity) and to retrieve a slip rate multiplier. It does not implement physics itself, but provides callback hooks (`isslipperyatfeetfn`, `ratefn`) for customizable behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("slipperyfeettarget")

-- Set a custom function to determine slipperiness at a point
inst.components.slipperyfeettarget:SetIsSlipperyAtPoint(function(ent, x, y, z)
    -- Custom logic: e.g., only slippery if entity has a specific tag
    return ent:HasTag("icy")
end)

-- Set a custom rate function (e.g., based on target state)
inst.components.slipperyfeettarget:SetSlipperyRate(function(ent, target)
    return target.components.locomotor and target.components.locomotor.isrunning and 1.5 or 1.0
end)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `"slipperyfeettarget"` on component creation; removes it on removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `isslipperyatfeetfn` | function or `nil` | `nil` | Optional callback: `fn(inst, x, y, z) → boolean` to determine slipperiness at a world point. |
| `ratefn` | function or `nil` | `nil` | Optional callback: `fn(inst, target) → number` to compute the slip rate multiplier for a given target. |

## Main functions
### `SetIsSlipperyAtPoint(fn)`
*   **Description:** Assigns a custom function to determine whether the target is slippery at a specified world point.
*   **Parameters:** `fn` (function or `nil`) - function taking `(entity, x, y, z)` and returning `true`/`false`.
*   **Returns:** Nothing.

### `IsSlipperyAtPosition(x, y, z)`
*   **Description:** Determines if the target is slippery at the given world coordinates. Uses the custom callback if set; otherwise falls back to a default check based on the entity's physics radius.
*   **Parameters:**
    *   `x` (number) - X coordinate in world space.
    *   `y` (number) - Y coordinate (currently unused in fallback).
    *   `z` (number) - Z coordinate in world space.
*   **Returns:** `boolean` — `true` if the target is considered slippery at `(x, z)` (within radius), `false` otherwise.
*   **Error states:** Returns `false` if no custom callback is set *and* the entity has no `Physics` component.

### `SetSlipperyRate(fn)`
*   **Description:** Assigns a custom function to compute the slip rate multiplier for a given target entity.
*   **Parameters:** `fn` (function or `nil`) - function taking `(entity, target)` and returning a number (typically `>= 1.0`).
*   **Returns:** Nothing.

### `GetSlipperyRate(target)`
*   **Description:** Computes the slip rate multiplier for the provided target entity.
*   **Parameters:** `target` (Entity) — the entity moving over the target location.
*   **Returns:** `number` — the slip rate (e.g., `1.5` for higher slip). If no custom rate function is set, returns `1`.
*   **Error states:** None — always returns a numeric value.

## Events & listeners
*   **Listens to:** None identified  
*   **Pushes:** None identified
