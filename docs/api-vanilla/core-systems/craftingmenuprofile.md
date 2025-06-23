---
title: Crafting Menu Profile
description: Documentation of the Don't Starve Together crafting menu profile system that manages user preferences and customizations
sidebar_position: 7
slug: /crafting-menu-profile
last_updated: 2024-12-19
build_version: 675312
change_status: stable
---

# Crafting Menu Profile

The Crafting Menu Profile system in Don't Starve Together manages user preferences and customizations for the crafting menu interface. This system handles favorites, pinned recipes, sorting preferences, and provides persistent storage of user settings across game sessions.

## Version History

| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 675312 | 2024-12-19 | stable | Updated documentation to match current implementation |
| 642130 | 2023-06-10 | added | Initial crafting menu profile system documentation |

## Overview

The crafting menu profile system serves multiple purposes:
- **User Preferences**: Stores personalized crafting menu settings
- **Favorites Management**: Allows players to mark and organize favorite recipes
- **Recipe Pinning**: Enables quick access to frequently used recipes
- **Sorting Customization**: Remembers preferred sorting modes
- **Data Persistence**: Maintains settings across game sessions

The system provides a persistent, user-specific configuration layer that enhances the crafting experience by remembering player preferences and workflow optimizations.

## Core Architecture

### Class Structure

The `CraftingMenuProfile` is implemented as a Class with the following core properties:

| Property | Type | Description |
|----------|------|-------------|
| `favorites` | Array | Ordered list of favorite recipe names |
| `favorites_ordered` | Table | Lookup table for quick favorite status checking |
| `pinned_pages` | Array | Collection of pinned recipe pages (may contain holes) |
| `pinned_page` | Number | Currently active pinned page index |
| `pinned_recipes` | Table | Reference to current page's pinned recipes |
| `sort_mode` | Number | Current sorting mode preference |
| `save_enabled` | Boolean | Flag controlling whether saves are allowed |
| `dirty` | Boolean | Flag indicating unsaved changes |

### Platform Considerations

The system adapts to platform limitations:

```lua
local USE_SETTINGS_FILE = PLATFORM ~= "PS4" and PLATFORM ~= "NACL"
```

## Constructor

```lua
local profile = CraftingMenuProfile()
```

The constructor initializes default values:
- Creates empty favorites arrays
- Sets up default pinned recipe pages
- Initializes sort mode to nil
- Enables saving by default

### Default Initialization

```lua
function CraftingMenuProfile:__init()
    self.favorites = {}
    self.favorites_ordered = {}
    self.pinned_pages = {{}} -- Array may have holes
    self.pinned_page = 1
    self.pinned_recipes = self.pinned_pages[1]
    self:MakeDefaultPinnedRecipes()
    self.sort_mode = nil
    self.save_enabled = true
end
```

## Data Persistence

### Save System

The profile automatically saves data to persistent storage when changes occur:

```lua
function CraftingMenuProfile:Save(force_save)
    if force_save or (self.save_enabled and self.dirty) then
        local data = {
            version = 1,
            favorites = self.favorites,
            sort_mode = self.sort_mode,
            pinned_page = self.pinned_page,
        }
        
        -- Handle arrays with holes for JSON encoding
        data.pinned_pages = {}
        for k, v in pairs(self.pinned_pages) do
            data.pinned_pages[tostring(k)] = {}
            for kk, vv in pairs(v) do
                data.pinned_pages[tostring(k)][tostring(kk)] = vv
            end
        end
        
        TheSim:SetPersistentString("craftingmenuprofile", json.encode(data), false)
        self.dirty = false
    end
end
```

### Load System

Data is loaded asynchronously from persistent storage:

```lua
function CraftingMenuProfile:Load()
    TheSim:GetPersistentString("craftingmenuprofile", function(load_success, data)
        if load_success and data ~= nil then
            local status, data = pcall(function() return json.decode(data) end)
            if status and data then
                self.favorites = data.favorites or {}
                self.favorites_ordered = table.invert(self.favorites)
                self.sort_mode = tonumber(data.sort_mode)
                self.pinned_page = data.pinned_page or 1
                -- Restore pinned pages with hole handling
            end
        end
    end)
end
```

### JSON Encoding Considerations

The system handles Lua arrays with holes, which are not directly compatible with JSON:

```lua
-- Convert sparse arrays to string-keyed objects for JSON
data.pinned_pages = {}
for k, v in pairs(self.pinned_pages) do
    data.pinned_pages[tostring(k)] = {}
    for kk, vv in pairs(v) do
        data.pinned_pages[tostring(k)][tostring(kk)] = vv
    end
end
```

## Favorites Management

### Adding Favorites

