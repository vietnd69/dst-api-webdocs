---
id: watertree_root
title: Watertree Root
description: Represents a destructible water obstacle tree that yields wood resources when chopped or collided with by boats.
tags: [environment, resource, collision, tree]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: aaeb95ae
system_scope: environment
---

# Watertree Root

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`watertree_root` is a static environmental entity that functions as a destructible tree obstacle located in water. It provides resources (`driftwood_log` and `twigs`) when chipped away via chop actions or boat collisions. It integrates with the `workable` component for interaction logic (including chop progress tracking and callback handling) and the `lootdropper` component for resource distribution. The entity is also `hauntable`, allowing it to spawn Hauntables under certain conditions. Its visual appearance varies randomly (`artid` 1–3), and the entity persists across saves/load via custom `OnSave`/`OnLoad` hooks.

## Usage example
This is a prefab definition, not a component; typical usage is via `SpawnPrefab("watertree_root")` with optional positional override:
```lua
local inst = SpawnPrefab("watertree_root")
if inst ~= nil then
    inst.Transform:SetPosition(x, y, z)
end
```
No manual component setup is required—the prefab's constructor (`fn()`) handles all component addition and configuration.

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `inspectable`, `boatphysics` (accessed indirectly via event), `hauntable` (via `MakeHauntableWork`), `waterobstaclephysics` (via `MakeWaterObstaclePhysics`).
**Tags:** `ignorewalkableplatforms`, `tree`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `artid` | number | `1` (randomized on spawn) | Animation variant ID (`1`–`3`) used to select idle/hit animations. |
| `max_speed`, `min_speed`, `y_speed`, `y_speed_variance` | number | Defined in constructor (see below) | Loot drop physics parameters passed to `lootdropper`. |
| `spawn_loot_inside_prefab` | boolean | `true` | Configures loot to spawn inside the prefab volume. |

## Main functions
### `chop_tree(inst, chopper, chopsleft, numchops)`
* **Description:** Placeholder callback; not used. The actual chopping logic is handled in `OnWork`.
* **Parameters:** Not called by this code; signature matches typical work callbacks.
* **Returns:** Nothing.

### `OnWork(inst, worker, workleft)`
* **Description:** Called when the workable component completes work (i.e., a chop action finishes). Plays chop sound/animation, checks for full depletion, spawns collapse FX, and drops loot before removing the entity.
* **Parameters:**
  * `inst` (Entity) — the watertree_root instance.
  * `worker` (Entity or nil) — the actor performing the work (player, boat, etc.).
  * `workleft` (number) — remaining work units; when `<= 0`, the tree is fully depleted.
* **Returns:** Nothing.
* **Error states:** Sound selection defaults to `"dontstarve/wilson/use_axe_tree"` if `worker` is `nil`, not a player ghost, not a boat, or not a beaver.

### `OnCollide(inst, data)`
* **Description:** Handles boat collisions. Calculates hit damage scaled by velocity and delegates to `workable:WorkedBy` if a boat with `boatphysics` component is involved.
* **Parameters:**
  * `inst` (Entity) — the watertree_root instance.
  * `data` (table) — collision data, expected to contain `other` (colliding entity) and `hit_dot_velocity`.
* **Returns:** Nothing.
* **Error states:** No-op if `data.other` lacks a `boatphysics` component.

### `onsave(inst, data)` and `onload(inst, data)`
* **Description:** Save/load callbacks that persist and restore `artid`.
* **Parameters:**
  * `inst` (Entity) — the watertree_root instance.
  * `data` (table) — save data table to read/write `artid`.
* **Returns:** Nothing.

### `updateart(inst)`
* **Description:** Updates the active animation based on `inst.artid`.
* **Parameters:** `inst` (Entity) — the watertree_root instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `on_collide` — triggers `OnCollide` when another entity collides with the root.
- **Pushes:** None directly; relies on `workable` and `lootdropper` events internally.