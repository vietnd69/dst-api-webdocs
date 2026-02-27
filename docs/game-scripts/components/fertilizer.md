---
id: fertilizer
title: Fertilizer
description: Applies nutrients to soil and is consumed upon use, optionally triggering a callback and removing itself when depleted.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: d755912a
---

# Fertilizer

## Overview
The `Fertilizer` component represents a reusable or single-use item that can be applied to soil to provide nutrients. It tracks nutrient values, a use count (via the `finiteuses` component), and supports a custom callback (`onappliedfn`) upon application. When fully consumed (or when no further uses remain), it removes itself from the world.

## Dependencies & Tags
- Adds tag `"fertilizer"` on instantiation.
- On removal from entity, removes tag `"heal_fertilize"` (deprecated, likely legacy cleanup).
- Relies on optional presence of `finiteuses` component to manage usage count.
- Relies on optional presence of `stackable` component to handle stack removal.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fertilizervalue` | `number` | `1` | Placeholder — not actively used in current implementation. |
| `soil_cycles` | `number` | `1` | Placeholder — not actively used in current implementation. |
| `withered_cycles` | `number` | `1` | Placeholder — not actively used in current implementation. |
| `fertilize_sound` | `string` | `"dontstarve/common/fertilize"` | Sound path used for fertilizer application (not called in this component; likely used elsewhere). |
| `nutrients` | `table<number>` | `{0, 0, 0}` | Array of three nutrient values (e.g., N, P, K), set via `SetNutrients`. |

## Main Functions
### `SetNutrients(nutrient1, nutrient2, nutrient3)`  
**OR**  
### `SetNutrients(nutrients_table)`  
* **Description:** Sets the `nutrients` array. Accepts either three separate numeric arguments or a single table of three numbers.  
* **Parameters:**  
  - `nutrient1`, `nutrient2`, `nutrient3`: Numeric values for the three nutrient types (if passed as separate args).  
  - `nutrient1` (as table): A 3-element numeric table (e.g., `{10, 20, 30}`).  

### `OnApplied(doer, target)`  
* **Description:** Handles fertilizer consumption when applied to a target (typically soil). Decrements usage count via `finiteuses` (if present), invokes optional callback (`onappliedfn`), and removes the item once exhausted.  
* **Parameters:**  
  - `doer`: The entity that applied the fertilizer (e.g., player).  
  - `target`: The entity receiving the fertilizer (e.g., tilled soil plot).  

## Events & Listeners
None identified.