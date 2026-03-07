---
id: stalagmite
title: Stalagmite
description: A breakable rock formation that yields mineral resources when mined and supports seasonal event behaviors like Halloween spooking.
tags: [environment, mining, resource]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: b537cff0
system_scope: environment
---

# Stalagmite

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`stalagmite` is a reusable prefab template for breakable rock formations that provides mining interactions, dynamic loot tables, and visual feedback. It implements the `workable`, `lootdropper`, and `inspectable` components and is extended into three variants: `stalagmite_full`, `stalagmite_med`, and `stalagmite_low`. It integrates with the `spooked` component to trigger Halloween-themed effects when a spooked player mines it.

## Usage example
```lua
local inst = SpawnPrefab("stalagmite_full")
inst.Transform:SetPosition(x, y, z)
inst:AddTag("worldspawn")
```

## Dependencies & tags
**Components used:** `lootdropper`, `workable`, `inspectable`, `spooked` (indirect via callback), `burnable`, `fueled` (checked conditionally in `lootdropper.lua`)
**Tags:** Adds `boulder`; checks `burnt`, `burnable`, `fueled`, `structure`, `monster`, `animal`, `creaturecorpse`, `hive`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `scrapbook_anim` | string | `"full"` | Animation state name used in scrapbook illustrations. |
| `workable.workleft` | number | `TUNING.ROCKS_MINE`, `TUNING.ROCKS_MINE_MED`, or `TUNING.ROCKS_MINE_LOW` | Remaining work required to fully break the stalagmite. |
| `workable.action` | string | `"MINE"` | Action name displayed in the UI for mining interactions. |
| `lootdropper.chanceloottable` | string | `'full_rock'`, `'med_rock'`, or `'low_rock'` | Loot table key determining possible loot outcomes. |

## Main functions
### `workcallback(inst, worker, workleft)`
*   **Description:** Callback invoked on each mining tick. Decreases remaining work, plays an appropriate animation (`low`, `med`, or `full`), triggers Halloween spook effects, and removes the stalagmite upon completion while dropping loot.
*   **Parameters:**
    *   `inst` (Entity) — The stalagmite instance.
    *   `worker` (Entity) — The entity performing the mining.
    *   `workleft` (number) — Remaining work required to break the stalagmite.
*   **Returns:** Nothing.
*   **Error states:** If `workleft <= 0`, the stalagmite is destroyed; otherwise, animation updates occur only if the current animation doesn’t match the expected one for the current work level.

## Events & listeners
- **Listens to:** None (dependencies are invoked via direct method calls).
- **Pushes:** `rock_break_fx` is spawned at position; `entity_droploot` is pushed via `lootdropper:DropLoot()`.