---
id: hullhealth
title: Hullhealth
description: Manages hull integrity and leak damage for boats, handling collision impacts, degradation over time, and dynamic leak indicators.
tags: [boat, damage, physics, degradation, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 96c2672f
system_scope: physics
---

# Hullhealth

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`HullHealth` manages the structural integrity of boats by tracking hull damage, spawning and updating leak indicators (e.g., `boat_leak`), and applying periodic or impact-based damage to the boat's `health` component. It listens for collision events, calculates damage based on velocity and impact alignment, and supports self-degradation over time (e.g., from rot). The component integrates with `boatleak`, `health`, `boatphysics`, `boatring`, and `walkableplatform` components to deliver coherent boat behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("boat")
inst:AddComponent("health")
inst:AddComponent("boatphysics")
inst:AddComponent("walkableplatform")
inst:AddComponent("hullhealth")
inst.components.hullhealth:SetSelfDegrading(120) -- Degradation over 2 minutes
```

## Dependencies & tags
**Components used:** `health`, `boatleak`, `boatphysics`, `boatring`, `walkableplatform`  
**Tags added/removed:** Adds `is_leaking` when hull has active leaks; checks for `boat_health_buffer` on nearby entities to reduce damage.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `leak_point_count` | number | `6` | Number of discrete leak positions around the boat hull. |
| `leak_radius` | number | `2.5` | Base radius from center where leaks spawn. |
| `leak_radius_variance` | number | `1` | Random variance added to leak spawn radius. |
| `leak_angle_variance` | number | `math.pi / 8` | Random angular deviation for leak spawn positions. |
| `small_leak_dmg` | number | `TUNING.BOAT.SMALL_LEAK_DMG_THRESHOLD` | Damage threshold above which a leak becomes a "small leak". |
| `med_leak_dmg` | number | `TUNING.BOAT.MED_LEAK_DMG_THRESHOLD` | Damage threshold above which a leak becomes a "med_leak". |
| `max_health_damage` | number | `TUNING.BOAT.MAX_HULL_HEALTH_DAMAGE` | Maximum damage applied per impact collision. |
| `hull_dmg` | number | `0` | Total accumulated hull damage (unused in current implementation). |
| `selfdegradingtime` | number | `0` | Duration (in seconds) between self-degradation damage ticks. |
| `currentdegradetime` | number | `0` | Accumulator tracking time toward next degradation tick. |
| `leak_damage` | table[number → number] | `{0, 0, 0, 0, 0, 0}` | Damage points per leak position (index 1..6). |
| `leak_indicators` | table[number → Entity? | `nil` per slot] | Static leak prefab instances per position. |
| `leak_indicators_dynamic` | table | `{}` | Dynamic leak indicators (e.g., from external sources; not populated here). |

## Main functions
### `GetDamageMult(cat)`
* **Description:** Returns a damage multiplier based on proximity to entities with tag `boat_health_buffer` (e.g., Pirate Hat). Used to reduce hull or degradation damage.  
* **Parameters:** `cat` (string) — Either `"degradedamage"` or `"collide"` to select the multiplier category.  
* **Returns:** number — Multiplier (typically `TUNING.BOAT_HEALTH_BUFFER_MULT[cat]` if buffer entity is on platform, otherwise `1`).  
* **Error states:** Returns `1` if no matching buffer entity is found.

### `UpdateHealth()`
* **Description:** Applies periodic damage to `health` based on active leak states (small_leak: `0.5`, med_leak: `1.0` per leak). Also toggles `is_leaking` tag.  
* **Parameters:** None.  
* **Returns:** Nothing.  
* **Error states:** Returns early if the boat's `health` component reports `IsDead()`.

### `GetLeakPosition(idx)`
* **Description:** Computes a world-space X/Z position for a leak at a given index (`1` to `6`) using randomized radius and angle offsets.  
* **Parameters:** `idx` (number) — Leak index (1..6).  
* **Returns:** `number, number` — X and Z world coordinates.  

### `GetLeakAngle(idx)`
* **Description:** Returns the base angle (in radians) where a leak point is expected around the boat hull. Leak points are evenly distributed.  
* **Parameters:** `idx` (number) — Leak index (1..6).  
* **Returns:** number — Angle in range `[0, TWOPI)`.  

### `RefreshLeakIndicator(leak_idx)`
* **Description:** Ensures a `boat_leak` prefab exists at the specified leak index if damage exceeds thresholds; updates its state (small_leak / med_leak).  
* **Parameters:** `leak_idx` (number) — Leak index (1..6).  
* **Returns:** boolean — `true` if a leak indicator was created or updated; `false` otherwise (e.g., leakproof, insufficient damage).  

### `OnCollide(data)`
* **Description:** Processes collision data (typically from `on_collide` event) to apply hull damage. Calculates nearest leak index, applies minor leak damage for low-speed impacts, and significant hull damage for high-speed impacts. Respects bumpers (`boatring`) by delegating collision damage to them.  
* **Parameters:** `data` (table) — Collision event payload with `world_position_on_a_x`, `world_position_on_a_z`, `hit_dot_velocity`, `speed_damage_factor`, `other`.  
* **Returns:** Nothing.  

### `SetSelfDegrading(stat)`
* **Description:** Enables or disables self-degradation (e.g., rot). Controls periodic updates and `is_leaking` tag.  
* **Parameters:** `stat` (number) — Degradation interval in seconds (`> 0` to enable). Set to `0` to disable.  
* **Returns:** Nothing.  

### `OnUpdate(dt)`
* **Description:** Called periodically during degradation. Accumulates time, spawns debris FX occasionally, and applies `-1` hull damage every `selfdegradingtime` seconds (adjusted by multiplier).  
* **Parameters:** `dt` (number) — Delta time since last frame.  
* **Returns:** Nothing.  

### `OnSave()`
* **Description:** Serializes active static leak indicators (including damage, state, and repair timeout) for saving.  
* **Parameters:** None.  
* **Returns:** `table?` — Returns `{ boat_leaks = {...} }` if leaks exist; `nil` otherwise. Each leak entry contains `leak_point`, `leak_damage`, `leak_state`, and `repaired_timeout`.  

### `LoadPostPass(newents, data)`
* **Description:** Restores leak state after a save/load cycle using serialized leak data. Recreates leak indicators, sets their state, and restores repair timers.  
* **Parameters:**  
  * `newents` (table) — Table of restored entities.  
  * `data` (table?) — Saved data from `OnSave()`.  
* **Returns:** Nothing.  

## Events & listeners
- **Listens to:**  
  * `on_collide` — Triggers `OnCollide` to process impact damage.  
  * `onremove` (on leak prefabs) — Clears `leak_indicators` reference when a leak is removed.  
- **Pushes:**  
  *None directly.* However, `OnCollide` may push `boatcollision` to bumpers and `on_standing_on_new_leak` to players when a new leak is created. Also triggers `healthdelta` indirectly via `health:DoDelta(...)`.
