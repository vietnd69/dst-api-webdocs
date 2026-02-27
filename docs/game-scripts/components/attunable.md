---
id: attunable
title: Attunable
description: Manages the state of an entity that players can link or 'attune' themselves to, persisting this connection across sessions.
sidebar_position: 1

last_updated: 2026-02-13
build_version: 712555
change_status: stable
category_type: component
system_scope: entity
source_hash: d9a497e2
---

# Attunable

## Overview
The Attunable component allows an entity to establish a persistent link with one or more players. It is responsible for tracking which players are attuned, handling the logic for when a player attunes to another item of the same type, and managing the connection state as players join or leave the server.

A key feature is the `attunable_tag`, which groups attunable entities. A player can only be attuned to one entity per unique tag at any given time, which is useful for things like respawn points where a player can only have one active at a time.

## Dependencies & Tags

**Dependencies:**
*   Requires the attuning player to have the `attuner` component.

**Tags:**
*   `ATTUNABLE_ID_<GUID>`: A unique tag is added to the entity itself, where `<GUID>` is the entity's globally unique identifier. This tag is removed when the entity is destroyed.

## Properties

| Property         | Type     | Default Value | Description                                                                                                                   |
| ---------------- | -------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `attuned_players`| `table`  | `{}`          | A dictionary mapping online, attuned player instances to their respective `attunable_classified` entities.                    |
| `attuned_userids`| `table`  | `{}`          | A dictionary storing the user IDs of attuned players who are currently offline.                                               |
| `attunable_tag`  | `string` | `nil`         | A tag for grouping similar attunable items. Players can only be attuned to one item per tag.                                    |
| `onattunecostfn` | `function` | `nil`       | Optional callback function executed before attuning to check if the player can meet a required cost. Should return `success, reason`. |
| `onlinkfn`       | `function` | `nil`       | Optional callback function executed immediately after a player successfully attunes to the entity.                          |
| `onunlinkfn`     | `function` | `nil`       | Optional callback function executed immediately after a player's attunement is removed.                                       |

## Main Functions

### `SetAttunableTag(tag)`
*   **Description:** Sets the attunement group tag for this entity.
*   **Parameters:**
    *   `tag` (`string`): The tag to assign to this attunable entity.

### `SetOnAttuneCostFn(fn)`
*   **Description:** Sets a callback function that is checked before a player can attune. This function can be used to implement costs, such as consuming items or sanity.
*   **Parameters:**
    *   `fn` (`function`): A function with the signature `function(inst, player)` that should return `true` if the cost is met, or `false, reason` if it is not.

### `SetOnLinkFn(fn)`
*   **Description:** Sets a callback function that runs when a player successfully attunes to the entity.
*   **Parameters:**
    *   `fn` (`function`): A function with the signature `function(inst, player, isloading)`.

### `SetOnUnlinkFn(fn)`
*   **Description:** Sets a callback function that runs when a player's attunement link is broken.
*   **Parameters:**
    *   `fn` (`function`): A function with the signature `function(inst, player, isloading)`.

### `IsAttuned(player)`
*   **Description:** Checks if a specific player is currently attuned to this entity.
*   **Parameters:**
    *   `player`: The player entity instance to check.
*   **Returns:** `true` if the player is attuned, otherwise `false`.

### `CanAttune(player)`
*   **Description:** Checks if a player is eligible to attune to this entity. The player must have a valid user ID, possess an `attuner` component, and not already be attuned to this entity.
*   **Parameters:**
    *   `player`: The player entity instance to check.
*   **Returns:** `true` if the player can attune, otherwise `false`.

### `LinkToPlayer(player, isloading)`
*   **Description:** Attempts to establish an attunement link with a player. If successful, it spawns a classified entity to manage the link, sets up event listeners on the player, and fires the `onlinkfn` callback.
*   **Parameters:**
    *   `player`: The player entity instance to link.
    *   `isloading` (`boolean`, optional): A flag indicating if this link is being established during the world loading process. If `false` or `nil`, the `onattunecostfn` will be checked.
*   **Returns:** `true` on successful attunement, or `false, reason` on failure.

### `UnlinkFromPlayer(player, isloading)`
*   **Description:** Breaks the attunement link for a specific player. It removes the associated classified entity, cleans up event listeners, and fires the `onunlinkfn` callback.
*   **Parameters:**
    *   `player`: The player entity instance to unlink.
    *   `isloading` (`boolean`, optional): A flag indicating if this action is part of a loading process.

## Events & Listeners

### Pushed Events
*   `attuned`: Pushed on the `player` entity when they successfully link to this entity. The event data includes `{ prefab = self.inst.prefab, tag = self.attunable_tag, isloading = isloading }`.

### Listened Events
*   `ms_playerjoined` (on `TheWorld`): When any player joins the server, this listener checks if they have an offline attunement record and, if so, re-links them.
*   `onremove` (on `player`): When an attuned player's entity is removed (e.g., they disconnect), this listener moves their record from the online `attuned_players` list to the offline `attuned_userids` list.
*   `attuned` (on `player`): When an attuned player attunes to *another* entity, this listener checks if the new attunement belongs to the same `attunable_tag`. If it does, the player is automatically unlinked from this entity.