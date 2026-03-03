---
id: shard_sinkholes
title: Shard Sinkholes
description: Manages network synchronization of sinkhole target data between master and shard.
tags: [network, world, synchronization]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 45186884
system_scope: network
---
# Shard Sinkholes

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shard_Sinkholes` is a network synchronization component that coordinates sinkhole target data between the master shard and a shard instance in Don't Starve Together's world partitioning system. It is strictly restricted to the master simulation (`TheWorld.ismastersim`) and uses `net_hash` and `net_tinybyte` to track and replicate sinkhole attack states for up to two targets.

This component does not operate on its own entity logic but serves as a data conduit: on the master shard, it receives events (`master_sinkholesupdate`) and updates replicated network variables; on the shard, it detects changes and triggers network sync events (`sinkholesdirty`) to push updated data back to the master.

## Usage example
```lua
-- This component is added internally by the world partitioning system
-- and is not intended for manual addition by modders.
-- Example placeholder only:
local inst = CreateEntity()
-- inst:AddComponent("shard_sinkholes") -- Not for direct use
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `ENTITY` | — | The entity instance this component is attached to (typically a world object on the shard or master). |

## Main functions
No public functional methods are exposed — all functionality resides in private event handlers and network variable management.

## Events & listeners
- **Listens to:**
  - `master_sinkholesupdate` — on master shard, receives updated sinkhole target data and updates replicated network variables.
  - `sinkholesdirty` — on shard, fires when network variables change and triggers propagation of updated data to the master.
- **Pushes:**
  - `secondary_sinkholesupdate` — on shard, sends updated target list (with `userhash`, `warn`, and `attack` states) to the master.

