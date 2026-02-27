---
id: maprevealer
title: Maprevealer
description: Periodically reveals the map around the entity to all connected players in rotation.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 43395d98
---

# Maprevealer

## Overview
The `MapRevealer` component incrementally reveals the game world map around the entity’s location to all active players in sequential batches. It operates asynchronously using timed tasks to distribute map-revealing operations across the player list, ensuring balanced server load and smooth gameplay. When activated, it adds the `"maprevealer"` tag to the entity and schedules periodic map-reveal cycles.

## Dependencies & Tags
- **Component Dependencies**: None explicitly declared in `Class` constructor.
- **Tags Added**: `"maprevealer"` (added in `Start()` if no task is active).
- **Tags Removed**: `"maprevealer"` is removed in `Stop()` upon cancellation.
- **External Dependencies**: Relies on `AllPlayers` global array, player’s `player_classified.MapExplorer:RevealArea()` method, and the `POSTACTIVATEHANDSHAKE.READY` state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set in `_ctor`) | Reference to the owning entity. |
| `revealperiod` | `number` | `5` | Base time (in seconds) between full player cycles (updated dynamically per player count). |
| `task` | `Task` | `nil` | Pending scheduled task; used to control cycle repetition and cancellation. |

## Main Functions

### `Start(delay)`
* **Description:** Begins or resumes the map-reveal cycle by scheduling a delayed start. Ensures only one task is active at a time. Adds the `"maprevealer"` tag before scheduling. If `delay` is omitted, a random offset (0–0.5s) is applied to reduce synchronization.
* **Parameters:**
  * `delay` *(optional, number)*: Time in seconds to wait before initiating the reveal cycle.

### `Stop()`
* **Description:** Halts the current reveal cycle. Removes the `"maprevealer"` tag, cancels the pending task, and clears the task reference.
* **Parameters:** None.

### `RevealMapToPlayer(player)`
* **Description:** Reveals the map area centered at the entity’s position for a specific player, but only if the player’s client has completed handshake and is fully ready.
* **Parameters:**
  * `player` *(Entity)*: The player entity to reveal the map for. Must have a valid `player_classified.MapExplorer` component.

## Events & Listeners
- **`inst:DoTaskInTime(delay, OnStart, self)`** — Internal task scheduler; `OnStart` triggers full player-cycle initialization.
- **`inst:DoTaskInTime(delay, OnRevealing, self, delay, players)`** — Scheduled iteratively to process each player in rotation.
- **`inst:DoTaskInTime(delay, OnRestart, self, delay)`** — Scheduled to restart the full cycle after exhausting all players.
- **`MapRevealer.OnRemoveFromEntity = MapRevealer.Stop`** — Hook into entity removal to ensure cleanup (not an event listener, but a cleanup callback).