---
id: wagpunk_bits
title: Wagpunk Bits
description: A small stackable item used as bait for moles and for repairing gear-based structures and items in Don't Starve Together.
tags: [inventory, bait, repair]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 47f8f1c5
system_scope: inventory
---

# Wagpunk Bits

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wagpunk_bits` is a prefab that defines an in-game item used primarily as bait for moles and for repairing gear-based structures. It implements core inventory behaviors, stackability, and repair capabilities via the `stackable`, `bait`, `inspectable`, and `repairer` components. The item is associated with a specific animation bank and sound effect, and is designed to be lightweight and stackable for efficient inventory management.

## Usage example
```lua
-- Typical usage when spawning the item in the world:
local item = SpawnPrefab("wagpunk_bits")
item.Transform:SetPosition(x, y, z)

-- To inspect its repair capabilities programmatically:
if item.components.repairer then
    local material = item.components.repairer.repairmaterial  -- MATERIALS.GEARS
    local workRepair = item.components.repairer.workrepairvalue
    local healthRepair = item.components.repairer.healthrepairvalue
end
```

## Dependencies & tags
**Components used:** `bait`, `inspectable`, `inventoryitem`, `stackable`, `repairer`, `floatable`, `hauntablelaunch`  
**Tags:** `molebait`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `pickupsound` | string | `"metal"` | Sound played when the item is picked up. |
| `stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum number of items per stack. |
| `repairer.repairmaterial` | enum | `MATERIALS.GEARS` | Material type required for repair operations. |
| `repairer.workrepairvalue` | number | `TUNING.REPAIR_GEARS_WORK` | Work units restored per repair action. |
| `repairer.healthrepairvalue` | number | `TUNING.REPAIR_SCRAP_HEALTH` | Health restored per repair action. |

## Main functions
Not applicable. This is a prefab definition (a function returning an entity template), not a component class with methods.

## Events & listeners
Not applicable. This prefab definition does not register or push events directly. Event behavior is handled via attached components (`bait`, `repairer`, etc.), but no explicit listeners or pushes are present in the file.