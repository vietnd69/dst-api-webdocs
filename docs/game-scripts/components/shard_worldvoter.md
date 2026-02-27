---
id: shard_worldvoter
title: Shard Worldvoter
description: Synchronizes world voting state across clients and the master shard in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: 8bac443d
---

# Shard Worldvoter

## Overview
The `Shard_WorldVoter` component synchronizes world vote state—including vote status, countdown, participants, and squelched players—between the master shard and client shards in a multiplayer session. It ensures that vote-related data is consistently replicated across the network by using dedicated network variables and event-driven synchronization.

## Dependencies & Tags
- Requires `TheWorld.ismastersim` (fails on non-mastersim instances via `assert`).
- No other components are added or required on the entity.
- No tags are added or removed by this component.

## Properties
The component does not define public instance properties via `_ctor`. Instead, it initializes private network variables and local tables for internal use. The only public property explicitly exposed is:

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `inst` (passed to constructor) | Reference to the owning entity (typically `TheWorld` or a shard instance). |

All other state is stored in private network variables (e.g., `_enabled`, `_countdown`) and local closures (`_voters`, `_squelched`, `_squelchedpool`).

## Main Functions
No public methods are defined in this component; all functionality is implemented via private event handlers registered during initialization.

## Events & Listeners
### Master Shard (`ismastershard = true`)
- Listens for:
  - `"master_worldvoterenabled"` → triggers `OnVoterEnabled` to set `_enabled`
  - `"master_worldvoterupdate"` → triggers `OnVoterUpdate` to update vote state (countdown, command ID, voters, etc.)
  - `"master_worldvotersquelchedupdate"` → triggers `OnSquelchedUpdate` to manage squelched players list

### Non-Master Shard (`ismastershard = false`)
- Listens for:
  - `"voterenableddirty"` → triggers `OnVoterEnabledDirty`, which pushes `"secondary_worldvoterenabled"` with the current enabled state
  - `"voterdirty"` → triggers `OnVoterDirty`, which collects current voter data and pushes `"secondary_worldvoterupdate"` event
  - `"squelcheddirty"` → triggers `OnSquelchedDirty`, which aggregates squelched user IDs and pushes `"secondary_worldvotersquelchedupdate"`

No events are pushed by the component on the master shard; it only receives external vote update events and synchronizes them via network variables.