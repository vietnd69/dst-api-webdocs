---
id: ambientsound
title: Ambientsound
description: Manages dynamic ambient and wave sound mixing based on the player's location, season, weather, and sanity states.
tags: [audio, environment, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 533a5b6a
system_scope: audio
---

# Ambientsound

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Ambientsound` dynamically manages layered ambient sound mixing (e.g., meadow, forest, cave) and wave sounds (e.g., ocean, pit) for the current world tile and environmental conditions. It integrates with the game’s map, season, weather, and light systems to adjust volume, daytime parameter, and reverb. It also modulates sanity- and enlightenment-based audio effects (e.g., sanity whisper or lunacy hum). This component is typically added to the world or map entity to provide immersive, context-aware background audio.

## Usage example
```lua
-- Typically added automatically to the world entity during initialization.
-- For testing or custom worldgen, you can manually add it:
local inst = CreateEntity()
inst:AddComponent("ambientsound")
inst.components.ambientsound:SetReverbPreset("cave")
inst.components.ambientsound:SetWavesEnabled(true)
```

## Dependencies & tags
**Components used:** `lunarhailbirdsoundmanager`, `state`, `sanity`, `lightwatcher`
**Tags:** None added, removed, or checked directly (uses `inst:HasTag("cave")` during initialization to disable wave sounds).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `ent` | — | The entity the component is attached to (assigned in constructor). |
| `_soundvolumes` | table | `{}` | Maps sound keys to normalized volume multipliers (updated per frame). |
| `_ambientvolume` | number | `1` | Global ambient volume multiplier (affected by light levels). |
| `_wavesvolume` | number | `0` | Wave sound volume (0–1), based on proximity to impassable tiles. |
| `_wavessound` | string | `"dontstarve/AMB/waves"` | Base sound path for wave layer (season-dependent). |
| `_seasonmix` | string | `"autumn"` | Current season key (`"autumn"`, `"winter"`, `"spring"`, `"summer"`). |
| `_rainmix` | boolean | `false` | Whether light rain is active. |
| `_heavyrainmix` | boolean | `false` | Whether heavy rain is active (`precipitationrate > 0.5`). |
| `_daytimeparam` | number | `1` | Time-of-day scaling factor (affects playback rate or effects in sound bank). |
| `_sanityparam` | number | `0` | Sanity-based volume factor (0–1, higher when insane). |
| `_enlightparam` | number | `0` | Enlightenment (lunacy) level (0–1). |
| `_tileoverrides` | table | `{}` | Map of tile overrides (`tile → override_tile`). |
| `_wavesenabled` | boolean | `true` unless cave | Enables/disables wave sound layer. |

## Main functions
### `SetReverbPreset(preset)`
* **Description:** Applies a global reverb preset to the Sim audio system.
* **Parameters:** `preset` (string) — e.g., `"default"`, `"cave"`, `"open"`.
* **Returns:** Nothing.

### `SetWavesEnabled(enabled)`
* **Description:** Enables or disables the wave sound layer. When disabled, wave sounds will not play, regardless of tile proximity.
* **Parameters:** `enabled` (boolean) — whether to enable waves.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Core update loop. Recomputes ambient sound mix based on the player’s current tile and neighbors, adjusts volumes over time, and updates sanity/enlightenment effects.
* **Parameters:** `dt` (number) — delta time in seconds.
* **Returns:** Nothing.

### `OnPostInit()`
* **Description:** Called after component initialization. Triggers an immediate `OnUpdate` with a large timestep (`20`) to resolve any initial fade-ins instantly.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted multi-line string for debugging. Includes current rain/season/waves state, volumes, daytime params, and active sounds.
* **Parameters:** None.
* **Returns:** `string` — human-readable debug output.

## Events & listeners
- **Listens to:**
  - `"overrideambientsound"` — updates `_tileoverrides` with a new tile override mapping.
  - `"setambientsounddaytime"` — updates `_daytimeparam` and `_nobirddaytimeparam` and reapplies to active sounds.
  - `"seasontick"` — updates `_seasonmix` and resets `_lastplayerpos` to force mix recalculation.
  - `"weathertick"` — updates `_heavyrainmix` based on precipitation rate.
  - `"precipitationchanged"` — updates `_rainmix` on precipitation state change.
  - `"updateambientsoundparams"` — forces reapplication of daytime params to active sounds.
- **Pushes:** None.

## Notes
- Ambient sounds are mixed from up to `MAX_MIX_SOUNDS = 3` tiles around the player (5×5 tile radius).
- Volume for each sound is `tile_count / totalsoundcount`, scaled by `_ambientvolume`.
- `_ambientvolume` is dynamically attenuated at night/dusk based on the player’s light level using an `outCubic` easing curve.
- Wave sounds depend on `WAVE_VOLUME_SCALE`, derived from `HALF_TILES = 5`.
- The component watches the `"phase"` world state (`"day"`, `"dusk"`, `"night"`) via `inst:WatchWorldState` to adjust `_lightattenuation` and daytime parameters.
- Birdless ambience is supported for certain sounds (e.g., `"dontstarve/AMB/meadow"`) via `lunarhailbirdsoundmanager:GetIsBirdlessAmbience()`.
