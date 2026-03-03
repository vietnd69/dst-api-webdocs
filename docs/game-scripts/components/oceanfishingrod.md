---
id: oceanfishingrod
title: Oceanfishingrod
description: Manages the ocean fishing rod's casting, targeting, tension tracking, and fish capture logic, acting as the central controller for ocean fishing interactions.
tags: [fishing, combat, network, physics, inventory]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 84b70443
system_scope: entity
---

# Oceanfishingrod

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`OceanFishingRod` is the core component for ocean fishing mechanics. It handles casting fishing tackle projectiles, tracking catchable targets, monitoring line tension, and managing the transition from casting to reeling and catching. It integrates with `equippable`, `container`, `oceanfishingtackle`, `oceanfishable`, `complexprojectile`, and `weighable` components, and sends gameplay metrics via `Stats.PushMetricsEvent`.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("oceanfishingrod")
inst.components.oceanfishingrod:SetDefaults(
    "oceanfishingbobber_default",
    TUNING.OCEANFISHING_TACKLE.BASE,
    TUNING.OCEANFISHING_TACKLE.BASE,
    {build = "lure_build", symbol = "lure_symbol", fns = {}}
)
-- Later, after equipping and entering a fishing state:
inst.components.oceanfishingrod:Cast(player, Vector3(target_x, target_y, target_z))
```

## Dependencies & tags
**Components used:** `equippable`, `container`, `oceanfishingtackle`, `oceanfishable`, `complexprojectile`, `weighable`, `locomotor`  
**Tags:** Adds `activeprojectile` temporarily to launched projectiles; listens for `onremove` events on target.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `target` | `Entity` or `nil` | `nil` | The current catchable entity or projectile; set via `SetTarget()`. |
| `line_dist` | number | `nil` | Distance from rod tip to target along the line, updated during reeling/unreeling. |
| `line_tension` | number | `0` | Current line tension normalized between `0` and `1`. |
| `line_slack` | number | `0` | Slack in the line, normalized between `0` and `1`. |
| `reeling_line_dist` | number | `0.75` | Amount of line reeled in per frame during reeling (before tension multiplier). |
| `unreel_resistance` | number | `0.1` | Fraction of unreeling rate lost to drag/resistance. |
| `fisher` | `Entity` or `nil` | `nil` | The entity performing the fishing action. |
| `casting_base` | table | *(nil until init)* | Base casting tuning parameters. |
| `casting_data` | table | *(nil until init)* | Combined casting parameters (base + bobber + lure). |
| `lure_data` | table | *(nil until init)* | Lure-specific tuning data. |
| `lure_setup` | table | *(nil until init)* | Lure animation and function definitions. |
| `projectile_prefab` | string | *(nil until init)* | Prefab name for the bobber/projectile. |
| `default_projectile_prefab` | string | *(nil until init)* | Fallback projectile prefab. |
| `default_lure_setup` | table | *(nil until init)* | Default lure animation setup. |

## Main functions
### `_LaunchCastingProjectile(source, targetpos, prefab)`
*   **Description:** Spawns and launches a casting projectile (e.g., bobber) toward the target position using trajectory physics.
*   **Parameters:**  
    *   `source` (`Entity`) — The entity performing the cast (e.g., player).  
    *   `targetpos` (`Vector3`) — Desired world position to land the projectile.  
    *   `prefab` (`string`) — Prefab name of the projectile to spawn.
*   **Returns:** `Entity` — The spawned projectile instance.
*   **Error states:** None documented; returns the projectile regardless.

### `_LaunchFishProjectile(projectile, srcpos, targetpos)`
*   **Description:** Launches a catchable fish entity (already spawned) from source to target position.
*   **Parameters:**  
    *   `projectile` (`Entity`) — The fish entity to launch.  
    *   `srcpos` (`Vector3`) — Starting world position.  
    *   `targetpos` (`Vector3`) — Ending world position for impact.
*   **Returns:** `Entity` — The launched fish entity.
*   **Error states:** None documented.

### `SetDefaults(default_projectile_prefab, default_casting_tuning, default_lure_tuning, default_lure_setup)`
*   **Description:** Initializes default casting and lure tuning parameters and calculates max cast distance for clients.
*   **Parameters:**  
    *   `default_projectile_prefab` (`string`) — Default projectile prefab.  
    *   `default_casting_tuning` (`table`) — Base casting data.  
    *   `default_lure_tuning` (`table`) — Base lure data.  
    *   `default_lure_setup` (`table`) — Lure animation and function setup.
*   **Returns:** Nothing.

### `Cast(fisher, targetpos)`
*   **Description:** Performs a cast action: caches tackle data, spawns a projectile, sets it as target, and starts component updates.
*   **Parameters:**  
    *   `fisher` (`Entity`) — The entity performing the cast.  
    *   `targetpos` (`Vector3`) — Desired world position to aim for.
*   **Returns:** `boolean` — `true` if target was successfully set, `false` otherwise.
*   **Error states:** Returns `false` if projectile spawn fails or target is `nil`.

### `Reel()`
*   **Description:** Attempts to reel in the line. Checks for snapping (high tension + previous high tension) and releases/fails accordingly.
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if reeling succeeded, `false` if line snapped or no target.
*   **Error states:** Returns `false` if `line_tension >= TUNING.OCEAN_FISHING.REELING_SNAP_TENSION` and tension was previously high.

### `SetTarget(new_target)`
*   **Description:** Updates the current fishing target, handles cleanup of previous target, and initializes line distance/tension tracking.
*   **Parameters:**  
    *   `new_target` (`Entity` or `nil`) — New entity to target, or `nil` to clear target.
*   **Returns:** Nothing.

### `UpdateTensionRating()`
*   **Description:** Calculates and updates `line_tension` and `line_slack` based on current distance between rod and target and `line_dist`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `OnUpdate(dt)`
*   **Description:** Game loop callback; updates tension, handles unreeling, checks for conditions like too far away or line slack, and stops fishing if needed.
*   **Parameters:**  
    *   `dt` (`number`) — Delta time in seconds.
*   **Returns:** Nothing.

### `CatchFish()`
*   **Description:** Converts a caught target into a fish projectile and launches it toward the fisher; triggers stats tracking and events.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StopFishing(reason, lost_tackle)`
*   **Description:** Terminates the current fishing session, triggers events, and logs statistics.
*   **Parameters:**  
    *   `reason` (`string`) — Termination reason (e.g., `"success"`, `"linesnapped"`, `"interrupted"`).  
    *   `lost_tackle` (`boolean`) — Whether tackle was lost.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a formatted debug string including current target, tension, slack, and attached tackle data.
