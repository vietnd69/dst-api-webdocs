---
id: builder
title: Builder Component
sidebar_position: 21
version: 619045
---

# Builder Component

The Builder component allows entities to craft and construct items and structures. It manages recipes, ingredients, technology levels, and crafting buffs.

## Basic Usage

```lua
-- Add a builder component to an entity
local entity = CreateEntity()
entity:AddComponent("builder")

-- Configure the builder component
local builder = entity.components.builder
builder:GiveAllRecipes() -- For testing, gives all recipes
builder:UnlockRecipe("campfire") -- Unlock specific recipe
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `recipes` | Table | List of known recipe names |
| `freebuildmode` | Boolean | Whether building requires ingredients |
| `ingredientmod` | Number | Modifier for ingredient requirements |
| `techlevels` | Table | Current tech levels the builder has access to |
| `bonus_tech_level` | Table | Extra tech levels from buffs or equipment |
| `buffered_builds` | Table | Builds queued for crafting |
| `current_prototyper` | Entity | Current workstation being used |

## Key Methods

### Recipe Management

```lua
-- Learn recipes
builder:UnlockRecipe("spear") -- Learn a specific recipe
builder:GiveAllRecipes() -- Learn all recipes
builder:AddRecipe("firepit") -- Add a single recipe

-- Check recipes
local knows_recipe = builder:KnowsRecipe("axe")
local can_build = builder:CanBuild("hammer")
local tech_level = builder:GetTechLevel(TECH.SCIENCE_ONE)
```

### Building

```lua
-- Build an item
builder:MakeRecipe("backpack", nil, nil, nil, nil, nil, 1)

-- Get ingredient requirements
local ingredients = builder:GetIngredients("tent")

-- Count available ingredients
local can_build, missing = builder:CanBuild("birdcage")
if not can_build then
    for i, v in ipairs(missing) do
        print("Missing: " .. v.type .. " x" .. v.amount)
    end
end
```

### Tech Levels

```lua
-- Set tech levels
builder:SetTechLevel(TECH.SCIENCE_ONE, 1)
builder:SetTechLevel(TECH.MAGIC_TWO, 1)

-- Add temporary tech boost from equipment
builder:AddBonus(TECH.SCIENCE_ONE, 1, "sciencemachine")

-- Remove tech boost
builder:RemoveBonus("sciencemachine")
```

## Tech Trees

The builder component organizes recipes by tech trees:

- `TECH.NONE` - Basic recipes available to everyone
- `TECH.SCIENCE_ONE` - Science Machine level
- `TECH.SCIENCE_TWO` - Alchemy Engine level
- `TECH.MAGIC_TWO` - Prestihatitator level
- `TECH.MAGIC_THREE` - Shadow Manipulator level
- `TECH.ANCIENT_TWO` - Ancient Pseudoscience Station level
- `TECH.CELESTIAL_ONE` - Celestial Altar level

## Integration with Other Components

The Builder component often works with:

- `Inventory` - For managing ingredients
- `Sanity` - Some crafting can affect sanity
- `ActionHandler` - For triggering building actions
- `Prototyper` - For workstations that enhance crafting abilities

## See also

- [Inventory Component](inventory.md) - For storing crafting ingredients
- [Prototyper Component](other-components.md) - For workstations that provide tech levels
- [Recipes](../recipes/crafting.md) - For crafting recipe definitions
- [Sanity Component](sanity.md) - For sanity effects from crafting
- [Container Component](container.md) - For storing crafted items

## Example: Setting Up a Builder with Tech Levels

```lua
local function SetupBuilder(inst)
    inst:AddComponent("builder")
    
    local builder = inst.components.builder
    
    -- Give basic tech level
    builder:SetTechLevel(TECH.SCIENCE_ONE, 1)
    
    -- Unlock basic survival recipes
    builder:UnlockRecipe("axe")
    builder:UnlockRecipe("pickaxe")
    builder:UnlockRecipe("campfire")
    builder:UnlockRecipe("firepit")
    builder:UnlockRecipe("spear")
    
    -- Add callback when near prototypers
    inst:ListenForEvent("techtreechange", function(inst, data)
        -- Do something when tech level changes
        print("Tech tree changed: " .. data.level)
    end)
    
    return builder
end

-- Example of using a prototyper (Science Machine)
local function OnActivatePrototyper(inst, doer)
    if doer.components.builder ~= nil then
        doer.components.builder:AddBonus(TECH.SCIENCE_ONE, 1, inst)
    end
end

local function OnDeactivatePrototyper(inst, doer)
    if doer.components.builder ~= nil then
        doer.components.builder:RemoveBonus(inst)
    end
end
```