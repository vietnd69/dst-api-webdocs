---
id: shardtransactionsteps
title: Shardtransactionsteps
description: Manages cross-shard transaction state for safe data transfer between DST shards.
tags: [network, shard, transaction]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: components
source_hash: b50aec15
system_scope: network
---

# Shardtransactionsteps

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`Shardtransactionsteps` manages the state machine for cross-shard transactions, ensuring data is safely transferred between shards with proper save state handling. It tracks transaction IDs per shard, handles initialization/finalization steps, and coordinates RPC communication for transaction acceptance and pruning. This component is **master-only** and will assert if created on a client.

The transaction workflow follows these steps:
1. Create a data payload with unique ID
2. Owning shard sends `SHARDTRANSACTIONSTEPS.INITIATE` to receiving shard
3. Receiving shard applies the payload and sends `SHARDTRANSACTIONSTEPS.ACCEPTED` back
4. Receiving shard marks transaction as `SHARDTRANSACTIONSTEPS.FINALIZED`
5. Owning shard receives acceptance and marks transaction as `FINALIZED`

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("shardtransactionsteps")

-- Create a transaction to send inventory item to another shard
local data = {
    item = some_item_entity,
    migrationdata = { dest_x = 100, dest_y = 0, dest_z = 100, sessionid = "abc123" }
}
inst.components.shardtransactionsteps:CreateTransaction("caves", SHARDTRANSACTIONTYPES.TRANSFERINVENTORYITEM, data)

