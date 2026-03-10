---
id: debugsounds
title: Debugsounds
description: Hooks into the sound emitter system to capture and log sound events for debugging purposes, including tracking looping and one-shot sounds on entities and UI.
tags: [audio, debug, network]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: afd794bf
system_scope: audio
---

# Debugsounds

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Debugsounds` is not a traditional component but a runtime patch applied to core sound emitter and simulator functions to enable in-game debugging of audio behavior. It intercepts `SoundEmitter.PlaySound`, `SoundEmitter.KillSound`, `SoundEmitter.KillAllSounds`, `SoundEmitter.SetParameter`, `SoundEmitter.SetVolume`, and `Sim.SetListener` to track and store sound metadata — such as owner, position, volume, and parameters — for both world-space sounds and UI sounds. It maintains separate lists for looping and one-shot sounds and periodically updates sound positions via `scheduler`. The module also provides `GetSoundDebugString()` to generate a human-readable debug output of current sound activity.

## Usage example
This module is automatically activated when the game is run in debug mode (e.g., via console commands or dev builds). Modders typically do not interact with it directly, but can retrieve debug output by calling:
```lua
local debugLog = GetSoundDebugString()
print(debugLog)
```

## Dependencies & tags
**Components used:** None (modifies global SoundEmitter and Sim objects directly).
**Tags:** None identified.

## Properties
No public properties; global `SoundEmitter.SoundDebug` table is used as a module-level store.

## Main functions
### `GetSoundDebugString()`
* **Description:** Generates a formatted multi-line string summarizing active looping sounds (world and UI), recent one-shot world sounds, and recent one-shot UI sounds. Only includes sounds within `maxDistance` (default `30`) for world sounds.
* **Parameters:** None.
* **Returns:** `string` — formatted debug output with entries like `[sound_name] event_name owner:guid prefab position dist volume params{...}`.
* **Error states:** None; silent handling of missing or invalid entities/sounds during iteration.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls).
- **Pushes:** None (no `inst:PushEvent` calls).
- **Periodic update:** Uses `scheduler:ExecutePeriodic(1, DoUpdate)` to refresh positions and clean up stale looping sounds every 1 second.