```lua
function CraftingMenuProfile:AddFavorite(recipe_name)
    if not type(recipe_name) == "string" then
        print("[CraftingMenuProfile] Error: only strings can be added to recipe favorites.")
        return
    end
    
    if not self.favorites_ordered[recipe_name] then
        table.insert(self.favorites, recipe_name)
        self.favorites_ordered[recipe_name] = #self.favorites
        self.dirty = true
    end
end
```

### Removing Favorites

```lua
function CraftingMenuProfile:RemoveFavorite(recipe_name)
    local cur_size = #self.favorites
    table.removearrayvalue(self.favorites, recipe_name)
    if cur_size ~= #self.favorites then
        self.favorites_ordered = table.invert(self.favorites)
        self.dirty = true
    end
end
```

### Checking Favorite Status

```lua
function CraftingMenuProfile:IsFavorite(recipe_name)
    return self.favorites_ordered[recipe_name] ~= nil
end
```

### Accessing Favorites

```lua
-- Get ordered list of favorites
function CraftingMenuProfile:GetFavorites()
    return self.favorites
end

-- Get lookup table for O(1) favorite checking
function CraftingMenuProfile:GetFavoritesOrder()
    return self.favorites_ordered
end
```

## Pinned Recipes System

### Setting Pinned Recipes

```lua
function CraftingMenuProfile:SetPinnedRecipe(slot, recipe_name, skin_name)
    if recipe_name == nil then
        self.pinned_recipes[slot] = nil
    elseif self.pinned_recipes[slot] ~= nil then
        self.pinned_recipes[slot].recipe_name = recipe_name
        self.pinned_recipes[slot].skin_name = skin_name
    else
        self.pinned_recipes[slot] = {
            recipe_name = recipe_name, 
            skin_name = skin_name
        }
    end
    
    self.dirty = true
end
```

### Accessing Pinned Recipes

```lua
function CraftingMenuProfile:GetPinnedRecipes()
    return self.pinned_recipes
end
```

### Page Management

The system supports multiple pages of pinned recipes:

```lua
function CraftingMenuProfile:SetCurrentPage(page_num)
    self.pinned_page = page_num
    if self.pinned_pages[page_num] == nil then
        self.pinned_pages[page_num] = {}
    end
    self.pinned_recipes = self.pinned_pages[page_num]
    self.dirty = true
end

function CraftingMenuProfile:NextPage()
    local next_page = self.pinned_page + 1
    self:SetCurrentPage(next_page <= Profile:GetCraftingNumPinnedPages() and next_page or 1)
end

function CraftingMenuProfile:PrevPage()
    local prev_page = self.pinned_page - 1
    self:SetCurrentPage(prev_page >= 1 and prev_page or Profile:GetCraftingNumPinnedPages())
end
```

### Default Pinned Recipes

The system initializes with default pinned recipes from tuning constants:

```lua
function CraftingMenuProfile:MakeDefaultPinnedRecipes()
    self.pinned_pages = {{}, {}}
    for _, v in ipairs(TUNING.DEFAULT_PINNED_RECIPES) do
        table.insert(self.pinned_pages[1], {recipe_name = v})
    end
    for _, v in ipairs(TUNING.DEFAULT_PINNED_RECIPES_2) do
        table.insert(self.pinned_pages[2], {recipe_name = v})
    end
    
    self.pinned_recipes = self.pinned_pages[1]
    self.pinned_page = 1
end
```

## Sort Mode Management

### Setting Sort Mode

```lua
function CraftingMenuProfile:SetSortMode(mode)
    if self.sort_mode ~= mode then
        self.sort_mode = tonumber(mode)
        self.dirty = true
    end
end
```

### Getting Sort Mode

```lua
function CraftingMenuProfile:GetSortMode()
    return self.sort_mode
end
```

## Usage Examples

### Basic Profile Setup

```lua
-- Create and load profile
local profile = CraftingMenuProfile()
profile:Load()

-- Check if a recipe is favorited
if profile:IsFavorite("torch") then
    print("Torch is favorited!")
end

-- Add/remove favorites
profile:AddFavorite("campfire")
profile:RemoveFavorite("torch")
```

### Managing Pinned Recipes

```lua
-- Set a pinned recipe with skin
profile:SetPinnedRecipe(1, "spear", "spear_wathgrithr")

-- Navigate between pages
profile:NextPage()
profile:SetPinnedRecipe(1, "torch", nil)

-- Get current pinned recipes
local pinned = profile:GetPinnedRecipes()
for slot, recipe_data in pairs(pinned) do
    if recipe_data then
        print("Slot " .. slot .. ": " .. recipe_data.recipe_name)
        if recipe_data.skin_name then
            print("  Skin: " .. recipe_data.skin_name)
        end
    end
end
```

### Sort Mode Configuration

```lua
-- Set sort mode (constants defined elsewhere)
profile:SetSortMode(CRAFTING_SORT_MODE.CRAFTABLE)

-- Get current sort mode
local current_mode = profile:GetSortMode()
if current_mode then
    print("Current sort mode: " .. current_mode)
end
```

