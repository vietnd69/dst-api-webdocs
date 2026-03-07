---
id: riftspawner
title: Riftspawner
description: Manages the spawning, tracking, and state of lunar and shadow rifts in the game world based on difficulty settings and world conditions.
tags: [ rifts, world, spawner, event ]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: 8eed78a6
system_scope: world
---

# Riftspawner

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`RiftSpawner` is a server-side world component responsible for dynamically spawning and maintaining rifts (lunar and shadow) in the game world. It responds to difficulty settings, world state changes, and timed events to control how and when rifts appear. It uses the `worldsettingstimer` component for scheduled spawns and ensures rifts maintain minimum spacing constraints.

This component only exists on the master simulation (`TheWorld.ismastersim`) and works closely with `WagpunkManager` (to control hint/pop-up behavior) and `RiftThrallType` (to assign thrall types to spawned rifts).

## Usage example
```lua
-- Typically added automatically to TheWorld during world initialization.
-- Example of manual interaction:
if TheWorld.components.riftspawner then
    -- Enable lunar rifts at "always" difficulty
    TheWorld.components.riftspawner:SetEnabledSetting(nil, "always")
    -- Query current rift count
    local count = TheWorld.components.riftspawner.rifts_count
    -- Get all active lunar rifts
    local lunar_rifts = TheWorld.components.riftspawner:GetRiftsOfAffinity("lunar")
end
```

## Dependencies & tags
**Components used:** `worldsettingstimer`, `wagpunk_manager` (optional), `riftthralltype` (on spawned rifts).
**Tags:** Adds `LUNAR_RIFTS_ACTIVE` and `SHADOW_RIFTS_ACTIVE` via `WORLDSTATETAGS.SetTagEnabled`. Does not manipulate entity tags.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spawnmode` | number | `3` | Spawn intensity: `1=never`, `2=rare`, `3=default`, `4=often`, `5=always`. |
| `lunar_rifts_enabled` | boolean | `false` | Whether lunar rifts are currently enabled. |
| `shadow_rifts_enabled` | boolean | `false` | Whether shadow rifts are currently enabled. |
| `rifts` | table | `{}` | Table mapping rift entities (keys) to their prefab names (values). |
| `rifts_count` | number | `0` | Current number of active rifts in the pool. |
| `_worldsettingstimer` | WorldSettingsTimer | `TheWorld.components.worldsettingstimer` | Reference to the world timer component. |
| `_map` | Map | `TheWorld.Map` | Reference to the world map utility. |

## Main functions
### `SpawnRift(forced_pos)`
*   **Description:** Attempts to spawn a single rift at a valid location. If `forced_pos` is provided, uses that position; otherwise queries the rift definition's spawn logic.
*   **Parameters:** `forced_pos` (`{x=number, z=number}`|nil) — Optional override spawn position.
*   **Returns:** The spawned rift entity, or `nil` if spawning failed (invalid location, near existing rift, or no viable prefab).
*   **Error states:** Returns `nil` if no rift prefab is selected (`GetNextRiftPrefab` returns `nil`) or if the location fails proximity checks.

### `TryToSpawnRift(forced_pos)`
*   **Description:** Wrapper around `SpawnRift` that enforces the maximum rift count (`TUNING.MAXIMUM_RIFTS_COUNT`) before spawning.
*   **Parameters:** `forced_pos` — Same as `SpawnRift`.
*   **Returns:** The rift entity if spawned, else `nil`.

### `SetDifficulty(src, difficulty)`
*   **Description:** Updates the global rift spawn intensity and adjusts the active timer accordingly.
*   **Parameters:** `difficulty` (string) — One of `"never"`, `"rare"`, `"default"`, `"often"`, `"always"`.
*   **Returns:** Nothing.

### `EnableLunarRifts(src)`
*   **Description:** Enables lunar rifts, sets the `"LUNAR_RIFTS_ACTIVE"` world state tag, starts the timer, and enables `WagpunkManager` if present.
*   **Parameters:** None used (`src` argument present for event compatibility).
*   **Returns:** Nothing.

### `EnableShadowRifts(src)`
*   **Description:** Enables shadow rifts and sets the `"SHADOW_RIFTS_ACTIVE"` world state tag.
*   **Parameters:** None used (`src` argument present for event compatibility).
*   **Returns:** Nothing.

### `AddRiftToPool(rift, rift_prefab)`
*   **Description:** Registers a newly spawned rift in the spawner's internal pool and attaches a listener for its removal.
*   **Parameters:** `rift` (Entity) — The rift entity instance. `rift_prefab` (string) — Prefab name of the rift.
*   **Returns:** Nothing.

### `OnRiftRemoved(rift)`
*   **Description:** Removes a rift from the pool and schedules the next rift spawn if possible.
*   **Parameters:** `rift` (Entity) — The rift being removed.
*   **Returns:** Nothing.

### `GetNextRiftPrefab()`
*   **Description:** Randomly selects a rift prefab based on currently enabled rift types (lunar, shadow).
*   **Parameters:** None.
*   **Returns:** Prefab name (string) or `nil` if no rifts are enabled.

### `GetRiftsOfAffinity(affinity)`
*   **Description:** Returns a list of rifts matching the specified affinity (`"lunar"` or `"shadow"`).
*   **Parameters:** `affinity` (string) — Affinity type.
*   **Returns:** Table of rift entities, or `nil` if none match.

### `OnSave()`
*   **Description:** Prepares component state for persistence (e.g., rift GUIDs, enabled flags, timer state).
*   **Parameters:** None.
*   **Returns:** `{ data = { ... }, ents = {...} }` — Save data and list of rift entity GUIDs.

### `LoadPostPass(newents, data)`
*   **Description:** Restores rift references after world load by reconstructing the rift pool from saved GUIDs.
*   **Parameters:** `newents` (table) — Mapping of GUIDs to loaded entities. `data` (table) — Loaded save data.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a one-line summary of rift state for debugging.
*   **Parameters:** None.
*   **Returns:** String — e.g., `"Lunar Rifts: ON || Shadow Rifts: OFF || Rifts Count: 2 || Rift Spawn Time: 120.0"`.

### `GetDebugRiftString()`
*   **Description:** Returns a multi-line list of all rifts and their affinities.
*   **Parameters:** None.
*   **Returns:** String or `"NO RIFTS"`.

### `DebugHighlightRifts()`
*   **Description:** Spawns visual debug markers (`bluemooneye`, `redmooneye`, `greenmooneye`) above each rift for debugging.
*   **Parameters:** None.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `"rifts_setdifficulty"` — Triggers `SetDifficulty`.  
  - `"rifts_settingsenabled"` — Triggers `SetEnabledSetting` (lunar).  
  - `"rifts_settingsenabled_cave"` — Triggers `SetEnabledSettingCave` (shadow).  
  - `"lunarrift_opened"` — Triggers `EnableLunarRifts`.  
  - `"shadowrift_opened"` — Triggers `EnableShadowRifts`.  
  - `"ms_lunarrift_maxsize"` — Triggers `OnLunarRiftMaxSize`.  
  - `"ms_shadowrift_maxsize"` — Triggers `OnShadowRiftMaxSize`.  
  - `"onremove"` (on each rift) — Triggers `OnRiftRemoved`.

- **Pushes:**  
  - `"ms_riftaddedtopool"` — When a rift is added. Data: `{ rift = rift }`.  
  - `"ms_riftremovedfrompool"` — When a rift is removed. Data: `{ rift = rift }`.
