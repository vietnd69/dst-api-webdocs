---
id: shard_players
title: Shard Players
description: This component tracks and synchronizes the total number of players (including ghosts) across the local shard and secondary shards on the master server.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: ed173949
---

# Shard Players

## Overview
The `Shard_Players` component is responsible for maintaining and broadcasting aggregated player counts (total players, ghosts, and alive players) across both the local shard and any connected secondary shards. It operates exclusively on the master shard and uses network variables to synchronize counts with other shards, emitting a `ms_playercounts` event whenever values change.

## Dependencies & Tags
- **No components added to `inst`**, but it relies on:
  - `TheWorld.ismastersim` (asserts it runs only on the master simulation instance)
  - `TheWorld.ismastershard` (enables core logic only on the master shard)
  - `TheShard:GetSecondaryShardPlayerCounts()` (for fetching counts from secondary shards)
  - `AllPlayers` global table (for iterating local players)
  - `net_byte()` for network variable creation
- **No tags added or removed** on the entity.

## Properties
No public instance properties are initialized in `_ctor` or elsewhere. All state is held in local module-scope variables (e.g., `_localPlayers`, `_secondaryShardDirty`). Only `self.inst` is assigned as a public reference to the component’s host entity.

## Main Functions

### `GetNumPlayers()`
* **Description:** Returns the current total number of players (alive + ghosts) across the local and secondary shards.
* **Parameters:** None.

### `GetNumGhosts()`
* **Description:** Returns the current total number of ghost players (players who have died but are still present) across the local and secondary shards.
* **Parameters:** None.

### `GetNumAlive()`
* **Description:** Returns the current number of living players, computed as total players minus ghosts.
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `"master_secondaryplayerschanged"` on `TheWorld` → triggers update of secondary shard counts.
  - `"ms_playerspawn"` on `TheWorld` → registers new players for tracking and schedules an update.
  - `"ms_playerleft"` on `TheWorld` → stops tracking a player and schedules an update.
  - `"ms_becameghost"` on individual players → flags player count changes.
  - `"ms_respawnedfromghost"` on individual players → flags player count changes.
  - `"playercountsdirty"` on `inst` → triggers broadcast of current counts via `ms_playercounts`.
- **Pushes/emits:**
  - `"ms_playercounts"` → broadcasts an event payload containing `total`, `ghosts`, and `alive` counts.
  - Triggers `"playercountsdirty"` via network variable change notifications (`net_byte` sync callback).