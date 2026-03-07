---
id: merm_supply_structures
title: Merm Supply Structures
description: Creates and configures Merm structures that dispense items to Merm units after consuming stored resources.
tags: [merm, structure, inventory, crafting, supply]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 574adf4a
system_scope: entity
---

# Merm Supply Structures

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`merm_supply_structures.lua` is a prefab generator script that defines the behavior and configuration for four Merm-specific supply structures: `merm_armory`, `merm_armory_upgraded`, `merm_toolshed`, and `merm_toolshed_upgraded`. These structures act as supply depots: they hold a starting set of resources, allow Merm units to exchange resources for specific items (e.g., armor or tools), and update visual state (e.g., open/closed animation) based on inventory status. The script also defines placer prefabs for building the structures.

It relies heavily on the `container`, `lootdropper`, `workable`, `burnable`, and `deployhelper` components to manage inventory, drop loot on destruction, enable hammering, handle fire, and support placement helper rings in client builds.

## Usage example
This file is not used directly as a component. Instead, it exports prefabs for the four Merm supply structures and their placers. Modders can use these prefabs as-is or examine the `CreateMermSupplyStructure` and `CreateMermSupplyStructurePlacer` helper functions to create similar supply structures.

```lua
-- Example: Adding the base merm_armory prefab to your mod
local ARMORY_PREFAB = require "prefabs/merm_supply_structures"

-- The module returns four structure prefabs and four placer prefabs as a table.
-- The main structures are at indices 1–4 (order matches source code).
local merm_armory_prefab = ARMORY_PREFAB[1] -- "merm_armory"
local merm_armory_placer_prefab = ARMORY_PREFAB[5] -- "merm_armory_placer"

-- A mod can spawn them like any other prefab:
-- local armory = SpawnPrefab("merm_armory")
```

## Dependencies & tags
**Components used:** `burnable`, `container`, `deployhelper`, `inspectable`, `lootdropper`, `workable`, `updatelooper`, `soundemitter`, `animstate`, `transform`, `minimapentity`, `network`.

**Tags added:**
- `structure`
- `mermonly`
- `placer` (only on helper ring entity)
- `CLASSIFIED`
- `NOCLICK`

## Properties
No public instance properties are exposed by the script. The created prefabs have runtime state stored in custom fields (e.g., `inst._closed`, `inst.supply_cost`), which are internal implementation details.

## Main functions
The following functions are defined as top-level helper functions and later assigned to instance methods (e.g., `inst.OnSupply = OnSupply`) on each structure entity.

### `CacheRecipeCost(inst, recname)`
*   **Description:** Caches the ingredient costs for a given crafting recipe (`recname`) into a lightweight table mapping item prefabs to required amounts.
*   **Parameters:** `inst` (entity) – entity that owns the component; `recname` (string) – name of the recipe (e.g., `"mermarmorhat"`).
*   **Returns:** A table `{ [prefab] = amount, ... }` or `nil` if the recipe is invalid.
*   **Error states:** Returns `nil` if `AllRecipes[recname]` is not found.

### `PlayFunnyIdle(inst)`
*   **Description:** Schedules and plays a short idle animation loop (e.g., a comical bobbing motion) for the structure, extending animation time randomly. Re-schedules itself recursively.
*   **Parameters:** `inst` (entity) – the structure instance.
*   **Returns:** Nothing.
*   **Error states:** Cancels the task if the structure is put to sleep (`OnEntitySleep`) or upon entity removal.

### `OnEntityWake(inst)`
*   **Description:** Cancels any existing idle task and starts a new idle animation task, used to re-awaken idle visuals when the entity wakes.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnEntitySleep(inst)`
*   **Description:** Cancels the pending idle animation task when the entity goes to sleep.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnUpdatePlacerHelper(helperinst)`
*   **Description:** Updates the visual appearance (color/opacity) of the placement helper ring based on proximity to the placing player.
*   **Parameters:** `helperinst` (entity) – the helper ring entity.
*   **Returns:** Nothing.

### `CreatePlacerRing()`
*   **Description:** Creates and configures a non-networked helper entity used to visualize placement boundaries during building.
*   **Parameters:** None.
*   **Returns:** A new entity with `animstate`, `transform`, and `updatelooper` components.

