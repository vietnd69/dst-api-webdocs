---
id: grottowarmanager
title: Grottowarmanager
description: Manages Grotto War dynamic spawners and population logic, spawning nightmares and brightmares near players based on area and population limits.
tags: [combat, ai, boss, environment, network]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: map
source_hash: ec61bc73
system_scope: world
---

# Grottowarmanager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`GrottoWarManager` orchestrates the Grotto War event by tracking players in `lunacyarea` zones and spawning nightmare and brightmare entities dynamically to challenge them. It manages population density limits, handles event initiation via the `ms_archivesbreached` event, and supports both standard and retrofitted map layouts. This component only exists on the master simulation and is tied to the world entity.

## Usage example
```lua
-- Typically added automatically by the world entity; modders should not instantiate directly.
-- Ensure war trigger logic is satisfied:
TheWorld:PushEvent("ms_archivesbreached")
-- Then verify status:
if TheWorld.components.grottowarmanager:IsWarStarted() then
    print("Grotto War is active.")
end
```

## Dependencies & tags
**Components used:**  
- `areaaware` — `GetCurrentArea()`  
- `combat` — `SetTarget()`  
- `knownlocations` — `RememberLocation()`  
- `locomotor` — `isrunning` property  

**Tags:**  
- Adds to internal `_players` tracking for players in `lunacyarea` (via `changearea` events).  
- Checks tags: `lunacyarea`, `brightmare`, `player`, `playerghost`, `shadow`, `grotto_war_wall`, `GrottoWarEntrance`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The owning entity instance (always the world). |

## Main functions
### `RetrofittedSpawnFrontLines()`
*   **Description:** Spawns front-line war spawners (`nightmaregrowth_spawner`, `fissure_grottowar`, `statue_transition`, `grotto_war_sfx`) at registered retrofitted spawn and home points, then clears internal retrofitted data. Intended for pre-defined war layouts (e.g., event levels).
*   **Parameters:** None.
*   **Returns:** `true` if retrofitted points were valid and spawning occurred; otherwise `false`.
*   **Error states:** Returns `false` if `_retrofitted_spawnpoints` or `_retrofitted_homepoint` are `nil` or invalid.

### `SpawnFrontLines()`
*   **Description:** Spawns front-line war spawners along edges of the Grotto War entrance node in standard world topology. Uses map data to determine entrance location and adjacent edges. Supports modular spawner placement with alternating types and SFX placement.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Logs a warning and returns early if no node tagged `GrottoWarEntrance` is found.

### `IsWarStarted()`
*   **Description:** Checks whether the Grotto War has been triggered (i.e., `ms_archivesbreached` was received).
*   **Parameters:** None.
*   **Returns:** `boolean` — `true` if war is active (`_enabled` is `true`), otherwise `false`.

### `OnSave()`
*   **Description:** Returns the component’s persistent state for save data. Stores the `_enabled` status under key `_enabled2`.
*   **Parameters:** None.
*   **Returns:** `table` — `{ _enabled2 = boolean }`.

### `OnLoad(data)`
*   **Description:** Restores state from saved data. Loads `_enabled` based on `data._enabled2`.
*   **Parameters:** `data` (table) — The saved state table returned by `OnSave`.
*   **Returns:** Nothing.

### `GetDebugString()`
*   **Description:** Returns a human-readable debug summary for the debug overlay.
*   **Parameters:** None.
*   **Returns:** `string` — e.g., `"2 players"`.

## Events & listeners
- **Listens to:**  
  - `ms_playerjoined` — Adds player to tracking and checks current area.  
  - `ms_playerleft` — Removes player from tracking and stops war if no players remain.  
  - `changearea` — Updates player’s inclusion in `_players` based on `lunacyarea` tag presence.  
  - `nightmarephasechanged` — Reserved for future intensity scaling (currently no-op).  
  - `ms_archivesbreached` — Starts war if not already active, spawns front lines, sets nightmare phase to `"wild"`, and initiates camera shake.  
  - `ms_register_retrofitted_grotterwar_spawnpoint` — Registers a spawner entity for retrofitted war layouts.  
  - `ms_register_retrofitted_grotterwar_homepoint` — Registers home point for retrofitted war layouts.  
  - `entitysleep` (on spawned entities) — Triggers immediate despawn.

- **Pushes:**  
  - None directly. Indirectly triggers `ms_setnightmarephase` via `TheWorld:PushEvent`.

> Note: All event handlers and population logic (`UpdatePopulation`) only execute on the master simulation. Client-side code has no `GrottoWarManager` component.
