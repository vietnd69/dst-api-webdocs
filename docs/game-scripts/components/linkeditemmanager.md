---
id: linkeditemmanager
title: Linkeditemmanager
description: Manages bidirectional associations between players and items requiring persistent ownership tracking, ensuring items linked to a player are notified of ownership changes when players join, leave, or initialize.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: ca7902c6
---

# Linkeditemmanager

## Overview
This component operates on the master simulation thread and maintains a registry of items that are linked to specific players—ensuring that those items can dynamically update their reference to the current owner when the player joins or leaves the world. It coordinates with the `linkeditem` component on individual items and supports initialization synchronization via the skill tree handshake. It is intended for use cases such as tracking item creators or assigning transient ownership that must survive player disconnections.

## Dependencies & Tags
- **Requires master simulation**: Asserts `TheWorld.ismastersim` and does not instantiate on clients.
- **No components added**: It is a standalone manager, not attached to entities.
- **No tags set**: Does not add or remove tags from entities.
- **Dependencies on external events**:
  - `ms_playerjoined`
  - `ms_playerleft`
  - `ms_registerlinkeditem`
  - `ms_unregisterlinkeditem`
  - `ms_skilltreeinitialized`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed to constructor) | Reference to the owner entity of this manager (typically the world root). |
| `linkeditems` | `table<uint, table<Entity, boolean>>` | `{}` | Maps `userid` → set of linked item entities. |
| `players` | `table<uint, Entity>` | `{}` | Maps `userid` → active player entity. |
| `waitingforinitialization` | `table<Entity, boolean>` | `{}` | Tracks players awaiting skill tree initialization before calling `OnSkillTreeInitialized` on their linked items. |
| `OnSkillTreeInitialized` | `function` | (lambda function) | Callback triggered when a player finishes skill tree initialization; dispatches initialization to pending linked items. |

## Main Functions

### `ForEachLinkedItemForPlayer(player, callback, ...)`
* **Description:** Iterates over all items currently linked to a given player and invokes the provided callback on each. Uses a shallow copy of the items set to avoid modification during iteration.
* **Parameters:**
  - `player` (`Entity`): The player whose linked items should be processed.
  - `callback` (`function`): Function to call for each item; signature is `callback(item, player, ...)`.
  - `...` (`any`, optional): Additional arguments forwarded to the callback.

### `OnPlayerJoined(player)`
* **Description:** Handles registration of a newly joined player: records the player, updates all previously registered items for this player with the new owner reference, and triggers initialization if the player is ready.
* **Parameters:**
  - `player` (`Entity`): The player entity that just joined.
  - **Skips snapshot sessions** (`player.is_snapshot_user_session` is ignored).
  - If the player is already `READY` for skill tree use, linked items are initialized immediately.
  - Otherwise, registers for the `ms_skilltreeinitialized` event.

### `OnPlayerLeft(player)`
* **Description:** Handles cleanup when a player leaves: clears all linked items' owner references for this player, removes the player from tracking, and cancels pending skill tree initialization.
* **Parameters:**
  - `player` (`Entity`): The player entity that left.

### `OnRegisterLinkedItem(data)`
* **Description:** Registers a new item as linked to a specific player, updating internal bookkeeping and immediately assigning ownership if the player is active.
* **Parameters:**
  - `data` (`table`): Must contain:
    - `owner_userid` (`uint`)
    - `item` (`Entity`)
  - Creates the per-player item set if missing.
  - Sets `linkeditem` component's owner to the current player (if present).
  - Calls `OnSkillTreeInitialized` on the item if the player is already ready.

### `OnUnregisterLinkedItem(data)`
* **Description:** Removes an item from a player’s linked set and clears its owner reference.
* **Parameters:**
  - `data` (`table`): Must contain:
    - `owner_userid` (`uint`)
    - `item` (`Entity`)
  - Cleans up empty per-player sets.
  - Notifies the item’s `linkeditem` component that ownership is cleared.

## Events & Listeners
- **Listens for:**
  - `ms_playerjoined` → calls `OnPlayerJoined`
  - `ms_playerleft` → calls `OnPlayerLeft`
  - `ms_registerlinkeditem` → calls `OnRegisterLinkedItem`
  - `ms_unregisterlinkeditem` → calls `OnUnregisterLinkedItem`
  - `ms_skilltreeinitialized` (per-player) → calls `OnSkillTreeInitialized` (callback function)
- **Emits no events**: This component acts as a passive coordinator and does not push events to other systems.