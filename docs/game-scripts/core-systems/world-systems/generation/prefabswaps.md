---
id: prefabswaps
title: Prefab Swaps
description: World generation prefab variation system for diversifying game worlds
sidebar_position: 7

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Prefab Swaps

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `prefabswaps` module provides a system for replacing base prefabs with alternative variations during world generation. This allows for diversified game worlds where players might encounter different resource sources like grass gekkos instead of regular grass, or twiggy trees instead of saplings.

## Usage Example

```lua
-- Add a new prefab swap category
PrefabSwaps.AddPrefabSwap({
    category = "logs",
    name = "birch trees",
    prefabs = { "deciduoustree" },
    weight = 1,
    exclude_locations = { "cave" },
})

-- Select swaps for world generation
PrefabSwaps.SelectPrefabSwaps("forest", world_gen_options)

-- Check if a prefab is inactive
if PrefabSwaps.IsPrefabInactive("grassgekko") then
    -- Regular grass was selected instead
end
```

## Core Functions

### PrefabSwaps.AddPrefabSwap(swap_data) {#addprefabswap}

**Status:** `stable`

**Description:**
Registers a new prefab swap option for world generation.

**Parameters:**
- `swap_data` (table): Configuration table defining the swap

**Swap Data Structure:**
```lua
{
    category = "category_name",           -- Swap category identifier
    name = "display_name",               -- Human-readable name
    prefabs = { "prefab1", "prefab2" },  -- Prefabs this swap includes
    weight = 1,                          -- Selection probability weight
    primary = true,                      -- Is this the default option?
    exclude_locations = { "cave" },      -- Locations where this swap is not allowed
    required_locations = { "forest" },   -- Locations where this swap is required
}
```

**Example:**
```lua
-- Add alternative berry source
PrefabSwaps.AddPrefabSwap({
    category = "berries",
    name = "juicy berries",
    prefabs = { "berrybush_juicy" },
    weight = 1,
})

-- Add rare twig alternative  
PrefabSwaps.AddPrefabSwap({
    category = "twigs",
    name = "twiggy trees",
    prefabs = { "twiggytree", "ground_twigs" },
    weight = 1,
})
```

### PrefabSwaps.GetBasePrefabSwaps() {#getbaseprefabswaps}

**Status:** `stable`

**Description:**
Returns the complete table of registered prefab swap categories.

**Returns:**
- (table): Table mapping category names to swap option arrays

**Example:**
```lua
local all_swaps = PrefabSwaps.GetBasePrefabSwaps()
for category, swap_list in pairs(all_swaps) do
    print("Category:", category)
    for i, swap in ipairs(swap_list) do
        print("  Swap:", swap.name, "Weight:", swap.weight)
    end
end
```

### PrefabSwaps.SelectPrefabSwaps(location, world_gen_options, override_sets) {#selectprefabswaps}

**Status:** `stable`

**Description:**
Selects which prefab swaps to activate for world generation based on location and options.

**Parameters:**
- `location` (string): Generation location ("forest", "cave", etc.)
- `world_gen_options` (table): World generation configuration
- `override_sets` (table, optional): Manual swap overrides

**Selection Modes:**
- **Classic Mode:** Uses only primary (default) swaps
- **Highly Random:** Randomly selects from all valid options
- **Weighted Random:** Uses probability weights for selection

**Example:**
```lua
-- Classic world generation
local options = { prefabswaps_start = "classic" }
PrefabSwaps.SelectPrefabSwaps("forest", options)

-- Highly randomized world
local options = { prefabswaps_start = "highly random" }
PrefabSwaps.SelectPrefabSwaps("forest", options)

-- Manual overrides
local overrides = {
    grass = "grass gekko",
    berries = "juicy berries"
}
PrefabSwaps.SelectPrefabSwaps("forest", nil, overrides)
```

### PrefabSwaps.IsPrefabInactive(prefab) {#isprefabinactive}

**Status:** `stable`

**Description:**
Checks if a prefab has been deactivated by the swap selection process.

**Parameters:**
- `prefab` (string): Prefab name to check

**Returns:**
- (boolean): True if the prefab is inactive, false otherwise

**Example:**
```lua
-- Check if grass gekkos are active
if not PrefabSwaps.IsPrefabInactive("grassgekko") then
    print("Grass gekkos are active in this world")
else
    print("Regular grass is being used")
end
```

## Proxy System

The module includes proxy systems for handling special prefab relationships:

### PrefabSwaps.AddPrefabProxy(proxy, prefab) {#addprefabproxy}

**Status:** `stable`

**Description:**
Maps temporary prefab names to real prefab names for world generation.

**Parameters:**
- `proxy` (string): Temporary proxy name
- `prefab` (string): Real prefab name

**Example:**
```lua
-- Map permanent versions that shouldn't be culled
PrefabSwaps.AddPrefabProxy("perma_grass", "grass")
PrefabSwaps.AddPrefabProxy("ground_twigs", "twigs")
```

### PrefabSwaps.ResolvePrefabProxy(proxy) {#resolveprefabproxy}

**Status:** `stable`

