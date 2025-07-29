---
title: "Cookbook Data"
description: "Recipe discovery and food knowledge management system for Don't Starve Together"
sidebar_position: 2

last_updated: "2025-06-25"
build_version: "676312"
change_status: "modified"
---

# Cookbook Data 🔄

The **CookbookData** module manages the cookbook system in Don't Starve Together, tracking discovered recipes, food preparation knowledge, and providing persistent storage for cooking-related data. It serves as the backend for the in-game cookbook interface.

## Overview

CookbookData handles:
- **Recipe Discovery**: Learning and storing cooking recipes as players discover them
- **Food Knowledge**: Tracking which foods have been eaten and their nutritional stats
- **Data Persistence**: Local and online synchronization of cookbook progress
- **Filter Management**: User preferences for cookbook interface filtering
- **New Content Tracking**: Flagging newly discovered foods and recipes

## Class Definition

### CookbookData Class

```lua
local CookbookData = Class(function(self)
    self.preparedfoods = {}
    self.newfoods = {}
    self.filters = {}
    --self.save_enabled = nil
end)
```

**Properties:**
- `preparedfoods` (table): Dictionary of discovered foods and their recipes
- `newfoods` (table): Flags for newly discovered foods
- `filters` (table): User-defined cookbook filters
- `save_enabled` (boolean): Whether automatic saving is enabled
- `dirty` (boolean): Flag indicating unsaved changes
- `synced` (boolean): Flag indicating online synchronization status

## Core Methods

### Knowledge Access

#### GetKnownPreparedFoods()
Returns all discovered prepared foods and their associated data.

**Returns:**
- (table): Dictionary of prepared foods with recipes and metadata

```lua
local known_foods = CookbookData:GetKnownPreparedFoods()
for food_name, food_data in pairs(known_foods) do
    print(food_name, "recipes:", #(food_data.recipes or {}))
    print(food_name, "has_eaten:", food_data.has_eaten)
end
```

#### IsUnlocked(product)
Checks if a specific food item has been discovered.

**Parameters:**
- `product` (string): Food prefab name

**Returns:**
- (table/nil): Food data if unlocked, nil otherwise

```lua
if CookbookData:IsUnlocked("meatballs") then
    print("Meatballs recipe is known!")
else
    print("Meatballs recipe not yet discovered")
end
```

#### IsValidEntry(product)
Validates if a product can be tracked in the cookbook.

**Parameters:**
- `product` (string): Food prefab name

**Returns:**
- (boolean): True if valid cookbook entry

```lua
if CookbookData:IsValidEntry("meatballs") then
    print("Meatballs is a valid cookbook item")
end
```

### Recipe Management

#### AddRecipe(product, ingredients)
Adds a new recipe for a prepared food item.

**Parameters:**
- `product` (string): Food prefab name
- `ingredients` (table): Array of ingredient prefab names

**Returns:**
- (boolean): True if recipe was newly added or updated

**Recipe Storage Logic:**
- Maintains up to 6 recipes per food (MAX_RECIPES = 6)
- Automatically sorts ingredients alphabetically
- Moves known recipes to front when re-discovered
- Removes oldest recipes when limit exceeded

```lua
-- Add a meatballs recipe
local success = CookbookData:AddRecipe("meatballs", {
    "meat",
    "meat", 
    "berries",
    "twigs"
})

if success then
    print("New meatballs recipe learned!")
end
```

#### LearnFoodStats(product)
Records that a food item has been consumed, unlocking its nutritional information.

**Parameters:**
- `product` (string): Food prefab name

**Returns:**
- (boolean): True if this was the first time eating this food

```lua
-- Player ate meatballs for the first time
if CookbookData:LearnFoodStats("meatballs") then
    print("First time eating meatballs - stats unlocked!")
end
```

### Utility Methods

#### RemoveCookedFromName(ingredients)
Normalizes ingredient names by removing "cooked" prefixes/suffixes.

