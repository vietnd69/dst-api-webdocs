---
id: acorn
title: Acorn
description: A deployable tree seed that can be planted to grow a deciduous tree and optionally pacify nearby monster trees.
tags: [environment, planting, deployment, tree]
sidebar_position: 10

last_updated: 2026-03-04
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 557312a3
system_scope: environment
---

# Acorn

> Based on game build **714014** | Last updated: 2026-03-04

## Overview
The `acorn` prefab is a reusable item that allows players to plant deciduous trees. When deployed, it spawns an `acorn_sapling`, waits for it to grow, and has a chance to pacify a nearby monster tree (e.g., a Bee Tree or Man Rabbit Tree) by temporarily halting its aggressive behavior. It functions as a seed with decay properties and can be cooked into `acorn_cooked`, which has similar food value but faster spoilage.

The acorn integrates with multiple core systems: deployment (tree planting), perishability (spoiling), composting (brown matter), and entity behavior control (monster pacification).

## Usage example
```lua
-- Spawn a pristine acorn and deploy it at position `pt`
local acorn = SpawnPrefab("acorn")
acorn.Transform:SetPosition(pt.x, pt.y, pt.z)
acorn.components.deployable:OnDeploy(pt)

-- After planting, the acorn is consumed and spawns a sapling
-- If a monster tree is found in range, it will be pacified for a short time
```

## Dependencies & tags
**Components used:** `cookable`, `tradable`, `perishable`, `edible`, `stackable`, `inspectable`, `inventoryitem`, `deployable`, `winter_treeseed`, `forcecompostable`, `burnable`, `propagator`, `hauntable`

**Tags added:** `deployedplant`, `icebox_valid`, `cattoy`, `show_spoilage`, `treeseed`, `cookable`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `components.cookable.product` | string | `"acorn_cooked"` | The prefab name produced when cooked. |
| `components.perishable.perishtime` | number | `TUNING.PERISH_PRESERVED` | Time in seconds before spoiling (pristine acorn). |
| `components.perishable.onperishreplacement` | string | `"spoiled_food"` | Prefab spawned upon spoiling. |
| `components.edible.healthvalue` | number | `TUNING.HEALING_TINY` | Health restored per consumption. |
| `components.edible.hungervalue` | number | `TUNING.CALORIES_TINY` | Hunger restored per consumption. |
| `components.edible.foodtype` | FOODTYPE | `FOODTYPE.RAW` | Food classification (changes to `SEEDS` when cooked). |
| `components.stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size. |
| `components.deployable.mode` | DEPLOYMODE | `DEPLOYMODE.PLANT` | Deployment behavior type. |
| `components.winter_treeseed.winter_tree` | string | `"winter_deciduoustree"` | Tree prefab to spawn when planted in winter. |

## Main functions
### `ondeploy(inst, pt)`
*   **Description:** Called when the acorn is deployed (e.g., via right-click placement). Spawns a sapling, plays a sound, and attempts to pacify the nearest visible monster tree within radius `TUNING.DECID_MONSTER_ACORN_CHILL_RADIUS`. The acorn is consumed in the process.
*   **Parameters:**  
    `inst` (Entity) — the acorn instance being deployed.  
    `pt` (Vector3) — target position for planting.
*   **Returns:** Nothing.
*   **Error states:** Returns early if deployment fails (e.g., due to `stackable:Get()` returning `nil`). The pacification logic respects burn state and stump tags.

### `OnLoad(inst, data)`
*   **Description:** Restoration function used during world load. If saved data includes `growtime`, it immediately plants the tree without waiting for sapling growth.
*   **Parameters:**  
    `inst` (Entity) — the acorn instance being loaded.  
    `data` (table or nil) — serialized data with optional `data.growtime` (number).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly registered.
- **Pushes:** None. Event interactions occur via external components (`deployable.ondeploy` is invoked by the deploy system, not pushed by this entity).