---
id: slurtleslime
title: Slurtleslime
description: A small, stackable explosive item that ignites and detonates when set on fire, dealing area damage and creating visual fx.
tags: [combat, environment, item]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 251cd172
system_scope: environment
---

# Slurtleslime

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`slurtleslime` is a small item prefab that functions as an explosive device. It can be stacked, used as fuel, and detonated when ignited. When lit, it emits a hissing sound and explodes after a short delay, dealing fixed damage to entities and structures in proximity while suppressing lighting effects on explosion. It integrates closely with the `burnable`, `explosive`, `fuel`, and `stackable` systems.

## Usage example
```lua
local inst = SpawnPrefab("slurtleslime")
inst.Transform:SetPosition(x, y, z)
inst.components.stackable:DoDrop()
inst.components.burnable:Ignite()
```

## Dependencies & tags
**Components used:** `stackable`, `fuel`, `inventoryitem`, `burnable`, `explosive`, `inspectable`, `hauntable_launch_and_ignite`
**Tags:** Adds `explosive`

## Properties
No public properties.

## Main functions
### `OnIgniteFn(inst)`
* **Description:** Custom ignition handler that starts a hissing sound and delegates burning to the default burn routine.
* **Parameters:** `inst` (Entity) — the slurtleslime instance being ignited.
* **Returns:** Nothing.

### `OnExtinguishFn(inst)`
* **Description:** Custom extinguish handler that stops the hissing sound and calls the default extinguish logic.
* **Parameters:** `inst` (Entity) — the slurtleslime instance being extinguished.
* **Returns:** Nothing.

### `OnExplodeFn(inst)`
* **Description:** Custom explosion handler that kills the hissing sound and spawns a visual `explode_small` prefab at the slurtleslime’s position.
* **Parameters:** `inst` (Entity) — the slurtleslime instance exploding.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** None identified.