---
id: craftingmenuprofile
title: Crafting Menu Profile
description: System for managing user preferences and customizations in the crafting menu interface
sidebar_position: 6
slug: api-vanilla/core-systems/craftingmenuprofile
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Crafting Menu Profile

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `CraftingMenuProfile` class manages user preferences and customizations for the crafting menu interface. This system handles favorites, pinned recipes, sorting preferences, and provides persistent storage of user settings across game sessions.


## Overview

The crafting menu profile system serves multiple purposes:
- **User Preferences**: Stores personalized crafting menu settings
- **Favorites Management**: Allows players to mark and organize favorite recipes
- **Recipe Pinning**: Enables quick access to frequently used recipes
- **Sorting Customization**: Remembers preferred sorting modes
- **Data Persistence**: Maintains settings across game sessions

The system provides:
- **User Preferences**: Stores personalized crafting menu settings
- **Favorites Management**: Allows players to mark and organize favorite recipes
- **Recipe Pinning**: Enables quick access to frequently used recipes
- **Sorting Customization**: Remembers preferred sorting modes
- **Data Persistence**: Maintains settings across game sessions

## Usage Example

```lua
-- Create and load profile
local profile = CraftingMenuProfile()
profile:Load()

-- Manage favorites
profile:AddFavorite("torch")
if profile:IsFavorite("torch") then
    print("Torch is favorited!")
end

-- Set pinned recipe
profile:SetPinnedRecipe(1, "spear", "spear_wathgrithr")
```

## Class Properties

The `CraftingMenuProfile` class maintains the following properties:

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

## Functions

### CraftingMenuProfile() {#constructor}

**Status:** 🟢 `stable`

**Description:**
Creates a new CraftingMenuProfile instance and initializes all properties to default values.

**Returns:**
- (CraftingMenuProfile): New profile instance

**Example:**
```lua
local profile = CraftingMenuProfile()
```

**Default Initialization:**
- Creates empty favorites arrays
- Sets up default pinned recipe pages
- Initializes sort mode to nil
- Enables saving by default

### inst.components.craftingmenuprofile:Save(force_save) {#save}

**Status:** 🟢 `stable`

**Description:**
Saves the profile data to persistent storage. Only saves if the profile is dirty or force_save is true.

**Parameters:**
- `force_save` (boolean, optional): If true, saves regardless of dirty flag

