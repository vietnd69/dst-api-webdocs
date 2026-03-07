---
id: staff_castinglight
title: Staff Castinglight
description: Manages animated light effects for staff casting abilities, fading the light over time before automatically removing itself.
tags: [fx, lighting, staff, animation]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7d01bbda
system_scope: fx
---

# Staff Castinglight

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`staff_castinglight` is a client-side FX prefab component that creates a dynamic light effect for staff casting animations. It smoothly transitions the light's radius, intensity, and falloff over a configurable duration using a quintic ease-in function. The component is self-contained and does not require external dependencies — it only uses the `Light` and `net_smallbyte` APIs to manage visual state. Two variants are exposed: a normal-size and a small-size variant.

## Usage example
```lua
-- Create a normal staff casting light
local inst = CreateEntity()
inst:AddPrefab("staff_castinglight")
inst.components.light:SetPosition(0, 0, 0)
inst:DoTaskInTime(0, function() 
    inst.components.staff_castinglight.SetUp(inst, {1, 0.5, 0}, 1.0, 0.1)
end)
```

## Dependencies & tags
**Components used:** `Light`, `Transform`, `Network`
**Tags:** Adds `FX` to the entity.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `is_small` | boolean | `false` | Indicates whether this instance uses small-size light parameters. |
| `_duration` | `net_smallbyte` | — | Networked integer representing the total duration in frames. |
| `_value` | `net_smallbyte` | — | Networked integer tracking elapsed frames. |
| `Light` | Light component | — | Reference to the entity's light component for runtime control. |

## Main functions
### `SetUp(colour, duration, delay)`
*   **Description:** Configures the light effect with specified colour, duration, and optional start delay, then begins the update loop. Only callable on the master simulation.
*   **Parameters:**  
    - `colour` (table of 3 numbers) — RGB values (0–1 range) for the light colour.  
    - `duration` (number) — Total duration in seconds.  
    - `delay` (number, optional) — Delay in seconds before starting the animation (default: `0`).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `setupdirty` — triggers `OnSetUpDirty` on the client to start the update loop after initial setup.
- **Pushes:** None.