---
id: statue_enemywave
title: Statue Enemywave
description: Manages the spawning and tracking of enemy waves triggered by a statue during the Maxwell Threat event, and restores player sanity upon wave completion.
tags: [combat, event, wave, sanity, enemy]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 9251ba9b
system_scope: world
---

# Statue Enemywave

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`statue_enemywave` is a scenario helper module responsible for spawning a configurable wave of enemy units (Knight, Bishop, or Rook) around a statue when triggered by the `MaxwellThreat` event. It listens for enemy deaths, tracks remaining wave members, restores the player’s sanity to full upon wave clearance, and clears the scenario. The module is invoked via its `OnLoad` function and is typically attached to a statue entity during scenario-based events.

## Usage example
```lua
-- Typically used inside a scenario definition or entity prefabs
inst:ListenForEvent("onremove", function()
    local spawnedguards = inst.components.statue_enemywave.OnLoad and inst.components.statue_enemywave.OnLoad(inst, scenariorunner) or nil
end)
-- Note: This module returns a table with OnLoad; it is usually called directly, not added as a standard component.
```

## Dependencies & tags
**Components used:** `sanity`, `combat`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### `OnLoad(inst, scenariorunner)`
*   **Description:** Registers an `"onremove"` event callback that triggers wave spawning logic when the entity is removed (e.g., statue destroyed or scenario phase begins). Inside the callback, it spawns enemies, sets up death listeners, and reduces player sanity to 50%.
*   **Parameters:**  
    - `inst` (TheWorld or entity) — the context entity (typically the statue), used for position and event context.  
    - `scenariorunner` (ScenarioRunner component) — used to clear the scenario once all enemies in the wave are defeated.
*   **Returns:** Nothing.
*   **Error states:** Relies on `GetPlayer()`, `TheWorld`, and `SpawnPrefab()`; fails silently if the player or world context is unavailable.

### `StartWave(inst)`
*   **Description:** Spawns a random number (3 or 4) of enemy prefabs (chosen from `knight`, `bishop`, `rook`) in a circular pattern around the entity’s position. Each enemy receives a 1-second delay before being assigned the player as a follow target. A `"poopcloud"` particle effect is spawned at each enemy spawn point.
*   **Parameters:**  
    - `inst` (entity) — provides the center position for wave placement via `inst:GetPosition()`.
*   **Returns:** `spawnedguards` (table) — a table mapping each spawned enemy entity to itself (used for tracking in `ListenForDeath`).
*   **Error states:** May skip spawn if the target world tile is impassable (checked via `TileGroupManager:IsImpassableTile`).

### `ListenForDeath(inst, scenariorunner)`
*   **Description:** Attaches a `"death"` event listener to each enemy in `inst.wave`. When an enemy dies, it calls `OnEnemyKilled`, passing along the wave context and `scenariorunner`. Removes itself as a listener once set.
*   **Parameters:**  
    - `inst` (entity) — contains the current wave table (`inst.wave`).  
    - `scenariorunner` (ScenarioRunner component) — passed to `OnEnemyKilled` for scenario cleanup.
*   **Returns:** Nothing.

### `OnEnemyKilled(inst, enemy, scenariorunner)`
*   **Description:** Called when an enemy in the wave dies. Removes the death callback previously attached to that enemy, nullifies the enemy entry in `inst.wave`, and checks if the wave is fully cleared. If so, fully restores the player’s sanity and clears the scenario.
*   **Parameters:**  
    - `inst` (entity) — the wave context entity (same as `inst` in `ListenForDeath`).  
    - `enemy` (entity) — the enemy that just died.  
    - `scenariorunner` (ScenarioRunner component) — used to clear the scenario.
*   **Returns:** Nothing.

### `TrapInRocks(inst)`
*   **Description:** Sets the player’s sanity to 50% (0.5 proportion of max sanity). Called immediately upon wave start.
*   **Parameters:** `inst` (entity) — not used; retained for API consistency.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `death` — registered per enemy in `inst.wave` via `inst:ListenForEvent("death", fn, enemy)`.
- **Pushes:** `MaxwellThreat` — fired in `StartWave` to signal the wave has begun.