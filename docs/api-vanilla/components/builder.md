---
id: builder
title: Builder Component
sidebar_position: 21
last_updated: 2023-08-01
version: 624447
---
*Last Update: 2023-08-01*
# Builder Component

*API Version: 624447*

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
| `builder_skills` | Table | Skills from character's skill tree that enable recipes (added in API 624447) |

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

### Skill Tree Integration

As of API version 624447, builder tags for skill trees have been replaced with builder skills:

```lua
-- Add a builder skill from a character's skill tree
builder:AddBuilderSkill("woodcutter_harvester")

-- Remove a builder skill
builder:RemoveBuilderSkill("woodcutter_harvester")

-- Check if builder has a specific skill
local has_skill = builder:HasBuilderSkill("woodcutter_harvester")
```

### Character Skill Tree Integration

Characters with the `skilltreeupdater` component can grant builder skills when players unlock abilities in their skill tree. These skills then enable specific recipes in the builder component:

```lua
-- In a character's skill tree definition
local WOODCUTTER_SKILL = {
    onactivate = function(inst, skilldata)
        if inst.components.builder ~= nil then
            inst.components.builder:AddBuilderSkill("woodcutter_harvester")
        end
    end,
    
    ondeactivate = function(inst, skilldata)
        if inst.components.builder ~= nil then
            inst.components.builder:RemoveBuilderSkill("woodcutter_harvester")
        end
    end,
}

-- In a recipe definition that requires a special skill
Recipe("specialaxe", 
    {Ingredient("twigs", 2), Ingredient("flint", 1)}, 
    RECIPETABS.TOOLS, 
    {builder_skill = "woodcutter_harvester"} -- Requires specific skill
)
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
- `Skilltreeupdater` - For skills that unlock recipes (added in API 624447)

## Character Skills and Builder System

### Builder Skills

Builder skills were introduced in API version 624447 to replace the older builder tags system. These skills represent specific crafting abilities that characters can acquire through their skill trees.

```lua
-- Basic builder skill management
local builder = inst.components.builder

-- Adding skills
builder:AddBuilderSkill("woodcutter_harvester") -- Add woodcutting skill
builder:AddBuilderSkill("masterchef_spicestation") -- Add cooking skill

-- Removing skills
builder:RemoveBuilderSkill("woodcutter_harvester")

-- Checking for skills
if builder:HasBuilderSkill("masterchef_spicestation") then
    -- Character can craft spice-related recipes
end

-- Recipe unlock example based on skill
if builder:HasBuilderSkill("naturalist_florist") then
    builder:UnlockRecipe("flowersalad")
end
```

### Builder Tags (Pre-624447)

Before API version 624447, characters used a tag-based system to unlock special recipes:

```lua
-- Old system (deprecated)
inst:AddTag("handyperson") -- Added tag to allow building structures
inst:AddTag("masterchef") -- Added tag to allow cooking special foods
inst:RemoveTag("handyperson") -- Removed building capability
```

When implementing mods that need to work across API versions, you should check the API version and use the appropriate system:

```lua
local function EnableWoodcuttingRecipes(inst)
    if TheSim:GetGameID() == "DST" and TUNING.API_VERSION >= 624447 then
        -- Use new builder skills system
        if inst.components.builder ~= nil then
            inst.components.builder:AddBuilderSkill("woodcutter_harvester")
        end
    else
        -- Use old tag system for backward compatibility
        inst:AddTag("woodcutter")
    end
end
```

### Character Skills and Builder Component

The character skill tree system (introduced in API version 624447) provides a progression framework that integrates with the builder component. Here's how they work together:

```lua
-- Character skill tree setup (for modders creating custom characters)
local function SetupCharacterSkills(inst)
    -- Add the skill tree updater component
    inst:AddComponent("skilltreeupdater")
    
    -- Define skill groups and how they affect builder skills
    local skills = {
        -- Woodcutting skill group
        woodcutting = {
            -- Novice skill
            novice_woodcutter = {
                onactivate = function(inst)
                    if inst.components.builder then
                        -- Enable basic woodcutting recipes
                        inst.components.builder:AddBuilderSkill("woodcutter_basic")
                    end
                end,
                ondeactivate = function(inst)
                    if inst.components.builder then
                        inst.components.builder:RemoveBuilderSkill("woodcutter_basic")
                    end
                end,
            },
            
            -- Advanced skill (requires novice first)
            expert_woodcutter = {
                -- Skill requirements
                requires = {"novice_woodcutter"},
                
                onactivate = function(inst)
                    if inst.components.builder then
                        -- Enable advanced woodcutting recipes
                        inst.components.builder:AddBuilderSkill("woodcutter_advanced")
                        inst.components.builder:AddBuilderSkill("woodcutter_harvester")
                    end
                end,
                ondeactivate = function(inst)
                    if inst.components.builder then
                        inst.components.builder:RemoveBuilderSkill("woodcutter_advanced")
                        inst.components.builder:RemoveBuilderSkill("woodcutter_harvester")
                    end
                end,
            },
        },
        
        -- Cooking skill group
        cooking = {
            -- Define cooking-related skills...
        },
    }
    
    -- Register the skills with the skill tree updater
    inst.components.skilltreeupdater:SetSkillTrees(skills)
    
    return inst
end
```

#### Recipe Integration with Character Skills

Recipes can be locked behind character skills using the `builder_skill` parameter:

```lua
-- Basic recipe that anyone can craft
Recipe("spear", 
    {Ingredient("twigs", 1), Ingredient("flint", 1), Ingredient("rope", 1)}, 
    RECIPETABS.WAR)

