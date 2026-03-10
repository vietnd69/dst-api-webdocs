---
id: networkclientrpc
title: Networkclientrpc
description: Manages game-wide RPC (Remote Procedure Call) dispatch, validation, queuing, and rate-limiting for server-bound, client-bound, and shard-bound messages in Don't Starve Together.
tags: [network, rpc, player, server, client]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: cb53f523
system_scope: network
---

# Networkclientrpc

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
Networkclientrpc serves as the central RPC subsystem for Don't Starve Together, responsible for defining, validating, queuing, and dispatching both built-in and modded remote procedure calls across server, client, and shard tiers. It implements strict input validation, per-sender rate limiting, timeline-aware queuing, and support for platform-relative coordinate conversion. All RPCs are sent or received via encoded numeric or string-based codes and processed in `HandleRPCQueue()` once queued by dedicated handler functions (e.g., `HandleRPC`, `HandleModRPC`, `HandleClientModRPC`, etc.). The system also supports mod registration of custom RPCs (`AddModRPCHandler`, etc.) and provides utilities like `DisableRPCSending()` for safe shutdown transitions.

## Usage example
```lua
-- Register a modded server RPC
AddModRPCHandler("my_mod", "sync_entity", function(sender, data)
    local entity = data.entity
    if entity and entity.valid then
        -- Process server-side entity update
        print("Synced entity:", entity.prefab)
    end
end)

-- Send the RPC to the server
SendModRPCToServer(MOD_RPC["my_mod"]["sync_entity"], { entity = TheEntity })
```

## Dependencies & tags
**Components used:**
- `components/builder`
- `components/container`
- `components/cookbookupdater`
- `components/giftreceiver`
- `components/inventory`
- `components/locomotor`
- `components/plantregistryupdater`
- `components/playercontroller`
- `components/shardtransactionsteps`
- `components/skilltreeupdater`
- `components/steeringwheeluser`
- `components/talker`
- `components/walkableplatform`
- `components/worldmigrator`
- `components/writeable`

**Tags:**
- `invalidrpc` (pushed by `printinvalid()`)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `id` (via `WorldMigrator`) | `number?` | `nil` | Numeric identifier used in `ReskinWorldMigrator` RPC. |

## Main functions
### `checkbool(val)`
* **Description:** Validates whether `val` is `nil` or a boolean.  
* **Parameters:** `val` — value to check.  
* **Returns:** `true` if `val == nil or type(val) == "boolean"`, else `false`.  

### `checknumber(val)`
* **Description:** Validates whether `val` is a number.  
* **Parameters:** `val` — value to check.  
* **Returns:** `true` if `type(val) == "number"`, else `false`.  

### `checkuint(val)`
* **Description:** Validates whether `val` is a non-negative integer (no non-digit characters in string form).  
* **Parameters:** `val` — value to check.  
* **Returns:** `true` if `type(val) == "number"` and `tostring(val):find("%D") == nil`, else `false`.  

### `checkstring(val)`
* **Description:** Validates whether `val` is a string.  
* **Parameters:** `val` — value to check.  
* **Returns:** `true` if `type(val) == "string"`, else `false`.  

### `checkentity(val)`
* **Description:** Validates whether `val` is a table (used to represent an entity).  
* **Parameters:** `val` — value to check.  
* **Returns:** `true` if `type(val) == "table"`, else `false`.  

### `optbool(val)`
* **Description:** Alias for `checkbool(val)`.  
* **Parameters:** `val` — value to check.  
* **Returns:** Same as `checkbool(val)`.  

### `optnumber(val)`
* **Description:** Validates whether `val` is `nil` or a number.  
* **Parameters:** `val` — value to check.  
* **Returns:** `true` if `val == nil or type(val) == "number"`, else `false`.  

### `optuint(val)`
* **Description:** Validates whether `val` is `nil` or a non-negative integer.  
* **Parameters:** `val` — value to check.  
* **Returns:** `true` if `val == nil or (type(val) == "number" and tostring(val):find("%D") == nil)`, else `false`.  

