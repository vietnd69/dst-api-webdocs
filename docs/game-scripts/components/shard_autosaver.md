---
id: shard_autosaver
title: Shard Autosaver
description: Synchronizes snapshot state between the master shard and other shards during autosave operations.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 172b7e4b
---

# Shard Autosaver

## Overview
This component handles the synchronization of snapshot data across shards during autosave events. It ensures that the current world snapshot—used for(save/restore operations—is consistently shared between the master shard and non-master shards via a network variable.

## Dependencies & Tags
- **Network variable dependency**: `net_uint` tied to the instance's GUID and named `"shard_autosaver._snapshot"`.
- **Event dependencies**:
  - On master shard: listens for `"master_autosaverupdate"` event.
  - On non-master shards: listens for `"snapshotdirty"` event.
- **Condition**: Asserts `TheWorld.ismastersim` to ensure it only runs on the server.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the owning entity (typically the world entity). |
| `_snapshot` | `net_uint` | Initialized via `net_uint(inst.GUID, ...)` | Network variable holding the latest snapshot value; updated or polled depending on shard role. |

## Main Functions
No explicit public methods are defined in this component. All logic resides in the constructor (`_ctor`) and local event handler functions.

## Events & Listeners
- Listens for `"master_autosaverupdate"` event (on master shard) → updates `_snapshot` with the provided `data.snapshot`.
- Listens for `"snapshotdirty"` event (on non-master shards) → triggers `"secondary_autosaverupdate"` event with current `_snapshot:value()` as payload.