---
id: lavaarenamusic
title: Lavaarenamusic
description: Manages background music playback for the Lava Arena event based on the currently activated player and level state.
tags: [audio, event, lavaarena]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: c6ff688c
system_scope: audio
---

# Lavaarenamusic

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Lavaarenamusic` is a component that controls background music (BGM) for the Lava Arena event in *Don't Starve Together*. It responds to player activation/deactivation events to manage music playback dynamically. When a player enters the arena, the component initializes audio playback for the arena's level music and updates playback if the arena level changes. It is designed to run only on the master simulation (`ismastersim`) and relies on network replication to sync music level changes.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("lavaarenamusic")
-- Component automatically activates on player events; no manual setup required
```

## Dependencies & tags
**Components used:** `SoundEmitter` (via `TheFocalPoint.SoundEmitter`), network variables (`net_tinybyte`)  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `TheMiniEntity` | — | The entity instance this component is attached to. |
| `_activatedplayer` | `entity` or `nil` | `nil` | The currently active player who triggered music playback. |
| `_levelplaying` | `number` or `nil` | `nil` | The currently playing music level index. |
| `_netvars.level` | `net_tinybyte` | — | Network-replicated variable tracking the arena level; triggers music updates on change. |

## Main functions
### `Class(function(self, inst) ... end)`
*   **Description:** Constructor for the `Lavaarenamusic` component. Initializes event listeners, sets up network variables, and prepares the component to respond to player and level changes. Does not return a value.
*   **Parameters:** `inst` (`TheMiniEntity`) — the entity instance this component is attached to.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `playeractivated` — triggers music startup for the newly activated player.
  - `playerdeactivated` — stops music playback when the player leaves the arena.
  - `leveldirty` — triggers music restart when the arena level changes (e.g., a new arena wave starts).
- **Pushes:** None identified