### `optstring(val)`
* **Description:** Validates whether `val` is `nil` or a string.  
* **Parameters:** `val` — value to check.  
* **Returns:** `true` if `val == nil or type(val) == "string"`, else `false`.  

### `optentity(val)`
* **Description:** Validates whether `val` is `nil` or a table (entity).  
* **Parameters:** `val` — value to check.  
* **Returns:** `true` if `val == nil or type(val) == "table"`, else `false`.  

### `printinvalid(rpcname, player)`
* **Description:** Logs an invalid RPC message, pushes the `"invalidrpc"` event, and asserts in dev builds.  
* **Parameters:**  
  - `rpcname` — string name of the RPC.  
  - `player` — player entity or player-like table (must have `userid` and `name`).  
* **Returns:** None.  

### `printinvalidplatform(rpcname, player, action, relative_x, relative_z, platform, platform_relative)`
* **Description:** Logs detailed platform location failure when `platform_relative == true` and `platform == nil`.  
* **Parameters:** As listed.  
* **Returns:** None.  

### `IsRotationValid(rot)`
* **Description:** Checks if `rot` is a finite number (not ±inf, NaN).  
* **Parameters:** `rot` — rotation value.  
* **Returns:** `true` if `rot > -math.huge and rot < math.huge`, else `false`.  

### `IsPointInRange(player, x, z)`
* **Description:** Checks whether position (`x`, `z`) is within 64 units (squared distance ≤ 4096) of the player.  
* **Parameters:**  
  - `player` — player entity.  
  - `x`, `z` — coordinates.  
* **Returns:** `true` if squared distance ≤ 4096, else `false`.  

### `ConvertPlatformRelativePositionToAbsolutePosition(relative_x, relative_z, platform, platform_relative)`
* **Description:** Converts platform-relative coordinates to absolute world coordinates if valid.  
* **Parameters:** As listed.  
* **Returns:** `relative_x, relative_z` (absolute world space) if valid; `nil` if conversion fails.  

### `HandleRPC(sender, tick, code, data)`
* **Description:** Queues valid server-bound RPCs for delayed processing, enforcing per-sender rate limits.  
* **Parameters:**  
  - `sender` — player entity (or userid string for certain RPCs).  
  - `tick` — game tick number.  
  - `code` — RPC code (number).  
  - `data` — payload table.  
* **Returns:** None.  

### `HandleClientRPC(tick, code, data)`
* **Description:** Queues valid client-bound RPCs for processing.  
* **Parameters:** As listed.  
* **Returns:** None.  

### `HandleShardRPC(sender, tick, code, data)`
* **Description:** Queues valid shard-bound RPCs for processing.  
* **Parameters:** As listed.  
* **Returns:** None.  

### `HandleModRPC(sender, tick, namespace, code, data)`
* **Description:** Processes incoming modded RPCs for server use. Validates sender, code, and namespace; queues valid RPCs.  
* **Parameters:**  
  - `sender` — player entity or userid (number/string).  
  - `tick` — game tick number.  
  - `namespace` — RPC namespace string.  
  - `code` — RPC code string.  
  - `data` — payload table.  
* **Returns:** None.  

### `HandleClientModRPC(tick, namespace, code, data)`
* **Description:** Handles client-side modded RPCs. Validates and enqueues for immediate client execution.  
* **Parameters:** As listed.  
* **Returns:** None.  

### `HandleShardModRPC(sender, tick, namespace, code, data)`
* **Description:** Handles shard-level modded RPCs. Validates and enqueues for shard processing.  
* **Parameters:** As listed.  
* **Returns:** None.  

### `HandleRPCQueue()`
* **Description:** Processes queued RPCs respecting per-sender rate limits and timeline ordering.  
* **Parameters:** None.  
* **Returns:** None.  

### `TickRPCQueue()`
* **Description:** Resets per-frame RPC timeline state. Must be called once per tick.  
* **Parameters:** None.  
* **Returns:** None.  

