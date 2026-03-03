---
id: weather
title: Weather
description: Manages dynamic weather systems including precipitation, temperature, moisture, wetness, snow accumulation, lightning, and atmospheric lighting.
tags: [weather, environment, lighting, precipitation]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: a2cd4068
system_scope: environment
---

# Weather

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `weather` component implements the game's comprehensive weather system, handling dynamic precipitation (rain, snow, lunar hail), moisture accumulation and dissipation, ground overlays (snow and puddles), wetness tracking for gameplay effects, lightning generation, and lighting adjustments based on season and weather state. It operates on both server and client, with the server authoritative over state transitions and the client responsible for visual and audio effects synchronization. The component integrates with `health`, `lightningblocker`, `moonstorms`, `playerlightningtarget`, `raindomewatcher`, and `riftspawner` components to handle interactions like lightning targeting, moonstorm interference, and shelter protection.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("weather")
-- Server-side control examples:
inst.components.weather:PushEvent("ms_setprecipitationmode", "always")
inst.components.weather:PushEvent("ms_setmoisturescale", 2.0)
inst.components.weather:PushEvent("ms_deltamoisture", 10)
inst.components.weather:PushEvent("ms_setsnowlevel", 0.5)
```

## Dependencies & tags
**Components used:** `health`, `lightningblocker`, `moonstorms`, `playerlightningtarget`, `raindomewatcher`, `riftspawner`, `sandstorms`, `sheltered`, `inventory`
**Tags:** Checks `playerghost`, `INLIMBO`, `lightningrod`, `lightningtarget`, `lightningblocker`, `umbrella`, `metal`; adds `weather` tag implicitly on `TheWorld`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The entity instance this component is attached to (always `TheWorld`). |
| `_preciptype` | `net_tinybyte` | `0` (none) | Networked precipitation type: 0=none, 1=rain, 2=snow, 3=lunarhail. |
| `_precipmode` | `net_tinybyte` | `0` (dynamic) | Networked precipitation mode: 0=dynamic, 1=always, 2=never. |
| `_moisture` | `net_float` | `0` | Current moisture level. |
| `_moisturefloor` | `net_float` | `0` | Minimum moisture threshold before rain starts. |
| `_moistureceil` | `net_float` | `0` | Maximum moisture threshold before rain ends. |
| `_moisturerate` | `net_float` | `0` | Current moisture accumulation rate. |
| `_snowlevel` | `net_float` | `0` | Snow layer coverage, 0–1. |
| `_wetness` | `net_float` | `0` | Player wetness level (0–`MAX_WETNESS`). |
| `_wet` | `net_bool` | `false` | Networked flag indicating player is wet. |
| `_lightningmode` | number | `0` (rain) | Lightning activation mode (see constants). |

## Main functions
### `GetDebugString()`
*   **Description:** Returns a multi-line debug string with current weather state values, including moisture, precipitation rate, snow level, lunar hail level, wetness, and lightning timing (server only). Used in `/devmenu` and debug overlays.
*   **Parameters:** None.
*   **Returns:** `string` — Formatted debug output.
*   **Error states:** None; always returns a string.

### `OnUpdate(dt)`
*   **Description:** The core update loop (also aliased as `LongUpdate`). Runs every frame to advance weather simulation, process precipitation accumulation/dissipation, update ground overlays, wetness, lighting, sounds, and particle effects. Server triggers precipitation state changes and lightning; client interpolates and renders.
*   **Parameters:** `dt` (number) — Delta time in seconds.
*   **Returns:** Nothing.
*   **Error states:** Client updates are interpolated and may not exactly match server; critical logic is never run on client.

### `OnPostInit()`
*   **Description:** Initializes particle FX prefabs (`rain`, `snow`, `pollen`, `lunarhail`) after the weather system is attached to an entity. Only runs on non-dedicated clients.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** No-op if `_hasfx` is `false` (dedicated server).

### `OnRemoveEntity()`
*   **Description:** Cleans up FX prefabs and associated sounds when the component (and `TheWorld`) is destroyed.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Ensures safe removal even if FX are invalid.

### `OnSave()`
*   **Description:** Returns a table containing all master-simulation state necessary to persist weather across saves (season, temperature, moisture, precipitation, lightning, wetness, etc.). Only implemented on master simulation.
*   **Parameters:** None.
*   **Returns:** `table` — State data for serialization.

### `OnLoad(data)`
*   **Description:** Restores weather state from `data` table during load. Updates all internal variables and immediately triggers a `weathertick` event.
*   **Parameters:** `data` (table) — Previously saved state.
*   **Returns:** Nothing.
*   **Error states:** Uses safe defaults if fields are missing.

## Events & listeners
- **Listens to:**  
  - `"seasontick"` — Updates seasonal parameters and moisture rates.  
  - `"temperaturetick"` — Caches current temperature for precipitation type decisions.  
  - `"phasechanged"` — Tracks day/night cycle for lighting calculations.  
  - `"playeractivated"` — Attaches FX to local player.  
  - `"playerdeactivated"` — Detaches FX.  
  - `"moistureceildirty"`, `"preciptypedirty"`, `"snowcovereddirty"`, `"wetdirty"` — Reprojects network changes.  
  - `"ms_playerjoined"`, `"ms_playerleft"` — Manages lightning target list (master only).  
  - `"ms_forceprecipitation"`, `"ms_setprecipitationmode"`, `"ms_setmoisturescale"`, `"ms_deltamoisture"`, `"ms_deltamoistureceil"`, `"ms_setsnowlevel"`, `"ms_deltawetness"`, `"ms_setlightningmode"`, `"ms_setlightningdelay"`, `"ms_sendlightningstrike"`, `"ms_simunpaused"`, `"ms_startlunarhail"` — Master-only control events.  
- **Pushes:**  
  - `"weathertick"` — Fired every update with current weather state (`moisture`, `pop`, `precipitationrate`, `snowlevel`, `lunarhaillevel`, `lunarhailrate`, `wetness`, `light`).  
  - `"moistureceilchanged"`, `"precipitationchanged"`, `"snowcoveredchanged"`, `"wetchanged"` — Reactivity triggers for networked changes.
