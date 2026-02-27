---
id: lavaarenamusic
title: Lavaarenamusic
description: Manages background music playback for the Lava Arena based on the active player and current arena level.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: audio
source_hash: c6ff688c
---

# Lavaarenamusic

## Overview
This audio component dynamically controls background music in the Lava Arena by playing tracks when a player enters the arena and stopping when they exit. It listens for player activation/deactivation events, manages network synchronization of the arena level, and plays the appropriate music track (`fight_1`) when the level changes.

## Dependencies & Tags
- Relies on `TheWorld.SoundEmitter` for sound playback (`TheFocalPoint.SoundEmitter`).
- Requires the `playeractivated` and `playerdeactivated` events on `TheWorld`.
- Uses `TheWorld.ismastersim` to determine server-side initialization logic.
- Registers a network variable via `net_tinybyte` tied to `inst.GUID`.
- Calls `event_server_data("lavaarena", "components/lavaarenamusic").master_postinit(...)` on the master sim only.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `inst` (constructor param) | The entity this component is attached to. |
| `_world` | `World` | `TheWorld` | Reference to the current world instance. |
| `_soundemitter` | `SoundEmitter` or `nil` | `nil` | Active sound emitter used to play/kill music; assigned when a player activates. |
| `_activatedplayer` | `Entity` or `nil` | `nil` | Cache of the currently active arena player; used only for activation/deactivation tracking. |
| `_levelplaying` | `number` or `nil` | `nil` | Tracks the last music level that was played to detect changes. |
| `_netvars.level` | `net_tinybyte` | `net_tinybyte(inst.GUID, "lavaarenamusic._netvars.level", "leveldirty")` | Network variable reflecting the arena's current level (value sourced from `leveldirty` events). |

## Main Functions
No public methods are exposed by this component — all functionality is event-driven and internal.

## Events & Listeners
- **Listens for `"playeractivated"` on `TheWorld`** → Triggers `OnPlayerActivated(src, player)`.
- **Listens for `"playerdeactivated"` on `TheWorld`** → Triggers `OnPlayerDeactivated(src, player)`.
- **Listens for `"leveldirty"` on `inst`** (only when a player is active) → Triggers `OnLevelDirty(inst)` to reload music if the level changed.