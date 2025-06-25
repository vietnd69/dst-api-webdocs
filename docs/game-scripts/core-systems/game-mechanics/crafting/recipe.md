---
id: recipe
title: Recipe System Core
description: Core classes and functions for defining crafting recipes, ingredients, and recipe management in Don't Starve Together
sidebar_position: 1
slug: game-scripts/core-systems/recipe
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Recipe System Core

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `recipe` module provides the core infrastructure for Don't Starve Together's crafting system. It defines the `Recipe` and `Ingredient` classes that specify how items can be crafted, what components are required, and under what conditions crafting is allowed.

This module handles recipe registration, ingredient validation, tech requirements, and provides integration points for character-specific crafting restrictions and custom placement logic.

## Global Variables

### AllRecipes

**Type:** `table`

**Status:** `stable`

**Description:** Global registry of all recipes keyed by recipe name.

### AllBuilderTaggedRecipes

**Type:** `table`

**Status:** `stable`

**Description:** Registry of recipes restricted to specific characters, keyed by recipe name with builder tag or skill as value.

### mod_protect_Recipe

**Type:** `boolean`

**Status:** `stable`

**Description:** Flag to warn about deprecated direct Recipe usage in mods.

## Ingredient Class

### Ingredient(ingredienttype, amount, atlas, deconstruct, imageoverride) {#ingredient-constructor}

**Status:** `stable`

**Description:**
Creates a new ingredient specification for recipes.

**Parameters:**
- `ingredienttype` (string): Type of ingredient (prefab name, CHARACTER_INGREDIENT, or TECH_INGREDIENT)
- `amount` (number): Quantity required
- `atlas` (string, optional): Custom atlas path for ingredient image
- `deconstruct` (boolean, optional): Whether ingredient is returned on deconstruction
- `imageoverride` (string, optional): Custom image filename override

**Validation:**
- Character ingredients (health/sanity) must be multiples of `CHARACTER_INGREDIENT_SEG` (5)
- Uses string-based precision checking to avoid floating-point errors

**Example:**
```lua
-- Regular item ingredient
local twig_ingredient = Ingredient("twigs", 2)

-- Character cost ingredient  
local health_cost = Ingredient(CHARACTER_INGREDIENT.HEALTH, 20)

-- Tech ingredient
local science_req = Ingredient(TECH_INGREDIENT.SCIENCE, 1)

-- Custom atlas ingredient
local custom_ingredient = Ingredient("myitem", 1, "images/myatlas.xml", true, "myimage.tex")
```

### Instance Properties

- `type` (string): The ingredient type
- `amount` (number): Required quantity
- `atlas` (string): Atlas path for image
- `image` (string): Image filename
- `deconstruct` (boolean): Returned on deconstruction

### Ingredient:GetAtlas() {#ingredient-get-atlas}

**Status:** `stable`

**Description:**
Retrieves the atlas path for the ingredient's image, resolving it if not already set.

**Returns:**
- (string): Resolved atlas path

**Example:**
```lua
local ingredient = Ingredient("twigs", 2)
local atlas = ingredient:GetAtlas()
-- Returns resolved path to twigs atlas
```

### Ingredient:GetImage() {#ingredient-get-image}

**Status:** `stable`

**Description:**
Gets the image filename for the ingredient, generating default if not specified.

**Returns:**
- (string): Image filename with .tex extension

**Example:**
```lua
local ingredient = Ingredient("rocks", 3)
local image = ingredient:GetImage()
-- Returns: "rocks.tex"
```

## Helper Functions

### IsCharacterIngredient(ingredienttype) {#is-character-ingredient}

**Status:** `stable`

**Description:**
Checks if an ingredient type is a character resource (health, sanity, etc.).

**Parameters:**
- `ingredienttype` (string): Ingredient type to check

**Returns:**
- (boolean): True if ingredient is a character resource

**Example:**
```lua
local is_char = IsCharacterIngredient(CHARACTER_INGREDIENT.HEALTH)
-- Returns: true

local is_item = IsCharacterIngredient("twigs")
-- Returns: false
```

### IsTechIngredient(ingredienttype) {#is-tech-ingredient}

**Status:** `stable`

**Description:**
Checks if an ingredient type is a tech resource (science points, etc.).

**Parameters:**
- `ingredienttype` (string): Ingredient type to check

**Returns:**
- (boolean): True if ingredient is a tech resource

**Example:**
```lua
local is_tech = IsTechIngredient(TECH_INGREDIENT.SCIENCE)
-- Returns: true
```

## Recipe Class

