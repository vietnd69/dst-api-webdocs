---
id: treegrowthsolution
title: Treegrowthsolution
description: Provides fertilizer functionality for repairing and regrowing trees in DST, including soil cycle progression and waterlogging compatibility.
tags: [fertilizer, environment, repair, tree]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: e0305395
system_scope: environment
---

# Treegrowthsolution

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`treegrowthsolution` is a prefab component that defines the behavior of the Tree Growth Solution item, a fertilizer used to repair tree stumps and accelerate tree growth. It integrates with multiple systems: inventory (stackable), deployable fertilizer, repairer (for boat repair), and research. The component sets up game constants (soil cycles, health repair value, nutrients) and adds tags like `boat_patch` and `fertilizerresearchable` to enable appropriate interactions.

## Usage example
```lua
-- This is a prefab definition, not a component added manually.
-- The component is instantiated automatically when the prefab is created:
local inst = Prefab("treegrowthsolution", fn, assets, prefabs)
-- The component is used internally via:
-- inst.components.treegrowthsolution.fx_prefab = "treegrowthsolution_use_fx"
-- It is applied by the game when placed on a tree or boat via actions.
```

## Dependencies & tags
**Components used:** `fertilizerresearchable`, `fertilizer`, `treegrowthsolution`, `stackable`, `inspectable`, `inventoryitem`, `boatpatch`, `repairer`  
**Tags:** Adds `allow_action_on_impassable`, `boat_patch`, `fertilizerresearchable`

## Properties
No public properties. The component's state is configured via the constructor during prefab instantiation.

## Main functions
This file is a prefab definition, not a reusable component class. It instantiates and configures a `treegrowthsolution` component internally (see below), but does not expose a standalone component class in this file.

*Note: The actual `treegrowthsolution` component logic (the ECS component named `treegrowthsolution`) is defined elsewhere (likely in `components/treegrowthsolution.lua`). This file only references it as a component to be added to the prefab.*

## Events & listeners
None identified in this file.
