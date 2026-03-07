---
id: caveweather
title: Caveweather
description: Manages weather simulation including precipitation, moisture, wetness, and associated visual/audio effects in the Cave biome.
tags: [weather, cave, environment, network, simulation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 951f8466
system_scope: environment
---

# Caveweather

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Caveweather` is the core component responsible for simulating Cave weather dynamics, including moisture accumulation/dissipation, precipitation type (rain/acid rain), ground wetness, and related audio-visual effects. It operates under a client-server separation where the server (`_ismastersim == true`) controls game state logic and network sync, while the client handles rendering and sound playback. The component integrates with `raindomewatcher`, `acidlevel`, and `riftspawner` to adapt precipitation behavior based on location and game events.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("caveweather")
-- Master simulation sets precipitation mode and moisture manually
if TheWorld.ismastersim then
    inst.components.caveweather:OnSeasonTick(nil, { season = "spring", progress = 0.5 })
    inst.components.caveweather:OnSetPrecipitationMode("always")
end
-- Client receives networked updates via "weathertick" events
```

## Dependencies & tags
**Components used:** `raindomewatcher`, `acidlevel`, `riftspawner`, `areaaware`  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | `inst` | Reference to the entity owning this component (always `TheWorld`). |
| `_season` | string | `"autumn"` | Current season in the Cave (autumn, winter, spring, summer). |
| `_precipmode` | tinybyte enum | `0` (`"dynamic"`) | Precipitation mode: `0` dynamic, `1` always, `2` never. |
| `_preciptype` | tinybyte enum | `0` (`"none"`) | Precipitation type: `0` none, `1` rain, `2` acid rain. |
| `_wetness` | number (0–`MAX_WETNESS`) | `0` | Current wetness level of the player/environment. |
| `_wet` | boolean | `false` | Whether the current environment is considered wet. |

## Main functions
### `OnUpdate(dt)`
*   **Description:** Simulates weather progression over time per frame. Handles moisture accumulation/dissipation, wetness changes, precipitation initiation/cessation, and updating audio/visual FX based on calculated rates and player state.
*   **Parameters:** `dt` (number) - Delta time in seconds since last frame.
*   **Returns:** Nothing.
*   **Error states:** Does not fail under normal operation.

### `OnPostInit()`
*   **Description:** Initializes FX prefabs (`caverain`, `caveacidrain`) and spawns particles based on current precipitation type. Only runs on non-dedicated clients.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnRemoveEntity()`
*   **Description:** Cleans up FX prefabs and associated sounds. Only runs on non-dedicated clients.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnSeasonTick(src, data)`
*   **Description:** Updates seasonal parameters such as moisture rates and ceilings, based on the current season. Runs only on the server (`_ismastersim == true`).
*   **Parameters:**  
  *   `src` (GEntity) — Event source (`TheWorld`).  
  *   `data` (table) — Table with keys `season` (string) and `progress` (number, 0–1).
*   **Returns:** Nothing.

### `OnSetPrecipitationMode(src, mode)`
*   **Description:** Sets the precipitation mode (`"dynamic"`, `"always"`, or `"never"`). Runs only on the server.
*   **Parameters:**  
  *   `src` (GEntity) — Event source (`TheWorld`).  
  *   `mode` (string) — One of `"dynamic"`, `"always"`, or `"never"`.
*   **Returns:** Nothing.

### `OnDeltaMoisture(src, delta)`
*   **Description:** Adjusts the current moisture value by a given delta. Clamped to the current moisture floor/ceil bounds. Runs only on the server.
*   **Parameters:**  
  *   `src` (GEntity) — Event source (`TheWorld`).  
  *   `delta` (number) — Amount to add to current moisture.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted debug string summarizing current weather state for the in-game debug overlay.
*   **Parameters:** None.
*   **Returns:** string — A comma-separated list of key metrics: temperature, moisture/floor/ceil/rate, precipitation rate, wetness and rate, and wet status.
*   **Error states:** Returns `nil` if called in an invalid state (e.g., data nil).

## Events & listeners
- **Listens to:**  
  - `seasontick` — Updates seasonal moisture rates on server.  
  - `temperaturetick` — Caches current temperature.  
  - `phasechanged` — Tracks day/night state.  
  - `playeractivated` / `playerdeactivated` — Attaches/detaches rain FX to/from the active player.  
  - `ms_forceprecipitation`, `ms_setprecipitationmode`, `ms_setmoisturescale`, `ms_deltamoisture`, `ms_deltamoistureceil`, `ms_deltawetness`, `ms_simunpaused` — Master simulation commands.  
  - `moistureceildirty`, `preciptypedirty`, `wetdirty` — Triggers sync events for clients.  
  - `changearea` (on player) — Adjusts acid rain FX based on location capability.
- **Pushes:**  
  - `weathertick` — Fired each `OnUpdate` with moisture, precipitation rate, and wetness.  
  - `moistureceilchanged` — Fired on moisture ceiling sync.  
  - `precipitationchanged` — Fired on precipitation type sync.  
  - `wetchanged` — Fired when wet status changes.
