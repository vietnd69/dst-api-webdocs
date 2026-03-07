---
id: wave_shore
title: Wave Shore
description: Creates a background visual effect entity representing shore wave animations that dynamically adapt based on terrain adjacency and orientation.
tags: [fx, environment, ocean, terrain]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7a31db92
system_scope: fx
---

# Wave Shore

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `wave_shore` prefab generates non-networked, background visual entities for ocean wave effects at the shoreline. It uses directional sampling of adjacent tiles to determine whether the wave should appear small, medium, or large (by selecting from different animations), and adjusts its position and animation accordingly. It is automatically removed when its animation completes or when the entity goes to sleep.

## Usage example
```lua
-- Typical instantiation via Prefab system, not direct component usage
local wave = SpawnPrefab("wave_shore")
if wave ~= nil then
    wave.Transform:SetPosition(x, y, z)
    wave:SetAnim() -- dynamically set animation based on terrain
end
```

## Dependencies & tags
**Components used:** `animstate`, `transform`
**Tags:** Adds `CLASSIFIED`, `FX`, `NOCLICK`, `NOBLOCK`, `ignorewalkableplatforms`. Checks none.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `SetAnim` | function | `nil` | Reference to the local `SetAnim` function, used to dynamically update animation and transform based on terrain. |

## Main functions
### `SetAnim(inst)`
*   **Description:** Dynamically selects and plays a shore wave animation (`idle_small`/`idle_med`/`idle_big`) and optionally adjusts the entity’s position based on surrounding land and ocean tiles in 45° and 90° directions relative to the entity's orientation. Called after entity creation to match local terrain context.
*   **Parameters:** `inst` (Entity) — the entity instance (typically the `inst` local variable in the prefab function).
*   **Returns:** Nothing.
*   **Error states:** May fail to update animation if tile queries return invalid coordinates (e.g., out of bounds). No explicit error handling is present.

## Events & listeners
- **Listens to:** `animover` — triggers `inst.Remove` (entity removal) upon animation completion.
- **Pushes:** None.