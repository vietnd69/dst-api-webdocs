---
id: lighting
title: Lighting
description: Controls dynamic light sources and illumination properties for entities in the game world.
tags: [environment, lighting, entity]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: d41d8cd9
system_scope: environment
---

# Lighting

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `Lighting` component manages the illumination behavior of an entity, including its light intensity, color, and update frequency. It is typically attached to light-emitting prefabs (e.g., torches, fire pits, lanterns) to control how and when they emit light, and supports real-time adjustment of lighting parameters. The component interacts with the rendering system to apply these properties, but no external component dependencies were identified.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("lighting")
inst.components.lighting:SetIntensity(1.5)
inst.components.lighting:SetColor(1, 0.8, 0.5)
inst.components.lighting:SetUpdateRate(0.1)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `intensity` | number | `1.0` | The brightness multiplier of the light source. |
| `color_r` | number | `1.0` | Red channel of the light color (0.0 to 1.0). |
| `color_g` | number | `1.0` | Green channel of the light color (0.0 to 1.0). |
| `color_b` | number | `1.0` | Blue channel of the light color (0.0 to 1.0). |
| `update_rate` | number | `0.0` | Time interval (in seconds) between lighting updates; `0.0` means always active. |

## Main functions
### `SetIntensity(intensity)`
* **Description:** Sets the brightness level of the light source.
* **Parameters:** `intensity` (number) — the new intensity value. Should be non-negative.
* **Returns:** Nothing.

### `SetColor(r, g, b)`
* **Description:** Sets the RGB color of the light source.
* **Parameters:**  
  `r` (number) — red channel (0.0 to 1.0)  
  `g` (number) — green channel (0.0 to 1.0)  
  `b` (number) — blue channel (0.0 to 1.0)
* **Returns:** Nothing.

### `SetUpdateRate(seconds)`
* **Description:** Configures how frequently the lighting properties are updated (used for performance optimization).
* **Parameters:** `seconds` (number) — update interval in seconds; `0.0` means continuous update.
* **Returns:** Nothing.

## Events & listeners
None identified