---
id: boatrace_common
title: Boatrace Common
description: Provides utility functions and prefab factories for boat race events, including deploy helper visuals, throwable deploy kits, and placement validation logic.
tags: [boatrace, placement, networking, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7c2a5aa9
system_scope: environment
---

# Boatrace Common

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`boatrace_common.lua` is a utility module that supports boat race gameplay in DST. It does not define a component but instead exports helper functions and prefab generators for deploying race-related objects (e.g., checkpoints, boat spawn points). It integrates with the `deployhelper`, `placer`, and `inventoryitem` components to manage visual placement feedback, deployment validation, and Throwable Deploy Kit creation.

## Usage example
```lua
-- Register a boatrace start point
local start_point = SpawnPrefab("boatrace_start_marker")
RegisterBoatraceStart(start_point)

-- Create a throwable deploy kit and its placer
local kit_prefab, placer_prefab = MakeThrowableBoatRaceKitPrefabs({
    prefab_to_deploy = "boatrace_checkpoint",
    bank = "winona_battery",
    build = "winona_battery",
    deploy_radius = 0.5,
    reticule_ring_scale = 1.2,
    extradeploytest = function(inst, player, pos) return true end,
    do_reticule_ring = true,
})
```

## Dependencies & tags
**Components used:**  
- `deployhelper` (via `AddDeployHelper`)  
- `placer` (used internally for `placer_prefab`)  
- `inventoryitem` (via `SetLanded` during deployment)  
- `updatelooper` (for visual arrow updates)  

**Tags added/checked:**  
- `"CLASSIFIED"`, `"NOCLICK"`, `"placer"` (on visual arrows)  
- `"projectile"`, `"complexprojectile"` (on throwable kits)  
- `"burnt"` (checked during deploy helper enabling)  
- `"DEPLOY_IGNORE_TAGS"` list: `{"DECOR", "FX", "INLIMBO", "NOBLOCK", "player"}`  

## Properties
No public properties. This module exports functions and constants only.

## Main functions
### `RegisterBoatraceStart(startpoint)`
* **Description:** Registers a world position as a boat race start point, storing it in `TheWorld._boatrace_starts`. Automatically unregisters if the `startpoint` entity is removed.
* **Parameters:** `startpoint` (Entity) — an entity representing a boat race start location.
* **Returns:** Nothing.

### `find_nearest_boatrace_start(source_position)`
* **Description:** Finds the nearest registered boat race start point to a given position, within `TUNING.MAX_BOATRACE_COMPONENT_DISTANCE`. Returns the closest entity or `nil`.
* **Parameters:** `source_position` (Vector3) — world position to check from.
* **Returns:** `{ dsq = number, component = Entity }` if found; `nil` otherwise.

### `AddDeployHelper(inst, keyfilters)`
* **Description:** Attaches the `deployhelper` component to an entity and configures visual arrow feedback. Only runs on non-dedicated clients.
* **Parameters:**  
  - `inst` (Entity) — entity to attach the helper to (typically a deployable kit).  
  - `keyfilters` (table of strings) — list of key codes (e.g., `{"KEY_R"}`) to filter keypresses for deployment.  
* **Returns:** Nothing.

### `MakeThrowableBoatRaceKitPrefabs(data)`
* **Description:** Generates two prefabs: a throwable deploy kit and its associated placer. Used for items like checkpoints and marker kits.
* **Parameters:** `data` (table) — configuration with the following optional fields:  
  - `prefab_to_deploy` (string) — name of the prefab to spawn on successful deployment.  
  - `name` (string) — custom name for the kit; defaults to `prefab_to_deploy.."_throwable_deploykit"`.  
  - `deploy_radius` (number) — radius around which to check for existing objects (default `0.5`).  
  - `bank`, `build`, `anim` — animation-related asset identifiers.  
  - `extradeploytest` (function) — optional custom deployment validation.  
  - `product_fn` (function) — called on the deployed product instance after spawn.  
  - `deployfailed_fn` (function) — called on a respawned kit if deployment fails.  
  - `common_postinit`, `primary_postinit`, `placer_postinit`, `data` — optional post-init hooks.  
  - `tags` (table) — additional tags for the kit.  
  - `do_reticule_ring` (boolean) — whether to show a reticule ring (default `false`).  
  - `reticule_ring_scale` (number) — scale multiplier for the ring (default `1.0`).  
* **Returns:** Two values:  
  1. `kit_prefab_definition` — the throwable deploy kit prefab data table.  
  2. `placer_prefab_definition` — the placer prefab data table.  

### `BoatSpawnCheck(pos, radius, allow_boats)`
* **Description:** Checks whether a circle of points around `pos` is fully ocean, optionally allowing existing boats. Used to validate boat spawn locations.
* **Parameters:**  
  - `pos` (Vector3) — center position to check.  
  - `radius` (number, optional) — radius of the check circle (default `TUNING.DRAGON_BOAT_RADIUS`).  
  - `allow_boats` (boolean, optional) — whether existing boats are allowed in the area (default `false`).  
* **Returns:** `true` if all sampled points are ocean and valid; `false` otherwise.

### `CheckpointSpawnCheck(pos)`
* **Description:** Checks whether a checkpoint can be spawned at `pos`. Ensures:
  - The area can fit two boats (`BoatSpawnCheck` with radius `(2 * TUNING.DRAGON_BOAT_RADIUS) + 0.5`, boats allowed).
  - The point is not within `TUNING.BOATRACE_START_INCLUSION_PROXIMITY` of any registered start point.
* **Parameters:** `pos` (Vector3) — world position to validate.
* **Returns:** `true` if valid; `false` otherwise.

## Events & listeners
- **Listens to:** `onremove` — unregisters the start point from `TheWorld._boatrace_starts` when the `startpoint` entity is removed (in `RegisterBoatraceStart`).

- **Pushes:**  
  - `onbuilt` — on deployed product prefab when deployment succeeds (via `product_instance:PushEvent("onbuilt", ...)`).  
  - `on_landed` / `on_no_longer_landed` — via `InventoryItem:SetLanded(...)` during kit respawn or land detection.  
