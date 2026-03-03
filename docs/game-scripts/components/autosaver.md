---
id: autosaver
title: Autosaver
description: Manages automated world saving and synchronization across master and secondary shards in DST's networking model.
tags: [network, save, shard]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: f109226b
system_scope: network
---

# Autosaver

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `autosaver` component orchestrates automatic world saving and snapshot synchronization between the master shard and secondary shards in a DST multiplayer session. It handles both master-only saving logic (including snapshot versioning, rollback, and save slot management) and secondary shard behavior (such as save requests and UI state synchronization). The component ensures consistency of world state across clients and shards while minimizing manual intervention.

## Usage example
```lua
-- The autosaver component is added automatically by the game engine and should not be manually instantiated.
-- It is attached to the world entity (`TheWorld`) and activated during world initialization.
-- Typical interactions involve reading the last save time or triggering manual saves via events:
TheWorld:PushEvent("ms_save", { mintime = 120 }) -- Force a save after 2 minutes
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity instance | `inst` | The entity (typically `TheWorld`) that owns this component. |

## Main functions
### `GetLastSaveTime()`
* **Description:** Returns the Unix timestamp of the most recent successful save operation.
* **Parameters:** None.
* **Returns:** `number` — the Unix time (from `GetTime()`) when the last save completed.
* **Error states:** None — always returns a numeric value (initially set to startup time).

## Events & listeners
- **Listens to:**  
  - `issavingdirty` — triggers HUD save indicator and, on non-master shards, initiates a save.  
  - `ms_save` — on master shard: performs world save; on secondary shard: requests a save from master.  
  - `ms_setautosaveenabled` — on master shard: enables/disables autosave based on world settings.  
  - `secondary_autosaverupdate` — on secondary shard: processes snapshot updates and initiates rollback if needed.
  
- **Pushes:**  
  - `master_autosaverupdate` — on master shard, broadcasts current snapshot ID to secondary shards after save.
