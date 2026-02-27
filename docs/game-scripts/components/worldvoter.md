---
id: worldvoter
title: Worldvoter
description: Manages the lifecycle of in-game votes, including starting, tracking, counting, and concluding votes across master simulation and secondary shards in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: c727b55a
---

# Worldvoter

## Overview
The `Worldvoter` component orchestrates the complete voting process in Don't Starve Together, including vote initiation, player selection tracking, countdown management, result calculation, and UI coordination. It operates under distinct roles depending on whether the instance is the master simulation and/or master shard: on the master shard, it handles authoritative vote state and network synchronization; on secondary shards or clients, it consumes and reflects the authoritative state via network events. The component integrates with `UserCommands`, `TheNet`, and per-player voting state to ensure consistent, synchronized voting behavior across all connected clients.

## Dependencies & Tags
- **Component Dependencies**:
  - Requires `inst` to have `components.playervoter` on players for local vote selection and squelch status updates.
  - Relies on `TheWorld`, `TheNet`, `UserCommands`, and `TUNING` globals.
- **Tags/Entities**:
  - Attaches to `TheWorld` instance (not player or entity scoped).
  - No explicit tags added/removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the host entity (`TheWorld`). Public-facing. |
| `_world` | `World` | `TheWorld` | Local reference to the current world instance. |
| `_ismastersim` | `boolean` | `TheWorld.ismastersim` | True if this instance runs master simulation logic. |
| `_ismastershard` | `boolean` | `TheWorld.ismastershard` | True if this instance is the master shard (authoritative vote state). |
| `_enabled` | `net_bool` | `false` | Networked flag indicating whether voting is globally enabled. |
| `_countdown` | `net_byte` | `0` | Networked countdown timer for the active vote. |
| `_commandid` | `net_uint` | `0` | Networked hash of the active command initiating the vote. |
| `_targetuserid` | `net_string` | `""` | Networked user ID of the vote target. |
| `_starteruserid` | `net_string` | `""` | Networked user ID of the user who started the vote. |
| `_votecounts` | `array<net_byte>` | `{}` (64 entries) | Networked vote counts per option (indexed 1..`MAX_VOTE_OPTIONS`). |
| `_shown` | `boolean` | `false` | Local flag indicating if the vote dialog is currently visible. |
| `_updating` | `boolean` | `false` | Whether the component is actively updating its countdown. |

## Main Functions

### `self:IsVoteActive()`
* **Description:** Returns whether a vote dialog is currently displayed (`_shown`).
* **Parameters:** None.
* **Returns:** `boolean`

### `self:IsEnabled()`
* **Description:** Returns the global voting state (`_enabled`).
* **Parameters:** None.
* **Returns:** `boolean`

### `self:OnUpdate(dt)`
* **Description:** Core update loop for vote countdown and result processing. Manages countdown decrement, network sync, voting timeout (if expired), and result checks when votes are cast or delay completes.
* **Parameters:**
  * `dt` (`number`): Delta time since last update.

### `self:OnPostInit()`
* **Description:** Post-initialization hook. Enables voting if configured or in dev mode, and adjusts countdown for client-side sync delays.
* **Parameters:** None.

## Events & Listeners

- **Listens For:**
  - `"countdowndirty"` → `OnCountdownDirty()`  
  - `"playeractivated"` → `OnRefreshDialog()` *(non-dedicated only)*  
  - `"ms_playerjoined"` → `OnPlayerJoined()` *(master sim only)*  
  - `"ms_startvote"` → `OnStartVote()` *(master shard only)*  
  - `"ms_stopvote"` → `OnStopVote()` *(master shard only)*  
  - `"ms_receivevote"` → `OnReceiveVote()` *(master shard only)*  
  - `"secondary_worldvoterupdate"` → `OnWorldVoterUpdate()` *(non-master shard, master sim only)*  
  - `"secondary_worldvotersquelchedupdate"` → `OnWorldVoterSquelchedUpdate()` *(non-master shard, master sim only)*  
  - `"secondary_worldvoterenabled"` → `OnWorldVoterEnabled()` *(non-master shard, master sim only)*  
  - `"votecountsdirty"` → `UpdateVoteCounts()` *(non-master sim only)*

- **Triggers (Pushes):**
  - `"worldvotertick"` *(via `UpdateCountdown`)*  
  - `"showvotedialog"` *(via `ShowVoteDialog`)*  
  - `"hidevotedialog"` *(via `HideVoteDialog`)*  
  - `"votecountschanged"` *(via `UpdateVoteCounts`)*  
  - `"master_worldvoterupdate"` *(via `PushMasterVoterData`)*  
  - `"master_worldvotersquelchedupdate"` *(via `PushMasterSquelchedData`)*  
  - `"master_worldvoterenabled"` *(in `OnPostInit`)*