### Recipe(name, ingredients, tab, level, placer_or_more_data, ...) {#recipe-constructor}

**Status:** `deprecated for mods`

**Description:**
Legacy Recipe constructor. Mods should use `AddRecipe()` instead.

**Note:** Direct Recipe usage from mods triggers deprecation warning when `mod_protect_Recipe` is true.

### Recipe2(name, ingredients, tech, config) {#recipe2-constructor}

**Status:** `stable`

**Description:**
Modern Recipe constructor with cleaner parameter structure.

**Parameters:**
- `name` (string): Recipe identifier and default product name
- `ingredients` (table): Array of Ingredient objects
- `tech` (table): Tech requirements using TECH constants
- `config` (table, optional): Additional configuration options

**Config Options:**
- `product` (string): Override output prefab name
- `numtogive` (number): Quantity produced (default: 1)
- `builder_tag` (string): Required character tag
- `builder_skill` (string): Required skill tree unlock
- `placer` (string): Placer prefab for structures
- `min_spacing` (number): Minimum spacing for structures (default: 3.2)
- `testfn` (function): Custom placement validation
- `canbuild` (function): Custom crafting permission check
- `atlas` (string): Custom image atlas
- `image` (string): Custom image file
- `nounlock` (boolean): Don't show in crafting menu
- `manufactured` (boolean): Station handles item creation
- `station_tag` (string): Required crafting station tag
- `limitedamount` (boolean): Can only be crafted once
- `actionstr` (string): Custom action text
- `sg_state` (string): Custom state graph state for crafting
- `no_deconstruction` (boolean/function): Disable deconstruction
- `require_special_event` (string): Require active special event

**Example:**
```lua
Recipe2("campfire",
    {
        Ingredient("log", 2),
        Ingredient("cutgrass", 3)
    },
    TECH.NONE,
    {
        placer = "campfire_placer",
        min_spacing = 2.0,
        atlas = "images/inventoryimages.xml",
        image = "campfire.tex"
    }
)
```

### Recipe Instance Properties

**Core Properties:**
- `name` (string): Recipe identifier
- `product` (string): Output prefab name
- `ingredients` (table): Regular item ingredients
- `character_ingredients` (table): Character resource costs
- `tech_ingredients` (table): Tech requirements
- `level` (table): Tech tree requirements
- `numtogive` (number): Output quantity

**Builder Restrictions:**
- `builder_tag` (string): Required character tag
- `builder_skill` (string): Required skill unlock
- `no_builder_tag` (string): Excluded character tag
- `no_builder_skill` (string): Excluded skill

**UI Properties:**
- `atlas` (string): Image atlas path
- `image` (string): Image filename
- `imagefn` (function): Dynamic image function
- `nameoverride` (string): Display name override
- `description` (string): Description override
- `actionstr` (string): Custom action text

**Placement Properties:**
- `placer` (string): Placer prefab
- `min_spacing` (number): Minimum structure spacing
- `testfn` (function): Custom placement test
- `build_mode` (number): Placement mode (BUILDMODE constants)
- `build_distance` (number): Maximum build distance

**Special Properties:**
- `manufactured` (boolean): Station-crafted item
- `station_tag` (string): Required station tag
- `limitedamount` (boolean): One-time craftable
- `nounlock` (boolean): Hidden from menu
- `is_deconstruction_recipe` (boolean): Deconstruction recipe flag
- `require_special_event` (string): Event requirement

### Recipe:GetAtlas() {#recipe-get-atlas}

**Status:** `stable`

**Description:**
Gets the resolved atlas path for the recipe's display image.

**Returns:**
- (string): Atlas path

### Recipe:SetModRPCID() {#recipe-set-mod-rpc-id}

**Status:** `stable`

**Description:**
Sets RPC ID for mod recipes using hash collision detection.

**Note:** Automatically called by mod system during recipe registration.

## DeconstructRecipe Class

### DeconstructRecipe(name, return_ingredients, config) {#deconstruct-recipe-constructor}

**Status:** `stable`

**Description:**
Specialized recipe class for item deconstruction.

**Parameters:**
- `name` (string): Recipe name
- `return_ingredients` (table): Items returned on deconstruction
- `config` (table, optional): Additional configuration

**Properties:**
- `is_deconstruction_recipe` = true
- `nounlock` = true (hidden from crafting menu)
- `level` = TECH.NONE

**Example:**
```lua
DeconstructRecipe("axe_deconstruct",
    {
        Ingredient("twigs", 1),
        Ingredient("flint", 1)
    }
)
```

## Global Functions

### GetValidRecipe(recname) {#get-valid-recipe}

**Status:** `stable`

