---
id: stategraphs-overview
title: Stategraphs Overview
sidebar_position: 1
slug: /api/stategraphs
---

# Stategraphs Overview

Stategraphs are a powerful state machine system that controls entity behavior, animations, and interactions in Don't Starve Together. They provide a structured way to define how entities transition between different states based on events and actions.

## Core Concepts

A stategraph consists of several key components:

- **States**: Defined behaviors that an entity can be in at any given time (e.g., idle, walking, attacking)
- **Events**: Triggers that can cause state transitions (e.g., receiving damage, reaching a target)
- **Transitions**: Rules for moving between states in response to events
- **ActionHandlers**: Special handlers for gameplay actions initiated by the player or AI

## Creating a Stategraph

To create a stategraph, you'll need to:

1. Define the states with their enter/exit behaviors and timelines
2. Set up event handlers to respond to game events
3. Define any necessary action handlers
4. Return a StateGraph object

Basic example:

```lua
local function CreateMyEntityStategraph()
    local states = {
        State{
            name = "idle",
            tags = { "idle", "canrotate" },
            onenter = function(inst)
                inst.AnimState:PlayAnimation("idle")
            end,
        },
        -- More states...
    }

    local events = {
        EventHandler("attacked", function(inst)
            inst.sg:GoToState("hit")
        end),
        -- More event handlers...
    }

    return StateGraph("myentity", states, events, "idle")
end
```

## Using Stategraphs

To use a stategraph with an entity:

```lua
function MyEntity:Init()
    -- Create the entity
    local inst = CreateEntity()
    
    -- Add components
    inst:AddComponent("locomotor")
    
    -- Set the stategraph
    inst:SetStateGraph("SGmyentity")
    
    return inst
end
```

## Common States and Handlers

Don't Starve Together provides reusable states and handlers in `commonstates.lua`, which you can use to implement standard behaviors like:

- Walking/running
- Attacking
- Taking damage
- Sleeping
- Freezing

This module helps maintain consistency across different entities while reducing code duplication. 