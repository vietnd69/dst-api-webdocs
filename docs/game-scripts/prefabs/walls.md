---
id: walls
title: Walls
description: Provides the underlying component logic andprefab factory for generating wall entities with health, pathfinding, and construction mechanics.
tags: [world, physics, construction]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0c9f422f
system_scope: world
---

# Walls

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`walls.lua` defines a factory function `MakeWallType` that dynamically generates three prefabs for each wall type: the wall entity itself, its item representation (wall builder), and a placer prefab for placement UI. The wall prefabs implement obstacle physics, pathfinding integration (via `TheWorld.Pathfinder`), health-based damage states, animation switching, hammer repair, and flammability behaviors. This is not a standalone component but a prefab generator that configures multiple components for wall entities in the ECS.

## Usage example
```lua
local prefabs = require "prefabs/walls"

-- The file returns multiple prefabs directly (wall entity, wall builder, and placer)
-- To create a wall instance programmatically:
local wall = SpawnPrefab("wall_stone")
if wall ~= nil then
    wall.Transform:SetPosition(x, y, z)
    wall:PushEvent("ondeploy")
end
```

## Dependencies & tags
**Components used:** `burnable`, `combat`, `deployable`, `fuel`, `health`, `inventoryitem`, `lootdropper`, `placer`, `propagator`, `repairable`, `repairer`, `stackable`, `workable`  
**Tags added:** `wall`, `noauradamage`, `electricdamageimmune`, `player` (conditionally), plus type-specific tags (`stone`, `wood`, `grass`, `ruins`, `moonrock`, `dreadstone`, `scrap`)

## Properties
No public properties defined as class fields. All configuration is passed via the `data` table to `MakeWallType`.

## Main functions
### `OnIsPathFindingDirty(inst)`
*   **Description:** Updates the pathfinding registry with the wall’s position. Adds it when pathfinding is enabled (`_ispathfinding` is true) and removes it when disabled.
*   **Parameters:** `inst` (entity) - the wall entity whose pathfinding status changed.
*   **Returns:** Nothing.
*   **Error states:** Does not fail; relies on `inst._pfpos` being nil or valid Vector3.

### `InitializePathFinding(inst)`
*   **Description:** Registers the listener for `onispathfindingdirty` events and immediately triggers `OnIsPathFindingDirty`.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `makeobstacle(inst)`
*   **Description:** Activates physics and enables pathfinding for the wall.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `clearobstacle(inst)`
*   **Description:** Deactivates physics and disables pathfinding for the wall.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `resolveanimtoplay(inst, percent)`
*   **Description:** Returns the appropriate animation name based on health percentage. For full health (`percent = 1`), selects a stable random animation (`fullA`, `fullB`, or `fullC`) based on world coordinates.
*   **Parameters:** `inst` (entity), `percent` (number, `0.0`–`1.0`).
*   **Returns:** string (animation name) or table element for full animations.

### `onhealthchange(inst, old_percent, new_percent)`
*   **Description:** Handles animation transitions on health change: plays hit animation when damaged, transitions to broken animations when health drops to zero, and toggles obstacle state.
*   **Parameters:**  
    `inst` (entity) – wall instance,  
    `old_percent` (number) – previous health percentage,  
    `new_percent` (number) – new health percentage.
*   **Returns:** Nothing.

### `keeptargetfn()`
*   **Description:** Always returns `false` to indicate walls should never maintain combat targets.
*   **Parameters:** None.
*   **Returns:** `false`.

### `onload(inst, data)`
*   **Description:** On entity load, clears obstacle if dead, and optionally corrects grid position (`gridnudge`) to align with half-tile offsets.
*   **Parameters:** `inst` (entity), `data` (table or nil) – saved data containing `gridnudge` if present.
*   **Returns:** Nothing.

### `onremove(inst)`
*   **Description:** Removes the wall from pathfinding before deletion.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `ValidRepairFn(inst)`
*   **Description:** Determines if the wall is valid for repair. Returns `true` if the wall is physically active, or if placed above ground or visual ground with no adjacent blocking players.
*   **Parameters:** `inst` (entity).
*   **Returns:** boolean.

### `MakeWallType(data)`
*   **Description:** Factory function that returns three prefabs (wall, wall item, wall placer) for a specific wall type defined by `data`.
*   **Parameters:** `data` (table) – contains:
    - `name`: material name (e.g., `"stone"`, `"wood"`)
    - `material`: material string (for sound effects)
    - `tags`: array of additional tags
    - `loot`: string prefab name to drop
    - `maxloots`: max number of loots (scaled by health)
    - `maxhealth`: maximum hit points
    - `maxwork`: work left for hammering
    - `playerdamagemod`: player damage multiplier
    - `repairhealth`: custom health restored per repair
    - `buildsound`: optional sound on build/repair
    - `flammable`: boolean
*   **Returns:** 3 values:  
    `Prefab` – the wall entity,  
    `Prefab` – the wall builder item,  
    `Prefab` – the wall placer for UI placement.
*   **Error states:** None; returns default prefabs on malformed input.

### `ondeploywall(inst, pt, deployer)`
*   **Description:** Called by the `deployable` component when a wall builder item is deployed. Spawns the wall prefab at the target location, destroys the item stack, and optionally plays build sound.
*   **Parameters:**  
    `inst` (entity) – the deployed wall item,  
    `pt` (Vector3) – deployment position,  
    `deployer` (entity or nil) – the entity deploying the wall.
*   **Returns:** Nothing.

### `onhammered(inst, worker)`
*   **Description:** Called when the wall is fully hammered. Drops loot proportional to current health, spawns a collapse FX, and removes the wall.
*   **Parameters:** `inst` (entity), `worker` (entity).
*   **Returns:** Nothing.

### `itemfn()`
*   **Description:** Constructor for the wall builder item. Configures inventory, repairer, fuel, deployable, flammability, and animation.
*   **Parameters:** None (internal to `MakeWallType`).
*   **Returns:** `inst` (entity) – the wall builder item prefab.

### `onhit(inst)`
*   **Description:** Called on combat hit. Plays hit sound and animation.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `onrepaired(inst)`
*   **Description:** Called on repair completion. Plays build sound and reactivates obstacle physics.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `fn()`
*   **Description:** Main constructor for the wall entity prefab. Sets up physics, tags, health, combat, repair, workable, flammability, sound, and pathfinding.
*   **Parameters:** None (internal to `MakeWallType`).
*   **Returns:** `inst` (entity) – the wall entity prefab.

## Events & listeners
- **Listens to:** `onispathfindingdirty` – triggers `OnIsPathFindingDirty`.
- **Pushes:** `loot_prefab_spawned` (via `lootdropper`), `on_loot_dropped` (via `lootdropper`), `ondeploy` (implicit via deployable), and internal pathfinding events.

