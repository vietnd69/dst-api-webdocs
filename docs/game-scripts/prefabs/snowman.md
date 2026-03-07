---
id: snowman
title: Snowman
description: Manages the lifecycle, growth, decoration, and destruction of a snowman entity that can be built and modified in the game world.
tags: [environment, entity, physics, inventory]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: a37bfc9d
system_scope: environment
---

# Snowman

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `snowman` prefab represents a snowman entity in DST that can be grown by rolling it over snow, decorated with items (e.g., hats, coal), stacked with additional snowballs, and eventually destroyed via hammering. It integrates with multiple systems: physics for rolling and pushing, inventory for holding decorated items, waxable for preservation against melting, and workable for interactive destruction. The component relies heavily on `snowmandecoratable` to manage decorations, stacking, and hat equipping, and acts as a central coordinator for various state-driven behaviors.

## Usage example
```lua
-- Create a snowman instance and configure its initial size
local inst = SpawnPrefab("snowman")
inst.Transform:SetPosition(x, y, z)
inst:SetSize("med") -- Set to medium size

-- Add a hat to the snowman (server-side only)
if inst.components.snowmandecoratable and TheWorld.ismastersim then
    local hat = SpawnPrefab("tophat")
    hat.components.equippable.equipslot = EQUIPSLOTS.HEAD
    inst.components.snowmandecoratable:EquipHat(hat)
end
```

## Dependencies & tags
**Components used:**  
`snowmandecoratable`, `pushable`, `waxable`, `colourtweener`, `workable`, `inventoryitem`, `heavyobstaclephysics`, `submersible`, `symbolswapdata`, `equippable`, `lootdropper`, `inspectable`, `snowballmelting`, `updatelooper`.

**Tags:**  
Adds `heavy`, `heavylift_lmb`, `pushing_roll`, `equipmentmodel` (on hat FX), `FX` (on FX prefabs), `NOCLICK` (on FX prefabs), `decor` (on rolling FX), `waxedplant` (added when waxed).

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `snowaccum` | number | `0` | Accumulated snow used for size progression tracking while rolling. |
| `inst.iswaxing` | net_bool | `false` | Networked boolean indicating if wax is currently being applied. |
| `inst._pushingtask`, `inst._nosnowtask`, `inst._rollingfx` | task/fx | `nil` | Internal state for rolling behavior (not saved). |

## Main functions
### `SetSize(size, growanim)`
* **Description:** Changes the snowman's base size (`"small"`, `"med"`, `"large"`), updates animations, physics radius, and triggers re-evaluation of waxable/pushable states. Only valid for the server.
* **Parameters:**  
  `size` (string) — target size.  
  `growanim` (boolean, optional) — whether to play a grow animation (e.g., `"small_to_med"`).
* **Returns:** Nothing.
* **Error states:** Invalid sizes fall back to the current size.

### `OnWork(inst, worker, workleft, numwork)`
* **Description:** Handles hammer interactions. Destroying the snowman drops snowball loot; intermediate hits remove hats, decor, or stack layers.
* **Parameters:**  
  `inst` (entity) — the snowman instance.  
  `worker` (entity) — the hammering player.  
  `workleft` (number) — remaining work.  
  `numwork` (number) — number of hits.
* **Returns:** Nothing.

### `OnWaxed(inst, doer, waxitem)`
* **Description:** Applies beeswax to preserve the snowman against melting. Ends decoration, spawns FX, changes animation tint, and modifies behavior (e.g., disables melting).
* **Parameters:**  
  `inst` (entity) — the snowman.  
  `doer` (entity) — waxing actor.  
  `waxitem` (entity, optional) — waxing tool.
* **Returns:** `true` on success; `false` if conditions prevent waxing (e.g., rolling, held, or small and unstacked).
* **Error states:** Returns `false` if the snowman is rolling or held, or if base size is `"small"` and not stacked.

### `TryHitAnim(inst)`
* **Description:** Plays a size-appropriate hit animation and queues ground idle.
* **Parameters:**  
  `inst` (entity) — the snowman instance.
* **Returns:** `true` if animation played; `false` if currently pushing.
* **Error states:** No effect if snowman is being pushed.

### `ConfigureWaxed(inst)`
* **Description:** Finalizes waxing by removing waxable component, adding `waxedplant` tag, and stopping melting.
* **Parameters:**  
  `inst` (entity) — the snowman instance.
* **Returns:** Nothing.

### `CheckLiftAndPushable(inst)`
* **Description:** Dynamically manages pushable component based on state: removes it if decorated, stacked, or waxed; adds it otherwise.
* **Parameters:**  
  `inst` (entity) — the snowman instance.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
  `basesizedirty` (client): refreshes physics size.  
  `iswaxingdirty` (client): updates wax fade effect state.  
  `onremove`, `enterlimbo` (rolling FX): detaches FX from parent.  
  `animover` (debris/rolling FX): removes FX.

- **Pushes:**  
  `colourtweener_start` (via `colourtweener`): start of tint tween.  
  `loot_prefab_spawned`, `on_loot_dropped` (via `lootdropper`): loot spawn events.  
  `stoppushing`, `startpushing` (via `pushable`): push state changes.  
  `ms_endsnowmandecorating`, `ms_closepopup` (via `snowmandecoratable`): decoration session end.

- **Server-side only (listeners):**  
  `onputininventory` → triggers `OnPutInInventory`.  
  `onremove` (via `snowmandecoratable`) → triggers `onclosefn`.  
  `ms_closepopup` (via `snowmandecoratable`) → triggers `onclosefn`.
