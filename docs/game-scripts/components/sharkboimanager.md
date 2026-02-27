---
id: sharkboimanager
title: Sharkboimanager
description: Manages the lifecycle of Sharkboi arena events—including creation, expansion, shrinking, boss spawning, fishing interactions, and cleanup—within the DST world.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 4308bdfc
---

# Sharkboimanager

## Overview
The `sharkboimanager` component orchestrates the dynamic Sharkboi arena system in Don't Starve Together. It is responsible for spawning and managing the frozen arena tiles, the fishing hole, Sharkboi entities, and seasonal size adjustments. It operates exclusively on the master simulation and coordinates the full arena lifecycle: from detection of suitable ocean locations and arena creation during winter, through ice formation and fishing mechanics, to boss spawning upon sufficient fish catches, and finally cleanup and cooldown management.

## Dependencies & Tags
- **Component Usage**: Requires `TheWorld.net.components.sharkboimanagerhelper` for network state synchronization.
- **Tags Used**:
  - `{"boat"}` — for detecting boats to break during arena growth.
  - `{"_combat"}` and `"INLIMBO", "notarget", "noattack", "flight", "invisible", "playerghost", "epic"` — for targeting entities to knock back on boss spawn.
- **Entity Tags Modified**:
  - Sharkboi and fishing hole entities receive `_sbm_listening` to avoid duplicate event subscriptions.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the component's owner entity (typically `TheWorld` or the networked world entity). |
| `arena` | `table?` | `nil` | Holds current arena state data including `origin`, `radius`, `state`, `caughtfish`, `sharkbois`, `fishinghole`, and temporary fields like `desiredradius` and `pauseshrink_hack`. |
| `fishingplayertasks` | `table` | `{}` | Tracks active fishing tick tasks per player (`player → TaskHandle`). Not persisted across saves. |
| `defaultfishprefab` | `string` | `"oceanfish_medium_2"` | Default fish prefab used when fish type cannot be determined from the school spawner. |
| `MAX_ARENA_SIZE` | `float` | `6 * TILE_SCALE` | Maximum arena radius (in tile units), smaller than `GOOD_ARENA_SQUARE_SIZE`. |
| `MAX_ARENA_SIZE_RADIUS_BIAS` | `float` | `-0.5` | Tile-based offset used in cache generation to shrink effective arena radius slightly. |
| `MIN_ARENA_SIZE` | `float` | `2.5 * TILE_SCALE` | Minimum arena radius (in tile units). |
| `TILEOFFSET_CACHE` | `table` | Built by `CreateTileOffsetCache(MAX_ARENA_SIZE)` | Precomputed list of tile offsets within `MAX_ARENA_SIZE`, sorted by increasing radial distance. |
| `STATES` | `table` | `{ UNDEFINED=0, CREATINGARENA=1, CREATEDARENA=2, BOSSSPAWNED=3, BOSSFIGHTING=4, CLEANUP=5 }` | Arena state definitions; state values progress monotonically. |

## Main Functions

### `CreateTileOffsetCache(r)`
* **Description**: Generates and caches tile offsets within radius `r`, sorted by distance (smallest first), for efficient arena iteration.
* **Parameters**: `r` (`float`) — Arena radius (in tile units).

### `ForEachTileInBetween(min_radius, max_radius, fn)`
* **Description**: Iterates over all tiles within the arena lying between `min_radius` and `max_radius` (inclusive/exclusive) and invokes `fn(self, x, y, z)` at each valid position.
* **Parameters**:  
  `min_radius` (`float`) — Inner radius.  
  `max_radius` (`float`) — Outer radius.  
  `fn` (`function`) — Callback to execute at each tile.

### `FindWalkableOffsetInArena(sharkboi)`
* **Description**: Finds the first walkable tile position on the arena surface, starting from the arena edge and moving inward. If `sharkboi` is provided, only tiles currently occupied by that sharkboi are considered.
* **Parameters**:  
  `sharkboi` (`Entity?`) — Optional sharkboi instance to restrict search.

### `GetDesiredArenaRadius()`
* **Description**: Computes the target arena radius based on current state, season, shrinking/growing rules, and the `desiredradius` flag.
* **Parameters**: None.

### `PauseArenaShrinking_Hack()`
* **Description**: Temporarily halts arena shrinking for ~85 frames (≈1.4s) by setting `pauseshrink_hack` and scheduling a delayed reset.
* **Parameters**: None.

### `IsPointInArena(x, y, z)`
* **Description**: Returns `true` if the point `(x, y, z)` lies within the arena's circular boundary (with `SQRT2` padding) *and* is walkable visual ground.
* **Parameters**:  
  `x`, `y`, `z` (`float`) — World coordinates.

### `SetArenaState(state)`
* **Description**: Advances the arena to a new state (values must increase monotonically). Triggers side effects per state, such as arena finishing (`CREATEDARENA`), boss spawning (`BOSSSPAWNED`), fishing hole removal and shrinking start (`BOSSFIGHTING`), and cleanup (`CLEANUP`).
* **Parameters**:  
  `state` (`number`) — A value from `self.STATES`.

### `SetDesiredArenaRadius(radius)`
* **Description**: Updates the arena radius to `radius` (clamped to `[0, MAX_ARENA_SIZE]`) and syncs it to network helpers via `UpdateNetvars`.
* **Parameters**:  
  `radius` (`float?`) — New arena radius.

