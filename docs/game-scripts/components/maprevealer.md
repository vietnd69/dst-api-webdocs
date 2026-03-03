---
id: maprevealer
title: Maprevealer
description: Reveals map areas to players in a轮播 manner across multiple ticks, typically used by map-related entities like the Map Room or Map Table.
tags: [map, world, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 43395d98
system_scope: world
---

# Maprevealer

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`MapRevealer` manages incremental map revelation for players in the world. When active, it cycles through all connected players, revealing the area around its entity's position to each player in sequence over a fixed time window. This prevents client-side overload from simultaneous large map updates. The component adds the `maprevealer` tag while active and coordinates with each player's `MapExplorer` component to perform revelation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddPosition()
inst:AddComponent("maprevealer")
inst.components.maprevealer:Start(0) -- Immediate start
-- Later, to stop:
inst.components.maprevealer:Stop()
```

## Dependencies & tags
**Components used:** None (uses only global functions and `AllPlayers`, `POSTACTIVATEHANDSHAKE`, and player-owned components like `player_classified.MapExplorer`).
**Tags:** Adds `maprevealer` when started; removes it when stopped.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `revealperiod` | number | `5` | Total time in seconds over which all players will be revealed (i.e., the time interval per player scales with player count). |
| `task` | Task or `nil` | `nil` | Reference to the scheduled task for revelation pacing; `nil` when idle. |

## Main functions
### `Start(delay)`
* **Description:** Starts the map revelation cycle. Waits `delay` seconds (or up to `0.5` seconds randomly if `delay` is `nil`), then begins revealing the map to all connected players in rotation.
* **Parameters:** `delay` (number?, optional) — delay before starting, in seconds. If omitted, defaults to a random value between `0` and `0.5`.
* **Returns:** Nothing.
* **Error states:** If a task is already running (`self.task ~= nil`), this function does nothing.

### `Stop()`
* **Description:** Immediately cancels any pending revelation task, removes the `maprevealer` tag, and halts further map revelation.
* **Parameters:** None.
* **Returns:** Nothing.

### `RevealMapToPlayer(player)`
* **Description:** Reveals the area around the entity's position to a single player. Only proceeds if the player is fully initialized (post-handshake) and has a valid `MapExplorer` component.
* **Parameters:** `player` (Entity) — the player entity to reveal the map to.
* **Returns:** Nothing.
* **Error states:** Returns early (no effect) if `player._PostActivateHandshakeState_Server` is not `POSTACTIVATEHANDSHAKE.READY`, or if `player.player_classified` or `player.player_classified.MapExplorer` is `nil`.

## Events & listeners
- **Listens to:** None (event handling is implemented via scheduled `DoTaskInTime` callbacks: `OnStart`, `OnRevealing`, `OnRestart`).
- **Pushes:** None.
- **Cleans up on removal:** `MapRevealer.OnRemoveFromEntity` is aliased to `MapRevealer.Stop`, ensuring the task is canceled and tag is removed when the component is removed from the entity.