### Working with Favorites Lists

```lua
-- Get all favorites in order
local favorites = profile:GetFavorites()
for i, recipe_name in ipairs(favorites) do
    print(i .. ": " .. recipe_name)
end

-- Quick lookup for favorites
local favorites_lookup = profile:GetFavoritesOrder()
local is_favorite = favorites_lookup["torch"] ~= nil
```

### Manual Save Operations

```lua
-- Force save regardless of dirty flag
profile:Save(true)

-- Normal save (only if dirty)
profile:Save()
```

## Data Structure Details

### Favorites Structure

```lua
-- favorites: Array maintaining order
favorites = {"torch", "campfire", "spear"}

-- favorites_ordered: Lookup table for O(1) access
favorites_ordered = {
    torch = 1,
    campfire = 2,
    spear = 3
}
```

### Pinned Pages Structure

```lua
-- pinned_pages: Array with potential holes
pinned_pages = {
    [1] = {
        [1] = {recipe_name = "torch", skin_name = nil},
        [2] = {recipe_name = "campfire", skin_name = nil}
    },
    [3] = {  -- Note: page 2 is missing (hole in array)
        [1] = {recipe_name = "spear", skin_name = "spear_wathgrithr"}
    }
}
```

### Save Data Format

```lua
-- Saved JSON structure
{
    version = 1,
    favorites = {"torch", "campfire"},
    sort_mode = 2,
    pinned_page = 1,
    pinned_pages = {
        ["1"] = {
            ["1"] = {recipe_name = "torch"},
            ["2"] = {recipe_name = "campfire"}
        }
    }
}
```

## Performance Considerations

### Efficient Favorite Lookups

The system maintains both an ordered array and a lookup table:

```lua
-- O(1) favorite checking
function CraftingMenuProfile:IsFavorite(recipe_name)
    return self.favorites_ordered[recipe_name] ~= nil
end
```

### Dirty Flag Optimization

Changes are only saved when the dirty flag is set:

```lua
-- Only save when data has changed
if self.save_enabled and self.dirty then
    -- Perform save operation
    self.dirty = false
end
```

### Sparse Array Handling

The system properly handles arrays with holes for pinned pages:

```lua
-- Use pairs() instead of ipairs() for sparse arrays
for k, v in pairs(self.pinned_pages) do
    -- Handle each existing page
end
```

## Integration Points

### Global Profile Access

The profile is typically accessed through a global instance:

```lua
-- Global access pattern
TheCraftingMenuProfile = CraftingMenuProfile()
```

### Tuning Integration

Default values come from tuning constants:

```lua
-- References to TUNING constants
TUNING.DEFAULT_PINNED_RECIPES
TUNING.DEFAULT_PINNED_RECIPES_2
```

### Platform Integration

Persistent storage uses platform-specific APIs:

```lua
-- Platform-aware persistence
TheSim:SetPersistentString("craftingmenuprofile", json.encode(data), false)
TheSim:GetPersistentString("craftingmenuprofile", callback)
```

## Deprecated Methods

The system includes deprecated methods for backward compatibility:

```lua
-- Deprecated session data methods
function CraftingMenuProfile:DeserializeLocalClientSessionData(data)
    -- No longer used
end

function CraftingMenuProfile:SerializeLocalClientSessionData()
    return {pinned_recipes = {}}
end
```

## Error Handling

### Type Validation

```lua
function CraftingMenuProfile:AddFavorite(recipe_name)
    if not type(recipe_name) == "string" then
        print("[CraftingMenuProfile] Error: only strings can be added to recipe favorites.")
        return
    end
end
```

### Load Error Handling

```lua
function CraftingMenuProfile:Load()
    TheSim:GetPersistentString("craftingmenuprofile", function(load_success, data)
        if load_success and data ~= nil then
            local status, data = pcall(function() return json.decode(data) end)
            if status and data then
                -- Process loaded data
            else
                print("Failed to load the crafting menu profile!", status, data)
            end
        end
    end)
end
```

## Status Indicators

🟢 **Stable**: Core profile persistence and data management  
🟢 **Stable**: Favorites system with ordered lists and lookups  
🟢 **Stable**: Pinned recipes with multi-page support  
🟢 **Stable**: Sort mode preferences  
🟢 **Stable**: Platform-specific adaptations

## Related Modules

- [**Crafting Sorting**](./crafting_sorting.md) - Recipe sorting system that uses profile preferences
- [**Recipes**](./recipes.md) - Recipe definitions for favorites and pinning
- [**Tuning**](./tuning.md) - Configuration constants including default pinned recipes
- [**Constants**](./constants.md) - Game constants including sort mode definitions

---

**Note**: This documentation covers the user preference management system for the crafting menu. For information about the actual recipe sorting implementation, see the [Crafting Sorting documentation](./crafting_sorting.md).
