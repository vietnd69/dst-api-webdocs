---
id: shard_worldvoter
title: Shard Worldvoter
description: Manages network synchronization of world voting state between master shard and other shards in a DST shard setup.
tags: [network, world, sync, shard]
sidebar_position: 10
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 8bac443d
system_scope: network
---
# Shard Worldvoter

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shard_WorldVoter` is a server-side component responsible for synchronizing world voting state (e.g., vote results, countdown, participants, and squelched users) between the master shard and other shards. It uses dedicated network variables (`net_bool`, `net_byte`, `net_uint`, `net_string`, `net_tinybyte`) to ensure consistent state replication across shards. This component is strictly for internal DST shard infrastructure and must only exist on the master simulation world (`TheWorld.ismastersim` must be true).

## Usage example
```lua
-- Internal use only — the component is added by the game infrastructure during shard initialization.
-- Example of expected usage in the engine:
local inst = TheWorld
inst:AddComponent("shard_worldvoter")
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
No public properties. All state is held in private local variables and network variables.

## Main functions
No public functions. This component only responds to internal events and updates internal network variable state.

## Events & listeners
- **Listens to:**
  - On master shard (`_ismastershard == true`):
    - `master_worldvoterenabled` — updates `_enabled` via `OnVoterEnabled`.
    - `master_worldvoterupdate` — updates vote metadata (`_countdown`, `_commandid`, `_targetuserid`, `_starteruserid`) and voter list via `OnVoterUpdate`.
    - `master_worldvotersquelchedupdate` — updates squelched user list via `OnSquelchedUpdate`.
  - On non-master shards:
    - `voterenableddirty` — pushes `secondary_worldvoterenabled` event on world sync.
    - `voterdirty` — pushes `secondary_worldvoterupdate` event with current vote state.
    - `squelcheddirty` — pushes `secondary_worldvotersquelchedupdate` event with squelched user list.
- **Pushes:**
  - On non-master shards only:
    - `secondary_worldvoterenabled` — data: `enabled` boolean.
    - `secondary_worldvoterupdate` — data: `{ countdown, commandid, targetuserid, starteruserid, voters }`.
    - `secondary_worldvotersquelchedupdate` — data: `{ squelched }`.

