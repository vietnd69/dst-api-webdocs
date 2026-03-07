---
id: reticulecharging
title: Reticulecharging
description: Creates a client-side visual effect entity used to indicate charging status during target acquisition, typically for ranged or charge-based attacks.
tags: [ui, fx, combat]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 81ccd1ca
system_scope: fx
---

# Reticulecharging

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`reticulecharging` is a prefab that instantiates a non-persisted, client-only visual effect entity to represent a charging reticle during UI-driven target acquisition phases. It attaches the `chargingreticule` component to enable dynamic scaling and ping effects. The entity is tagged `FX` and `NOCLICK` and rendered on the world background layer.

## Usage example
```lua
local reticule = SpawnPrefab("reticulecharging")
if reticule ~= nil and reticule.components.chargingreticule then
    reticule.Transform:SetPosition(x, y, z)
    reticule.components.chargingreticule:StartCharge()
end
```

## Dependencies & tags
**Components used:** `chargingreticule`
**Tags:** Adds `FX`, `NOCLICK`. Does not persist (`persists = false`), cannot sleep (`SetCanSleep(false)`).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `chargescale` | number | `1` | Current scale multiplier applied via `SetChargeScale`. |
| `SetChargeScale` | function | `SetChargeScale` (local) | Callback to update scale: `inst.AnimState:SetScale(chargescale * SCALE, SCALE)`. |

## Main functions
### `SetChargeScale(inst, chargescale)`
*   **Description:** Updates the visual scale of the reticle by adjusting the animation state scale using `chargescale * SCALE` for X and `SCALE` for Y.
*   **Parameters:**  
    - `inst` (entity instance) — The entity owning the component.  
    - `chargescale` (number) — Multiplier for horizontal scaling.
*   **Returns:** Nothing.
*   **Error states:** None documented; assumes valid `AnimState`.

## Events & listeners
None identified.