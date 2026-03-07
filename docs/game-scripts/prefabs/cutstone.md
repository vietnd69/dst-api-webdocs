---
id: cutstone
title: Cutstone
description: A stackable, tradable rock used for baiting moles and repairing stone structures.
tags: [inventory, crafting, bait]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: dd53a49c
system_scope: inventory
---

# Cutstone

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`cutstone` is a prefab representing a crafted stone item used for baiting moles, repairing stone structures, and trading. It is a passive item without state-driven behavior; its functionality is delegated to attached components (`stackable`, `inventoryitem`, `tradable`, `bait`, `repairer`). The prefab is valid on both client and server, though components are only added on the master simulation.

## Usage example
```lua
local inst = SpawnPrefab("cutstone")
inst.components.stackable:SetSize(5) -- Stack size up to TUNING.STACK_SIZE_LARGEITEM
inst.components.tradable:GetRockTribute() -- Returns 3
inst.components.repairer:GetRepairAmount() -- Returns TUNING.REPAIR_CUTSTONE_HEALTH
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `tradable`, `bait`, `repairer`
**Tags:** Adds `molebait`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pickupsound` | string | `"rock"` | Sound played when the item is picked up. |
| `components.stackable.maxsize` | number | `TUNING.STACK_SIZE_LARGEITEM` | Maximum stack size. |
| `components.tradable.rocktribute` | number | `3` | Tribute cost to trade this item to the Moon Rock monument. |
| `components.repairer.repairmaterial` | enum | `MATERIALS.STONE` | Material type used for repair matching. |
| `components.repairer.healthrepairvalue` | number | `TUNING.REPAIR_CUTSTONE_HEALTH` | Amount of health restored per repair action. |

## Main functions
*Not applicable.* The prefab itself has no public methods beyond its attached components’ APIs. All functionality is provided by the components listed in "Dependencies & tags".

## Events & listeners
*None identified.* The `cutstone` prefab does not define custom event listeners or push events directly.