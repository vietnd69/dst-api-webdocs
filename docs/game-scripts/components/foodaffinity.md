---
id: foodaffinity
title: Foodaffinity
description: Manages hunger bonus bonuses a character receives when eating food, based on prefab, foodtype, or tag matches.
tags: [hunger, character, food, affinity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: b5998670
system_scope: entity
---

# Foodaffinity

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Foodaffinity` is a component that allows a character entity to define preferences for certain types of food, granting increased hunger restoration when eating matching items. Preferences are registered via three categorization methods: prefab names, food types (using `EDIBLE.FOODTYPE`), and arbitrary tags. This component is typically added to playable characters to implement mechanics like Webber’s preference for spider eggs or WX-78’s affinity for electronic food. It uses external data from `spicedfoods.lua` to resolve spiced food base prefabs correctly.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("foodaffinity")
inst.components.foodaffinity:AddPrefabAffinity("spider", 10)
inst.components.foodaffinity:AddFoodtypeAffinity("MEAT", 15)
inst.components.foodaffinity:AddTagAffinity("spicy", 5)
```

## Dependencies & tags
**Components used:** `edible` (via `food.components.edible.foodtype`)
**Tags:** Checks `food:HasTag(tag)` for registered tag affinities; no tags added or removed by this component.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `tag_affinities` | table | `{}` | Map of tag strings to hunger bonus numbers (e.g., `{"spicy" = 5}`). |
| `prefab_affinities` | table | `{}` | Map of prefab names to hunger bonus numbers (e.g., `{"spider" = 10}`). |
| `prefab_affinites` | table | Alias of `prefab_affinities` | Legacy typo alias retained for mod compatibility. |
| `foodtype_affinities` | table | `{}` | Map of `EDIBLE.FOODTYPE` constants to hunger bonus numbers (e.g., `{EDIBLE.FOODTYPE.MEAT = 15}`). |

## Main functions
### `AddTagAffinity(tag, bonus)`
*   **Description:** Registers a hunger bonus for foods that have the specified tag.
*   **Parameters:** `tag` (string) - a tag to match against food entities; `bonus` (number) - the extra hunger value to grant when eating matching food.
*   **Returns:** Nothing.

### `AddPrefabAffinity(prefab, bonus)`
*   **Description:** Registers a hunger bonus for foods matching the specified prefab name.
*   **Parameters:** `prefab` (string) - the prefab name to match (e.g., `"spider"`); `bonus` (number) - extra hunger value granted.
*   **Returns:** Nothing.

### `AddFoodtypeAffinity(foodtype, bonus)`
*   **Description:** Registers a hunger bonus for foods of the specified foodtype.
*   **Parameters:** `foodtype` (string) - one of the constants from `EDIBLE.FOODTYPE` (e.g., `"MEAT"`, `"VEGGIE"`); `bonus` (number) - extra hunger value granted.
*   **Returns:** Nothing.

### `RemoveTagAffinity(tag)`
*   **Description:** Removes a previously registered tag-based affinity.
*   **Parameters:** `tag` (string) - the tag to remove.
*   **Returns:** Nothing.

### `RemovePrefabAffinity(prefab)`
*   **Description:** Removes a previously registered prefab-based affinity.
*   **Parameters:** `prefab` (string) - the prefab name to remove.
*   **Returns:** Nothing.

### `RemoveFoodtypeAffinity(foodtype)`
*   **Description:** Removes a previously registered foodtype-based affinity.
*   **Parameters:** `foodtype` (string) - the foodtype constant to remove.
*   **Returns:** Nothing.

### `HasAffinity(food)`
*   **Description:** Checks whether the character has *any* affinity for the given food item.
*   **Parameters:** `food` (table/entity) - a food item entity.
*   **Returns:** `true` if the food matches a registered prefab, foodtype, or tag affinity; otherwise `false`.
*   **Error states:** Returns `false` if `food` lacks the `edible` component and no prefab or tag match is found.

### `GetFoodBasePrefab(food)`
*   **Description:** Returns the base prefab name for a food item, resolving spiced food variants using `spicedfoods.lua`.
*   **Parameters:** `food` (table/entity) - a food item entity.
*   **Returns:** (string) the resolved base prefab name (e.g., `"spicedbeef"` → `"beef"`), or `food.prefab` if not spiced.
*   **Error states:** None identified.

### `HasPrefabAffinity(food)`
*   **Description:** Checks whether the character has a prefab affinity for the food, including via the resolved base prefab for spiced foods.
*   **Parameters:** `food` (table/entity) - a food item entity.
*   **Returns:** `true` if a direct or spiced-base prefab match exists; otherwise `false`.
*   **Error states:** None identified.

### `GetAffinity(food)`
*   **Description:** Computes and returns the *highest* hunger bonus applicable to the given food from all registered affinities.
*   **Parameters:** `food` (table/entity) - a food item entity.
*   **Returns:** (number) the largest hunger bonus applicable (e.g., `15`), or `nil` if no affinities match.
*   **Error states:** Returns `nil` if no affinities are registered or the food has no matching criteria.

## Events & listeners
None identified.
