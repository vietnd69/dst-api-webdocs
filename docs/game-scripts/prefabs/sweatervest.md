---
id: sweatervest
title: Sweatervest
description: Provides insulation and temporary heat protection when equipped, depleting fuel over time while worn.
tags: [clothing, insulation, equipment, heat, fuel]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: d4aee57e
system_scope: inventory
---

# Sweatervest

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `sweatervest` is a wearable prefab that grants moderate insulation and dapperness to the wearer. When equipped, it consumes fuel over time (via the `fueled` component) and provides a visual armor overlay. The vest depletes its fuel reserve, and once exhausted, the entity automatically removes itself from the game world. It uses the `equippable`, `fueled`, and `insulator` components to manage its behavior.

## Usage example
```lua
-- The vest is instantiated as a prefab, not a component directly added in mod code.
-- Typical usage occurs via world generation or crafting:
local vest = Prefab("sweatervest")
-- Internally, the prefab registers:
--   equippable.equipslot = EQUIPSLOTS.BODY
--   insulator.insulation = TUNING.INSULATION_SMALL
--   fueled.fueltype = FUELTYPE.USAGE
--   fueled.maxfuel = TUNING.SWEATERVEST_PERISHTIME
```

## Dependencies & tags
**Components used:** `equippable`, `fueled`, `insulator`, `inspectable`, `inventoryitem`, `tradable`, `transform`, `animstate`, `network`, `physics`, `floatable`, `hauntable`
**Tags:** None explicitly added or removed.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `equipslot` | `EQUIPSLOT` | `EQUIPSLOTS.BODY` | The body slot the item occupies when equipped. |
| `dapperness` | number | `TUNING.DAPPERNESS_MED` | Dapperness bonus granted to the wearer while equipped. |
| `fueltype` | `FUELTYPE` | `FUELTYPE.USAGE` | Type of fuel consumed during active wear. |
| `insulation` | number | `TUNING.INSULATION_SMALL` | Insulation level provided to the wearer. |
| `maxfuel` | number | `TUNING.SWEATERVEST_PERISHTIME` | Total fuel capacity before depletion. |

## Main functions
No custom methods beyond component callbacks are defined. Behavior is driven via component hooks.

## Events & listeners
- **Listens to:** None directly.
- **Pushes:** None directly (event handling is delegated to `fueled` component, which pushes `onfueldsectionchanged` internally; depletion triggers `inst.Remove`).