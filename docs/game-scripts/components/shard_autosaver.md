---
id: shard_autosaver
title: Shard Autosaver
description: Synchronizes snapshot state between the master shard and shard instances for world autosave coordination.
tags: [network, world, save]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 172b7e4b
system_scope: network
---

# Shard Autosaver

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shard_AutoSaver` is a lightweight component responsible for coordinating autosave snapshot state between the master shard and non-master shard instances in a DST multiplayer context. It ensures that when the master shard updates its autosave snapshot, all shards receive and propagate that snapshot state, and conversely, that shards signal when their local snapshot has changed. The component only functions on the master simulation (`ismastersim`), and behaves differently depending on whether the current instance is the master shard.

## Usage example
```lua
-- Typically added to a persistent world entity during world initialization
local inst = TheWorld
inst:AddComponent("shard_autosaver")
-- No further manual interaction required; component operates via event callbacks
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GObject` | `inst` passed to constructor | The entity instance the component is attached to (typically `TheWorld`). |

## Main functions
None. This component does not expose any public methods. All logic is internal and event-driven.

## Events & listeners
- **Listens to:**  
  - `master_autosaverupdate` (on master shard only): Triggered when the master shard updates its autosave snapshot. Updates the network variable `_snapshot`.  
  - `snapshotdirty` (on non-master shards only): Triggered locally when the shard’s snapshot changes. Pushes `secondary_autosaverupdate` with the current snapshot data.  
- **Pushes:**  
  - `secondary_autosaverupdate` (on non-master shards): Announces the current snapshot value to other systems needing coordination (e.g., save triggers or diagnostics).  

Note: `_snapshot` is a network variable (`net_uint`) scoped to the instance’s GUID, named `"shard_autosaver._snapshot"`, and synced via `"snapshotdirty"` propagation.
