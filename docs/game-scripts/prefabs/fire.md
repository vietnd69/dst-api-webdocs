---
id: fire
title: Fire
description: A prefabricated entity component that manages visual and thermal properties of campfire and wildfire effects in the game world.
tags: [environment, fx, heat]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: aeb05b2d
system_scope: environment
---

# Fire

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `fire` prefab defines a visual and thermal entity used for campfires and wildfires. It aggregates the `firefx` and `heater` components to control flame appearance, sound, heating radius, and heat output. The prefab is designed to be server-pristine and supports multiple fire levels (0–5), each with distinct animation states, bloom intensity, radius, and sound behavior. It also includes logic to determine when a fire should extinguish based on proximity to other fires.

## Usage example
```lua
local inst = TheWorld:SpawnPrefab("fire")
if inst then
    inst.Transform:SetPosition(x, y, z)
    if TheWorld.ismastersim then
        -- Set fire level (1–6, index into firelevels array)
        inst.components.firefx.level = 4
    end
end
```

## Dependencies & tags
**Components used:** `firefx`, `heater`  
**Tags:** Adds `FX` and `HASHEATER`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.components.firefx.levels` | table | `firelevels` array (defined inline) | Array of fire level configurations, indexed by integer level. Each entry defines `anim`, `anim_controlled_burn`, `sound`, `radius`, `intensity`, `falloff`, `colour`, and `soundintensity`. |
| `inst.components.firefx.level` | number | `nil` | Current fire level (1-based index into `firelevels`). |
| `inst.components.firefx.extinguishsoundtest` | function | Custom function checking adjacent fire density | Returns `true` if fire should extinguish due to insufficient heat sources nearby; used to prevent clustering. |
| `inst.components.heater.heatfn` | function | `GetHeatFn` | Heat output function returning the value `heats[level]` (e.g., 180 for level 4). |

## Main functions
### `GetHeatFn(inst)`
*   **Description:** Returns the heat output for the fire based on its current `firefx.level`. Used by the `heater` component to determine how much heat the fire emits.
*   **Parameters:** `inst` (Entity) — The fire entity instance.
*   **Returns:** number — Heat value from the `heats` table (`heats[level]`), or `20` if `level` is out of bounds.
*   **Error states:** Returns `20` when `inst.components.firefx.level` is `nil` or beyond the `heats` array bounds.

## Events & listeners
- **Pushes:** None defined directly in this prefab.
- **Listens to:** None defined directly in this prefab.  
  *(Note: The `heater` component handles heating logic internally; the `firefx` component manages visuals and sound in its own stategraph, which is not defined here.)*