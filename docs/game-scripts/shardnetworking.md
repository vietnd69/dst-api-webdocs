---
id: shardnetworking
title: Shardnetworking
description: Manages cross-shard network communication, including world connectivity, portal linking, and event synchronization between shards in Don't Starve Together.
tags: [network, world, multiplayer]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 495761f3
system_scope: network
---

# Shardnetworking

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Shardnetworking` is a global module (not a component) responsible for coordinating communication between multiple game shards (e.g., "Master" and "Caves"). It maintains a registry of connected shards, automatically links world portals to available shards, synchronizes world settings, and forwards events (e.g., boss defeats, votes, dice rolls) across shards. It interacts heavily with `worldmigrator` for portal management and `shardtransactionsteps` for data transactions.

## Usage example
This module does not use components — it provides standalone functions for shard coordination. Typical usage is internal, triggered automatically by `ShardManager` during connection events:

```lua
-- Example of manually triggering portal update after shard connection (rarely needed)
if TheWorld and TheWorld.components.worldmigrator then
    Shard_UpdatePortalState(TheWorld)
end

-- Example of syncing a boss defeat event from a secondary shard
Shard_SyncBossDefeated("boss_prefab_name", shard_id)
```

## Dependencies & tags
**Components used:** `shard_mermkingwatcher`, `shardtransactionsteps`, `worldmigrator`  
**Tags:** Checks `inst:HasTag("tag")` indirectly via `worldmigrator`; no tags added or removed by this module.  
**External modules:** `map/customize` (via `require`)

## Properties
No public properties — all state is held in module-level variables:
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `ShardPortals` | table | `{}` | List of portal entities to manage automatically. |
| `ShardList` | table | `{}` | List of connected shard IDs (simple boolean map). |
| `ShardConnected` | table | `{}` | Map of `world_id` → `{ ready, tags, world, shard_name }` for connected shards. |
| `RecentDiceRolls` | table | `{}` | Tracks per-user cooldown timestamps for dice roll requests. |

## Main functions
### `Shard_IsMaster()`
*   **Description:** Determines if the current shard is the primary ("master") shard. Returns `true` for the main world if not secondary.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if this shard is the master.
*   **Error states:** None.

### `Shard_IsWorldAvailable(world_id)`
*   **Description:** Checks if a given world/shard is currently connected.
*   **Parameters:** `world_id` (string or number) — the shard identifier.
*   **Returns:** `boolean` — `true` if the world is connected or matches the current shard.
*   **Error states:** Returns `false` if `world_id` is `nil`.

### `Shard_SyncWorldSettings(world_id, is_resync)`
*   **Description:** Syncs world generation overrides (e.g., God Mode, starting season) from the master shard to a target shard, or triggers resync on secondaries.
*   **Parameters:**  
    `world_id` (string or number) — target shard ID.  
    `is_resync` (boolean) — if `true`, labels message as "Resyncing"; otherwise "Sending".
*   **Returns:** Nothing.
*   **Error states:** No effect if `worldoptions.overrides` is empty or no syncable options match `Customize.GetSyncOptions()`.

### `Shard_OnShardConnected(world_id, tags, world_data, shard_name)`
*   **Description:** Callback invoked when a shard connects. On master, sends world settings; on secondaries, requests resync. Also triggers `shardtransactionsteps:OnShardConnected()` and resyncs `shard_mermkingwatcher` net vars.
*   **Parameters:** Same as `Shard_UpdateWorldState`.
*   **Returns:** Nothing.

### `Shard_UpdateWorldState(world_id, state, tags, world_data, shard_name)`
*   **Description:** Updates internal shard registry based on connection status. Handles portal auto-linking: binds new portals to first available matching shard, or updates linked portals on connect/disconnect events.
*   **Parameters:**  
    `world_id` (string or number) — shard ID.  
    `state` (string) — remote shard state (e.g., `"READY"`).  
    `tags` (table) — shard tags.  
    `world_data` (string) — compressed world data string.  
    `shard_name` (string) — e.g., `"Master"` or `"Caves"`.
*   **Returns:** Nothing.
*   **Error states:** Decoding failures silently default `world_data` to `{}`.

### `Shard_UpdatePortalState(inst)`
*   **Description:** Called when a new portal is spawned. Automatically links it to an available shard if `linkedWorld` is `nil`, or validates the existing link.
*   **Parameters:** `inst` (entity) — portal entity with `worldmigrator` component.
*   **Returns:** Nothing.
*   **Error states:** No effect if `linkedWorld` is already set and valid.

### `Shard_CreateTransaction_TransferInventoryItem(shardid, item, migrationdata)`
*   **Description:** Convenience wrapper around `shardtransactionsteps:CreateTransaction()` to initiate an inventory item transfer to another shard.
*   **Parameters:**  
    `shardid` (string or number) — destination shard ID.  
    `item` (entity) — the inventory item to transfer.  
    `migrationdata` (table) — optional metadata for migration context.
*   **Returns:** Nothing.
*   **Error states:** Internally asserts if `shardid` matches the current shard.

### `Shard_SyncBossDefeated(bossprefab, shardid)`
*   **Description:** Synchronizes boss defeat events across shards. On master, fires `master_shardbossdefeated` event; on secondaries, sends RPC to master.
*   **Parameters:**  
    `bossprefab` (string) — boss prefab name.  
    `shardid` (string or number, optional) — shard where boss was defeated (defaults to current shard).
*   **Returns:** Nothing.

### `Shard_SyncMermKingExists(exists, shardid)`
*   **Description:** Synchronizes the existence state of the Merm King boss across shards.
*   **Parameters:**  
    `exists` (boolean) — whether the Merm King exists.  
    `shardid` (string or number, optional).
*   **Returns:** Nothing.
*   **Error states:** Uses `DoTaskInTime(0, ...)` to delay RPC on secondaries for load timing.

### `Shard_OnDiceRollRequest(user_id)`
*   **Description:** Validates a player’s dice roll request on the master shard. Enforces per-user cooldown (`TUNING.DICE_ROLL_COOLDOWN`). Cleans old entries.
*   **Parameters:** `user_id` (string or number) — player user ID.
*   **Returns:** `boolean` — `true` if roll is allowed; `false` if on cooldown or not on master.
*   **Error states:** No effect if `TheWorld` is `nil` or shard is not master.

### `Shard_StartVote(command_id, starter_id, target_id)`
*   **Description:** Broadcasts a vote start event from master shard.
*   **Parameters:**  
    `command_id` (string or number) — unique vote hash.  
    `starter_id` (string or number) — user ID of initiator.  
    `target_id` (string or number) — user ID being voted on.
*   **Returns:** Nothing.
*   **Error states:** No effect if `TheWorld` is `nil` or shard is not master.

### `Shard_StopVote()` / `Shard_ReceiveVote(selection, user_id)`
*   **Description:** Broadcasts vote stop or vote received events from master shard.
*   **Parameters:** `selection` (any), `user_id` (string or number).
*   **Returns:** Nothing.
*   **Error states:** No effect if `TheWorld` is `nil` or shard is not master.

## Events & listeners
- **Listens to:** None directly — this is a global module, not a component.
- **Pushes (via `TheWorld:PushEvent` on master shard):**  
    - `ms_newmastersessionid(session_id)`  
    - `ms_save()`  
    - `ms_startvote({ commandhash, starteruserid, targetuserid })`  
    - `ms_stopvote()`  
    - `ms_receivevote({ selection, userid })`  
    - `master_shardbossdefeated({ bossprefab, shardid })`  
    - `master_shardmermkingexists({ exists, shardid })`  
    - `master_shardmermkingtrident({ pickedup, shardid })`  
    - `master_shardmermkingcrown({ pickedup, shardid })`  
    - `master_shardmermkingpauldron({ pickedup, shardid })`