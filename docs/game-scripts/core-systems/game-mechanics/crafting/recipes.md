---
id: recipes
title: Recipes System
description: Complete recipe definitions and implementation system for Don't Starve Together crafting
sidebar_position: 2

last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Recipes System

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version - comprehensive recipe system |

## Overview

The Recipes system in Don't Starve Together defines how items can be crafted in the game. It provides a framework for specifying ingredients, tech requirements, builder restrictions, and other properties that determine how and when players can craft items.

## Overview

The recipe system consists of several key components:

1. **Recipe Class**: Defines the properties of a craftable item
2. **Ingredient Class**: Defines the components needed to craft an item
3. **Tech Tree**: Determines what technology level is required to craft an item
4. **Builder Tags**: Restricts recipes to specific characters or skill sets

The main files that define the recipe system are:
- `recipe.lua`: Contains the Recipe and Ingredient classes
- `recipes.lua`: Contains all the base game recipes
- `techtree.lua`: Defines the technology tree structure

## Recipe Class

The Recipe class is the core of the crafting system. Each craftable item in the game is defined by a Recipe instance.

### Creating a Recipe

Recipes are created using the `Recipe2` function:

```lua
Recipe2(
    name,               -- String: The name of the recipe/item
    ingredients,        -- Table: List of Ingredient objects
    tech_level,         -- Table/Number: Tech level required
    recipe_options      -- Table: Additional recipe options
)
```

Example:

```lua
Recipe2(
    "axe",              -- Recipe name
    {                   -- Ingredients
        Ingredient("twigs", 1),
        Ingredient("flint", 1)
    },
    TECH.NONE,          -- Tech level
    {                   -- Additional options
        numtogive = 1,
        builder_tag = "woodcutter"
    }
)
```

### Recipe Properties

| Property | Description |
|----------|-------------|
| `name` | Internal name of the recipe |
| `product` | Prefab name of the resulting item (defaults to name) |
| `ingredients` | Regular ingredients required |
| `character_ingredients` | Character-specific ingredients (health, sanity, etc.) |
| `tech_ingredients` | Tech-specific ingredients |
| `level` | Tech level required to craft the item |
| `builder_tag` | Character tag required to craft the item |
| `builder_skill` | Skill required to craft the item (for skill trees) |
| `numtogive` | Number of items produced per craft |
| `nounlock` | If true, recipe won't be unlocked in crafting menu |
| `placer` | Placer prefab for buildable structures |
| `min_spacing` | Minimum spacing between placed structures |
| `atlas` | Atlas containing the recipe's image |
| `image` | Image to show in the crafting menu |
| `testfn` | Function to test if placement is valid |
| `canbuild` | Function to test if recipe can be built |
| `sg_state` | State graph state to use when crafting |
| `no_deconstruction` | If true, item cannot be deconstructed |

## Ingredient Class

The Ingredient class defines what is required to craft an item.

### Creating an Ingredient

```lua
Ingredient(
    type,       -- String: The ingredient type (prefab name or CHARACTER_INGREDIENT)
    amount,     -- Number: Amount required
    atlas,      -- String: Optional atlas path
    deconstruct,-- Boolean: Whether this ingredient is returned on deconstruction
    image       -- String: Optional image override
)
```

Example:

```lua
Ingredient("twigs", 2)                      -- Regular ingredient
Ingredient(CHARACTER_INGREDIENT.HEALTH, 30) -- Character health cost
Ingredient(TECH_INGREDIENT.SCIENCE, 1)      -- Tech ingredient
```

### Ingredient Types

There are three main types of ingredients:

1. **Regular Ingredients**: Items from the player's inventory (e.g., "twigs", "rocks")
2. **Character Ingredients**: Resources from the character (defined in `constants.lua`)
   ```lua
   CHARACTER_INGREDIENT = {
       HEALTH = "health",
       MAX_HEALTH = "max_health",
       SANITY = "sanity",
       MAX_SANITY = "max_sanity",
   }
   ```
