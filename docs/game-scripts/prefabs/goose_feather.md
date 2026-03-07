---
id: goose_feather
title: Goose Feather
description: A lightweight decorative item used as a cat toy and small fuel source in the game.
tags: [inventory, fuel, toy, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: fd9f0613
system_scope: inventory
---

# Goose Feather

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `goose_feather` is a lightweight item prefab that serves as both a decorative item and functional component in gameplay. It is primarily used as a cat toy and provides a small amount of fuel when burned. It supports stacking, inventory interaction, and environmental interactions such as floating and snowman decoration.

## Usage example
```lua
local feather = SpawnPrefab("goose_feather")
feather.components.stackable:SetStackSize(5)
feather.components.fuel.fuelvalue = TUNING.TINY_FUEL * 2
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `fuel`, `snowmandecor`  
**Tags added:** `cattoy`, `birdfeather`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `fuelvalue` | number | `TUNING.TINY_FUEL` | The amount of fuel provided when the item is burned. |

## Main functions
Not applicable.

## Events & listeners
None identified.