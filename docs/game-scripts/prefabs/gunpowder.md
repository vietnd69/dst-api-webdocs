---
id: gunpowder
title: Gunpowder
description: A small explosive item that detonates when ignited or placed in a mole's inventory.
tags: [combat, explosive, item]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 906a5997
system_scope: entity
---

# Gunpowder

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `gunpowder` prefab represents a deployable explosive item used in combat and trap mechanics. It is a stackable inventory item that explodes when ignited via fire or when placed inside a mole's inventory. It integrates with several core components—`burnable`, `explosive`, `inventoryitem`, and `bait`—to manage ignition, detonation, and interactivity.

## Usage example
```lua
local inst = SpawnPrefab("gunpowder")
inst.Transform:SetPosition(x, y, z)
inst.components.explosive.explosivedamage = 250
inst.components.burnable:Ignite(10) -- ignite and set burning duration
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `burnable`, `explosive`, `inventoryitem`, `bait`
**Tags:** Adds `molebait` and `explosive`; checks for `mole` owner in `OnPutInInventoryFn`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `explosivedamage` | number | `TUNING.GUNPOWDER_DAMAGE` | Damage dealt by the explosion upon detonation. |

## Main functions
### `OnIgniteFn(inst)`
* **Description:** Custom handler fired when the gunpowder is ignited. Plays a hissing sound and initiates default burning behavior.
* **Parameters:** `inst` (Entity) — the gunpowder instance.
* **Returns:** Nothing.

### `OnExtinguishFn(inst)`
* **Description:** Custom handler fired when the gunpowder is extinguished. Stops the hissing sound and resets burning state.
* **Parameters:** `inst` (Entity) — the gunpowder instance.
* **Returns:** Nothing.

### `OnExplodeFn(inst)`
* **Description:** Custom handler fired when the gunpowder detonates. Stops the hissing sound and spawns the `"explode_small"` FX prefab at the gunpowder’s location.
* **Parameters:** `inst` (Entity) — the gunpowder instance.
* **Returns:** Nothing.

### `OnPutInInv(inst, owner)`
* **Description:** Custom handler fired when the gunpowder is placed into an inventory. If the owner is a `"mole"`, it immediately triggers `OnBurnt()` on the explosive component (simulating detonation).
* **Parameters:**  
  - `inst` (Entity) — the gunpowder instance.  
  - `owner` (Entity) — the entity receiving the item in their inventory.  
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None explicitly defined in this script (event handling is delegated via component hooks).
- **Pushes:** `OnExplodeFn` indirectly triggers `explosive:OnExplode()` via component behavior; the `"explode_small"` prefab is spawned as visual feedback.