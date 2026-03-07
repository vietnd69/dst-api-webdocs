---
id: wintersfeastfood
title: Wintersfeastfood
description: Generates 9 distinct seasonal food prefabs for the Winters Feast event, each with configurable nutrition, sanity, temperature, and visual floater properties.
tags: [event, inventory, food, networking]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: c076d77d
system_scope: inventory
---

# Wintersfeastfood

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wintersfeastfood.lua` is a prefab factory script that programmatically creates 9 unique Winters Feast event food items. Each item is defined by a configuration table (`foodinfo`) and returned as a `Prefab` via a factory function. The script instantiates entities with appropriate visual, audio, and network components, attaches runtime components (`edible`, `stackable`, `tradable`, `inspectable`, `inventoryitem`), and applies tags based on food properties (e.g., `treeornament`, `fooddrink`, `donotautopick`). Temperature effects are conditionally applied via the `edible` component.

## Usage example
```lua
-- Create the 3rd Winters Feast food item (Candy Cane)
local candy_cane = require "prefabs/wintersfeastfood"
local prefab = candy_cane[3]  -- index 3 corresponds to foodinfo[3]
local inst = Prefab("some_parent", function() return prefab.fn() end)
```

## Dependencies & tags
**Components used:** `Transform`, `AnimState`, `SoundEmitter`, `Network`, `inventoryphysics`, `floater`, `edible`, `stackable`, `tradable`, `inspectable`, `inventoryitem`  
**Tags added:** `cattoy`, `wintersfeastfood`, `pre-preparedfood`, `winter_ornament` (conditional), plus any `tags` specified per item (e.g., `donotautopick`, `fooddrink`)

## Properties
No public properties — this script is a factory that constructs prefabs; it does not expose persistent state.

## Main functions
### `MakeFood(num)`
*   **Description:** Factory function that builds and returns a `Prefab` for the `num`-th food entry from `foodinfo`. Configures entity components, tags, and appearance based on the food definition.
*   **Parameters:** `num` (number) — index into the `foodinfo` table (1-based).
*   **Returns:** `Prefab` — a configured prefab definition with `.fn` and `.assets`.
*   **Error states:** Asserts that `#foodinfo == NUM_WINTERFOOD` at load time; fails with assert if mismatched.

## Events & listeners
None identified.