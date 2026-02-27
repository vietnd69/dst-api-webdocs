---
id: bathbombable
title: Bathbombable
description: Manages an entity's ability to be affected by bath bombs and triggers a callback function when the interaction occurs.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: 6b34d74f
---

# Bathbombable

## Overview
The `Bathbombable` component allows an entity to be targeted and affected by bath bomb items. It manages the state of whether the entity is currently susceptible to bath bombs, tracks if it has already been affected, and provides a mechanism to execute a custom callback function when the entity is successfully "bath-bombed".

This component is essential for entities like the Hot Spring, which change state or produce effects when a bath bomb is used on them.

## Dependencies & Tags

*   **Tags:**
    *   `bathbombable`: Added to the entity when it is able to be affected by a bath bomb. Removed when it is not.

## Properties

| Property           | Type     | Default Value | Description                                                                                                   |
| ------------------ | -------- | ------------- | ------------------------------------------------------------------------------------------------------------- |
| `onbathbombedfn`   | function | `nil`           | A callback function to be executed when the entity is successfully bath-bombed.                               |
| `can_be_bathbombed`| boolean  | `true`          | Determines if the entity can currently be targeted by a bath bomb. Setting this toggles the `bathbombable` tag. |
| `is_bathbombed`    | boolean  | `false`         | Tracks whether the entity has been bath-bombed since the last reset.                                          |

## Main Functions

### `SetOnBathBombedFn(new_fn)`
* **Description:** Sets or replaces the callback function that triggers when the entity is bath-bombed.
* **Parameters:**
    * `new_fn` (function): The function to execute. It will receive the entity instance (`inst`), the bath bomb `item`, and the `doer` as arguments.

### `OnBathBombed(item, doer)`
* **Description:** This is the primary action method called when a bath bomb successfully affects the entity. It sets the entity's state to "bombed," prevents it from being bombed again immediately, and executes the `onbathbombedfn` callback if one is defined.
* **Parameters:**
    * `item` (Entity): The bath bomb item entity used.
    * `doer` (Entity): The player or entity that used the bath bomb.

### `DisableBathBombing()`
* **Description:** Disables the entity's ability to be bath-bombed. It sets `can_be_bathbombed` to `false` and also resets the `is_bathbombed` flag to `false`.

### `Reset()`
* **Description:** Resets the component's state to its default, allowing the entity to be bath-bombed again. Sets `is_bathbombed` to `false` and `can_be_bathbombed` to `true`.