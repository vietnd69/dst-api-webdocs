---
id: simutil
title: Simutil
description: Provides utility functions for world and entity queries, vision checks, camera effects, and world event management.
tags: [utility, world, player, combat, environment]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 080f06ad
system_scope: world
---

# Simutil

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`simutil.lua` is a collection of global utility functions used throughout Don't Starve Together for querying entities and players, managing camera effects, vision logic, positioning, and world event state. It does not define a component itself, but rather exposes standalone helper functions used across prefabs, components, and scripts. Core responsibilities include:
- Finding nearby entities and players using distance and tag filters.
- Checking visibility under dark or stormy conditions.
- Generating safe or valid positions using fan-based searches.
- Managing global resources like map icon registries and crafting recipe declarations.

## Usage example
```lua
-- Find the closest living player within 20 units
local player = FindClosestPlayer(0, 5, 0, 20, true)

-- Check if an entity can see a point (accounting for darkness and storms)
if CanEntitySeePoint(inst, targetx, targety, targetz) then
    -- do something
end

-- Apply a seasonal combat damage modifier
local damage = SpringCombatMod(10, false)

-- Register a custom inventory image atlas
RegisterInventoryItemAtlas("images/my_mod_images.xml", "my_item")
```

## Dependencies & tags
**Components used:** `playervision`, `floater`, `burnable`, `inventoryitem`, `inventory`, `container`, `bait`, `trap`, `erasablepaper`, `weapon`, `tool`, `equippable`, `sewing`, `armor`, `bundlemaker`, `pickable`, `stormwatcher`, `miasmawatcher`, `playervision`, `nightlightmanager`, `playerspawner`, `walkableplatform`, `inkable`.

**Tags:** Uses constants `PICKUP_MUST_ONEOF_TAGS`, `PICKUP_CANT_TAGS`, `NO_CHARLIE_TAGS`; interacts with `SPECIAL_EVENTS`, `WORLD_SPECIAL_EVENT`, `WORLD_EXTRA_EVENTS`, `CRAFTINGSTATION_LIMITED_RECIPES`, `CRAFTINGSTATION_LIMITED_RECIPES_LOOKUPS`, `CRAFTINGSTATION_LIMITED_RECIPES_COUNT`.

## Properties
No public properties. `simutil.lua` contains only global functions and constants used as helper utilities.

## Main functions
### `FindEntity(inst, radius, fn, musttags, canttags, mustoneoftags)`
* **Description:** Finds the first entity within `radius` units of `inst` that matches the specified tag filters and optional filter function `fn`.
* **Parameters:**
  * `inst` (entity) — Reference entity for position and validity.
  * `radius` (number) — Search radius in world units.
  * `fn` (function, optional) — Custom filter function `(v, inst) => boolean`.
  * `musttags` (table/string, optional) — Tags all results must have (string or table of strings).
  * `canttags` (table, optional) — Tags results must *not* have.
  * `mustoneoftags` (table, optional) — At least one of these tags must be present.
* **Returns:** First matching entity, or `nil` if none found.
* **Error states:** Returns `nil` if `inst` is `nil` or not valid.

### `FindClosestEntity(inst, radius, ignoreheight, musttags, canttags, mustoneoftags, fn)`
* **Description:** Finds the closest entity within `radius`, optionally ignoring Y (height) coordinate.
* **Parameters:**
  * `ignoreheight` (boolean) — If `true`, only X/Z distance is used.
* **Returns:** `(closestEntity, rangesq)` — closest entity and its squared distance; `nil, nil` if none found.

### `FindClosestPlayer(x, y, z, isalive)`
* **Description:** Returns the closest player to the given world coordinates. `isalive` filters based on whether the player is alive (if `true`) or dead/ghost (if `false`).
* **Returns:** Player entity or `nil`.

### `FindPlayersInRangeSqSortedByDistance(x, y, z, rangesq, isalive)`
* **Description:** Returns a list of players within `rangesq` distance, sorted from nearest to farthest.
* **Returns:** Array of player entities.

### `IsAnyPlayerInRangeSq(x, y, z, rangesq, isalive)`
* **Description:** Returns `true` if at least one player (matching `isalive` condition) is within range.
* **Returns:** `true` or `false`.