**Parameters:**
- `ingredients` (table): Array of ingredient names

**Returns:**
- (table): Array of normalized ingredient names

```lua
local normalized = CookbookData:RemoveCookedFromName({
    "cooked_meat",
    "meat_cooked", 
    "berries"
})
-- Result: {"meat", "meat", "berries"}
```

### New Content Tracking

#### IsNewFood(product)
Checks if a food is flagged as newly discovered.

**Parameters:**
- `product` (string): Food prefab name

**Returns:**
- (boolean): True if food is flagged as new

```lua
if CookbookData:IsNewFood("meatballs") then
    -- Show "NEW!" indicator in UI
    ShowNewFoodIndicator("meatballs")
end
```

#### ClearNewFlags()
Removes all "new food" flags, typically called when player acknowledges new discoveries.

```lua
-- Clear new flags when player opens cookbook
CookbookData:ClearNewFlags()
```

### Filter Management

#### SetFilter(category, value)
Sets a cookbook filter preference.

**Parameters:**
- `category` (string): Filter category name
- `value` (any): Filter value

```lua
-- Set filters for cookbook interface
CookbookData:SetFilter("show_crockpot", true)
CookbookData:SetFilter("show_portablecookpot", false)
CookbookData:SetFilter("min_health", 20)
```

#### GetFilter(category)
Gets a cookbook filter preference.

**Parameters:**
- `category` (string): Filter category name

**Returns:**
- (any): Filter value or nil if not set

```lua
local show_crockpot = CookbookData:GetFilter("show_crockpot")
if show_crockpot then
    -- Include crockpot recipes in display
end
```

#### ClearFilters()
Resets all cookbook filters to defaults.

```lua
CookbookData:ClearFilters()  -- Reset all cookbook filters
```

### Data Persistence

#### Save(force_save)
Saves cookbook data to persistent storage.

**Parameters:**
- `force_save` (boolean, optional): Force save even if not dirty

```lua
-- Auto-save when dirty
CookbookData:Save()

-- Force save regardless of dirty state
CookbookData:Save(true)
```

#### Load()
Loads cookbook data from persistent storage with enhanced error recovery.

**Enhanced Error Recovery (Build 676312):**
- Improved type checking for preparedfoods and filters data
- Automatic fallback to online profile data when local save is corrupted
- Automatic save recovery when successfully applying online cache

**Error Handling Flow:**
1. **Primary Load**: Attempts to load from local save file
2. **Type Validation**: Validates that preparedfoods is a table structure  
3. **Recovery Mode**: Falls back to online profile data if local data is corrupted
4. **Automatic Repair**: Saves corrected data back to local storage

```lua
CookbookData:Load()  -- Load saved cookbook data with error recovery
```

**Technical Enhancement Details:**
```lua
-- Enhanced validation in Load() method (Build 676312)
if type(recipe_book.preparedfoods) == "table" then
    self.preparedfoods = recipe_book.preparedfoods
    if type(recipe_book.filters) == "table" then
        self.filters = recipe_book.filters
    end
else
    print("Failed to load preparedfoods table in cookbook!")
    -- Automatic recovery attempt using online cache
end
```

#### ApplyOnlineProfileData()
Synchronizes cookbook data with online profile/inventory.

**Returns:**
- (boolean): True if synchronization was successful

```lua
if CookbookData:ApplyOnlineProfileData() then
    print("Cookbook synchronized with online profile")
else
    print("Sync pending or failed")
end
```

## Data Structures

### Prepared Food Entry

```lua
preparedfoods["meatballs"] = {
    recipes = {
        {"meat", "meat", "berries", "twigs"},
        {"meat", "meat", "carrot", "twigs"},
        {"meat", "morsel", "berries", "berries"}
    },
    has_eaten = true
}
```

### Recipe Storage Format

