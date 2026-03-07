---
id: cavelight
title: Cavelight
description: Manages dynamic lighting and spawning behavior for cave exit light sources, adjusting brightness, color, and presence based on world and cave phase states.
tags: [lighting, environment, spawning, cave]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3ff8ee27
system_scope: environment
---

# Cavelight

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`cavelight` is a prefab that represents dynamic light sources used in cave environments. It adjusts its visual appearance (light radius, intensity, color, and tint) in response to changes in the world's `cavephase` (e.g., day, dusk, night, full moon), and also controls whether it acts as a hideout for spawning bat-like creatures via the `hideout` component. The component uses interpolation between lighting phases to ensure smooth transitions.

It is not a standalone component but a *prefab definition* with multiple variants (`cavelight`, `cavelight_small`, `cavelight_tiny`, `cavelight_atrium`), differing only in scale (`widthscale`) and some behavior (e.g., `cavelight_atrium` reacts to Charlie cutscenes).

## Usage example
While users typically do not interact with this prefab directly at runtime, a modder might instantiate and configure it as follows:

```lua
local inst = SpawnPrefab("cavelight")
inst.Transform:SetPos(x, 0, z)
inst.components.hideout:StartSpawning() -- manually trigger spawning if needed
```

For variants, replace `"cavelight"` with `"cavelight_small"`, `"cavelight_tiny"`, or `"cavelight_atrium"`.

## Dependencies & tags
**Components used:** `hideout` (added only on master simulation; sets spawn period, callback, and controls start/stop)
**Tags:** `NOCLICK`, `FX`, `daylight`, `sinkhole`, `batdestination`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `widthscale` | number | `1` (varies per variant) | Scaling factor applied to the light radius (horizontally) and transform scale. |
| `_lightphase` | `net_tinybyte` | `light_params.day.id` | Networked ID of the current light phase (day/dusk/etc.). |
| `_currentlight` | table | `{}` | Current interpolated lighting parameters (updated each frame during transitions). |
| `_startlight` | table | `{}` | Lighting parameters at the start of a transition (used for interpolation). |
| `_endlight` | table | `light_params.day` | Target lighting parameters for the current cave phase. |
| `_lighttask` | `DoTaskInTime` or `nil` | `nil` | Periodic task driving light interpolation (frame-by-frame). |
| `_spawntask` | `DoTaskInTime` or `nil` | `nil` | Delayed task used to sync spawning with light phase transitions. |

## Main functions
*This prefab does not define a standalone component class with methods. Functionality is embedded in the prefab construction function (`common_fn`) and local helpers.*

- `pushparams(inst, params)`  
  *Description:* Applies lighting parameters (`radius`, `intensity`, `falloff`, `colour`) and tint (via `AnimState:OverrideMultColour`) to the entity, and enables/hides the light depending on `intensity`. Only runs on master simulation.  
  *Parameters:* `inst` (entity instance), `params` (table of light parameters, including `radius`, `intensity`, `falloff`, `colour`, `tint`).  
  *Returns:* None.  

- `lerpparams(pout, pstart, pend, lerpk)`  
  *Description:* Linearly interpolates all numeric fields between `pstart` and `pend` using factor `lerpk` (0–1), recursing into nested tables. Result is written into `pout`.  
  *Parameters:* `pout` (table, output), `pstart` (table, start values), `pend` (table, end values), `lerpk` (number, interpolation factor).  
  *Returns:* None.  

- `copyparams(dest, src)`  
  *Description:* Deep-copies values from `src` into `dest`, reusing and populating nested tables in place (avoiding `DeepCopy` to preserve references).  
  *Parameters:* `dest` (table, target), `src` (table, source).  
  *Returns:* None.  

- `OnUpdateLight(inst, dt)`  
  *Description:* Called periodically during a light phase transition. Updates `_currentlight.time`, checks if transition should end, performs parameter interpolation via `lerpparams`, and applies results via `pushparams`.  
  *Parameters:* `inst` (entity instance), `dt` (delta time, seconds).  
  *Returns:* None.  

- `OnLightPhaseDirty(inst)`  
  *Description:* Triggers when `_lightphase` changes (network update or local change). Initiates a new interpolation transition to the new phase's light parameters.  
  *Parameters:* `inst` (entity instance).  
  *Returns:* None.  

- `OnCavePhase(inst, cavephase)`  
  *Description:* World-state listener for `cavephase`. Updates the target `_lightphase`, starts an interpolation transition via `OnLightPhaseDirty`, and schedules spawning behavior via `OnSpawnTask` after a delay.  
  *Parameters:* `inst` (entity instance), `cavephase` (string, e.g., `"day"`, `"night"`, `"dusk"`).  
  *Returns:* None.  

- `OnSpawnTask(inst, cavephase)`  
  *Description:* Callback after delay. Starts or stops hideout spawning depending on whether `cavephase == "day"`.  
  *Parameters:* `inst` (entity instance), `cavephase` (string).  
  *Returns:* None.  

- `OnCharlieCutscene(inst, isstart)`  
  *Description:* Handles transition during Charlie cutscene. Forces `"day"` phase on start, reverts to actual `cavephase` on end.  
  *Parameters:* `inst` (entity instance), `isstart` (boolean, true on cutscene start).  
  *Returns:* None.  

## Events & listeners
- **Listens to:**
  - `lightphasedirty` (on non-master): triggers `OnLightPhaseDirty`.
  - `cavephase` (master): triggers `OnCavePhase`.
  - `charliecutscene` (`cavelight_atrium` only): triggers `OnCharlieCutscene`.
- **Pushes:** None directly, but relies on `inst._lightphase:set(...)` to trigger `lightphasedirty` events via `net_tinybyte`.
