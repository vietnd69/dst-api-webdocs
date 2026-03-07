---
id: shard_worldreset
title: Shard Worldreset
description: Manages network synchronization of world reset countdown state between master shard and non-master shards.
tags: [network, world, synchronization]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: network
source_hash: 2d8692f2
system_scope: network
---

# Shard Worldreset

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shard_WorldReset` is a network-aware component responsible for synchronizing the world reset countdown timer between the master shard and non-master shards in a multiplayer DST server environment. It enforces server-side-only execution via `TheWorld.ismastersim`, ensuring it only exists on the simulation server. The component uses a replicated network variable (`_countdown`) and event-based messaging to keep countdown state consistent across shards.

## Usage example
```lua
-- This component is automatically added to the world entity during shard initialization.
-- Manual usage is not intended; it operates internally.
-- Example of internal usage pattern:
inst:AddComponent("shard_worldreset")
-- Countdown updates are triggered by the world reset system via master_worldresetupdate events.
```

## Dependencies & tags
**Components used:** `net_byte` (networking utility), `TheWorld` global
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to (typically the world entity). |

## Main functions
This component does not expose any public methods. All logic is encapsulated and event-driven.

## Events & listeners
- **Listens to:**
  - `master_worldresetupdate` (on master shard only): Receives `{ countdown = number }` from `TheWorld`, updating the network variable.
  - `countdowndirty` (on non-master shards only): Fires when the network variable changes, triggering `secondary_worldresetupdate` event.
- **Pushes:**
  - `secondary_worldresetupdate` (on non-master shards only): Broadcasts `{ countdown = number }` after receiving a network update.
