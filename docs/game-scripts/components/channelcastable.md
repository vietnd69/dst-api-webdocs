---
id: channelcastable
title: Channelcastable
description: Enables an entity to be the target of a continuous channeled action performed by a user.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
---

# Channelcastable

## Overview
The `Channelcastable` component allows an entity, typically an equippable item, to be the target of a sustained "channeled" action. It works in conjunction with the `channelcaster` component on the user's end. This component manages the state of who is currently channeling the entity and provides callbacks for the start and stop events of the channeling process.

## Dependencies & Tags
**Dependencies:**
- Relies on the user entity having a `channelcaster` component to initiate and manage the channeling action.
- Implicitly depends on an `equippable` component, as it listens for the "unequipped" event.

**Tags:**
- None identified.

## Properties

| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `user` | Entity | `nil` | The entity instance that is currently channeling this object. |
| `strafing` | boolean | `true` | Determines if the user should be strafing while channeling. |
| `onstartchannelingfn` | function | `nil` | A callback function executed when channeling begins. It receives the component's instance and the user as arguments. |
| `onstopchannelingfn` | function | `nil` | A callback function executed when channeling ends. It receives the component's instance and the user as arguments. |

## Main Functions

### `SetStrafing(enable)`
* **Description:** Sets whether the user is allowed to strafe while channeling this object.
* **Parameters:**
    * `enable` (boolean): `true` to enable strafing, `false` to disable it.

### `SetOnStartChannelingFn(fn)`
* **Description:** Assigns a callback function to be invoked when a user starts channeling this entity.
* **Parameters:**
    * `fn` (function): The function to call on the start of channeling. It will be passed `(inst, user)`.

### `SetOnStopChannelingFn(fn)`
* **Description:** Assigns a callback function to be invoked when a user stops channeling this entity.
* **Parameters:**
    * `fn` (function): The function to call on the stop of channeling. It will be passed `(inst, user)`.

### `IsUserChanneling(user)`
* **Description:** Checks if a specific user is currently channeling this entity.
* **Parameters:**
    * `user` (Entity): The user entity to check.
* **Returns:** `true` if the specified user is the one channeling, `false` otherwise.

### `IsAnyUserChanneling()`
* **Description:** Checks if any user is currently channeling this entity.
* **Returns:** `true` if there is a user channeling, `false` otherwise.

### `OnStartChanneling(user)`
* **Description:** An internal function, typically called by a `channelcaster` component, to initiate the channeling state on this entity. It sets the current user and registers listeners.
* **Parameters:**
    * `user` (Entity): The entity that is starting the channel.

### `OnStopChanneling(user)`
* **Description:** An internal function, typically called by a `channelcaster` component, to terminate the channeling state. It clears the current user and removes listeners.
* **Parameters:**
    * `user` (Entity): The entity that is stopping the channel.

### `StopChanneling()`
* **Description:** Forces the current user to stop channeling this entity by calling the `StopChanneling` function on the user's `channelcaster` component. This is also called automatically when the component or entity is removed.

## Events & Listeners
* **Listens For:**
    * `unequipped`: When the entity is unequipped by a player, it calls `StopChanneling()` to gracefully end the action. This listener is only active while the item is being channeled.