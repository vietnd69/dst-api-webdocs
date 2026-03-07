---
id: thulecite_pieces
title: Thulecite Pieces
description: Represents a consumable and repairable Thulecite fragment used as bait, food, and crafting material in DST.
tags: [crafting, bait, inventory, food]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 9fe37b8c
system_scope: inventory
---

# Thulecite Pieces

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`thulecite_pieces` is a prefab asset that defines a small, stackable item used for multiple purposes in DST: as bait for moles, as a low-nutrition food item (elemental type), as tradable currency, and for repairing equipment via the repairer component. It integrates with several core components—`edible`, `tradable`, `inspectable`, `inventoryitem`, `bait`, `repairer`, and `stackable`—to provide flexible gameplay functionality within the inventory and crafting systems.

## Usage example
```lua
local inst = SpawnPrefab("thulecite_pieces")
if inst and inst.components.stackable then
    inst.components.stackable:SetStackSize(5)
end
```

## Dependencies & tags
**Components used:** `edible`, `tradable`, `inspectable`, `inventoryitem`, `bait`, `repairer`, `stackable`, `transform`, `animstate`, `soundemitter`, `network`
**Tags:** `molebait`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `foodtype` | `FOODTYPE` enum | `FOODTYPE.ELEMENTAL` | Determines compatibility with certain consumables and effects (e.g., sanity impact). |
| `hungervalue` | number | `1` | Amount of hunger restored upon consumption. |
| `repairmaterial` | `MATERIALS` enum | `MATERIALS.THULECITE` | Specifies the repair material used when repairing items. |
| `healthrepairvalue` | number | `TUNING.REPAIR_THULECITE_PIECES_HEALTH` | Amount of health restored per repair operation. |
| `workrepairvalue` | number | `TUNING.REPAIR_THULECITE_PIECES_WORK` | Amount of work value (durability) restored per repair operation. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |
| `pickupsound` | string | `"rock"` | Sound name played when the item is picked up. |
| `sinks` | boolean | `true` | Controls whether the item sinks when placed on water/lava surfaces. |

## Main functions
None identified (no custom methods beyond component-provided interfaces).

## Events & listeners
None identified (no direct `inst:ListenForEvent` or `inst:PushEvent` calls beyond component defaults).