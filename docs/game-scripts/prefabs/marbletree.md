---
id: marbletree
title: Marbletree
description: Creates and configures prefabs for marble trees, which are mineable structures that drop marble loot upon destruction.
tags: [environment, mining, loot]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 71490878
system_scope: environment
---

# Marbletree

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `marbletree.lua` file defines the `marbletree` prefab (and its variants), which represents decorative and mineable stone-like trees found in the game world. These prefabs implement mining functionality through the `workable` and `lootdropper` components. When fully mined, the tree drops marble items, triggers a particle effect, and removes itself from the world. It supports multiple visual variants and integrates with the game’s save/load system to persist animation state.

## Usage example
```lua
-- Create a marble tree at a specific location
local tree = Prefab("marbletree", fn, assets, prefabs) -- via makeMarbleTree(animnumber)
local inst = tree()
inst.Transform:SetPosition(x, y, z)
TheWorld:SpawnPrefab(inst)

-- Modify work left before mining completes
inst.components.workable:SetWorkLeft(5)
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `inspectable`, `hauntable`, `burnable`, `fueled`, `obstacle`, `minimapentity`, `soundemitter`, `animstate`, `transform`, `network`  
**Tags:** No tags are explicitly added or removed in this file. Tag-based behaviors are inherited from helper functions like `MakeHauntableWork` and `MakeSnowCoveredPristine`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `animnumber` | number | `1`–`4` (random) or `0` (for default variant) | Identifier for the tree’s visual variant; determines animation name and loot count. |
| `scrapbook_anim` | string | `"full_1"` | Animation used in the Scrapbook UI. |

## Main functions
### `makeMarbleTree(animnumber)`
* **Description:** Factory function that returns a `Prefab` instance for a marble tree variant. If `animnumber > 0`, creates a specific variant; if `animnumber == 0`, it creates a tree whose animation is randomly chosen at spawn time.
* **Parameters:** `animnumber` (number) — variant ID (`0` for random, `1`–`4` for specific animations).
* **Returns:** A `Prefab` instance with a deferred `fn()` constructor.
* **Error states:** None.

## Events & listeners
- **Listens to:** None explicitly defined in this file. Event listeners are handled indirectly via callbacks (e.g., `onworked` for the `workable` component).
- **Pushes:** `entity_droploot` — triggered by `lootdropper:DropLoot` when the tree is destroyed.