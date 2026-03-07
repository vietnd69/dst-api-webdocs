---
id: trinkets
title: Trinkets
description: Generates prefabs for all trinket items in DST, configuring their physics, tags, components, and game mechanics (e.g., trading, bait, slingshot ammo, ocean fishing).
tags: [inventory, trading, fishing, bait, event]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2fabac83
system_scope: inventory
---

# Trinkets

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
This file defines the `trinkets.lua` prefab generator, responsible for creating all `trinket_X` prefabs (where `X` is a trinket ID from `1` to `NUM_TRINKETS`). It configures each trinket with appropriate tags (e.g., `molebait`, `cattoy`, `slingshotammo`, `oceanfishing_bobber`, `oceanfishing_lure`), components (e.g., `stackable`, `tradable`, `bait`, `oceanfishingtackle`), and special properties such as floating behavior and tradable values. It also enforces locking rules based on Chess progression and seasonal events (e.g., Hallowed Nights).

## Usage example
```lua
-- Generate all trinket prefabs
local trinkets = require "prefabs/trinkets"
-- trinkets is now an array of 45 Prefab objects (for NUM_TRINKETS = 45)
-- Access a specific trinket by index, e.g., trinkets[1] → "trinket_1"

-- Use in a spawner or loot table
inst.prefab = "trinket_3"
```

## Dependencies & tags
**Components used:** `floater`, `tradable`, `stackable`, `inventoryitem`, `inspectable`, `bait`, `oceanfishingtackle`, `reloaditem`, `hauntable`  
**Tags added:** `molebait`, `cattoy`, `oceanfishing_bobber`, `oceanfishing_lure`, `slingshotammo`, `reloaditem_ammo`  
**Tag checks:** `TheWorld.components.chessunlocks` (indirectly via `chessunlocks:IsLocked`)  
**Event states checked:** `IsSpecialEventActive(SPECIAL_EVENTS.HALLOWED_NIGHTS)`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `TRADEFOR` | table | (see source) | Maps trinket IDs to lists of prefabs they can be traded for (e.g., chess piece sketches). |
| `SMALLFLOATS` | table | (see source) | Maps trinket IDs to `{scale, verticalOffset}` for floater component customization. |
| `OCEANFISHING_BOBBER` | table | (see source) | Maps trinket IDs to bobber-specific fishing tackle data. |
| `OCEANFISHING_LURE` | table | (see source) | Maps trinket IDs to lure-specific fishing tackle data. |
| `EXTRA_DATA` | table | (see source) | Per-trinket metadata (e.g., `{slingshotammo = true}` for ID `1`). |

## Main functions
### `PickRandomTrinket()`
* **Description:** Selects a random unlocked trinket ID, respecting Chess unlock status and Hallowed Nights event restrictions.
* **Parameters:** None.
* **Returns:** `string` — The prefab name of a random unlocked trinket (e.g., `"trinket_5"`).
* **Error states:** Returns `"trinket_1"` as fallback if no trinkets are unlocked (i.e., `unlocked_trinkets` is empty).

### `MakeTrinket(num)`
* **Description:** Constructs and returns a `Prefab` definition for a single trinket (ID = `num`). Handles component initialization, tags, and per-trinket behavior.
* **Parameters:** `num` (number) — The trinket ID (`1` to `NUM_TRINKETS`).
* **Returns:** `Prefab` — A complete `Prefab` object ready for use.
* **Error states:** Returns `nil` behavior for clients if `TheWorld.ismastersim` is `false` (pristinity enforced early), but still returns the `inst` object.

## Events & listeners
None identified.