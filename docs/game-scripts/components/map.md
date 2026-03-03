---
id: map
title: Map
description: Provides world geometry and terrain query utilities for placement, navigation, and arena validation.
tags: [terrain, deployment, navigation, world]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 9cafeaf5
system_scope: world
---

# Map

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
The `Map` component encapsulates core world geometry and terrain logic. It is responsible for terrain type checks, valid deployment spot validation, platform and overhang detection, and arena point identification (for boss fights). It serves as the central interface for tile-based spatial reasoning across the game, integrating with components like `walkableplatform`, `pickable`, `placer`, and external helpers (`sharkboimanagerhelper`, `vault_floor_helper`, `wagpunk_floor_helper`).

## Usage example
```lua
local map = TheWorld.Map
local x, y, z = 10, 0, -20

-- Check if a point is passable land
if map:IsPassableAtPoint(x, y, z, false, false) then
    -- Test if deployment is clear of obstacles
    local pt = Vector3(x, y, z)
    if map:CanDeployAtPoint(pt, inst) then
        -- Deploy entity
        inst.Transform:SetPosition(x, y, z)
    end
end
```

## Dependencies & tags
**Components used:** `walkableplatform`, `pickable`, `placer`, `riftspawner`, `sharkboimanagerhelper`, `vault_floor_helper`, `wagpunk_floor_helper`, `moonstorms`

**Tags:** 
- Uses `walkableplatform` for platform detection.
- Checks for `terraformblocker`, `groundhole`, `groundtargetblocker`, `INLIMBO`, `NOBLOCK`, `player`, `FX`, `DECOR`, `structure`, `wall`, `dockjammer`, `lunacyarea`, `nocavein`, `noquaker`, `tree`, `boulder`, `spiderden`, `okayforarena`, `blocker`, `plant`, `antlion_sinkhole_blocker`, `structure`, `ignorewalkableplatforms`.
- `walkableperipheral` and `walkableplatform` for peripheral deployment.

## Properties
No public properties.

## Main functions
### `Map:SetTile(x, y, tile, ...)`
*   **Description:** Overrides the terrain tile at `(x, y)` and fires `onterraform` event with original and new tile data.
*   **Parameters:** 
    - `x`, `y` (number) — tile coordinates.
    - `tile` (number) — `WORLD_TILES.*` identifier.
    - `...` (vararg) — additional arguments passed to underlying `Map.SetTile`.
*   **Returns:** Nothing.

### `Map:IsPassableAtPoint(x, y, z, allow_water, exclude_boats)`
*   **Description:** Checks if point `(x, y, z)` is walkable land or valid water (if `allow_water` is `true`). Also considers walkable platforms if `exclude_boats` is `false`.
*   **Parameters:** 
    - `x`, `y`, `z` (number) — world coordinates.
    - `allow_water` (boolean) — whether water tiles are considered passable.
    - `exclude_boats` (boolean) — whether to exclude walkable platforms (e.g., boats).
*   **Returns:** 
    - `valid_tile` (boolean) — `true` if the point is on land or valid water.
    - `is_overhang` (boolean, optional) — `true` if point is in an overhang region.

### `Map:IsAboveGroundAtPoint(x, y, z, allow_water)`
*   **Description:** Returns `true` if `(x, y, z)` lies on land or ocean tile (not invalid or overhang).
*   **Parameters:** 
    - `x`, `y`, `z` (number) — world coordinates.
    - `allow_water` (boolean) — ignored in implementation (logic only considers tile group).
*   **Returns:** `true` if tile is land or ocean.

### `Map:CanTerraformAtPoint(x, y, z)`
*   **Description:** Verifies that terraforming is allowed at the specified point (e.g., not immune tile, no blockers within `TERRAFORM_EXTRA_SPACING`).
*   **Parameters:** 
    - `x`, `y`, `z` (number) — world coordinates.
*   **Returns:** `true` if terraforming is allowed.

### `Map:CanDeployAtPoint(pt, inst, mouseover)`
*   **Description:** Checks if an entity can be deployed at `pt`, considering terrain passability, deployment spacing, and mouseover type.
*   **Parameters:** 
    - `pt` (Vector3) — deployment point.
    - `inst` (Entity) — entity being deployed (used for spacing and tags).
    - `mouseover` (Entity, optional) — currently hovered entity.
*   **Returns:** `true` if deployment is valid.

### `Map:CanDeployWallAtPoint(pt, inst)`
*   **Description:** Specialized deployment check for walls, snapping coordinates to nearest meter grid and applying wall-specific spacing rules.
*   **Parameters:** 
    - `pt` (Vector3) — target point.
    - `inst` (Entity) — wall entity being deployed.
