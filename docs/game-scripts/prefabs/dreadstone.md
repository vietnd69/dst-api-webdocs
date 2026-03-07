---
id: dreadstone
title: Dreadstone
description: A consumable crafting material used for repairing tools and gear in Don't Starve Together.
tags: [crafting, repair, item]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 26f57555
system_scope: inventory
---

# Dreadstone

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
The `dreadstone` prefab represents a reusable crafting material that players can use to repair damaged tools and armor via the `repairer` component. It functions as an inventory item with stackable properties and supports inventory-level operations like trading and inspection. It integrates with the game's repair system by defining specific repair statistics (health and work value), and it can be launched/smashed by Hauntables (e.g.,Wilbur's hounds) like other rocks.

## Usage example
```lua
-- In a prefab constructor, spawn a dreadstone
local inst = SpawnPrefabs("dreadstone")
inst.Transform:SetPosition(x, y, z)

-- Optionally configure repair values (if dynamically creating)
if inst.components.repairer then
    inst.components.repairer.healthrepairvalue = 150
    inst.components.repairer.workrepairvalue = 50
end

-- In a repair action callback (e.g., from a crafting menu)
local repaired = inst.components.repairer:Repair(target, 1) -- repairs one unit of damage
```

## Dependencies & tags
**Components used:** `stackable`, `inventoryitem`, `repairer`, `tradable`, `inspectable`, `transform`, `animstate`, `network`, `physics`, `floatable`, `hauntable`
**Tags:** None explicitly added or checked.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `repairmaterial` | `MATERIALS` enum | `MATERIALS.DREADSTONE` | The material type used for repair identification (e.g., for validation). |
| `healthrepairvalue` | number | `TUNING.REPAIR_DREADSTONE_HEALTH` | Amount of health restored per repair operation. |
| `workrepairvalue` | number | `TUNING.REPAIR_DREADSTONE_WORK` | Amount of work (durability) restored per repair operation. |
| `maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size of dreadstone in inventory. |

## Main functions
This prefab does not define any custom public methods beyond those inherited from its attached components. The primary functional behavior is exposed via the `repairer` and `stackable` components.

### Inherited repairer functionality (`inst.components.repairer:Repair(...)`)
*   **Description:** Repairs a target entity (e.g., a tool or armor item) using this dreadstone as material. Called internally by repair UI actions or modder APIs (e.g., `GFS_MakeRepairItemRecipe`).
*   **Parameters:** `(target, count)` — `target` is the entity to repair, `count` is the number of units used (usually `1`).
*   **Returns:** Boolean (`true` if repair succeeded and material was consumed).
*   **Error states:** Returns `nil` if the target is not repairable, or if the repairer component is missing.

### Inherited stackable functionality (`inst.components.stackable`)
*   **Description:** Manages stacking behavior in inventory. Allows multiple dreadstones to be combined into a single stack up to `maxsize`.
*   **Parameters:** Standard `stackable` methods (`Add()`, `TryMerge()`, etc.).
*   **Returns:** Standard `stackable` return values (e.g., `true` on successful merge).

## Events & listeners
None identified — the prefab does not define any event listeners or event pushes directly. It inherits component-level events (e.g., `repairer` fires `repaircomplete`), but those are handled internally by DST’s framework and not exposed at the prefab level.