### `OnEnableHelper(inst, enabled, recipename, placerinst)`
*   **Description:** Enables or disables the helper ring entity when the deploy helper is activated or stopped.
*   **Parameters:**  
    `inst` (entity) – the structure instance with `deployhelper`;  
    `enabled` (boolean);  
    `recipename` (string, unused);  
    `placerinst` (entity) – the entity doing the placing.
*   **Returns:** Nothing.

### `OnStartHelper(inst)`
*   **Description:** Cancels the helper if a placement animation is already playing (e.g., to prevent overlap on rapid inputs).
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnHammered(inst)`
*   **Description:** Handles destruction of the structure via hammering: extinguishes fire, drops loot for each recipe ingredient not in `supply_cost`, drops all container contents, spawns a collapse FX prefab, and removes the entity.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnHit(inst, worker, workleft)`
*   **Description:** Triggers a hit animation on the structure when it is being worked on (but not finished).
*   **Parameters:**  
    `inst` (entity);  
    `worker` (entity performing the work);  
    `workleft` (number).
*   **Returns:** Nothing.

### `OnBuiltFn(inst)`
*   **Description:** Called when the structure is placed successfully. Plays placement sound and animation, then spawns and deposits the initial resource items into the container.
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `OnBurnt(inst, ...)`
*   **Description:** Callback when the structure is fully burnt. Calls `DefaultBurntStructureFn`, cancels idle tasks, and disables wake/sleep callbacks.
*   **Parameters:** `inst` (entity), plus extra args passed by `burnable.onburnt`.
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Serializes state to save data: marks `burnt = true` if the structure is on fire or already burnt.
*   **Parameters:** `inst` (entity), `data` (table).
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Loads saved state: if `data.burnt` is `true`, triggers the burnt state directly via `burnable.onburnt`.
*   **Parameters:** `inst` (entity), `data` (table).
*   **Returns:** Nothing.

### `CanSupply(inst)`
*   **Description:** Checks whether the structure has sufficient resources in its container to dispense its supply item.
*   **Parameters:** `inst` (entity).
*   **Returns:** `true` if the container holds at least the required amounts of each `supply_cost` item; `false` otherwise (e.g., burnt, missing resources, or no container).
*   **Error states:** Returns `false` if `inst.supply_cost` or `inst.components.container` is missing.

### `OnSupply(inst, merm)`
*   **Description:** Called when a Merm unit triggers a supply exchange. Consumes required resources, gives the supply item (`merm.supply_prefab`), and updates animation state to open/closed.
*   **Parameters:**  
    `inst` (entity) – the supply structure;  
    `merm` (entity) – the Merm requesting the item.
*   **Returns:** Nothing.
*   **Error states:** Early return if `CanSupply()` is `false`.

### `OnContainerStateChanged(inst)`
*   **Description:** Re-evaluates and updates the structure’s animation when its container contents change (via `itemget`/`itemlose` events).
*   **Parameters:** `inst` (entity).
*   **Returns:** Nothing.

### `CreateMermSupplyStructure(data)`
*   **Description:** Generates a Prefab definition for one of the four supply structures using the provided `data` configuration table.
*   **Parameters:** `data` (table) – must contain at least: `prefab`, `bank`, `build`, `tag`, `hiddensymbol`, `supplyprefab`, `deployhelperfilter`, `assets`, `prefabs`.
*   **Returns:** A `Prefab` object ready for registration.

### `CreateMermSupplyStructurePlacer(data)`
*   **Description:** Generates a Prefab definition for the placer item (e.g., `"merm_armory_placer"`), which is placed first to build the structure.
*   **Parameters:** `data` (table) – same structure as above, but used for placement visual configuration.
*   **Returns:** A `Prefab` object for the placer.

## Events & listeners
- **Listens to:**  
  - `"itemget"` – triggers `inst.OnContainerStateChanged` to re-check supply availability and update animation.  
  - `"itemlose"` – same as above.

- **Pushes:**  
  - Events are not directly pushed by this script; instead, components push common events (e.g., `burnable` pushes `"onburnt"`, `"onextinguish"`). The script supplies callbacks for these events on the instance.  
  - Internal state (e.g., `inst._closed`) is updated and reflected in animation state but no custom events are emitted by this script itself.
