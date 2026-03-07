---
id: foliage
title: Foliage
description: A consumable, flammable inventory item used as fuel, food, or craftable ingredient that can dry into preserved form; primarily appears in the Quagmire game mode.
tags: [environment, inventory, consumable, crafting]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: f09f4e22
system_scope: inventory
---

# Foliage

> Based on game build **714004** | Last updated: 2026-03-05

## Overview
The `foliage` prefab defines a lightweight, multi-purpose item used primarily in the Quagmire game mode. It functions as a small fuel source, a perishable food item (vegetable type), and a candidate for drying preservation. The prefab spawns with a pristine variant (`foliage`) and a cooked variant (`quagmire_foliage_cooked`). It relies heavily on existing component infrastructure — especially `edible`, `perishable`, `dryable`, and `fuel` — to handle state transitions (e.g., cooking, drying, rotting). Tags like `cattoy`, `dryable`, and `quagmire_stewable` enable behavior integration with other systems.

## Usage example
```lua
-- Typical usage: add components dynamically to a custom item based on foliage
local inst = CreateEntity()
inst.entity:AddTransform()
inst.entity:AddAnimState()
inst.entity:AddNetwork()
MakeInventoryPhysics(inst)
inst:AddTag("dryable")
inst:AddTag("cattoy")

-- Add standard foliage-like properties
inst:AddComponent("fuel")
inst.components.fuel.fuelvalue = TUNING.TINY_FUEL

inst:AddComponent("edible")
inst.components.edible.foodtype = FOODTYPE.VEGGIE
inst.components.edible.healthvalue = TUNING.HEALING_TINY
inst.components.edible.hungervalue = 0

inst:AddComponent("perishable")
inst.components.perishable:SetPerishTime(TUNING.PERISH_FAST)
inst.components.perishable:StartPerishing()
inst.components.perishable.onperishreplacement = "spoiled_food"

inst:AddComponent("dryable")
inst.components.dryable:SetProduct("foliage_dried")
inst.components.dryable:SetDryTime(TUNING.DRY_FAST)
inst.components.dryable:SetBuildFile("meat_rack_food_petals")
inst.components.dryable:SetDriedBuildFile("meat_rack_food_petals")
```

## Dependencies & tags
**Components used:** `stackable`, `tradable`, `inspectable`, `fuel`, `inventoryitem`, `edible`, `perishable`, `dryable`.  
The prefab also calls helper functions: `MakeInventoryPhysics`, `MakeInventoryFloatable`, `MakeSmallBurnable`, `MakeSmallPropagator`, and `MakeHauntableLaunchAndIgnite`.  
**Tags added:** `cattoy`, `dryable`, `quagmire_stewable` (on cooked variant only).

## Properties
No public properties are defined directly in this file. All configuration is done via component APIs (e.g., `inst.components.edible.healthvalue = ...`) or tuning constants.

## Main functions
No custom methods are defined in this file. All logic resides in `master_postinit` and `master_postinit_cooked` hooks (handled externally for the Quagmire mode), and standard prefab callbacks (`fn`, `cooked_fn`).

### `fn()`
*   **Description:** Constructor for the pristine `foliage` prefab. Sets up visual state (bank `foliage`, build `foliage`, animation `anim`), audio (`pickupsound = "vegetation_grassy"`), physics, and attaches all required components.
*   **Parameters:** None (called with no arguments by the prefab system).
*   **Returns:** `inst` — The fully configured entity instance.

### `cooked_fn()`
*   **Description:** Constructor for the cooked `quagmire_foliage_cooked` prefab. Sets up visual state (animation `cooked`) and calls Quagmire-specific post-init.
*   **Parameters:** None.
*   **Returns:** `inst` — The cooked entity instance.

## Events & listeners
None identified. This file does not directly register or push events; event handling for Quagmire-specific behavior is deferred to `event_server_data("quagmire", "prefabs/foliage")` hooks, which are external.