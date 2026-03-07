---
id: rocks
title: Rocks
description: Defines prefabs for various rock types in the game, each with unique mining behavior, loot tables, and visual appearances.
tags: [loot, mining, environment, prefabs]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c632ebd1
system_scope: environment
---

# Rocks

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines multiple rock prefabs used in the game, each with distinct physical properties, animations, loot tables, and mining mechanics. It implements core functionality for mining via the `workable` component, loot generation via `lootdropper`, and special behaviors for petrified trees and moon rocks. The prefabs are registered using the `Prefab()` function and share common setup logic via the `baserock_fn` factory.

## Usage example
```lua
-- Create a standard rock
local rock = Prefab("rock1", "prefabs/rocks")
rock.Transform:SetPosition(x, y, z)

-- Create a petrified tree (type dependent on size parameter)
local tree = Prefab("rock_petrified_tree", "prefabs/rocks")
tree.treeSize = 3  -- tall version
tree.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `inspectable`, `spooked`, `physics`, `animstate`, `transform`, `soundemitter`, `minimapentity`, `network`  
**Tags added:** `boulder`, `meteor_protection`, `moonglass`, `shelter`, `NOCLICK` (conditionally)  
**Tags checked:** `burnt`, `structure`, `monster`, `animal`, `creaturecorpse` (via lootdropper logic)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `treeSize` | number | `nil` | Used for petrified trees to determine size category (1=small, 3=tall, 4=old). |
| `rock_type` | number | `nil` | For moonglass rocks, specifies the variant (`1` to `4`). |
| `doNotRemoveOnWorkDone` | boolean | `false` | If `true`, the entity is not removed after work is completed (e.g., moonrock_shell). |
| `showCloudFXwhenRemoved` | boolean | `false` | If `true`, spawns `collapse_small` FX upon removal. |

## Main functions
### `baserock_fn(bank, build, anim, minimapicon, tag, multcolour)`
* **Description:** Factory function that constructs the base rock entity with common components, physics, animation, and tags. Called by all specific rock variants.
* **Parameters:**
  - `bank` (string) - animation bank name.
  - `build` (string) - build/asset name for the animation.
  - `anim` (string or table) - animation(s) to play (supports sequence via table).
  - `minimapicon` (string) - filename for minimap icon.
  - `tag` (string, optional) - additional tag to apply.
  - `multcolour` (number, optional) - color multiplier for tinting (default `0.5`).
* **Returns:** `inst` (entity) — the initialized rock prefab instance.
* **Error states:** If `anim` is a table, only the first animation is played initially; subsequent ones are queued.

### `OnWork(inst, worker, workleft)`
* **Description:** Callback executed during and after mining. Triggers FX, drops loot, and updates animation based on remaining work.
* **Parameters:**
  - `inst` (entity) — the rock entity being worked on.
  - `worker` (entity) — the entity performing the mining.
  - `workleft` (number) — remaining work required to finish.
* **Returns:** Nothing.
* **Error states:** If `workleft > 0`, the animation is set to `low`, `med`, or `full` based on `TUNING.ROCKS_MINE` thresholds. Spook FX may be triggered if conditions are met.

### `OnRockMoonCapsuleWorkFinished(inst)`
* **Description:** Special callback for moonrock shell — spawns `moonrockseed`, removes physics colliders, and erodes the rock away.
* **Parameters:**
  - `inst` (entity) — the moonrock shell entity.
* **Returns:** Nothing.

### `setPetrifiedTreeSize(inst)`
* **Description:** Configures petrified tree variant based on `inst.treeSize` (1–4), setting animation, physics, loot table, and work amount.
* **Parameters:**
  - `inst` (entity) — the petrified tree instance.
* **Returns:** Nothing.

### `set_moonglass_type(inst, new_type)`
* **Description:** Sets the visual variant of a moonglass rock based on `new_type` (1–4).
* **Parameters:**
  - `inst` (entity) — the moonglass rock instance.
  - `new_type` (number) — variant index (1–4).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `workfinished` — used by `rock_moon_shell` to trigger `OnRockMoonCapsuleWorkFinished`.
- **Pushes:**
  - `entity_droploot` — via `lootdropper:DropLoot`.
  - Custom spook events via `spooked:TryCustomSpook`.