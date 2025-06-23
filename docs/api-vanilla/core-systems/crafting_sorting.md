---
title: Crafting Sorting System
description: Documentation of the Don't Starve Together crafting menu sorting system that organizes and prioritizes crafting recipes
sidebar_position: 6
slug: /crafting-sorting
last_updated: 2024-12-19
build_version: 675312
change_status: stable
---

# Crafting Sorting System

The Crafting Sorting system in Don't Starve Together provides multiple methods for organizing and displaying crafting recipes in the crafting menu. This system enables players to view recipes sorted by craftability, favorites, alphabetical order, or custom filter-based arrangements.

## Version History

| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 675312 | 2024-12-19 | stable | Updated documentation to match current implementation |
| 642130 | 2023-06-10 | added | Initial crafting sorting system documentation |

## Overview

The crafting sorting system serves multiple purposes:
- **Recipe Organization**: Provides different ways to sort and display crafting recipes
- **Player Preference**: Supports user customization through favorites and filters
- **Crafting Efficiency**: Prioritizes craftable items for quick access
- **Menu Navigation**: Improves user experience with logical recipe ordering

The system is implemented through four main sorting classes that can be combined to create a comprehensive crafting menu experience.

## Core Architecture

### Sorting Classes Overview

The system provides four main sorting mechanisms:

| Class | Purpose | Primary Use Case |
|-------|---------|------------------|
| `DefaultSort` | Filter-based organization | Organizing recipes by category filters |
| `CraftableSort` | Craftability prioritization | Showing craftable items first |
| `FavoriteSort` | User preference ordering | Prioritizing user-favorited recipes |
| `AlphaSort` | Alphabetical organization | Consistent alphabetical listing |

### MetaClass Pattern

All sorting classes use the MetaClass pattern for object-oriented functionality:

```lua
require("metaclass")

local DefaultSort = MetaClass(function(self, widget)
    -- Constructor implementation
end)
```

## DefaultSort Class

The `DefaultSort` class provides filter-based recipe organization using the game's crafting filter system.

### Constructor

```lua
local defaultSort = DefaultSort(widget)
```

**Parameters:**
- `widget`: The crafting menu widget that owns this sorter

### Key Properties

| Property | Type | Description |
|----------|------|-------------|
| `widget` | Object | Reference to the parent crafting widget |
| `[FILTER_NAME]` | Table | Filter-specific sorted and unsorted recipe tables |
| `unsorted` | Table | Global unsorted recipes lookup |
| `fullupdate` | Boolean | Flag indicating a full refresh is needed |

### Core Methods

#### BuildFavoriteTable()
Rebuilds the favorites filter table when favorites change.

```lua
function DefaultSort:BuildFavoriteTable()
    self.FAVORITES.sorted = FunctionOrValue(shallowcopy(CRAFTING_FILTERS.FAVORITES.recipes)) or {}
    self.FAVORITES.unsorted = {}
    -- Populate unsorted favorites
    self.fullupdate = true
end
```

#### OnFavoriteChanged(recipe_name, is_favorite_recipe)
Handles favorite status changes for recipes.

**Parameters:**
- `recipe_name`: String identifier of the recipe
- `is_favorite_recipe`: Boolean indicating new favorite status

#### GetSorted() / GetUnsorted()
Returns sorted or unsorted recipe arrays for the current filter.

```lua
function DefaultSort:GetSorted()
    if self.widget.current_filter_name then
        local filter = self[self.widget.current_filter_name]
        return filter.sorted
    else
        return {}
    end
end
```

### Iterator Implementation

The `DefaultSort` class implements custom iteration through the `__ipairs` metamethod:

```lua
function DefaultSort:__ipairs()
    local index = 0
    return coroutine.wrap(function()
        if self.widget.current_filter_name then
            local filter = self[self.widget.current_filter_name]
            -- Yield sorted recipes first
            for i, v in ipairs(filter.sorted) do
                index = index + 1
                coroutine.yield(index, v)
            end
            -- Then yield unsorted recipes
            for k in pairs(filter.unsorted) do
                index = index + 1
                coroutine.yield(index, k)
            end
        end
    end)
end
```

## CraftableSort Class

The `CraftableSort` class prioritizes recipes based on their craftability status, organizing them into buffered, craftable, and uncraftable categories.

