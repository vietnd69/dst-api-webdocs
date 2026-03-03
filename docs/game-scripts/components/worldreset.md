---
id: worldreset
title: Worldreset
description: Manages the countdown and execution of world reset logic when all players become ghosts, including dialog display, network synchronization, and termination handling.
tags: [world, network, reset, ui]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 6cea2bba
system_scope: world
---

# Worldreset

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Worldreset` is a server-authoritative component responsible for initiating and coordinating world reset when all players die and become ghosts. It manages a countdown timer, displays the world reset dialog, synchronizes state across clients and shards, and ultimately triggers world deletion and restart (or game restart on XB1 under certain conditions). It relies on `shard_players` to track alive and ghost player counts and coordinates events for master, shard, and client simulations separately.

## Usage example
```lua
-- Typically added to the world entity automatically by the engine
-- Example of configuring world reset behavior:
TheWorld:PushEvent("ms_setworldresettime", {
    instant = false,
    time = 180,        -- 3 minutes for countdown
    loadingtime = 60,  -- 1 minute bonus if loading
})
```

## Dependencies & tags
**Components used:** `shard_players` (via `TheWorld.shard.components.shard_players`)
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity | `nil` | The entity (TheWorld) that owns this component. |

## Main functions
### `OnPostInit()`
* **Description:** Post-initialization callback. Triggers initial countdown handling and applies a one-time fast-forward adjustment if running on a non-master sim to compensate for network delays during loading.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Periodic update function that decrements the countdown timer. When the timer reaches zero, it triggers `WorldReset()` on the master shard. Handles synchronization of countdown values between master and secondary shards, and updates the UI.
* **Parameters:** `dt` (number) — Delta time since last frame.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `countdowndirty` — Fires `OnCountdownDirty()` to process network-updated countdown values.
  - `playeractivated` — Triggers `OnRefreshDialog()` on non-dedicated clients to refresh dialog state.
  - `entercharacterselect` — Triggers `OnRefreshDialog()` to refresh dialog state.
  - `ms_setworldresettime` — (Master shard only) Updates reset configuration and toggles player count monitoring.
  - `ms_playercounts` — (Master shard only) Responds to changes in alive/ghost player counts to start/stop countdown or cancel it.
  - `secondary_worldresetupdate` — (Secondary shard only) Updates local countdown from master shard data.
- **Pushes:**
  - `worldresettick` — Sent each time the countdown value changes; carries the updated time.
  - `showworldreset` / `hideworldreset` — UI events to show or hide the world reset dialog.
  - `master_worldresetupdate` — (Master shard only) Notifies of internal countdown state changes.
