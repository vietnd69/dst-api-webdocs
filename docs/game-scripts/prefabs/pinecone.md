---
id: pinecone
title: Pinecone
description: Handles planting and deployment of tree saplings from seasonal pinecone items, including side effects on nearby Leif entities.
tags: [environment, plant, deployment]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 6b9c4ac6
system_scope: environment
---

# Pinecone

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`pinecone.lua` defines prefabs for seasonal tree seeds (e.g., `pinecone`, `twiggy_nut`, `palmcone_seed`) that can be deployed to grow into saplings. When deployed, it triggers sapling growth, plays sound effects, and interacts with nearby Leif entities—either soothing them (via sleep induction and achievement award) or taunting them (via sound playback). The prefabs are built using shared logic and are intended for use in seasonal planting events.

## Usage example
```lua
local pinecone = SpawnPrefab("pinecone")
-- pinecone is pre-configured with deployable, stackable, fuel, and winter_treeseed components
pinecone.Transform:SetPosition(Vector3(10, 0, 10))
-- When deployed via player action, the ondeploy handler spawns the sapling and manages Leif behavior
```

## Dependencies & tags
**Components used:** `deployable`, `forcecompostable`, `fuel`, `sleeper`, `stackable`, `winter_treeseed`, `tradable`, `inspectable`, `inventoryitem`, and utility functions like `MakeInventoryPhysics`, `MakeInventoryFloatable`, `MakeSmallBurnable`, `MakeSmallPropagator`, `MakeHauntableLaunchAndIgnite`, `TryLuckRoll`, `AwardPlayerAchievement`.

**Tags:** Adds `deployedplant`, `cattoy`, `treeseed` to the entity.

## Properties
No public properties are initialized directly in the constructor. External components (`fuel`, `stackable`, etc.) expose properties via their own APIs.

## Main functions
### `plant(inst, growtime)`
*   **Description:** Spawns and initializes a sapling from `inst._spawn_prefab`, positions it at the same world coordinates, starts its growth, and plays a planting sound. Removes the pinecone item after planting.
*   **Parameters:**  
    - `inst` (Entity) — the pinecone entity being planted.  
    - `growtime` (number) — the time to use for the sapling’s growth timer.
*   **Returns:** Nothing.
*   **Error states:** If `inst._spawn_prefab` is `nil`, `SpawnPrefab` may fail or produce undefined behavior.

### `ondeploy(inst, pt, deployer)`
*   **Description:** The deployment handler for when a player plants the pinecone. Splits the stack if possible, teleports the pinecone entity to the deployment point, triggers planting, and manages interactions with nearby Leif entities via chance-based sleep or taunt behavior.
*   **Parameters:**  
    - `inst` (Entity) — the pinecone entity.  
    - `pt` (Vector3) — the deployment position.  
    - `deployer` (Entity) — the player or actor deploying the item.
*   **Returns:** Nothing.
*   **Error states:** If `inst.components.stackable` returns the original `inst` (i.e., stack size is 1), no clone is created — the original is used directly.

### `OnLoad(inst, data)`
*   **Description:** A legacy load callback for save-file upgrading. If `data.growtime` is present, immediately plants the sapling (bypassing deployment logic). Used to support older save formats.
*   **Parameters:**  
    - `inst` (Entity) — the pinecone entity being loaded.  
    - `data` (table | nil) — saved state data.
*   **Returns:** Nothing.
*   **Error states:** If `data.growtime` is `nil`, the function does nothing.

### `addcone(name, spawn_prefab, bank, build, anim, winter_tree)`
*   **Description:** Creates and registers a new pinecone prefab variant with specified assets, animations, and optional winter tree support. Used internally to define all pinecone variants (`pinecone`, `twiggy_nut`, `palmcone_seed`).
*   **Parameters:**  
    - `name` (string) — the prefab name (e.g., `"pinecone"`).  
    - `spawn_prefab` (string | nil) — the sapling prefab to spawn on deployment.  
    - `bank`, `build`, `anim` (string) — animation bank, build, and idle animation names.  
    - `winter_tree` (string | nil) — optional winter variant tree prefab name for seasonal events.
*   **Returns:** Nothing (prefabs are inserted into the `cones` table for later return).
*   **Error states:** None documented; relies on external functions (`Prefab`, `MakePlacer`) and `inst` validation in the factory function.

## Events & listeners
- **Listens to:** None (no `inst:ListenForEvent` calls are present).
- **Pushes:** No events are explicitly pushed by this component or its functions.