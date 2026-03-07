---
id: oceantree_pillar
title: Oceantree Pillar
description: A large, water-based environmental structure that provides canopy shade, drops loot when chopped or hit, and interacts with boat collisions and lightning strikes.
tags: [environment, structure, loot, physics, boss]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c91c9c90
system_scope: environment
---

# Oceantree Pillar

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `oceantree_pillar` is a large static environmental structure that functions as a canopy tree in ocean Biomes. It manages shade zone tracking for players via the `playerprox` component, responds to chopping actions, collision events (e.g., from boats), and lightning strikes, and coordinates the spawning and removal of surrounding ocean vines. It also handles the visual and auditory feedback for falling, burning, and wave generation after destruction.

The component is implemented as a prefab (not a standalone component class), but it interacts with multiple core components including `workable`, `burnable`, `lootdropper`, `canopyshadows`, `playerprox`, `lightningblocker`, and `distancefade`. It relies on external prefabs (e.g., `oceantree_leaf_fx_fall`, `oceanvine`) for visual and gameplay effects.

## Usage example
```lua
-- Example: Spawning a new oceantree_pillar manually at world position
local pt = Vector3(100, 0, -200)
local tree = SpawnPrefab("oceantree_pillar")
if tree ~= nil then
    tree.Transform:SetPosition(pt.x, pt.y, pt.z)
    tree:PushEvent("onprepareadd")
    TheWorld:PushEvent("spawnforestentity", tree)
end
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `burnable`, `canopyshadows`, `playerprox`, `lightningblocker`, `distancefade`, `inspectable`.  
**Tags added:** `shadecanopysmall`, `event_trigger`, `ignorewalkableplatforms`, `FX`, `NOCLICK`.  
**Tags checked:** `playerghost`, `beaver`, `boat`, `oceanvine`, `webbed`, `shadecanopy`, `shadecanopysmall`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `players` | table | `{}` | Tracks players currently in proximity for canopy zone counting. |
| `logs` | number | `nil` | Remaining logs to drop when tree falls. Set to `15` on chop-down or burn. |
| `items_to_drop` | table | `nil` | List of prefabs to drop over time after destruction. Populated dynamically. |
| `dropleaftask` | Task | `nil` | Periodic task handling leaf particle drops during destruction. |
| `drop_items_task` | Task | `nil` | Task scheduling item drops after destruction. |
| `drop_logs_task` | Task | `nil` | Task scheduling log drops after destruction. |
| `leafcounter` | number | `nil` | Cumulative counter to track leaf drop progress. |
| `droppedvines` | boolean | `nil` | Whether vine spawning has already occurred (persisted across saves). |
| `_hascanopy` | net_bool | `true` | Networked bool indicating if the pillar still provides canopy coverage. |
| `dropleaves` | boolean | Not stored | Temporary flag for leaf-drop behavior (not a persistent property). |
| `droppedvines` | boolean | `nil` | Whether vines have been spawned (persisted). |

## Main functions
### `OnFar(inst, player)`
*   **Description:** Called when a player moves out of the canopy radius. Decrements the player's `canopytrees` counter and updates their canopy zone status.
*   **Parameters:** `inst` (Entity) — the oceantree_pillar instance. `player` (Entity) — the player entity leaving range.
*   **Returns:** Nothing.
*   **Error states:** No specific failure cases; handles invalid players via `player:IsValid()`.

### `OnNear(inst, player)`
*   **Description:** Called when a player enters the canopy radius. Increments the player's `canopytrees` counter and notifies the player of zone change.
*   **Parameters:** `inst` (Entity), `player` (Entity).
*   **Returns:** Nothing.

### `chop_tree(inst, chopper, chopsleft, numchops)`
*   **Description:** Callback invoked during each chopping tick. Plays chop animation and sounds, triggers particle effects (leaf falls), and emits cracking sounds at 20% and 12% progress.
*   **Parameters:** `inst` (Entity), `chopper` (Entity, optional), `chopsleft` (number), `numchops` (number).
*   **Returns:** Nothing.

### `chop_down_tree(inst, chopper)`
*   **Description:** Triggered upon full completion of chopping. Initiates tree fall animation, spawns splash/wave effects, and drops loot. Sets `removeme` and `persists = false` for cleanup.
*   **Parameters:** `inst` (Entity), `chopper` (Entity, optional).
*   **Returns:** Nothing.

### `OnBurnt(inst)`
*   **Description:** Handles tree behavior when fully burnt. Similar to `chop_down_tree` but uses charcoal as loot and triggers a burnt animation.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnCollide(inst, data)`
*   **Description:** Handles boat collisions. If impact velocity is high (`> 0.8`), triggers RAM-like behavior: drops items, spawns missing vines, shakes camera, and updates `last_ram_time` to prevent spamming.
*   **Parameters:** `inst` (Entity), `data` (table) — collision data including `other` (boat entity) and `hit_dot_velocity`.
*   **Returns:** Nothing.

### `OnLightningStrike(inst)`
*   **Description:** Called when lightning strikes the pillar. Schedules delayed drops of small random items (leaves, twigs, etc.) using a task to avoid overlap.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnRemoveEntity(inst)`
*   **Description:** Cleans up the entity and its dependencies: removes child objects (`roots`, `_ripples`), notifies all nearby players to decrement canopy count, and manages ocean vine removal logic (spilled vines fall if unsupported).
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `OnSave(inst, data)`
*   **Description:** Persists state (`droppedvines`) to save data.
*   **Parameters:** `inst` (Entity), `data` (table) — save table to update.
*   **Returns:** Nothing.

### `OnLoad(inst, data)`
*   **Description:** Loads `droppedvines` state from save data. Prevents vine spawning if already spawned.
*   **Parameters:** `inst` (Entity), `data` (table) — loaded save data.
*   **Returns:** Nothing.

### `startvines(inst)`
*   **Description:** Spawns 3–4 ocean vines around the pillar over time if `droppedvines` is false.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

### `spawnvine(inst)`
*   **Description:** Spawns a single `oceanvine` prefab at a random position within a configured radius, marks it empty, and triggers fall sound/animation.
*   **Parameters:** `inst` (Entity).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**
  - `hascanopydirty` — removes `canopyshadows` component if `_hascanopy` becomes false.
  - `on_collide` — triggers `OnCollide` handler.
  - `onburnt` — triggers `OnBurnt` logic.
  - `onfinishwork` — internally routed to `chop_down_tree`.
  - `onwork` — internally routed to `chop_tree`.
  - `animover` — used in `chop_down_tree`/`OnBurnt` to coordinate removal after animation finishes; also in leaf prefabs to remove after animation.

- **Pushes:**
  - `onchangecanopyzone` — sent to players when their `canopytrees` count changes.
  - `activated` — sent to nearby `webbed` cocoons when RAM event occurs.
  - `entity_droploot` — sent after loot is dropped via `lootdropper`.