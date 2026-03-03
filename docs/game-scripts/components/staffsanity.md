---
id: staffsanity
title: Staffsanity
description: Modifies the rate of sanity change when used as a staff-like item to cast abilities.
tags: [sanity, item, magic]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: a302ea3b
system_scope: entity
---

# Staffsanity

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Staffsanity` is a lightweight component that amplifies or dampens the sanity impact of casting actions performed by an entity using a staff-like item. It acts as a modifier layer over the `sanity` component, scaling the delta applied via `DoCastingDelta`. It does not manage sanity itself but delegates the actual sanity change to `components.sanity:DoDelta` after applying a configurable multiplier.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("staffsanity")
inst.components.staffsanity:SetMultiplier(2.0)  -- Doubles sanity impact of casting
-- Later, during a casting action:
inst.components.staffsanity:DoCastingDelta(-5)  -- Applies -10 sanity (5 * 2.0)
```

## Dependencies & tags
**Components used:** `sanity` (via `inst.components.sanity`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `multiplier` | number? | `nil` | Scalar applied to sanity delta. When `nil`, defaults to `1`. |

## Main functions
### `SetMultiplier(mult)`
*   **Description:** Sets the multiplier used to scale sanity changes in `DoCastingDelta`.
*   **Parameters:** `mult` (number) - multiplier factor. Pass `nil` or omit to disable scaling (uses `1`).
*   **Returns:** Nothing.

### `DoCastingDelta(amount)`
*   **Description:** Applies a sanity delta scaled by `multiplier`, delegating to `sanity:DoDelta`. Typically called during ability casting to reflect staff-specific sanity costs or benefits.
*   **Parameters:** `amount` (number) - base sanity delta before scaling.
*   **Returns:** Nothing.
*   **Error states:** Returns early with no effect if the parent entity lacks a `sanity` component.

## Events & listeners
None identified.
