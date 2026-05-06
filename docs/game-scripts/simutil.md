---
id: simutil
title: Simutil
description: A global utility module providing helper functions for entity searching, vision checks, spawning logic, and asset atlas management.
tags: [utility, search, vision, spawning, assets]
sidebar_position: 10
last_updated: 2026-04-17
build_version: 722832
change_status: stable
category_type: root
source_hash: 10d916af
system_scope: world
---

# Simutil

> Based on game build **722832** | Last updated: 2026-04-17

## Overview
`simutil.lua` defines a collection of standalone utility functions used throughout the game codebase. It handles spatial queries (finding entities, players, safe spawn points), vision checks (lighting, storm, darkness), entity erosion effects, and asset atlas lookups for inventory, minimap, and UI icons. It also manages global map icon registration. This file does not define a class; its functions are called directly or accessed globally. It relies heavily on `TheWorld`, `TheSim`, and `AllPlayers` globals.

## Usage example
```lua
-- Functions are typically available globally after loading
local x, y, z = FindSafeSpawnLocation(0, 0, 0)
local closest = FindClosestPlayerToInst(inst, 10, true)
RegisterGlobalMapIcon(inst, "my_icon")

-- Check vision conditions
if CanEntitySeeInDark(player) then
    print("Player can see in dark")
end

-- Find pickupable items
local item = FindPickupableItem(player, 5, false, nil, nil, nil, false)
```

## Dependencies & tags
**External dependencies:**
- `dbui_no_package/debug_skins_data/hooks` -- Loaded conditionally if `CAN_USE_DBUI` is true for skin debugging.

**Components used:**
- `inventory` -- Checks capacity and item acceptance in pickup logic.
- `burnable` -- Checks burning/smoldering state to exclude items.
- `floater` -- Triggers erosion effect on entities.
- `playervision` -- Checks night/goggle vision capabilities.
- `stormwatcher` -- Checks storm levels for vision obstruction.
- `miasmawatcher` -- Checks miasma presence for vision obstruction.
- `playerspawner` -- Retrieves safe spawn points.
- `nightlightmanager` -- Finds night lights for Charlie spawn logic.
- `walkableplatform` -- Checks platform status for camera shake.
- `inventoryitem`, `trap`, `bait`, `container`, `bundlemaker`, `armor`, `weapon`, `tool`, `equippable`, `sewing`, `erasablepaper`, `pickable` -- Various checks for item pickup logic and filtering.

**Tags:**
- `pickable`, `_inventoryitem` -- Used for filtering pickupable items.
- `lunacyarea` -- Excluded from Charlie spawn spots.
- `canseeindark`, `nightvision`, `goggles` -- Vision capability checks.
- `INLIMBO`, `NOCLICK`, `fire`, `structure`, `donotautopick`, `minesprung`, `mineactive`, `catchable`, `cursed`, `paired`, `bundle`, `heatrock`, `deploykititem`, `boatbuilder`, `singingshell`, `archive_lockbox`, `simplebook`, `furnituredecor`, `flower`, `gemsocket`, `irreplaceable`, `knockbackdelayinteraction`, `event_trigger`, `spider`, `light` -- Exclusion tags for pickup logic.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| None | | | No properties are defined. |

## Main functions
### `CalledFrom()`
* **Description:** Returns a formatted string indicating the source file and line number of the caller, used for deprecation warnings.
* **Parameters:** None
* **Returns:** String describing the call site (e.g., `@mod/main.lua:10 in function`).
* **Error states:** None.

### `GetWorld()`
* **Description:** Deprecated wrapper for `TheWorld`. Prints a warning before returning the global world instance.
* **Parameters:** None
* **Returns:** `TheWorld` entity instance.
* **Error states:** None.

### `GetPlayer()`
* **Description:** Deprecated wrapper for `ThePlayer`. Prints a warning before returning the local player instance.
* **Parameters:** None
* **Returns:** `ThePlayer` entity instance.
* **Error states:** None.

### `FindEntity(inst, radius, fn, musttags, canttags, mustoneoftags)`
* **Description:** Finds the first entity within `radius` of `inst` that matches tag filters and optional function `fn`. Excludes `inst` itself and invisible entities.
* **Parameters:**
  - `inst` -- Reference entity for position
  - `radius` -- Search radius
  - `fn` -- Optional filter function `fn(entity, inst)`
  - `musttags` -- Table of tags entity must have
  - `canttags` -- Table of tags entity must not have
  - `mustoneoftags` -- Table of tags entity must have at least one of