- **recipes**: Array of ingredient arrays, sorted by discovery order (newest first)
- **has_eaten**: Boolean indicating if player has consumed this food
- **MAX_RECIPES**: Maximum 6 recipes stored per food

### Encoding/Decoding

The system uses string encoding for online synchronization:

```lua
-- Encoded format: "meat,meat,berries,twigs|meat,morsel,berries,berries|true"
local function EncodeCookbookEntry(entry)
    local str = ""
    if entry.recipes ~= nil then
        for i = 1, math.min(MAX_RECIPES, #entry.recipes) do
            local r = entry.recipes[i]
            str = str .. table.concat(r, ",") .. "|"
        end
    end
    str = str .. (entry.has_eaten and "true" or "false")
    return str
end

local function DecodeCookbookEntry(value)
    local data = {recipes = {}}
    local recipes = string.split(value, "|")
    for i = 1, #recipes-1 do
        table.insert(data.recipes, string.split(recipes[i], ","))
    end
    data.has_eaten = recipes[#recipes] == "true"
    return data
end
```

## Usage Examples

### Recipe Discovery System

```lua
local function OnFoodCooked(food_prefab, ingredients)
    -- Learn the recipe when food is successfully cooked
    local learned = CookbookData:AddRecipe(food_prefab, ingredients)
    
    if learned then
        -- Show notification to player
        ShowNotification("New recipe discovered: " .. food_prefab)
    end
end

local function OnFoodEaten(food_prefab)
    -- Learn food stats when eaten
    local first_time = CookbookData:LearnFoodStats(food_prefab)
    
    if first_time then
        -- Unlock food stats in cookbook
        ShowNotification("Food stats unlocked: " .. food_prefab)
    end
end
```

### Cookbook UI Integration

```lua
local function BuildCookbookInterface()
    local known_foods = CookbookData:GetKnownPreparedFoods()
    
    for food_name, food_data in pairs(known_foods) do
        local ui_entry = CreateFoodEntry(food_name)
        
        -- Show recipes if known
        if food_data.recipes then
            for i, recipe in ipairs(food_data.recipes) do
                ui_entry:AddRecipe(recipe)
            end
        end
        
        -- Show food stats if eaten
        if food_data.has_eaten then
            ui_entry:ShowNutritionInfo()
        end
        
        -- Mark as new if recently discovered
        if CookbookData:IsNewFood(food_name) then
            ui_entry:AddNewFlag()
        end
    end
    
    -- Clear new flags when player views cookbook
    CookbookData:ClearNewFlags()
end
```

### Filter Application

```lua
local function FilterCookbookEntries(entries)
    local filtered = {}
    
    for food_name, food_data in pairs(entries) do
        local include = true
        
        -- Apply category filters
        if not CookbookData:GetFilter("show_crockpot") then
            if IsCrockpotRecipe(food_name) then
                include = false
            end
        end
        
        -- Apply stat filters  
        local min_health = CookbookData:GetFilter("min_health")
        if min_health and GetFoodHealth(food_name) < min_health then
            include = false
        end
        
        if include then
            filtered[food_name] = food_data
        end
    end
    
    return filtered
end
```

### Save System Integration

```lua
local function InitializeCookbook()
    -- Load saved data
    CookbookData:Load()
    
    -- Enable auto-saving
    CookbookData.save_enabled = true
    
    -- Sync with online profile
    CookbookData:ApplyOnlineProfileData()
end

local function OnGameSave()
    -- Force save cookbook data
    CookbookData:Save(true)
end
```

## Technical Implementation

### Recipe Priority System

Recipes are stored with the most recently discovered at the front:

1. **New Recipe**: Added to front of recipes array
2. **Known Recipe**: Moved to front if not already in top 2 positions  
3. **Capacity Management**: Oldest recipes removed when MAX_RECIPES exceeded

### Ingredient Normalization

The system normalizes ingredient names to handle cooked variants:

