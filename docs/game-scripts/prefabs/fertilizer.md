---
id: fertilizer
title: Fertilizer
description: Adds fertilizer behavior and soil interaction properties to an entity, including nutrient composition and usage tracking.
tags: [environment, crafting, soil]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 15aab507
system_scope: environment
---

# Fertilizer

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `fertilizer` component enables an entity to function as a fertilizer item in the game world. It is attached to fertilizer prefabs (like manure) to define their soil improvement effects, including nutrient content and how many soil cycles they affect. The component stores nutrient values and supports integration with soil farming mechanics via dependencies on the `fertilizerresearchable`, `finiteuses`, and `smotherer` components.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fertilizer")
inst.components.fertilizer:SetNutrients("nitrogen", "phosphorus", "potassium")
inst.components.fertilizer.fertilizervalue = 100
inst.components.fertilizer.soil_cycles = 5
```

## Dependencies & tags
**Components used:** None directly accessed via `inst.components.X` in this file (only *added* in `makefertilizer`).  
**Tags:** Adds `fertilizerresearchable` (externally), but **not** in this component itself.  
**Note:** This component is added via `inst:AddComponent("fertilizer")` in the `makefertilizer` function; the component's presence indicates this prefab functions as a fertilizer.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fertilizervalue` | number | *unset* | The strength of the fertilizer effect applied per use. |
| `soil_cycles` | number | *unset* | Number of soil cycles the fertilizer affects when applied. |
| `withered_cycles` | number | *unset* | Number of cycles the fertilizer extends to withered soil. |
| `nutrients` | table of 3 strings | *nil* | Ordered list of nutrient types: `[1] = primary, [2] = secondary, [3] = tertiary`. |

## Main functions
### `SetNutrients(primary, secondary, tertiary)`
*   **Description:** Sets the three nutrient types applied by this fertilizer.
*   **Parameters:**  
    `primary` (string) — Primary nutrient type (e.g., `"nitrogen"`).  
    `secondary` (string) — Secondary nutrient type.  
    `tertiary` (string) — Tertiary nutrient type.
*   **Returns:** Nothing.
*   **Error states:** No explicit validation; values are stored as-is.

## Events & listeners
None identified.