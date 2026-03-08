---
id: sunkenchest_oceanmonument
title: Sunkenchest Oceanmonument
description: Defines loot configuration and initialization logic for ocean monument sunken chests in DST.
tags: [loot, world, container, ocean]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: scenarios
source_hash: 860b82b9
system_scope: world
---

# Sunkenchest Oceanmonument

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
This scenario file specifies the loot table and initialization behavior for sunken chests found in ocean monument structures. It defines what items may appear in such chests, including their drop probabilities, quantities, and optional per-item initialization logic (e.g., fuel level or charge usage). It depends on `chestfunctions.lua` to populate the chest entity with the configured loot.

## Usage example
```lua
local scen = require("scenarios/sunkenchest_oceanmonument")
-- When creating a sunken chest entity:
inst:ListenForEvent("oncreate", function(inst)
    scen.OnCreate(inst, scenarunner)
end)
```

## Dependencies & tags
**Components used:** `fueled`, `finiteuses`  
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `LOOT` | table | *(see source)* | Array of loot table entries; each entry defines item(s), count(s), optional chance, and optional `initfn`. |
| `GEMS` | table | `{"purplegem", "bluegem", "redgem", "orangegem", "yellowgem", "greengem"}` | Predefined list of gem item prefabs used in loot. |

## Main functions
### `OnCreate(inst, scenariorunner)`
*   **Description:** Attaches the predefined `LOOT` table to the chest entity by calling `chestfunctions.AddChestItems`. This populates the chest with randomized items upon world generation or chest placement.
*   **Parameters:**  
  `inst` (Entity) — The chest entity being created.  
  `scenariorunner` (any) — Scenario runner context; currently unused in this function.
*   **Returns:** Nothing.

### `InitFn(item)`
*   **Description:** Applies random initialization to an item based on its components. For `fueled` items, sets fuel level between 90–100%. For `finiteuses` items, sets current uses between 80–100% of total uses.
*   **Parameters:**  
  `item` (Entity) — The item entity to initialize.
*   **Returns:** Nothing.

### `GetRandomAmount5to8()`
*   **Description:** Helper function returning a random integer between 5 and 8 inclusive.
*   **Parameters:** None.
*   **Returns:** number — Random integer in [5, 8].

### `GetRandomAmount2to3()`
*   **Description:** Helper function returning a random integer between 2 and 3 inclusive.
*   **Parameters:** None.
*   **Returns:** number — Random integer in [2, 3].

## Events & listeners
- **Pushes:** None identified.  
*(Note: This scenario only hooks into the `oncreate` event at the entity level via its `OnCreate` callback; it does not directly register or push events itself.)*