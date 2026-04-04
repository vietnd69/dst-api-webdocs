---
id: attuner
title: Attuner
description: Manages attunement relationships between a player and attunable entities.
tags: [player, network, utility]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: components
source_hash: 9f4d7e52
system_scope: player
---

# Attuner

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
The `Attuner` component tracks attunement links between a player entity and other attunable entities in the world. It handles synchronization differences between the server and client, storing GUIDs on the server and proxies or tags on the client. This component is typically added to player prefabs to manage artifact or ruin attunement states.

## Usage example
```lua
local player = GetPlayers()[1]
player:AddComponent("attuner")

-- Register a proxy source for attunement
local proxy = GetProxyEntity()
player.components.attuner:RegisterAttunedSource(proxy)

-- Check attunement status
if player.components.attuner:IsAttunedTo(target) then
    -- Trigger attuned logic
end
```

## Dependencies & tags
**Components used:** `attunable` (accessed during transfer operations)
**Tags:** Checks dynamic tags matching `ATTUNABLE_ID_` followed by an ID; checks custom tags passed to functions. Does not add tags to the owner entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The owner entity instance. |
| `ismastersim` | boolean | `TheWorld.ismastersim` | Cached flag indicating if running on the server. |
| `attuned` | table | `{}` | Stores attuned sources; GUIDs on server, proxies on client. |

## Main functions
### `IsAttunedTo(target)`
*   **Description:** Checks if the owner is attuned to a specific target entity. On the server, it checks the `attuned` table by GUID. On the client, it checks for specific tags on the target.
*   **Parameters:** `target` (entity) - The entity to check against.
*   **Returns:** `boolean` - `true` if attuned, `false` otherwise.

### `HasAttunement(tag)`
*   **Description:** Iterates through all attuned sources to check if any possess a specific tag.
*   **Parameters:** `tag` (string) - The tag to search for among attuned entities.
*   **Returns:** `boolean` - `true` if any attuned source has the tag.

### `GetAttunedTarget(tag)`
*   **Description:** Server-only function. Returns the entity instance associated with a specific attunement tag.
*   **Parameters:** `tag` (string) - The tag identifying the attuned target.
*   **Returns:** `entity` or `nil` - The entity instance if found, otherwise `nil`.
*   **Error states:** Returns `nil` on clients or if no matching tag is found.

### `TransferComponent(newinst)`
*   **Description:** Server-only function. Transfers all attunement links from the current owner instance to a new instance (e.g., during resurrection). It unlinks from the old player and links to the new one via the `attunable` component.
*   **Parameters:** `newinst` (entity) - The new owner entity instance.
*   **Returns:** Nothing.
*   **Error states:** Does nothing on clients due to `ismastersim` check.

### `RegisterAttunedSource(proxy)`
*   **Description:** Adds a proxy source to the attuned table and pushes a notification event. Ensures duplicates are not added.
*   **Parameters:** `proxy` (table/object) - The attunement source proxy containing `source_guid`.
*   **Returns:** Nothing.

### `UnregisterAttunedSource(proxy)`
*   **Description:** Removes a proxy source from the attuned table and pushes a notification event.
*   **Parameters:** `proxy` (table/object) - The attunement source proxy to remove.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted string listing all attuned entities or IDs for debugging purposes. Format differs between server and client.
*   **Parameters:** None.
*   **Returns:** `string` - Debug information.

## Events & listeners
- **Listens to:** None identified in this component.
- **Pushes:** `gotnewattunement` - Fired when a new source is registered; data includes `proxy`.
- **Pushes:** `attunementlost` - Fired when a source is unregistered; data includes `proxy`.