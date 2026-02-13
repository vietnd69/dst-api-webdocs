---
id: cookable
title: Cookable
description: This component marks an entity as cookable and defines its transformation or callback upon being cooked.
sidebar_position: 1

last_updated: 2026-02-14
build_version: 712555
change_status: stable
category_type: component
system_scope: inventory
---

# Cookable

## Overview
This component enables an entity to be cooked by various game mechanisms, such as a Crock Pot or fire. Its primary responsibility is to define the outcome of the cooking process, which can involve transforming the entity into a different prefab or executing a custom callback function. It also includes logic for transferring perishability status from the original item to the newly cooked product.

## Dependencies & Tags
*   **Tags Added:** `cookable` (to `self.inst`).
*   **Components Interacted With:** `perishable` (on `self.inst` and the `product` entity, if present).

## Properties
| Property   | Type                   | Default Value | Description                                                                                                                                                                                                                                                         |
| :--------- | :--------------------- | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `product`  | `string` or `function` | `nil`         | Specifies what the cookable item transforms into after cooking. This can be a string representing a prefab name, or a function that returns either a prefab name (string) or a spawned prefab instance (entity). The function receives `(inst, cooker, chef)` as arguments. |
| `oncooked` | `function`             | `nil`         | A callback function executed immediately when the item is cooked. It receives `(inst, cooker, chef)` as arguments, where `inst` is the cookable item, `cooker` is the cooking device, and `chef` is the player who initiated the cooking.                               |

## Main Functions
### `OnRemoveFromEntity()`
*   **Description:** This function is automatically called when the `Cookable` component is removed from its associated entity. It ensures that the "cookable" tag is also removed from the entity, maintaining proper entity state.
*   **Parameters:** None.

### `SetOnCookedFn(fn)`
*   **Description:** Sets the custom callback function that will be invoked when the item undergoes the cooking process. This allows mod developers to implement specific logic or effects upon cooking.
*   **Parameters:**
    *   `fn`: (`function`) The function to be called. It should accept three arguments: `inst` (the entity being cooked), `cooker` (the cooking device), and `chef` (the player who cooked the item, if applicable).

### `Cook(cooker, chef)`
*   **Description:** Executes the core cooking logic for the entity. It first calls any assigned `oncooked` callback function. Then, if a `product` is defined, it spawns that product. If both the original item and the spawned product possess the `perishable` component (and the original item is not tagged "smallcreature"), it transfers a modified percentage of the original item's perishability to the new product.
*   **Parameters:**
    *   `cooker`: (`Entity`) The entity representing the cooking device (e.g., a `crockpot`, `fire`).
    *   `chef`: (`Entity`) The player entity responsible for the cooking action, if any.
*   **Returns:** (`Entity` or `nil`) The newly spawned product entity if the cooking process successfully yielded one, otherwise `nil`.