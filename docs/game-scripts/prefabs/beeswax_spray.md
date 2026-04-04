---
id: beeswax_spray
title: Beeswax Spray
description: Defines the beeswax spray prefab used to wax vegetation and structures.
tags: [inventory, item, wax, durability]
sidebar_position: 10

last_updated: 2026-03-20
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: ea4a1209
system_scope: inventory
---

# Beeswax Spray

> Based on game build **714014** | Last updated: 2026-03-20

## Overview
The `beeswax_spray` script registers the beeswax spray entity within the Prefab system. It configures the entity as an inventory item with durability limits and waxing capabilities. The script relies on the `wax` component to identify the item as a spray tool and `finiteuses` to manage its consumption. It also handles visual overrides when equipped by a character.

## Usage example
```lua
-- Spawn the beeswax spray prefab
local spray = SpawnPrefab("beeswax_spray")
if spray then
    -- Add to player inventory
    spray.AddToInventory(ThePlayer.components.inventory)
    -- Configure durability via component access
    spray.components.finiteuses:SetMaxUses(10)
    spray.components.finiteuses:SetUses(10)
end
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `equippable`, `wax`, `finiteuses`.
**External Files:** `prefabs/farm_plant_defs`, `prefabs/weed_defs`, `prefabs/ancienttree_defs`.
**Tags:** Adds `usesdepleted` (managed by `finiteuses` when durability reaches zero).

## Properties
No public properties.

## Main functions
Not applicable.

## Events & listeners
- **Listens to:** None identified.
- **Pushes:** `equipskinneditem` (on owner when equipped with skin), `unequipskinneditem` (on owner when unequipped with skin).