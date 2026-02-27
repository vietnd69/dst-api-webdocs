---
id: mutatedbuzzardcircler
title: Mutatedbuzzardcircler
description: This component controls the circling behavior and migration logic for a mutated buzzard anchor entity, managing flight patterns around a target and interaction with flares and corpses.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 93ebb679
---

# MutatedBuzzardCircler

## Overview
The `MutatedBuzzardCircler` component orchestrates the dynamic circling and migration behavior of a mutated buzzard anchor entity in DST. It positions the entity in orbit around a target (typically a creature), adjusts flight characteristics based on proximity and sine-based modulation, listens for flare detonations to trigger buzzard descent/creation, and handles migration node synchronization and corpse-based landing logic.

## Dependencies & Tags
- Listens to `"onremove"` on its own instance.
- Listens to `"miniflare_detonated"` and `"megaflare_detonated"` events on `TheWorld`.
- Assumes `self.inst.buzzard` exists (expects a `buzzard` entity as a child/reference).
- Relies on the following world components: `migrationmanager`, `mutatedbuzzardmanager`, `corpsepersistmanager`.
- Uses utility functions: `IsValidToEnterNode`, `IsValidCorpse`, `GetCorpseRadius`, `FindWalkableOffset`, `GetSineVal`, `Lerp`, `ReduceAngle`, `math.clamp`, `TWOPI`, `PI`, `TUNING.BUZZARDSPAWNER_FLARE_HIT_DIST_SQ`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The anchor entity this component controls. |
| `_migrationmanager` | `MigrationManagerComponent` | — | Cached reference to `TheWorld.components.migrationmanager`. |
| `_mutatedbuzzardmanager` | `MutatedBuzzardManagerComponent` | — | Cached reference to `TheWorld.components.mutatedbuzzardmanager`. |
| `scale` | `number` | `1` | Current scale factor for the anchor entity. |
| `speed` | `number` | `0` (assigned at runtime) | Current angular speed multiplier for orbital motion. |
| `circle_target` | `Entity` or `nil` | `nil` | The target entity around which the anchor orbits. |
| `min_speed` | `number` | `5` | Minimum speed multiplier (raw). |
| `max_speed` | `number` | `7` | Maximum speed multiplier (raw). |
| `min_dist` | `number` | `8` | Minimum orbit radius (used in `Start()`). |
| `max_dist` | `number` | `12` | Maximum orbit radius (used in `Start()`). |
| `min_scale` | `number` | `8` | Minimum scale (raw; scaled down by `* .1` for final use). |
| `max_scale` | `number` | `12` | Maximum scale (raw; scaled down by `* .1` for final use). |
| `sine_mod` | `number` | `(10 + math.random() * 20) * .001` | Modulation frequency for sine-based animation/acceleration. |
| `sine` | `number` | `0` | Current sine value, updated per frame. |
| `update_target_pos_cooldown` | `number` | `0` | Timer before re-evaluating migration node and corpse checks. |
| `last_valid_migration_node` | `MigrationNode` or `nil` | `nil` | Last validated migration node associated with the target. |
| `miniflare_detonated_cb` | `function` | — | Callback for mini-flare detonation event. |
| `megaflare_detonated_cb` | `function` | — | Callback for mega-flare detonation event. |

## Main Functions
### `Start()`
* **Description:** Initializes the orbital motion: sets speed, distance, angle, and offset, positions the anchor entity in orbit, registers it for per-frame updates, and updates the migration node.
* **Parameters:** None.

### `Stop()`
* **Description:** Stops per-frame updates and halts orbital motion.
* **Parameters:** None.

### `SetCircleTarget(tar)`
* **Description:** Assigns or clears the circling target. Updates the `_num_circling_buzzards` counter on the target, and sets up/cleans up event listeners for `onremove` and `death`.
* **Parameters:**  
  - `tar` (`Entity?`): The new target entity, or `nil` to stop circling.

### `GetSpeed()`
* **Description:** Returns the signed speed based on current direction (positive/negative indicates clockwise/counterclockwise motion).
* **Parameters:** None.

### `GetMinSpeed()` / `GetMaxSpeed()`
* **Description:** Return the minimum and maximum raw speed values (`5` and `7`, respectively).
* **Parameters:** None.

### `GetMinScale()` / `GetMaxScale()`
* **Description:** Return the scaled min/max scale values (`0.8` and `1.2`, respectively), calculated as `min_scale * .1`.
* **Parameters:** None.

### `GetDebugString()`
* **Description:** Returns a formatted string for debugging, showing current sine value and speed values.
* **Parameters:** None.

### `UpdateMigrationNode()`
* **Description:** Updates `last_valid_migration_node` if the migration node for `circle_target` exists and is close enough (< 1 unit) to the last valid node; otherwise calls `StoreInMigrationNode()`.
* **Parameters:** None.

### `FindCorpse(target)`
* **Description:** Searches for a valid corpse near the target (within radius 25) and returns one at random; returns `nil` if no valid corpses exist.
* **Parameters:**  
  - `target` (`Entity`): The center point to search around.

### `LandOnCorpse(corpse)`
* **Description:** Spawns and positions the buzzard on the given corpse with a glide state transition; stops the component and removes the anchor entity. Returns `true` on success.
* **Parameters:**  
  - `corpse` (`Entity`): The corpse to land on.

### `DropBuzzard()`
* **Description:** Spawns a buzzard corpse at a mid-point between the anchor and the circle target (or directly under the anchor if no target), removes the underlying buzzard entity, and stops the component.
* **Parameters:** None.

### `OnUpdate(dt)`
* **Description:** Main per-frame logic: validates target, updates migration node, checks for nearby corpses to land on, interpolates target position, modulates speed/scale/direction using sine and distance-based acceleration, and applies motion via physics velocity override.
* **Parameters:**  
  - `dt` (`number`): Delta time since last frame.

### `StoreInMigrationNode()`
* **Description:** If the anchor is valid for entering a migration node, removes it with `KillShadow()` (likely to preserve data in migration storage).
* **Parameters:** None.

### `OnEntitySleep()`
* **Description:** Called during entity sleep; ensures migration node is updated if target is valid, then stores the entity in migration.
* **Parameters:** None.

## Events & Listeners
- Listens to `"onremove"` on `self.inst`, calls `OnRemove`.
- Listens to `"miniflare_detonated"` on `TheWorld`, triggers `OnMiniFlareDetonated`.
- Listens to `"megaflare_detonated"` on `TheWorld`, triggers `OnMegaFlareDetonated`.
- Listens to `"onremove"` and `"death"` on `circle_target` (when assigned), triggering the internal `_ontargetremoved` callback.
- `OnMiniFlareDetonated` and `OnMegaFlareDetonated` push no events themselves but call `inst:KillShadow()` internally.