**Description:**
Resolves a proxy name to its real prefab name.

**Returns:**
- (string): Real prefab name, or original if no proxy exists

### Customization Prefabs

#### PrefabSwaps.AddCustomizationPrefab(proxy, prefab) {#addcustomizationprefab}

**Status:** `stable`

**Description:**
Maps prefabs for customization-specific control during world generation.

**Example:**
```lua
-- Moon island rocks controlled by moon island settings
PrefabSwaps.AddCustomizationPrefab("lunar_island_rock1", "rock1")
PrefabSwaps.AddCustomizationPrefab("lunar_island_rock2", "rock2")
```

### Randomization Prefabs

#### PrefabSwaps.AddRandomizationPrefab(proxy, prefabs) {#addrandomizationprefab}

**Status:** `stable`

**Description:**
Maps a proxy name to a list of prefabs for random selection.

**Example:**
```lua
-- Random chess piece selection
PrefabSwaps.AddRandomizationPrefab("worldgen_chesspieces", {"knight", "bishop", "rook"})
```

## Built-in Swap Categories

### Grass Swaps

```lua
-- Regular grass (default)
{
    category = "grass",
    name = "regular grass", 
    prefabs = { "grass" },
    weight = 3,
    primary = true,
}

-- Grass gekko alternative
{
    category = "grass",
    name = "grass gekko",
    prefabs = { "grassgekko" },
    weight = 1,
    exclude_locations = { "cave" },
}
```

### Twig Swaps

```lua
-- Regular saplings (default)
{
    category = "twigs",
    name = "regular twigs",
    prefabs = { "sapling" },
    weight = 3,
    primary = true,
}

-- Twiggy tree alternative
{
    category = "twigs", 
    name = "twiggy trees",
    prefabs = { "twiggytree", "ground_twigs" },
    weight = 1,
}
```

### Berry Swaps

```lua
-- Regular berries (default)
{
    category = "berries",
    name = "regular berries",
    prefabs = { "berrybush" },
    weight = 3,
    primary = true,
}

-- Juicy berry alternative
{
    category = "berries",
    name = "juicy berries", 
    prefabs = { "berrybush_juicy" },
    weight = 1,
}
```

## Weight System

The swap system uses weighted random selection:

- **Higher weights** = More likely to be selected
- **Primary swaps** have precedence in classic mode
- **Location restrictions** filter available options

**Example Weight Distribution:**
```lua
-- 75% chance regular grass, 25% chance grass gekko
regular_grass.weight = 3   -- 3/(3+1) = 75%
grass_gekko.weight = 1     -- 1/(3+1) = 25%
```

## Location Restrictions

Swaps can be restricted by world location:

### Exclude Locations
```lua
{
    category = "grass",
    name = "grass gekko",
    exclude_locations = { "cave" },  -- Cannot appear in caves
}
```

### Required Locations
```lua
{
    category = "special_resource",
    name = "surface only",
    required_locations = { "forest" },  -- Only in forest worlds
}
```

## Advanced Usage

### Custom Swap Categories

```lua
-- Add new resource category
PrefabSwaps.AddPrefabSwap({
    category = "rocks",
    name = "gold rocks",
    prefabs = { "rock_gold" },
    weight = 1,
})

PrefabSwaps.AddPrefabSwap({
    category = "rocks", 
    name = "regular rocks",
    prefabs = { "rocks" },
    weight = 5,
    primary = true,
})
```

### Conditional Swaps

```lua
-- Swap that depends on world settings
local function AddConditionalSwap(world_settings)
    if world_settings.dangerous_world then
        PrefabSwaps.AddPrefabSwap({
            category = "grass",
            name = "spiky grass",
            prefabs = { "grass_spiky" },
            weight = 2,
        })
    end
end
```

### Checking Active Swaps

```lua
-- Determine what swaps are active after selection
local function GetActiveSwaps()
    local active = {}
    local base_swaps = PrefabSwaps.GetBasePrefabSwaps()
    
    for category, swaps in pairs(base_swaps) do
        for i, swap in ipairs(swaps) do
            if swap.active then
                active[category] = swap.name
                break
            end
        end
    end
    
    return active
end

-- Usage after SelectPrefabSwaps
local active_swaps = GetActiveSwaps()
print("Active grass type:", active_swaps.grass)
```

## Integration with World Generation

The swap system integrates with world generation at multiple levels:

### Room Generation
```lua
-- Rooms reference swap categories instead of specific prefabs
local grass_prefab = GetSwapPrefab("grass")  -- Gets active grass type
```

### Set Piece Generation
```lua
-- Set pieces adapt to active swaps
if PrefabSwaps.IsPrefabInactive("sapling") then
    -- Use twiggy trees in this set piece instead
end
```

### Task Generation
```lua
-- Tasks query active swaps for resource placement
local twig_source = GetActivePrefabForCategory("twigs")
```

## Related Modules

- [World Generation](../map/worldgen.md): Main world generation system
- [Prefab List](./prefablist.md): Complete prefab registry
- [Set Pieces](../map/setpieces.md): Pre-built world structures
- [Room Generation](../map/rooms.md): Individual room creation
