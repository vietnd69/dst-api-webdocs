---
id: cooker
title: Cooker
description: This component manages the logic for cooking items, including checking if an item can be cooked and performing the cooking action.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: crafting
---

# Cooker

## Overview
The `Cooker` component enables an entity to function as a cooking station within Don't Starve Together. It provides robust functionality to determine if a given item can be cooked by a specific chef and to execute the cooking process, transforming the raw item into its cooked counterpart. This component also handles sound effects and custom callback functions post-cooking, making it a central piece for any cooking-related entity like a Crock Pot or Campfire.

## Dependencies & Tags
*   **Tags:**
    *   `cooker`: Added to the entity when this component is initialized, and removed when the component is detached. This identifies the entity as a cooking station.
    *   `dangerouscooker`: A tag that, if present on the cooker, restricts cooking to entities with the `expertchef` tag.
    *   `expertchef`: A tag checked on the `chef` entity to allow cooking on `dangerouscooker` stations.
*   **Other Components:**
    *   `item.components.cookable`: Essential for an item to be eligible for cooking and for the actual cooking transformation. Without this component, an item cannot be cooked.
    *   `self.inst.components.fueled`: The cooker may require fuel to operate. This component is checked in `CanCook` to ensure the cooker is not empty if it uses fuel.
    *   `item.components.burnable`: Checked in `CanCook` to prevent cooking items that are currently burning.
    *   `item.components.projectile`: Checked in `CanCook` to prevent cooking items that are currently thrown as projectiles.
    *   `self.inst.components.inventoryitem`: Used in `CookItem` to locate the sound emitter for cooking sounds, typically when the cooker is part of a larger inventory (e.g., a portable cooker held by a player).

## Properties
No public properties were explicitly initialized in the `_ctor` beyond `self.inst`. However, the following properties are expected to be set externally to define callback behaviors:

| Property     | Type       | Default Value | Description                                                                                                                                                                                                                                      |
| :----------- | :--------- | :------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oncookitem` | `function` | `nil`         | A callback function `function(old_item, new_item)` that is invoked immediately after an item is cooked. `old_item` is the original item that was cooked, and `new_item` is the resulting cooked item.                                          |
| `oncookfn`   | `function` | `nil`         | A callback function `function(cooker_inst, new_item, chef)` that is invoked after an item is cooked. This provides more context than `oncookitem`, including the cooker entity itself, the newly cooked item, and the chef who performed the action. |

## Main Functions

### `OnRemoveFromEntity()`
*   **Description:** This function is called automatically by the Entity Component System when the `Cooker` component is removed from its associated entity. Its primary purpose is to clean up by removing the "cooker" tag that was added during initialization.
*   **Parameters:** None.

### `CanCook(item, chef)`
*   **Description:** Determines whether a given `item` can be cooked by a `chef` using this cooker. It performs several validation checks: ensuring the item has a `cookable` component, verifying the cooker has fuel (if applicable), confirming the item is not currently burning or thrown, and checking if the cooker's "dangerouscooker" tag permits the `chef` to cook (requiring an "expertchef" tag on the chef).
*   **Parameters:**
    *   `item`: (`Entity`) The `Entity` object representing the item intended for cooking.
    *   `chef`: (`Entity`) The `Entity` object representing the character attempting to cook.
*   **Returns:** (`boolean`) `true` if the item meets all criteria and can be cooked; `false` otherwise.

### `CookItem(item, chef)`
*   **Description:** Executes the cooking process for a specified `item` by a `chef`, provided that `CanCook` returns `true`. This function handles the transformation of the original item into its cooked version, updates player statistics ("cooked_" + prefab name), triggers custom callback functions (`oncookitem` and `oncookfn` if defined), plays a cooking sound, and removes the original item from the world.
*   **Parameters:**
    *   `item`: (`Entity`) The `Entity` object representing the item to be cooked.
    *   `chef`: (`Entity`) The `Entity` object representing the character performing the cooking.
*   **Returns:** (`Entity` or `nil`) The newly created cooked item entity if the cooking was successful and `CanCook` allowed it; otherwise, `nil`.