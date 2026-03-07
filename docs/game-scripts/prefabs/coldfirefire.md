---
id: coldfirefire
title: Coldfirefire
description: Creates a visual and thermal cold-fire effect entity that generates cooling heat rather than warming heat.
tags: [fx, environment, cold, fire]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2ce2ceaf
system_scope: fx
---

# Coldfirefire

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`coldfirefire` is a prefab that defines a cold-fire visual effect entity used in DST to simulate frigid combustion. It combines the `firefx` component for animation, light, and sound control with the `heater` component to apply negative heat (cooling) to surrounding entities. Unlike normal fire, this entity emits cold energy, as indicated by its negative heat values and blue-white color palette. It is typically used in cold-themed environments or seasonal effects.

## Usage example
```lua
local inst = SpawnPrefab("coldfirefire")
if inst then
    inst.Transform:SetPosition(x, y, z)
    -- The firefx level is initialized to 1 by default in the prefab constructor
    -- To change intensity:
    inst.components.firefx:SetLevel(3)
end
```

## Dependencies & tags
**Components used:** `heater`, `firefx`  
**Tags:** Adds `FX` and `HASHEATER`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `heater.heatfn` | function | `GetHeatFn` | Returns the current cooling heat value based on firefx level |
| `heater.exothermic` | boolean | `false` | Indicates this fire does *not* emit heat (set via `SetThermics(false, true)`) |
| `heater.endothermic` | boolean | `true` | Indicates this fire absorbs heat (i.e., cools surroundings) |
| `firefx.levels` | table | 4-level array | Animation/sound/light configuration per fire intensity level |
| `firefx.level` | number | `1` (initial) | Current fire level, determines heat output, radius, and animation |
| `firefx.usedayparamforsound` | boolean | `true` | Applies day-time scaling to fire sound volume |

## Main functions
The prefab itself does not define public functions; it configures and initializes the attached components.

### `inst.components.firefx:SetLevel(lev)`
*   **Description:** Sets the fire effect level (1–4), updating animation, sound, light radius/intensity, and cooling output. Overrides the default `firefx` behavior with cold-fire-specific parameters.
*   **Parameters:** `lev` (number) — fire level from 1 to 4. Values above 4 are clamped to `#firefx.levels`.
*   **Returns:** Nothing.
*   **Error states:** None; invalid values are handled internally (clamped to max level).

### `inst.components.heater:SetThermics(exo, endo)`
*   **Description:** Configures the heater’s thermal behavior to disable heat emission and enable cooling absorption.
*   **Parameters:**  
  `exo` (boolean) — set to `false` to indicate no exothermic (warming) output.  
  `endo` (boolean) — set to `true` to indicate endothermic (cooling) behavior.
*   **Returns:** Nothing.

## Events & listeners
None identified — the component does not register or emit events directly in this prefab definition.

### Related events (via components)
- **Listens to:** Via `heater` and `firefx` — internal event handling for thermics and FX updates, but not exposed at the prefab level.
- **Pushes:** None directly.

> **Note:** Sound and light updates are handled synchronously within `firefx:SetLevel`, and heat values are computed on-demand via the `heatfn` callback attached to the `heater` component.