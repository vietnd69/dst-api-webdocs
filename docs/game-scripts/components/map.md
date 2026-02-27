---
id: map
title: Map
description: Manages world terrain, tile-based spatial queries, entity deployment validation, and arena point generation for the game world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 9cafeaf5
---

# Map

## Overview
The `Map` component provides core world spatial logic for terrain type inspection, passability checks, deployment validation (placement of structures, plants, bridges, docks, etc.), terrain modification (`SetTile`), and procedural generation of optimal spawning points for arenas. It operates at the world scale, interfacing with the tile grid, topology system, and physics entities to support gameplay decisions related to map layout and object placement.

## Dependencies & Tags
- **No explicit component registrations or tag modifications** are performed by this script itself.
- Relies on global modules: `terrain`, `TheSim`, `TheWorld`, `TileGroupManager`, and others.
- Uses tagged entity queries via `TheSim:FindEntities` and `FindEntities_Registered` with tags like `"walkableplatform"`, `"terraformblocker"`, `"groundhole"`, `"dockjammer"`, `"mast"`, `"soil"`, `"player"`, `"INLIMBO"`, `"NOBLOCK"`, `"structure"`, `"blocker"`, `"plant"`, `"isdead"`, `"walkableperipheral"`, `"locomotor"`, `"_inventoryitem"`, `"allow_casting"`, and `"groundtargetblocker"`.

## Properties
No public instance properties are initialized in a visible constructor. Global constants are declared instead, which serve as configuration for deployment/terrain logic:

| Property | Type | Default Value | Description |
|---|---|---|---|
| `DEPLOY_EXTRA_SPACING` | `number` | `0` | Maximum extra spacing radius required by deployable entities (e.g., via `SetDeployExtraSpacing`). |
| `TERRAFORM_EXTRA_SPACING` | `number` | `0` | Maximum extra spacing required to prevent terraforming near blockers. |
| `MAX_GROUND_TARGET_BLOCKER_RADIUS` | `number` | `0` | Largest radius of entities that block ground targeting. |
| `GOODARENAPOINTS_CACHE_SIZE_MIN` / `_MAX` | `number` | `50` / `100` | Cache bounds for land arena point candidates. |
| `GOODARENAPOINTS_ITERATIONS_PER_TICK` | `number` | `20` | Iteration budget per tick for land arena scanning. |
| `GOODARENAPOINTS_TIME_PER_TICK` | `number` | `0.1` | Time budget per tick for land arena scanning. |
| `GOODARENAPOINTS_SIZE_INTERVAL` | `number` | `50` | Tile grid interval for land arena candidate sampling. |
| `GOODOCEANARENAPOINTS_*` | Various | Same semantics as above, but for ocean arenas. | Configuration for ocean arena point scanning. |

## Main Functions
### `Map:SetTile(x, y, tile, ...)`
* **Description:** Sets the tile at `(x, y)` to the specified type and emits the `"onterraform"` event with original and new tile info. Overrides `Map.SetTile`.
* **Parameters:**  
  `x`, `y`: Tile coordinates.  
  `tile`: New tile type (e.g., `WORLD_TILES.GRASS`).  
  `...`: Additional arguments passed to the original `Map.SetTile`.

### `Map:RegisterDeployExtraSpacing(spacing)`
* **Description:** Updates `DEPLOY_EXTRA_SPACING` to the maximum of its current value and `spacing`, used to enforce clearance for deploying entities.
* **Parameters:**  
  `spacing`: Desired extra spacing radius (set by entities via `EntityScript:SetDeployExtraSpacing`).

### `Map:RegisterDeploySmartRadius(radius)`
* **Description:** Extends `DEPLOY_EXTRA_SPACING` to include spacing implied by an entity’s `"smart radius"` (a deployment rule). Formula: `radius + HALF(LARGE_DEPLOYSPACING)`.
* **Parameters:**  
  `radius`: Smart radius of the entity (via `EntityScript:SetDeploySmartRadius`).

### `Map:RegisterTerraformExtraSpacing(spacing)`
* **Description:** Updates `TERRAFORM_EXTRA_SPACING` to the max of its current value and `spacing`, used in terraform checks to avoid blockers.
* **Parameters:**  
  `spacing`: Extra spacing required by terraform-blocking entities.

### `Map:RegisterGroundTargetBlocker(radius)`
* **Description:** Updates `MAX_GROUND_TARGET_BLOCKER_RADIUS` to the maximum radius of ground-target-blocking entities.
* **Parameters:**  
  `radius`: Radius of the blocker.

### `Map:IsPassableAtPoint(x, y, z, allow_water, exclude_boats)`
* **Description:** Returns `true` if the point `(x, y, z)` is walkable. Allows optional water (e.g., ocean tiles) and boat exclusion.
* **Parameters:**  
  `x`, `y`, `z`: World coordinates.  
  `allow_water`: If `true`, ocean tiles are passable.  
  `exclude_boats`: If `true`, ignores boat platforms (treats them as obstacles).

