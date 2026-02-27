---
id: riftspawner
title: Riftspawner
description: This component manages the spawning, tracking, and lifecycle of rifts (lunar and shadow portals) in the game world based on difficulty settings and world state.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: world
source_hash: 8eed78a6
---

# Riftspawner

## Overview
The Riftspawner component is responsible for controlling the dynamic appearance of rifts (lunar and shadow portals) in *Don't Starve Together*. It runs exclusively on the master simulation and handles rift spawning timers, difficulty-based spawn rates, tracking active rifts, and persisting rift state across save/load cycles. It does not directly manage rift behavior but maintains a pool of active rift entities and coordinates their creation and removal.

## Dependencies & Tags
- **Components used:** `worldsettingstimer` (via `TheWorld.components.worldsettingstimer`), `wagpunk_manager` (optional), `Transform`, `riftthralltype` (optional on rift entities)
- **Tags managed:** `LUNAR_RIFTS_ACTIVE`, `SHADOW_RIFTS_ACTIVE` (via `WORLDSTATETAGS.SetTagEnabled`)
- **Tags added on rifts:** No tags added directly; relies on rift prefabs’ inherent tags.
- **Listeners registered:** `rifts_setdifficulty`, `rifts_settingsenabled`, `rifts_settingsenabled_cave`, `lunarrift_opened`, `shadowrift_opened`, `ms_lunarrift_maxsize`, `ms_shadowrift_maxsize`, `onremove` (on rift entities)
- **Events pushed:** `ms_riftaddedtopool`, `ms_riftremovedfrompool`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the component is attached to (typically `TheWorld`). |
| `_worldsettingstimer` | `WorldSettingsTimer` | — | Reference to the world's settings timer manager. |
| `_map` | `Map` | — | Reference to the world map (`TheWorld.Map`). |
| `spawnmode` | `int` | `3` | Spawn difficulty level: 1=never, 2=rare, 3=default, 4=often, 5=always. |
| `lunar_rifts_enabled` | `boolean` | `false` | Whether lunar rifts are currently active. |
| `shadow_rifts_enabled` | `boolean` | `false` | Whether shadow rifts are currently active. |
| `rifts` | `table` | `{}` | Map of active rift entities → their prefab names. |
| `rifts_count` | `int` | `0` | Total number of currently active rifts. |

## Main Functions

### `IsPointNearPreviousSpawn(x, z)`
* **Description:** Checks if the given world position is too close (within 15 tiles) to any existing rift to prevent clustering. Uses squared distance for performance.
* **Parameters:**  
  - `x` (number): World X coordinate  
  - `z` (number): World Z coordinate  
* **Returns:** `boolean` — `true` if near an existing rift.

### `OnRiftRemoved(rift)`
* **Description:** Handles cleanup when a rift is destroyed. Removes it from the internal pool, decrements the count, and optionally restarts the spawn timer if conditions allow replacement.
* **Parameters:**  
  - `rift` (Entity): The destroyed rift entity.

### `AddRiftToPool(rift, rift_prefab)`
* **Description:** Registers a new rift in the component’s internal pool. Listens for the rift’s `onremove` event to track its lifecycle.
* **Parameters:**  
  - `rift` (Entity): The rift entity.  
  - `rift_prefab` (string): The prefab name of the rift.

### `SpawnRift(forced_pos)`
* **Description:** Attempts to spawn a new rift at the specified or generated location, respecting spacing rules and rift type availability.
* **Parameters:**  
  - `forced_pos` (table or nil): Optional `{x, z}` position to spawn at. If `nil`, uses rift definition’s spawn logic.  
* **Returns:** `Entity or nil` — The spawned rift entity, or `nil` if spawn fails.

### `TryToSpawnRift(forced_pos)`
* **Description:** Wrapper around `SpawnRift` that first checks the rift count against `TUNING.MAXIMUM_RIFTS_COUNT`.
* **Parameters:** Same as `SpawnRift`.
* **Returns:** Same as `SpawnRift`.