*   **Parameters:** None.
*   **Returns:** `string` — Multi-line debug information for logging or UI.

### `GetExtraStaminaDrain()`
*   **Description:** Returns stamina drain amount contributed by the current lure.
*   **Parameters:** None.
*   **Returns:** `number` — Stamina drain per second (typically `0` or positive).

### `GetLureData()`
*   **Description:** Returns current lure tuning data.
*   **Parameters:** None.
*   **Returns:** `table` — `lure_data`.

### `GetLureFunctions()`
*   **Description:** Returns the function table defined in the current lure setup.
*   **Parameters:** None.
*   **Returns:** `table` — `lure_setup.fns`.

### `UpdateClientMaxCastDistance()`
*   **Description:** Computes and syncs maximum cast distance to clients using current tackle data.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `_CacheTackleData(bobber, lure)`
*   **Description:** Combines base, bobber, and lure tuning data into `casting_data`, sets projectile prefab, and updates `lure_data` and `lure_setup`.
*   **Parameters:**  
    *   `bobber` (`Entity` or `nil`) — Bobber item attached to rod.  
    *   `lure` (`Entity` or `nil`) — Lure item attached to rod.
*   **Returns:** Nothing.

### `CalcCatchDest(src_pos, dest_pos, catch_dist)`
*   **Description:** Computes a randomized catch destination within `catch_dist` of the target.
*   **Parameters:**  
    *   `src_pos` (`Vector3`) — Source position (e.g., target).  
    *   `dest_pos` (`Vector3`) — Destination position (e.g., fisher).  
    *   `catch_dist` (`number`) — Target catch distance offset.
*   **Returns:** `Vector3` — Calculated catch position.

## Events & listeners
- **Listens to:**  
  - `"onremove"` — On target entity removal (to clear `self.target`).  
- **Pushes:**  
  - `"newfishingtarget"` — To fisher when target changes.  
  - `"fishcaught"` — To fisher upon successful catch.  
  - `"oceanfishing_stoppedfishing"` — To fisher and target when fishing stops.  
  - `"fishing"` — Via `Stats.PushMetricsEvent`.
