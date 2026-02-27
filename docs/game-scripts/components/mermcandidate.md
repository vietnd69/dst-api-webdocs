---
id: mermcandidate
title: Mermcandidate
description: Tracks caloric intake to determine when a merm should transform into a more powerful variant.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 089fa9e7
---

# Mermcandidate

## Overview
This component tracks the calories consumed by a merm entity to determine whether it has accumulated enough energy to trigger a transformation into a stronger variant. It acts as a state manager for merm metamorphosis progression.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `calories` | number | `0` | Current accumulated calorie count from consumed food. |
| `transformation_calories` | number | `50` | Threshold of calories required for transformation to occur. |

## Main Functions
### `AddCalories(food)`
* **Description:** Adds the hunger value (calories) of the given edible item to the internal calorie counter. Only processes items with an `edible` component.
* **Parameters:**
  * `food` (Entity): The food entity to consume; must have an `edible` component for calories to be added.

### `ResetCalories()`
* **Description:** Resets the current calorie count to zero, typically used after a successful transformation or to reset progress.
* **Parameters:** None.

### `ShouldTransform()`
* **Description:** Returns `true` if the current calorie count meets or exceeds the transformation threshold, indicating the merm is ready to transform.
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes the component's state for save/load purposes, returning a table containing current calorie and threshold values.
* **Parameters:** None.
* **Returns:** `{ calories: number, transformation_calories: number }`

### `OnLoad(data)`
* **Description:** Restores component state from saved data, updating `calories` and `transformation_calories` if present in the input table.
* **Parameters:**
  * `data` (table): Saved state data containing optional `calories` and `transformation_calories` keys.

## Events & Listeners
None.