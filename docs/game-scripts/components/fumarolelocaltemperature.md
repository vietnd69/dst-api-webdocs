---
id: fumarolelocaltemperature
title: Fumarolelocaltemperature
description: Calculates and provides local temperature values near fumaroles based on seasonal cycles, noise, and multipliers, for use by the temperature override system.
tags: [temperature, environment, map, network, simulation]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 1a503ac4
system_scope: environment
---

# Fumarolelocaltemperature

> Based on game build **714004** | Last updated: 2026-03-03

## Overview
`Fumarolelocaltemperature` manages dynamic local temperature computation for entities representing fumaroles (geothermal vents). It computes per-tile temperature contributions using seasonal data, noise functions, and optional global modifiers. This component integrates with `TemperatureOverrider`, which calls its `GetTemperatureAtXZ` method to determine effective temperature at a given world location. It runs on both server and client but defers authoritative updates to the master simulation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("fumarolelocaltemperature")
inst:AddTag("fumarole")
inst.Transform:SetPosition(x, 0, z)
inst.components.fumarolelocaltemperature:SetTemperatureMod(1.2, 5)
local temp = inst.components.fumarolelocaltemperature:GetTemperature()
```

## Dependencies & tags
**Components used:** `temperatureoverrider` (via `require`)
**Tags:** None added or removed by this component itself.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity instance | `inst` | Reference to the owning entity. |
| `_noisetime` | `net_float` | `0` | Networked accumulator for noise time progression, synced every 30 seconds. |
| `_venting` | not implemented | — | Commented-out network variable; previously intended for manual override. |

## Main functions
### `SetTemperatureMod(multiplier, locus)`
* **Description:** Applies a global temperature multiplier and offset (locus) used in all subsequent temperature calculations.
* **Parameters:** 
  * `multiplier` (number) — scaling factor for temperature deviation.
  * `locus` (number) — base temperature offset.
* **Returns:** Nothing.

### `GetTemperature()`
* **Description:** Returns the *current global* fumarole temperature (not tile-specific), derived from noise and seasonal model.
* **Parameters:** None.
* **Returns:** `number` — the computed temperature in degrees Celsius.
* **Error states:** None; always returns a valid temperature.

### `GetTemperatureAtXZ(x, z)`
* **Description:** Computes the *local* temperature at a given world position `(x, z)` by blending base world temperature with the fumarole's global temperature, weighted by how many fumarole tiles surround the target tile.
* **Parameters:** 
  * `x`, `z` (number) — world coordinates.
* **Returns:** `number` or `nil` — interpolated temperature if the tile has any fumarole influence; otherwise `nil`.
* **Error states:** Returns `nil` if the queried tile has zero fumarole coverage (`temp_perc == 0`).

### `OnUpdate(dt)`
* **Description:** Called periodically to advance internal state: updates noise time, recomputes temperature, and handles network sync.
* **Parameters:** `dt` (number) — time delta in seconds.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging, showing current calculated temperature and active modifiers.
* **Parameters:** None.
* **Returns:** `string` — e.g., `"85.23C mult: 1.20 locus 5.0"`.

## Events & listeners
- **Listens to:** 
  - `"seasontick"` (from `TheWorld`) — updates internal seasonal temperature and season name.
  - `"ms_simunpaused"` (from `TheWorld`, master-only) — triggers a forced resync of `_noisetime`.
- **Pushes:** None.

## Initialization notes
- `InitializeDataGrids()` creates a `DataGrid` (`_cachetemperature`) to cache per-tile fumarole coverage ratios.
- `OnSave`/`OnLoad` only operate on the master simulation; they serialize season and `_noisetime`.
- `LongUpdate = self.OnUpdate` ensures the component updates during long updates (e.g., slow ticking).
