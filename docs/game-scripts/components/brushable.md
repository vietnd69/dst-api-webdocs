---
id: brushable
title: Brushable
description: Enables an entity to be brushed periodically to yield a prize item.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Brushable

## Overview
The `Brushable` component allows an entity to be interacted with using a brush tool. It tracks the time since the entity was last brushed to determine the number of "prizes" (spawnable items) to award to the player. The type of prize, the maximum number that can be accumulated, and the time required per prize are all configurable.

## Dependencies & Tags
- **Tags:** Adds the `brushable` tag to the entity when it can be brushed, and removes it when it cannot.

## Properties

| Property         | Type (`inferred`) | Default Value | Description                                                               |
| ---------------- | ----------------- | ------------- | ------------------------------------------------------------------------- |
| `prize`          | string            | `nil`         | The prefab name of the item to spawn as a prize.                          |
| `max`            | number            | `0`           | The maximum number of prizes that can be accumulated at one time.         |
| `cyclesperprize` | number            | `0`           | The number of world cycles that must pass for one prize to become available. |
| `lastbrushcycle` | number            | `0`           | The world cycle on which the entity was last successfully brushed.        |
| `brushable`      | boolean           | `true`        | A flag indicating if the entity is currently able to be brushed.          |

## Main Functions

### `SetBrushable(brushable, reset)`
* **Description:** Sets whether the entity can be brushed. It can optionally reset the prize accumulation timer.
* **Parameters:**
    * `brushable` (boolean): `true` to make the entity brushable, `false` otherwise.
    * `reset` (boolean, optional): If `true`, resets `lastbrushcycle` to the current world cycle, effectively restarting the prize timer.

### `SetOnBrushed(fn)`
* **Description:** Assigns a custom callback function to be executed after the entity is brushed.
* **Parameters:**
    * `fn` (function): The callback function to run. It will receive the entity instance, the `doer`, and the number of prizes as arguments.

### `CalculateNumPrizes()`
* **Description:** Calculates the number of prizes currently available based on the time elapsed since the last brushing. The result is capped by the `max` property.
* **Parameters:** None.

### `Brush(doer, brush)`
* **Description:** Executes the brushing logic. It calculates the number of prizes, spawns them, and gives them to the `doer`. It then resets the prize timer and triggers the `brushed` event and any custom callback.
* **Parameters:**
    * `doer` (Entity): The entity performing the brushing action.
    * `brush` (Entity): The brush item being used. (Note: This parameter is accepted but not used in the function body).

### `OnSave()`
* **Description:** Gathers the component's state to be saved with the game world.
* **Parameters:** None.

### `OnLoad(data)`
* **Description:** Restores the component's state from saved data.
* **Parameters:**
    * `data` (table): The saved data table from a previous session.

### `GetDebugString()`
* **Description:** Generates a formatted string containing debug information about the component's current state, including its brushable status, last brush cycle, and available prizes.
* **Parameters:** None.

## Events & Listeners
- **`brushed`**: Pushed on the component's entity instance after it has been brushed.
    - **Data:** `{ doer = doer, numprizes = numprizes }`
        - `doer`: The entity that performed the brushing.
        - `numprizes`: The number of prizes that were awarded.