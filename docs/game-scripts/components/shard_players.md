---
id: shard_players
title: Shard Players
description: Tracks and synchronizes the total number of players and ghosts across the local shard and secondary shards in a dedicated server environment.
tags: [network, multiplayer, server]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: ed173949
system_scope: network
---
# Shard Players

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shard_Players` is a server-side-only component that maintains real-time counts of total players, ghosts, and alive players across the local shard and any connected secondary shards. It is only instantiated on the master shard (`TheWorld.ismastershard == true`) and uses networked variables to broadcast updated counts to all connected shards. The component reacts to player spawn/leave events and ghost status changes to keep counts synchronized and up to date.

## Usage example
```lua
-- Typically added automatically by the server world setup; manual addition is not required.
-- On the master shard, access counts as follows:
if TheWorld.ismastershard and TheWorld.entity and TheWorld.entity.components.shard_players then
    local total = TheWorld.entity.components.shard_players:GetNumPlayers()
    local alive = TheWorld.entity.components.shard_players:GetNumAlive()
    print("Total players:", total, "Alive:", alive)
end
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  

## Properties
No public properties

## Main functions
### `GetNumPlayers()`
* **Description:** Returns the total number of players (alive + ghosts) across the local shard and all secondary shards.
* **Parameters:** None.
* **Returns:** `number` — the combined player count.
* **Error states:** Always returns a non-negative integer; may be `0` if no players are connected.

### `GetNumGhosts()`
* **Description:** Returns the total number of ghost players across the local shard and all secondary shards.
* **Parameters:** None.
* **Returns:** `number` — the combined ghost count.
* **Error states:** Always returns a non-negative integer; may be `0` if no players are ghosts.

### `GetNumAlive()`
* **Description:** Returns the number of alive (non-ghost) players, computed as `GetNumPlayers() - GetNumGhosts()`.
* **Parameters:** None.
* **Returns:** `number` — the combined alive player count.
* **Error states:** Always returns a non-negative integer.

## Events & listeners
- **Listens to:**
  - `master_secondaryplayerschanged` (on `TheWorld`) — triggers recalculation of secondary shard player counts.
  - `ms_playerspawn` (on `TheWorld`) — registers a new local player and marks counts as dirty.
  - `ms_playerleft` (on `TheWorld`) — unregisters a player and marks counts as dirty.
  - `ms_becameghost`, `ms_respawnedfromghost` (per-player) — triggers count updates when a player's ghost status changes.
  - `playercountsdirty` (on `self.inst`) — fires `ms_playercounts` event after network variable sync.
- **Pushes:**
  - `ms_playercounts` — includes `total`, `ghosts`, and `alive` fields; emitted when player counts are updated and synced.