### `Map:IsPassableAtPointWithPlatformRadiusBias(...)`
* **Description:** Enhanced passability check with platform radius bias (for boats or walkable platforms) and overhang support.
* **Parameters:**  
  Includes all arguments of `IsPassableAtPoint`, plus `platform_radius_bias` (extra radius for platform-based passability), and `ignore_land_overhang`.

### `Map:IsAboveGroundAtPoint(x, y, z, allow_water)`
* **Description:** Returns `true` if the point is on land or (if `allow_water`) ocean tile (ignores overhangs).
* **Parameters:**  
  `x`, `y`, `z`: World coordinates.  
  `allow_water`: Whether ocean tiles count as above ground.

### `Map:IsLandTileAtPoint(x, y, z)`
### `Map:IsOceanTileAtPoint(x, y, z)`
### `Map:IsInvalidTileAtPoint(x, y, z)`
### `Map:IsImpassableTileAtPoint(x, y, z)`
### `Map:IsTemporaryTileAtPoint(x, y, z)`
* **Description:** Returns `true` if the tile at the point matches the respective tile category.
* **Parameters:**  
  `x`, `y`, `z`: World coordinates.

### `Map:IsOceanAtPoint(x, y, z, allow_boats)`
* **Description:** Returns `true` if the point is ocean tile, not an overhang, and not occupied by a boat (unless `allow_boats` is true).
* **Parameters:**  
  `x`, `y`, `z`, `allow_boats`: Same semantics.

### `Map:CanTerraformAtPoint(x, y, z)`
* **Description:** Returns `true` if terraforming is allowed at `(x, y, z)`, considering terrain immunity and blocker spacing (`TERRAFORM_EXTRA_SPACING`).
* **Parameters:**  
  `x`, `y`, `z`: World coordinates.

### `Map:IsTerraformingBlockedByAnObject(tile_x, tile_y)`
* **Description:** Returns `true` if any visible blocker entity prevents terraforming at the given tile center.
* **Parameters:**  
  `tile_x`, `tile_y`: Tile coordinates.

### `Map:CanPlowAtPoint(x, y, z)`
* **Description:** Returns `true` if plowing (i.e., tilling farm soil) is allowed at `(x, y, z)`, using `CanPlantAtPoint` checks and blocker spacing.
* **Parameters:**  
  `x`, `y`, `z`: World coordinates.

### `Map:CanPlantAtPoint(x, y, z)`
* **Description:** Returns `true` if planting is allowed: tile is land and not hardened.
* **Parameters:**  
  `x`, `y`, `z`: World coordinates.

### `Map:CanTillSoilAtPoint(x, y, z, ignore_tile_type)`
* **Description:** Returns `true` if tilling soil is allowed at `(x, y, z)`, depending on tile type (`farm_soil`) and blocker spacing, with optional tile-type bypass.
* **Parameters:**  
  `x`, `y`, `z`: World coordinates.  
  `ignore_tile_type`: If `true`, ignores tile type (assumes tiling on valid land).

### `Map:IsDeployPointClear(pt, inst, min_spacing, ...)`
### `Map:IsDeployPointClear2(pt, inst, object_size, ...)`
* **Description:** Returns `true` if `(x, y, z)` has sufficient clear space for deploying an entity (ignoring tags like `"player"`, `"walkableplatform"`, `"NOBLOCK"`, etc.). `IsDeployPointClear2` improves spacing logic and integration with `DEPLOY_EXTRA_SPACING`.
* **Parameters:**  
  `pt`: `Vector3` of deployment point.  
  `inst`: Instance to exclude (e.g., the deployer).  
  `min_spacing`, `object_size`: Minimal spacing radius around deployment.  
  `...`: Optional custom ignore tags and custom near-other check logic.

### `Map:CanDeployAtPoint(pt, inst, mouseover)`
* **Description:** Returns `true` if an item can be deployed at `pt`, respecting passability, deployment spacing, and optional `mouseover` constraints (e.g., player/walkable platforms allowed as base).
* **Parameters:**  
  `pt`: Deployment point.  
  `inst`: Deployer instance.  
  `mouseover`: Optional target entity under cursor.

### `Map:CanDeployWallAtPoint(pt, inst)`
* **Description:** Returns `true` if a wall can be deployed. Snaps point to grid (±0.5), checks passability and close wall player blocking.
* **Parameters:**  
  `pt`, `inst`: Same as above.

### `Map:CanDeployDockAtPoint(pt, inst, mouseover)`
* **Description:** Returns `true` if a dock can be placed: on ocean tile, no docks in tile, no boats too close, and deploy point is clear.
* **Parameters:**  
  `pt`, `inst`, `mouseover`: Same as above.

### `Map:CanDeployBridgeAtPointWithFilter(pt, inst, mouseover, tilefilterfn)`
* **Description:** Generic bridge deploy check: validates tile type with `tilefilterfn`, avoids vault regions, dockjammer entities, and enforces spacing from boats.
* **Parameters:**  
  `pt`, `inst`, `mouseover`, `tilefilterfn`: A function returning `true` for valid bridge tiles (e.g., void or ocean/void).

