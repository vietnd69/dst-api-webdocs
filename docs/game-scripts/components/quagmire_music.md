---
id: quagmire_music
title: Quagmire Music
description: Manages background music playback for the Quagmire arena based on active players and level state.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: audio
source_hash: 589c45c0
---

# Quagmire Music

## Overview
This component handles Quagmire-specific background music playback in response to player activation/deactivation events and level changes. It uses networked variables to ensure synchronized music state across clients and master simulation, playing different tracks based on the current arena level or a victory theme upon winning.

## Dependencies & Tags
- **Components**: Relies on `inst.GUID` (inherited from the entity), `TheWorld`, and `TheFocalPoint.SoundEmitter`.
- **Tags**: None explicitly added or removed.
- **Network**: Uses `net_tinybyte` and `net_event` to bind state (`level`) and events (`won`) to the entity's GUID.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (passed in) | The entity the component is attached to. |
| `_world` | `TheWorld` (global) | `TheWorld` | Reference to the global world instance. |
| `_soundemitter` | `SoundEmitter` | `nil` | Sound emitter used for playing/canceling background music; assigned only when a player is active. |
| `_activatedplayer` | `Entity` (player) | `nil` | Cached reference to the currently active player; used for clean-up on deactivation. |
| `_levelplaying` | `number` | `nil` | Tracks the last level index whose music is playing; used to avoid redundant playback. |
| `_netvars.level` | `net_tinybyte` | `1` (initialized in `_ctor`) | Networked variable storing the current arena level (1 or 2). |
| `_netvars.won` | `net_event` | — | Network event pushed when the arena is won. |

## Main Functions
### `OnLevelDirty(inst)`
* **Description:** Checks for changes in the networked arena level and updates the background music accordingly. Stops the current BGM and plays the appropriate track (`cook_1` or `cook_2`) if the level changed.
* **Parameters:** `inst` — The entity instance (unused directly; used only for context in event callback).

### `OnWon(inst)`
* **Description:** Plays the victory music (`gorge_win`) when the arena is successfully completed.
* **Parameters:** `inst` — The entity instance (unused directly; used only for context in event callback).

### `OnPlayerDeactivated(src, player)`
* **Description:** Handles player deactivation by stopping background music and cleaning up resources if the deactivating player matches the currently active one.
* **Parameters:**  
  * `src` — The source of the event (typically `TheWorld`).  
  * `player` — The entity that was deactivated.

### `OnPlayerActivated(src, player)`
* **Description:** Activates music control when a player enters the arena. Deactivates any prior player’s session first, sets up event listeners and sound emitter, then triggers immediate level-based music playback.
* **Parameters:**  
  * `src` — The source of the event (typically `TheWorld`).  
  * `player` — The entity that was activated.

## Events & Listeners
- **Listens for:**
  - `"playeractivated"` (on `TheWorld`) → triggers `OnPlayerActivated`
  - `"playerdeactivated"` (on `TheWorld`) → triggers `OnPlayerDeactivated`
  - `"leveldirty"` (on `inst`) → triggers `OnLevelDirty`
  - `"lavaarenamusic._netvars.won"` (on `inst`) → triggers `OnWon`
- **Pushes events:**
  - None directly; relies on `net_event` for synchronization.