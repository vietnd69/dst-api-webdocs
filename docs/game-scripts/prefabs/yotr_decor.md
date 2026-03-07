---
id: yotr_decor
title: Yotr Decor
description: Creates decorative campfire-like structures that burn fuel, produce light, and interact with weather and gameplay events.
tags: [environment, fire, structure, lighting]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0a823ecc
system_scope: environment
---

# Yotr Decor

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`yotr_decor` defines reusable decorative campfire prefabs (`yotr_decor_1` and `yotr_decor_2`) that function as temporary light sources fueled by items like charcoal or wood. These prefabs integrate with multiple components: `burnable`, `fueled`, `lootdropper`, `workable`, `hauntable`, `inspectable`, and `storytellingprop`. They respond to weather (rain slows fuel consumption), emit light via a child `torchfire` entity, and yield ash or charcoal on destruction or fuel exhaustion. The component also handles seasonal event loot (e.g., winter ornaments during Winters Feast).

## Usage example
```lua
-- Create a yotr_decor_1 instance (e.g., in a level or scenario)
local decor = SpawnPrefab("yotr_decor_1")
decor.Transform:SetPosition(0, 0, 0)

-- Manually ignite it with initial fuel
if decor.components.fueled then
    decor.components.fueled:DoDelta(TUNING.FIREPIT_FUEL_START)
end
```

## Dependencies & tags
**Components used:**  
`burnable`, `fueled`, `lootdropper`, `workable`, `hauntable`, `inspectable`, `storytellingprop`  
**Tags added:** `campfire`, `structure`

## Properties
No public properties are initialized in the constructor or exposed as standalone values. All configuration is done via component methods during prefab construction.

## Main functions
No standalone functions are defined outside the prefab factory. The `makedeco` function is the core factory, but as it is internal to this file and constructs prefabs rather than exposing reusable logic, it is not documented here per DST conventions. All external interactions occur through the component APIs listed below.

## Events & listeners
- **Listens to:**  
  - `onbuilt` - triggers visual/sound feedback (`onbuilt` function).
- **Pushes:**  
  - Standard events from underlying components:  
    - `onignite`, `onextinguish` (from `burnable`)  
    - `onfueldsectionchanged`, `percentusedchange` (from `fueled`)  
    - `loot_prefab_spawned`, `entity_droploot` (from `lootdropper`)