-- Handle shard reconnection (resends pending INITIATE transactions)
inst.components.shardtransactionsteps:OnShardConnected("caves")
```

## Dependencies & tags
**External dependencies:**
- `TheShard` -- shard management interface for getting shard IDs and availability
- `SHARD_RPC` -- RPC definitions for cross-shard communication
- `SHARDTRANSACTIONSTEPS` -- transaction status enum (INITIATE, ACCEPTED, FINALIZED)
- `SHARDTRANSACTIONTYPES` -- transaction type enum (e.g., TRANSFERINVENTORYITEM)
- `DataDumper` -- serializes transaction payload for RPC transmission
- `GetMigrationPortalFromMigrationData` -- retrieves portal entity from migration data
- `SpawnPrefab` -- spawns transferred items on receiving shard
- `GetMigrationPortalLocation` -- calculates spawn position for migrated items
- `Shard_IsWorldAvailable` -- checks if target shard world is loaded

**Components used:**
- `itemstore` -- receives transferred item records via `AddItemRecordAndMigrationData()` on portal entities

**Tags:**
- None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | --- | The entity instance that owns this component. Standard component property. |
| `transactions` | table | `{}` | Maps shard IDs to transaction tables. Each shard table contains `uniqueid`, `finalizedid`, and transaction entries keyed by ID. |
| `OnShardTransactionSteps_Bridge` | function | --- | Bridge callback for rescheduling failed transactions. Called with `(inst, shardpayload)` after 0-second delay when `rescheduling` flag is set. |

## Main functions
### `OnShardTransactionSteps(shardpayload)`
* **Description:** Main handler for processing incoming shard transaction payloads. Determines if this shard is the sender or receiver, updates transaction state, and sends appropriate RPC responses. Behavior depends on shard role and status:
  - Sender + INITIATE: sends RPC to receiver.
  - Sender + ACCEPTED: marks for finalization.
  - Receiver + INITIATE: handles transaction, sends ACCEPTED back, marks for finalization.
  - Receiver + replay: sends ACCEPTED and finalizes.
* **Parameters:**
  - `shardpayload` -- table containing transaction data with fields: `uniqueid`, `originshardid`, `receivershardid`, `status`, `transactiontype`, `data`, `rescheduling`
* **Returns:** nil
* **Error states:** Errors if `shardpayload` is nil (direct field access to `shardpayload.originshardid`, `shardpayload.uniqueid`, `shardpayload.status`, `shardpayload.receivershardid`, `shardpayload.transactiontype` with no nil guard throughout function body).

### `OnPruneShardTransactionSteps(shardid, newfinalizedid)`
* **Description:** Removes finalized transaction entries from the transaction table up to `newfinalizedid`. Called after batch finalization to clean up memory. Prints warning if finalized ID exceeds unique ID (indicates bad transaction count).
* **Parameters:**
  - `shardid` -- string shard identifier
  - `newfinalizedid` -- number highest finalized transaction ID to prune up to
* **Returns:** nil
* **Error states:** None.

### `OnShardConnected(shardid)`
* **Description:** Called when a shard connection is (re)established. Resends any pending INITIATE transactions that originated from this shard to ensure they are processed after reconnection.
* **Parameters:**
  - `shardid` -- string shard identifier that reconnected
* **Returns:** nil
* **Error states:** None.

### `HandleTransactionInitialization(shardpayload)`
* **Description:** Prepares transaction data before sending. For `TRANSFERINVENTORYITEM` type, extracts the item's save record, removes the item entity, and stores the record in payload data for transmission.
* **Parameters:**
  - `shardpayload` -- table transaction payload
* **Returns:** nil
* **Error states:** Errors if `shardpayload` is nil (unguarded access to `shardpayload.transactiontype` and `shardpayload.data.item`).

### `HandleTransactionFinalization(shardpayload)`
* **Description:** Applies the transaction on the receiving shard. For `TRANSFERINVENTORYITEM`, spawns the item at the migration location using the saved record. Returns `false` if portal is inactive or destination coordinates (dest_x, dest_y, dest_z) are missing. Otherwise spawns item at migration location using saved record.
* **Parameters:**
  - `shardpayload` -- table transaction payload with `data.item_record` and `data.migrationdata`
* **Returns:** `true` on success, `false` if migration cannot complete (invalid portal or missing coordinates)
* **Error states:** Errors if `shardpayload` is nil (unguarded access to `shardpayload.transactiontype` before data validation). Errors if `shardpayload.data` is nil (unguarded access to `shardpayload.data.item_record` and `shardpayload.data.migrationdata` before validation).

### `GetShardTransactions(shardid)`
* **Description:** Retrieves or creates the transaction table for a given shard ID. Initializes with `uniqueid = 1` and `finalizedid = 0` if no table exists.
* **Parameters:**
  - `shardid` -- string shard identifier
* **Returns:** table transaction tracking object for the shard
* **Error states:** None.

### `ClearFields(shardpayload)`
* **Description:** Clears sensitive data fields from a transaction payload after processing. Removes `transactiontype`, `originshardid`, `receivershardid`, and `data`. Does NOT clear `uniqueid` to maintain transaction tracking.
* **Parameters:**
  - `shardpayload` -- table transaction payload to clear
* **Returns:** nil
* **Error states:** Errors if `shardpayload` is nil (direct field access with no nil guard).

### `CreateTransaction(shardid, transactiontype, data)`
* **Description:** Initiates a new cross-shard transaction. Generates a unique ID, stores the payload, calls initialization handler, sets status to INITIATE, and processes immediately if target shard is available.
* **Parameters:**
  - `shardid` -- string target shard identifier (must differ from current shard)
  - `transactiontype` -- number transaction type enum (e.g., `SHARDTRANSACTIONTYPES.TRANSFERINVENTORYITEM`)
  - `data` -- table transaction-specific data payload
* **Returns:** nil
* **Error states:** Errors if `shardid` equals current shard ID (assertion in source: "ShardTransactionSteps:CreateTransaction must send to another shard.")

### `OnSave()`
* **Description:** Returns transaction state for world save. Only saves if transactions table is non-empty.
* **Parameters:** None
* **Returns:** table `{ transactions = self.transactions }` or `nil` if empty
* **Error states:** None.

### `OnLoad(data)`
* **Description:** Restores transaction state from saved data. Merges loaded transactions with existing table.
* **Parameters:**
  - `data` -- table saved data from `OnSave()`
* **Returns:** nil
* **Error states:** None.

### `DebugTransaction(prefix, shardpayload)`
* **Description:** Prints transaction debug information to console including ID, origin, receiver, current shard, and status name. Used for debugging transaction flow.
* **Parameters:**
  - `prefix` -- string label for log entry
  - `shardpayload` -- table transaction payload
* **Returns:** nil
* **Error states:** Errors if `shardpayload` is nil (direct field access with no nil guard).

## Events & listeners
- **Listens to:** None identified
- **Pushes:** None identified (uses `SendRPCToShard` for cross-shard communication, not entity events)