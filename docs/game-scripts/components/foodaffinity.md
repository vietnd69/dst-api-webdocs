---
id: foodaffinity
title: Foodaffinity
description: This component tracks and applies hunger bonuses to a character based on preferences for specific food items, food types, prefabs, or tags.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: player
---

# Foodaffinity

## Overview
The `FoodAffinity` component enables a character to gain increased hunger restoration from specific food items, food types, prefabs, or tagged items. It stores affinity definitions and computes the highest applicable bonus when a food item is consumed.

## Dependencies & Tags
- **Dependencies:** Requires the `spicedfoods` module (`require("spicedfoods")`).
- **Tags:** None added or removed by this component.
- **Component Dependencies:** None explicitly added to the entity; it operates on external food entities passed as arguments.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (assigned in constructor) | Reference to the owner entity (typically a character). |
| `tag_affinities` | `table` | `{}` | Maps tag strings to hunger bonus values (e.g., `{"meat": 10}`). |
| `prefab_affinities` | `table` | `{}` | Maps prefab names to hunger bonus values (e.g., `{"blueberry": 5}`). |
| `prefab_affinites` | `table` | `prefab_affinities` | Legacy alias for `prefab_affinities`; kept for backward compatibility with mods. |
| `foodtype_affinities` | `table` | `{}` | Maps food types (e.g., `"VEGGIE"`, `"MEAT"`) to hunger bonus values. |

## Main Functions

### `AddTagAffinity(tag, bonus)`
* **Description:** Adds or updates a hunger bonus for all food items possessing the specified tag.
* **Parameters:**
  * `tag` *(string)* — The tag applied to food items (e.g., `"meat"`, `"veggie"`).
  * `bonus` *(number)* — The hunger bonus value to apply.

### `AddPrefabAffinity(prefab, bonus)`
* **Description:** Adds or updates a hunger bonus for a specific food prefab (e.g., `"blueberry"`).
* **Parameters:**
  * `prefab` *(string)* — The prefab name of the food item.
  * `bonus` *(number)* — The hunger bonus value to apply.

### `AddFoodtypeAffinity(foodtype, bonus)`
* **Description:** Adds or updates a hunger bonus for all food items of the specified food type.
* **Parameters:**
  * `foodtype` *(string)* — A food type constant (e.g., `"VEGGIE"`, `"MEAT"`, `"INSECT"`).
  * `bonus` *(number)* — The hunger bonus value to apply.

### `RemoveTagAffinity(tag)`
* **Description:** Removes the hunger bonus associated with the given tag.
* **Parameters:**
  * `tag` *(string)* — The tag whose affinity should be removed.

### `RemovePrefabAffinity(prefab)`
* **Description:** Removes the hunger bonus associated with the given prefab.
* **Parameters:**
  * `prefab` *(string)* — The prefab name whose affinity should be removed.

### `RemoveFoodtypeAffinity(foodtype)`
* **Description:** Removes the hunger bonus associated with the given food type.
* **Parameters:**
  * `foodtype` *(string)* — The food type whose affinity should be removed.

### `HasAffinity(food)`
* **Description:** Returns `true` if the owner has *any* affinity (prefab, food type, or tag) for the given food item.
* **Parameters:**
  * `food` *(Entity)* — The food entity to check for affinity.

### `GetFoodBasePrefab(food)`
* **Description:** Returns the base prefab name of the food item, resolving spiced food variants (e.g., `"spiced_fries"` → `"fries"`). Used to support affinities for base food items.
* **Parameters:**
  * `food` *(Entity)* — The food entity to resolve.

### `HasPrefabAffinity(food)`
* **Description:** Returns `true` if the owner has a direct or base-prefab affinity for the food item (including spiced variants).
* **Parameters:**
  * `food` *(Entity)* — The food entity to check.

### `GetAffinity(food)`
* **Description:** Returns the highest applicable hunger bonus from any matching affinities (prefab, food type, tag). If multiple affinities match, the largest bonus is selected.
* **Parameters:**
  * `food` *(Entity)* — The food entity for which to compute the bonus.
* **Returns:** `number?` — The bonus value (e.g., `10`) or `nil` if no affinity applies.

## Events & Listeners
None identified.