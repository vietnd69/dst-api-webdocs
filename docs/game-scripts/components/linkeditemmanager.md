---
id: linkeditemmanager
title: Linkeditemmanager
description: Manages persistent associations between player entities and linked items, ensuring items track their creator/owner and respond appropriately when players join or leave the world.
tags: [player, inventory, network, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ca7902c6
system_scope: entity
---

# Linkeditemmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`LinkedItemManager` is a server-side component responsible for maintaining dynamic relationships between player entities and "linked items"—items that must track which player created or owns them. It operates exclusively on the master simulation and ensures that when a `linkeditem` is registered, it receives the appropriate owner instance (via `SetOwnerInst`) and initialization callbacks (via `OnSkillTreeInitialized`) upon player join or skill tree readiness. This is necessary because standard `EntityTracker` cannot reliably handle player-specific item associations in DST.

## Usage example
```lua
-- Typically added automatically by the game on the master world.
-- Example of how a linked item registers itself during creation:
local inst = CreateEntity()
inst:AddComponent("linkeditem")
inst.components.linkeditem:SetOwnerInst(owner)
inst.components.linkeditem:OnSkillTreeInitialized()

-- Internally, items use the manager event:
TheWorld:PushEvent("ms_registerlinkeditem", {
    owner_userid = owner.userid,
    item = inst
})
```

## Dependencies & tags
**Components used:** `linkeditem` (via `data.item.components.linkeditem`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `linkeditems` | table | `{}` | Mapping of `player.userid` → `{ linked_item_instance → true }`, tracking all items associated with each player. |
| `players` | table | `{}` | Mapping of `player.userid` → `player` entity, for quick lookup of active players. |
| `waitingforinitialization` | table | `{}` | Tracks players whose skill trees have not yet initialized; items for such players delay `OnSkillTreeInitialized` calls. |

## Main functions
### `ForEachLinkedItemForPlayer(player, callback, ...)`
*   **Description:** Iterates over all linked items registered to a specific player and invokes a callback for each.
*   **Parameters:**
    *   `player` (Entity) — the player whose linked items to iterate over.
    *   `callback` (function) — called as `callback(item, player, ...)`.
    *   `...` — arbitrary additional arguments passed to the callback.
*   **Returns:** Nothing.
*   **Error states:** Uses `shallowcopy` to avoid iteration conflicts; safe to modify `linkeditems` during iteration.

### `OnPlayerJoined(player)`
*   **Description:** Registers a newly joined player, assigns current owner instances to any pre-existing linked items associated with them, and triggers `OnSkillTreeInitialized` if the skill tree is ready.
*   **Parameters:** `player` (Entity) — the joining player.
*   **Returns:** Nothing.
*   **Error states:** Skips snapshot user sessions (`player.is_snapshot_user_session == true`).

### `OnPlayerLeft(player)`
*   **Description:** Cleans up references to a leaving player by clearing their owner instance from linked items and removing them from internal tracking tables.
*   **Parameters:** `player` (Entity) — the leaving player.
*   **Returns:** Nothing.
*   **Error states:** Skips snapshot user sessions; safely removes callbacks if skill tree initialization is pending.

### `OnRegisterLinkedItem(data)`
*   **Description:** Registers a new linked item for a specific player. Sets the item’s owner and triggers initialization if the player is ready.
*   **Parameters:**
    *   `data` (table) with keys:
        *   `owner_userid` (string) — player user ID.
        *   `item` (Entity) — the linked item instance.
*   **Returns:** Nothing.
*   **Error states:** Ensures `item:IsValid()` and `linkeditem` component exists before acting.

### `OnUnregisterLinkedItem(data)`
*   **Description:** Removes an item from the manager's tracking for a given player and clears its owner instance.
*   **Parameters:**
    *   `data` (table) with keys:
        *   `owner_userid` (string) — player user ID.
        *   `item` (Entity) — the linked item instance.
*   **Returns:** Nothing.
*   **Error states:** Returns early if the player’s item group is not registered.

## Events & listeners
- **Listens to:**
  - `ms_playerjoined` — triggers `OnPlayerJoined` on new player join.
  - `ms_playerleft` — triggers `OnPlayerLeft` on player logout/leave.
  - `ms_registerlinkeditem` — triggers `OnRegisterLinkedItem` when an item registers itself.
  - `ms_unregisterlinkeditem` — triggers `OnUnregisterLinkedItem` when an item unregisters.
  - `ms_skilltreeinitialized` — per-player event listened for delayed initialization.
- **Pushes:** None.

`<`!-- End of documentation -->
