---
id: wx78_foodbrick
title: Wx78 Foodbrick
description: WX-78 character-specific food item that transforms between wet and dry states, changing nutritional values and gaining fertilizer properties when wet.
tags: [prefab, food, wx78, item]
sidebar_position: 10
last_updated: 2026-04-28
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: ef67ba0d
system_scope: inventory
---

# Wx78 Foodbrick

> Based on game build **722832** | Last updated: 2026-04-28

## Overview
`wx78_foodbrick.lua` registers a spawnable food item prefab exclusive to the WX-78 character. The item dynamically transforms between wet and dry states based on moisture levels, altering its nutritional values, fertilizer properties, and visual appearance. When wet, it gains fertilizer functionality and can be deployed to enrich soil; when dry, it functions as basic food with reduced nutritional value.

## Usage example
```lua
-- Spawn the foodbrick at world origin:
local inst = SpawnPrefab("wx78_foodbrick")
inst.Transform:SetPosition(0, 0, 0)

-- Check wet status via inspectable component:
-- Master-only: inspectable component not added on client
if inst.components.inspectable ~= nil then
    local status = inst.components.inspectable.getstatus(inst)
    -- Returns "WET" or nil
end
```

## Dependencies & tags
**External dependencies:**
- `prefabs/fertilizer_nutrient_defs` -- provides FERTILIZER_DEFS table for nutrient values
- `MakeInventoryPhysics` -- applies physics and floatable behavior for inventory items
- `MakeInventoryFloatable` -- adds floating animation when dropped in water
- `MakeDeployableFertilizerPristine` -- sets up deployable fertilizer behavior (pristine state)
- `MakeDeployableFertilizer` -- adds deployable component when item becomes wet
- `MakeSmallBurnable` -- registers burnable/smoldering behavior for small entities
- `MakeSmallPropagator` -- enables fire spread to nearby entities
- `MakeHauntableLaunchAndIgnite` -- adds ghost interaction behavior

**Components used:**
- `inventoryitem` -- manages item carrying and image state
- `inventoryitemmoisture` -- tracks moisture levels and triggers state changes
- `stackable` -- allows stacking up to TUNING.STACK_SIZE_SMALLITEM
- `tradable` -- enables trading between players
- `fuel` -- provides fuel value for burning (TUNING.MED_LARGE_FUEL)
- `edible` -- defines nutritional values (health, hunger, sanity)
- `perishable` -- handles spoilage over time (1 day perish time)
- `fertilizerresearchable` -- enables fertilizer research functionality
- `inspectable` -- provides inspection status ("WET" or nil)
- `fertilizer` -- added dynamically when wet; provides soil enrichment
- `deployable` -- added dynamically when wet; allows tile deployment

**Tags:**
- `fertilizerresearchable` -- added in fn(); enables fertilizer research
- `tile_deploy` -- added in MakeWet(), removed in MakeDry(); marks deployable state

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of Asset entries for animation and inventory images. |
| `inst.pickupsound` | string | `"vegetation_firm"` | Sound played when picked up; changes to `"squidgy"` when wet. |
| `inst._waswet` | boolean | `false` | Tracks previous wet state to avoid redundant animation pushes. |
| `inst.wet_prefix` | string | `STRINGS.WET_PREFIX.WX78_FOODBRICK` | Localization prefix for wet item name. |
| `inst.stackable_CanStackWithFn` | function | `COMMON_CanStackWithFn` | Custom stacking validation function. |
| `inst.itemtile_Refresh` | function | `COMMON_ItemTileRefresh` | UI refresh callback for item tiles. |
| `inst.GetFertilizerKey` | function | `COMMON_GetFertilizerKey` | Returns prefab name for fertilizer research. |
| `TUNING.STACK_SIZE_SMALLITEM` | constant | --- | Max stack size for stackable component (set in fn()). |
| `TUNING.MED_LARGE_FUEL` | constant | --- | Fuel value for fuel component (set in fn()). |
| `TUNING.HEALING_TINY` | constant | --- | Health value for edible component (both wet and dry states). |
| `TUNING.CALORIES_MEDSMALL` | constant | --- | Hunger value when wet (MakeWet). |
| `TUNING.CALORIES_TINY` | constant | --- | Hunger value when dry (MakeDry). |
| `TUNING.PERISH_ONE_DAY` | constant | --- | Perish time for perishable component (1 day). |
| `TUNING.TINY_BURNTIME` | constant | --- | Burn time for MakeSmallBurnable. |
| `TUNING.WX78_FOODBRICK_FERTILIZE` | constant | --- | Fertilizer value when wet. |
| `TUNING.WX78_FOODBRICK_SOILCYCLES` | constant | --- | Soil cycles for fertilizer component when wet. |
| `TUNING.WX78_FOODBRICK_WITHEREDCYCLES` | constant | --- | Withered cycles for fertilizer component when wet. |

