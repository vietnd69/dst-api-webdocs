---
id: actionhandlers
title: Action Handlers
sidebar_position: 4
last_updated: 2023-07-06
---

# Action Handlers

Action handlers are a key component of the stategraph system that allows entities to respond to gameplay actions initiated by players or AI. They provide a way to define how an entity should respond when someone attempts to perform an action on it or when it needs to perform an action itself.

## Creating Action Handlers

Action handlers are created using the `ActionHandler` constructor:

```lua
ActionHandler(ACTIONS.EAT, function(inst, action)
    if action.target and action.target:HasTag("food") then
        inst.sg:GoToState("eat", action.target)
        return true
    end
    return false
end)
```

The function returns `true` if the action is handled successfully, or `false` if it should fall back to default handling.

## Action Handler Structure

The basic structure of an action handler includes:

1. The action type (from `ACTIONS` table)
2. A handler function that receives:
   - `inst`: The entity performing the action
   - `action`: The action being performed

## Common Action Types

Here are some common action types defined in `ACTIONS`:

- `ACTIONS.ATTACK`: Attack a target
- `ACTIONS.EAT`: Eat food
- `ACTIONS.PICKUP`: Pick up an item
- `ACTIONS.CHOP`: Chop a tree
- `ACTIONS.MINE`: Mine a rock
- `ACTIONS.DIG`: Dig up an object
- `ACTIONS.HARVEST`: Harvest a resource
- `ACTIONS.WALKTO`: Walk to a location

## Example: Creating Action Handlers

```lua
local actionhandlers = {
    ActionHandler(ACTIONS.EAT, function(inst, action)
        inst.sg:GoToState("eat", action.target)
        return true
    end),
    
    ActionHandler(ACTIONS.PICKUP, function(inst, action)
        inst.sg:GoToState("pickup")
        return true
    end),
    
    ActionHandler(ACTIONS.ATTACK, function(inst, action)
        if not inst.components.health:IsDead() then
            inst.sg:GoToState("attack", action.target)
            return true
        end
        return false
    end),
}
```

## Adding Action Handlers to a Stategraph

Action handlers are passed as the fifth parameter when creating a StateGraph:

```lua
return StateGraph("myentity", states, events, "idle", actionhandlers)
```

## Destination State Logic

Action handlers often need to transition the entity to a state that will perform the action:

```lua
ActionHandler(ACTIONS.CHOP, function(inst, action)
    if not inst.sg:HasStateTag("busy") then
        inst.sg:GoToState("chop", action.target)
        return true
    end
    return false
end)
```

## Action Data

The `action` parameter provides information about the action being performed:

- `action.target`: The target entity of the action
- `action.doer`: The entity performing the action
- `action.pos`: The position where the action is being performed
- `action.distance`: The distance at which the action can be performed

## Using Destination State

You can pass data to the destination state to use in that state's logic:

```lua
ActionHandler(ACTIONS.ATTACK, function(inst, action)
    inst.sg:GoToState("attack", {
        target = action.target,
        weapon = inst.components.combat:GetWeapon()
    })
    return true
end)
```

Then, in the destination state:

```lua
State{
    name = "attack",
    onenter = function(inst, data)
        inst.sg.statemem.target = data.target
        inst.sg.statemem.weapon = data.weapon
        inst.AnimState:PlayAnimation("attack")
    end,
    
    timeline = {
        TimeEvent(10*FRAMES, function(inst)
            inst.components.combat:DoAttack(inst.sg.statemem.target, inst.sg.statemem.weapon)
        end),
    },
}
```

## Conditionally Handling Actions

Action handlers can conditionally choose whether to handle an action:

```lua
ActionHandler(ACTIONS.PICKUP, function(inst, action)
    -- Only handle the action if the entity isn't busy
    if not inst.sg:HasStateTag("busy") then
        -- Only pick up food items
        if action.target and action.target:HasTag("food") then
            inst.sg:GoToState("pickup", action.target)
            return true
        end
    end
    return false
end)
```

## Interrupting Current State

Action handlers can choose to interrupt the current state based on conditions:

```lua
ActionHandler(ACTIONS.ATTACK, function(inst, action)
    -- Allow attacking from idle or if currently doing something interruptible
    if inst.sg:HasStateTag("idle") or inst.sg:HasStateTag("caninterrupt") then
        inst.sg:GoToState("attack")
        return true
    end
    return false
end) 
