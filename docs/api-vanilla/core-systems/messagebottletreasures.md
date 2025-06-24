---
id: core-systems-messagebottletreasures
title: Message Bottle Treasures
description: System for generating treasure containers and loot from message bottles
sidebar_position: 117
slug: /api-vanilla/core-systems/messagebottletreasures
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Message Bottle Treasures

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `messagebottletreasures` module manages the treasure generation system for message bottles in Don't Starve Together. It defines treasure templates, loot tables, and functions for creating treasure containers with randomized contents based on preset configurations.

## Usage Example

```lua
local MessageBottleTreasures = require("messagebottletreasures")

-- Generate a treasure at a specific location
local treasure = MessageBottleTreasures.GenerateTreasure(Vector3(100, 0, 100))

-- Generate a specific treasure type
local chest = MessageBottleTreasures.GenerateTreasure(
    Vector3(100, 0, 100), 
    "sunkenchest"
)

-- Get all prefabs used by the treasure system
local prefabs = MessageBottleTreasures.GetPrefabs()
```

## Functions

### GenerateTreasure(pt, overrideprefab, spawn_as_empty, postfn) {#generate-treasure}

**Status:** `stable`

**Description:**
Generates a treasure container at the specified position with randomized contents based on treasure templates and presets.

**Parameters:**
- `pt` (Vector3): Position where the treasure should be spawned
- `overrideprefab` (string, optional): Specific treasure prefab to spawn instead of random selection
- `spawn_as_empty` (boolean, optional): If true, spawns the container without any loot
- `postfn` (function, optional): Post-processing function called after treasure creation

**Returns:**
- (Entity): The spawned treasure entity, or nil if spawning failed

**Example:**
```lua
-- Generate random treasure
local treasure = GenerateTreasure(Vector3(0, 0, 0))

-- Generate specific treasure type
local chest = GenerateTreasure(Vector3(10, 0, 10), "sunkenchest")

-- Generate empty treasure with post-processing
local empty_treasure = GenerateTreasure(
    Vector3(20, 0, 20), 
    "sunkenchest", 
    true, 
    function(treasure)
        treasure:AddTag("custom_treasure")
    end
)
```

### GetPrefabs() {#get-prefabs}

**Status:** `stable`

**Description:**
Returns a list of all prefab names that can be spawned by the treasure generation system, including containers, loot items, and trinkets.

**Returns:**
- (table): Array of prefab name strings

**Example:**
```lua
local all_prefabs = GetPrefabs()
for i, prefab in ipairs(all_prefabs) do
    print("Treasure system uses:", prefab)
end
```

## Treasure Templates

### treasure_templates

**Status:** `stable`

**Description:**
Main configuration table defining available treasure types and their loot presets.

**Structure:**
```lua
treasure_templates = {
    [treasure_prefab] = {
        treasure_type_weight = number,
        presets = {
            [preset_name] = {
                preset_weight = number,
                guaranteed_loot = {
                    [item_prefab] = count_or_range,
                },
                randomly_selected_loot = {
                    { [item_prefab] = weight, ... },
                }
            }
        }
    }
}
```

### Available Treasure Types

#### sunkenchest

**Status:** `stable`

**Description:**
Sunken chest treasure with multiple themed presets for different explorer types.

**Weight:** 1

**Presets:**

##### saltminer (Weight: 3)
- **Guaranteed Loot:**
  - `cookiecuttershell`: 4-6 pieces
  - `boatpatch`: 2-4 pieces
  - `saltrock`: 5-8 pieces
  - `goldenpickaxe`: 1 piece
  - `scrapbook_page`: 0-1 pieces
- **Random Selection:**
  - One gem: `bluegem` or `redgem` (equal weight)

##### traveler (Weight: 1)
- **Guaranteed Loot:**
  - `cane`: 1 piece
  - `heatrock`: 1 piece
  - `gnarwail_horn`: 1 piece
  - `papyrus`: 4-8 pieces
  - `featherpencil`: 2-4 pieces
  - `spoiled_fish`: 3-5 pieces
  - `cookingrecipecard`: 1 piece
  - `scrapbook_page`: 0-3 pieces
- **Random Selection:**
  - Navigation tool: `compass` (25%) or `goggleshat` (75%)

##### fisher (Weight: 3)
- **Guaranteed Loot:**
  - `boatpatch`: 4-8 pieces
  - `malbatross_feather`: 4-10 pieces
  - `oceanfishingrod`: 1 piece
  - `oceanfishingbobber_robin_winter`: 2-5 pieces
  - `oceanfishinglure_spoon_green`: 1-4 pieces
  - `oceanfishinglure_hermit_heavy`: 0-2 pieces
  - `cookingrecipecard`: 1 piece
  - `scrapbook_page`: 0-1 pieces
- **Random Selection:**
  - Boat equipment: Various boat items and blueprints

##### miner (Weight: 2)
- **Guaranteed Loot:**
  - `cutstone`: 3-6 pieces
  - `goldnugget`: 3-6 pieces
  - `moonglass`: 3-6 pieces
  - `moonrocknugget`: 3-6 pieces
  - `goldenpickaxe`: 1 piece
  - `scrapbook_page`: 0-1 pieces
- **Random Selection:**
  - Rare gems: `purplegem`, `greengem`, `yellowgem`, `orangegem` (varying weights)

##### splunker (Weight: 1)
- **Guaranteed Loot:**
  - `gears`: 1-2 pieces
  - `thulecite`: 4-8 pieces
  - `multitool_axe_pickaxe`: 1 piece
  - `armorruins`: 1 piece
  - `lantern`: 1 piece
  - `scrapbook_page`: 0-1 pieces
- **Random Selection:**
  - Two gem selections with different weights

## Trinket System

### trinkets

**Status:** `stable`

**Description:**
Array of trinket prefab names that can be randomly added to treasure containers.

**Available Trinkets:**
- `trinket_3` through `trinket_9`
- `trinket_17`, `trinket_22`, `trinket_27`

### TRINKET_CHANCE

**Value:** `0.02`

**Status:** `stable`

**Description:** 
Probability (2%) that a trinket will be added to a treasure container if there's space available.

## Special Loot Systems

### Ancient Tree Seeds

**Status:** `stable`

**Description:**
Treasure containers have a chance to contain ancient tree seeds based on world cycles. The chance increases over time within defined limits.

**Calculation:**
```lua
local chance = math.clamp(
    TheWorld.state.cycles * TUNING.ANCIENT_TREE_SEED_CHANCE_RATE,
    TUNING.ANCIENT_TREE_SEED_MIN_CHANCE,
    TUNING.ANCIENT_TREE_SEED_MAX_CHANCE
)
```

### Loot Generation Process

1. **Container Selection:** Choose treasure prefab based on weighted random selection
2. **Preset Selection:** If presets exist, select one based on preset weights
3. **Guaranteed Loot:** Add all guaranteed items with their specified quantities
4. **Random Selection:** Process each random selection table independently
5. **Special Additions:** Check for ancient tree seeds and trinkets if space allows
6. **Container Population:** Add all generated items to the treasure container

## Constants

### TRINKET_CHANCE

**Value:** `0.02`

**Status:** `stable`

**Description:** Base probability for trinket generation in treasure containers.

## Related Modules

- [Prefabs](./prefabs.md): Treasure container and loot item definitions
- [Recipes](./recipes.md): Related to cooking recipe cards found in treasures
- [Constants](./constants.md): Tuning values for ancient tree seed generation
