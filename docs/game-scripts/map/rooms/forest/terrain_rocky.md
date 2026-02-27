---
id: terrain_rocky
title: Terrain Rocky
description: Defines forest-level room templates with rocky terrain characteristics for procedural world generation.
tags: [world, generation, terrain, room]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: 5387d700
---

# Terrain Rocky

> Based on game build **714014** | Last updated: 2026-02-27

## Overview
This file defines multiple room templates (via `AddRoom` calls) used in the forest world type to generate terrain with rocky surface characteristics. Each room specifies visual appearance (`colour`), tile type (`value`), strategic tags (`tags`), and content distribution rules (`contents`). These templates control how rocky areas appear in generated forests—including rock placement, rare spawn probabilities, and environmental variation—without implementing an ECS component. The file operates entirely at the world generation layer and does not contribute runtime components, listeners, or entities.

## Usage example
This file is not used directly by modders during runtime. Instead, it is loaded during world initialization to populate the pool of available room definitions. Modders may override or extend these definitions by calling `AddRoom` themselves with new identifiers, matching the same structure:

```lua
AddRoom("MyCustomRockyRoom", {
    colour = {r = 0.5, g = 0.7, b = 0.7, a = 0.5},
    value = WORLD_TILES.ROCKY,
    tags = {"ExitPiece", "MyCustomTag"},
    contents = {
        distributepercent = 0.1,
        distributeprefabs = {
            rock1 = 2,
            rock2 = 1,
            custom_rock_prefab = 0.5,
        },
    },
})
```

## Dependencies & tags
**Components used:** None — this file does not interact with any ECS components.  
**Tags:** Each defined room includes a static list of tags such as `"ExitPiece"`, `"Chester_Eyebone"`, `"Astral_1"`, `"Astral_2"`, or `"CharlieStage_Spawner"`. These tags influence worldgen logic (e.g., exit conditions, astral portal progression, or boss stage transitions) but are not runtime tag manipulations.

## Properties
No instance properties exist. This file exclusively calls the global `AddRoom` function with static configuration tables.

## Main functions
This file does not define any functions or methods. It is a declarative configuration script composed of `AddRoom` calls.

## Events & listeners
No events or listeners are involved. This file contributes only static room definitions used by the world generation system at initialization time.

---