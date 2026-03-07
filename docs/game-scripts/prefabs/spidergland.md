---
id: spidergland
title: Spidergland
description: A consumable inventory item that restores a moderate amount of health when used.
tags: [consumable, healing, item]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 2b27dc50
system_scope: inventory
---

# Spidergland

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`spidergland` is an inventory item prefab that functions as a healing consumable. It provides a medium-small health restore effect and is typically used by characters to recover health in survival scenarios. The prefab is lightweight, floatable, and can be held by inventory slots, stacked, and traded. It also supports standard environmental interactions (burning, igniting, hauntable launch).

## Usage example
```lua
-- spawn a spidergland and use it to heal a character
local gland = SpawnPrefab("spidergland")
if gland ~= nil then
    gland.components.healer:SetHealthAmount(TUNING.HEALING_MEDSMALL)
    gland.components.healer:Heal(inst)  -- where inst is the target entity
end
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `tradable`, `healer`
**Tags:** Adds `cattoy`

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `health` | number | `TUNING.HEALING_MEDSMALL` | The amount of health restored when the item is used as a healer. |

## Main functions
### `SetHealthAmount(health)`
* **Description:** Sets the amount of health the gland restores when used. Called internally during prefab instantiation.
* **Parameters:** `health` (number) — the health value to assign (e.g., `TUNING.HEALING_MEDSMALL`).
* **Returns:** Nothing.

## Events & listeners
Not applicable.