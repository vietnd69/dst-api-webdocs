---
id: battery
title: Battery
description: Manages an entity's 'battery' state, allowing for custom logic to determine if it can be used and what happens upon use.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Battery

## Overview
The Battery component provides a generic framework for items that can be "used". It allows developers to define custom logic for checking if the item is usable and for handling the consequences of its use through assignable callback functions. It is commonly used for items that have a limited number of uses or a specific condition for activation.

## Dependencies & Tags
- **Tags:** Adds the `battery` tag to the entity upon initialization and removes it when the component is removed.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `canbeused` | function | `nil` | A callback function that determines if the entity can be used. It receives the entity instance and the user as arguments and should return `true` or `false`. |
| `onused` | function | `nil` | A callback function that executes when the entity is used. It receives the entity instance and the user as arguments. |

## Main Functions
### `CanBeUsed(user)`
* **Description:** Checks if the entity can currently be used by another entity. If the `canbeused` property is set to a function, this method will call it and return its result. Otherwise, it defaults to `true`.
* **Parameters:**
    - `user`: The entity attempting to use this battery-equipped entity.

### `OnUsed(user)`
* **Description:** Called when another entity uses this entity. If the `onused` property is set to a function, this method will execute it, passing along the instance and the user.
* **Parameters:**
    - `user`: The entity that used this battery-equipped entity.