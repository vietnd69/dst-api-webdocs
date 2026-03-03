---
id: worldtemperature
title: Worldtemperature
description: Calculates and broadcasts the current world temperature based on season, phase, noise, and global modifiers, while managing summer bloom visual effects.
tags: [temperature, environment, seasonal, network, fx]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 29f04e55
system_scope: world
---

# Worldtemperature

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`Worldtemperature` is a world-level component responsible for computing and distributing the current ambient temperature throughout the game world. It combines seasonal progression, day/night phase, Perlin noise for local variation, and global modifiers to determine a real-time temperature value. On the master simulation (server), it also drives summer bloom visual effects by pushing `overridecolourmodifier` events and periodically syncs state to clients via networked noise time. The component is attached to `TheWorld` and acts as the authoritative source for temperature-related data.

## Usage example
```lua
-- Access the component attached to TheWorld
local worldtemp = TheWorld.components.worldtemperature

-- Apply a global temperature modifier (e.g., from a global weather event)
worldtemp:SetTemperatureMod(1.2, -5)

-- Temperature is updated automatically and broadcast via "temperaturetick" events
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | entity reference | `inst` (constructor parameter) | The entity (typically `TheWorld`) to which this component is attached. |
| `_noisetime` | `net_float` | `0` | Networked value tracking accumulated elapsed time for temperature noise, synced every `NOISE_SYNC_PERIOD` (30s). |

*Note: All other member variables are private (prefixed with `_`) and not intended for external access.*

## Main functions
### `SetTemperatureMod(multiplier, locus)`
* **Description:** Applies a global temperature modifier by scaling variation around a new reference point (`locus`). Used for seasonal shifts, global events, or mod effects. Immediately triggers a temperature update and broadcast.
* **Parameters:**  
  - `multiplier` (number) — scaling factor applied to the raw temperature sum (typically `1.0` under normal conditions).  
  - `locus` (number) — baseline offset added before applying the multiplier (e.g., `-10` cools the baseline).  
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Called each frame on both master and client to advance noise time, update summer bloom visuals, and push the latest temperature. On the master simulation, it also enforces periodic network sync of `_noisetime`.
* **Parameters:**  
  - `dt` (number) — delta time in seconds since the last update.  
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a formatted debug string for debugging tools, showing the current computed temperature and modifier parameters.
* **Parameters:** None.  
* **Returns:** `string` — e.g., `"22.50C mult: 1.20 locus -5.0"`.

## Events & listeners
- **Listens to:**  
  - `seasontick` (from `TheWorld`) — updates `_seasontemperature` using seasonal progression.  
  - `clocktick` (from `TheWorld`) — updates `_phasetemperature` using time-of-day phase.  
  - `phasechanged` (from `TheWorld`) — updates `_daylight` flag (`true` for day, `false` for night/dusk).  
  - `ms_simunpaused` (from `TheWorld`, master-only) — forces resync of `_noisetime` after unpausing.  
- **Pushes:**  
  - `temperaturetick` (to `TheWorld`) — every update, carries the current computed temperature (number).  
  - `overridecolourmodifier` (to `TheWorld`) — during summer days, carries the bloom intensity multiplier used for colour grading.
