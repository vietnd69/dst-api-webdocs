---
id: writeable_classified
title: Writeable Classified
description: Serves as a client-side helper entity that coordinates with its parent writeable item to manage classified data attachment and lifecycle.
tags: [network, client, data]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: adec1dc9
system_scope: network
---

# Writeable Classified

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`writeable_classified` is a lightweight, client-only entity that acts as a bridge for classified data exchange between a writeable item (e.g., a journal or map) and its network replica. It is created only on the client, attaches to a parent entity, and ensures clean lifecycle management by removing itself when the parent is removed. It does not persist or simulate logic on the server.

## Usage example
```lua
-- Internally used by the game; not typically instantiated directly by mods
-- Typical usage happens when a writeable item is created:
local writeable = Prefab("my_writeable", ...)
writeable.onpostcreate = function(inst)
    inst:AddClassified("classifieddata")
end
```

## Dependencies & tags
**Components used:** `entity:Transform` (only on master), `entity:Network`  
**Tags:** Adds `CLASSIFIED`  
**Parent interaction:** Reads `inst.entity:GetParent()` and writes `inst._parent.writeable_classified`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_parent` | `Entity` (or `nil`) | `nil` | Reference to the parent writeable entity; set on client during replication. |
| `persists` | `boolean` | `false` | Hardcoded to `false` on the master; entity does not save to disk. |

## Main functions
### `OnEntityReplicated(inst)`
*   **Description:** Client-side callback triggered when the entity is replicated to the client. Initializes the `_parent` reference and attempts to attach classified data to the parent's replica component. If attachment fails, it assigns itself as `writeable_classified` on the parent and sets up cleanup.
*   **Parameters:** `inst` (`Entity`) — the classified instance being created.
*   **Returns:** Nothing.
*   **Error states:** Logs "Unable to initialize classified data for writeable" if `_parent` is `nil`.

### `OnRemoveEntity(inst)`
*   **Description:** Cleanup callback registered on the client. Removes the reference to this classified entity from the parent's `writeable_classified` property to avoid dangling references.
*   **Parameters:** `inst` (`Entity`) — the classified instance being removed.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls in this file).
- **Pushes:** None.