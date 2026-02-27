---
id: pearldecorationscore
title: Pearldecorationscore
description: Calculates and manages the pearl decoration score for a hermit crab's home based on nearby decorations, terrain, and game state.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: dcc5440f
---

# Pearldecorationscore

## Overview
The `PearlDecorationScore` component dynamically evaluates and updates the decoration score for a hermit crab’s pearl-based home. It continuously monitors surrounding entities and terrain within a configurable radius, assigning points based on decoration types (e.g., flowers, bee boxes, furniture), land tile composition, and special conditions like seasonal events or trophy fish collection. It manages enabling/disabling state, persistence, and notifies the world of score changes via events.

## Dependencies & Tags
- Relies on `TUNING` constants for scoring values (e.g., `HERMITCRAB_DECOR_*`).
- Registers `TheSim:RegisterFindTags` with exclusion tags: `{"FX", "DECOR", "NOCLICK", "INLIMBO", "player", "outofreach"}` and inclusion tags: `{"inspectable", "dock_woodpost"}`.
- Listens to events: `onterraform`, `ms_hermitcrab_relocated`, `teleported`, `teleport_move`.
- Pushes events: `pearldecorationscore_updatestatus`, `ms_updatepearldecorationscore_tiles`, `pearldecorationscore_evaluatescores`, `pearldecorationscore_updatescore`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | `boolean` | `false` | Indicates whether the scoring is active. |
| `score` | `number` | `0` | Current total decoration score (clamped to `[0, HERMITCRAB_DECOR_MAX_SCORE]`). |
| `tile_score` | `number` | `0` | Score contribution from land tile types. |
| `scoring_radius` | `number?` | `nil` | Dynamic radius (in world units) used for entity lookups, calculated from occupied grid. |
| `tiles_num` | `number` | `TUNING.HERMITCRAB_DECOR_MAX_TILE_SPACE` | Max number of tiles the hermit crab can occupy (hardcoded in tuning). |
| `tiles` | `object?` | `nil` | Grid representation of occupied tiles (from `GetHermitCrabOccupiedGrid`). |
| `cached_coords` | `table` | `{ x = -1, z = -1 }` | Stores previous tile coordinates to detect grid changes. |
| `force_update` | `boolean` | `true` | Flag to trigger immediate full score recalculation on next `OnUpdate`. |
| `update_time` | `number` | `TUNING.HERMITCRAB_DECOR_UPDATE_TIME` | Countdown timer (in seconds) before next automatic update. |
| `tile_scores` | `table` | `table` mapping `WORLD_TILES.*` to score values | Map of tile types to per-tile scores (e.g., `SHELLBEACH` = 15/100 tiles). |
| `tile_scores_count` | `table` | `{}` | Current count of each tile type within the occupied grid. |
| `_cache_watertree_coverage` | `table` | `{}` | Cache storing water tree coverage counts per entity. |
| `unique_decor_scored` | `table` | `{}` | Temporary map tracking scored unique decorations (reset per update). |
| `unique_trophy_fish` | `table` | `{}` | Temporary map tracking highest-scoring unique trophy fish (reset per update). |
| `decor_data` | `table` | Pre-populated with per-decoration-type min/max scores | Metadata for each `PEARL_DECORATION_TYPES.*`, including `max_score` or `min_score`. |
| `last_decor_scores` | `table` | `{}` | Snapshot of decoration scores from the last evaluation. |
| `decor_fns` | `table` | Array of `{ key, fn }` function definitions | List of scoring rules with entity type filters and point calculation functions. |

## Main Functions

### `Enable(on_load)`
* **Description:** Activates the scoring component. Starts entity updates, initializes tag-based entity search, registers listeners for world changes (terraform/relocation), and triggers initial score evaluation. Optionally bypasses immediate full update on load.
* **Parameters:** `on_load` (boolean) — If true, only calls `UpdateOccupiedGrid()` instead of `ForceUpdate()`+`OnUpdate(0)`.

### `Disable()`
* **Description:** Deactivates scoring. Stops updates, removes event listeners, and triggers a final score update + status event.

### `ForceUpdate()`
* **Description:** Sets `force_update = true` to trigger a full recalculation on the next `OnUpdate()` call.

### `UpdateOccupiedGrid()`
* **Description:** Recalculates the grid of occupied tiles based on the hermit crab’s current position and updates tile counts. Handles tile changes (e.g., from terraforming) and updates `tile_scores_count`. Recomputes `scoring_radius`.

### `UpdateTileScore()`
* **Description:** Computes the current tile score by multiplying per-tile scores with their counts and stores the result in `tile_score`.

### `GetWaterTreeNumTileCoverage(ent)`
* **Description:** Calculates how many tiles within a 5-tile radius of a water tree are within the scoring radius. Caches results per entity to avoid repeated computation.

### `OnUpdate(dt)`
* **Description:** Core scoring logic. Performs full evaluation if `force_update` is true or `update_time` ≤ 0. Finds nearby entities within `scoring_radius`, applies decoration rules in `decor_fns`, accumulates points per category, handles special cases (e.g., ornaments, pets, fishing markers), checks trophy fish collection, and updates the total score. Resets temporary caches.

### `LongUpdate(dt)`
* **Description:** Decrement `update_time` each frame while enabled, allowing for throttled full evaluations.

### `GetLastDecorScore(key)`
* **Description:** Returns the score for a given decoration type (`key`) from the most recent evaluation.

### `GetLastDecorScorePercentToMax(key)`, `GetLastDecorScorePercentToMin(key)`
* **Description:** Computes the ratio of the current decoration score to its defined max or min, respectively. Returns `nil` if not applicable.

### `GetDecorScoreLevel(key, reverse)`
* **Description:** Returns `"HIGH"`, `"MED"`, or `"LOW"` based on score progress. If `reverse=true`, computes progress toward minimum score (inverted semantics); otherwise toward maximum.

### `SetScore(score)`
* **Description:** Sets the total score (clamped to `[0, HERMITCRAB_DECOR_MAX_SCORE]`). Triggers `pearldecorationscore_updatescore` event if changed.

### `GetScore()`
* **Description:** Returns the current total score.

### `OnSave()`
* **Description:** Returns serialization data `{ enabled, score }` if non-default; otherwise `nil`.

### `OnLoad(data)`, `LoadPostPass(newents, data)`
* **Description:** Loads persisted data: re-enables scoring and sets score on load. `LoadPostPass` re-issues status/score events for clients.

### `OnRemoveFromEntity()`, `OnRemoveEntity()`, `FlagForConstructionRemoval()`
* **Description:** Disables the component when the entity is removed (unless flagged for construction removal).

### `OnEntityWake()`, `OnEntitySleep()`
* **Description:** Manages entity update state based on world wake/sleep events.

### `GetDebugString()`
* **Description:** Returns a formatted debug string: `"enabled: <bool>, score: <value>"`.

## Events & Listeners
- **Listeners:**
  - `onterraform` → Updates tile counts and grid data.
  - `ms_hermitcrab_relocated`, `teleported`, `teleport_move` → Clears water tree cache and forces update.
- **Events pushed:**
  - `pearldecorationscore_updatestatus`
  - `ms_updatepearldecorationscore_tiles`
  - `pearldecorationscore_evaluatescores`
  - `pearldecorationscore_updatescore`