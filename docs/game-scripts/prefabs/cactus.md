---
id: cactus
title: Cactus
description: Handles the behavior and interactions of cactus plants in the game world, including harvesting, thorn damage, seasonal flowering, and regrowth mechanics.
tags: [plant, combat, environment, inventory]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 86c91b92
system_scope: environment
---

# Cactus

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `cactus.lua` file defines the prefabs for cactus plants (`cactus`, `oasis_cactus`) and cactus flowers (`cactus_flower`). It implements the `pickable` component to manage harvesting and regrowth, handles thorn-based combat interactions when harvested by non-protected players, and supports seasonal flowering behavior (only in summer). Cacti are passive environmental entities that drop `cactus_meat` upon harvesting, and in summer may produce `cactus_flower` items. The cactus flower is an edible, perishable item.

## Usage example
```lua
local cactus = SpawnPrefab("cactus")
cactus.Transform:SetWorldPosition(x, y, z)

-- Force regrowth after picking (e.g., after a regen period)
cactus.components.pickable:MakeEmpty()
```

## Dependencies & tags
**Components used:** `pickable`, `inspectable`, `edible`, `perishable`, `stackable`, `inventoryitem`, `tradable`, `combat` (for damage), `inventory` (for item giving and tag checking).  
**Tags added:** `plant`, `thorny`.  
**Tags checked:** `bramble_resistant`, `shadowminion`.

## Properties
No public properties are defined directly on the cactus prefab or its prefabs. Behavior is driven entirely by component state and callbacks.

## Main functions
### `ontransplantfn(inst)`
* **Description:** Called when the cactus is transplanted (e.g., via planter). Sets the cactus to an empty, non-pickable state.
* **Parameters:** `inst` (Entity) — the cactus entity.
* **Returns:** Nothing.

### `onpickedfn(inst, picker)`
* **Description:** Called when the cactus is picked/harvested. Deactivates physics, plays pick animation, damages the picker if not protected, drops `cactus_flower` (if flowered), and marks the cactus empty. Also applies wetness to dropped items.
* **Parameters:**  
  `inst` (Entity) — the cactus entity.  
  `picker` (Entity or `nil`) — the entity harvesting the cactus (may be `nil` for non-player drops).  
* **Returns:** Nothing.
* **Error states:** If `picker` is `nil`, no damage or item giving occurs.

### `onregenfn(inst)`
* **Description:** Regrows the cactus after harvesting. Sets seasonal animation (`idle_flower` in summer, `idle` otherwise), activates physics, and updates `has_flower` state.
* **Parameters:** `inst` (Entity) — the cactus entity.
* **Returns:** Nothing.

### `makeemptyfn(inst)`
* **Description:** Resets the cactus to its empty state (non-pickable). Deactivates physics and plays the "empty" animation.
* **Parameters:** `inst` (Entity) — the cactus entity.
* **Returns:** Nothing.

### `OnEntityWake(inst)`
* **Description:** Ensures correct animation and flowering state when the cactus wakes (e.g., world deserialization or re-entry to zone). Syncs `has_flower` with world season if pickable, otherwise sets to empty.
* **Parameters:** `inst` (Entity) — the cactus entity.
* **Returns:** Nothing.

### `MakeCactus(name)`
* **Description:** Factory function that creates a cactus prefab (`cactus` or `oasis_cactus`). Initializes core components, tags, physics, and callbacks.
* **Parameters:** `name` (string) — the base name for assets (e.g., `"cactus"` or `"oasis_cactus"`).
* **Returns:** `Prefab` — a reusablePrefab definition.
* **Notes:**  
  - Sets up `pickable` with callbacks (`onpickedfn`, `onregenfn`, `makeemptyfn`, `ontransplantfn`).  
  - Adds `thorny` tag and `plant` tag.  
  - Attaches `MakeLargeBurnable`, `MakeMediumPropagator`, `AddToRegrowthManager`, and `MakeHauntableIgnite`.  
  - `cactus_flower` is defined separately via `cactusflowerfn`.

### `cactusflowerfn()`
* **Description:** Factory function that creates the `cactus_flower` prefab (an edible, stackable item).
* **Parameters:** None.
* **Returns:** `Prefab` — the cactus flower prefab.
* **Notes:**  
  - Adds `edible`, `perishable`, `stackable`, `inventoryitem`, and `tradable` components.  
  - Sets perish time to `PERISH_SUPERFAST` and replacement to `spoiled_food`.  
  - Uses `MakeInventoryPhysics`, `MakeInventoryFloatable`, `MakeSmallBurnable`, `MakeSmallPropagator`, and `MakeHauntableLaunch`.

## Events & listeners
- **Listens to:** `OnEntityWake` (global callback on `inst`) — handles initial state restoration on entity wake.  
- **Pushes:** `thorns` — pushed on the `picker` entity when they take thorn damage.