* **Returns:** Entity instance or `nil` if none found.
* **Error states:** None (guards against nil/invalid `inst`).

### `FindClosestEntity(inst, radius, ignoreheight, musttags, canttags, mustoneoftags, fn)`
* **Description:** Finds the closest entity to `inst` within `radius` matching tag filters. Optionally ignores height difference.
* **Parameters:**
  - `inst` -- Reference entity for position
  - `radius` -- Search radius
  - `ignoreheight` -- Boolean to ignore Y-axis distance
  - `musttags`, `canttags`, `mustoneoftags` -- Tag filter tables
  - `fn` -- Optional filter function `fn(entity, inst)`
* **Returns:** `entity, distance_sq` or `nil, nil`.
* **Error states:** None.

### `FindClosestPlayerInRangeSq(x, y, z, rangesq, isalive)`
* **Description:** Finds the closest player to coordinates within squared range. Optionally filters by alive status.
* **Parameters:**
  - `x, y, z` -- World coordinates
  - `rangesq` -- Squared search radius
  - `isalive` -- Boolean to filter for alive/dead players (nil for any)
* **Returns:** `player, distance_sq` or `nil, nil`.
* **Error states:** None.

### `FindClosestPlayerInRange(x, y, z, range, isalive)`
* **Description:** Wrapper for `FindClosestPlayerInRangeSq` accepting linear range.
* **Parameters:**
  - `x, y, z` -- World coordinates
  - `range` -- Search radius
  - `isalive` -- Boolean to filter for alive/dead players
* **Returns:** `player, distance_sq` or `nil, nil`.
* **Error states:** None.

### `FindClosestPlayer(x, y, z, isalive)`
* **Description:** Finds the closest player to coordinates regardless of distance.
* **Parameters:**
  - `x, y, z` -- World coordinates
  - `isalive` -- Boolean to filter for alive/dead players
* **Returns:** `player, distance_sq` or `nil, nil`.
* **Error states:** None.

### `FindClosestPlayerToInst(inst, range, isalive)`
* **Description:** Finds the closest player to an entity instance within range.
* **Parameters:**
  - `inst` -- Reference entity
  - `range` -- Search radius
  - `isalive` -- Boolean to filter for alive/dead players
* **Returns:** `player, distance_sq` or `nil, nil`.
* **Error states:** Errors if `inst` is nil or invalid (accesses `inst.Transform`).

### `FindClosestPlayerOnLandInRangeSq(x, y, z, rangesq, isalive)`
* **Description:** Finds closest player within range who is currently on valid ground.
* **Parameters:**
  - `x, y, z` -- World coordinates
  - `rangesq` -- Squared search radius
  - `isalive` -- Boolean to filter for alive/dead players
* **Returns:** `player, distance_sq` or `nil, nil`.
* **Error states:** None.

### `FindClosestPlayerToInstOnLand(inst, range, isalive)`
* **Description:** Finds the closest player on valid ground to an entity instance within range.
* **Parameters:**
  - `inst` -- Reference entity
  - `range` -- Search radius
  - `isalive` -- Boolean to filter for alive/dead players
* **Returns:** `player, distance_sq` or `nil, nil`.
* **Error states:** Errors if `inst` is nil or invalid (accesses `inst.Transform`).

### `FindPlayersInRangeSqSortedByDistance(x, y, z, rangesq, isalive)`
* **Description:** Returns a table of players within squared range, sorted by distance (closest first).
* **Parameters:**
  - `x, y, z` -- World coordinates
  - `rangesq` -- Squared search radius
  - `isalive` -- Boolean to filter for alive/dead players
* **Returns:** Table of player instances.
* **Error states:** None.

### `FindPlayersInRangeSortedByDistance(x, y, z, range, isalive)`
* **Description:** Wrapper for `FindPlayersInRangeSqSortedByDistance` accepting linear range.
* **Parameters:**
  - `x, y, z` -- World coordinates
  - `range` -- Search radius
  - `isalive` -- Boolean to filter for alive/dead players
