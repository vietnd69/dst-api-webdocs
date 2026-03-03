---
id: named_replica
title: Named Replica
description: Manages network-replicated name and author information for entities in DST's multiplayer system.
tags: [network, entity]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 936a8f23
system_scope: network
---

# Named Replica

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Named Replica` is a lightweight component that handles the replication of entity name and author metadata between server and clients in multiplayer sessions. It creates networked variables (`net_string`) for `_name` and `_author_netid`, and sets up local listeners on non-master clients to synchronize `inst.name` and `inst.name_author_netid` when changes occur. The component is intended for server-authoritative updates only.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("named_replica")
-- Server-side only
inst.components.named_replica:SetName("Legendary Artifact", "Player123")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.replica.named._name` | net_string | (created in constructor) | Networked string for the entity's display name. |
| `inst.replica.named._author_netid` | net_string | (created in constructor) | Networked string for the entity's author netid. |
| `inst.name` | string | `STRINGS.NAMES[UPPERCASE_PREFAB]` | Local cached name, synced from replica. |
| `inst.name_author_netid` | string or nil | `nil` | Local cached author netid, synced from replica. |

## Main functions
### `SetName(name, author)`
*   **Description:** Sets the entity's name and author netid on the server. Values are replicated to all clients.
*   **Parameters:**  
    `name` (string) — The display name to assign.  
    `author` (string) — The netid of the entity's author (e.g., player who placed or created it).  
*   **Returns:** Nothing.
*   **Error states:** Only executes on the master simulation (`TheWorld.ismastersim`). Client calls have no effect.

## Events & listeners
- **Listens to:**  
    `namedirty` — Triggers `OnNameDirty()` to update `inst.name` from the replica name on non-master clients.  
    `authordirty` — Triggers `OnAuthorDirty()` to update `inst.name_author_netid` from the replica author on non-master clients.  
- **Pushes:** None.
