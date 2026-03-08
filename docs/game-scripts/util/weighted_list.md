---
id: weighted_list
title: Weighted List
description: Implements a weighted random selection data structure for choosing items based on assigned weights.
tags: [data_structure, random, selection]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: util
source_hash: 86ab40d2
system_scope: entity
---

# Weighted List

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`weighted_list` is a utility class that provides a weighted random selection mechanism. It stores pairs of items and their corresponding weights, supporting efficient weighted sampling via cumulative weight traversal. The structure is implemented as a flat Lua table alternating between weights and items (e.g., `[weight1, item1, weight2, item2, ...]`). It is designed for internal use as a standalone helper and not intended to be attached to entities via the ECS.

## Usage example
```lua
local weighted_list = require("util.weighted_list")
local choices = {
    {"apple", 5},
    {"banana", 3},
    {"cherry", 2}
}
local list = weighted_list(choices)
local item = list:getChoice(math.random(0, list:getTotalWeight() - 0.0001))
print("Selected:", item)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_totalWeight` | number | `0` | Cumulative sum of all added weights. Internal use only. |

## Main functions
### `getTotalWeight()`
*   **Description:** Returns the total sum of weights currently in the list.
*   **Parameters:** None.
*   **Returns:** `number` — the cumulative weight of all entries.

### `getCount()`
*   **Description:** Returns the number of unique items (choices) currently stored.
*   **Parameters:** None.
*   **Returns:** `number` — count of items (half the table length).

### `addChoice(item, weight)`
*   **Description:** Adds a new item with its weight to the list. Weights must be positive.
*   **Parameters:** 
    *   `item` (any) — the item to add.
    *   `weight` (number) — the weight assigned to the item (must be > 0).
*   **Returns:** Nothing.
*   **Error states:** Raises an assertion error if `weight <= 0`.

### `addList(list)`
*   **Description:** Appends all items and weights from another `weighted_list` instance. Recalculates `_totalWeight`.
*   **Parameters:** 
    *   `list` (weighted_list) — the source weighted list to append.
*   **Returns:** Nothing.

### `getChoice(weight)`
*   **Description:** Selects and returns an item based on a cumulative weight scan. Performs weighted random selection using the provided weight value.
*   **Parameters:** 
    *   `weight` (number) — a cumulative weight value in the range `[0, getTotalWeight())`.
*   **Returns:** `item` (any) — the selected item, or `nil` if weight exceeds total.
*   **Error states:** Returns `nil` if the input weight is outside the valid range.

### `removeChoice(weight)`
*   **Description:** Removes the item corresponding to the given cumulative weight, updating the total weight and list structure.
*   **Parameters:** 
    *   `weight` (number) — the cumulative weight index of the item to remove.
*   **Returns:** 
    *   `item` (any) — the removed item, or `nil` if not found.
    *   `removed_weight` (number) — the weight of the removed item.

### `removeHighest()`
*   **Description:** Removes and returns the item with the highest individual weight.
*   **Parameters:** None.
*   **Returns:** 
    *   `item` (any) — the removed item, or `nil` if the list is empty.
    *   `max_weight` (number) — the weight of the removed item.

### `print()`
*   **Description:** Returns a formatted string representation of the list contents for debugging.
*   **Parameters:** None.
*   **Returns:** `string` — human-readable listing of weights and items.

## Events & listeners
None identified