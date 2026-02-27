---
id: shard_sinkholes
title: Shard Sinkholes
description: Manages synchronization of sinkhole target data between the master shard and shard-specific instances using network variables and event handling.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 45186884
---

# Shard Sinkholes

## Overview
This component synchronizes sinkhole target information (such as player identifiers and state: idle, warning, or attack) across the master shard and individual shards in Don't Starve Together. It uses network variables for efficient state syncing and responds to relevant world-wide events to maintain consistency.

## Dependencies & Tags
- Relies on `TheWorld.ismastershard` and `TheWorld.ismastersim` flags for conditional logic.
- Uses network infrastructure: `net_hash`, `net_tinybyte`, and `TheWorld:PushEvent`.
- Adds no explicit tags or components.

## Properties
No public properties are directly exposed or documented; initialization occurs via internal network variable construction. The only publicly accessible member explicitly set is:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | (passed in) | The entity instance this component is attached to. |

## Main Functions
No public methods are defined. All functionality is handled internally by event callbacks and network variable updates.

### `OnSinkholesUpdate(src, data)`
* **Description:** (Master shard only) Processes sinkhole update events from the world, synchronizing local network variable values for up to two targets based on incoming data.
* **Parameters:**
  * `src`: The event source (typically `TheWorld`).
  * `data`: A table containing a `targets` array with per-target data (e.g., `userhash`, `warn`, `attack`).

### `OnSinkholesDirty()`
* **Description:** (Non-master shard only) Collects current local sinkhole target data from network variables and pushes it to the master shard via the `"secondary_sinkholesupdate"` event.
* **Parameters:** None (called as an event listener).

## Events & Listeners
- Listens for `"master_sinkholesupdate"` (master shard only) → triggers `OnSinkholesUpdate`.
- Listens for `"sinkholesdirty"` (non-master shard only) → triggers `OnSinkholesDirty`.
- Pushes `"secondary_sinkholesupdate"` (non-master shard only) with sinkhole target data during sync.