3. **Tech Ingredients**: Special tech resources (defined in `constants.lua`)
   ```lua
   TECH_INGREDIENT = {
       SCIENCE = "science",
       MAGIC = "magic",
       ANCIENT = "ancient",
       SHADOW = "shadow",
       -- etc.
   }
   ```

## Tech Tree

The tech tree system defines the technology levels required to craft items. Tech levels are defined in `techtree.lua`.

### Available Tech Trees

```lua
AVAILABLE_TECH = {
    "SCIENCE",
    "MAGIC",
    "ANCIENT",
    "CELESTIAL",
    "SHADOW",
    "CARTOGRAPHY",
    "SEAFARING",
    "SCULPTING",
    "ORPHANAGE",
    -- and many more
}
```

### Tech Levels

Tech levels are defined in `constants.lua` as:

```lua
TECH = {
    NONE = {},
    SCIENCE_ONE = { SCIENCE = 1 },
    SCIENCE_TWO = { SCIENCE = 2 },
    MAGIC_TWO = { MAGIC = 2 },
    MAGIC_THREE = { MAGIC = 3 },
    ANCIENT_TWO = { ANCIENT = 2 },
    ANCIENT_FOUR = { ANCIENT = 4 },
    CELESTIAL_ONE = { CELESTIAL = 1 },
    CELESTIAL_THREE = { CELESTIAL = 3 },
    -- and many more
}
```

### Tech Bonuses

Some tech trees can have bonuses applied to them, allowing characters to craft higher-tier items without the corresponding prototyper:

```lua
BONUS_TECH = {
    "SCIENCE",
    "MAGIC",
    "SEAFARING",
    "ANCIENT",
    "MASHTURFCRAFTING",
}
```

## Prototypers

Prototypers are structures that provide access to specific tech levels. They are defined in `recipes.lua` as `PROTOTYPER_DEFS`:

```lua
PROTOTYPER_DEFS = {
    none = {
        icon_atlas = CRAFTING_ICONS_ATLAS,
        icon_image = "station_none.tex",
        is_crafting_station = false
    },
    researchlab = {
        icon_atlas = CRAFTING_ICONS_ATLAS,
        icon_image = "station_science.tex",
        is_crafting_station = false
    },
    -- and many more
}
```

Each prototyper provides a specific tech level, defined in the Builder component.

## Character-Specific Recipes

Recipes can be restricted to specific characters using the `builder_tag` property:

```lua
Recipe2("lighter", 
    {
        Ingredient("rope", 1),
        Ingredient("goldnugget", 1),
        Ingredient("petals", 3)
    },
    TECH.NONE,
    {builder_tag = "pyromaniac"} -- Only Willow can craft this
)
```

Common builder tags include:
- `pyromaniac` (Willow)
- `masterchef` (Warly)
- `merm_builder` (Wurt)
- `ghostlyfriend` (Wendy)
- `werehuman` (Woodie)
- `valkyrie` (Wigfrid)
- `pebblemaker` (Walter)
- `shadowmagic` (Maxwell)

## Skill Tree Recipes

With the addition of character skill trees, recipes can now be restricted to specific skills:

```lua
Recipe2("wereitem_goose",
    {
        Ingredient("monstermeat", 3),
        Ingredient("seeds", 3)
    },
    TECH.NONE,
    {builder_skill = "woodie_were_form_goose"}
)
```

## Recipe Placement

For recipes that create structures or placeable objects, additional properties control placement:

```lua
Recipe2("treasurechest",
    {
        Ingredient("boards", 3),
        Ingredient("goldnugget", 1)
    },
    TECH.SCIENCE_ONE,
    {
        placer = "treasurechest_placer", -- Placer prefab
        min_spacing = 2,                 -- Minimum spacing between chests
        testfn = function(pt) return true end -- Custom placement test
    }
)
```