-- Recipe that requires a specific builder skill 
Recipe("superaxe", 
    {Ingredient("twigs", 2), Ingredient("flint", 2), Ingredient("goldnugget", 1)}, 
    RECIPETABS.TOOLS, 
    {builder_skill = "woodcutter_advanced"})
    
-- Recipe with multiple skill requirements (ANY of these skills will allow crafting)
Recipe("multitool", 
    {Ingredient("twigs", 3), Ingredient("flint", 3), Ingredient("gears", 1)}, 
    RECIPETABS.TOOLS,
    {builder_skill = {"engineering_advanced", "woodcutter_advanced"}})
```

#### Benefits of the Skill System

The character skill tree and builder skill integration offers several advantages:

1. **Progressive Unlocking**: Characters can unlock new crafting abilities as they progress
2. **Character Specialization**: Different characters can have unique crafting abilities
3. **Skill-Specific Recipes**: Certain recipes can be limited to characters with specific skills
4. **Dynamic Modifications**: Skills can be granted or removed based on game events, equipment, etc.
5. **Better Mod Integration**: Cleaner interface for mods to interact with character abilities

### Common Builder Skills

Some commonly used builder skills in the game include:

| Skill Name | Description | Related Recipes |
|------------|-------------|----------------|
| `woodcutter_harvester` | Basic woodcutting abilities | Special axe variants |
| `masterchef_spicestation` | Advanced cooking techniques | Special spiced foods |
| `naturalist_florist` | Plant and flower knowledge | Special flower recipes |
| `engineering_advanced` | Advanced engineering knowledge | Complex structures |
| `arcane_crafter` | Magical crafting abilities | Magical items and structures |

### Events and Notifications

When builder skills are added or removed, you can listen for these changes:

```lua
inst:ListenForEvent("builderskillchanged", function(inst, data)
    -- data.skill = Name of skill that changed
    -- data.added = true if added, false if removed
    print("Builder skill changed: " .. data.skill .. " - Added: " .. tostring(data.added))
end)
```


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

## Builder Skills vs Builder Tags

Prior to API version 624447, character skill trees used builder tags to unlock recipes. As of 624447, these have been replaced with builder skills, which integrate directly with the skill tree system. If you were using builder tags related to skill trees in your mods, you'll need to update to the new builder skills system.

### Migration Guide: Tags to Skills

If you're updating a mod from pre-624447 to the newer API version, follow these steps to migrate from builder tags to builder skills:

1. **Identify tag usage**: Find all instances where you add/remove builder-related tags
   ```lua
   -- Old code using tags
   inst:AddTag("handyperson") -- Added tag to allow building structures
   inst:AddTag("masterchef") -- Added tag to allow cooking special foods
   inst:RemoveTag("handyperson") -- Removed building capability
   ```

2. **Map tags to skills**: Replace tags with their equivalent builder skills
   ```lua
   -- Common tag to skill mappings
   local TAG_TO_SKILL = {
       masterchef = "masterchef_spicestation",
       handyperson = "engineering_advanced",
       woodcutter = "woodcutter_harvester",
       -- Add other mappings as needed
   }
   ```

3. **Update code to use builder skills**:
   ```lua
   -- New code using builder skills
   if inst.components.builder then
       inst.components.builder:AddBuilderSkill("masterchef_spicestation")
       inst.components.builder:AddBuilderSkill("engineering_advanced")
   end
   ```

4. **Handle compatibility across versions**:
   ```lua
   local function AddCraftingAbility(inst, ability_name)
       if TUNING.API_VERSION >= 624447 then
           -- New API - use builder skills
           if inst.components.builder then
               local skill = TAG_TO_SKILL[ability_name] or ability_name
               inst.components.builder:AddBuilderSkill(skill)
           end
       else
           -- Old API - use tags
           inst:AddTag(ability_name)
       end
   end
   
   -- Usage
   AddCraftingAbility(inst, "masterchef")
   ```

5. **Update recipe definitions**: If you've defined custom recipes that relied on builder tags, update them to use builder skills instead:
   ```lua
   -- Old recipe definition
   Recipe("specialitem", 
       {Ingredient("twigs", 1), Ingredient("cutgrass", 2)}, 
       RECIPETABS.TOOLS, 
       {builder_tag = "masterchef"})
       
   -- New recipe definition
   Recipe("specialitem", 
       {Ingredient("twigs", 1), Ingredient("cutgrass", 2)}, 
       RECIPETABS.TOOLS, 
       {builder_skill = "masterchef_spicestation"})
   ```

6. **Test thoroughly**: Ensure recipes unlock correctly across different API versions.

### Common Tag to Skill Mappings

| Old Builder Tag | New Builder Skill |
|----------------|-------------------|
| `masterchef` | `masterchef_spicestation` |
| `handyperson` | `engineering_advanced` |
| `woodcutter` | `woodcutter_harvester` |
| `gem_alchemistI` | `arcane_crafter` |
| `plantkin` | `naturalist_florist` |

Remember that builder skills offer more granular control than the previous tag system, allowing for more nuanced recipe unlocking based on character progression.

## See also

- [Inventory Component](inventory.md) - For storing crafting ingredients
- [Prototyper Component](other-components.md) - For workstations that provide tech levels
- [Recipes](../recipes/crafting.md) - For crafting recipe definitions
- [Sanity Component](sanity.md) - For sanity effects from crafting
- [Container Component](container.md) - For storing crafted items