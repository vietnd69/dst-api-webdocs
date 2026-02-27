---
id: fumarolelocaltemperature
title: Fumarolelocaltemperature
description: Manages dynamic local temperature calculations for fumarole areas using seasonal, noise-based, and global modifiers.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: environment
source_hash: 1a503ac4
---

# Fumarolelocaltemperature

## Overview
This component computes and provides real-time temperature values for fumarole-affected areas in the world. It combines seasonal temperature cycles, Perlin noise, global temperature modifiers (multiplier and locus), and local spatial interpolation to determine temperature at specific coordinates. The `TemperatureOverrider` component (which consumes this component via `GetTemperatureAtXZ`) uses its public interface to override default tile temperatures in zones tagged `"fumarolearea"`.

## Dependencies & Tags
- **Component dependency:** Requires `temperatureoverrider` to be loaded (via `require("components/temperatureoverrider")`).  
- **Entity tag usage:** Uses `inst:ListenForEvent("seasontick", ...)` and listens for `"ms_simunpaused"` (master sim only).  
- **Map tags used:** Reads `"fumarolearea"` tag from tile nodes (via `_map:NodeAtTileHasTag(...)`).  
- **No entity tags added or removed** by this component itself.

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `GEntity` | — | Reference to the owning entity instance. |
| `_world` | `World` (local) | `TheWorld` | Internal reference to the world instance. |
| `_map` | `Map` (local) | `_world.Map` | Internal map reference used for tile/coordinate operations. |
| `_state` | `State` (local) | `_world.state` | Reference to the current world state, including base temperature. |
| `_ismastersim` | `boolean` (local) | `_world.ismastersim` | `true` if the entity is running in master simulation (server). |
| `_noisetime` | `net_float` (local) | `net_float(inst.GUID, "..._noisetime")` | Networked float tracking time for noise evolution (updated per `NOISE_SYNC_PERIOD = 30` seconds). |
| `_venting` | `net_bool` (local) | *(commented out in code)* | Not active; commented out during initialization. |

*Note:* While `_globaltemperaturemult`, `_globaltemperaturelocus`, `_seasontemperature`, `_currenttemperature`, `_cachetemperature`, and `_season` are used internally, they are not exposed as public properties but are initialized/managed in constructor or event handlers.

## Main Functions

### `self:SetTemperatureMod(multiplier, locus)`
* **Description:** Sets global temperature modifier parameters used in the temperature calculation formula (`multiplier` scales deviation from `locus`).  
* **Parameters:**  
  - `multiplier` (`number`): Multiplicative factor applied to the temperature deviation (e.g., 1.0 for default).  
  - `locus` (`number`): Offset (base reference) temperature around which deviations occur.

### `self:GetTemperature()`
* **Description:** Returns the *current global fumarole temperature* (a single value per entity), computed from season, noise, and modifiers. This is distinct from `GetTemperatureAtXZ`, which returns *tile-specific interpolated values*.  
* **Parameters:** None.  
* **Returns:** `number` — the computed temperature (°C).

### `self:GetTemperatureAtXZ(x, z)`
* **Description:** Computes the effective temperature at world coordinates (x, z), interpolating between base world temperature and the global fumarole temperature based on the density of `"fumarolearea"` tiles within a local search window (±4 tiles). Returns `nil` if no fumarole influence is detected.  
* **Parameters:**  
  - `x` (`number`): World X coordinate.  
  - `z` (`number`): World Z coordinate.  
* **Returns:** `number?` — Interpolated temperature at (x, z), or `nil` if outside fumarole-affected area.

### `self:OnUpdate(dt)`
* **Description:** Updates noise time and recalculates the global fumarole temperature each frame. Clients update locally; server enforces periodic network sync (every 30 seconds) via `SetWithPeriodicSync`.  
* **Parameters:**  
  - `dt` (`number`): Delta time in seconds.

### `self:GetDebugString()`
* **Description:** Returns a formatted debug string showing current temperature and modifier values.  
* **Parameters:** None.  
* **Returns:** `string` — e.g., `"105.42C mult: 1.00 locus 0.0"`.

### `self:OnSave()`
* **Description:** (Master sim only) Returns a table containing critical persistent state for saving (season, season temperature, noise time).  
* **Parameters:** None.  
* **Returns:** `{ season: string, seasontemperature: number, noisetime: number }`

### `self:OnLoad(data)`
* **Description:** (Master sim only) Restores state from saved data on load.  
* **Parameters:**  
  - `data` (`table`) — Contains `season`, `seasontemperature`, and `noisetime`.

## Events & Listeners
- **Listens for `"seasontick"`** on `TheWorld`: Triggers `OnSeasonTick` to update `_seasontemperature` and `_season`.
- **Listens for `"ms_simunpaused"`** on `TheWorld` *(master sim only)*: Triggers `OnSimUnpaused` to force resync of networked values.
- **No events are pushed** by this component.