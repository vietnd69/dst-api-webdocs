---
id: shard_mermkingwatcher
title: Shard Mermkingwatcher
description: Tracks and synchronizes the presence of merm king artifacts (king, trident, crown, pauldron) across shards in multiplayer.
tags: [network, multiplayer, boss, synchronization]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 04e63a02
system_scope: network
---
# Shard Mermkingwatcher

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`shard_mermkingwatcher` is a network-aware component that tracks the existence and presence of merm king artifacts in multiplayer environments. It ensures state consistency across shards by managing net-serialized booleans and syncing local changes with master shard events. It is only valid on the master simulation and runs on the master shard only; client shards receive state updates via network events.

The component relies on `SourceModifierList` to track multiple potential sources (e.g., shards) contributing to artifact presence and uses `net_bool` to replicate state across the network. It emits world-level events (e.g., `onmermkingcreated_anywhere`) and listens to shard-specific events (`master_shardmermking*`) for cross-shard synchronization.

## Usage example
```lua
-- Typically added automatically to TheWorld on master shard initialization.
-- Not intended for manual instantiation by mods.

-- This component is automatically attached to TheWorld in the master shard:
TheWorld:AddComponent("shard_mermkingwatcher")
```

## Dependencies & tags
**Components used:** None (does not access other components via `inst.components.X` directly in this file).  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `mermkings` | `SourceModifierList` | — | Tracks sources reporting merm king presence (boolean flag). |
| `hasmermking` | `net_bool` | `false` | Network-replicated boolean indicating if any shard reports a merm king. |
| `tridents` | `SourceModifierList` | — | Tracks sources reporting trident pickup. |
| `hastrident` | `net_bool` | `false` | Network-replicated boolean for trident presence. |
| `crowns` | `SourceModifierList` | — | Tracks sources reporting crown pickup. |
| `hascrown` | `net_bool` | `false` | Network-replicated boolean for crown presence. |
| `pauldrons` | `SourceModifierList` | — | Tracks sources reporting pauldron pickup. |
| `haspauldron` | `net_bool` | `false` | Network-replicated boolean for pauldron presence. |

## Main functions
### `AddMermKingSource(source)`
*   **Description:** Registers a source (typically a shard ID) as reporting merm king presence. Updates net variable and emits global events if transition from absent to present.
*   **Parameters:** `source` (string or number) — identifier for the shard or system adding the source.
*   **Returns:** Nothing.

### `RemoveMermKingSource(source)`
*   **Description:** Removes a previously registered source. If no sources remain, updates net variable and emits the "destroyed" global event.
*   **Parameters:** `source` (string or number) — identifier for the source to remove.
*   **Returns:** Nothing.

### `HasMermKing()`
*   **Description:** Returns whether any source currently reports merm king presence.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if at least one source reports presence, otherwise `false`.

### `AddTridentSource(source)`
*   **Description:** Registers a source reporting trident pickup. Updates net variable and emits `onmermkingtridentadded_anywhere` on first addition.
*   **Parameters:** `source` (string or number).
*   **Returns:** Nothing.

### `RemoveTridentSource(source)`
*   **Description:** Removes a trident source. Emits `onmermkingtridentremoved_anywhere` if no sources remain.
*   **Parameters:** `source` (string or number).
*   **Returns:** Nothing.

### `HasTrident()`
*   **Description:** Returns whether any source reports trident pickup.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `AddCrownSource(source)`
*   **Description:** Registers a source reporting crown pickup. Emits `onmermkingcrownadded_anywhere` on first addition.
*   **Parameters:** `source` (string or number).
*   **Returns:** Nothing.

### `RemoveCrownSource(source)`
*   **Description:** Removes a crown source. Emits `onmermkingcrownremoved_anywhere` if no sources remain.
*   **Parameters:** `source` (string or number).
*   **Returns:** Nothing.

### `HasCrown()`
*   **Description:** Returns whether any source reports crown pickup.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `AddPauldronSource(source)`
*   **Description:** Registers a source reporting pauldron pickup. Emits `onmermkingpauldronadded_anywhere` on first addition.
*   **Parameters:** `source` (string or number).
*   **Returns:** Nothing.

### `RemovePauldronSource(source)`
*   **Description:** Removes a pauldron source. Emits `onmermkingpauldronremoved_anywhere` if no sources remain.
*   **Parameters:** `source` (string or number).
*   **Returns:** Nothing.

### `HasPauldron()`
*   **Description:** Returns whether any source reports pauldron pickup.
*   **Parameters:** None.
*   **Returns:** `boolean`.

### `ResyncNetVars()`
*   **Description:** (Master shard only) Forces re-broadcast of all net variables to connected shards, used when a shard joins late. Resets each net var locally before re-setting to restore sync.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a debug-formatted summary string.
*   **Parameters:** None.
*   **Returns:** `string` — format: `"Mastershard: 1/0, HasMermKing: 1/0"`.

## Events & listeners
- **Listens to:**  
  - `onmermkingcreated`, `onmermkingdestroyed` — triggers shard sync via `Shard_SyncMermKingExists`.  
  - `onmermkingtridentadded`, `onmermkingtridentremoved` — triggers `Shard_SyncMermKingTrident`.  
  - `onmermkingcrownadded`, `onmermkingcrownremoved` — triggers `Shard_SyncMermKingCrown`.  
  - `onmermkingpauldronadded`, `onmermkingpauldronremoved` — triggers `Shard_SyncMermKingPauldron`.  
  - On master shard: `master_shardmermkingexists`, `master_shardmermkingtrident`, `master_shardmermkingcrown`, `master_shardmermkingpauldron`.  
  - On shards: `hasmermkingdirty`, `hastridentdirty`, `hascrowndirty`, `haspauldrondirty` — triggers local event emission based on new net state.

- **Pushes:**  
  - `onmermkingcreated_anywhere`, `onmermkingdestroyed_anywhere`  
  - `onmermkingtridentadded_anywhere`, `onmermkingtridentremoved_anywhere`  
  - `onmermkingcrownadded_anywhere`, `onmermkingcrownremoved_anywhere`  
  - `onmermkingpauldronadded_anywhere`, `onmermkingpauldronremoved_anywhere`  
