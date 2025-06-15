---
id: related-component
title: Related Component
sidebar_position: 30
version: 619045
---

# Related Component

The Related component allows entities to form relationships with other entities. It manages relationship types, relationship strength, and relationship effects.

## Basic Usage

```lua title="basic_usage.lua"
-- Add a related component to an entity
local entity = CreateEntity()
entity:AddComponent("related")

-- Configure the related component
local related = entity.components.related
related:SetRelationshipType("friend")
related:AddRelatedEntity(other_entity, 0.8) -- 80% relationship strength
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `relationships` | Table | Table of related entities and relationship strengths |
| `relationship_type` | String | Type of relationship (friend, enemy, neutral) |
| `max_relationships` | Number | Maximum number of relationships allowed |
| `relationship_decay_rate` | Number | Rate at which relationships decay over time |
| `ondissolverelationship` | Function | Callback for when a relationship dissolves |
| `onformrelationship` | Function | Callback for when a relationship forms |

## Key Methods

```lua title="key_methods.lua"
-- Set relationship type
related:SetRelationshipType("friend")

-- Add a related entity
related:AddRelatedEntity(entity, 0.5) -- 50% relationship strength

-- Remove a relationship
related:RemoveRelatedEntity(entity)

-- Check relationship strength
local strength = related:GetRelationshipStrength(entity)

-- Update relationship strength
related:UpdateRelationship(entity, 0.1) -- Increase by 10%

-- Check if entities are related
local is_related = related:IsRelatedTo(entity)

-- Set callbacks
related:SetOnDissolveRelationship(function(inst, other)
    -- Do something when relationship dissolves
    print(inst.name .. " is no longer related to " .. other.name)
end)
```

## Events

The Related component responds to and triggers various events:

- `newrelationship` - Triggered when a new relationship is formed
- `dissolverelationship` - Triggered when a relationship dissolves
- `updaterelationship` - Triggered when relationship strength changes

## Integration with Other Components

The Related component often works with:

- `Combat` - For modifying damage based on relationships
- `Follower` - For following related entities
- `TeamAttacker` - For coordinating attacks with related entities
- `Herd` - For managing groups of related entities
- `Trader` - For special trading behavior with related entities

## See also

- [Combat Component](combat.md) - For relationship effects on combat
- [Follower Component](other-components.md) - For entities that follow related entities
- [TeamAttacker Component](other-components.md) - For coordinated attacks
- [Herd Component](other-components.md) - For managing groups of entities
- [Trader Component](trader.md) - For trading between related entities

## Example: Creating Entities with Relationships

```lua title="relationships_example.lua"
local function MakeRelatedEntities()
    -- Create parent entity
    local parent = CreateEntity()
    parent.entity:AddTransform()
    parent.entity:AddAnimState()
    parent:AddComponent("related")
    parent.components.related:SetRelationshipType("family")
    
    -- Create child entities
    for i = 1, 3 do
        local child = CreateEntity()
        child.entity:AddTransform()
        child.entity:AddAnimState()
        child:AddComponent("related")
        child.components.related:SetRelationshipType("family")
        
        -- Establish two-way relationship
        parent.components.related:AddRelatedEntity(child, 1.0)
        child.components.related:AddRelatedEntity(parent, 0.8)
        
        -- Add behavior based on relationship
        child:ListenForEvent("attacked", function(inst, data)
            -- Call parent for help when attacked
            if inst.components.related:IsRelatedTo(parent) then
                if parent.components.combat ~= nil then
                    parent.components.combat:SetTarget(data.attacker)
                end
            end
        end)
    end
    
    return parent
end
``` 