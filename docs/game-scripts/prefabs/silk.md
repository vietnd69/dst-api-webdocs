---
id: silk
title: Silk
description: A small item used as a craftable material and cat toy, which can be upgraded to increase spider trust when held by a Spider Whisperer.
tags: [crafting, item, spawner]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0f3b179b
system_scope: inventory
---

# Silk

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`Silk` is a light-weight inventory item used primarily in crafting and as a toy for spiders. It supports stacking and can be upgraded by players with the `spiderwhisperer` tag (e.g., Webber) to increase trust with spiders. The prefab integrates with multiple core components: `stackable`, `upgrader`, `tradable`, `inspectable`, and `inventoryitem`. It is network-aware and pristinely synchronized across clients.

## Usage example
```lua
-- Spawn a single silk item
local silk = SpawnPrefab("silk")

-- Stack it to the maximum small-item stack size
silk.components.stackable:SetStackSize(TUNING.STACK_SIZE_SMALLITEM)

-- Check if it can be upgraded by a given actor
if silk.components.upgrader.canupgradefn(silk, nil, player) then
    silk.components.upgrader:Upgrade(player)
end
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `inventoryitem`, `tradable`, `upgrader`  
**Tags:** Adds `cattoy` to the prefab.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `AnimState` | AnimState | — | Manages visual animation state (bank: `"silk"`, build: `"silk"`, default anim: `"idle"`). |
| `pickupsound` | string | `"cloth"` | Sound played when the item is picked up. |
| `components.stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |
| `components.upgrader.canupgradefn` | function | `CanUpgrade` | Function that determines whether the item can be upgraded (requires `spiderwhisperer` tag on actor). |
| `components.upgrader.upgradetype` | number | `UPGRADETYPES.SPIDER` | Upgrade category used for compatibility with spider-related upgrade logic. |

## Main functions
### `CanUpgrade(inst, target, doer)`
*   **Description:** Static function assigned to `upgrader.canupgradefn` that determines if an actor can upgrade this item. This is part of the upgrade chain used to build spider trust.
*   **Parameters:**  
    `doer` (Entity) — The entity attempting the upgrade; must have the `"spiderwhisperer"` tag.
*   **Returns:** `true` if `doer:HasTag("spiderwhisperer")`, otherwise `false`.

## Events & listeners
None identified.