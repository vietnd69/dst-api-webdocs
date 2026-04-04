---
id: attunable
title: Attunable
description: Manages persistent links between entities and players, enabling attunement mechanics for items like resurrection effigies.
tags: [entity, persistence, player, networking]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: components
source_hash: d9a497e2
system_scope: entity
---

# Attunable

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
The `Attunable` component manages the relationship between an entity (such as a Resurrection Effigy) and players who have "attuned" to it. It tracks both online and offline players, ensuring persistence across sessions. It enforces grouping logic via tags, preventing players from attuning to multiple entities of the same group simultaneously. This component works in tandem with the `attuner` component found on player entities.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("attunable")

-- Set a group tag to limit attunement scope
inst.components.attunable:SetAttunableTag("resurrector")

-- Define custom logic for linking
inst.components.attunable:SetOnLinkFn(function(entity, player, isloading)
    print(player.name.." attuned to "..entity.prefab)
end)

-- Link a specific player
inst.components.attunable:LinkToPlayer(ThePlayer, false)
```

## Dependencies & tags
**Components used:** `attuner` (required on player entity for validation).
**Tags:** 
- Adds `ATTUNABLE_ID_<GUID>` (unique identifier per entity instance).
- Adds dynamic tag defined by `SetAttunableTag` (e.g., `resurrector`) to classified entities spawned during linking.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `attuned_players` | table | `{}` | Stores currently online player instances that are attuned. |
| `attuned_userids` | table | `{}` | Stores user IDs of offline players who remain attuned. |
| `attunable_tag` | string/nil | `nil` | Group identifier used to enforce mutual exclusivity (e.g., only one resurrector). |
| `onattunecostfn` | function/nil | `nil` | Callback to validate cost or conditions before linking. |
| `onlinkfn` | function/nil | `nil` | Callback fired immediately after a successful link. |
| `onunlinkfn` | function/nil | `nil` | Callback fired immediately after a link is removed. |

## Main functions
### `SetAttunableTag(tag)`
*   **Description:** Assigns a group tag to this attunable entity. Used to prevent players from attuning to multiple entities of the same type.
*   **Parameters:** `tag` (string) - The group identifier.
*   **Returns:** Nothing.

### `LinkToPlayer(player, isloading)`
*   **Description:** Establishes a link between the entity and a specific player. Spawns a classified entity and registers events.
*   **Parameters:** 
    - `player` (entity) - The player instance to attune.
    - `isloading` (boolean) - True if restoring from save data (skips cost checks).
*   **Returns:** `true` on success, `false` on failure.
*   **Error states:** Returns `false` if `CanAttune` fails or `onattunecostfn` returns failure.

### `UnlinkFromPlayer(player, isloading)`
*   **Description:** Removes the attunement link for a specific player. Cleans up events and classified entities.
*   **Parameters:** 
    - `player` (entity) - The player instance to unattune.
    - `isloading` (boolean) - Passed to the unlink callback.
*   **Returns:** Nothing.

### `IsAttuned(player)`
*   **Description:** Checks if a specific player is currently attuned to this entity.
*   **Parameters:** `player` (entity) - The player instance to check.
*   **Returns:** `true` if attuned, `false` otherwise.

### `CanAttune(player)`
*   **Description:** Validates if a player is eligible to attune (has valid userid, has `attuner` component, not already attuned).
*   **Parameters:** `player` (entity) - The player instance to validate.
*   **Returns:** `true` if eligible, `false` otherwise.

### `OnSave()`
*   **Description:** Serializes attuned user IDs for persistence.
*   **Parameters:** None.
*   **Returns:** Table containing `links` array of user IDs, or `nil` if empty.

### `OnLoad(data)`
*   **Description:** Restores attunement links from save data. Re-links online players and caches offline IDs.
*   **Parameters:** `data` (table) - Save data containing `links`.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** 
    - `ms_playerjoined` (on `TheWorld`) - Re-links players who join the server.
    - `onremove` (on `player`) - Cleans up link when a player entity is removed.
    - `attuned` (on `player`) - Detects if a player attunes to a conflicting entity.
- **Pushes:** 
    - `attuned` (on `player`) - Fired when a successful link is established.