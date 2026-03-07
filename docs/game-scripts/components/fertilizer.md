---
id: fertilizer
title: Fertilizer
description: Stores nutrient data and handles application logic for fertilizer items, including usage consumption and cleanup upon depletion.
tags: [inventory, crafting, environment, interaction]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: d755912a
system_scope: inventory
---

# Fertilizer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Fertilizer` is a lightweight component that encapsulates fertilizer-specific metadata—namely nutrient values and application behavior—for entities representing fertilizer items (e.g., Bone Meal, Compost). It integrates with the `finiteuses` and `stackable` components to handle usage depletion and item removal, and it signals application via a customizable callback (`onappliedfn`). The component also marks the entity with the `fertilizer` tag upon initialization.

## Usage example
```lua
local inst = SpawnPrefab("bonemeal")
inst:AddComponent("fertilizer")
inst.components.fertilizer:SetNutrients(10, 5, 0)
inst.components.fertilizer.onappliedfn = function(fertilizer, is_final_use, doer, target)
    -- Custom logic on application, e.g., soil enrichment
    target.components.grower:Fertilize(fertilizer.components.fertilizer.nutrients)
end
```

## Dependencies & tags
**Components used:** `finiteuses`, `stackable`  
**Tags:** Adds `fertilizer` on construction; removes `heal_fertilize` on removal from entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fertilizervalue` | number | `1` | Legacy field; no longer used in current logic. |
| `soil_cycles` | number | `1` | Legacy field; no longer used in current logic. |
| `withered_cycles` | number | `1` | Legacy field; no longer used in current logic. |
| `fertilize_sound` | string | `"dontstarve/common/fertilize"` | Sound path used on application (not currently referenced in the component). |
| `nutrients` | table of three numbers | `{0, 0, 0}` | Nutrient composition: `{nitrogen, phosphorus, potassium}`. |
| `onappliedfn` | function or `nil` | `nil` | Optional callback invoked during `OnApplied()`. Signature: `(fertilizer, final_use, doer, target)`. |

## Main functions
### `SetNutrients(nutrient1, nutrient2, nutrient3)`
* **Description:** Sets the nutrient values for the fertilizer. Accepts either three separate numeric arguments or a single table containing three numbers.
* **Parameters:**  
  `nutrient1` (number or table) — First nutrient (nitrogen) or a table `{n1, n2, n3}`.  
  `nutrient2` (number, optional) — Second nutrient (phosphorus), only used when first argument is a number.  
  `nutrient3` (number, optional) — Third nutrient (potassium), only used when first argument is a number.  
* **Returns:** Nothing.

### `OnApplied(doer, target)`
* **Description:** Handles item consumption upon application. Decrements finite uses (if applicable), triggers a user-defined callback, and removes the item once depleted.
* **Parameters:**  
  `doer` (entity or `nil`) — The entity that applied the fertilizer.  
  `target` (entity or `nil`) — The target of the application (e.g., soil or plant).  
* **Returns:** Nothing.
* **Error states:**  
  - If `finiteuses` is absent, no usage decrement occurs.  
  - If `stackable` is absent, the entire `inst` is removed when depleted; otherwise, `stackable:Get():Remove()` is used to remove just the applied instance.

### `OnRemoveFromEntity()`
* **Description:** Cleanup method invoked when the component is removed from its entity. Removes the `heal_fertilize` tag if present.
* **Parameters:** None.
* **Returns:** Nothing.

### `SetHealingAmount(health)` — *Deprecated*
* **Description:** No-op placeholder for legacy healing functionality. No effect.
* **Parameters:** `health` (number) — Ignored.
* **Returns:** Nothing.

### `Heal(target)` — *Deprecated*
* **Description:** Always returns `false`. Legacy healing support, unused.
* **Parameters:** `target` (entity) — Ignored.
* **Returns:** `false`.

## Events & listeners
None identified.
