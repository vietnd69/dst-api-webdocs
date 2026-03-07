---
id: livingtree
title: Livingtree
description: A custom tree prefab that supports chopping, burning, and saving/loading state transitions between full tree, stump, and burnt variants.
tags: [environment, interact, save]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a692bb8a
system_scope: environment
---

# Livingtree

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`livingtree` is a prefabricated entity representing a renewable, harvestable tree with lifecycle states: active tree → stump (after chopping) → burnt stump (after burning). It integrates with the `workable`, `burnable`, `lootdropper`, and `growable` components to handle player interactions, burning behavior, and dynamic loot drops. The prefab also implements custom save/load logic to preserve state transitions across server restarts.

## Usage example
```lua
-- Typical usage within a prefab definition
local assets =
{
    Asset("ANIM", "anim/evergreen_living_wood.zip"),
    Asset("MINIMAP_IMAGE", "livingtree"),
    Asset("MINIMAP_IMAGE", "livingtree_burnt"),
    Asset("MINIMAP_IMAGE", "livingtree_stump"),
}

local prefabs = { "livinglog" }

-- The `fn()` constructor is passed to Prefab(...), which instantiates the entity
return Prefab("livingtree", fn, assets, prefabs)
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `burnable`, `propagator`, `hauntable`, `growable`, `inspectable`  
**Tags added:** `plant`, `tree`, `burnt`, `stump`  
**Tags checked:** `playerghost`, `beaver` (during interaction sound selection)

## Properties
No public properties are defined in the constructor. State is maintained via component-managed fields (`workable.workleft`, `burnable.burning`, `growable.stage`), and internal callbacks.

## Main functions
### `OnBurnt(inst)`
*   **Description:** Handles the transition to the burnt state after the tree finishes burning. Schedules `Extinguish`, updates animation, adds the `burnt` tag, and changes minimap icon.
*   **Parameters:** `inst` (Entity) — The livingtree instance.
*   **Returns:** Nothing.
*   **Error states:** None documented.

### `Extinguish(inst)`
*   **Description:** Converts a burnt livingtree back to a non-burning stump. Removes burnable, propagator, and hauntable components, resets loot, and configures the workable component to allow digging for logs.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `ondug(inst)`
*   **Description:** Called when the stump is dug; spawns a `livinglog` and removes the entity.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `makestump(inst, instant)`
*   **Description:** Transforms a full tree into a stump by removing workable, burnable, and propagator components, re-initializing them at smaller scale, and updating animation and minimap icon.
*   **Parameters:**  
    * `inst` (Entity) — The tree instance.  
    * `instant` (boolean) — If true, sets animation immediately; otherwise queues it.
*   **Returns:** Nothing.

### `onworked(inst, chopper, workleft)`
*   **Description:** Callback triggered on each chopping action; plays chop sound, hit sound, and chop animation.
*   **Parameters:**  
    * `inst` (Entity) — The tree instance.  
    * `chopper` (Entity) — The entity performing the work.  
    * `workleft` (number) — Remaining work required.
*   **Returns:** Nothing.

### `onworkfinish(inst, chopper)`
*   **Description:** Final callback after chopping completes; falls tree, drops loot on the side of the chopper, triggers camera shake, and calls `makestump`.
*   **Parameters:**  
    * `inst` (Entity).  
    * `chopper` (Entity).
*   **Returns:** Nothing.

### `OnHalloweenSetup(inst)`
*   **Description:** Replaces the tree with `livingtree_halloween` variant during the `HALLOWED_NIGHTS` event if not already burnt or a stump.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `onsave(inst, data)`
*   **Description:** Serializes state: sets `data.stump = true` or `data.burnt = true` based on tags or burnable state.
*   **Parameters:**  
    * `inst` (Entity).  
    * `data` (table) — Save table passed by the game.
*   **Returns:** Nothing.

### `onload(inst, data)`
*   **Description:** Restores state on load: converts to stump or burnt stump based on saved flags.
*   **Parameters:**  
    * `inst` (Entity).  
    * `data` (table) — Loaded save data.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** `animover` — removes the entity after the fall animation completes.
- **Pushes:** No custom events; relies on standard component events (`onwork`, `onfinish`, etc.) and game hooks (`OnSave`, `OnLoad`).