### `StartShrinking()` / `StopShrinking()`
* **Description**: Begins/terminates periodic arena shrinking task that reduces radius by `TUNING.SHARKBOI_ARENA_SHRINK_DISTANCE` each tick (`TUNING.SHARKBOI_ARENA_SHRINK_TICK_TIME`).
* **Parameters**: None.

### `DoShrink()`
* **Description**: Performs one shrinking step: removes ice tiles between old and new radius and updates radius.
* **Parameters**: None.

### `StartCleanup()` / `StopCleanup()`
* **Description**: Begins/terminates periodic cleanup task (similar to shrinking) that reduces arena radius to zero and pushes `"ms_cleanupticksharkboiarena"` events.
* **Parameters**: None.

### `DoCleanup()`
* **Description**: Advances arena toward full cleanup; if radius reaches 0, triggers `ForceCleanup()`.
* **Parameters**: None.

### `TryToMakeArenaBig()`
* **Description**: If arena size is below `MAX_ARENA_SIZE` and no players are nearby, expands the arena (spawns ice tiles, breaks overhanging boats, places decorations, sets radius to `MAX_ARENA_SIZE`).
* **Parameters**: None.

### `TryToMakeArenaSmall()`
* **Description**: Initiates shrinking arena to `MIN_ARENA_SIZE` if current state allows (`CREATEDARENA` or `BOSSSPAWNED`).
* **Parameters**: None.

### `CooldownArena()`
* **Description**: Starts a cooldown timer (duration `TUNING.SHARKBOI_ARENA_COOLDOWN_DAYS`) after which `ForceCleanup()` runs and arena is reset.
* **Parameters**: None.

### `ForceCleanup()`
* **Description**: Terminates all timers, destroys all ice tiles, removes fishing hole and all sharkboi entities, and pushes `"ms_cleanedupsharkboiarena"`.
* **Parameters**: None.

### `GetFishPrefab()`
* **Description**: Returns the appropriate fish prefab for the arena, using `schoolspawner` if available, otherwise `defaultfishprefab`.
* **Parameters**: None.

### `StopPlayerFishingTick(inst)`
* **Description**: Cancels the periodic fishing tick task for a given player.
* **Parameters**:  
  `inst` (`Entity`) — Player entity.

### `SpawnBoss()`
* **Description**: Completes boss (Sharkboi) spawning logic: catches any pending fish from rods, spawns a Sharkboi entity at the fishing hole (or arena center if hole missing), schedules knockback of nearby entities, and starts event listeners.
* **Parameters**: None.

### `StartEventListeners()`
* **Description**: Attaches event handlers to sharkboi entities and fishing hole for attack, removal, and fishing start events.
* **Parameters**: None.

### `CreateSharkBoi(x, y, z)`
* **Description**: Spawns and positions a new `sharkboi` prefab at the given location and enters its `"spawn"` state.
* **Parameters**:  
  `x`, `y`, `z` (`float`) — World coordinates.

### `CreateFishingHole(x, y, z)`
* **Description**: Spawns and positions a new `icefishing_hole` prefab.
* **Parameters**:  
  `x`, `y`, `z` (`float`) — World coordinates.

### `PlaceOceanArenaAtPosition(x, y, z)`
* **Description**: Initializes a new arena at the specified coordinates: creates ice tiles, transitions to `CREATEDARENA`, and schedules `ArenaFinishCreating()`.
* **Parameters**:  
  `x`, `y`, `z` (`float`) — Arena center coordinates.

### `TryToPlaceOceanArena()`
* **Description**: Attempts to find a valid ocean arena location and spawns the arena there if successful.
* **Parameters**: None.

### `FindAndPlaceOceanArenaOverTime()`
* **Description**: Schedules repeated arena placement attempts if no arena exists and good points aren’t ready; triggers placement once points are available.
* **Parameters**: None.

### `LongUpdate(dt)`
* **Description**: Adjusts remaining cooldown time when paused during world time changes.
* **Parameters**:  
  `dt` (`float`) — Delta time (seconds).

### `OnSave()`
* **Description**: Serializes the current arena state (origin, radius, state, fish count, cooldown, entities) for saving.
* **Parameters**: None. Returns: `data`, `ents`.

### `OnLoad(data)`
* **Description**: Restores arena state from saved data, including deferred initialization and state reconstruction.
* **Parameters**:  
  `data` (`table?`) — Saved arena data.

### `LoadPostPass(newents, savedata)`
* **Description**: Resolves entity GUIDs after world load (fishing hole, sharkbois), handles legacy `sharkboi` field, and creates new fishing hole if needed afterboss spawn in winter.
* **Parameters**:  
  `newents` (`table`) — Map of GUID → `{entity, ...}`.  
  `savedata` (`table`) — Saved arena entity data.

### `GetDebugString()`
* **Description**: Returns a human-readable debug string describing arena state, entity counts, cooldown, and radius.
* **Parameters**: None.

## Events & Listeners
- **Listens For**:
  - `"worldmapsetsize"` on `TheWorld` → triggers `InitializeSharkBoiManager`.
  - `"startfishinginvirtualocean"` on `fishinghole` → begins fishing tick task for player.
  - `"oceanfishing_stoppedfishing"` and `"fishcaught"` on player → cleanup fishing tasks and handle fish catch.
  - `"attacked"` and `"onremove"` on sharkboi → track combat engagement and boss removal.
  - `"season"` world state → triggers seasonal arena resizing via `OnSeasonChange`.

- **Emits**:
  - `"ms_cleanupticksharkboiarena"` during arena cleanup.
  - `"ms_cleanedupsharkboiarena"` after full arena cleanup.
  - `"ms_spawnedsharkboiarena"` after arena finishes creation.