* **Returns:** Table of player instances.
* **Error states:** None.

### `FindPlayersInRangeSq(x, y, z, rangesq, isalive)`
* **Description:** Returns a table of players within squared range (unsorted).
* **Parameters:**
  - `x, y, z` -- World coordinates
  - `rangesq` -- Squared search radius
  - `isalive` -- Boolean to filter for alive/dead players
* **Returns:** Table of player instances.
* **Error states:** None.

### `FindPlayersInRange(x, y, z, range, isalive)`
* **Description:** Wrapper for `FindPlayersInRangeSq` accepting linear range.
* **Parameters:**
  - `x, y, z` -- World coordinates
  - `range` -- Search radius
  - `isalive` -- Boolean to filter for alive/dead players
* **Returns:** Table of player instances.
* **Error states:** None.

### `IsAnyPlayerInRangeSq(x, y, z, rangesq, isalive)`
* **Description:** Checks if any player exists within squared range.
* **Parameters:**
  - `x, y, z` -- World coordinates
  - `rangesq` -- Squared search radius
  - `isalive` -- Boolean to filter for alive/dead players
* **Returns:** Boolean.
* **Error states:** None.

### `IsAnyPlayerInRange(x, y, z, range, isalive)`
* **Description:** Wrapper for `IsAnyPlayerInRangeSq` accepting linear range.
* **Parameters:**
  - `x, y, z` -- World coordinates
  - `range` -- Search radius
  - `isalive` -- Boolean to filter for alive/dead players
* **Returns:** Boolean.
* **Error states:** None.

### `IsAnyOtherPlayerNearInst(inst, rangesq, isalive)`
* **Description:** Checks if any player other than `inst` is within squared range.
* **Parameters:**
  - `inst` -- Reference entity (usually a player)
  - `rangesq` -- Squared search radius
  - `isalive` -- Boolean to filter for alive/dead players
* **Returns:** Boolean.
* **Error states:** Errors if `inst` is nil or invalid.

### `FindSafeSpawnLocation(x, y, z)`
* **Description:** Finds a safe location to spawn an item, preferring near players or world spawn points to avoid ocean loss.
* **Parameters:**
  - `x, y, z` -- Preferred coordinates (optional)
* **Returns:** `x, y, z` coordinates.
* **Error states:** None.

### `FindNearbyLand(position, range)`
* **Description:** Finds a valid land position near `position` using a fan search.
* **Parameters:**
  - `position` -- Vector3 start position
  - `range` -- Search radius (default `8`)
* **Returns:** Vector3 offset or `nil`.
* **Error states:** None.

### `FindNearbyOcean(position, range)`
* **Description:** Finds a valid ocean position near `position` using a fan search.
* **Parameters:**
  - `position` -- Vector3 start position
  - `range` -- Search radius (default `8`)
* **Returns:** Vector3 offset or `nil`.
* **Error states:** None.

### `GetRandomInstWithTag(tag, inst, radius)`
* **Description:** Returns a random entity with `tag` within `radius` of `inst`.
* **Parameters:**
  - `tag` -- String or table of tags
  - `inst` -- Reference entity
  - `radius` -- Search radius
* **Returns:** Entity instance or `nil`.
* **Error states:** Errors if `inst` is nil or invalid.

### `GetClosestInstWithTag(tag, inst, radius)`
* **Description:** Returns the closest entity with `tag` within `radius` of `inst`.
* **Parameters:**
  - `tag` -- String or table of tags
  - `inst` -- Reference entity
  - `radius` -- Search radius
* **Returns:** Entity instance or `nil`.
* **Error states:** Errors if `inst` is nil or invalid.

### `DeleteCloseEntsWithTag(tag, inst, radius)`
* **Description:** Removes all entities with `tag` within `radius` of `inst`.
* **Parameters:**
  - `tag` -- String or table of tags
  - `inst` -- Reference entity
  - `radius` -- Search radius
* **Returns:** None.
* **Error states:** Errors if `inst` is nil or invalid.

### `AnimateUIScale(item, total_time, start_scale, end_scale)`
* **Description:** Animates the scale of a UI widget over time using a coroutine.
* **Parameters:**
  - `item` -- UI widget with `UITransform`
  - `total_time` -- Duration in seconds
  - `start_scale` -- Starting scale value
  - `end_scale` -- Ending scale value
