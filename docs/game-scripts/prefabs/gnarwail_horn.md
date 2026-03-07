---
id: gnarwail_horn
title: Gnarwail Horn
description: A one-time-use musical instrument that spawns two directional attack waves and tends nearby farm plants when used in water.
tags: [combat, inventory, environment, crafting]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3a280d7a
system_scope: environment
---

# Gnarwail Horn

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `gnarwail_horn` is a consumable item prefab that functions as a spellcasting tool. When used in water (verified via `ReticuleValidFn`), it spawns two symmetrical attack waves and applies a tending effect to nearby tendable farm plants. It uses the `finiteuses`, `equippable`, `spellcaster`, and `reticule` components to manage usage, animation, targeting, and functionality.

## Usage example
```lua
-- Typically instantiated via the game's prefab system, e.g.:
local horn = SpawnPrefab("gnarwail_horn")

-- Used by a character via inventory action or spellcasting:
local owner = GetPlayer()
if owner.components.inventory:HasItem(horn) then
    owner.components.inventory:PullItem(horn)
    owner.components.spellcaster:UseSpell(horn, target_position)
end
```

## Dependencies & tags
**Components used:** `reticule`, `finiteuses`, `equippable`, `inventoryitem`, `floater`, `inspectable`, `tradable`, `spellcaster`, `farmplanttendable`, `spawnprefab`, `spawnattackwave`, `Vector3`, `TUNING`
**Tags:** Adds `gnarwail_horn`, `nopunch`, `allow_action_on_impassable`; checks `tendable_farmplant` on nearby entities.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `spelltype` | string | `"MUSIC"` | Indicates the type of action used to trigger the spell. |
| `playsound` | string | `"hookline/creatures/gnarwail/horn"` | Sound event played when the spell is cast. |
| `PLANT_TAGS` | table | `{"tendable_farmplant"}` | Tags used to filter eligible farm plants for tending. |

## Main functions
### `create_waves(inst, target, position)`
*   **Description:** Spawns two attack waves in a V-shaped formation centered on the player's facing direction and tends all nearby tendable farm plants within range. Decrements uses upon successful wave spawn.
*   **Parameters:**  
    `inst` (Entity) — The `gnarwail_horn` instance.  
    `target` (Entity or nil) — Unused in current implementation.  
    `position` (Vector3) — World position where the spell was cast (source location).
*   **Returns:** Nothing.
*   **Error states:** Returns early if `GetGrandOwner()` yields `nil`. No waves or tending occur if the owner cannot be resolved.

## Events & listeners
- **Listens to:** None explicitly.
- **Pushes:** `percentusedchange` (via `finiteuses:SetUses`) and `toolbroke` (via `inventoryitem.owner:PushEvent`) when uses deplete.