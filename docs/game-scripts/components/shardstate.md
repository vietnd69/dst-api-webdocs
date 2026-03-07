---
id: shardstate
title: Shardstate
description: Manages the master session identifier for network synchronization in DST's shard system.
tags: [network, world, shard]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: d3ac3e93
system_scope: network
---

# Shardstate

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ShardState` is a network-aware component that maintains and synchronizes the master session identifier across the client and server in a DST shard setup. It ensures that both the master simulation and non-master instances have a consistent view of the world's session identifier, which is critical for operations such as user session serialization and client-server cache synchronization.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("shardstate")
local session_id = inst.components.shardstate:GetMasterSessionId()
-- Use session_id for session-specific logic or validation
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity instance | `nil` | Reference to the entity that owns this component. Initialized in constructor. |

## Main functions
### `GetMasterSessionId()`
*   **Description:** Returns the current master session identifier. On the master simulation, this value is authoritative; on non-master instances, it is synced via the network layer.
*   **Parameters:** None.
*   **Returns:** string — the session identifier string.
*   **Error states:** None.

## Events & listeners
- **Listens to:**  
  - `ms_newmastersessionid` (on master simulation): Updates the cached session identifier when triggered by `TheWorld`.
  - `mastersessioniddirty` (on non-master): Syncs the client-side cache with the server’s current session identifier and re-serializes user session data.
- **Pushes:** None.