* **Returns:** None.
* **Error states:** Errors if `item` lacks `UITransform` or `StartThread`.

### `ShakeAllCameras(mode, duration, speed, scale, source_or_pt, maxDist)`
* **Description:** Triggers camera shake on all connected players.
* **Parameters:**
  - `mode` -- Shake mode
  - `duration` -- Shake duration
  - `speed` -- Shake speed
  - `scale` -- Shake intensity
  - `source_or_pt` -- Source entity or position
  - `maxDist` -- Max distance for effect
* **Returns:** None.
* **Error states:** None.

### `ShakeAllCamerasWithFilter(filterfn, mode, duration, speed, scale, source_or_pt, maxDist)`
* **Description:** Triggers camera shake on players matching `filterfn`.
* **Parameters:**
  - `filterfn` -- Function `fn(player)` returning boolean
  - `mode, duration, speed, scale, source_or_pt, maxDist` -- Shake parameters
* **Returns:** None.
* **Error states:** None.

### `ShakeAllCamerasOnPlatform(mode, duration, speed, scale, platform)`
* **Description:** Triggers camera shake on players standing on a specific walkable platform.
* **Parameters:**
  - `mode, duration, speed, scale` -- Shake parameters
  - `platform` -- Platform entity
* **Returns:** None.
* **Error states:** None.

### `FindValidPositionByFan(start_angle, radius, attempts, test_fn)`
* **Description:** Searches for a valid position by fanning out angles from a start point.
* **Parameters:**
  - `start_angle` -- Starting angle in radians
  - `radius` -- Search distance
  - `attempts` -- Number of angle attempts (default `8`)
  - `test_fn` -- Function `fn(offset)` returning boolean
* **Returns:** `offset, check_angle, deflected` or `nil`.
* **Error states:** None.

### `FindWalkableOffset(position, start_angle, radius, attempts, check_los, ignore_walls, customcheckfn, allow_water, allow_boats)`
* **Description:** Finds a walkable offset from `position`, checking ground, teleportation, and line of sight.
* **Parameters:**
  - `position` -- Vector3 start position
  - `start_angle` -- Starting angle in radians
  - `radius` -- Search distance
  - `attempts` -- Number of attempts
  - `check_los` -- Boolean to check line of sight
  - `ignore_walls` -- Boolean to ignore walls in pathfinding
  - `customcheckfn` -- Optional extra validation function
  - `allow_water` -- Boolean to allow ocean tiles
  - `allow_boats` -- Boolean to allow boat platforms
* **Returns:** `offset, check_angle, deflected` or `nil`.
* **Error states:** None.

### `FindSwimmableOffset(position, start_angle, radius, attempts, check_los, ignore_walls, customcheckfn, allow_boats)`
* **Description:** Finds a swimmable ocean offset from `position`.
* **Parameters:**
  - `position` -- Vector3 start position
  - `start_angle` -- Starting angle in radians
  - `radius` -- Search distance
  - `attempts` -- Number of attempts
  - `check_los` -- Boolean to check line of sight
  - `ignore_walls` -- Boolean to ignore walls
  - `customcheckfn` -- Optional extra validation function
  - `allow_boats` -- Boolean to allow boat platforms
* **Returns:** `offset, check_angle, deflected` or `nil`.
* **Error states:** None.

### `FindCharlieRezSpotFor(inst)`
* **Description:** Finds a safe resurrection spot for Charlie (darkness monster), preferring near night lights.
* **Parameters:**
  - `inst` -- Reference entity
* **Returns:** `x, y, z` coordinates.
* **Error states:** Errors if `inst` is nil and both `nightlightmanager` and `playerspawner` components are unavailable (accesses `inst.Transform` without nil guard in fallback).

### `FindPickupableItem(owner, radius, furthestfirst, positionoverride, ignorethese, onlytheseprefabs, allowpickables, worker, extra_filter, inventoryoverride)`
* **Description:** Searches for an item on the ground that the `owner` can pick up into their inventory.
* **Parameters:**
  - `owner` -- Player or entity with inventory
  - `radius` -- Search radius
  - `furthestfirst` -- Boolean to search furthest items first
  - `positionoverride` -- Vector3 to search from instead of owner pos
  - `ignorethese` -- Table of entities to ignore
  - `onlytheseprefabs` -- Table of allowed prefabs/products
  - `allowpickables` -- Boolean to include pickable bushes/flowers
  - `worker` -- Worker entity for ignore logic
  - `extra_filter` -- Optional function `fn(worker, v, owner)`
  - `inventoryoverride` -- Optional inventory component to check
