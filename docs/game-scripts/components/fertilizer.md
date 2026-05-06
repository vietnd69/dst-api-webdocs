---
id: fertilizer
title: Fertilizer
description: Manages fertilizer properties and application logic for farm soil items.
tags: [farming, items, soil]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: components
source_hash: 2c28b4d1
system_scope: entity
---

# Fertilizer

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`Fertilizer` is a component attached to items used to enrich farm soil. It tracks nutrient values, soil cycles, and withered cycles to determine the effectiveness of the fertilizer when applied. The component handles usage counting via `finiteuses` and manages item removal or stack splitting upon application through `stackable`. It automatically adds the `fertilizer` tag upon initialization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fertilizer")

-- Set specific nutrient values (growth, water, season)
inst.components.fertilizer:SetNutrients(5, 2, 0)

-- Assign a callback for when fertilizer is applied
inst.components.fertilizer.onappliedfn = function(inst, final_use, doer, target)
    print("Fertilizer applied to target")
end

-- Simulate application logic
inst.components.fertilizer:OnApplied(ThePlayer, target_crop)
```

## Dependencies & tags
**Components used:**
- `finiteuses` -- checks remaining uses and decrements count during `OnApplied`
- `stackable` -- handles item removal or stack splitting when uses are exhausted

**Tags:**
- `fertilizer` -- added on initialization, removed in `OnRemoveFromEntity`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fertilizervalue` | number | `1` | General value multiplier for the fertilizer. |
| `soil_cycles` | number | `1` | Number of soil cycles this fertilizer supports. |
| `withered_cycles` | number | `1` | Number of withered cycles this fertilizer supports. |
| `fertilize_sound` | string | `"dontstarve/common/fertilize"` | Sound path played when fertilizer is applied. |
| `nutrients` | table | `{ 0, 0, 0 }` | Table containing nutrient values (growth, water, season). |
| `onappliedfn` | function | `nil` | Callback function triggered when fertilizer is applied. |

## Main functions
### `OnRemoveFromEntity()`
*   **Description:** Cleans up the component when removed from an entity by removing the `fertilizer` tag.
*   **Parameters:** None
*   **Returns:** None
*   **Error states:** None

### `SetHealingAmount(health)`
*   **Description:** Deprecated function. Previously used to set healing amount, now empty.
*   **Parameters:** `health` -- number value (ignored)
*   **Returns:** None
*   **Error states:** None

### `SetNutrients(nutrient1, nutrient2, nutrient3)`
*   **Description:** Sets the nutrient values for the fertilizer. Accepts either three individual numbers or a single table containing the values.
*   **Parameters:**
    - `nutrient1` -- number or table of nutrients
    - `nutrient2` -- number (ignored if nutrient1 is table)
    - `nutrient3` -- number (ignored if nutrient1 is table)
*   **Returns:** None
*   **Error states:** None

### `OnApplied(doer, target)`
*   **Description:** Executes the logic when fertilizer is applied to a target. Decrements uses via `finiteuses`, triggers `onappliedfn`, and removes the item if no uses remain.
*   **Parameters:**
    - `doer` -- entity applying the fertilizer
    - `target` -- entity receiving the fertilizer
*   **Returns:** None
*   **Error states:** None

### `Heal(target)`
*   **Description:** Deprecated function. Previously used to heal a target, now returns false.
*   **Parameters:** `target` -- entity to heal (ignored)
*   **Returns:** `false`
*   **Error states:** None

## Events & listeners
None.