- `cooked_meat` → `meat`
- `meat_cooked` → `meat`
- `quagmire_cooked_` → `quagmire_`

This ensures recipe matching works regardless of ingredient cooking state.

### Online Synchronization

- **Offline Mode**: Uses local persistence only
- **Online Mode**: Syncs with Steam/platform inventory system
- **Mod Recipes**: Excluded from online sync to prevent save corruption

### Platform Compatibility

```lua
local USE_SETTINGS_FILE = PLATFORM ~= "PS4" and PLATFORM ~= "NACL"
```

Different platforms may have different persistence mechanisms.

## Performance Considerations

- **Lazy Loading**: Cookbook data loaded only when needed
- **Dirty Flag System**: Saves only when data changes
- **Recipe Limits**: Maximum recipes per food prevents unbounded growth
- **Efficient Encoding**: Compact string format for online sync

## Integration Points

### Cooking System Integration

```lua
-- cooking.lua integration
local cooking = require("cooking")

-- Check if product is valid cookbook entry
for cooker, recipes in pairs(cooking.cookbook_recipes) do
    if recipes[product] ~= nil then
        return true  -- Valid entry
    end
end
```

### Inventory System Integration

```lua
-- Sync with online inventory
if not cooking.IsModCookerFood(product) and not TheNet:IsDedicated() then
    TheInventory:SetCookBookValue(product, EncodeCookbookEntry(preparedfood))
end
```

## Error Handling

### Invalid Recipes

```lua
function CookbookData:AddRecipe(product, ingredients)
    if product == nil or ingredients == nil then
        print("Invalid cookbook recipe:", product, unpack(ingredients or {"(empty)"}))
        return
    elseif not self:IsValidEntry(product) then
        --silent fail
        return false
    end
    -- ... continue processing
end
```

### Save/Load Failures

```lua
function CookbookData:Load()
    self.preparedfoods = {}
    self.filters = {}
    local needs_save = false
    local really_bad_state = false
    
    TheSim:GetPersistentString("cookbook", function(load_success, data)
        if load_success and data ~= nil then
            local status, recipe_book = pcall(function() return json.decode(data) end)
            
            if status and recipe_book then
                -- Enhanced type validation (Build 676312)
                if type(recipe_book.preparedfoods) == "table" then
                    self.preparedfoods = recipe_book.preparedfoods
                    if type(recipe_book.filters) == "table" then
                        self.filters = recipe_book.filters
                    end
                else
                    really_bad_state = true
                    print("Failed to load preparedfoods table in cookbook!")
                end
            else
                really_bad_state = true
                print("Failed to load the cookbook!", status, recipe_book)
            end
        end
    end)
    
    -- Enhanced error recovery (Build 676312)
    if really_bad_state then
        print("Trying to apply online cache of cookbook data..")
        if self:ApplyOnlineProfileData() then
            print("Was a success, using preparedfoods values")
            needs_save = true
        else
            print("Which also failed. This error is unrecoverable. Cookbook will be cleared.")
        end
    end
    
    if needs_save then
        print("Saving cookbook file as a fixup.")
        self:Save(true)
    end
end
```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 676312 | 2025-06-25 | Enhanced error recovery in Load() method with type validation and automatic online cache fallback |
| 676042 | 2025-06-21 | Stable implementation with online sync support |

## Related Modules

- **[Cooking](cooking.md)** - Core cooking system and recipe definitions
- **[Inventory](../util/inventory.md)** - Online profile synchronization
- **[Class](class.md)** - Base class system

## Technical Notes

- Maximum 6 recipes stored per food item to prevent memory bloat
- Ingredient names automatically normalized to base forms
- Online synchronization excludes mod-added recipes
- Dirty flag system minimizes unnecessary save operations
- Platform-specific persistence handling for console compatibility

---

*This documentation covers the CookbookData module as of build 676312. The cookbook system enables players to track cooking discoveries and build comprehensive recipe knowledge with enhanced error recovery.*
