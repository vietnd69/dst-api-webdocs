---
id: shard_clock
title: Shard Clock
description: Syncs and manages shared clock and moon phase state between the master shard and other shards over the network.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 15656cfa
---

# Shard Clock

## Overview
The `shard_clock` component is a lightweight synchronization helper used exclusively on the master shard or non-master shards to propagate and maintain consistent clock, cycle, phase, and moon phase state across the network. It relies on DST's `net_*` network variable types to ensure reliable and efficient state replication. This component does not store or compute time directly—it reflects the authoritative clock state managed by the `clock` component on the master shard.

## Dependencies & Tags
- `TheWorld.ismastersim` must be true (component asserts this and will not be instantiated on clients).
- No explicit component dependencies (does not add/remove entity tags or components).
- Relies on external event `"master_clockupdate"` (from master shard) or `"clockdirty"` (from non-master shards) to trigger sync logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `self.inst` | `Entity` | `inst` (passed to constructor) | Reference to the owning entity (typically the world root). |
| `_segs` | `table of net_smallbyte` | `net_smallbyte` array (size 3) | Network variables for clock segment values (cycle phases). |
| `_cycles` | `net_ushortint` | `net_ushortint` | Network variable tracking number of completed cycles. |
| `_phase` | `net_tinybyte` | `net_tinybyte` | Network variable for current day/night phase index (0–2). |
| `_moonphase` | `net_tinybyte` | `net_tinybyte` | Network variable for current moon phase (0–7). |
| `_mooniswaxing` | `net_bool` | `net_bool` | Network variable indicating if the moon is waxing or waning. |
| `_totaltimeinphase` | `net_float` | `net_float` | Network variable for total duration of current phase. |
| `_remainingtimeinphase` | `net_float` | `net_float` | Network variable for remaining time in current phase. |

## Main Functions
### `OnClockUpdate(src, data)`
* **Description:** On the master shard, this handler receives full clock state updates (`master_clockupdate`) and updates all local network variables. It ensures data consistency and triggers `clockdirty` notifications where needed.
* **Parameters:**
  * `src`: The event sender (typically `TheWorld`).
  * `data`: Table containing `segs` (array), `cycles`, `phase`, `moonphase`, `mooniswaxing`, `totaltimeinphase`, and `remainingtimeinphase`.

### `OnClockDirty()`
* **Description:** On non-master shards, this handler is triggered when local clock state changes (`clockdirty`). It compiles current local values into a snapshot and broadcasts them to the master shard via the `"secondary_clockupdate"` event.
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `"master_clockupdate"` — from `TheWorld` on the master shard to receive authoritative clock updates.
  - `"clockdirty"` — from `TheWorld` on non-master shards to detect local clock changes requiring sync.

- **Triggers:**
  - `"secondary_clockupdate"` — on `TheWorld` (from non-master shards) to send updated clock state to the master shard.