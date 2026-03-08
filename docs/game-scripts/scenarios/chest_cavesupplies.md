---
id: chest_cavesupplies
title: Chest Cavesupplies
description: Supplies chest handler for cave scenarios, populating a chest with randomized cave-appropriate items and applying condition or uses initialization to specific equipment.
tags: [loot, chest, caves]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 97565d46
system_scope: inventory
---

# Chest Cavesupplies

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`chest_cavesupplies` is a scenario helper script that defines the contents of a supply chest spawned in cave environments. It uses `chestfunctions.AddChestItems` to populate the chest with a curated list of items common to subterranean gameplay, including resources, food, light sources, and wearable gear. Armor items (`armorsnurtleshell`, `slurtlehat`) and `batbat` receive randomized initial condition or finite-uses values upon spawn.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("chest")
inst:AddComponent("inventory")
inst:AddComponent("loot")
inst.components.loot:OnOpen(...)

-- Populate with cave supplies
local chest_cavesupplies = require("scenarios/chest_cavesupplies")
chest_cavesupplies.OnCreate(inst, scenariorunner)
```

## Dependencies & tags
**Components used:** `armor` (`SetCondition`, `maxcondition`), `finiteuses` (`SetUses`, `total`) — accessed via `item.components.X` for initialization.
**Tags:** None identified.

## Properties
No public properties. This is a standalone script exposing only `OnCreate`.

## Main functions
### `OnCreate(inst, scenariorunner)`
* **Description:** Populates the provided chest entity (`inst`) with a predefined list of cave-appropriate items. Conditional items (armor and `batbat`) are initialized with randomized condition/uses based on their max values.
* **Parameters:**  
  - `inst` (Entity) — The chest entity to populate. Must have `inventory`, `loot`, and `itemlist` components.  
  - `scenariorunner` (ScenarioRunner) — Unused in current implementation; present for API consistency.
* **Returns:** Nothing.
* **Error states:** Does not validate existence of `inst.components.armor` or `inst.components.finiteuses` before calling `initfn`; may crash if a referenced item lacks the required component.

## Events & listeners
None.