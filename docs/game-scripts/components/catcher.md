---
id: catcher
title: Catcher
description: Manages an entity's ability to track, act upon, and catch thrown projectiles within a specified range.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: bd95b072
---

# Catcher

## Overview
The Catcher component allows an entity to catch projectiles that are thrown or in flight. It maintains a "watchlist" of nearby projectiles, determines when the catch action should be available based on distance, and triggers the catch event when a projectile comes within the catch radius and the entity is in a "ready to catch" state.

## Dependencies & Tags
- **Tags Added:** `cancatch` (added when a catchable projectile is within action range).
- **Tags Checked:** `readytocatch` (checks if the entity's stategraph is in a state suitable for catching).

## Properties

| Property         | Type    | Default Value | Description                                                                   |
| ---------------- | ------- | ------------- | ----------------------------------------------------------------------------- |
| `enabled`        | boolean | `true`        | If `false`, the component will not perform any checks or actions.               |
| `actiondistance` | number  | `12`          | The distance (in game units) at which the catch action becomes available.     |
| `catchdistance`  | number  | `2`           | The distance at which a projectile will be automatically caught if the entity is ready. |
| `canact`         | boolean | `false`       | A flag indicating if a catch action is currently possible.                      |
| `watchlist`      | table   | `{}`          | A set-like table containing all projectile entities currently being monitored. |

## Main Functions

### `OnRemoveFromEntity()`
* **Description:** A cleanup function called when the component is removed from the entity. It ensures the `cancatch` tag is removed.
* **Parameters:** None.

### `SetEnabled(enable)`
* **Description:** Enables or disables the component's functionality. If disabled while the entity is in a `readytocatch` state, it will push a `cancelcatch` event.
* **Parameters:**
    * `enable` (boolean): `true` to enable the component, `false` to disable it.

### `SetActionDistance(dist)`
* **Description:** Sets the maximum distance at which the action to catch a projectile becomes available to the player.
* **Parameters:**
    * `dist` (number): The new action distance.

### `SetCatchDistance(dist)`
* **Description:** Sets the distance at which a projectile will be caught automatically, provided the entity is in the `readytocatch` state.
* **Parameters:**
    * `dist` (number): The new catch distance.

### `StartWatching(projectile)`
* **Description:** Adds a projectile entity to the component's watchlist to begin monitoring it for catching.
* **Parameters:**
    * `projectile` (Entity): The projectile entity to start watching.

### `StopWatching(projectile)`
* **Description:** Removes a projectile entity from the watchlist.
* **Parameters:**
    * `projectile` (Entity): The projectile entity to stop watching.

### `CanCatch()`
* **Description:** Returns whether the entity can currently perform a catch action.
* **Parameters:** None.

### `OnUpdate()`
* **Description:** The main update loop for the component. It iterates through the `watchlist`, cleaning up invalid projectiles. For valid ones, it checks distances to update the `canact` status and, if the entity is ready, performs the catch by pushing events and calling the projectile's `Catch` method.
* **Parameters:** None.

## Events & Listeners
- **`inst:PushEvent("cancelcatch")`**
  - Triggered when `SetEnabled(false)` is called while the entity has the `readytocatch` state tag.
- **`inst:PushEvent("catch", { projectile })`**
  - Triggered on this component's entity when a projectile is successfully caught.
  - **Data:** `projectile` (Entity) - The projectile that was caught.
- **`projectile:PushEvent("caught", { catcher })`**
  - Triggered on the projectile entity when it has been caught by this component's entity.
  - **Data:** `catcher` (Entity) - The entity that performed the catch.