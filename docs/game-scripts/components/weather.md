---
id: weather
title: Weather
description: Manages global weather dynamics including precipitation, temperature-driven precipitation type, moisture accumulation and dissipation, snow accumulation, wetness, and lightning activity in Don't Starve Together.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: a2cd4068
---

# Weather

## Overview
The `weather` component is the core system responsible for simulating dynamic weather conditions in the game world. It calculates and synchronizes moisture levels, precipitation rates, snow accumulation, ground overlay state, player wetness, and ambient lighting adjustments over time. It operates differently on the master simulation (server) versus clients: the server computes game-logic-critical values (e.g., precipitation state, lightning triggers), while the client drives visual and audio feedback based on server-synced data. This component is typically attached to `TheWorld`.

## Dependencies & Tags
- **Components used internally:** None explicitly added via `AddComponent`. Relies on other systems via event listens (`seasontick`, `temperaturetick`, `phasechanged`, `playeractivated`, `playerdeactivated`, `ms_*` events).
- **Network variables:** Uses `net_float`, `net_tinybyte`, and `net_bool` for client-server synchronization of state.
- **Prefabs spawned (client-side only):** `"rain"`, `"snow"`, `"pollen"`, `"lunarhail"` (via `SpawnPrefab`) when not on a dedicated server.
- **Tags considered:** `"playerghost"`, `"INLIMBO"`, `"lightningrod"`, `"lightningtarget"`, `"lightningblocker"` (used only for lightning strike pathing logic).

## Properties
No public instance properties are defined outside `self.inst`. All key runtime state is held in local variables with `net_*` wrappers for persistence/sync. The constructor initializes a large number of local private variables for simulation and rendering.

## Main Functions

### `self:OnUpdate(dt)`
* **Description:** Main simulation and rendering update loop. Handles moisture accumulation/dissipation, precipitation toggling, snow accumulation/melting, wetness calculation, ground overlay updates, particle system rates, sound management, lightning timing, and pushes weather state via `weathertick`. Also calls `PushWeather` each frame.
* **Parameters:**
  * `dt` (number): Delta time in seconds since the last update.

### `self:GetDebugString()`
* **Description:** Returns a multi-line formatted string with current weather state (temperature, moisture, precipitation rate, snow level, lunar hail level, wetness, and light level) for use in debug overlays.
* **Parameters:** None.

### `self:OnPostInit()`
* **Description:** (Client-only) Initializes particle prefabs (`rain`, `snow`, `pollen`, `lunarhail`) once the player entity is available and attached.
* **Parameters:** None.

### `self:OnRemoveEntity()`
* **Description:** (Client-only) Removes all particle prefabs on entity cleanup.
* **Parameters:** None.

### `self:OnSave()`
* **Description:** (Master simulation only) Returns a table containing all critical weather state needed for world persistence.
* **Parameters:** None.

### `self:OnLoad(data)`
* **Description:** (Master simulation only) Restores all weather state from the `data` table during world load. Ensures networked values and simulation variables are re-synchronized.
* **Parameters:**
  * `data` (table): Saved state table produced by `OnSave`.

## Events & Listeners

### Listens For:
- `"seasontick"` — triggered on season change/transition (handled by `OnSeasonTick`)
- `"temperaturetick"` — triggered when temperature updates (handled by `OnTemperatureTick`)
- `"phasechanged"` — triggered on day/night/dusk/dawn phase change (handled by `OnPhaseChanged`)
- `"playeractivated"` — triggered when a local player becomes active (handled by `OnPlayerActivated`)
- `"playerdeactivated"` — triggered when a local player becomes inactive (handled by `OnPlayerDeactivated`)
- `"moistureceildirty"`, `"preciptypedirty"`, `"snowcovereddirty"`, `"wetdirty"` — internal sync events to push state changes to listeners (handled locally)
- `"ms_playerjoined"`, `"ms_playerleft"` — (server-only) track lightning targets
- `"ms_forceprecipitation"`, `"ms_setprecipitationmode"`, `"ms_setmoisturescale"`, `"ms_deltamoisture"`, `"ms_deltamoistureceil"`, `"ms_setsnowlevel"`, `"ms_deltawetness"`, `"ms_setlightningmode"`, `"ms_setlightningdelay"`, `"ms_sendlightningstrike"`, `"ms_simunpaused"`, `"ms_startlunarhail"` — (server-only) RPCs to manipulate weather state

### Pushes:
- `"weathertick"` — sent each frame with computed weather state (`moisture`, `pop`, `precipitationrate`, `snowlevel`, `lunarhaillevel`, `lunarhailrate`, `wetness`, `light`)
- `"moistureceilchanged"` — on moisture ceiling sync change
- `"precipitationchanged"` — on precipitation type change
- `"snowcoveredchanged"` — on ground snow cover state change
- `"wetchanged"` — on player wet state change
- `"ms_sendlightningstrike"` — (server-only) triggers a lightning strike at a position
- (via `self.inst:PushEvent`) `"lightningstrike"` — sent to entities struck (e.g., lightning rods)