---
id: wes_enemywave
title: Wes Enemywave
description: Manages enemy wave spawning logic for the Maxwell boss encounter, triggered when the player approaches after statues are destroyed.
tags: [combat, boss, scenarios]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 38fc6d8c
system_scope: world
---

# Wes Enemywave

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`wes_enemywave` is a scenario-side script responsible for orchestrating enemy wave spawning during the Maxwell boss fight. It initializes and monitors Maxwell statues, triggers wave generation when the player gets close after statues are destroyed, and handles enemy lifecycle (death tracking, sanity reset, and scenario cleanup). This script does *not* define a component class — it is a module that exposes an `OnLoad` function to set up behavior on a world-scenario entity (typically the Maxwell boss area).

## Usage example
This script is loaded and used internally by the game’s scenario system. It is not directly instantiated by modders. Its `OnLoad` function is called automatically with the scenario runner instance:

```lua
-- Internal usage by DST scenario framework (not modder-facing)
local function OnLoad(inst, scenariorunner)
    -- Set up statues, listeners, and player proximity logic
    inst.statues = GetStatues(inst)
    OnStatueDestroyed(inst, nil)
    ListenForDestroy(inst)
    inst:AddComponent("playerprox")
    inst.sr = scenariorunner
    inst.components.playerprox.onnear = PlayerNear
    inst.components.playerprox.near = 10
end
```

## Dependencies & tags
**Components used:** `playerprox`, `combat`, `sanity`  
**Tags:** `maxwell` — checked via `v:HasTag("maxwell")` to identify statues.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `statues` | table (map of entity→entity) | `nil` | Collection of Maxwell statues near the spawn point. Populated at load. |
| `wave` | table (map of entity→entity) | `nil` | Current active wave of enemies (knight/bishop/rook). Cleared after all die. |
| `sr` | ScenarioRunner | `nil` | Reference to the scenario runner instance, passed in via `OnLoad`. |

*Note: `statues`, `wave`, and `sr` are set at runtime and not initialized in the module itself.*

## Main functions
### `OnLoad(inst, scenariorunner)`
*   **Description:** Entry point called by the scenario system to initialize wave logic. Sets up statue detection, player proximity handling, and attaches the `playerprox` component.
*   **Parameters:**
    *   `inst` (entity) — The world/entity instance this wave manager operates on.
    *   `scenariorunner` (ScenarioRunner) — The scenario runner instance for scenario lifecycle control.
*   **Returns:** Nothing.
*   **Error states:** Fails silently if `TheWorld.Map` or `TheSim` is unavailable; no explicit error handling is present.

### `StartWave(inst)`
*   **Description:** Spawns a circular wave of random enemies (knight, bishop, rook) around the entity’s position and removes the `playerprox` component (to prevent re-triggering).
*   **Parameters:** `inst` (entity) — Required to get position and spawn enemies.
*   **Returns:** `spawnedguards` (table) — A table mapping each spawned enemy entity to itself.
*   **Error states:** Enemies may fail to spawn if the calculated tile is impassable; no enemies are added to the wave in such cases.

### `OnEnemyKilled(inst, enemy, scenariorunner)`
*   **Description:** Callback triggered when an enemy in the current wave dies. Removes its death listener, clears it from the wave table, and triggers end-of-wave logic if all enemies are dead.
*   **Parameters:**
    *   `inst` (entity) — Wave manager instance.
    *   `enemy` (entity) — The dead enemy.
    *   `scenariorunner` (ScenarioRunner) — Used to clear the scenario once all guards are dead.
*   **Returns:** Nothing.
*   **Error states:** If `enemy.scene_killedfn` is missing, the cleanup step is skipped (no-op).

### `GetStatues(inst)`
*   **Description:** Scans for entities tagged `maxwell` within a 100-radius sphere centered on `inst`.
*   **Parameters:** `inst` (entity) — Reference point for the scan.
*   **Returns:** `statues` (table) — Map of statue entities found (entity→entity).
*   **Error states:** None beyond standard entity search behavior (e.g., nil if `TheSim:FindEntities` fails, though unlikely).

### `OnStatueDestroyed(inst, statue)`
*   **Description:** Callback for when a statue is removed. Removes it from `inst.statues`; if all statues are gone, sets `cantrigger = true` to allow wave spawning.
*   **Parameters:**
    *   `inst` (entity) — Wave manager instance.
    *   `statue` (entity or `nil`) — The destroyed statue; if `nil`, used to initialize `cantrigger`.
*   **Returns:** Nothing.

### `PlayerNear(inst)`
*   **Description:** Proximity callback — triggers wave spawning and sanity manipulation if `cantrigger` is true.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.
*   **Error states:** No effect if `cantrigger` is `false`.

### `PlayerFar(inst)`
*   **Description:** Stub proximity callback for when the player leaves range. Currently empty.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  - `death` — on enemy entities in the current wave (via `inst:ListenForEvent("death", ...)` in `ListenForDeath`).  
  - `onremove` — on statue entities (via `v:ListenForEvent("onremove", ...)` in `ListenForDestroy`).  
- **Pushes:**  
  - None identified — this script does not fire custom events.