### `IsAnyOtherPlayerNearInst(inst, rangesq, isalive)`
* **Description:** Returns `true` if any *other* player (not `inst`) is within range.

### `FindSafeSpawnLocation(x, y, z)`
* **Description:** Returns a safe spawn position for an item (e.g., avoiding ocean spawn loss).
* **Returns:** `(x, y, z)` — spawn coordinates.

### `FindWalkableOffset(position, start_angle, radius, attempts, check_los, ignore_walls, customcheckfn, allow_water, allow_boats)`
* **Description:** Fans out from `position` in a circular arc to find the first walkable (above ground or on a platform), unobstructed position.
* **Returns:** `(offset, angle, deflected)` — offset vector, angle in radians, and whether deflection occurred.

### `FindSwimmableOffset(position, start_angle, radius, attempts, check_los, ignore_walls, customcheckfn, allow_boats)`
* **Description:** Like `FindWalkableOffset`, but searches for ocean/swimmable positions only.

### `FindCharlieRezSpotFor(inst)`
* **Description:** Finds a safe spawn location for Charlie (wilderness) resurrection, preferring night light sources and avoiding holes.

### `FindPickupableItem(owner, radius, furthestfirst, positionoverride, ignorethese, onlytheseprefabs, allowpickables, worker, extra_filter, inventoryoverride)`
* **Description:** Finds an item (or pickable) near `owner` that can be picked up and stored in inventory.
* **Returns:** `(item, ispickable)` — item instance and whether it's pickable.

### `CanEntitySeePoint(inst, x, y, z)`
* **Description:** Checks if `inst` can visually see a point (lighting, storm/miasma, inked state).
* **Returns:** `true` or `false`.

### `CanEntitySeeTarget(inst, target)`
* **Description:** Convenience wrapper for `CanEntitySeePoint(inst, target.Transform:GetWorldPosition())`.

### `SpringCombatMod(amount, forced)`
* **Description:** Applies springtime combat modifier to damage (increases it).
* **Returns:** Modified damage amount.

### `SpringGrowthMod(amount, forced)`
* **Description:** Applies springtime growth modifier to timers (reduces duration).

### `ErodeAway(inst, erode_time)`
* **Description:** Animates entity erosion and removes it after `erode_time`.
* **Parameters:** `erode_time` (number) — Duration in seconds.

### `ErodeCB(inst, erode_time, cb, restore)`
* **Description:** Erodes entity, invokes callback `cb` when done; optionally restores erosion state.

### `ApplySpecialEvent(event)`
* **Description:** Overrides world special event (e.g., `HALLOWEEN`, `WINTER`) and decrements tech levels if inactive.
* **Parameters:** `event` (string) — Event name or `"default"`.

### `ApplyExtraEvent(event)`
* **Description:** Adds an extra special event to the active world events list.

### `RegisterInventoryItemAtlas(atlas, imagename)`
* **Description:** Registers a custom inventory image atlas for a given imagename; caches lookup.
* **Returns:** Nothing.

### `GetInventoryItemAtlas(imagename)`
* **Description:** Gets the atlas path for a given inventory image name.
* **Returns:** Atlas path string, or `nil`.

### `RegisterGlobalMapIcon(inst)`
* **Description:** Adds `inst` to the global map icon registry (`GlobalMapIconsDB`), enabling fast iteration and cleanup.

### `UnregisterGlobalMapIcon(inst)`
* **Description:** Removes `inst` from `GlobalMapIconsDB` and cleans up listeners.

### `DeclareLimitedCraftingRecipe(recipename)`
* **Description:** Registers a limited crafting recipe for network serialization and tracking; increments count and builds lookup map.

## Events & listeners
- `UnregisterGlobalMapIcon` listens to `"onremove"` event on registered global map icons to auto-cleanup.  
- `ApplySpecialEvent` and `ApplyExtraEvent` modify global variables (`WORLD_SPECIAL_EVENT`, `WORLD_EXTRA_EVENTS`, `SPECIAL_EVENTS`) and interact with `TECH` and `CRAFTINGSTATION_LIMITED_RECIPES` state.  
- `ApplyEvent` (internal) checks `SPECIAL_EVENTS` and sets `TECH[k].SCIENCE = 0` for matched inactive events.