**Example:**
```lua
profile:Save()        -- Save if dirty
profile:Save(true)    -- Force save
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:Load() {#load}

**Status:** 🟢 `stable`

**Description:**
Loads profile data asynchronously from persistent storage. Handles JSON decoding and data validation.

**Example:**
```lua
profile:Load()
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:AddFavorite(recipe_name) {#add-favorite}

**Status:** 🟢 `stable`

**Description:**
Adds a recipe to the favorites list. Validates input and prevents duplicates.

**Parameters:**
- `recipe_name` (string): The name of the recipe to add to favorites

**Example:**
```lua
profile:AddFavorite("torch")
profile:AddFavorite("campfire")
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:RemoveFavorite(recipe_name) {#remove-favorite}

**Status:** 🟢 `stable`

**Description:**
Removes a recipe from the favorites list and rebuilds the lookup table.

**Parameters:**
- `recipe_name` (string): The name of the recipe to remove from favorites

**Example:**
```lua
profile:RemoveFavorite("torch")
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:IsFavorite(recipe_name) {#is-favorite}

**Status:** 🟢 `stable`

**Description:**
Checks if a recipe is marked as favorite. Uses O(1) lookup for efficiency.

**Parameters:**
- `recipe_name` (string): The name of the recipe to check

**Returns:**
- (boolean): True if the recipe is favorited, false otherwise

**Example:**
```lua
if profile:IsFavorite("torch") then
    print("Torch is favorited!")
end
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:GetFavorites() {#get-favorites}

**Status:** 🟢 `stable`

**Description:**
Returns the ordered list of favorite recipe names.

**Returns:**
- (array): Array of favorite recipe names in order

**Example:**
```lua
local favorites = profile:GetFavorites()
for i, recipe_name in ipairs(favorites) do
    print(i .. ": " .. recipe_name)
end
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:GetFavoritesOrder() {#get-favorites-order}

**Status:** 🟢 `stable`

**Description:**
Returns the favorites lookup table for O(1) access checking.

**Returns:**
- (table): Lookup table mapping recipe names to their position in favorites

**Example:**
```lua
local favorites_lookup = profile:GetFavoritesOrder()
local is_favorite = favorites_lookup["torch"] ~= nil
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:SetPinnedRecipe(slot, recipe_name, skin_name) {#set-pinned-recipe}

**Status:** 🟢 `stable`

**Description:**
Sets a pinned recipe at the specified slot. Can clear slot by passing nil for recipe_name.

**Parameters:**
- `slot` (number): The slot index to set the recipe in
- `recipe_name` (string): The name of the recipe to pin, or nil to clear
- `skin_name` (string, optional): The skin name for the recipe

**Example:**
```lua
-- Pin a recipe with skin
profile:SetPinnedRecipe(1, "spear", "spear_wathgrithr")

-- Pin a recipe without skin
profile:SetPinnedRecipe(2, "torch", nil)

-- Clear a pinned slot
profile:SetPinnedRecipe(1, nil)
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:GetPinnedRecipes() {#get-pinned-recipes}

**Status:** 🟢 `stable`

**Description:**
Returns the currently active page's pinned recipes.

**Returns:**
- (table): Table of pinned recipe data (may have holes)

**Example:**
```lua
local pinned = profile:GetPinnedRecipes()
for slot, recipe_data in pairs(pinned) do
    if recipe_data then
        print("Slot " .. slot .. ": " .. recipe_data.recipe_name)
    end
end
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:GetCurrentPage() {#get-current-page}

**Status:** 🟢 `stable`

**Description:**
Returns the currently active pinned page number.

**Returns:**
- (number): Current page number (1-based)

**Example:**
```lua
local current_page = profile:GetCurrentPage()
print("Current page: " .. current_page)
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:SetCurrentPage(page_num) {#set-current-page}

**Status:** 🟢 `stable`

**Description:**
Sets the current pinned page and creates the page if it doesn't exist.

**Parameters:**
- `page_num` (number): The page number to switch to

**Example:**
```lua
profile:SetCurrentPage(2)
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:NextPage() {#next-page}

**Status:** 🟢 `stable`

**Description:**
Advances to the next pinned page, wrapping to page 1 if at the last page.

**Example:**
```lua
profile:NextPage()
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:PrevPage() {#prev-page}

**Status:** 🟢 `stable`

**Description:**
Goes to the previous pinned page, wrapping to the last page if at page 1.

**Example:**
```lua
profile:PrevPage()
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:MakeDefaultPinnedRecipes() {#make-default-pinned-recipes}

**Status:** 🟢 `stable`

**Description:**
Initializes pinned pages with default recipes from tuning constants. Creates two pages with predefined recipes.

**Example:**
```lua
profile:MakeDefaultPinnedRecipes()
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:SetSortMode(mode) {#set-sort-mode}

**Status:** 🟢 `stable`

**Description:**
Sets the sorting mode preference for the crafting menu.

**Parameters:**
- `mode` (number): The sort mode constant to set

**Example:**
```lua
profile:SetSortMode(CRAFTING_SORT_MODE.CRAFTABLE)
```

**Version History:**
- Added in build 676042: Current stable implementation

### inst.components.craftingmenuprofile:GetSortMode() {#get-sort-mode}

**Status:** 🟢 `stable`

**Description:**
Returns the current sorting mode preference.

**Returns:**
- (number): Current sort mode, or nil if not set

**Example:**
```lua
local current_mode = profile:GetSortMode()
if current_mode then
    print("Current sort mode: " .. current_mode)
end
```

**Version History:**
- Added in build 676042: Current stable implementation

## Deprecated Methods

### inst.components.craftingmenuprofile:DeserializeLocalClientSessionData(data) {#deserialize-local-client-session-data}

**Status:** ⚠️ `deprecated`

**Description:**
Legacy method for deserializing session data. No longer used and returns nothing.

**Parameters:**
- `data` (table): Session data (ignored)

**Version History:**
- Deprecated in build 676042: No longer used in current implementation

### inst.components.craftingmenuprofile:SerializeLocalClientSessionData() {#serialize-local-client-session-data}

**Status:** ⚠️ `deprecated`

**Description:**
Legacy method for serializing session data. Returns empty pinned recipes table for compatibility.

**Returns:**
- (table): Empty pinned recipes table

**Version History:**
- Deprecated in build 676042: No longer used in current implementation

## Common Usage Patterns

```lua
-- Basic profile lifecycle
local profile = CraftingMenuProfile()
profile:Load()

-- Manage favorites
profile:AddFavorite("torch")
profile:AddFavorite("campfire")
if profile:IsFavorite("torch") then
    print("Torch is favorited!")
end

-- Work with pinned recipes
profile:SetPinnedRecipe(1, "spear", "spear_wathgrithr")
profile:NextPage()
profile:SetPinnedRecipe(1, "torch", nil)

-- Configure sorting
profile:SetSortMode(CRAFTING_SORT_MODE.CRAFTABLE)
local current_mode = profile:GetSortMode()

-- Force save changes
profile:Save(true)
```

## Related Modules

- [**Crafting Sorting**](./crafting_sorting.md): Recipe sorting system that uses profile preferences
- [**Recipes**](./recipes.md): Recipe definitions for favorites and pinning  
- [**Tuning**](./tuning.md): Configuration constants including default pinned recipes
- [**Constants**](./constants.md): Game constants including sort mode definitions

## Status Indicators

🟢 **Stable**: All core functionality is stable and production-ready
⚠️ **Deprecated**: Legacy session data methods are deprecated but maintained for compatibility
