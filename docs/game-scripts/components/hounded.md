---
id: hounded
title: Hounded
description: Manages the scripted hound attack system, including scheduling waves, warning phases, spawning hounds near target players, and handling seasonal variants and player-specific delays.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: aa3b57c8
---

# Hounded

## Overview
This component orchestrates hound attacks in Don't Starve Together. It schedules waves based on world age and player count, manages warning phases with timed sound/speech cues, calculates optimal spawn positions and group-based hound distribution (including adjustments for player proximity), and handles persistent state across saves. It operates exclusively on the master simulation and interacts with the world map, player entities, and combat systems.

## Dependencies & Tags
- `inst:AddComponent("health")` is not required (component is self-contained).
- The component relies on: `SourceModifierList` (from `util/sourcemodifierlist`).
- It uses the `TheWorld` singleton for map features (holes, vaults, seasons, etc.) and `AllPlayers`.
- Tags added/removed: None explicitly applied by this component.

## Properties
| Property | Type | Default Value | Description |
|---|---|---|---|
| `inst` | `Entity` | `nil` (passed in) | The component's host entity (typically the World entity). |
| `max_thieved_spawn_per_thief` | `number` | `3` | Maximum extra hounds a hound thief may receive in addition to their regular share. |
| `_activeplayers` | `table` | `{}` (private) | List of currently active player entities. |
| `_targetableplayers` | `table` | `{}` (private) | Maps GUID→location type (e.g., "land", "water") for each active player. |
| `_warning` | `boolean` | `false` (private) | Whether a warning phase is currently active. |
| `_timetoattack` | `number` | `0` (private) | Seconds remaining before an attack starts (may be negative). |
| `_warnduration` | `number` | `30` (private) | Duration in seconds of the warning phase. |
| `_attackplanned` | `boolean` | `false` (private) | Whether an attack wave is currently scheduled. |
| `_timetonextwarningsound` | `number` | `0` (private) | Countdown until the next warning sound is played. |
| `_announcewarningsoundinterval` | `number` | `4` (private) | Interval (in sound events) between warning speech announcements. |
| `_pausesources` | `SourceModifierList` | Initialized (private) | Tracks sources of pause affecting hound timing (e.g., from global pause). |
| `_spawnwintervariant` | `boolean` | `true` (private) | Whether winter variants (e.g., Ice Hounds) are enabled. |
| `_spawnsummervariant` | `boolean` | `true` (private) | Whether summer variants (e.g., Fire Hounds) are enabled. |
| `_spawndata` | `table` | `table` (private) | Config data for prefabs, spawn levels, delays, upgrade logic, speech, and sounds. |
| `_spawnmode` | `string` | `"escalating"` (private) | Current spawn behavior mode: `"escalating"`, `"constant"`, or `"never"`. |
| `_delayedplayerspawninfo` | `table` | `{}` (private) | Queued spawn info for players who left during a warning. |
| `_missingplayerspawninfo` | `table` | `{}` (private) | Save data for players who left *before* the attack completed. |
| `_wave_pre_upgraded` | `any` | `nil` (private) | State flag for wave upgrade checks (e.g., Worm Boss). |
| `_wave_override_settings` | `table` | `{}` (private) | Settings for custom wave overrides (e.g., Worm Boss difficulty). |

## Main Functions

### `PlanNextAttack()`
* **Description:** Schedules the next hound attack wave. Calculates delay and warning duration based on current escalation level (derived from average player age) and resets warning state. Handles early-quit resuming and empty-player cases.
* **Parameters:** None.

### `GetWaveAmounts()`
* **Description:** Computes how many hounds each player group receives for the current wave. Clusters players by proximity (GROUP_DIST=20), adjusts spawn counts based on group size (to avoid overwhelming clusters), and distributes spawns using weighted randomness based on player houndedtarget weight.
* **Parameters:** None.

### `ReleaseSpawn(target, upgrade)`
* **Description:** Spawns a hound near the specified player target (using `SummonSpawn`) and sets it to target that player.
* **Parameters:**  
  - `target` (`Entity`): Player entity to target.  
  - `upgrade` (`boolean`): If true, spawns an upgraded prefab (e.g., Varg).

### `SummonSpawn(pt, radius_override)`
* **Description:** Spawns a hound near the given position `pt` (with optional custom search radius) on valid terrain (avoiding holes and water when possible). Handles seasonal/prefab selection and location override hooks.
* **Parameters:**  
  - `pt` (`Vector3`): World position to spawn near.  
  - `radius_override` (`number`, optional): Custom spawn search radius (defaults to SPAWN_DIST=30).

### `SetSpawnData(data)`
* **Description:** Overrides the internal `_spawndata` configuration (used for custom or boss-specific waves like Worm Boss).
* **Parameters:**  
  - `data` (`table`): Replacement spawn configuration table.

### `OnUpdate(dt)`
* **Description:** Core update loop for all timing, warning phase logic, and hound release. Handles both active players and delayed players (who joined/left during a warning). Decrements timers, triggers sound/speech, and releases hounds incrementally per group.
* **Parameters:**  
  - `dt` (`number`): Delta time since last frame.

### `ForceNextWave()`
* **Description:** Immediately triggers the next wave for debugging (bypasses delay). Sets `_timetoattack` to `0` and calls `OnUpdate` to process.
* **Parameters:** None.

### `ForceReleaseSpawn(target)`
* **Description:** Manually spawns a single hound targeting the specified player (no wave scheduling).
* **Parameters:**  
  - `target` (`Entity`): Player to target.

### `SpawnModeNever()`, `SpawnModeLight()`, `SpawnModeNormal()`, `SpawnModeMed()`, `SpawnModeHeavy()`
* **Description:** Sets the global spawn difficulty mode. `Normal`/`Escalating` uses age-based scaling, while others use fixed attack delays/durations. Calls `PlanNextAttack()` afterward.
* **Parameters:** None.

## Events & Listeners
- Listens to:
  - `"ms_playerjoined"` → `OnPlayerJoined`
  - `"ms_playerleft"` → `OnPlayerLeft`
  - `"pausehounded"` → `OnPauseHounded`
  - `"unpausehounded"` → `OnUnpauseHounded`
  - `"hounded_setdifficulty"` → `SetDifficulty`
  - `"hounded_setsummervariant"` → `SetSummerVariant`
  - `"hounded_setwintervariant"` → `SetWinterVariant`
  - `"hounds_worm_boss_setdifficulty"` → `SetWormBossDifficulty`
- Pushes:
  - `"houndwarning"` → Sent to each land-based player during warning sound intervals with `HOUNDWARNINGTYPE` enum value.
  - `"ms_miniquake"` → Triggered by specific warning sounds (if `v.quake` is set).
- Also triggers internally (via `self.inst:PushEvent` or method calls):
  - `"ms_playerjoined"`, `"ms_playerleft"` (handled by listener registration).