### `AddModRPCHandler(namespace, name, fn)`
* **Description:** Registers a modded server RPC handler. Increments `RPC_QUEUE_RATE_LIMIT`.  
* **Parameters:**  
  - `namespace` — mod namespace string.  
  - `name` — RPC name string.  
  - `fn` — handler function.  
* **Returns:** None.  

### `AddClientModRPCHandler(namespace, name, fn)`
* **Description:** Registers a modded client RPC handler.  
* **Parameters:** As listed.  
* **Returns:** None.  

### `AddShardModRPCHandler(namespace, name, fn)`
* **Description:** Registers a modded shard RPC handler.  
* **Parameters:** As listed.  
* **Returns:** None.  

### `SendModRPCToServer(id_table, ...)`
* **Description:** Sends a modded RPC to the server.  
* **Parameters:**  
  - `id_table` — table with keys `namespace` and `id` (e.g., from `MOD_RPC[namespace][name]`).  
  - `...` — additional data arguments.  
* **Returns:** None.  

### `SendModRPCToClient(id_table, ...)`
* **Description:** Sends a modded RPC to clients.  
* **Parameters:** As listed.  
* **Returns:** None.  

### `SendModRPCToShard(id_table, ...)`
* **Description:** Sends a modded RPC to shards.  
* **Parameters:** As listed.  
* **Returns:** None.  

### `SendRPCToServer(code, ...)`
* **Description:** Sends a built-in RPC to the server.  
* **Parameters:**  
  - `code` — numeric RPC code.  
  - `...` — data arguments.  
* **Returns:** None.  

### `SendRPCToClient(code, ...)`
* **Description:** Sends a built-in client RPC.  
* **Parameters:** As listed.  
* **Returns:** None.  

### `SendRPCToShard(code, ...)`
* **Description:** Sends a built-in shard RPC.  
* **Parameters:** As listed.  
* **Returns:** None.  

### `GetModRPCHandler(namespace, name)`
* **Description:** Retrieves the underlying handler function for a modded RPC.  
* **Parameters:**  
  - `namespace` — RPC namespace string.  
  - `name` — RPC name string.  
* **Returns:** Function (handler) or `nil`.  

### `GetClientModRPCHandler(namespace, name)`
* **Description:** Same as `GetModRPCHandler`, but for client RPCs.  
* **Parameters:** As listed.  
* **Returns:** Function (client handler) or `nil`.  

### `GetShardModRPCHandler(namespace, name)`
* **Description:** Same as `GetModRPCHandler`, but for shard RPCs.  
* **Parameters:** As listed.  
* **Returns:** Function (shard handler) or `nil`.  

### `GetModRPC(namespace, name)`
* **Description:** Returns the raw RPC metadata table (`MOD_RPC[namespace][name]`).  
* **Parameters:** As listed.  
* **Returns:** RPC metadata table or `nil`.  

### `GetClientModRPC(namespace, name)`
* **Description:** Same as `GetModRPC`, but for client RPCs.  
* **Parameters:** As listed.  
* **Returns:** Metadata table or `nil`.  

### `GetShardModRPC(namespace, name)`
* **Description:** Same as `GetModRPC`, but for shard RPCs.  
* **Parameters:** As listed.  
* **Returns:** Metadata table or `nil`.  

### `MarkUserIDRPC(namespace, name)`
* **Description:** Marks an RPC handler as requiring a valid userid for authentication. Supports two call signatures.  
* **Parameters:**  
  - `namespace` — optional namespace string (if `name` omitted, treated as `name`).  
  - `name` — RPC name string.  
* **Returns:** None.  

### `DisableRPCSending()`
* **Description:** Replaces all RPC-sending functions with no-op stubs to prevent outgoing calls during shutdown/reset.  
* **Parameters:** None.  
* **Returns:** None.  

## Events & listeners
- **Pushes:** `"invalidrpc"` — fires when `printinvalid()` is called; includes payload `{ player = player, rpcname = rpcname }`.  
- **Listens to:** None.