### Constructor

```lua
local craftableSort = CraftableSort(widget, defaultsort)
```

**Parameters:**
- `widget`: The crafting menu widget
- `defaultsort`: Instance of DefaultSort for fallback sorting

### Recipe Categories

| Category | Description | Priority |
|----------|-------------|----------|
| `buffered` | Recipes with resources buffered for crafting | Highest |
| `craftable` | Recipes that can be crafted with available resources | High |
| `uncraftable` | Recipes missing required resources | Lowest |

### Build State Mapping

```lua
local build_state_sorting = {
    buffered = self.buffered,
    freecrafting = self.craftable,
    has_ingredients = self.craftable,
    prototype = self.craftable,
}
```

### Core Methods

#### BuildCraftableTable()
Updates recipe categorization based on current crafting state.

```lua
function CraftableSort:BuildCraftableTable()
    for recipe_name, data in pairs(self.widget.crafting_hud.valid_recipes) do
        local old_table = self.recipelookup[recipe_name]
        local new_table = build_state_sorting[data.meta.build_state] or self.uncraftable
        
        if old_table ~= new_table then
            -- Move recipe to new category
            self.recipelookup[recipe_name] = new_table
            old_table[recipe_name] = nil
            new_table[recipe_name] = true
        end
    end
end
```

#### FillSortedTable(recipes, validator, output)
Populates output table with sorted recipes that match the validator.

**Parameters:**
- `recipes`: Array of recipe names in sorted order
- `validator`: Table used as set for validation
- `output`: Array to populate with matching recipes

## FavoriteSort Class

The `FavoriteSort` class organizes recipes based on user favorites, displaying favorited recipes before non-favorited ones.

### Constructor

```lua
local favoriteSort = FavoriteSort(widget, defaultsort)
```

### Core Methods

#### BuildFavoriteTable()
Synchronizes favorite status with the crafting menu profile.

```lua
function FavoriteSort:BuildFavoriteTable()
    for recipe_name in pairs(AllRecipes) do
        if TheCraftingMenuProfile:IsFavorite(recipe_name) then
            if not self.favorite[recipe_name] then
                self.favorite[recipe_name] = true
                self.nonfavorite[recipe_name] = nil
                favorites_changed = true
            end
        end
    end
end
```

#### OnFavoriteChanged(recipe_name, is_favorite_recipe)
Handles real-time favorite status changes with optimized table updates.

```lua
function FavoriteSort:OnFavoriteChanged(recipe_name, is_favorite_recipe)
    if is_favorite_recipe then
        self.nonfavorite[recipe_name] = nil
        self.favorite[recipe_name] = true
        
        -- Update cached sorted arrays
        if not unsorted[recipe_name] then
            if self.nonfavorite_sorted then
                table.removearrayvalue(self.nonfavorite_sorted, recipe_name)
            end
            self.favorite_sorted = nil
        end
    end
end
```

## AlphaSort Class

The `AlphaSort` class provides alphabetical sorting of all recipes by their display names.

### Constructor

```lua
local alphaSort = AlphaSort(widget)
```

### Sorting Implementation

```lua
local function sort_alpha(a, b)
    local recipe_a = AllRecipes[a]
    local recipe_b = AllRecipes[b]
    local a_name = STRINGS.NAMES[string.upper(a)] or STRINGS.NAMES[string.upper(recipe_a.product)] or ""
    local b_name = STRINGS.NAMES[string.upper(b)] or STRINGS.NAMES[string.upper(recipe_b.product)] or ""
    return a_name < b_name
end

-- Pre-sort all recipes alphabetically
self.alpha_sorted = {}
for k, v in pairs(AllRecipes) do
    table.insert(self.alpha_sorted, k)
end
table.sort(self.alpha_sorted, sort_alpha)
```

### Simple Iterator

```lua
function AlphaSort:__ipairs()
    return ipairs(self.alpha_sorted)
end
```

## Usage Examples

### Basic Default Sorting

```lua
local crafting_widget = GetCraftingWidget()
local default_sorter = DefaultSort(crafting_widget)

-- Set current filter
crafting_widget.current_filter_name = "WEAPONS"

-- Iterate through sorted recipes
for index, recipe_name in default_sorter do
    print(index, recipe_name)
end
```

### Craftable Priority Sorting

