---
id: shardtransactionsteps
title: Shardtransactionsteps
description: Manages the reliable, state-machine-based exchange of data payloads between game shards during world transitions.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 7be30c23
---

# Shardtransactionsteps

## Overview
This component implements a robust transaction protocol for transferring data between shards in Don't Starve Together. It coordinates a multi-step handshake—initiation → acceptance → finalization—to ensure safe and consistent state migration across distributed worlds, particularly during world portal usage. It maintains per-shard transaction queues with unique IDs and tracks progress via status fields (`INITIATE`, `ACCEPTED`, `FINALIZED`).

## Dependencies & Tags
- Requires `inst.ismastersim == true` (asserted in constructor).
- No external component additions or entity tags.
- Relies on external globals:
  - `TheShard` for shard identification and RPC dispatch.
  - `SendRPCToShard` and `SHARD_RPC.ShardTransactionSteps` for inter-shard communication.
  - `SHARDTRANSACTIONSTEPS` enum constants (`INITIATE`, `ACCEPTED`, `FINALIZED`).
  - `SHARDTRANSACTIONTYPES` for transaction type dispatch.
  - `GetMigrationPortalFromMigrationData`, `GetMigrationPortalLocation`, `SpawnPrefab`, and `GetMigrationPortalLocation`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | *None (injected)* | The entity this component is attached to; must be master-simulated. |
| `transactions` | `table` | `{}` | Per-shard transaction storage. Keys are `shardid`; values are tables containing numeric transaction IDs as keys and payload tables as values. Each payload table includes `status`, `uniqueid`, and transaction-specific data. Also stores per-shard metadata: `uniqueid` (next ID to assign) and `finalizedid` (highest finalized ID). |
| `OnShardTransactionSteps_Bridge` | `function` | *Closure* | Internal rescheduling wrapper for failed transactions; resets `rescheduling` flag before re-invoking `OnShardTransactionSteps`. |

## Main Functions
### `OnShardTransactionSteps(shardpayload)`
* **Description:** Core event handler that processes incoming transaction payloads. Implements the full transaction lifecycle: sending transactions from the origin shard, receiving and applying payloads on the target shard, and managing state transitions and cleanup. Handles reordering (via ID comparison) and duplicate detection.
* **Parameters:**
  - `shardpayload` (*table*): Payload object containing fields: `transactiontype`, `originshardid`, `receivershardid`, `data`, `uniqueid`, `status`, and optionally `rescheduling`.

### `CreateTransaction(shardid, transactiontype, data)`
* **Description:** Initiates a new transaction by generating a unique ID, constructing the payload, applying initialization logic, and dispatching it. Automatically enqueues the payload if the target shard is currently reachable.
* **Parameters:**
  - `shardid` (*string*): Target shard identifier (must differ from the local shard).
  - `transactiontype` (*string*): Constants like `SHARDTRANSACTIONTYPES.TRANSFERINVENTORYITEM`.
  - `data` (*table*): Transaction-specific data (e.g., item record, migration coordinates).

### `HandleTransactionFinalization(shardpayload)`
* **Description:** Applies the transaction on the receiving shard—specifically for item transfers, this spawns the item at the correct destination and teleports it. Returns `true` on success or `false` if the target location is invalid (requiring rescheduling).
* **Parameters:**
  - `shardpayload` (*table*): Payload object with `data.item_record` and `data.migrationdata` for item recreation.

### `GetShardTransactions(shardid)`
* **Description:** Returns the per-shard transaction table, initializing it with default values (`uniqueid=1`, `finalizedid=0`) if it does not exist.
* **Parameters:**
  - `shardid` (*string*): Target shard identifier.

### `OnPruneShardTransactionSteps(shardid, newfinalizedid)`
* **Description:** Frees memory by removing finalized transactions up to `newfinalizedid` and updates the per-shard `finalizedid` counter. Warns on invalid transaction counts (e.g., finalized >= unique).
* **Parameters:**
  - `shardid` (*string*): Target shard identifier.
  - `newfinalizedid` (*number*): Highest finalized transaction ID to retain.

### `HandleTransactionInitialization(shardpayload)`
* **Description:** Prepares the payload for transfer by serializing objects into records—e.g., extracts and removes an inventory item’s save data to form `item_record`. Called before sending from the origin shard.
* **Parameters:**
  - `shardpayload` (*table*): Payload object (modified in place).

### `ClearFields(shardpayload)`
* **Description:** Clears sensitive or redundant fields (`transactiontype`, `originshardid`, `receivershardid`, `data`) from the payload after finalization to reduce memory usage. Preserves `uniqueid`.
* **Parameters:**
  - `shardpayload` (*table*): Payload object (modified in place).

### `OnShardConnected(shardid)`
* **Description:** Re-sends any pending `INITIATE` transactions to a newly connected shard to ensure delivery after temporary disconnections.
* **Parameters:**
  - `shardid` (*string*): Shard that has reconnected.

### `OnSave()` / `OnLoad(data)`
* **Description:** Persist/resume the transaction queues and metadata across save/load cycles to maintain transaction state across world reloads.
* **Parameters:**
  - `OnLoad(data)`: `data.transactions` (*table*) is merged into `self.transactions`.

## Events & Listeners
- Listens for:  
  - `SHARDTRANSACTIONSTEPS` via the RPC bridge (`OnShardTransactionSteps_Bridge` → `OnShardTransactionSteps`).  
- Triggers:  
  - `SendRPCToShard(SHARD_RPC.ShardTransactionSteps, ...)` for all shard communications.  
  - `SendRPCToShard(SHARD_RPC.PruneShardTransactionSteps, ...)` to request the receiving shard to clean up finalized transactions.  
- Internal rescheduling logic uses `DoTaskInTime(0, ...)` for deferred retry.