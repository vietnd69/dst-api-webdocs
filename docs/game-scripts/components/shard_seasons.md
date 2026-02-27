---
id: shard_seasons
title: Shard Seasons
description: Manages per-shard seasonal state synchronization between master and secondary shards using networked variables.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 94b2d7b3
---

# Shard Seasons

## Overview
This component ensures seasonal state (e.g., current season, season lengths, and day counters) is synchronized across shards in a DST dedicated server setup. It runs exclusively on the master shard and listens for updates from `TheWorld`, broadcasting changes to secondary shards via networked variables and custom events.

## Dependencies & Tags
- `TheWorld.ismastersim` — Enforces this component is only instantiated on the master simulation.
- Uses networked variable constructors (`net_byte`, `net_tinybyte`, `net_bool`, `net_ushortint`) tied to `inst.GUID` for replication.
- Tags: None added or removed.
- Relies on external events:
  - `"master_seasonsupdate"` (listens on master shard)
  - `"seasonsdirty"` (listens on secondary shard)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity this component is attached to (typically `TheWorld`). |

*Note: No explicit `_ctor` initialization of additional public properties beyond `self.inst` is present.*

## Main Functions
### `OnSeasonsUpdate(src, data)`
* **Description:** Master-shard handler that applies seasonal state updates received via `"master_seasonsupdate"` event. Compares incoming data with current networked values and updates them if different, ensuring consistency across shards.
* **Parameters:**
  - `src` (`Entity`): Event source (typically `TheWorld`).
  - `data` (`table`): Contains `season`, `lengths`, `totaldaysinseason`, `remainingdaysinseason`, `elapseddaysinseason`, and `endlessdaysinseason`.

### `OnSeasonsDirty()`
* **Description:** Secondary-shard handler triggered on `"seasonsdirty"` event. Packages current networked seasonal values into a data table and broadcasts them to the master shard via `"secondary_seasonsupdate"` event to request a refresh.
* **Parameters:** None.

## Events & Listeners
- Listens for `"master_seasonsupdate"` on master shard (invokes `OnSeasonsUpdate`).
- Listens for `"seasonsdirty"` on secondary shard (invokes `OnSeasonsDirty`).
- Emits `"secondary_seasonsupdate"` (data payload) from secondary shard to master shard during sync request.