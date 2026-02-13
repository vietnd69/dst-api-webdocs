---
id: carnivalevent
title: Carnivalevent
description: Manages the server-side logic for the Year of the Beefalo Carnival event, including spawning the Carnival Host and tracking Carnival Plazas.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: world
---

# Carnivalevent

## Overview
This component is attached to `TheWorld` and acts as the central manager for the Carnival event on the master simulation (server). Its primary responsibilities include spawning and maintaining the existence of the Carnival Host entity, tracking the locations of all Carnival Plazas built in the world, and facilitating the host's appearance at these plazas.

This component only exists on the server.

## Dependencies & Tags
None identified.

## Properties

| Property | Type   | Default Value                                | Description                                               |
|----------|--------|----------------------------------------------|-----------------------------------------------------------|
| `inst`   | Entity | The entity instance this component is attached to. | A reference to the entity instance, which is `TheWorld`. |

## Main Functions

### `RegisterPlaza(plaza)`
* **Description:** Adds a Carnival Plaza entity to the component's internal tracking list. This is typically called when a plaza is built. It also triggers a world event to notify other systems.
* **Parameters:**
    * `plaza` (Entity): The Carnival Plaza entity to register.

### `UnregisterPlaza(plaza)`
* **Description:** Removes a Carnival Plaza entity from the internal tracking list. This is used when a plaza is destroyed.
* **Parameters:**
    * `plaza` (Entity): The Carnival Plaza entity to unregister.

### `DoesAnyPlazaExist()`
* **Description:** Checks if any Carnival Plazas are currently registered in the world.
* **Returns:** `true` if at least one plaza exists, `false` otherwise.

### `GetRandomPlaza()`
* **Description:** Selects and returns a random Carnival Plaza from the list of all existing plazas.
* **Returns:** A random Carnival Plaza entity instance, or `nil` if no plazas exist.

### `SummonHost(plaza)`
* **Description:** Attempts to summon the Carnival Host to a specific plaza. This function calls a method on the Carnival Host entity itself to trigger its "summoned" behavior.
* **Parameters:**
    * `plaza` (Entity): The target Carnival Plaza where the host should be summoned.
* **Returns:** A boolean indicating the result of the summon attempt on the host entity. Returns `false` if the Carnival Host does not exist.

## Events & Listeners

* **Listens To:**
    * `onremove` (on `_carnival_host`): When the Carnival Host entity is removed from the world, this listener triggers a function to respawn it, ensuring the host is always present during the event.
* **Pushes:**
    * `ms_carnivalplazabuilt`: Fired when a new Carnival Plaza is registered via the `RegisterPlaza` function. The event data is the plaza entity itself.