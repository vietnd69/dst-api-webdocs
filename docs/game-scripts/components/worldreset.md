---
id: worldreset
title: Worldreset
description: Manages the countdown and execution of world reset logic, including network synchronization, dialog display, and deferred deletion across master and client shards.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 6cea2bba
---

# Worldreset

## Overview
The `Worldreset` component orchestrates the world reset workflow in Don't Starve Together, handling countdown timing, dialog visibility, network synchronization, and ultimately triggering world deletion and restart. It operates differently depending on whether it runs on the master shard, a secondary shard, or a dedicated server, and integrates closely with player count events and net sync mechanisms.

## Dependencies & Tags
- **Components:** none explicitly added (relies on `inst` already having `GUID`, `StartUpdatingComponent`, `StopUpdatingComponent`, and `ListenForEvent`/`RemoveEventCallback` capabilities)
- **Tags:** none added or removed
- **Network variables:** registers `net_byte(inst.GUID, "worldreset._countdown", "countdowndirty")` for countdown synchronization

## Properties
The component does not define a `_ctor` but initializes variables in its constructor function. Public properties are minimal; most are private locals. Key public-accessible variables (implicitly exposed via `self.inst`) are:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | passed-in instance | Reference to the entity the component is attached to (typically a `world` or `worldmanager` entity) |

Private mutable state (not public properties but crucial to behavior):

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_shown` | `boolean` | `false` | Whether the world reset dialog is currently visible |
| `_updating` | `boolean` | `false` | Whether the countdown update loop is active |
| `_resetting` | `boolean` | `false` | Whether a reset is in progress or queued |
| `_countdownf` | `number` | `nil` | Float countdown timer (in seconds) |
| `_lastcountdown` | `number` | `nil` | Last integer countdown value sent to clients |
| `_dtoverride` | `number` | `0` | Delta time adjustment used for fast-forwarding on non-master shards |
| `_instant` | `boolean` | `false` | Whether reset should be immediate upon all-ghost condition |
| `_countdownmax` | `number` | `0` | Configured countdown duration (non-loading) |
| `_countdownloadingmax` | `number` | same as `_countdownmax` | Countdown duration during loading screen |
| `_syncperiod` | `number` | `5` | Interval (in seconds) for syncing countdown on master shard |
| `_cancelwhenempty` | `boolean` | `false` | Whether to cancel countdown when player count hits zero |
| `_wasempty` | `boolean` | `true` | Whether the shard was empty (zero players) in previous player count event |

## Main Functions

### `OnUpdate(dt)`
* **Description:** Main update loop for countdown timing. Handles delta-time accumulation, countdown decrement, network sync (master shard only), and triggering the final world reset when countdown reaches zero.
* **Parameters:**
  - `dt` (`number`): Delta time since last frame.

### `OnPostInit()`
* **Description:** Runs after component initialization. Executes one-time setup: triggers initial countdown handling via `OnCountdownDirty()`, and applies a one-time delta time override (adds 4 seconds) for non-master shards to compensate for network packet processing delays.
* **Parameters:** None.

## Events & Listeners

- **Listens for:**
  - `"countdowndirty"` → `OnCountdownDirty()`: Triggers countdown update when network countdown variable changes.
  - `"playeractivated"` (non-dedicated, non-master-sim) → `OnRefreshDialog()`: Refreshes dialog visibility when a player logs in.
  - `"entercharacterselect"` (non-dedicated, non-master-sim) → `OnRefreshDialog()`: Refreshes dialog visibility on character select.
  - `"ms_worldreset"` (master shard only) → `OnWorldResetFromSim()`: Halts countdown update if world reset is initiated from sim.
  - `"ms_setworldresettime"` (master shard only) → `OnSetWorldResetTime()`: Sets reset timing parameters (instant flag, countdown durations).
  - `"ms_playercounts"` (master shard only) → `OnPlayerCounts()`: Responds to player count changes (e.g., cancel reset if non-ghost players exist).

- **Triggers (`PushEvent`):**
  - `"worldresettick"` with `{ time = time }`: Broadcasts countdown tick to UI and other systems.
  - `"showworldreset"`: Requests world reset dialog to appear.
  - `"hideworldreset"`: Requests world reset dialog to disappear.
  - `"master_worldresetupdate"` with `{ countdown = value }`: Sends current countdown to all shards from master.

- **Network variable updates:**
  - Sets `worldreset._countdown` via `_countdown:set(value)` or `_countdown:set_local(value)`: Synchronizes countdown state across shards. Triggers `"countdowndirty"` on listeners.