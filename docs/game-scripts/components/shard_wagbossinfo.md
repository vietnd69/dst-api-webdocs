---
id: shard_wagbossinfo
title: Shard Wagbossinfo
description: Tracks whether the Wagboss boss has been defeated on the master shard, for use across shards in DST's networked world.
tags: [network, boss, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 07fce7b5
system_scope: network
---

# Shard Wagbossinfo

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Shard_WagbossInfo` is a network-aware component that stores and synchronizes the defeat status of the Wagboss boss (from the *Shipwrecked* DLC) across shards in a multiplayer DST world. It only runs on the master simulation shard and mirrors the state via a networked boolean (`_isdefeated`). It reads initial state from `wagboss_tracker` and listens for updates to keep the status consistent.

## Usage example
```lua
-- Automatically added to an appropriate entity (e.g., TheWorld)
-- Typically used internally by the game; external usage is rare.
-- Check defeat status via:
if TheWorld.components.shard_wagbossinfo:IsWagbossDefeated() then
    -- Wagboss has been defeated
end
```

## Dependencies & tags
**Components used:** `wagboss_tracker` (reads `IsWagbossDefeated()` on init), `net_bool` (network synchronization)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GameClient/Entity` | `self` | Reference to the entity the component is attached to (e.g., `TheWorld`). |
| `_isdefeated` | `net_bool` | `false` | Networked boolean indicating if Wagboss is defeated; synchronized on master shard. |

## Main functions
### `IsWagbossDefeated()`
* **Description:** Returns whether the Wagboss boss has been defeated.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if Wagboss is defeated, `false` otherwise.
* **Error states:** None.

## Events & listeners
- **Listens to:** `master_wagbossinfoupdate` — triggered when master shard state changes; updates `_isdefeated` value from event data (`data.isdefeated`).
- **Pushes:** None.
