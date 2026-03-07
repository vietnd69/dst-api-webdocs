---
id: mosquitofertalizer
title: Mosquitofertalizer
description: A portable fertilizer item that provides moderate soil nutrients and repels flies when held, with unique behavior when deployed by a Wurt-activated skill.
tags: [farming, inventory, environment, fuel]
sidebar_position: 10

last_updated: 2026-03-06
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 01c42ade
system_scope: environment
---

# Mosquitofertalizer

> Based on game build **714014** | Last updated: 2026-03-06

## Overview
The `mosquitofertalizer` prefab is a throwable/fuel/farming item that functions as a low-tier fertilizer with a unique flavor: it spawns a "flies" child entity while held in inventory (simulating trapped pests) and spawns a `poopcloud` when used as fuel. It is designed for basic soil enrichment but also integrates with Wurt's skilltree to grant bonus nutrient application on deployment. The prefab relies on several core components—`fertilizer`, `fuel`, `inventoryitem`, `burnable`, and `fertilizerresearchable`—to deliver its gameplay loop.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("inspectable")
inst:AddComponent("smotherer")
inst:AddComponent("stackable")
inst:AddComponent("fertilizerresearchable")
inst.components.fertilizerresearchable:SetResearchFn(FertilizerResearchFn)
inst:AddComponent("fertilizer")
inst.components.fertilizer.fertilizervalue = TUNING.POOP_FERTILIZE
inst.components.fertilizer.soil_cycles = TUNING.POOP_SOILCYCLES
inst.components.fertilizer.withered_cycles = TUNING.POOP_WITHEREDCYCLES
inst.components.fertilizer:SetNutrients(FERTILIZER_DEFS.mosquitofertilizer.nutrients)
inst:AddComponent("inventoryitem")
inst.components.inventoryitem:SetOnDroppedFn(OnDropped)
inst.components.inventoryitem:SetOnPutInInventoryFn(OnPutInInventory)
inst:AddComponent("fuel")
inst.components.fuel.fuelvalue = TUNING.MED_FUEL
inst.components.fuel:SetOnTakenFn(FuelTaken)
MakeSmallBurnable(inst, TUNING.MED_BURNTIME)
inst.components.burnable:SetOnIgniteFn(OnBurn)
MakeDeployableFertilizer(inst)
```

## Dependencies & tags
**Components used:** `burnable`, `farming_manager`, `fertilizer`, `fertilizerresearchable`, `fuel`, `inventoryitem`, `skilltreeupdater`, `smotherer`, `stackable`, `inspectable`  
**Tags:** Adds `fertilizerresearchable`; checked by `deployablefertilizer` logic.

## Properties
No public properties are directly exposed for modification. Instance properties are accessed through component interfaces (e.g., `inst.components.fertilizer.nutrients`).

## Main functions
### `OnBurn(inst)`
* **Description:** Called when the item ignites. Removes the child `flies` entity (if present) and triggers default burn effects.
* **Parameters:** `inst` (Entity) — the mosquitofertilizer instance.
* **Returns:** Nothing.

### `FuelTaken(inst, taker)`
* **Description:** Called when this item is used as fuel. Spawns a `poopcloud` at the fuel taker’s position (or the taker’s burn FX child position if present).
* **Parameters:**  
  `inst` (Entity) — the mosquitofertilizer instance.  
  `taker` (Entity) — the entity consuming this item as fuel.
* **Returns:** Nothing.

### `OnDropped(inst)`
* **Description:** Called when the item is dropped from inventory. Spawns a child `flies` prefab (simulating escape of trapped pests).
* **Parameters:** `inst` (Entity) — the mosquitofertilizer instance.
* **Returns:** Nothing.

### `OnPutInInventory(inst)`
* **Description:** Called when the item is placed into an inventory. Removes the `flies` child entity (if present).
* **Parameters:** `inst` (Entity) — the mosquitofertilizer instance.
* **Returns:** Nothing.

### `GetFertilizerKey(inst)`
* **Description:** Returns the prefab name as the key used for research and identification.
* **Parameters:** `inst` (Entity) — the mosquitofertilizer instance.
* **Returns:** string — `"mosquitofertilizer"`.

### `FertilizerResearchFn(inst)`
* **Description:** Used by the `fertilizerresearchable` component to determine the research key.
* **Parameters:** `inst` (Entity) — the mosquitofertilizer instance.
* **Returns:** string — the result of `GetFertilizerKey(inst)`.

### `ondeployed_fertilzier_extra_fn(inst, pt, deployer)`
* **Description:** Extra logic run on deployment. If the deployer has the `"wurt_mosquito_craft_3"` skill activated, adds bonus nutrients (`TUNING.WURT_BONUS_FERT`) to the target tile.
* **Parameters:**  
  `inst` (Entity) — the mosquitofertilizer instance.  
  `pt` (Vector) — deployment target point.  
  `deployer` (Entity?) — optional entity deploying the item.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** None directly. Event handlers like `OnBurn`, `FuelTaken`, `OnDropped`, and `OnPutInInventory` are attached as component callbacks (e.g., `inst.components.burnable:SetOnIgniteFn(OnBurn)`), which are invoked via internal component events.
- **Pushes:** None directly.
