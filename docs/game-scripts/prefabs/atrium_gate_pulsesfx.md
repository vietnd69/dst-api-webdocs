---
id: atrium_gate_pulsesfx
title: Atrium Gate Pulsesfx
description: Creates local, non-networked sound-effect entities for Atrium gate events, playing positional audio for players inside the Nightmare zone or everywhere outside vaults.
tags: [audio, fx, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9cdd9a17
system_scope: audio
---

# Atrium Gate Pulsesfx

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file defines prefabs for local sound effects used during Atrium gate and Grotto war events. It dynamically creates temporary sound-emitting entities positioned relative to the focal point and the local player, with volume attenuation based on distance. Sound playback is context-sensitive: some sounds play only when the player is inside a "Nightmare" area; others play everywhere except inside vaults. These are client-only FX entities — not simulated on dedicated servers.

## Usage example
Typical usage is internal and handled automatically by the game when the corresponding prefabs are spawned via `SpawnPrefab` or `SpawnPrefabWithPos`, e.g.:
```lua
local pulsefx = SpawnPrefab("atrium_gate_pulsesfx")
-- Positioning and audio are handled internally by the prefab's logic
```
No direct component interaction is required; this file defines prefabs, not reusable components.

## Dependencies & tags
**Components used:** `areaaware` (via `player.components.areaaware:CurrentlyInTag("Nightmare")`)
**Tags:** Adds `"FX"` tag to created FX entities.

## Properties
No public properties.

## Main functions
This file exports only prefabs; no user-callable functions are defined in the public API. All functionality is encapsulated in local helper functions `PlayWarningSound` and `makesfx`.

### `PlayWarningSound(proxy, sound, playanywhere)`
* **Description:** Internal helper that spawns a temporary sound entity at a distance-determined offset from the focal point, based on player location and zone tags. Only runs in the local context (non-dedicated server). Handles both zone-restricted and universal play conditions.
* **Parameters:**  
  `proxy` (Entity) — reference entity used to compute relative position.  
  `sound` (string) — sound path to play.  
  `playanywhere` (boolean) — if true, plays anywhere except inside vaults; otherwise, only when player is in a "Nightmare"-tagged area.
* **Returns:** Nothing.
* **Error states:** Returns early without spawning if:
  - `playanywhere` is false and player is not in a "Nightmare" area (or has no `areaaware` component), or
  - `playanywhere` is true and the player is inside a vault.

### `makesfx(sound, playanywhere)`
* **Description:** Factory function that returns a callback to spawn and configure a temporary FX entity for a given sound and play condition. Used to construct prefabs with unique sound paths.
* **Parameters:**  
  `sound` (string) — sound file path to play.  
  `playanywhere` (boolean) — whether to play outside vaults or only in Nightmare areas.
* **Returns:** (function) A function that, when called, creates and returns a temporary FX entity.
* **Error states:** Returns early on dedicated servers without spawning FX (unless called by non-dedicated process, where it still returns a local entity).

## Events & listeners
- **Listens to:** None.
- **Pushes:** None.

