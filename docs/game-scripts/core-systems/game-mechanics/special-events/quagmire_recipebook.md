---
id: quagmire_recipebook
title: Quagmire Recipe Book
description: Class for managing recipe discovery, storage, and unlocking in the Quagmire seasonal event
sidebar_position: 2
slug: game-scripts/core-systems/quagmire_recipebook
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Quagmire Recipe Book

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `QuagmireRecipeBook` class manages recipe discovery, persistence, and unlocking mechanics for the Quagmire seasonal event. It tracks discovered recipes, their ingredients, cooking stations, and coin values while providing integration with the achievement system for permanent recipe unlocking.

The system automatically discovers new recipes as players cook, stores multiple ingredient combinations per dish, and manages temporary session-based unlocks alongside permanent achievement-based unlocks.

## Constants

### USE_SETTINGS_FILE

**Value:** `PLATFORM ~= "PS4" and PLATFORM ~= "NACL"`

**Status:** `stable`

**Description:** Platform check for persistent storage availability.

### MAX_RECIPES

**Value:** `3`

**Status:** `stable`

**Description:** Maximum number of ingredient combinations stored per recipe.

## Class Definition

### QuagmireRecipeBook() {#constructor}

**Status:** `stable`

**Description:**
Creates a new QuagmireRecipeBook instance with empty recipe storage.

**Properties:**
- `recipes` (table): Storage for discovered recipe data
- `dirty` (boolean): Flag indicating unsaved changes
- `filters` (table): Recipe filtering options

**Example:**
```lua
local recipe_book = QuagmireRecipeBook()
```

## Instance Methods

### IsRecipeUnlocked(product) {#is-recipe-unlocked}

**Status:** `stable`

**Description:**
Checks if a recipe is permanently unlocked through achievement system.

**Parameters:**
- `product` (string): Recipe product name (e.g., "quagmire_bisque")

**Returns:**
- (boolean): True if recipe is permanently unlocked via achievements

**Implementation Logic:**
```lua
local split_name = string.split(product, "_")
local achievement_name = "food_"..split_name[#split_name]
return EventAchievements:IsAchievementUnlocked(FESTIVAL_EVENTS.QUAGMIRE, GetFestivalEventSeasons(FESTIVAL_EVENTS.QUAGMIRE), achievement_name)
```

**Example:**
```lua
local recipe_book = QuagmireRecipeBook()
local is_unlocked = recipe_book:IsRecipeUnlocked("quagmire_bisque")
-- Checks achievement: "food_bisque"
```

### GetValidRecipes() {#get-valid-recipes}

**Status:** `stable`

**Description:**
Returns all recipes that are either permanently unlocked or temporarily available in current session.

**Returns:**
- (table): Dictionary of valid recipes keyed by product name

**Logic:**
- Permanently unlocked recipes (via achievements) are always included
- Temporarily unlocked recipes (discovered this session) are included
- Session identification prevents cross-session temporary access

**Example:**
```lua
local recipe_book = QuagmireRecipeBook()
local valid_recipes = recipe_book:GetValidRecipes()
-- Returns: {["quagmire_bisque"] = {recipe_data}, ...}
```

### Load() {#load}

**Status:** `stable`

**Description:**
Loads recipe data from persistent storage and initializes the recipe book.

**Process:**
1. Retrieves persistent string data using key "recipebook"
2. Decodes JSON data into recipe structure
3. Removes duplicate recipe combinations
4. Sets dirty flag to false

**Error Handling:**
- Prints "Failed to load the Gorge recipe book" on JSON decode failure
- Gracefully handles missing or corrupted data

**Example:**
```lua
local recipe_book = QuagmireRecipeBook()
recipe_book:Load()
-- Asynchronously loads data from persistent storage
```

### Save() {#save}

**Status:** `stable`

**Description:**
Saves recipe data to persistent storage if changes have been made.

**Process:**
1. Checks dirty flag to avoid unnecessary saves
2. Triggers UI refresh event "quagmire_refreshrecipbookwidget"
3. Encodes recipe data as JSON
4. Saves to persistent storage with key "recipebook"

**Example:**
```lua
local recipe_book = QuagmireRecipeBook()
-- Make changes to recipes...
recipe_book:Save() -- Only saves if dirty flag is true
```

### RegisterWorld(world) {#register-world}

**Status:** `stable`

**Description:**
Registers the recipe book with world event listeners for automatic recipe discovery and appraisal.

**Parameters:**
- `world` (EntityScript): World entity to listen for events

**Events Registered:**
- `"quagmire_recipediscovered"`: Triggered when new recipes are cooked
- `"quagmire_recipeappraised"`: Triggered when recipes are evaluated for coins

**Example:**
```lua
local recipe_book = QuagmireRecipeBook()
recipe_book:RegisterWorld(TheWorld)
```

## Recipe Data Structure

### Recipe Entry Format

Each recipe entry contains the following structure:

