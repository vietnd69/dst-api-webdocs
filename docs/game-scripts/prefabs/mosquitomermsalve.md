---
id: mosquitomermsalve
title: Mosquitomermsalve
description: A consumable item that heals merms and Wurt when applied, with enhanced healing and a debuff effect for Wurt if the appropriate skill is activated.
tags: [healing, consumable, item]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 05b9575a
system_scope: inventory
---

# Mosquitomermsalve

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
`mosquitomermsalve` is a consumable inventory item that functions as a healing salve specifically for merms and Wurt. It is implemented as a prefab with the `healer` component attached, which defines *who* can be healed (`CanHeal`) and *what happens* when healing occurs (`OnHeal`). The item supports stacking and integrates with the `skilltreeupdater` component to grant bonus effects to Wurt under certain conditions.

## Usage example
```lua
local inst = SpawnPrefab("mosquitomermsalve")
inst.components.stackable:SetQuantity(3)
inst.components.healer:SetHealthAmount(0) -- Required for healer component initialization
-- When used on a valid target (e.g., a merm or Wurt), the OnHeal function will execute
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `stackable`, `healer`, `skilltreeupdater`, `health`, `debuff`
**Tags:** Checks for `merm`, `mermdisguise`, `player`; adds `merm_healthregenbuff` debuff on successful heal if skill condition met.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.components.healer.health` | number | `0` | Health amount restored per use; set via `SetHealthAmount` (not used for direct healing, but required for component setup). |
| `inst.components.stackable.maxsize` | number | `TUNING.STACK_SIZE_SMALLITEM` | Maximum stack size for the item. |

## Main functions
### `CanHeal(inst, target, doer)`
* **Description:** Validates whether the target entity can be healed by this item. Used by the `healer` component to determine eligibility.
* **Parameters:** 
  - `target` (Entity) — The entity attempting to receive healing.
  - `doer` (Entity, optional) — The entity applying the item (often the player).
* **Returns:** `true` if target is a merm without `mermdisguise` tag or is Wurt (`player` tag), or `false, "NOT_MERM"` otherwise.
* **Error states:** Always returns a boolean as first value; error message only returned on failure.

### `OnHeal(inst, target, doer)`
* **Description:** Executes the healing logic for a valid target. Calculates heal amount based on whether the target is a player, applies it via `health:DoDelta`, and optionally grants the `merm_healthregenbuff` debuff if the `wurt_mosquito_craft_3` skill is active.
* **Parameters:** 
  - `target` (Entity) — The entity being healed.
  - `doer` (Entity, optional) — The entity that used the item.
* **Returns:** Nothing.
* **Error states:** Returns early if `target.components.health` is `nil`. Only applies heal if `target.components.health.canheal` is `true`.

## Events & listeners
- **Pushes:** `healthdelta` — emitted by `target.components.health:DoDelta` when heal is applied.
- **Debuff applied:** `merm_healthregenbuff` — added via `target:AddDebuff("merm_healthregenbuff", "merm_healthregenbuff")` if `wurt_mosquito_craft_3` skill is activated and `doer` is provided.