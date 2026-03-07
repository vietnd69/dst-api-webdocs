---
id: driftwood
title: Driftwood
description: A simple wood item that serves as fuel, edible material, repair resource, and waterproofer with zero effectiveness unless modified.
tags: [fuel, repair, consumable, environment]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 80c07300
system_scope: inventory
---

# Driftwood

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`driftwood_log` is a world item prefab that functions as lightweight fuel, a non-nutritive edible material (for specific entities like Bob’s abigail), and a wooden repair material for boats. It also carries the `waterproofer` tag and has a `waterproofer` component initialized with zero effectiveness. Its behavior is mostly defined through component configuration rather than custom logic.

## Usage example
```lua
local inst = SpawnPrefab("driftwood_log")
if inst and inst.components then
    -- Use as fuel
    print(inst.components.fuel.fuelvalue)  -- typically TUNING.MED_FUEL

    -- Use as repair material
    print(inst.components.repairer.healthrepairvalue)  -- TUNING.REPAIR_LOGS_HEALTH
    print(inst.components.repairer.repairmaterial)     -- "WOOD"

    -- Check waterproofer state
    print(inst.components.waterproofer.effectiveness)  -- 0
end
```

## Dependencies & tags
**Components used:** `edible`, `fuel`, `waterproofer`, `repairer`, `inspectable`, `inventoryitem`, `stackable`, `smallburnable`, `smallpropagator`, `hauntable`, `floatable`, `physics`, `animstate`, `transform`, `network`, `inventory`  
**Tags:** Adds `waterproofer` via `inst:AddTag("waterproofer")`

## Properties
No public properties are defined directly in the `driftwood_log` prefab. All relevant values are set on attached components:
- `edible.foodtype`, `edible.healthvalue`, `edible.hungervalue`
- `fuel.fuelvalue`
- `waterproofer.effectiveness`
- `repairer.healthrepairvalue`, `repairer.repairmaterial`, `repairer.boatrepairsound`

## Main functions
None defined directly in the prefab script. Component methods (e.g., `SetEffectiveness`, property assignments) are invoked inline during initialization.

## Events & listeners
No event listeners or pushed events are present in this script.