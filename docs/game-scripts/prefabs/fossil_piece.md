---
id: fossil_piece
title: Fossil Piece
description: A consumable inventory item that can be deployed to spawn a Fossil Stalker and repair structures using fossil material.
tags: [inventory, crafting, deployable, repair]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e5fd4349
system_scope: inventory
---

# Fossil Piece

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `fossil_piece` prefab is an inventory item used primarily as a repair material and deployment resource. When deployed, it spawns a `fossil_stalker` at the target location and consumes the item. It integrates with the `deployable`, `repairer`, and `stackable` components to support in-game crafting and restoration mechanics. Save/load support ensures fossil type persistence across sessions.

## Usage example
```lua
local inst = SpawnPrefab("fossil_piece")
inst.components.stackable:SetStackSize(5)
inst.components.repairer.workrepairvalue = 2 -- Optional override
-- Deploy at world position pt:
inst.components.deployable:DoDeploy(pt)
```

## Dependencies & tags
**Components used:** `stackable`, `deployable`, `repairer`, `tradable`, `inspectable`, `inventoryitem`, `hauntable`
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fossiltype` | number | `1` (randomly assigned on master) | Identifies the animation variant (`1`–`4`), controls the `"fN"` animation played. |
| `scrapbook_anim` | string | `"f1"` | Animation name used in Scrapbook UI (client-only). |

## Main functions
### `SetFossilType(inst, fossiltype)`
*   **Description:** Sets the fossil's visual variant and updates the animation. Only effective if the type has changed.
*   **Parameters:** `fossiltype` (number) – must be between `1` and `NUM_FOSSIL_TYPES` (inclusive).
*   **Returns:** Nothing.

### `ondeploy(inst, pt)`
*   **Description:** Deploy handler—spawns a `fossil_stalker` at position `pt`, plays the repair sound, prevents collision with placed objects, and consumes the fossil piece by removing it from inventory.
*   **Parameters:** `pt` (vector) – deployment position in world space.
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.