```lua
local default_sorter = DefaultSort(crafting_widget)
local craftable_sorter = CraftableSort(crafting_widget, default_sorter)

-- Update craftability status
craftable_sorter:BuildCraftableTable()

-- Iterate: buffered first, then craftable, then uncraftable
for index, recipe_name in craftable_sorter do
    local recipe_data = crafting_widget.crafting_hud.valid_recipes[recipe_name]
    print(recipe_name, recipe_data.meta.build_state)
end
```

### Favorite-Priority Sorting

```lua
local default_sorter = DefaultSort(crafting_widget)
local favorite_sorter = FavoriteSort(crafting_widget, default_sorter)

-- Handle favorite changes
favorite_sorter:OnFavoriteChanged("spear", true)

-- Refresh display
if favorite_sorter:Refresh() then
    print("Sorting updated due to favorite changes")
end
```

### Alphabetical Sorting

```lua
local alpha_sorter = AlphaSort(crafting_widget)

-- Simple alphabetical iteration
for index, recipe_name in alpha_sorter do
    local display_name = STRINGS.NAMES[string.upper(recipe_name)]
    print(index, display_name, recipe_name)
end
```

### Combined Sorting Systems

```lua
-- Create layered sorting system
local default_sorter = DefaultSort(crafting_widget)
local craftable_sorter = CraftableSort(crafting_widget, default_sorter)
local favorite_sorter = FavoriteSort(crafting_widget, default_sorter)

-- Handle events
favorite_sorter:OnFavoriteChanged("torch", true)
craftable_sorter:OnSelectFilter()

-- Refresh all sorters
craftable_sorter:Refresh()
favorite_sorter:Refresh()
```

## Performance Considerations

### Lazy Evaluation

The sorting system uses lazy evaluation for performance:

```lua
-- Tables are only populated when needed
if not self.buffered_sorted then
    self.buffered_sorted = {}
    self:FillSortedTable(sorted, self.buffered, self.buffered_sorted)
end
```

### Incremental Updates

Changes are tracked incrementally to avoid full rebuilds:

```lua
function CraftableSort:BuildCraftableTable()
    local buffered_changed = false
    local craftable_changed = false
    
    -- Only rebuild changed categories
    if buffered_changed then
        self.buffered_sorted = nil
        self.buffered_unsorted = nil
    end
end
```

### Coroutine-Based Iteration

Large recipe lists use coroutines to prevent blocking:

```lua
return coroutine.wrap(function()
    for i, v in ipairs(self.favorite_sorted) do
        index = index + 1
        coroutine.yield(index, v)
    end
end)
```

## Integration Points

### Crafting Filters

The sorting system integrates with `CRAFTING_FILTERS`:

```lua
-- Access filter definitions
for k, v in pairs(CRAFTING_FILTERS) do
    self[k] = {
        sorted = FunctionOrValue(shallowcopy(v.recipes)) or {},
        unsorted = {},
    }
end
```

### Recipe System

Connects with the global `AllRecipes` table:

```lua
-- Process all available recipes
for k in pairs(AllRecipes) do
    self.unsorted[k] = true
end
```

### Crafting Profile

Integrates with user preferences:

```lua
-- Check favorite status
if TheCraftingMenuProfile:IsFavorite(recipe_name) then
    self.favorite[recipe_name] = true
end
```

## Module Exports

The module exports all four sorting classes:

```lua
return {
    DefaultSort = DefaultSort,
    CraftableSort = CraftableSort,
    FavoriteSort = FavoriteSort,
    AlphaSort = AlphaSort,
}
```

## Status Indicators

🟢 **Stable**: Core sorting functionality is well-established and reliable  
🟢 **Stable**: Integration with crafting menu system  
🟢 **Stable**: Performance optimizations and lazy evaluation  
🟢 **Stable**: User preference handling and persistence

## Related Modules

- [**Recipes**](./recipes.md) - Recipe definitions and crafting requirements
- [**Cooking**](./cooking.md) - Cooking recipe management system  
- [**Constants**](./constants.md) - Game constants including crafting filters
- [**Components**](./components/index.md) - Component system for crafting functionality

---

**Note**: This documentation covers the core sorting algorithms used by the crafting menu. For information about recipe definitions themselves, see the [Recipes documentation](./recipes.md).
