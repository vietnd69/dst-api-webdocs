---
id: thulecite
title: Thulecite
description: A reusable crafting material that repairs tools and structures, and can be consumed for minimal sustenance.
tags: [crafting, repair, consumable]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: be66bceb
system_scope: crafting
---

# Thulecite

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `thulecite` prefab represents an item used primarily as a repair material in DST. It is equipped with the `repairer` component to restore health and work value to tools and structures, and the `edible` component to allow consumption for minor hunger restoration. It also acts as mole bait and supports stacking and trading.

## Usage example
```lua
local thulecite = SpawnPrefab("thulecite")
thulecite.Transform:SetPosition(x, y, z)
thulecite.components.inventoryitem:PickUp()
-- Use for repair or consume
thulecite.components.edible:OnEat()
```

## Dependencies & tags
**Components used:** `repairer`, `edible`, `tradable`, `inspectable`, `inventoryitem`, `stackable`, `bait`  
**Tags:** `molebait`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `repairmaterial` | string | `"thulecite"` | Material type used for matching compatible repair targets. |
| `workrepairvalue` | number | `TUNING.REPAIR_THULECITE_WORK` | Work point value restored per use on compatible items. |
| `healthrepairvalue` | number | `TUNING.REPAIR_THULECITE_HEALTH` | Health value restored per use on compatible structures. |
| `foodtype` | FOODTYPE enum | `FOODTYPE.ELEMENTAL` | Classification for consumption effects. |
| `hungervalue` | number | `3` | Satiety provided upon consumption. |
| `pickupsound` | string | `"rock"` | Sound played when the item is picked up. |

## Main functions
None identified. This prefab relies entirely on external components (`repairer`, `edible`, etc.) to provide its functional behavior.

## Events & listeners
None identified. The prefab does not register or fire custom events.