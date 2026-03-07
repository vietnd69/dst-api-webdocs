---
id: mushtree_webbed
title: Mushtree Webbed
description: Manages acid rain interaction, burning behavior, and webbing-specific loot for the webbed mushtree structure.
tags: [environment, entity, loot, combat]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: af43ac80
system_scope: environment
---

# Mushtree Webbed

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mushtree_webbed` prefab implements a webbed mushtree structure that reacts to acid rain events and fire. It uses components from the Entity Component System to handle acid infusion tracking (`acidinfusible`), loot generation (`lootdropper`), and burning behavior (`burnable`). When chopped or burnt, it drops webbing-specific resources and interacts with nearby spider dens. The visual state of acid coverage is synchronized to clients via networked smoke indicators.

## Usage example
```lua
-- Example: Create a webbed mushtree instance with default behavior
local inst = Prefab("mushtree_tall_webbed", fn, assets, prefabs)
local tree = SpawnPrefab("mushtree_tall_webbed")

-- Example: Trigger an acid rain infusion event (typically handled by world events)
if tree.components.acidinfusible then
    tree.components.acidinfusible:Infuse()
end
```

## Dependencies & tags
**Components used:** `acidinfusible`, `burnable`, `lootdropper`, `inspectable`, `workable`, `light`, `mini mapentity`, `obstaclephysics`, `soundemitter`, `transform`, `animstate`, `network`

**Tags added:** `shelter`, `mushtree`, `webbed`, `cavedweller`, `plant`, `tree`, `FX` (on burnt effect prefab)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_smoke_number` | `net_tinybyte` | `0` | Networked variable controlling visible acid smoke symbol count (0, 1, or 4). |
| `_last_acid_start_time` | number or nil | `nil` | Timestamp marking when the last acid rain event started. |
| `_acid_initialize_task` | Task or nil | `nil` | Delayed task that initializes acid rain response. |
| `_acid_reset_task` | Task or nil | `nil` | Delayed task that resets acid state. |
| `_acid_art_update_task` | Task or nil | `nil` | Periodic task that updates visual acid phase. |
| `_acidsmokes` | table | `{}` (client only) | Tracks acid smoke effect prefabs and their symbol indices. |
| `_phase1_show` | number or nil | `nil` | Random integer (`1`–`3`) used to select which acid symbol is shown in phase 1. |

## Main functions
### `MakeAcidSmokeForSymbol(inst, symbol_index)`
* **Description:** Creates and configures an acid smoke effect attached to a specific animation symbol on the tree.
* **Parameters:**  
  `inst` (Entity) — the tree instance.  
  `symbol_index` (number) — symbol index (`1`–`3`) to attach smoke to.  
* **Returns:** `nil`.

### `get_acid_perish_time(inst)`
* **Description:** Calculates elapsed time since the last acid rain event began.
* **Parameters:**  
  `inst` (Entity) — the tree instance.  
* **Returns:** number — time in seconds since acid infusion started.

### `try_acid_art_update(inst)`
* **Description:** Updates visual acid phase (smoke symbols and animations) based on elapsed time and current phase threshold. Sends `acidphasedirty` event on phase change.
* **Parameters:**  
  `inst` (Entity) — the tree instance.  
* **Returns:** `nil`.

### `OnAcidInfused(inst)`
* **Description:** Starts the acid rain response after a short delay when acid infuses the tree.
* **Parameters:**  
  `inst` (Entity) — the tree instance.  
* **Returns:** `nil`.

### `OnAcidUninfused(inst)`
* **Description:** Schedules a delayed reset of acid state based on how long the current rain has lasted.
* **Parameters:**  
  `inst` (Entity) — the tree instance.  
* **Returns:** `nil`.

### `tree_burnt(inst)`
* **Description:** Handles tree destruction after burning completes — drops ash/charcoal, spawns burnt FX, and removes the entity.
* **Parameters:**  
  `inst` (Entity) — the tree instance.  
* **Returns:** `nil`.

### `inspect_tree(inst)`
* **Description:** Returns `"ACIDCOVERED"` if the tree is currently infused with acid or recovering from it.
* **Parameters:**  
  `inst` (Entity) — the tree instance.  
* **Returns:** `"ACIDCOVERED"` or `nil`.

### `workcallback(inst, worker, workleft)`
* **Description:** Handles chopping actions — plays sounds, triggers nearby spider dens, and triggers loot drop upon completion.
* **Parameters:**  
  `inst` (Entity) — the tree instance.  
  `worker` (Entity) — the chopping entity (player or tool).  
  `workleft` (number) — remaining work units.  
* **Returns:** `nil`.

### `onsave(inst, data)`
* **Description:** Serializes acid and burn state to save data.
* **Parameters:**  
  `inst` (Entity) — the tree instance.  
  `data` (table) — save data table to populate.  
* **Returns:** `nil`.

### `onload(inst, data)`
* **Description:** Restores acid and burn state from save data on load.
* **Parameters:**  
  `inst` (Entity) — the tree instance.  
  `data` (table) — loaded save data.  
* **Returns:** `nil`.

### `CLIENT_OnSmokeNumberDirty(inst)`
* **Description:** Syncs acid smoke effects with the networked `_smoke_number` value on the client.
* **Parameters:**  
  `inst` (Entity) — the tree instance.  
* **Returns:** `nil`.

## Events & listeners
- **Listens to:**  
  `onremove` (on smoke prefabs) — removes self-reference when smoke effect is destroyed.  
  `animover` (on burnt FX) — removes burnt FX after animation completes.  
  `acidphasedirty` (client only) — triggers `CLIENT_OnSmokeNumberDirty` when acid phase changes.  
- **Pushes:**  
  `creepactivate` (on nearby spider dens) — when the tree is chopped.  
  `entity_droploot` — after loot drops via `lootdropper`.  
  `on_loot_dropped`, `loot_prefab_spawned` — on individual loot items via `lootdropper`.