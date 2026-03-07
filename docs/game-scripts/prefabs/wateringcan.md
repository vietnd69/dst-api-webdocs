---
id: wateringcan
title: Wateringcan
description: A tool prefab that holds water for plant care, providing wetness, cooling, and protection effects when used.
tags: [farming, tool, equipment, environment]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 022cdd76
system_scope: inventory
---

# Wateringcan

> Based on game build **7140014** | Last updated: 2026-03-07

## Overview
The `wateringcan` prefab provides a reusable tool for applying water to crops in DST. It supports two variants (`wateringcan` and `premiumwateringcan`) defined via `MakeWateringCan`. The item uses the `finiteuses` component to track water capacity and includes behavior for equipping animation changes, filling from water sources, and applying protective/wetting effects when deployed via the `wateryprotection` and `farming_manager` components. It also transitions into a fuel item when depleted and supports scrapbook display.

## Usage example
```lua
-- Create a watering can instance
local wateringcan = Prefab("wateringcan", ...)
local inst = wateringcan()

-- Manually fill the can (e.g., after player interaction)
inst.components.fillable:Fill(some_water_source)

-- Equip and use on plants
local player = GetPlayer()
player:PushEvent("equipskinneditem", inst:GetSkinName())
player.components.inventory:Equip(inst)
inst.components.wateryprotection.onspreadprotectionfn(inst) -- triggers use effect
```

## Dependencies & tags
**Components used:** `inspectable`, `inventoryitem`, `wateryprotection`, `fillable`, `finiteuses`, `equippable`, `weapon`, `fuel`, `burnable`, `propagator`, `hauntable`, `transform`, `animstate`, `soundemitter`, `network`.  
**Tags added:** `wateringcan` (used for identification), and conditionally `usesdepleted` when no uses remain.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `displaynamefn` | function | `displaynamefn` (local) | Returns a localized name string when not depleted, or `nil` when depleted. |
| `scrapbook_specialinfo` | string | `"WATERINGCAN"` | Marks the item as a watering can in the scrapbook. |
| `scrapbook_subcat` | string | `"tool"` | Grouping for scrapbook categorization. |
| `components.wateryprotection.extinguishheatpercent` | number | `TUNING.WATERINGCAN_EXTINGUISH_HEAT_PERCENT` | Heat reduction applied to adjacent burning entities. |
| `components.wateryprotection.temperaturereduction` | number | `TUNING.WATERINGCAN_TEMP_REDUCTION` | Ambient temperature drop applied to nearby entities. |
| `components.wateryprotection.witherprotectiontime` | number | `TUNING.WATERINGCAN_PROTECTION_TIME` | Duration of wither protection (in seconds) provided to plants. |
| `components.wateryprotection.addwetness` | number | `TUNING.WATERINGCAN_WATER_AMOUNT` | Wetness added to soil upon burn or use. |
| `components.wateryprotection.protection_dist` | number | `TUNING.WATERINGCAN_PROTECTION_DIST` | Radius (in tiles) around the watering can for plant protection effects. |
| `components.wateryprotection.ignoretags` | table | Includes `"player"` | Tags of entities that are ignored for wetness/protection propagation. |
| `components.wateryprotection.onspreadprotectionfn` | function | `onuse` | Callback invoked when the watering can applies protection to a plant. |
| `components.fillable.acceptsoceanwater` | boolean | `false` | Ocean water cannot be used to refill. |
| `components.fillable.showoceanaction` | boolean | `true` | Ocean action is shown for interaction (though rejected). |
| `components.fillable.oceanwatererrorreason` | string | `"UNSUITABLE_FOR_PLANTS"` | Localized reason shown when trying to use ocean water. |
| `components.finiteuses.total` | number | `TUNING.WATERINGCAN_USES` or `TUNING.PREMIUMWATERINGCAN_USES` | Total number of uses (capacity) of the can. |
| `components.weapon.damage` | number | `TUNING.UNARMED_DAMAGE` | Damage value for weapon attacks (non-essential use). |

## Main functions
### `OnFill(inst, from_object)`
* **Description:** Custom fill handler invoked when the watering can is filled. Boosts remaining uses based on `override_fill_uses` if available, or fully refills if not.
* **Parameters:** `inst` (Entity), `from_object` (Entity or nil).
* **Returns:** `true`.
* **Error states:** Does not fail; gracefully falls back to full refill if water source is missing.

### `MakeFuel(inst)`
* **Description:** Adds the `fuel` component to the instance if not already present, configuring it as a small-burnable item.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `RemoveFuel(inst)`
* **Description:** Removes the `fuel` component if present.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `onpercentusedchanged(inst, data)`
* **Description:** Event listener triggered when the remaining use percentage changes. Automatically adds/removes the `fuel` component depending on whether the can is empty.
* **Parameters:** `inst` (Entity), `data` (table, contains `percent` number).
* **Returns:** Nothing.

### `onburnt(inst)`
* **Description:** event listener called on burn. Converts a fraction of remaining uses into soil moisture at the item's world position.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `onuse(inst)`
* **Description:** Reduces one use from `finiteuses` when the item is used. Called by `wateryprotection.onspreadprotectionfn`.
* **Parameters:** `inst` (Entity).
* **Returns:** Nothing.

### `displaynamefn(inst)`
* **Description:** Returns a localized name string if not depleted; otherwise returns `nil`.
* **Parameters:** `inst` (Entity).
* **Returns:** `string?`.

### `getstatus(inst, viewer)`
* **Description:** Returns `"EMPTY"` if uses are depleted; otherwise returns `nil`.
* **Parameters:** `inst` (Entity), `viewer` (Entity or nil).
* **Returns:** `"EMPTY" or nil`.

### `OnEquip(inst, owner)`
* **Description:** Sets animation overrides and shows the "ARM_carry" animation when equipped.
* **Parameters:** `inst` (Entity), `owner` (Entity).
* **Returns:** Nothing.

### `OnUnequip(inst, owner)`
* **Description:** Restores normal arm animation when unequipped.
* **Parameters:** `inst` (Entity), `owner` (Entity).
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `percentusedchange` - triggers `onpercentusedchanged` to manage fuel component presence based on usage.
- **Listens to:** `onburnt` - triggers `onburnt` to add soil moisture at world position.
- **Pushes:** `equipskinneditem` - fired on equip to notify of skinned item state.
- **Pushes:** `percentusedchange` - internal event fired by `finiteuses:SetUses` to signal usage changes.