*   **Returns:** `true` if wall placement is valid.

### `Map:CanDeployDockAtPoint(pt, inst, mouseover)`
*   **Description:** Validates dock placement on ocean tiles, ensuring no nearby boats and no dock jammers.
*   **Parameters:** Same as `CanDeployAtPoint`, but restricted to ocean tiles.
*   **Returns:** `true` if dock placement is valid.

### `Map:CanDeployBridgeAtPointWithFilter(pt, inst, mouseover, tilefilterfn)`
*   **Description:** Generic bridge placement check using a custom tile filter (e.g., `BridgeFilter_Void`, `BridgeFilter_OceanAndVoid`).
*   **Parameters:** 
    - `tilefilterfn` (function) — function `(self, tileid) → boolean` that validates tile types.
*   **Returns:** `true` if bridge placement is valid.

### `Map:CanDeployBoatAtPointInWater(pt, inst, mouseover, data)`
*   **Description:** Validates boat deployment on water, checking for proximity to other platforms and ensuring sufficient ocean coverage.
*   **Parameters:** 
    - `data` (table) — must include `boat_radius`, `boat_extra_spacing`, and `min_distance_from_land`.
*   **Returns:** `true` if boat can be deployed.

### `Map:IsSurroundedByWater(x, y, z, radius)`
*   **Description:** Verifies that all points on a square perimeter and interior (within `radius`) are ocean tiles.
*   **Parameters:** 
    - `radius` (number) — half-width of the sampling square (inclusive, with +1 internal padding).
*   **Returns:** `true` if the region is fully ocean.

### `Map:IsDeployPointClear(pt, inst, min_spacing, min_spacing_sq_fn, near_other_fn, check_player, custom_ignore_tags)`
*   **Description:** Determines whether deployment at `pt` is clear of blocking entities, using spacing rules and tag filters.
*   **Parameters:** 
    - `inst` (Entity, optional) — entity being deployed (excluded from checks).
    - `min_spacing` (number, optional) — required clearance radius.
    - `near_other_fn` (function, optional) — custom proximity check function.
*   **Returns:** `true` if no blockers found.

### `Map:GetLunacyAreaModifier(x, y, z)`
*   **Description:** Calculates a mutation spawn chance multiplier based on proximity to lunar anomaly sources (rifts, full moon, moonstorms, lunacy tiles, or lunacy areas).
*   **Parameters:** 
    - `x`, `y`, `z` (number) — world coordinates.
*   **Returns:** Multiplier ≥ `1.0` (base is `1.0`, +`0.5` per active condition).

### `Map:FindBestSpawningPointForArena(CustomAllowTest, perfect_only, spawnpoints)`
*   **Description:** Searches for the best spawning point for a land-based arena, prioritizing points with no obstacles and no players nearby.
*   **Parameters:** 
    - `CustomAllowTest` (function) — function `(map, x, y, z) → boolean` for additional criteria.
    - `perfect_only` (boolean) — if `true`, only returns ideal (obstacle-free) points.
    - `spawnpoints` (table, optional) — list of candidate points.
*   **Returns:** `(x, y, z)` of best point or `nil, nil, nil`.

### `Map:StartFindingGoodArenaPoints()`
*   **Description:** Begins background scanning for optimal land arena points (cached for later reuse in arena placement).
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Map:IsInLunacyArea(x, y, z)`
*   **Description:** Checks if the point is in any active lunacy condition (e.g., during moon rift events or on lunacy tiles).
*   **Parameters:** 
    - `x`, `y`, `z` (number) — world coordinates.
*   **Returns:** `true` if lunacy is active.

### `Map:IsPointInVaultRoom(x, y, z)`
*   **Description:** Checks if the point is inside a vault room using replicated vault positioning data.
*   **Parameters:** Same as above.
*   **Returns:** `true` if inside vault room.

### `Map:IsWagPunkArenaBarrierUp()`
*   **Description:** Checks if the WagPunk arena barrier is currently active.
*   **Parameters:** None.
*   **Returns:** `true` if barrier is up.

### `Map:GetWagPunkArenaCenterXZ()`
*   **Description:** Returns the center `(x, z)` of the WagPunk arena.
*   **Parameters:** None.
*   **Returns:** `(x, z)` or `nil, nil` if not available.

## Events & listeners
- **Listens to:** None (component does not register event listeners directly).
- **Pushes:** 
    - `onterraform` — fired by `Map:SetTile` when a tile is changed; includes `{x, y, original_tile, tile}`.
