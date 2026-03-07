---
id: yotc_carrat_race_common
title: Yotc Carrat Race Common
description: Provides shared utilities for carrat race checkpoints and finish lines, including color-aware lighting, deploy helper rings, and placer visuals.
tags: [racing, visual, deployment, lighting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 77d0ac96
system_scope: environment
---

# Yotc Carrat Race Common

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This prefabs module provides reusable helpers for carrat race structures (checkpoints and finish lines). It handles color-based lighting configuration, placement visualization via deploy helper rings, and visual placement rings (PlacerRing and carpet). It is not a component itself but a utility module returned as a table of functions and data for use during prefab construction.

## Usage example
```lua
local yotc_common = require "prefabs/yotc_carrat_race_common"

-- Add deploy helper with specific key filter
yotc_common.AddDeployHelper(inst, { "place_yotc_carrat_race_deploy_rings" })

-- Attach a placer ring for placement preview
yotc_common.PlacerPostInit_AddPlacerRing(inst, "yotc_carrat_race_deploy_rings")

-- Retrieve light color for a given swap color
local rgb = yotc_common.GetLightColor("blue")
inst:AddLight(rgb.x, rgb.y, rgb.z, 5)
```

## Dependencies & tags
**Components used:** `deployhelper`, `placer`, `updatelooper`  
**Tags:** `"CLASSIFIED"`, `"NOCLICK"`, `"placer"` (for helper entities); `"DECOR"` (for carpet entity)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `PLACER_RING_SCALE` | number | `1.38` | Uniform scale factor applied toplacer ring visuals. |
| `deployable_data` | table | `{deploymode = DEPLOYMODE.CUSTOM, ...}` | Deployment configuration table for `deployhelper`, using a custom `candeploy` check. |
| `lightcolors` | table (map) | (see code) | Maps color names (e.g., `"blue"`, `"red"`) to RGB `Vector3` values for lighting. |

## Main functions
### `GetLightColor(col)`
* **Description:** Returns the RGB `Vector3` used for lighting, based on the provided color name (`col`). Falls back to white if `col` is `nil` or unrecognized.
* **Parameters:** `col` (string? or nil) – Optional color name (`"black"`, `"blue"`, `"brown"`, `"green"`, `"pink"`, `"purple"`, `"white"`, `"yellow"`, or `"red"`).
* **Returns:** `Vector3` – RGB values (0–1 range).
* **Error states:** Returns `lightcolors.white` for invalid or missing color.

### `AddDeployHelper(inst, keyfilters)`
* **Description:** Conditionally adds the `deployhelper` component to an entity and configures key filters and callbacks. Only runs on non-dedicated clients.
* **Parameters:**
  * `inst` (entity instance) – The entity to attach the helper to.
  * `keyfilters` (table of strings) – List of key strings to register with the deploy helper.
* **Returns:** Nothing.
* **Side effects:** Assigns `inst.components.deployhelper.onenablehelper = OnEnableHelper` and `onstarthelper = OnStartHelper`.

### `PlacerPostInit_AddPlacerRing(inst, deployhelper_key)`
* **Description:** Creates and attaches a `placer`-tagged ring visual to the entity for placement feedback. Also assigns the provided key to `inst.deployhelper_key`.
* **Parameters:**
  * `inst` (entity instance) – The entity to augment.
  * `deployhelper_key` (string) – Deployment key string used to filter placements.
* **Returns:** Nothing.
* **Side effects:** Adds and links a non-networked ring entity via `placer:LinkEntity`.

### `PlacerPostInit_AddCarpetAndPlacerRing(inst, deployhelper_key)`
* **Description:** Attaches both the carpet (visual rug) and placement ring to the entity.
* **Parameters:**
  * `inst` (entity instance) – The entity to augment.
  * `deployhelper_key` (string) – Deployment key string used to filter placements.
* **Returns:** Nothing.
* **Side effects:** Adds a carpet visual and calls `PlacerPostInit_AddPlacerRing`.

## Events & listeners
*None.* This module does not register event listeners or fire events. Visual updates (e.g., highlight state) are handled via `updatelooper` callbacks in the helper ring entity.