### `Map:CanDeployRopeBridgeAtPoint`, `Map:CanDeployVineBridgeAtPoint`
* **Description:** Call `CanDeployBridgeAtPointWithFilter` with predefined tile filters (`void` for rope, `ocean or void` for vine).
* **Parameters:**  
  `pt`, `inst`, `mouseover`: Same as above.

### `Map:CanDeployMastAtPoint(pt, inst, mouseover)`
* **Description:** Returns `true` if a mast can be placed: on ocean tile, no other masts within 1.5 units, passable, and deploy clear.
* **Parameters:**  
  `pt`, `inst`, `mouseover`: Same as above.

### `Map:CanDeployBoatAtPointInWater(pt, inst, mouseover, data)`
* **Description:** Returns `true` if a boat can be placed at a water location, checking boat spacing, deploy clear, and surrounded-by-water.
* **Parameters:**  
  `pt`, `inst`, `mouseover`, `data`: `data.boat_radius`, `boat_extra_spacing`, and `min_distance_from_land`.

### `Map:CanDeployRecipeAtPoint(pt, recipe, rot)`
* **Description:** Returns `true` if a full recipe can be deployed, checking build mode (water vs land) and optional recipe `testfn`.
* **Parameters:**  
  `pt`, `recipe`, `rot`: Recipe object, rotation (unused directly).

### `Map:IsSurroundedByWater(x, y, z, radius)`
* **Description:** Returns `true` if all sampled points within a square of `radius` from `(x, y, z)` are ocean tiles. Includes overhang buffer in radius.
* **Parameters:**  
  `x`, `y`, `z`, `radius`: World coordinates and radius.

### `Map:IsDeployPointClear2`, `Map:IsDeployPointClear`, `Map:IsGroundTargetBlocked`, `Map:IsPointNearHole`
* **Description:** High-level deployment and targeting checks using `TheSim:FindEntities` with tags, distances, and radii.

### `Map:GetNearestPlatformInDirection(x, z, forward_x, forward_z, dist)`
* **Description:** Finds the nearest walkable platform (e.g., boat) within `dist` in a given direction.
* **Parameters:**  
  `x`, `z`, `forward_x`, `forward_z`, `dist`: Start point, normalized direction vector, and search distance.

### `Map:FindRandomPointWithFilter(max_tries, filterfn)`
* **Description:** Returns a random point within world bounds that satisfies `filterfn(self, x, y, z)`.
* **Parameters:**  
  `max_tries`: Maximum random sampling attempts.  
  `filterfn`: Function returning `true` for valid points.

### `Map:FindRandomPointInOcean(max_tries)`
### `Map:FindRandomPointOnLand(max_tries)`
* **Description:** Convenience wrappers for `FindRandomPointWithFilter` using ocean/land filters.

### `Map:FindVisualNodeAtPoint(x, y, z, has_tag)`
* **Description:** Finds the *visual* topology node that the point belongs to, handling tile overlap edge cases (expensive; scans local tiles).
* **Parameters:**  
  `x`, `y`, `z`, `has_tag`: Optional tag to require on the node.

### `Map:IsInLunacyArea(x, y, z)`
* **Description:** Returns `true` if any lunacy condition applies at the point (e.g., full moon near rift, moonstorm, lunacy tiles, or lunacy area tag).
* **Parameters:**  
  `x`, `y`, `z`: World coordinates.

### `Map:GetLunacyAreaModifier(x, y, z)`
* **Description:** Returns a mutation spawn modifier (e.g., `1.5`, `2.0`) based on how many lunacy conditions apply at `(x, y, z)`.
* **Parameters:**  
  `x`, `y`, `z`: World coordinates.

### `Map:CanCastAtPoint(pt, alwayspassable, allowwater, deployradius)`
* **Description:** Returns `true` if a spell can be cast at `(x, y, z)`, considering passability, ground target blocks, and deployment spacing (e.g., to avoid blocking entities).
* **Parameters:**  
  `pt`: `Vector3` point.  
  `alwayspassable`: Bypasses passability checks.  
  `allowwater`: Whether water is passable.  
  `deployradius`: Required clearance for ground placement.

### `Map:IsInMapBounds(x, y, z)`
* **Description:** Returns `true` if `(x, y, z)` lies within the world tile grid bounds.
* **Parameters:**  
  `x`, `y`, `z`: World coordinates.

### `Map:StartFindingGoodArenaPoints`, `Map:StopFindingGoodArenaPoints`
* **Description:** Starts/stops asynchronous scanning of the world to find candidate points for building arenas. Scans grid at intervals, caches up to 100 good points, and uses periodic tasks.

### `Map:FindBestSpawningPointForArena(...)`
### `Map:FindBestSpawningPointForOceanArena(...)`
* **Description:** Finds the best arena spawn point, prioritizing locations free of blockers and players, falling back to best available, and optionally triggering more scanning if needed.
* **Parameters:**  
  `CustomAllowTest`: Custom validation callback.  
  `perfect_only`: If `true`, only exact matches accepted.  
  `spawnpoints`: Optional list of candidate points.

## Events & Listeners
- Listens to:  
  None (no `inst:ListenForEvent` calls observed).
- Triggers:  
  - `"onterraform"` — Emits in `Map:SetTile` with payload `{x, y, original_tile, tile}`.