* **Returns:** `entity, ispickable` or `nil, nil`.
* **Error states:** None (guards against missing inventory).

### `CanEntitySeeInDark(inst)`
* **Description:** Checks if `inst` has the ability to see in darkness (night vision or goggles).
* **Parameters:**
  - `inst` -- Entity to check
* **Returns:** Boolean.
* **Error states:** None.

### `CanEntitySeeInStorm(inst)`
* **Description:** Checks if `inst` has the ability to see during storms (goggles).
* **Parameters:**
  - `inst` -- Entity to check
* **Returns:** Boolean.
* **Error states:** None.

### `CanEntitySeePoint(inst, x, y, z)`
* **Description:** Checks if `inst` can see a specific point based on light, storms, and ink status.
* **Parameters:**
  - `inst` -- Observer entity
  - `x, y, z` -- Target coordinates
* **Returns:** Boolean.
* **Error states:** None.

### `CanEntitySeeTarget(inst, target)`
* **Description:** Checks if `inst` can see a target entity.
* **Parameters:**
  - `inst` -- Observer entity
  - `target` -- Target entity
* **Returns:** Boolean.
* **Error states:** None.

### `SpringCombatMod(amount, forced)`
* **Description:** Applies Spring season combat damage multiplier.
* **Parameters:**
  - `amount` -- Base damage value
  - `forced` -- Boolean to force application regardless of season
* **Returns:** Modified damage value.
* **Error states:** None.

### `SpringGrowthMod(amount, forced)`
* **Description:** Applies Spring season growth rate multiplier.
* **Parameters:**
  - `amount` -- Base duration/value
  - `forced` -- Boolean to force application regardless of season
* **Returns:** Modified value.
* **Error states:** None.

### `TemporarilyRemovePhysics(obj, time)`
* **Description:** Disables collision mask for `obj` temporarily, restoring it after `time`.
* **Parameters:**
  - `obj` -- Entity with Physics component
  - `time` -- Duration in seconds
* **Returns:** None.
* **Error states:** Errors if `obj` lacks `Physics` component.

### `ErodeAway(inst, erode_time)`
* **Description:** Visually erodes `inst` over time and then removes it from the world.
* **Parameters:**
  - `inst` -- Entity to erode
  - `erode_time` -- Duration in seconds (default `1`)
* **Returns:** None.
* **Error states:** Errors if `inst` lacks `AnimState` component.

### `ErodeCB(inst, erode_time, cb, restore)`
* **Description:** Visually erodes `inst` over time, calls callback `cb`, and optionally restores animation.
* **Parameters:**
  - `inst` -- Entity to erode
  - `erode_time` -- Duration in seconds
  - `cb` -- Callback function `fn(inst)`
  - `restore` -- Boolean to reset erosion params after finish
* **Returns:** None.
* **Error states:** Errors if `inst` lacks `AnimState` component.

### `ApplySpecialEvent(event)`
* **Description:** Sets the global world special event, resetting tech levels if not active.
* **Parameters:**
  - `event` -- Event string identifier
* **Returns:** None.
* **Error states:** None.

### `ApplyExtraEvent(event)`
* **Description:** Adds an extra world event to the active list.
* **Parameters:**
  - `event` -- Event string identifier
* **Returns:** None.
* **Error states:** None.

### `RegisterInventoryItemAtlas(atlas, imagename)`
* **Description:** Registers an atlas path for a specific inventory image name.
* **Parameters:**
  - `atlas` -- Atlas path string
  - `imagename` -- Image name string
* **Returns:** None.
* **Error states:** None.

### `GetInventoryItemAtlas(imagename, no_fallback)`
* **Description:** Retrieves the atlas path for an inventory image, checking caches and default XMLs.
* **Parameters:**
  - `imagename` -- Image name string
  - `no_fallback` -- Boolean to skip fallback atlas check
