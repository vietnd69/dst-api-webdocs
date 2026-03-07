---
id: character_fire
title: Character Fire
description: A prefab component that creates a fire entity with variable heat output and animation levels for use on characters in DST.
tags: [fx, fire, heater, character, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5e3c53eb
system_scope: fx
---

# Character Fire

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
This file defines two prefabs: `character_fire` and `character_fire_flicker`. These prefabs are used to spawn visual and thermal fire effects associated with characters (e.g., for extinguishing or special mechanics). They integrate with the `firefx` and `heater` components to dynamically configure fire properties such as heat, animation, radius, intensity, falloff, and sound. The prefabs are master-server-only constructs (they do not spawn on clients directly) and rely on entity-tag-based optimizations like `HASHEATER`.

## Usage example
```lua
-- Spawn a full fire effect with variable levels
local fire_inst = SpawnPrefab("character_fire")
fire_inst.Transform:SetWorldPosition(x, y, z)
fire_inst.components.firefx.level = 2  -- set to large fire
fire_inst.components.heater.heat = fire_inst.components.heater.heatfn()  -- call heatfn to get current heat
```

## Dependencies & tags
**Components used:** `firefx`, `heater`  
**Tags added:** `FX`, `HASHEATER`  
**Tags checked:** None identified (tags are only added)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `firelevels` | table | (see source) | A table of fire level configurations, each with `anim`, `pre`, `pst`, `sound`, `radius`, `intensity`, `falloff`, `colour`, `soundintensity`. Used by `firefx` component. |
| `flickerlevels` | table | (see source) | A simplified fire level configuration for flicker effect (level 3 only). Used by `firefx` component. |
| `heats` | table | `{50, 65, 80}` | Array of static heat values indexed by fire level (used in `GetHeatFn`). |

## Main functions
### `GetHeatFn(inst)`
*   **Description:** Returns the heat value appropriate for the current fire level. This function is assigned to `inst.components.heater.heatfn` and called dynamically to determine heater output.
*   **Parameters:** `inst` (Entity) — The entity instance; expected to have `components.firefx.level`.
*   **Returns:** `number` — heat value from `heats` table, or `40` as fallback if level is invalid.
*   **Error states:** Returns `40` if `inst.components.firefx.level` is not a valid index in `heats`.

## Events & listeners
None identified.