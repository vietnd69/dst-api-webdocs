---
id: stalagmite_tall
title: Stalagmite Tall
description: A mineable terrain feature that yields rock, flint, gems, and other resources when broken.
tags: [mining, environment, resource, world]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 445c359e
system_scope: environment
---

# Stalagmite Tall

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`stalagmite_tall.lua` defines three variants (`stalagmite_tall_full`, `stalagmite_tall_med`, `stalagmite_tall_low`) of a tall stalagmite terrain structure. It provides mineable rock formations found in caves and the main world, releasing loot upon destruction. The prefab uses the `workable` component to handle mining progression and feedback, and the `lootdropper` component to spawn resources. It is part of DST’s world generation and environmental resource system.

## Usage example
```lua
-- Typical internal usage (in prefab def)
local function fullrock()
    local inst = commonfn("full")
    inst.components.lootdropper:SetChanceLootTable('stalagmite_tall_full_rock')
    return inst
end

return Prefab("stalagmite_tall_full", fullrock, assets, prefabs)
```
Manual instantiation is not common; this prefab is typically spawned via worldgen or scenario logic.

## Dependencies & tags
**Components used:** `lootdropper`, `inspectable`, `workable`, `burnable` (via `MakeHauntableWork`), `physics` (via `MakeObstaclePhysics`), `transform`, `animstate`, `soundemitter`, `minimapentity`, `network`  
**Tags:** Adds `boulder`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `type` | string | `"_0"` or `"_1"` | Suffix for animation variant (left/right-handed rock). Set once during construction via random choice. |
| `scrapbook_anim` | string | `"full_1"` | Animation frame name used in the scrapbook view. |

## Main functions
### `workcallback(inst, worker, workleft)`
* **Description:** Handles mining progress. When `workleft <= 0`, triggers particle effect, drops loot, and removes the stalagmite. Otherwise, plays a dynamic animation based on remaining work (full, med, or low).
* **Parameters:**  
  - `inst` (Entity) — the stalagmite instance.  
  - `worker` (Entity) — the entity performing the mining (unused in this callback).  
  - `workleft` (number) — remaining work units needed to finish mining.  
* **Returns:** Nothing.
* **Error states:** None. Misuses or edge-case values are handled internally via `math.random()`–based animations and loot tables.

## Events & listeners
- **Listens to:** None.  
- **Pushes:** `entity_droploot` — fired when `lootdropper:DropLoot` completes.