* **Returns:** Atlas path string or `nil`.
* **Error states:** None.

### `GetMinimapAtlas(imagename)`
* **Description:** Retrieves the atlas path for a minimap image.
* **Parameters:**
  - `imagename` -- Image name string
* **Returns:** Atlas path string or `nil`.
* **Error states:** None.

### `RegisterScrapbookIconAtlas(atlas, imagename)`
* **Description:** Registers an atlas path for a scrapbook icon.
* **Parameters:**
  - `atlas` -- Atlas path string
  - `imagename` -- Image name string
* **Returns:** None.
* **Error states:** None.

### `GetScrapbookIconAtlas(imagename)`
* **Description:** Retrieves the atlas path for a scrapbook icon.
* **Parameters:**
  - `imagename` -- Image name string
* **Returns:** Atlas path string or `nil`.
* **Error states:** None.

### `RegisterSkilltreeBGAtlas(atlas, imagename)`
* **Description:** Registers an atlas path for a skill tree background.
* **Parameters:**
  - `atlas` -- Atlas path string
  - `imagename` -- Image name string
* **Returns:** None.
* **Error states:** None.

### `GetSkilltreeBG(imagename)`
* **Description:** Retrieves the atlas path for a skill tree background.
* **Parameters:**
  - `imagename` -- Image name string
* **Returns:** Atlas path string or `nil`.
* **Error states:** None.

### `RegisterSkilltreeIconsAtlas(atlas, imagename)`
* **Description:** Registers an atlas path for a skill tree icon.
* **Parameters:**
  - `atlas` -- Atlas path string
  - `imagename` -- Image name string
* **Returns:** None.
* **Error states:** None.

### `GetSkilltreeIconAtlas(imagename)`
* **Description:** Retrieves the atlas path for a skill tree icon.
* **Parameters:**
  - `imagename` -- Image name string
* **Returns:** Atlas path string or `nil`.
* **Error states:** None.

### `UnregisterGlobalMapIcon(inst)`
* **Description:** Removes `inst` from the global map icon registry.
* **Parameters:**
  - `inst` -- Entity instance
* **Returns:** None.
* **Error states:** Prints warning if `inst` was not registered.

### `RegisterGlobalMapIcon(inst, name)`
* **Description:** Adds `inst` to the global map icon registry for fast lookup.
* **Parameters:**
  - `inst` -- Entity instance
  - `name` -- Optional name override (defaults to prefab)
* **Returns:** None.
* **Error states:** Prints warning if `inst` is already registered.

### `FindClosestMapIconInRangeSq(name, x, y, z, rangesq, restricted_doer)`
* **Description:** Finds the closest registered map icon of `name` within squared range.
* **Parameters:**
  - `name` -- Icon name/prefab
  - `x, y, z` -- Search coordinates
  - `rangesq` -- Squared search radius
  - `restricted_doer` -- Optional player to check restrictions against
* **Returns:** Entity instance or `nil`.
* **Error states:** None.

### `FindClosestMapIconInRange(name, x, y, z, range, restricted_doer)`
* **Description:** Wrapper for `FindClosestMapIconInRangeSq` accepting linear range.
* **Parameters:**
  - `name` -- Icon name/prefab
  - `x, y, z` -- Search coordinates
  - `range` -- Search radius
  - `restricted_doer` -- Optional player to check restrictions against
* **Returns:** Entity instance or `nil`.
* **Error states:** None.

### `FindClosestMapIcon(name, x, y, z, restricted_doer)`
* **Description:** Finds the closest registered map icon of `name` regardless of distance.
* **Parameters:**
  - `name` -- Icon name/prefab
  - `x, y, z` -- Search coordinates
  - `restricted_doer` -- Optional player to check restrictions against
* **Returns:** Entity instance or `nil`.
* **Error states:** None.

### `DeclareLimitedCraftingRecipe(recipename)`
* **Description:** Registers a recipe as limited for crafting station serialization.
* **Parameters:**
  - `recipename` -- String recipe identifier
* **Returns:** None.
* **Error states:** Errors if recipe is already declared.

## Events & listeners
**Listens to:**
- `onremove` -- `RegisterGlobalMapIcon` attaches a listener to `inst` to automatically unregister the icon when the entity is removed.

**Pushes:**
- None identified.