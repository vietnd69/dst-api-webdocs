---
id: ancienttree_seed
title: Ancienttree seed
description: A deployable item that spawns a randomly generated ancient tree sapling when placed in the world.
tags: [world, plant, deployable, growth, environment]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a8eb6b04
system_scope: world
---

# Ancienttree seed

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
`ancienttree_seed` is a prefab entity representing a seed that, when deployed, produces a sapling of a randomly selected ancient tree type. It supports world generation persistence via save/load hooks and integrates with the `deployable` and `growable` systems to manage placement and subsequent growth progression. The seed does not contain logic itself; its behavior is defined by callbacks in the `fn()` constructor and attached component hooks.

## Usage example
```lua
local seed = SpawnPrefab("ancienttree_seed")
seed.Transform:SetPosition(Vector3(x, y, z))
seed.components.deployable:OnDeploy(Vector3(x, y, z), player)
```

## Dependencies & tags
**Components used:** `deployable`, `inspectable`, `inventoryitem`, `hauntable`
**Tags added:** `treeseed`, `deployedplant`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `type` | string | `nil` | Type of ancient tree (e.g., `"normal"`, `"blue"`). Set on init via `GetRandomItemWithIndex(TREE_DEFS)` or from save data. |
| `_plantdata` | table | `nil` | A table of randomized growth attributes (e.g., yield, nutrition, effects). Populated via `RandomizePlantData()` or loaded from save data. |

## Main functions
### `SetType(type)`
*   **Description:** Assigns the tree type (used to construct the corresponding sapling prefab name).
*   **Parameters:** `type` (string) — One of the keys from `TREE_DEFS`.
*   **Returns:** Nothing.

### `SetPlantData(data)`
*   **Description:** Directly assigns a provided table as the plant data, overriding existing random values.
*   **Parameters:** `data` (table) — A table with keys matching `PLANT_DATA`, and numeric values.
*   **Returns:** Nothing.

### `RandomizePlantData()`
*   **Description:** Generates a `_plantdata` table by sampling random values for each attribute defined in `PLANT_DATA` using `GetRandomMinMax`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `TransferPlantData(target)`
*   **Description:** Copies the current instance's `_plantdata` table to a target entity (typically the spawned sapling).
*   **Parameters:** `target` (GObject) — The entity to receive the plant data.
*   **Returns:** Nothing.

### `OnDeploy(inst, pt, deployer)`
*   **Description:** Called when the seed is deployed via `deployable` component. Spawns the appropriate sapling, positions it, triggers growth, transfers plant data, and removes the seed.
*   **Parameters:**
    *   `inst` (GObject) — The seed instance.
    *   `pt` (Vector3 or similar) — Deployment position.
    *   `deployer` (GObject, optional) — The entity placing the seed.
*   **Returns:** Nothing.
*   **Error states:** If `inst.type` or `inst._plantdata` is `nil`, it attempts to populate them before proceeding.

## Events & listeners
- **Listens to:** None explicitly.
- **Pushes:** None directly.

### Save/Load Hooks
- **`OnSave(inst, data)`**  
  Records `type` and `_plantdata` into the save data table for persistence.

- **`OnLoad(inst, data)`**  
  Restores `type` and `_plantdata` from save data if present. Returns early if `data` is `nil`.