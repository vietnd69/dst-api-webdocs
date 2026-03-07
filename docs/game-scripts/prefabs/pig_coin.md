---
id: pig_coin
title: Pig Coin
description: A consumable item that, when used, spawns a random Pig Elite Fighter as a follower and removes itself from play.
tags: [inventory, consumable, combat, ai]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: bd5e212a
system_scope: inventory
---

# Pig Coin

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `pig_coin` prefab represents a one-time-use item that summons a Pig Elite Fighter when used. It is equipped with the `spellcaster`, `stackable`, `tradable`, `inspectable`, and `inventoryitem` components. The item can only be used on locomotor targets in PvP mode (`canonlyuseonlocomotorspvp = true`), can be used directly from inventory (`canusefrominventory = true`), and is valid for targeting (`canuseontargets = true`). Its visual and gameplay behavior includes an idle sparkle animation loop.

## Usage example
```lua
local coin = SpawnPrefab("pig_coin")
coin.Transform:SetPosition(x, y, z)
-- When used via inventory action:
-- spellfn(coin, target_entity, nil, caster_entity)
```

## Dependencies & tags
**Components used:** `stackable`, `spellcaster`, `tradable`, `inspectable`, `inventoryitem`, `rider`, `follower`  
**Tags:** `cointosscast` (added for casting recognition), internally checked: `player`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fxcolour` | table (RGB) | `{248/255, 248/255, 198/255}` | Color value used for FX rendering (client-side). |
| `castsound` | string | `"dontstarve/pig/mini_game/cointoss"` | Sound event played during spell use (client-side). |
| `scrapbook_specialinfo` | string | `"PIGCOIN"` | Identifier used in scrapbook UI. |

## Main functions
### `spellfn(inst, target, pos, caster)`
*   **Description:** Handles the spell effect: spawns a random Pig Elite Fighter (`pigelitefighter1` through `pigelitefighter4`) at the caster's position, sets it as a follower of the caster, moves it to a nearby valid location, and removes the coin. If the coin is stacked, one item is split off and removed; otherwise the entire instance is removed.
*   **Parameters:**
    *   `inst` (Entity) — the pig coin prefab instance.
    *   `target` (Entity or nil) — the target entity (unused in logic).
    *   `pos` (Vector3 or nil) — target position (unused; position derived from caster).
    *   `caster` (Entity or nil) — the entity using the coin (must not be `nil` for spawning).
*   **Returns:** Nothing.
*   **Error states:** If `caster` is `nil`, no fighter is spawned. If no valid walkable offset is found, the fighter spawns at the origin with `y = 0`.

### `shine(inst)`
*   **Description:** A recursive task that plays the "sparkle" animation and schedules the next sparkle interval, creating a continuous idle animation loop.
*   **Parameters:**
    *   `inst` (Entity) — the pig coin instance.
*   **Returns:** Nothing.
*   **Error states:** Does nothing if "sparkle" animation is already playing (checked via `IsCurrentAnimation`).

## Events & listeners
- **Listens to:** None explicitly defined in the constructor. Animation and task scheduling are handled procedurally.
- **Pushes:** The coin does not push any custom events itself.

