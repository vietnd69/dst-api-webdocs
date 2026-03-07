---
id: manrabbit_tail
title: Manrabbit Tail
description: A consumable food item dropped by Man Rabbits that serves as a cat toy and cannot be eaten by the player.
tags: [food, toy, drop, consumable]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 87bfb4d4
system_scope: inventory
---

# Manrabbit Tail

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `manrabbit_tail` prefab represents an in-game item that functions both as a cat toy and a low-value consumable. It is created with minimal component logic: basic rendering and physics via `AnimState`, `Transform`, and `Network`; inventory functionality via `inventoryitem`; stackability via `stackable`; edibility with `FOODTYPE.HORRIBLE`; and tradability with a fixed gold value. It is not intended for human consumption and is typically used for crafting or as bait.

## Usage example
```lua
-- Create an instance of the Manrabbit Tail item
local tail = SpawnPrefab("manrabbit_tail")
tail.Transform:SetPosition(x, y, z)

-- Stack multiple items together
tail.components.stackable:SetCount(5)

-- Trade the tail for gold
local tradable = tail.components.tradable
if tradable ~= nil then
    local value = tradable.goldvalue
end
```

## Dependencies & tags
**Components used:** `stackable`, `inspectable`, `tradable`, `inventoryitem`, `edible`
**Tags:** Adds `cattoy`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `goldvalue` | number | `TUNING.GOLD_VALUES.MEAT * 2` | Value in gold when sold via trading. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for this item. |
| `foodtype` | FOODTYPE enum | `FOODTYPE.HORRIBLE` | Category of food, affecting which creatures will eat it. |
| `pickupsound` | string | `"cloth"` | Sound played when picked up. |
| `FloatParams` | table | `{"small", 0.1, 0.85}` | Parameters for floating behavior on water. |

## Main functions
None identified. The prefab does not define custom public functions beyond those provided by its attached components.

## Events & listeners
None identified. The prefab source does not register or fire custom events.

## Edible-specific behavior
When consumed, this item is classified as `FOODTYPE.HORRIBLE`, meaning it is only edible by creatures that accept terrible food (e.g., spiders, bunnies), and will typically provide minimal hunger/restoration with potential negative effects (e.g., sanity loss). The actual consumption behavior is handled by the `edible` component's `OnUse` handler.