---
id: carnivaldecorranker
title: Carnivaldecorranker
description: Calculates a cumulative decor score and rank based on nearby Carnival decorations.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# Carnivaldecorranker

## Overview
The `Carnivaldecorranker` component is attached to an entity to measure the decorative appeal of its surroundings. Upon initialization, it scans a radius for entities with the `carnivaldecor` tag, summing their decor values to calculate a total score. This score is then converted into a numerical rank. The component dynamically updates this rank when decorations are added or removed from its tracking list, and can execute a callback function whenever the rank changes.

## Dependencies & Tags

**Dependencies**
*   This component interacts with entities that have the `carnivaldecor` component to retrieve their decor value.

**Tags**
*   Adds the `carnivaldecor_ranker` tag to the entity.

## Properties

| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `decor` | `table` | `{}` | A table mapping nearby decor entities to their numerical decor value. |
| `totalvalue` | `number` | `0` | The sum of all decor values from the `decor` table. |
| `rank` | `number` | `0` | The calculated decor rank based on `totalvalue`. |
| `onrankchanged` | `function` | `nil` | A callback function triggered when the rank changes. It receives the entity instance, new rank, previous rank, and a 'snap' boolean as arguments. |

## Main Functions

### `UpdateDecorValue(snap)`
* **Description:** Recalculates the total decor value by summing all values in the `decor` table. It then calculates a new rank based on this total. If the new rank is different from the current rank, it updates the `rank` property and triggers the `onrankchanged` callback if it has been assigned.
* **Parameters:**
    * `snap` (boolean): An optional boolean that is passed directly to the `onrankchanged` callback.

### `AddDecor(decor)`
* **Description:** Adds a new decor entity to the internal tracking list and updates its value. After adding, it calls `UpdateDecorValue` to recalculate the total score and rank.
* **Parameters:**
    * `decor` (Entity): The decor entity to add. It must have a `carnivaldecor` component.

### `RemoveDecor(decor)`
* **Description:** Removes a decor entity from the internal tracking list. After removal, it calls `UpdateDecorValue` to recalculate the total score and rank.
* **Parameters:**
    * `decor` (Entity): The decor entity to remove.

### `GetDebugString()`
* **Description:** Returns a formatted string containing the current number of tracked decor items, the total decor value, and the current rank. Useful for debugging.
* **Parameters:** None.