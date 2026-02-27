---
id: cattoy
title: Cattoy
description: Manages an entity's behavior as a toy, triggering a custom callback function when another entity plays with it.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: ca4cc0ed
---

# Cattoy

## Overview
The `Cattoy` component allows an entity to be treated as a playable toy by other creatures. Its primary role is to store and execute a custom callback function when another entity initiates a "play" interaction with it, enabling unique behaviors for different toys.

## Dependencies & Tags
None identified.

*Note: The source code comments recommend adding the `"cattoy"` or `"cattoyairborne"` tags to the entity to ensure other creatures can identify it as a toy, but this component does not add these tags itself.*

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | `Entity` | `inst` | A reference to the component's parent entity instance. |
| `onplay_fn` | `function` | `nil` | The callback function to execute when the toy is played with. |

## Main Functions
### `SetOnPlay(fn)`
* **Description:** Assigns a custom callback function that defines the toy's behavior when played with. This function will be executed by the `Play` method.
* **Parameters:**
    * `fn` (function): The function to be called. It is expected to receive three arguments: the toy's instance (`inst`), the entity playing with it (`doer`), and a boolean flag (`is_airborne`).

### `Play(doer, is_airborne)`
* **Description:** Triggers the play behavior by executing the function stored in `onplay_fn`. If no function has been set, this method does nothing and returns `false`.
* **Parameters:**
    * `doer` (Entity): The entity instance that is playing with the toy.
    * `is_airborne` (boolean): A flag indicating if the play interaction is happening while airborne.