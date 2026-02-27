---
id: shard_mermkingwatcher
title: Shard Mermkingwatcher
description: Tracks Merm King presence and equipped buffs (trident, crown, pauldron) across shards and synchronizes state between master and shard instances.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 04e63a02
---

# Shard Mermkingwatcher

## Overview
This component monitors and synchronizes the existence of a Merm King and the presence of associated buffs (trident, crown, pauldron) across all connected shards in a DST world. It runs exclusively on the master instance and maintains authoritative state via `SourceModifierList` and network variables (`net_bool`) to ensure consistent cross-shard behavior.

## Dependencies & Tags
- `TheWorld.ismastersim` (asserted; component only exists on the master simulation instance)
- Uses `SourceModifierList` for managing additive boolean modifiers
- Relies on `net_bool` to synchronize state across shards
- Events it listens to or pushes include: `onmermkingcreated`, `onmermkingdestroyed`, `onmermkingtridentadded`, `onmermkingtridentremoved`, `onmermkingcrownadded`, `onmermkingcrownremoved`, `onmermkingpauldronadded`, `onmermkingpauldronremoved`, `master_shardmermkingexists`, `master_shardmermkingtrident`, `master_shardmermkingcrown`, `master_shardmermkingpauldron`, and various `_dirty` events

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The owning entity (typically `TheWorld`), set during construction |
| `mermkings` | `SourceModifierList` | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Tracks sources contributing Merm King presence |
| `hasmermking` | `net_bool` | `net_bool(inst.GUID, "mermkingwatcher.hasmermking", "hasmermkingdirty")` | Networked boolean indicating whether a Merm King exists anywhere |
| `tridents` | `SourceModifierList` | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Tracks sources contributing Merm King trident buff |
| `hastrident` | `net_bool` | `net_bool(inst.GUID, "mermkingwatcher.hastrident", "hastridentdirty")` | Networked boolean for trident presence |
| `crowns` | `SourceModifierList` | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Tracks sources contributing Merm King crown buff |
| `hascrown` | `net_bool` | `net_bool(inst.GUID, "mermkingwatcher.hascrown", "hascrowndirty")` | Networked boolean for crown presence |
| `pauldrons` | `SourceModifierList` | `SourceModifierList(inst, false, SourceModifierList.boolean)` | Tracks sources contributing Merm King pauldron buff |
| `haspauldron` | `net_bool` | `net_bool(inst.GUID, "mermkingwatcher.haspauldron", "haspauldrondirty")` | Networked boolean for pauldron presence |

## Main Functions
### `AddMermKingSource(source)`
* **Description:** Adds a shard ID as a source of Merm King presence; updates the networked variable and triggers a world event if this was the first source.
* **Parameters:** `source` — A unique identifier (e.g., shard ID string) representing the shard or source adding the Merm King.

### `RemoveMermKingSource(source)`
* **Description:** Removes a source from the Merm King tracker; resets the networked variable to false if no sources remain and triggers a destruction event accordingly.
* **Parameters:** `source` — The shard ID or source to remove.

### `HasMermKing()`
* **Description:** Returns the current existence state of a Merm King across shards.
* **Parameters:** None.

### `OnMermKingCreated()`
* **Description:** Syncs Merm King presence to connected shards via `Shard_SyncMermKingExists(true)`.
* **Parameters:** None.

### `OnMermKingDestroyed()`
* **Description:** Syncs Merm King removal to connected shards via `Shard_SyncMermKingExists(false)`.
* **Parameters:** None.

### `AddTridentSource(source)`
* **Description:** Registers a source that provides the Merm King trident buff; triggers an event if the trident was not previously held.
* **Parameters:** `source` — Shard or system identifier adding the trident.

### `RemoveTridentSource(source)`
* **Description:** Removes a trident source; triggers an event if no sources remain.
* **Parameters:** `source` — Shard or system identifier removing the trident.

### `HasTrident()`
* **Description:** Returns whether the Merm King currently holds the trident buff.
* **Parameters:** None.

### `OnTridentAdded()` / `OnTridentRemoved()`
* **Description:** Syncs trident state changes to shards via `Shard_SyncMermKingTrident()`.
* **Parameters:** None.

### `AddCrownSource(source)`
* **Description:** Registers a source that provides the Merm King crown buff; triggers an event if the crown was not previously equipped.
* **Parameters:** `source` — Shard or system identifier adding the crown.

### `RemoveCrownSource(source)`
* **Description:** Removes a crown source; triggers an event if no sources remain.
* **Parameters:** `source` — Shard or system identifier removing the crown.

### `HasCrown()`
* **Description:** Returns whether the Merm King currently wears the crown.
* **Parameters:** None.

### `OnCrownAdded()` / `OnCrownRemoved()`
* **Description:** Syncs crown state changes to shards via `Shard_SyncMermKingCrown()`.
* **Parameters:** None.

### `AddPauldronSource(source)`
* **Description:** Registers a source that provides the Merm King pauldron buff; triggers an event if the pauldron was not previously equipped.
* **Parameters:** `source` — Shard or system identifier adding the pauldron.

### `RemovePauldronSource(source)`
* **Description:** Removes a pauldron source; triggers an event if no sources remain.
* **Parameters:** `source` — Shard or system identifier removing the pauldron.

### `HasPauldron()`
* **Description:** Returns whether the Merm King currently wears the pauldron.
* **Parameters:** None.

### `OnPauldronAdded()` / `OnPauldronRemoved()`
* **Description:** Syncs pauldron state changes to shards via `Shard_SyncMermKingPauldron()`.
* **Parameters:** None.

### `ResyncNetVars()`
* **Description:** Re-synchronizes all networked variables after late shard connections; clears and re-sets each `net_bool` to ensure consistency.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a formatted debug string indicating master shard status and current Merm King presence.
* **Parameters:** None.

## Events & Listeners
- Listens for `"onmermkingcreated"` → calls `OnMermKingCreated()`
- Listens for `"onmermkingdestroyed"` → calls `OnMermKingDestroyed()`
- Listens for `"onmermkingtridentadded"` → calls `OnTridentAdded()`
- Listens for `"onmermkingtridentremoved"` → calls `OnTridentRemoved()`
- Listens for `"onmermkingcrownadded"` → calls `OnCrownAdded()`
- Listens for `"onmermkingcrownremoved"` → calls `OnCrownRemoved()`
- Listens for `"onmermkingpauldronadded"` → calls `OnPauldronAdded()`
- Listens for `"onmermkingpauldronremoved"` → calls `OnPauldronRemoved()`
- Listens for `"master_shardmermkingexists"` (master shard only) → calls `OnMermKingExists`
- Listens for `"master_shardmermkingtrident"` (master shard only) → calls `OnMermKingTridentChanged`
- Listens for `"master_shardmermkingcrown"` (master shard only) → calls `OnMermKingCrownChanged`
- Listens for `"master_shardmermkingpauldron"` (master shard only) → calls `OnMermKingPauldronsChanged`
- Listens for `"hasmermkingdirty"`, `"hastridentdirty"`, `"hascrowndirty"`, `"haspauldrondirty"` (shard only) → respective dirty handlers

Note: The `"onmermkingcreated_anywhere"`, `"onmermkingdestroyed_anywhere"`, and similar buff events are pushed *by this component* to the world to signal global state changes.