---
id: tags
title: Tag System
sidebar_position: 2
last_updated: 2023-07-06
---

# Tag System

The tag system in Don't Starve Together is a lightweight method for categorizing and identifying entities. Tags are simple string labels attached to entities that allow for quick filtering and identification without the overhead of checking components or other properties.

## Basic Tag Operations

```lua
-- Add a tag to an entity
inst:AddTag("mytag")

-- Remove a tag from an entity
inst:RemoveTag("mytag")

-- Check if an entity has a specific tag
local has_tag = inst:HasTag("mytag")

-- Check if an entity has all of a set of tags
local has_all = inst:HasTags("mytag1", "mytag2", "mytag3")

-- Check if an entity has any of a set of tags
local has_any = inst:HasOneOfTags("mytag1", "mytag2", "mytag3")

-- Add or remove a tag based on a condition
inst:AddOrRemoveTag("mytag", condition_is_true)
```

## Common Tag Categories

### Entity Type Tags

```lua
-- Character type tags
"player"          -- Is a player character
"character"       -- Is any character
"monster"         -- Is a hostile creature
"animal"          -- Is a passive animal
"structure"       -- Is a built structure
"veggie"          -- Is a vegetable
"meat"            -- Is meat
"insect"          -- Is an insect
```

### State Tags

```lua
-- Entity state tags
"frozen"          -- Entity is currently frozen
"burning"         -- Entity is on fire
"dead"            -- Entity is dead
"cooked"          -- Food item is cooked
"wet"             -- Entity is wet
"poisoned"        -- Entity is poisoned
"sleeping"        -- Entity is sleeping
"busy"            -- Entity is in a busy state (can't take actions)
```

### Capability Tags

```lua
-- Capability tags
"fire"            -- Produces fire/light
"light"           -- Emits light
"shelter"         -- Provides shelter from rain
"heavy"           -- Is a heavy object (slows carrying character)
"aquatic"         -- Can go in water
"flying"          -- Can fly over obstacles
"irreplaceable"   -- Can't be replaced if destroyed
```

### Interaction Tags

```lua
-- Interaction tags
"pickable"        -- Can be picked
"choppable"       -- Can be chopped
"mineable"        -- Can be mined
"hammerable"      -- Can be hammered
"fishable"        -- Can be fished
"cattoyairborne"  -- Can be batted by catcoon
"trap"            -- Is a trap
"edible"          -- Can be eaten
```

## Finding Entities by Tags

Tags are commonly used with entity search functions:

```lua
-- Find all entities with specific tags within a radius
local x, y, z = inst.Transform:GetWorldPosition()
local radius = 10
local ents = TheSim:FindEntities(x, y, z, radius, 
    {"player"}, -- Must have these tags
    {"playerghost"}) -- Must not have these tags
    
-- Process found entities
for _, entity in ipairs(ents) do
    -- Do something with each entity
end
```

## Common Use Cases

### Filtering Entities

```lua
-- Finding edible items in inventory
local edible_items = {}
for k, v in pairs(self.items) do
    if v:HasTag("edible") then
        table.insert(edible_items, v)
    end
end
```

### Conditional Behavior

```lua
-- Different behavior based on tags
function ShouldAttack(target)
    -- Don't attack other players in non-PVP
    if target:HasTag("player") and not TheNet:GetPVPEnabled() then
        return false
    end
    
    -- Don't attack if target is invulnerable
    if target:HasTag("INLIMBO") or target:HasTag("notarget") then
        return false
    end
    
    -- Only attack enemies or prey
    return target:HasOneOfTags({"monster", "prey"})
end
```

### Component Requirements

```lua
-- Some components check for tags
inst:AddComponent("eater")
inst.components.eater:SetDiet({ FOODTYPE.MEAT }, { "meat" })
```

## Best Practices

When working with tags:

1. **Use Tags for Fast Checks**: Tag checks are much faster than component checks
2. **Keep Tag Names Simple**: Use lowercase, descriptive names without special characters
3. **Add Tags Early**: Add tags during entity creation for consistency
4. **Use Specific Tags**: More specific tags allow for better filtering
5. **Document Custom Tags**: When creating custom tags for your mod, document their meaning and use
6. **Consider Tag Conflicts**: Be aware that other mods might add or remove tags

## Common Mistakes

- **Overusing Tags**: Adding too many tags can increase memory usage
- **Using Tags for Data**: Tags should identify characteristics, not store data
- **Case Sensitivity**: Tags are case-sensitive; "player" and "PLAYER" are different tags
- **Missing Negative Tags**: Sometimes you need to check for the absence of a tag 
