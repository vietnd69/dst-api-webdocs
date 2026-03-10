---
id: trade_recipes
title: Trade Recipes
description: Defines structured trade recipe configurations for the game's trading system.
tags: [crafting, trade, inventory]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: f5d5ef81
system_scope: crafting
---

# Trade Recipes

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`trade_recipes.lua` defines a static table `TRADE_RECIPES` that enumerates named trade recipe definitions. Each entry specifies the name, required number of items, and rarity tier for a trade transaction. This file is a configuration data source, not a component, and is intended to be consumed by systems that manage player–merchant or player–event trades (e.g., Wickerbottom’s book trades or Quagmire currency conversions). It does not contain logic, components, or event handlers on its own.

## Usage example
```lua
-- Example of referencing a defined recipe in mod code
local recipe = TRADE_RECIPES.common_upgrade
print(recipe.name) --> "9_COMMON_UPGRADE"
print(recipe.inputs.number) --> 9
print(recipe.inputs.rarity) --> "Common"
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `TRADE_RECIPES.classy_upgrade.name` | string | `"9_CLASSY_UPGRADE"` | Unique identifier for the Classy rarity upgrade recipe. |
| `TRADE_RECIPES.classy_upgrade.inputs.number` | number | `9` | Number of items required. |
| `TRADE_RECIPES.classy_upgrade.inputs.rarity` | string | `"Classy"` | Rarity tier required (used for filtering eligible items). |
| `TRADE_RECIPES.common_upgrade.name` | string | `"9_COMMON_UPGRADE"` | Unique identifier for the Common rarity upgrade recipe. |
| `TRADE_RECIPES.common_upgrade.inputs.number` | number | `9` | Number of items required. |
| `TRADE_RECIPES.common_upgrade.inputs.rarity` | string | `"Common"` | Rarity tier required. |
| `TRADE_RECIPES.spiffy_upgrade.name` | string | `"9_SPIFFY_UPGRADE"` | Unique identifier for the Spiffy rarity upgrade recipe. |
| `TRADE_RECIPES.spiffy_upgrade.inputs.number` | number | `9` | Number of items required. |
| `TRADE_RECIPES.spiffy_upgrade.inputs.rarity` | string | `"Spiffy"` | Rarity tier required. |

## Main functions
Not applicable.

## Events & listeners
None identified.