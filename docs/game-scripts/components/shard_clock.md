---
id: shard_clock
title: Shard Clock
description: Manages synchronization of clock-related state (phases, cycles, moon data) across the network for the master shard and game clients.
tags: [network, world, clock]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 15656cfa
system_scope: network
---

# Shard Clock

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shard_Clock` is a network-coordination component that ensures clock state (e.g., current phase, moon phase, cycles, time-in-phase) is correctly synchronized between the master shard and client instances. It is strictly instantiated on the master simulation (`TheWorld.ismastersim`) and is never present on client-side instances.

The component establishes network variables (via `net_*` helpers) that mirror data from the master shard's clock. On the master shard, it listens for `master_clockupdate` events to update its state, while on non-master shards it triggers `clockdirty` to push updated data back.

This component acts as a dedicated conduit for clock metadata, separating it from the main clock logic (handled elsewhere, e.g., `clock.lua`) to enable efficient replication.

## Usage example
This component is automatically added and managed by the engine during world initialization. It is not meant for manual instantiation by mods.

```lua
-- Internal engine usage only — modders should not interact directly
-- See `clock.lua` and `worldgen` systems for public-facing clock APIs
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds no tags  
**Network variables:** Uses 9 network variables (`_segs[1..3]`, `_cycles`, `_phase`, `_moonphase`, `_mooniswaxing`, `_totaltimeinphase`, `_remainingtimeinphase`), all synced under the `"clockdirty"` channel.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `inst` | Reference to the owning entity (typically `TheWorld`). |

## Main functions
This component does not expose any public methods beyond internal event callbacks. All functionality is handled via event listeners and network variable setters.

## Events & listeners
- **Listens to:**  
  - `master_clockupdate` (only on master shard): Updates internal network variables from received `data` (e.g., phases, moon data, cycle counts).  
  - `clockdirty` (only on non-master shards): Triggers retransmission of current state via `secondary_clockupdate`.

- **Pushes:**  
  - `secondary_clockupdate`: Broadcasts full clock state (segments, cycles, phase, moon info, time-in-phase) to the master shard for validation and propagation.
