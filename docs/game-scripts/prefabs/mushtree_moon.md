---
id: mushtree_moon
title: Mushtree Moon
description: Creates and configures a light-emitting, shatterable cave tree that spawns spores, drops loot when damaged, and can regrow or decay over time.
tags: [environment, entity, tree, decay, spawner]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d541b0d8
system_scope: environment
---

# Mushtree Moon

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`mushtree_moon` is a prefab factory for a Tall Moon Mushtree entity — a light-emitting, cave-dwelling tree that drops loot when chopped, periodically spawns spores above it, and supports regrowth and decay mechanics. It integrates with multiple components: `burnable`, `lootdropper`, `workable`, `periodicspawner`, `plantregrowth`, and `timer`. The tree can transition to a stump when chopped or burnt, and the stump eventually decays and removes itself after a delay.

## Usage example
```lua
-- Create a Moon Mushtree instance
local tree = SpawnPrefab("mushtree_moon")
if tree ~= nil then
    tree.Transform:SetPosition(x, y, z)
end
```

## Dependencies & tags
**Components used:** `burnable`, `lootdropper`, `inspectable`, `workable`, `periodicspawner`, `plantregrowth`, `timer`, `propagator`, `light`, `animstate`, `soundemitter`, `minimapentity`, `transform`, `network`.

**Tags added:** `cavedweller`, `mushtree`, `plant`, `shelter`, `tree`, `FX` (only for burnt fx entity).

**Tags removed or conditionally applied:** `stump`, `shelter` — added/removed during stump transition.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_changetask` | function task or nil | `nil` | Task handle for anim/build transitions during regrowth/chopping. Cancelled on state change. |
| `scrapbook_specialinfo` | string | `"TREE"` | Metadata used for Scrapbook display. |

## Main functions
### `maketree(name, data, state)`
* **Description:** Returns a prefab function that constructs a Moon Mushtree entity (or stump variant) with default components, animations, light, and loot logic. Used internally by `treeset`.
* **Parameters:**
  - `name` (string) — prefab name (e.g., `"mushtree_moon"`).
  - `data` (table) — configuration table containing build, loot, light, sound, and tuning values.
  - `state` (string) — optional starting state: `"stump"` or default (full tree).
* **Returns:** function — a `Prefab` constructor function returning a fully configured entity instance.

### `onsave(inst, data)`
* **Description:** Saves state to be persisted across sessions (e.g., whether the tree is currently burnt or has been reduced to a stump).
* **Parameters:**
  - `inst` (Entity) — the tree instance.
  - `data` (table) — the save table to populate.
* **Returns:** Nothing. Modifies `data.burnt` and `data.stump` keys.

### `tree_burnt(inst)`
* **Description:** Handles full-tree burn completion: drops ash and charcoal (50% chance), spawns burnt FX, and removes the tree.
* **Parameters:**
  - `inst` (Entity) — the burnt tree instance.
* **Returns:** Nothing.

### `stump_burnt(inst)`
* **Description:** Handles stump burn completion: drops one ash and removes the stump.
* **Parameters:**
  - `inst` (Entity) — the burnt stump instance.
* **Returns:** Nothing.

### `dig_up_stump(inst)`
* **Description:** Called when a player finishes dig action on a stump: drops one log and removes the stump.
* **Parameters:**
  - `inst` (Entity) — the stump instance.
* **Returns:** Nothing.

### `inspect_tree(inst)`
* **Description:** Returns the inspection status for the Tree UI (e.g., `"CHOPPED"` if stump).
* **Parameters:**
  - `inst` (Entity) — the tree instance.
* **Returns:** `string` or `nil` — `"CHOPPED"` if stump, otherwise `nil`.

### `onspawnfn(inst, spawn)`
* **Description:** Custom spawner callback for spore prefabs: spawns a spore slightly offset from the parent tree, plays cough animation, and emits a spore fart sound.
* **Parameters:**
  - `inst` (Entity) — the parent mushtree.
  - `spawn` (Entity) — the spore prefab instance being spawned.
* **Returns:** Nothing.

### `workcallback(inst, worker, workleft)`
* **Description:** Called during chopping to play animation, sound, and force an immediate spore spawn (via `ForceNextSpawn()`). Skips sound if the worker is a ghost.
* **Parameters:**
  - `inst` (Entity) — the tree instance.
  - `worker` (Entity or nil) — the chopping actor (player or null if automated).
  - `workleft` (number) — remaining work needed to finish chopping.
* **Returns:** Nothing.

### `workfinishcallback(inst)`
* **Description:** Called when chopping completes: plays tree-fall sound, transitions the tree to a stump state, and drops loot.
* **Parameters:**
  - `inst` (Entity) — the tree instance.
* **Returns:** Nothing.

### `makeburntfx(name, data)`
* **Description:** Factory for the burnt FX entity: an animated, non-persistent proxy that plays the "chop_burnt" animation and sound before self-removing.
* **Parameters:**
  - `name` (string) — unused (kept for interface).
  - `data` (table) — tree data (bank, build).
* **Returns:** function — a prefab constructor returning a temporary FX entity.

## Events & listeners
- **Listens to:** `timerdone` — handles `decay` timer expiration to remove stump or spawn small puff effect before removal.
- **Pushes:** None directly; delegates event handling to component callbacks (e.g., lootdropper, burnable).
- **Listens to:** `animover` — on burnt FX entity to remove itself when animation completes (or after animation length + `FRAMES`).