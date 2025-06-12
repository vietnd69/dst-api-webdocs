---
id: tags
title: Tags
sidebar_position: 2
---

# Tags

The tag system is a common property used to categorize and identify entity characteristics in Don't Starve Together. Tags provide an efficient way to mark entities with specific attributes that can be queried during gameplay.

## Overview

Tags are simple string identifiers attached to entities. They serve multiple purposes:

- Categorization of entities by type or behavior
- Targeting specific groups of entities with actions or effects
- Implementing game mechanics that depend on entity characteristics
- Optimizing entity queries and searches

## Usage

### Adding and Removing Tags

Tags can be added to an entity through the `EntityScript` interface:

```lua
-- Add a tag to an entity
inst:AddTag("tagname")

-- Remove a tag from an entity
inst:RemoveTag("tagname")

-- Check if an entity has a specific tag
if inst:HasTag("tagname") then
    -- Do something with tagged entity
end
```

### Common Tag Operations

```lua
-- Check if entity has one of multiple tags
if inst:HasOneOfTags({"tagname1", "tagname2", "tagname3"}) then
    -- Entity has at least one of these tags
end

-- Check if entity has all specified tags
if inst:HasAllTags({"tagname1", "tagname2"}) then
    -- Entity has both tags
end
```

## Entity Searching with Tags

Tags are commonly used with the `FindEntities` function to locate specific types of entities:

```lua
-- Find all entities with the "monster" tag within a radius of 20
local x, y, z = inst.Transform:GetWorldPosition()
local monsters = TheSim:FindEntities(x, y, z, 20, {"monster"})

-- Find entities with multiple tag requirements
local targets = TheSim:FindEntities(x, y, z, 20, {"_combat"}, {"INLIMBO", "notarget"})
```

## Common Tags

### General Entity Tags

| Tag | Description |
|-----|-------------|
| `INLIMBO` | Entity is not physically present in the world |
| `FX` | Visual effects that don't interact with gameplay |
| `NOCLICK` | Entity cannot be clicked on |
| `player` | Identifies player characters |
| `monster` | Identifies hostile creatures |
| `structure` | Buildings and constructions |
| `heavy` | Heavy objects that can't be blown away by wind |

### Gameplay Tags

| Tag | Description |
|-----|-------------|
| `_combat` | Entity has combat capability |
| `fire` | Entity is on fire or is a fire source |
| `burnt` | Entity has been burnt |
| `freezable` | Entity can be frozen |
| `companion` | Entity follows or assists players |
| `trap` | Entity functions as a trap |
| `edible` | Entity can be eaten |

### Technical Tags

| Tag | Description |
|-----|-------------|
| `CLASSIFIED` | Used for networked entities with private data |
| `NOBLOCK` | Entity doesn't block movement |
| `shadow` | Shadow creature or object |
| `NET_workable` | Entity has networked workable component |
| `NET_persistent` | Entity persists across game sessions |

## Tag Implementation

In the game code, tag operations are implemented directly in the C++ engine layer for performance, but exposed to Lua for game logic. Tags are stored as a simple set for fast lookups, which makes tag operations highly efficient.

## Best Practices

When implementing custom prefabs, follow these guidelines for tags:

1. Add tags during entity creation for proper networking
2. Use existing tags when possible for consistency
3. Create new tags only when existing ones don't cover your needs
4. Document custom tags in your code for other developers
5. Consider tag performance: excessive tags can impact memory usage

## Example: Creating an Entity with Tags

```lua
local function MyEntity()
    local inst = CreateEntity()
    
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Add tags before network initialization
    inst:AddTag("myentity")
    inst:AddTag("structure")
    
    if not TheWorld.ismastersim then
        return inst
    end
    
    -- Master simulation code here
    
    return inst
end

return Prefab("myentity", MyEntity)
``` 