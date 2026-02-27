---
id: attuner
title: Attuner
description: Manages a player's attunement links to specific entities in the world.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: player
source_hash: 9f4d7e52
---

# Attuner

## Overview
The Attuner component is exclusive to player entities and is responsible for managing the player's "attunement" to other entities. It maintains a list of entities the player is linked to, providing functions to check, register, and unregister these attunements. The component behaves differently on the server versus the client, with clients typically interacting with proxy objects for attuned entities that may be far away.

## Dependencies & Tags
None identified.

## Properties
| Property | Type | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `inst` | `Entity` | `inst` | A reference to the entity instance possessing this component. |
| `ismastersim` | `boolean` | `TheWorld.ismastersim` | A boolean flag indicating if the component is running on the server (master simulation). |
| `attuned` | `table` | `{}` | A table mapping the GUIDs of attuned entities to their corresponding proxy or entity objects. |

## Main Functions
### `IsAttunedTo(target)`
* **Description:** Checks if the player is currently attuned to a specific target entity. On the server, this is checked by the target's GUID. On the client, it checks if the target has a specific `ATTUNABLE_ID_` tag.
* **Parameters:**
    * `target`: The entity instance to check for attunement.

### `HasAttunement(tag)`
* **Description:** Checks if the player is attuned to any entity that possesses a specific tag.
* **Parameters:**
    * `tag`: The string tag to search for among attuned entities.

### `GetAttunedTarget(tag)`
* **Description:** (Server-only) Retrieves the first attuned entity that has a specific tag.
* **Parameters:**
    * `tag`: The string tag to search for.
* **Returns:** The attuned entity instance (`Ents[k]`) if found, otherwise `nil`.

### `TransferComponent(newinst)`
* **Description:** (Server-only) Transfers all of the player's current attunements to a new entity instance. This is typically used when a player changes characters or respawns.
* **Parameters:**
    * `newinst`: The new player entity instance to receive the attunements.

### `RegisterAttunedSource(proxy)`
* **Description:** Registers a new attunement link for the player. It stores the provided proxy object and pushes a `gotnewattunement` event.
* **Parameters:**
    * `proxy`: The `attunable_classified` proxy object representing the attuned entity.

### `UnregisterAttunedSource(proxy)`
* **Description:** Removes an existing attunement link for the player. It removes the provided proxy object from the internal list and pushes an `attunementlost` event.
* **Parameters:**
    * `proxy`: The `attunable_classified` proxy object representing the attuned entity to unregister.

## Events & Listeners
*   **`gotnewattunement`** (Pushed): Fired when the player becomes attuned to a new entity. The event data contains `{ proxy = proxy }`.
*   **`attunementlost`** (Pushed): Fired when the player's attunement to an entity is lost. The event data contains `{ proxy = proxy }`.