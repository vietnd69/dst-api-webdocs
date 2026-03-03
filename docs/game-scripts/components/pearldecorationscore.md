---
id: pearldecorationscore
title: Pearldecorationscore
description: Calculates and maintains a scoring value for pearl-based decorations based on nearby entities and terrain tiles, used for Hermit Crab home aesthetics.
tags: [hermitcrab, decoration, scoring, world]
sidebar_position: 1
last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: dcc5440f
system_scope: world
---
# Pearldecorationscore

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`PearlDecorationScore` calculates and tracks a dynamic score representing the aesthetic quality of a Hermit Crab's inhabited area (the "Pearl Home"). It evaluates decor items (flowers, light posts, trophies, etc.), terrain tiles, spawners, and special conditions (e.g., water tree coverage, fishing markers, critter pets), enforcing min/max score caps per category. It is attached to the Hermit Crab's pearl home entity and updates periodically (or on demand) via the game's component update loop. Events like `onterraform`, `teleported`, and `ms_hermitcrab_relocated` trigger re-evaluation.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("pearldecorationscore")
inst.components.pearldecorationscore:Enable(false)
inst.components.pearldecorationscore:ForceUpdate()
print(inst.components.pearldecorationscore:GetScore())
```

## Dependencies & tags
**Components used:** `burnable`, `childspawner`, `container`, `dryingrack`, `furnituredecor`, `furnituredecortaker`, `hermitcrab_relocation_manager`, `petleash`, `pickable`, `spawner`, `trophyscale`, `workable`  
**Tags:** Adds/uses `"DECOR"`, `"NOCLICK"`, `"INLIMBO"`, `"inspectable"`, `"dock_woodpost"`, `"flower"`, `"beebox"`, `"hermitcrab_lantern_post"`, `"plant"`, `"thorny"`, `"pottedplant"`, `"critter"`, `"junk_pile"`, `"_inventoryitem"`, `"singingshell"`, `"frozen"`, `"vase"`, `"heavy"`, `"grave"`, `"abandoned"`, `"shadecanopysmall"`, `"shadecanopy"`, `"faced_chair"`, `"rocking_chair"`, `"hermithouse_laundry"`, `"wagstaff_item"`, `"hermithouse_winter_ornament"`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `enabled` | boolean | `false` | Whether scoring calculation is active. |
| `score` | number | `0` | Current total score (clamped to `HERMITCRAB_DECOR_MAX_SCORE`). |
| `tile_score` | number | `0` | Score contribution from land tiles. |
| `scoring_radius` | number | `nil` | Radius (in world units) around the pearl home used for entity searches. |
| `force_update` | boolean | `true` | Flag indicating an immediate recalculation is required. |
| `update_time` | number | `TUNING.HERMITCRAB_DECOR_UPDATE_TIME` | Countdown timer (in seconds) before next automatic update. |
| `tiles` | table or nil | `nil` | HermitCrabOccupiedGrid structure for tile-based scoring. |
| `unique_decor_scored` | table | `{}` | Tracks unique decor prefabs counted once per update. |
| `unique_trophy_fish` | table | `{}` | Tracks highest-scoring instance per fish prefab. |
| `last_decor_scores` | table | `{}` | Score breakdown per decoration type from the last full evaluation. |
| `collected_all_fish` | boolean | `false` | Set `true` if ≥ `UNIQUE_FISH_NEEDED` (16) unique trophy fish are scored. |

## Main functions
### `IsEnabled()`
* **Description:** Returns whether the scoring system is currently active.
* **Parameters:** None.
* **Returns:** `boolean` — `true` if enabled, otherwise `false`.

### `Enable(on_load)`
* **Description:** Activates scoring and registers event listeners (terrain changes, teleportation, relocation). Initializes required find tags if not already registered. Performs an initial full score evaluation unless `on_load` is `true`.
* **Parameters:** `on_load` (boolean, optional) — If `true`, skips immediate full update and only populates the tile grid.
* **Returns:** Nothing.
* **Error states:** Returns early if already enabled.

### `Disable()`
* **Description:** Deactivates scoring, unregisters all event listeners, and forces one final update to reset scores.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** Returns early if already disabled.

### `ForceUpdate()`
* **Description:** Marks the component for an immediate recalculation on the next `OnUpdate` call.
* **Parameters:** None.
* **Returns:** Nothing.

### `OnUpdate(dt)`
* **Description:** Main periodic update function. Performs the full scoring evaluation when `force_update` is `true` or `update_time` reaches zero. Computes contributions from tiles, entities, water trees, house ornaments, pets, fishing markers, and trophy fish, clamping and aggregating per-type scores per their min/max constraints. Fires `pearldecorationscore_evaluatescores` and `pearldecorationscore_updatescore` events.
* **Parameters:** `dt` (number) — Delta time in seconds since last frame.
* **Returns:** Nothing.

### `GetLastDecorScore(key)`
* **Description:** Retrieves the score contribution for a given decoration type from the last completed evaluation.
* **Parameters:** `key` (string) — Decoration type constant (e.g., `PEARL_DECORATION_TYPES.FLOWERS`).
* **Returns:** `number?` — Score value, or `nil` if not computed or key invalid.

### `GetLastDecorScorePercentToMax(key)`
* **Description:** Returns the ratio of the last score for the given key to its configured maximum score.
* **Parameters:** `key` (string) — Decoration type constant.
* **Returns:** `number?` — Value between `0.0` and `1.0` (or `nil` if no `max_score` is defined).

### `GetLastDecorScorePercentToMin(key)`
* **Description:** Returns the ratio of the last score for the given key to its configured minimum score.
* **Parameters:** `key` (string) — Decoration type constant.
* **Returns:** `number?` — Value between `0.0` and `1.0` (or `nil` if no `min_score` is defined).

### `GetDecorScoreLevel(key, reverse)`
* **Description:** Maps the last score for `key` to a difficulty or status level (`"LOW"`, `"MED"`, `"HIGH"`).
* **Parameters:**  
  - `key` (string) — Decoration type constant.  
  - `reverse` (boolean, optional) — If `true`, interpret scores relative to `min_score` (higher is *better*); otherwise relative to `max_score` (higher is *closer* to cap).
* **Returns:** `"LOW"`, `"MED"`, `"HIGH"`, or `nil` (if score is zero or out of range).

### `SetScore(score)`
* **Description:** Sets the total score (clamped to `0..HERMITCRAB_DECOR_MAX_SCORE`) and fires `pearldecorationscore_updatescore` if the value changed.
* **Parameters:** `score` (number) — Raw total score.
* **Returns:** Nothing.

### `GetScore()`
* **Description:** Returns the current total score.
* **Parameters:** None.
* **Returns:** `number` — Current total score.

### `GetWaterTreeNumTileCoverage(ent)`
* **Description:** Computes (and caches) how many tiles around a water tree entity are within the occupied pearl home grid.
* **Parameters:** `ent` (entity) — Water tree entity (`shadecanopysmall`/`shadecanopy` tags).
* **Returns:** `number` — Count of covered land tiles.

### `IsEntityWithin(ent)`
* **Description:** Checks if an entity is fully or partially within the occupied grid (accounting for overhangs).
* **Parameters:** `ent` (entity) — Entity to test.
* **Returns:** `boolean` — `true` if within the occupied area.

### `IsEntityUniqueDecor(ent)`
* **Description:** Determines if an entity is a unique, non-burning, non-burnt, non-abandoned bonus item (e.g., specific prefabs in `TUNING.HERMITCRAB_DECOR_UNIQUE_BOOSTS`).
* **Parameters:** `ent` (entity) — Entity to test.
* **Returns:** `boolean`.

### `IsEntityFlower(ent)`, `IsEntityBeeBox(ent)`, `IsEntityLightPost(ent)`, `IsEntityPickableBush(ent)`, `IsEntityMeatRack(ent)`, `IsEntityFacedChair(ent)`, `IsEntityTrophyFish(ent)`, `IsEntityPottedPlant(ent)`, `IsEntityDockPost(ent)`, `IsEntityDecorTaker(ent)`, `IsEntityJunk(ent)`, `IsEntitySpawner(ent)`
* **Description:** Boolean checks for specific decoration types. Each uses tag checks and optional component presence to validate eligibility.
* **Parameters:** `ent` (entity) — Entity to test.
* **Returns:** `boolean`.

### `OnSave()`
* **Description:** Returns a serializable table containing `enabled` and `score` if non-zero or enabled.
* **Parameters:** None.
* **Returns:** `table?` — `{ enabled = boolean, score = number }` or `nil`.

### `OnLoad(data)`
* **Description:** Restores state from saved data: enables if `data.enabled` is truthy, and sets `score`.
* **Parameters:** `data` (table) — Saved state from `OnSave`.
* **Returns:** Nothing.

### `LoadPostPass(newents, data)`
* **Description:** Fires UI update events after deserialization to notify listeners of status/score changes.
* **Parameters:**  
  - `newents` (table) — New entity list.  
  - `data` (table) — Loaded data.
* **Returns:** Nothing.

### `OnEntityWake()` / `OnEntitySleep()`
* **Description:** Starts/stops the component update loop based on entity activation state.
* **Parameters:** None.
* **Returns:** Nothing.

### `GetDebugString()`
* **Description:** Returns a human-readable debug string: `"enabled: {bool}, score: {score}"`.
* **Parameters:** None.
* **Returns:** `string`.

## Events & listeners
- **Listens to:** `onterraform` — updates tile counts on tile changes.  
- **Listens to:** `ms_hermitcrab_relocated`, `teleported`, `teleport_move` — resets water tree cache and forces update on Pearl relocation or teleport.  
- **Pushes:** `pearldecorationscore_evaluatescores` — fired after scoring calculation. Data: `{ home = self.inst }`.  
- **Pushes:** `pearldecorationscore_updatescore` — fired when total score changes. Data: `{ home = self.inst, score = number }`.  
- **Pushes:** `ms_updatepearldecorationscore_tiles` — fired after tile grid is updated.  
- **Pushes:** `pearldecorationscore_updatestatus` — fired when enable/disable state changes.
