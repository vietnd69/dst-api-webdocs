---
id: lavaarenaeventstate
title: Lavaarenaeventstate
description: Manages the state of the Lava Arena event including current round, victory status, and player quest progress across the network in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: network
source_hash: d46ba4a1
---

# Lavaarenaeventstate

## Overview
This component tracks and synchronizes the Lava Arena event's state—such as the current round, match outcome (playing/victory/defeat), progression data, and per-player quest status—over the network in Don't Starve Together. It is attached to the world entity and coordinates between server-side logic and client-side UI updates.

## Dependencies & Tags
- Uses `TheNet:GetServerMaxPlayers()` for dynamic player slot allocation.
- Attaches network variables to the world instance (`inst.GUID`).
- Triggers the server-side post-initialization via `event_server_data("lavaarena", "components/lavaarenaeventstate").master_postinit(...)`.
- Registers for community progression updates via `Lavaarena_CommunityProgression:RegisterForWorld()`.

No explicit components or tags are added/removed on the entity.

## Properties
The following properties are initialized in the constructor, primarily as network variable containers.

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | passed-in | Reference to the host entity (typically `TheWorld`). |
| `_world` | `World` | `TheWorld` | Local reference to the current world instance. |
| `_ismastersim` | `boolean` | `_world.ismastersim` | Indicates if this instance is on the master simulation (server). |
| `_netvars.round` | `net_smallbyte` | N/A | Network variable for the current round number (client-viewable, 1+). |
| `_netvars.victorystate` | `net_tinybyte` | N/A | Network variable encoding match state: 0=Playing, 1=Victory, 2=Defeat. |
| `_netvars.progression_json` | `net_string` | N/A | JSON string storing server-side Lava Arena progression data. |
| `_netvars.player_quest_json[i]` | `net_string` (array) | N/A | Array of network strings (indexed 1–max players), each storing per-player quest status. |

## Main Functions

### `GetServerProgressionJson()`
* **Description:** Returns the current server-held Lava Arena progression data as a JSON string.
* **Parameters:** None.

### `GetCurrentRound()`
* **Description:** Returns the current round number, clamped to at least 1 (used for UI display and logic).
* **Parameters:** None.

### `GetServerPlayerQuestJson(quest_slot)`
* **Description:** Returns the JSON string representing the current player quest status for a given quest slot index (1-indexed).
* **Parameters:**  
  - `quest_slot` (number): Index of the quest slot (expected 1 to `TheNet:GetServerMaxPlayers()`).

### `GetDebugString()`
* **Description:** Returns a placeholder debug string (currently `"?"`); no active debug data is formatted.
* **Parameters:** None.

## Events & Listeners

- Listens for `"victorystatedirty"` and `"playeractivated"` events on the world instance:
  - On receipt, triggers `OnVictoryStateDirty`, which—on non-dedicated clients with a valid `ThePlayer`—pushes `"endofmatch"` with `{ victory = true/false }` depending on the new victory state.
- Server-side: calls `master_postinit(...)` during initialization to perform server-specific setup.
- Registers for community progression updates via `Lavaarena_CommunityProgression:RegisterForWorld()` (external hook; not an event * emitted * by this component).