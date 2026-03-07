---
id: quagmire_music
title: Quagmire Music
description: Manages background music playback for the Quagmire arena based on world level and win state, synchronized across clients.
tags: [audio, world, network, event]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 589c45c0
system_scope: audio
---

# Quagmire Music

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`QuagmireMusic` is a world-level component responsible for playing background music tracks in the Quagmire arena. It activates when a player enters the arena, plays music dynamically based on the current level (via networked state), and plays a victory sound upon winning. The component handles client-server synchronization using network variables and events, ensuring consistent audio behavior across all clients.

## Usage example
```lua
-- Typically added automatically to TheWorld in quagmire worlds
-- No direct manual usage required by modders
-- Example of manual usage (advanced use only):
inst:AddComponent("quagmire_music")
inst.components.quagmire_music._netvars.level:set(2)
```

## Dependencies & tags
**Components used:** `TheFocalPoint.SoundEmitter`, `TheWorld` (global), `event_server_data` (internal server utility)
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | (passed in) | The entity instance the component is attached to (typically `TheWorld`). |
| `_netvars.level` | `net_tinybyte` | `1` | Networked variable representing the current arena level; values correspond to indices in `MUSIC`. |
| `_netvars.won` | `net_event` | (unused in client code) | Network event fired when the arena is won. |
| `_activatedplayer` | `GActivePlayer` | `nil` | Cached reference to the player who activated the music session. |
| `_levelplaying` | `number?` | `nil` | Tracks the level index currently playing to prevent redundant sound restarts. |

## Main functions
The component has no publicly exposed methods. All functionality is encapsulated in private event handlers and initialization logic.

## Events & listeners
- **Listens to:**  
  `playeractivated` (on `TheWorld`) — triggers activation of music playback when a player enters the arena.  
  `playerdeactivated` (on `TheWorld`) — deactivates and cleans up music when the active player exits.  
  `leveldirty` (on `inst`) — triggers music change if the networked level changes.  
  `lavaarenamusic._netvars.won` (on `inst`) — plays the victory sound.
- **Pushes:** None identified.
