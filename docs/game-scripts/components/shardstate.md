---
id: shardstate
title: Shardstate
description: Manages synchronization of the master session identifier across networked entities in DST's shard architecture.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: d3ac3e93
---

# Shardstate

## Overview
This component ensures consistent synchronization of the master session identifier between the server and clients in a Don't Starve Together shard environment. It uses a networked string variable (`net_string`) to propagate the session ID during initialization and when the ID changes on the master, and triggers local updates (e.g., session caching and user serialization) on clients upon receiving synchronization events.

## Dependencies & Tags
- Relies on `net_string` (implicitly via `net_string(...)` call).
- No other components are added or removed by this script.
- Listens to and dispatches custom events (`ms_newmastersessionid`, `mastersessioniddirty`) scoped to `TheWorld` (server) or `inst` (client).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity this component is attached to (typically the player or world root). |
| `_mastersessionid` | `net_string` | Initialized with `TheWorld.meta.session_identifier` | Networked string variable storing the current master session identifier. |

*Note:* No explicit public properties beyond `inst` are defined in `_ctor`. All other state is held in local (private) scope.

## Main Functions

### `GetMasterSessionId()`
* **Description:** Returns the current value of the master session identifier stored in the networked variable `_mastersessionid`.
* **Parameters:** None.

## Events & Listeners
- **Listens to `ms_newmastersessionid` (server only):**  
  When received on the master, updates `_mastersessionid` with the new session ID passed as the event argument (`session_id`).
- **Listens to `mastersessioniddirty` (client only):**  
  Triggers `TheNet:SetClientCacheSessionIdentifier` and `SerializeUserSession` to update local session state when the server updates the identifier.

- **Triggers `ms_newmastersessionid` (server only):**  
  Not directly triggered by this component; expected to be fired elsewhere in the codebase when the master session ID changes (e.g., during shard handover or session reset).
- **Triggers `mastersessioniddirty` (client only):**  
  Not directly triggered here; expected to be fired by the network layer when `_mastersessionid` is updated on the server.