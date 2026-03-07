---
id: mermcandidate
title: Mermcandidate
description: Tracks calorie consumption to determine if a merm should transform into a stronger variant.
tags: [entity, lifecycle, merm]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 089fa9e7
system_scope: entity
---

# Mermcandidate

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MermCandidate` is an entity component that accumulates calories from consumed food items. It determines whether a merm entity should undergo a transformation (e.g., into a Merm Guard) based on a threshold of accumulated calories. This component is used to implement the mechanic where certain merms grow stronger by eating — specifically, it integrates with the `edible` component to quantify the nutritional value of eaten food.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("mermcandidate")

-- Simulate eating food
local food = ...
inst.components.mermcandidate:AddCalories(food)

-- Check if transformation is triggered
if inst.components.mermcandidate:ShouldTransform() then
    -- Proceed with transformation logic
    inst.components.mermcandidate:ResetCalories()
end
```

## Dependencies & tags
**Components used:** `edible` (read via `food.components.edible:GetHunger`)  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `calories` | number | `0` | Total calories accumulated from eaten food. |
| `transformation_calories` | number | `50` | Minimum calories required to trigger transformation. |

## Main functions
### `AddCalories(food)`
* **Description:** Adds nutritional value from the given food item to the current calorie count. Only processes food with an `edible` component.
* **Parameters:** `food` (Entity) — The food item being consumed.
* **Returns:** Nothing.
* **Error states:** Silently ignores food without an `edible` component.

### `ResetCalories()`
* **Description:** Resets the calorie counter to zero, typically after a successful transformation.
* **Parameters:** None.
* **Returns:** Nothing.

### `ShouldTransform()`
* **Description:** Returns whether the accumulated calories meet or exceed the transformation threshold.
* **Parameters:** None.
* **Returns:** `true` if `calories >= transformation_calories`, otherwise `false`.

### `OnSave()`
* **Description:** Returns the component's state for persistence.
* **Parameters:** None.
* **Returns:** Table containing `calories` and `transformation_calories`.

### `OnLoad(data)`
* **Description:** Restores the component's state from saved data.
* **Parameters:** `data` (table) — Table with optional `calories` and `transformation_calories` keys.
* **Returns:** Nothing.

## Events & listeners
None identified.
