---
id: hullhealth
title: Hullhealth
description: Manages boat hull integrity by tracking and processing hull damage from collisions, leaks, and degradation over time.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 96c2672f
---

# Hullhealth

## Overview
The `HullHealth` component governs the structural integrity of boats in Don't Starve Together. It calculates and applies hull damage from boat collisions, leak states (small/medium leaks), and self-degradation (e.g., over time or due to environmental conditions). It manages leak indicators, coordinates with bumper colliders, and integrates with the health component to reduce boat durability accordingly.

## Dependencies & Tags
- **Dependencies**:  
  - Requires `inst.components.health`  
  - Requires `inst.components.transform`  
  - Requires `inst.components.boatphysics` (for velocity and collision handling)  
  - Requires `inst.components.walkableplatform` (for player notifications on new leaks)  
  - Uses `inst.components.boatring` (for bumper interaction and damage absorption)  
- **Tags added/removed**:  
  - Adds `is_leaking` tag when hull damage from leaks is present.  
  - Utilizes `boat_health_buffer` tag during damage multiplier evaluation.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `leak_point_count` | `number` | `6` | Number of fixed leak points around the hull. |
| `leak_radius` | `number` | `2.5` | Base radial distance for leak spawn position. |
| `leak_radius_variance` | `number` | `1` | Variance (±) applied to leak spawn radius. |
| `leak_angle_variance` | `number` | `math.pi / 8` | Variance (±) applied to leak angle for randomness. |
| `leak_damage` | `table` | `{0,0,0,0,0,0}` | Array storing current accumulated damage per leak point. |
| `leak_indicators` | `table` | `{nil,...}` | Array of `boat_leak` prefabs instantiated for visible leak effects. |
| `leak_indicators_dynamic` | `table` | `{}` | Placeholder for dynamic leak sources (not actively used in current code). |
| `small_leak_dmg` | `number` | `TUNING.BOAT.SMALL_LEAK_DMG_THRESHOLD` | Damage threshold to trigger a small leak indicator. |
| `med_leak_dmg` | `number` | `TUNING.BOAT.MED_LEAK_DMG_THRESHOLD` | Damage threshold to upgrade a leak to medium. |
| `max_health_damage` | `number` | `TUNING.BOAT.MAX_HULL_HEALTH_DAMAGE` | Multiplier for max hull damage per collision. |
| `hull_dmg` | `number` | `0` | *Unused in current implementation* |
| `selfdegradingtime` | `number` | `0` | Interval (seconds) between self-degradation damage ticks. |
| `currentdegradetime` | `number` | `0` | Accumulated time for self-degradation tracking. |
| `degradefx` | `string or nil` | `nil` | Prefab name for debris particles during degradation (not initialized). |

## Main Functions

### `GetDamageMult(cat)`
* **Description:** Returns a damage reduction multiplier for a given damage category (`"collide"` or `"degradedamage"`), based on adjacent `boat_health_buffer` entities (e.g., pirate hats or platforms). If none are found or the buffer doesn’t apply, returns `1`.
* **Parameters:**  
  - `cat`: `string` — the damage category type (`"collide"` or `"degradedamage"`).

### `UpdateHealth()`
* **Description:** Calculates total hull damage per tick from active leak indicators (`small_leak` or `med_leak`), then applies that damage to the boat’s health component. Also toggles the `is_leaking` tag.
* **Parameters:** None.

### `GetLeakPosition(idx)`
* **Description:** Computes a randomized world position (x, z) for a leak point on the hull, relative to the boat’s center. Uses angle and radius variance.
* **Parameters:**  
  - `idx`: `number` — the 1-based leak point index (1 to `leak_point_count`).

### `GetLeakAngle(idx)`
* **Description:** Returns the base (non-randomized) angle in radians for a given leak point, evenly distributed around the hull (`TWOPI` divided by `leak_point_count`).
* **Parameters:**  
  - `idx`: `number` — the 1-based leak point index.

### `RefreshLeakIndicator(leak_idx)`
* **Description:** Spawns or updates a `boat_leak` visual indicator at a given leak point if accumulated damage meets thresholds. Does not spawn if the hull is leakproof. Returns `true` if a leak indicator was created or updated.
* **Parameters:**  
  - `leak_idx`: `number` — 1-based index of the leak point.

### `OnCollide(data)`
* **Description:** Processes collision data (e.g., from boatphysics), determines the closest leak point to the impact location, and applies hull damage and/or BUMPER-specific damage (if equipped). Includes logic to ignore grazing collisions and delegate damage to bumper colliders.
* **Parameters:**  
  - `data`: `table` — collision event payload containing world impact position, velocity, hit normal, and other physics data.

### `SetSelfDegrading(stat)`
* **Description:** Enables or disables self-degradation (time-based hull damage). Starts/stops component update loop and toggles the `is_leaking` tag.
* **Parameters:**  
  - `stat`: `number` — duration (seconds) between degradation ticks; set to `0` to disable.

### `OnUpdate(dt)`
* **Description:** Handles periodic self-degradation logic: accumulates time, spawns debris particles, and applies `1` hull damage when degradation threshold is reached (modified by damage multipliers).
* **Parameters:**  
  - `dt`: `number` — delta time since last frame.

### `SpawnDegadeDebris()`
* **Description:** Spawns a debris particle effect (if `degradefx` is set) at a random position around the boat during degradation.
* **Parameters:** None.

### `OnSave()`
* **Description:** Serializes the current state of leak indicators (damage, state, repaired timeout) for save data.
* **Parameters:** None.  
* **Returns:** `table?` — a `{ boat_leaks = [...] }` table or `nil` if no active leaks.

### `LoadPostPass(newents, data)`
* **Description:** Restores leak state from saved data, re-creating leak indicators with original damage and state.
* **Parameters:**  
  - `newents`: `table?` — unused (reserved for cross-entity references).  
  - `data`: `table?` — saved data containing `boat_leaks`.

## Events & Listeners
- **Listens for `"on_collide"`** → calls `HullHealth:OnCollide(data)`  
- **Listens for `"onremove"`** (on leak indicators) → removes entry from `leak_indicators` array  
- **Triggers `"boatcollision"`** on bumper entities when they absorb collision damage  
- **Triggers `"on_standing_on_new_leak"`** on players when a new leak is spawned under them  
- **Triggers `"is_leaking"` tag updates** via `AddOrRemoveTag` during `UpdateHealth()` and `OnUpdate()`