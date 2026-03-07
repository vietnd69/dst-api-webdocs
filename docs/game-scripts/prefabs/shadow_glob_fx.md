---
id: shadow_glob_fx
title: Shadow Glob Fx
description: Renders a shadow trail effect with optional ripple animation triggered by player movement.
tags: [fx, trail, visual]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 114ae3a7
system_scope: fx
---

# Shadow Glob Fx

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`shadow_glob_fx` is a client-side prefab that visualizes a shadow trail effect—typically used to accompany movement of shadow-based characters or abilities. It loads animation assets (`cane_shadow_fx.zip`, `splash_weregoose_fx.zip`, `splash_water_drop.zip`), plays looping shadow animations, and optionally triggers water-ripple effects when moving over ocean tiles. It does not persist or network physics/state beyond its visibility flag.

## Usage example
```lua
local fx = SpawnPrefab("shadow_glob_fx")
fx.EnableRipples(true)  -- enable ripple effect when moving over ocean
fx:Remove()             -- clean up when no longer needed
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** Adds `FX`, `NOCLICK`, `shadowtrail`.  
Note: Tags are applied via `inst:AddTag(...)` in the prefab function.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_ripple_enabled` | `net_bool` (networked) | `true` | Controls whether ripple effects are enabled on ocean tiles. |

## Main functions
### `EnableRipples(enable)`
* **Description:** Enables or disables the ripple effect when the entity moves over ocean tiles. If enabled, it schedules a task to periodically check and trigger ripples.
* **Parameters:** `enable` (boolean, optional, defaults to `true`) — whether to enable ripples.
* **Returns:** Nothing.
* **Error states:** No failure modes documented; safe to call at any time.

## Events & listeners
- **Listens to:**  
  - `ripple_enabled_dirty` — triggers `OnRippleEnabled` on the local client to start/stop ripple tasks.  
  - `animover` — calls `inst.Remove` to clean up the entity once animation finishes.  
- **Pushes:** None.