### `OnRiftTimerDone()`
* **Description:** Called when the rift spawn timer expires. Attempts to spawn a new rift if the spawn mode permits and capacity allows. If spawning fails (e.g., no valid location), schedules another check in one full day.
* **Parameters:** None.

### `SetDifficulty(src, difficulty)`
* **Description:** Updates the `spawnmode` based on a string difficulty setting (e.g., `"rare"`, `"always"`). Updates or resets the spawn timer accordingly.
* **Parameters:**  
  - `src` (Entity or nil): Source entity (unused in implementation).  
  - `difficulty` (string): One of `"never"`, `"rare"`, `"default"`, `"often"`, `"always"`.

### `TryToStartTimer(src)`
* **Description:** Starts the rift spawn timer if rifts are enabled and the timer is not already active. Also triggers map arena-point recalculation.
* **Parameters:** `src` (Entity or nil) — Source entity (unused).

### `EnableLunarRifts(src)`
* **Description:** Enables lunar rifts (sets `lunar_rifts_enabled = true`, activates `LUNAR_RIFTS_ACTIVE` tag), starts the spawn timer, and enables the `wagpunk_manager` if present.

### `EnableShadowRifts(src)`
* **Description:** Enables shadow rifts (sets `shadow_rifts_enabled = true`, activates `SHADOW_RIFTS_ACTIVE` tag) and starts the spawn timer.

### `OnLunarRiftMaxSize(src, rift)`
* **Description:** Notifies players >30 tiles away from a maximum-size lunar rift via `player._lunarportalmax:push()`.
* **Parameters:**  
  - `src` (Entity or nil)  
  - `rift` (Entity): The rift that reached max size.

### `OnShadowRiftMaxSize(src, rift)`
* **Description:** Notifies players >30 tiles away from a maximum-size shadow rift via `player._shadowportalmax:push()`.

### `SetEnabledSetting(src, enabled_difficulty)`
* **Description:** Handles global lunar rift toggle via `"never"` (disable) or `"always"` (enable) settings.

### `SetEnabledSettingCave(src, enabled_difficulty)`
* **Description:** Handles cave-level shadow rift toggle via `"never"` (disable) or `"always"` (enable) settings.

### `GetNextRiftPrefab()`
* **Description:** Randomly selects a rift prefab based on enabled rift types (lunar/shadow).
* **Returns:** `string or nil` — Prefab name, or `nil` if none available.

### `GetRifts()`, `GetRiftsOfPrefab(prefab)`, `GetRiftsOfAffinity(affinity)`
* **Description:** Helper methods returning active rifts in various formats (all rifts, by prefab name, or by affinity).

### `GetEnabled()`, `GetLunarRiftsEnabled()`, `GetShadowRiftsEnabled()`
* **Description:** Boolean getters for rift type activation status.

### `IsLunarPortalActive()`, `IsShadowPortalActive()`
* **Description:** Check if any rift of the respective affinity is currently active.

### `GetDebugString()`, `GetDebugRiftString()`, `DebugHighlightRifts()`
* **Description:** Debug helpers for inspecting rift state and visualizing rift locations.

## Events & Listeners
- Listens for `"rifts_setdifficulty"` → calls `SetDifficulty(...)`
- Listens for `"rifts_settingsenabled"` → calls `SetEnabledSetting(...)`
- Listens for `"rifts_settingsenabled_cave"` → calls `SetEnabledSettingCave(...)`
- Listens for `"lunarrift_opened"` → calls `EnableLunarRifts(...)`
- Listens for `"shadowrift_opened"` → calls `EnableShadowRifts(...)`
- Listens for `"ms_lunarrift_maxsize"` → calls `OnLunarRiftMaxSize(...)`
- Listens for `"ms_shadowrift_maxsize"` → calls `OnShadowRiftMaxSize(...)`
- Listens for `"onremove"` (on each rift entity) → calls `OnRiftRemoved(rift)`
- Pushes `"ms_riftaddedtopool"` with `{rift = rift}`
- Pushes `"ms_riftremovedfrompool"` with `{rift = rift}`