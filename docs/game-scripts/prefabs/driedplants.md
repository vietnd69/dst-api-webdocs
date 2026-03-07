---
id: driedplants
title: Driedplants
description: Constructs dried vegetable items (e.g., dried petals, seeds) with consumable, fuel, and burnable properties, primarily used as loot, crafting ingredients, or cat toys.
tags: [inventory, crafting, consumable, environmental]
sidebar_position: 10

last_updated: 2026-03-05
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 0e4d2661
system_scope: inventory
---

# Driedplants

> Based on game build **714014** | Last updated: 2026-03-05

## Overview
`driedplants.lua` is a prefab factory script that dynamically generates dried versions of base vegetation items (e.g., petal, berry, mushroom). Each generated item functions as a small stackable inventory item, edible consumable, small fuel source, and ignitable propagator for fire hazards. The script depends on `driedplants_defs.lua` for data definitions and supports mod overrides via `data_only` flags. It integrates with core components like `edible`, `stackable`, `fuel`, and `propagator`, and is designed for in-world visual and functional consistency across multiplayer sessions.

## Usage example
This script is typically used as a prefabs loader during world initialization. A mod may add a custom dried item like so:
```lua
local driedplants = require("prefabs/driedplants")
local driedplants_defs = require("prefabs/driedplants_defs")

table.insert(driedplants_defs.plants, {
    name = "customflower",
    healthvalue = TUNING.HEALING_TINY,
    sanityvalue = 5,
    oneaten = function(inst, eater) -- optional custom on-eat logic
        eater.components.sanity.curerate = 1.5
        eater.components.sanity:DoDelta(10)
    end,
})

-- The rest is handled by the script's loop (no direct call needed)
```

## Dependencies & tags
**Components used:** `edible`, `stackable`, `fuel`, `propagator`, `inspectable`, `inventoryitem`, `tradable`, `smallburnable`, `smallpropagator`, `hauntablelaunchandperish`  
**Tags:** Adds `cattoy`

## Properties
No public properties — this script is a stateless prefab constructor.

## Main functions
### `MakeDriedPetal(data)`
*   **Description:** Creates and returns a `Prefab` definition for a dried vegetation item using the provided `data` configuration. Handles anim, physics, network, and component setup.
*   **Parameters:** `data` (table) — expects keys: `name` (string, required), optionally `bank`, `build`, `healthvalue`, `sanityvalue`, and `oneaten` (function). Used to name, configure visuals, and define edible properties.
*   **Returns:** Prefab — a ready-to-use prefab definition for the dried item (e.g., `"petal_dried"`).
*   **Error states:** Defaults to `TUNING.HEALING_TINY` for `healthvalue`, `0` for `hungervalue`, and `0` for `sanityvalue` if not specified. Fails to add `oneaten` callback if `data.oneaten` is `nil` or invalid.

## Events & listeners
None identified.