## Custom Recipe Testing

The `testfn` property allows for custom placement logic:

```lua
-- Only allow placement on marsh turf
local function IsMarshLand(pt, rot)
    local ground_tile = TheWorld.Map:GetTileAtPoint(pt.x, pt.y, pt.z)
    return ground_tile and ground_tile == WORLD_TILES.MARSH
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
        testfn = IsMarshLand -- Custom test function
    }
)
```

## Recipe Overrides

Recipes can be overridden or modified using the `AddRecipePostInit` function:

```lua
-- In a mod's modmain.lua
AddRecipePostInit("axe", function(recipe)
    -- Modify the recipe
    table.insert(recipe.ingredients, Ingredient("rocks", 1))
    recipe.level = TECH.SCIENCE_ONE -- Require science machine
    return recipe
end)
```

## Adding Custom Recipes in Mods

Mods can add new recipes using the `Recipe2` function in their `modmain.lua`:

```lua
-- In a mod's modmain.lua
Recipe2("mymod_customitem",
    {
        Ingredient("twigs", 2),
        Ingredient("cutgrass", 3)
    },
    TECH.NONE,
    {
        atlas = "images/inventoryimages/mymod_customitem.xml",
        image = "mymod_customitem.tex",
        numtogive = 1
    }
)
```

## Special Recipe Properties

### Limited Amount Recipes

Some recipes can only be crafted a limited number of times:

```lua
Recipe2("moonrockidol",
    {
        Ingredient("moonrocknugget", 3),
        Ingredient("purplegem", 1)
    },
    TECH.CELESTIAL_ONE,
    {
        limitedamount = true -- Can only be crafted once
    }
)
```

### Custom Action String

Recipes can specify a custom action string for crafting stations:

```lua
Recipe2("carnival_prizebooth",
    {
        Ingredient("boards", 4),
        Ingredient("goldnugget", 1)
    },
    TECH.SCIENCE_ONE,
    {
        is_crafting_station = true,
        action_str = "TRADE" -- Shows "TRADE" instead of "CRAFT"
    }
)
```

### Manufacturing

Some recipes delegate the actual item creation to the crafting station:

```lua
Recipe2("winter_food1",
    {
        Ingredient("wintersfeastfuel", 1),
        Ingredient("cookedsmallmeat", 1)
    },
    TECH.WINTERSFEASTCOOKING_ONE,
    {
        manufactured = true, -- Station handles item creation
        station_tag = "wintersfeastcooker"
    }
)
```

## Recipe Filters

Recipes can be filtered in the crafting menu using the `filter` property:

```lua
Recipe2("turf_carpetfloor",
    {
        Ingredient("boards", 1),
        Ingredient("beefalowool", 1)
    },
    TECH.TURFCRAFTING_ONE,
    {
        filter = "CRAFTING_STATION",
        station_tag = "turfcrafting"
    }
)
```

## Implementation Notes

### Performance Considerations
- Recipe lookup uses hash-based indexing for fast access
- Builder tag recipes are cached separately for character filtering
- Image atlases are resolved lazily to reduce memory usage

### Mod Compatibility
- Recipe post-initialization hooks ensure mod compatibility
- RPC ID system prevents hash collisions in multiplayer
- Character-specific recipes integrate with skill tree system

### Build Version Compatibility
- Recipe definitions are validated against current game build (676042)
- Tech tree integration ensures compatibility with prototype system
- Event recipes are properly gated by seasonal availability

## Related Modules

- [Recipe System Core](./recipe.md): Core Recipe and Ingredient classes
- [Recipe Filters](./recipes_filter.md): Crafting menu categorization
- [Tech Tree](./techtree.md): Technology requirements and progression
- [Builder Component](../components/builder.md): Recipe crafting implementation
- [Constants](./constants.md): Tech levels and ingredient types
- [Crafting Menu Profile](./craftingmenuprofile.md): User preferences and favorites
