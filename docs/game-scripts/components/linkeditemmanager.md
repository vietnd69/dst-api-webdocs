---
id: linkeditemmanager
title: Linkeditemmanager
description: Manages persistent links between items and players on the server to track ownership across sessions.
tags: [network, inventory, server, persistence, ownership]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: components
source_hash: 7103fb0f
system_scope: network
---

# Linkeditemmanager

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`LinkedItemManager` is a server-side component responsible for maintaining persistent relationships between player entities and specific items. It ensures that items created by or assigned to a player retain ownership data even across login sessions, using user IDs rather than entity references which may become invalid. This component listens to global player lifecycle events to update item ownership states dynamically. It relies on the `linkeditem` component attached to individual items to apply ownership logic.

## Usage example
```lua
-- Typically added to a manager entity on the server
local manager = CreateEntity()
manager:AddComponent("linkeditemmanager")

-- Items register themselves via event to link to a player
TheWorld:PushEvent("ms_registerlinkeditem", {
    owner_userid = player.userid,
    item = item_inst
})

-- Query items owned by a specific player
manager.components.linkeditemmanager:ForEachLinkedItemForPlayer(player, function(item, owner)
    print("Item:", item.prefab, "Owner:", owner.name)
end)
```

## Dependencies & tags
**External dependencies:**
- `TheWorld` -- listens for player join/leave and item registration events
- `AllPlayers` -- iterates existing players during initialization
- `POSTACTIVATEHANDSHAKE` -- checks player handshake state for skill tree initialization

**Components used:**
- `linkeditem` -- calls `SetOwnerInst` and `OnSkillTreeInitialized` on linked items

**Tags:**
- None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The entity instance owning this component. |
| `linkeditems` | table | `{}` | Maps user IDs to tables of owned item instances. |
| `players` | table | `{}` | Maps user IDs to currently connected player instances. |
| `waitingforinitialization` | table | `{}` | Tracks players waiting for skill tree initialization event. |
| `OnSkillTreeInitialized` | function | `nil` | Callback function triggered when a player's skill tree is ready. |

## Main functions
### `ForEachLinkedItemForPlayerOfPrefab(player, prefab, callback, ...)`
*   **Description:** Iterates over all linked items owned by `player` that match the specified `prefab` name.
*   **Parameters:**
    - `player` -- player entity instance
    - `prefab` -- string prefab name to filter by
    - `callback` -- function called for each matching item (item, player, ...)
    - `...` -- additional arguments passed to callback
*   **Returns:** None
*   **Error states:** Errors if `player` is nil or lacks `userid` field (nil dereference on `player.userid`). Errors if `callback` is not a function.

### `ForEachLinkedItemForPlayer(player, callback, ...)`
*   **Description:** Iterates over all linked items owned by `player` without filtering by prefab.
*   **Parameters:**
    - `player` -- player entity instance
    - `callback` -- function called for each item (item, player, ...)
    - `...` -- additional arguments passed to callback
*   **Returns:** None
*   **Error states:** Errors if `player` is nil or lacks `userid` field (nil dereference on `player.userid`). Errors if `callback` is not a function.

### `OnPlayerJoined(player)`
*   **Description:** Handles a player joining the server. Assigns ownership of existing linked items to the player and handles skill tree initialization handshake.
*   **Parameters:** `player` -- player entity instance
*   **Returns:** None
*   **Error states:** Errors if `player` is nil or lacks `userid` field. Errors if `player._PostActivateHandshakeState_Server` is accessed on invalid player data.

### `OnPlayerLeft(player)`
*   **Description:** Handles a player leaving the server. Clears ownership on their linked items and removes them from tracking tables.
*   **Parameters:** `player` -- player entity instance
*   **Returns:** None
*   **Error states:** Errors if `player` is nil or lacks `userid` field. Errors if `self.inst:RemoveEventCallback` is called with invalid callback reference.

### `OnRegisterLinkedItem(data)`
*   **Description:** Registers a new item link via event data. Assigns owner inst if the player is currently connected.
*   **Parameters:** `data` -- table containing `owner_userid` and `item`
*   **Returns:** None
*   **Error states:** Errors if `data` is nil or lacks `owner_userid` or `item` fields. Errors if `data.item.components.linkeditem` is accessed on an item without the component.

### `OnUnregisterLinkedItem(data)`
*   **Description:** Unregisters an item link via event data. Clears ownership on the item.
*   **Parameters:** `data` -- table containing `owner_userid` and `item`
*   **Returns:** None
*   **Error states:** Errors if `data` is nil or lacks `owner_userid` or `item` fields. Errors if `data.item.components.linkeditem` is accessed on an item without the component.

## Events & listeners
- **Listens to:** `ms_playerjoined` (TheWorld) -- triggers `OnPlayerJoined`.
- **Listens to:** `ms_playerleft` (TheWorld) -- triggers `OnPlayerLeft`.
- **Listens to:** `ms_registerlinkeditem` (TheWorld) -- triggers `OnRegisterLinkedItem`.
- **Listens to:** `ms_unregisterlinkeditem` (TheWorld) -- triggers `OnUnregisterLinkedItem`.
- **Listens to:** `ms_skilltreeinitialized` (player) -- triggers `OnSkillTreeInitialized` callback for pending players.