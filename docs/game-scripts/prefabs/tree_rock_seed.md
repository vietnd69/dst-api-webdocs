---
id: tree_rock_seed
title: Tree Rock Seed
description: A consumable item that, when deployed, grows into a tree_rock_sapling and replaces perishable spoilage with spoiled_food.
tags: [environment, plant, consumable, inventory, deployable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 39251064
system_scope: world
---

# Tree Rock Seed

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`tree_rock_seed` is a prefab definition for an item that functions as a deployable plantable seed. It supports stacking, perishability, and custom deployment logic. Upon deployment, it is consumed and spawns a `tree_rock_sapling`, while also registering as edible (with minimal nutrition/healing), compostable, flammable, and usable as a cat toy. The component system relies on several external components to manage its behavior and lifecycle.

## Usage example
```lua
local seed = SpawnPrefab("tree_rock_seed")
seed.components.perishable:SetPerishTime(TUNING.PERISH_LONG)
seed.components.perishable:StartPerishing()
seed.components.stackable:SetStackSize(5)
```

## Dependencies & tags
**Components used:** `inventoryitem`, `perishable`, `edible`, `stackable`, `deployable`, `forcecompostable`, `inspectable`, `tradable`, `burnable`, `propagator`, `hauntable`  
**Tags:** `deployedplant`, `icebox_valid`, `cattoy`, `show_spoilage`, `treeseed`

## Properties
No public properties. The component defines behavior through function overrides (`_custom_candeploy_fn`, `ondeploy`) and component-level properties (e.g., `edible.hungervalue`, `deployable.mode`), not direct instance variables.

## Main functions
### `OnDeploy(inst, pt)`
*   **Description:** Deployment callback invoked when the seed is placed via the deploy action. Consumes the seed and spawns a `tree_rock_sapling` at the deployment point.
*   **Parameters:**  
    - `inst` (Entity) — the seed instance being deployed.  
    - `pt` (Vector) — the deployment position.
*   **Returns:** Nothing.
*   **Error states:** Splits stack if `stacksize > 1`, removes the used instance, and ignores leftover state for non-stack cases.

### `CanDeploy(inst, pt, mouseover, deployer, rot)`
*   **Description:** Custom deployment validation function used to determine whether placement at a given point is allowed.
*   **Parameters:**  
    - `inst` (Entity) — the seed instance.  
    - `pt` (Vector) — target deployment point.  
    - `mouseover` (Entity?) — optional entity under mouse.  
    - `deployer` (Entity?) — the entity performing deployment.  
    - `rot` (number?) — rotation angle (unused).
*   **Returns:** `true` if deployment is allowed, `false` otherwise.
*   **Error states:** Returns `false` if the tile is not land, is temporary, or if the deployment point is not clear of obstacles (using the inventory item’s deployment radius).

## Events & listeners
None identified.