---
id: constructionsite_classified
title: Constructionsite Classified
description: Manages per-slot item counts for construction sites, with server-authoritative storage and client-side replication for network synchronization.
tags: [network, construction, replication]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 48f7e0f5
system_scope: network
---

# Constructionsite Classified

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`constructionsite_classified` is a classified entity component that stores and synchronizes per-slot item counts for construction sites across the server and clients. It is not a standalone prefab but a helper entity created and attached to construction site prefabs to manage replicated data. The component maintains up to `MAX_SLOTS` (4) independent counters, each representing the number of items in a specific construction slot. It avoids persistence by setting `inst.persists = false`, indicating it is ephemeral and rebuilt dynamically.

## Usage example
This component is not directly instantiated by modders. Instead, it is automatically attached to construction site prefabs during their construction. Client and server interact with it as follows:
```lua
-- On the server (typically from the parent constructionsite's logic):
inst.constructionsite_classified:SetSlotCount(slot_index, new_count)

-- On both server and client (reading slot counts):
local count = inst:GetSlotCount(slot_index)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `CLASSIFIED` to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_slotcounts` | table of `net_byte` | `{}` (4 entries, indices 1–4) | Networked storage for per-slot counts. |
| `_parent` | `Entity` | `nil` (client only, set after replication) | Reference to the parent construction site entity (client-side only). |

## Main functions
### `GetSlotCount(inst, slot)`
*   **Description:** Returns the current item count for the specified construction slot. Safe for use on both server and client.
*   **Parameters:** `slot` (number) – the slot index (`1` to `4`).
*   **Returns:** number – the current count in the slot (defaults to `0` if slot is uninitialized).
*   **Error states:** None.

### `SetSlotCount(inst, slot, num)`
*   **Description:** Sets the item count for a given slot. Available only on the server.
*   **Parameters:**  
  `slot` (number) – the slot index (`1` to `4`).  
  `num` (number) – the new count to store.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `entityremoved` – clears the `constructionsite_classified` reference on the parent when the classified entity is destroyed.
- **Pushes:** None.