## Main functions
### `fn()`
* **Description:** Prefab constructor that runs on both master and client. Creates entity, sets up physics/animation/tags, assigns function hooks. All components are added on master; client returns early after registering wetnesschange listener. Returns `inst`.
* **Parameters:** None
* **Returns:** entity instance
* **Error states:** Errors if `inst.components.inventoryitemmoisture` is nil (no nil guard before `SetOnMoistureDeltaCallback` call). Component is typically auto-added with inventoryitem but not explicitly created in fn().

### `MakeWet(inst)`
* **Description:** Transforms the item to wet state. Changes image to wet variant, starts perishing, updates nutritional values to wet state (higher hunger), and adds fertilizer/deployable components if not present. Pushes "show_spoilage" event on non-dedicated clients.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None — function only executes on master sim where inventoryitem and perishable components are guaranteed by fn() initialization.

### `MakeDry(inst)`
* **Description:** Transforms the item to dry state. Changes image back to dry variant, stops perishing, updates nutritional values to dry state (lower hunger, RAW foodtype), and removes fertilizer/deployable components and tile_deploy tag. Pushes "hide_spoilage" event on non-dedicated clients.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None — function only executes on master sim where components are guaranteed. RemoveComponent calls are safe even if component is absent.

### `OnMoistureDeltaCallback(inst)` (local)
* **Description:** Moisture change handler registered with inventoryitemmoisture component. Checks current wet state via `IsWet()`, tracks state change via `_waswet` flag, pushes appropriate idle animation (idle_wet or idle_dry), and calls MakeWet or MakeDry accordingly.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** None — IsWet() internally guards for inventoryitemmoisture existence. Callback only fires on master where component is initialized.

### `GetStatus(inst)` (local)
* **Description:** Returns inspection status string for the inspectable component. Returns "WET" if item is wet, nil if dry.
* **Parameters:** `inst` -- entity instance
* **Returns:** `"WET"` or `nil`
* **Error states:** None — IsWet() internally guards for component existence. Function only called on master where components are guaranteed.

### `CLIENT_OnWetnessChanged(inst, iswet)` (local)
* **Description:** Client-side wetness change listener. Updates pickup sound based on wet state and pushes show_spoilage/hide_spoilage events on non-dedicated clients. Registered via ListenForEvent("wetnesschange") on client only.
* **Parameters:**
  - `inst` -- entity instance
  - `iswet` -- boolean wet state
* **Returns:** None
* **Error states:** None.

### `COMMON_CanStackWithFn(inst, item)` (local)
* **Description:** Custom stacking validation function. Only allows stacking if both items have matching wet state (both wet or both dry). Uses replica.inventoryitem:IsWet() for network-safe comparison.
* **Parameters:**
  - `inst` -- source entity instance
  - `item` -- target item instance to stack with
* **Returns:** `true` if wet states match, `false` otherwise
* **Error states:** Errors if either entity lacks `replica.inventoryitem` component (no guard present).

### `COMMON_ItemTileRefresh(inst)` (local)
* **Description:** UI refresh callback for item tiles. Pushes show_spoilage or hide_spoilage event based on current wet state. Called when item tile needs visual update.
* **Parameters:** `inst` -- entity instance
* **Returns:** None
* **Error states:** Errors if `inst.replica.inventoryitem` is nil (no nil guard before replica component access). Function assigned during fn() but could be called externally before replica initialization completes.

### `COMMON_GetFertilizerKey(inst)` (local)
* **Description:** Returns the prefab name for fertilizer research identification. Used by fertilizerresearchable component.
* **Parameters:** `inst` -- entity instance
* **Returns:** `inst.prefab` (string prefab name)
* **Error states:** None.

### `fertilizerresearchfn(inst)` (local)
* **Description:** Research function for fertilizerresearchable component. Calls GetFertilizerKey to return the fertilizer identifier.
* **Parameters:** `inst` -- entity instance
* **Returns:** Prefab name string
* **Error states:** None — inst.GetFertilizerKey is assigned in fn() before this function is registered with fertilizerresearchable component.

## Events & listeners
- **Listens to:** `wetnesschange` -- triggers CLIENT_OnWetnessChanged; updates pickup sound and spoilage visibility (client only)
- **Pushes:** `show_spoilage` -- fired when item becomes wet; triggers UI spoilage indicator
- **Pushes:** `hide_spoilage` -- fired when item becomes dry; hides UI spoilage indicator