```lua
{
    dish = true/false,           -- Whether it's a dish (vs syrup)
    station = {"cookpot", "..."},-- Array of compatible cooking stations
    size = "small/large/syrup",  -- Recipe size category
    new = "new",                 -- New recipe marker
    date = "DD/MM/YYYY/HH:MM:SS", -- Discovery timestamp
    recipes = {                  -- Array of ingredient combinations
        {"ingredient1", "ingredient2", ...},
        {"variant1", "variant2", ...}
    },
    session = "session_id",      -- Session identifier for temporary unlock
    base_value = {               -- Coin values for base dish
        coin1 = 1,
        coin2 = 2,
        coin3 = nil,
        coin4 = nil
    },
    silver_value = {             -- Coin values for silver-quality dish
        coin1 = 2,
        coin2 = 3,
        coin3 = 1,
        coin4 = nil
    },
    tags = {"craving_tag", "snack"} -- Recipe tags for cravings and penalties
}
```

## Internal Functions

### RemoveCookedFromName(ingredients) {#remove-cooked-from-name}

**Status:** `stable`

**Description:**
Normalizes ingredient names by removing cooking state indicators.

**Parameters:**
- `ingredients` (table): Array of ingredient names

**Returns:**
- (table): Array of normalized ingredient names

**Transformations:**
- `"_cooked_"` → `""`
- `"cooked_"` → `""`
- `"quagmire_cooked"` → `"quagmire_"`
- `"_cooked"` → `""`
- `"cooked"` → `""`

### IsKnownIngredients(recipes, ingredients) {#is-known-ingredients}

**Status:** `stable`

**Description:**
Checks if an ingredient combination is already known for a recipe.

**Parameters:**
- `recipes` (table): Array of known ingredient combinations
- `ingredients` (table): Ingredient combination to check

**Returns:**
- (number|nil): Index of matching recipe, or nil if not found

### OnRecipeDiscovered(self, data) {#on-recipe-discovered}

**Status:** `stable`

**Description:**
Event handler for new recipe discovery. Updates recipe database and triggers notifications.

**Parameters:**
- `self` (QuagmireRecipeBook): Recipe book instance
- `data` (table): Recipe discovery data

**Process:**
1. Validates recipe (excludes burnt/goop products)
2. Normalizes and sorts ingredients
3. Determines station size based on ingredient count
4. Updates or creates recipe entry
5. Manages ingredient combination storage (MAX_RECIPES limit)
6. Triggers UI notification event

### OnRecipeAppraised(self, data) {#on-recipe-appraised}

**Status:** `stable`

**Description:**
Event handler for recipe coin evaluation. Updates coin values and recipe tags.

**Parameters:**
- `self` (QuagmireRecipeBook): Recipe book instance
- `data` (table): Recipe appraisal data including coins and quality

**Process:**
1. Constructs coin value structure
2. Determines value type (base_value vs silver_value)
3. Updates recipe with better coin values
4. Adds craving and penalty tags
5. Saves changes automatically

## Usage Examples

### Basic Recipe Book Setup

```lua
local QuagmireRecipeBook = require("quagmire_recipebook")

-- Create and initialize recipe book
local recipe_book = QuagmireRecipeBook()
recipe_book:Load()
recipe_book:RegisterWorld(TheWorld)

-- Check if player can access a specific recipe
local can_cook_bisque = recipe_book:IsRecipeUnlocked("quagmire_bisque")
if can_cook_bisque then
    print("Bisque recipe permanently unlocked!")
end

-- Get all currently accessible recipes
local available_recipes = recipe_book:GetValidRecipes()
for product_name, recipe_data in pairs(available_recipes) do
    print("Can cook:", product_name)
    print("Stations:", table.concat(recipe_data.station, ", "))
end
```

### Recipe Discovery Simulation

```lua
-- Simulate discovering a new recipe
local discovery_data = {
    product = "quagmire_bisque",
    ingredients = {"quagmire_crabmeat", "potato", "onion"},
    station = "cookpot",
    dish = true
}

-- This would normally be triggered by game events
TheWorld:PushEvent("quagmire_recipediscovered", discovery_data)

-- Simulate recipe appraisal
local appraisal_data = {
    product = "quagmire_bisque",
    coins = {1, 2, 0, 0},
    silverdish = false,
    matchedcraving = "hearty",
    snackpenalty = false
}

TheWorld:PushEvent("quagmire_recipeappraised", appraisal_data)
```

## Integration Points

### Achievement System Integration

The recipe book integrates with the achievement system through:
- **Permanent Unlocks**: Recipes unlocked via `"food_[name]"` achievements
- **Cross-Session Persistence**: Achievement-based unlocks persist across games
- **Temporary Access**: Session-based discovery for preview before permanent unlock

### Event System Integration

Key events for recipe book functionality:
- **Discovery**: `"quagmire_recipediscovered"` from cooking system
- **Appraisal**: `"quagmire_recipeappraised"` from tribute evaluation
- **UI Refresh**: `"quagmire_refreshrecipbookwidget"` for interface updates

### Persistence System Integration

Data persistence through:
- **Storage Key**: `"recipebook"` in persistent storage
- **Format**: JSON-encoded recipe data structure
- **Platform Support**: Conditional based on platform capabilities

## Related Modules

- [Quagmire Achievements](./quagmire_achievements.md): Recipe unlock achievements
- [Event Achievements](./eventachievements.md): Core achievement system
- [Cooking](./cooking.md): Recipe cooking mechanics
- [JSON](./json.md): Data serialization for persistence
