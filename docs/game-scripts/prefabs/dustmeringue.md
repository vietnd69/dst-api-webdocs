---
id: dustmeringue
title: Dustmeringue
description: A consumable food item that serves as bait for moles and food for dust moths, with stackable and tradable properties.
tags: [inventory, food, bait, entity]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 25405dca
system_scope: inventory
---

# Dustmeringue

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `dustmeringue` prefab is a small, stackable food item designed to be placed in bait slots (e.g., for Moleworms) and consumed by Dust Moths. It implements the `edible`, `stackable`, `tradable`, `inspectable`, `inventoryitem`, and `bait` components to integrate fully into the game’s inventory and interaction systems. It also supports hauntable smash behavior and floatation on water.

## Usage example
```lua
-- spawn a dustmeringue instance
local inst = SpawnPrefab("dustmeringue")

-- verify stack size capability
if inst.components.stackable then
    inst.components.stackable:SetSize(5) -- set stack to 5
end

-- when held in an inventory, the `learncookbookstats` event is triggered on the owner
```

## Dependencies & tags
**Components used:** `edible`, `stackable`, `tradable`, `inspectable`, `inventoryitem`, `bait`  
**Tags:** `dustmothfood`, `molebait`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foodtype` | `FOODTYPE` | `FOODTYPE.ELEMENTAL` | The food category used by the `edible` component for metabolic interactions. |
| `hungervalue` | number | `TUNING.CALORIES_SMALL` | Amount of hunger restored when consumed, per `edible.lua`. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size, per `stackable.lua`. |

## Main functions
None identified.

## Events & listeners
- **Listens to:** `onputininventory` — when the item is placed in an inventory, triggers `owner:PushEvent("learncookbookstats", inst.prefab)` to record cooking statistics.
- **Pushes:** No events directly; relies on component events (e.g., `edible` and `bait` may emit their own events during consumption or baiting).