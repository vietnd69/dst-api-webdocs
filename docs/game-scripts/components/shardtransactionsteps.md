---
id: shardtransactionsteps
title: Shardtransactionsteps
description: Manages multi-step shard-to-shard transaction lifecycle to safely transfer data and items between game shards and save states.
tags: [network, shard, save, transaction]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 7be30c23
system_scope: network
---
# Shardtransactionsteps

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`ShardTransactionSteps` coordinates reliable, ordered, and idempotent data transfers between game shards (e.g., overworld ↔ caves). It implements a 7-step acknowledgment protocol to ensure data integrity during cross-shard migrations (e.g., portal item transfers), including handling of retries, replays, and pruning of completed transactions. This component is strictly server-side and must be attached only to the mastersim instance.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("shardtransactionsteps")

-- Initiate a transaction to another shard
inst.components.shardtransactionsteps:CreateTransaction(
    "other_shard_id",
    SHARDTRANSACTIONTYPES.TRANSFERINVENTORYITEM,
    { item = my_item, migrationdata = portal_data }
)
```

## Dependencies & tags
**Components used:** `itemstore` (via `portal.components.itemstore:AddItemRecordAndMigrationData`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `transactions` | table | `{}` | Nested table mapping `shardid → {uniqueid, finalizedid, [id] = payload}` storing in-flight and finalized transactions per shard. |

## Main functions
### `CreateTransaction(shardid, transactiontype, data)`
*   **Description:** Initiates a new cross-shard transaction. Assigns a unique ID, constructs the payload, performs transaction-type initialization (e.g., serializing an item), sets status to `INITIATE`, and dispatches the payload if the target shard is available.
*   **Parameters:**  
    `shardid` (string) – Destination shard ID (must differ from the local shard).  
    `transactiontype` (string) – Constant from `SHARDTRANSACTIONTYPES` indicating the operation type (e.g., `TRANSFERINVENTORYITEM`).  
    `data` (table) – Transaction-specific payload data.
*   **Returns:** Nothing.

### `OnShardTransactionSteps(shardpayload)`
*   **Description:** Core event handler processing incoming transaction payloads based on status and role (sender or receiver). Implements the full transaction flow: initiation → acceptance → finalization, including deduplication of replayed payloads and rescheduling of transient failures.
*   **Parameters:**  
    `shardpayload` (table) – Sharded transaction payload containing `status`, `uniqueid`, `originshardid`, `receivershardid`, `transactiontype`, `data`, and optional `rescheduling`.
*   **Returns:** Nothing.

### `HandleTransactionFinalization(shardpayload)`
*   **Description:** Executes final steps of a received transaction (e.g., item deserialization and placement in the destination world). Used when the receiving shard processes an `INITIATE` payload.
*   **Parameters:**  
    `shardpayload` (table) – Transaction payload (with `transactiontype` and `data`).
*   **Returns:** `true` if successful; `false` if finalization failed (e.g., missing portal and invalid position data).
*   **Error states:** Returns `false` if `portal` is nil and `migrationdata` lacks valid `dest_x`, `dest_y`, or `dest_z`.

### `HandleTransactionInitialization(shardpayload)`
*   **Description:** Prepares payload data *before* sending (e.g., replaces an active `item` object with its save record). Called by `CreateTransaction` on the origin shard.
*   **Parameters:**  
    `shardpayload` (table) – Transaction payload (modified in place).
*   **Returns:** Nothing.

### `GetShardTransactions(shardid)`
*   **Description:** Returns the transaction metadata table for a given shard, initializing it with `uniqueid = 1` and `finalizedid = 0` if absent.
*   **Parameters:**  
    `shardid` (string) – Shard identifier.
*   **Returns:** `table` – Transaction state table containing `uniqueid`, `finalizedid`, and transaction records by ID.

### `OnPruneShardTransactionSteps(shardid, newfinalizedid)`
*   **Description:** Prunes finalized transactions from memory after all prior IDs have been finalized, and updates the `finalizedid` counter.
*   **Parameters:**  
    `shardid` (string) – Target shard ID.  
    `newfinalizedid` (number) – New finalized ID boundary.
*   **Returns:** Nothing.

### `OnShardConnected(shardid)`
*   **Description:** Re-sends un-finalized transactions to a shard upon reconnection to recover from disconnection mid-transaction.
*   **Parameters:**  
    `shardid` (string) – Reconnected shard ID.
*   **Returns:** Nothing.

### `OnSave()`
*   **Description:** Serializes pending and in-progress transactions for world save persistence.
*   **Parameters:** None.
*   **Returns:** `table` – `{ transactions = self.transactions }`, or `nil` if no transactions exist.

### `OnLoad(data)`
*   **Description:** Restores transaction state from saved data.
*   **Parameters:**  
    `data` (table? | nil) – Data returned from `OnSave`.
*   **Returns:** Nothing.

### `ClearFields(shardpayload)`
*   **Description:** Removes transient fields (e.g., `transactiontype`, `originshardid`, `data`) from a payload after finalization to reduce saved data size. Does *not* clear `uniqueid`.
*   **Parameters:**  
    `shardpayload` (table) – Transaction payload (modified in place).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** No events registered via `inst:ListenForEvent`.
- **Pushes:**  
  - `itemstore_changedcount` – Indirectly via `itemstore:AddItemRecordAndMigrationData` when a transferred item is stored in a portal’s item store.