**Description:**
Retrieves a recipe if it's valid for the current game mode and conditions.

**Parameters:**
- `recname` (string): Recipe name to validate

**Returns:**
- (Recipe|nil): Recipe object if valid, nil otherwise

**Validation Checks:**
- Game mode compatibility
- Not a deconstruction recipe
- Special event requirements (if any)

**Example:**
```lua
local campfire_recipe = GetValidRecipe("campfire")
if campfire_recipe then
    print("Campfire can be crafted")
end
```

### IsRecipeValid(recname) {#is-recipe-valid}

**Status:** `stable`

**Description:**
Checks if a recipe is valid without returning the recipe object.

**Parameters:**
- `recname` (string): Recipe name to check

**Returns:**
- (boolean): True if recipe is valid

### RemoveAllRecipes() {#remove-all-recipes}

**Status:** `stable`

**Description:**
Clears all recipe registries. Used for cleanup and testing.

**Note:** Resets `AllRecipes`, `AllBuilderTaggedRecipes`, and recipe counter.

## Ingredient Types

### Regular Ingredients
Standard items from player inventory:
```lua
Ingredient("twigs", 2)
Ingredient("rocks", 3)
Ingredient("goldnugget", 1)
```

### Character Ingredients
Resources from character stats (defined in `constants.lua`):
```lua
Ingredient(CHARACTER_INGREDIENT.HEALTH, 20)
Ingredient(CHARACTER_INGREDIENT.SANITY, 15)
Ingredient(CHARACTER_INGREDIENT.MAX_HEALTH, 10)
```

### Tech Ingredients
Technology requirements (defined in `constants.lua`):
```lua
Ingredient(TECH_INGREDIENT.SCIENCE, 1)
Ingredient(TECH_INGREDIENT.MAGIC, 2)
Ingredient(TECH_INGREDIENT.ANCIENT, 1)
```

## Tech Tree Integration

Recipes integrate with the tech tree system through:
- `level` property defining tech requirements
- Tech ingredients for prototype unlocking
- Station tags for crafting location restrictions

**Common Tech Levels:**
```lua
TECH.NONE               -- No requirements
TECH.SCIENCE_ONE        -- Science Machine
TECH.SCIENCE_TWO        -- Alchemy Engine  
TECH.MAGIC_TWO          -- Prestihatitator
TECH.ANCIENT_TWO        -- Ancient Pseudoscience Station
```

## Mod Integration

### Recipe Post-Initialization
Recipes support mod post-initialization hooks:
- `RecipePostInit`: Called for specific recipes
- `RecipePostInitAny`: Called for all recipes

### Best Practices for Mods
```lua
-- In modmain.lua - CORRECT
AddRecipe2("myitem",
    {Ingredient("twigs", 2)},
    TECH.NONE,
    {atlas = "images/mymod.xml"}
)

-- Direct Recipe usage - DEPRECATED
Recipe2("myitem", ...) -- Triggers warning
```

## Usage Examples

### Basic Item Recipe
```lua
Recipe2("spear",
    {
        Ingredient("twigs", 2),
        Ingredient("flint", 1),
        Ingredient("rope", 1)
    },
    TECH.NONE,
    {
        atlas = "images/inventoryimages.xml",
        image = "spear.tex"
    }
)
```

### Character-Specific Recipe
```lua
Recipe2("lighter",
    {
        Ingredient("twigs", 2),
        Ingredient("flint", 1)
    },
    TECH.NONE,
    {
        builder_tag = "pyromaniac", -- Willow only
        atlas = "images/inventoryimages.xml",
        image = "lighter.tex"
    }
)
```

### Structure with Placement Logic
```lua
local function ValidMermPlacement(pt)
    local tile = TheWorld.Map:GetTileAtPoint(pt.x, pt.y, pt.z)
    return tile == WORLD_TILES.MARSH
end

Recipe2("mermhouse_crafted",
    {
        Ingredient("boards", 4),
        Ingredient("cutreeds", 3),
        Ingredient("pondfish", 2)
    },
    TECH.SCIENCE_ONE,
    {
        builder_tag = "merm_builder",
        placer = "mermhouse_crafted_placer",
        min_spacing = 5.0,
        testfn = ValidMermPlacement
    }
)
```

## Related Modules

- [Recipes](./recipes.md): Complete recipe definitions
- [Recipe Filters](./recipes_filter.md): Crafting menu categorization
- [Tech Tree](./techtree.md): Technology requirements
- [Builder Component](../components/builder.md): Recipe crafting logic
- [Constants](./constants.md): Ingredient and tech type definitions
