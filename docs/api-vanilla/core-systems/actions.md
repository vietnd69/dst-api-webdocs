---
title: Actions System
description: Documentation of the Don't Starve Together actions system
sidebar_position: 2
slug: /actions
last_updated: 2024-12-19
build_version: 675312
change_status: stable
---

# Actions System

The Actions system in Don't Starve Together defines all the possible interactions that entities (most commonly players) can perform in the game world. Actions are the fundamental building blocks for player interactions, covering everything from basic movement and item usage to complex multi-step crafting processes.

## Version History

| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 675312 | 2024-12-19 | stable | Updated documentation to match current implementation |
| 675312 | 2023-11-15 | modified | Added new boat and rift actions |
| 659421 | 2023-08-22 | modified | Improved action parameter handling |
| 642130 | 2023-06-10 | added | Initial comprehensive actions system |

## Overview

Actions represent all possible interactions in DST. When a player clicks on an object, uses a tool, or performs any gameplay activity, the underlying mechanics are handled through the Actions system. Each action defines:

- **What can be done** (the action itself)
- **When it can be done** (conditions and validity)
- **How it's performed** (distance, timing, requirements)
- **What happens** (the execution function)

The system consists of two main classes:
- **`Action`**: Defines the template for an interaction type
- **`BufferedAction`**: Represents a specific instance of an action being performed

## Action Class

The `Action` class is defined in `scripts/actions.lua` and serves as the blueprint for all interaction types.

### Constructor

```lua
Action = Class(function(self, data, instant, rmb, distance, ghost_valid, ghost_exclusive, canforce, rangecheckfn)
    -- Modern usage (recommended):
    local myAction = Action({
        priority = 2,
        rmb = true,
        distance = 3,
        mount_valid = true
    })
end)
```

> ⚠️ **Note**: Positional parameters are deprecated. Always use the table format for new actions.

### Action Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `priority` | Number | 0 | Higher priority actions take precedence when multiple are possible |
| `fn` | Function | `function() return false end` | The function that executes when the action is performed |
| `strfn` | Function | nil | Function that returns a string variation for the action (optional) |
| `instant` | Boolean | false | Whether the action happens instantly without animation |
| `rmb` | Boolean | nil | Whether the action is triggered by right-mouse button |
| `distance` | Number | nil | Maximum distance at which the action can be performed |
| `mindistance` | Number | nil | Minimum distance required to perform the action |
| `arrivedist` | Number | nil | Distance at which the player is considered "arrived" at the target |
| `ghost_valid` | Boolean | false | Whether the action can be performed as a ghost |
| `ghost_exclusive` | Boolean | false | Whether the action can ONLY be performed as a ghost |
| `mount_valid` | Boolean | false | Whether the action can be performed while mounted |
| `encumbered_valid` | Boolean | false | Whether the action can be performed while carrying heavy objects |
| `canforce` | Boolean | nil | Whether the action can be forced to execute |
| `rangecheckfn` | Function | nil | Custom function to check if target is in range |
| `silent_fail` | Boolean | nil | Whether to suppress failure notifications |
| `paused_valid` | Boolean | false | Whether the action can be performed while game is paused |
| `actionmeter` | Boolean | nil | Whether the action shows a progress meter |
| `theme_music` | String | nil | Music to play during the action |
| `theme_music_fn` | Function | nil | Client-side function to determine theme music |
| `is_relative_to_platform` | Boolean | nil | Whether the action's position is relative to the boat/platform |
| `disable_platform_hopping` | Boolean | nil | Whether platform hopping is disabled for this action |
| `skip_locomotor_facing` | Boolean | nil | Whether to skip automatic facing behavior |
| `do_not_locomote` | Boolean | nil | Whether to prevent movement during action |
| `extra_arrive_dist` | Function | nil | Function to calculate additional arrival distance |
| `tile_placer` | String | nil | Type of tile placer to show (e.g., "gridplacer") |
| `show_tile_placer_fn` | Function | nil | Function to determine when to show tile placer |
| `pre_action_cb` | Function | nil | Callback that runs before action execution (client and server) |
| `invalid_hold_action` | Boolean | nil | Whether this action cannot be held/repeated |
| `map_action` | Boolean | nil | Whether this action can only be performed from the map |
| `closes_map` | Boolean | nil | Whether performing this action closes the minimap |
| `map_only` | Boolean | nil | Whether this action exists only on the map |
| `map_works_on_unexplored` | Boolean | nil | Whether the action bypasses visibility checks on the map |

## BufferedAction Class

The `BufferedAction` class represents a specific instance of an action that is queued for execution.

### Constructor

```lua
BufferedAction = Class(function(self, doer, target, action, invobject, pos, recipe, distance, forced, rotation, arrivedist)
    -- Example usage:
    local buffered_action = BufferedAction(player, tree, ACTIONS.CHOP, axe)
end)
```

### BufferedAction Properties

| Property | Type | Description |
|----------|------|-------------|
| `doer` | Entity | Entity performing the action (usually the player) |
| `target` | Entity | Target entity of the action |
| `action` | Action | The action being performed |
| `invobject` | Entity | Inventory item being used for the action |
| `pos` | Vector3 | Position where the action will be performed |
| `recipe` | String | Recipe ID if the action involves crafting |
| `distance` | Number | Override for action's default distance |
| `forced` | Boolean | Whether the action is being forced |
| `rotation` | Number | Rotation angle for the action |
| `arrivedist` | Number | Override for arrival distance |

### BufferedAction Methods

| Method | Description |
|--------|-------------|
| `Do()` | Execute the action |
| `IsValid()` | Check if the action is still valid to perform |
| `GetActionString()` | Get the string representation of the action |
| `AddFailAction(fn)` | Add a function to call if action fails |
| `AddSuccessAction(fn)` | Add a function to call if action succeeds |
| `Succeed()` | Call success callbacks |
| `Fail()` | Call failure callbacks |

## Range Check Functions

The actions system includes several built-in range check functions:

### DefaultRangeCheck

```lua
local DefaultRangeCheck = MakeRangeCheckFn(4)
```

Standard range check that ensures the target is within 4 units of the doer.

### PhysicsPaddedRangeCheck

```lua
local function PhysicsPaddedRangeCheck(doer, target)
    if target == nil then return end
    local target_x, target_y, target_z = target.Transform:GetWorldPosition()
    local doer_x, doer_y, doer_z = doer.Transform:GetWorldPosition()
    local target_r = target:GetPhysicsRadius(0) + 4
    local dst = distsq(target_x, target_z, doer_x, doer_z)
    return dst <= target_r * target_r
end
```

Range check that accounts for the target's physics radius, useful for large objects.

### MakeRangeCheckFn

```lua
local function MakeRangeCheckFn(range)
    return function(doer, target)
        if target then
            return doer:IsNear(target, range)
        end
    end
end
```

Factory function to create custom range check functions with specific distances.

## Core Actions

The following table lists the core actions available in DST, organized by category:

### Basic Interactions

| Action | Priority | Distance | Mount Valid | Description |
|--------|----------|----------|-------------|-------------|
| `PICKUP` | 1 | - | ✓ | Pick up an item from the ground |
| `DROP` | -1 | - | ✓ | Drop an item from inventory |
| `EQUIP` | 0 | - | ✓ | Equip an item from inventory |
| `UNEQUIP` | -2 | - | ✓ | Unequip an item |
| `LOOKAT` | -3 | 3 | ✓ | Examine an object |
| `WALKTO` | -4 | - | ✓ | Move to a position |
| `TALKTO` | 3 | - | ✓ | Talk to an NPC |
| `INTERACT_WITH` | 0 | 1.5 | ✓ | General interaction |

### Tool Actions

| Action | Priority | Distance | Hold Invalid | Description |
|--------|----------|----------|--------------|-------------|
| `CHOP` | 0 | 1.75 | ✓ | Chop down trees |
| `MINE` | 0 | - | ✓ | Mine rocks or minerals |
| `DIG` | 0 | - | ✓ | Dig up objects (RMB) |
| `HAMMER` | 3 | - | ✓ | Hammer structures |
| `ATTACK` | 2 | - | ✓ | Attack creatures or objects |
| `NET` | 3 | - | - | Catch bugs with a net |

### Resource and Crafting

| Action | Priority | Distance | Mount Valid | Description |
|--------|----------|----------|-------------|-------------|
| `HARVEST` | 0 | - | - | Harvest crops and plants |
| `PLANT` | 0 | - | - | Plant seeds or saplings |
| `COOK` | 1 | - | ✓ | Cook food in cooking stations |
| `BUILD` | 0 | - | ✓ | Build structures |
| `DEPLOY` | 0 | 1.1 | ✓ | Deploy items on ground |
| `REPAIR` | 0 | - | ✓ | Repair damaged structures |

### Fire and Light

| Action | Priority | Distance | Mount Valid | Description |
|--------|----------|----------|-------------|-------------|
| `LIGHT` | -4 | - | - | Light objects on fire |
| `EXTINGUISH` | 0 | - | - | Extinguish fires |
| `STOKEFIRE` | 0 | 8 | ✓ | Stoke fires (RMB) |
| `ADDFUEL` | 0 | - | ✓ | Add fuel to objects |
| `ADDWETFUEL` | 0 | - | ✓ | Add wet fuel to objects |

### Ocean and Boat Actions

| Action | Priority | Distance | Platform Related | Description |
|--------|----------|----------|------------------|-------------|
| `FISH_OCEAN` | 0 | - | ✓ | Ocean fishing (RMB) |
| `OCEAN_FISHING_CAST` | 3 | - | ✓ | Cast fishing line (RMB) |
| `OCEAN_FISHING_REEL` | 5 | - | - | Reel in fish (RMB) |
| `ROW` | 3 | - | ✓ | Row boat |
| `RAISE_SAIL` | 0 | 1.25 | - | Raise boat sail |
| `LOWER_SAIL` | 0 | 1.25 | - | Lower boat sail |
| `RAISE_ANCHOR` | 0 | 2.5 | - | Raise boat anchor |
| `LOWER_ANCHOR` | 0 | 2.5 | - | Lower boat anchor |

### Character-Specific Actions

| Action | Priority | Distance | Description |
|--------|----------|----------|-------------|
| `USEMAGICTOOL` | 1 | - | Maxwell's magic tools |
| `USESPELLBOOK` | 2 | - | Maxwell's spellbooks |
| `LIFT_DUMBBELL` | 2 | - | Wolfgang's gym actions |
| `APPLYMODULE` | 0 | - | WX-78's module system |
| `MUTATE_SPIDER` | 2 | - | Webber's spider mutation |
| `DISMANTLE_POCKETWATCH` | 0 | - | Wanda's time manipulation |

### Map Actions

| Action | Priority | Distance | Map Only | Description |
|--------|----------|----------|----------|-------------|
| `JUMPIN_MAP` | 10 | - | - | Jump into wormholes from map |
| `BLINK_MAP` | 10 | - | - | Teleport from map view |
| `TOSS_MAP` | 10 | - | - | Throw items from map |
| `DIRECTCOURIER_MAP` | 10 | - | ✓ | Direct courier delivery |

## High Priority Actions

Actions with `HIGH_ACTION_PRIORITY` (value 10) are designed to always dominate when available:

- `COMPARE_WEIGHABLE`: Weight comparison interactions
- `JUMPIN_MAP`: Map-based wormhole travel
- `BLINK_MAP`: Map-based teleportation
- `TOSS_MAP`: Map-based item throwing
- `TOGGLE_DEPLOY_MODE`: Deploy mode toggling
- `PLANTREGISTRY_RESEARCH`: Plant research interactions
- `CASTAOE`: Area of effect spell casting
- `CAST_NET`: Net casting for ocean
- `DIRECTCOURIER_MAP`: Map courier actions

## Creating Custom Actions

To create a custom action for your mod:

### 1. Define the Action

```lua
-- In modmain.lua
local MYACTION = Action({
    priority = 2,
    rmb = false,
    distance = 3,
    mount_valid = true,
    silent_fail = false
})

-- Set the action function
MYACTION.fn = function(act)
    -- act is a BufferedAction instance
    local doer = act.doer
    local target = act.target
    local tool = act.invobject
    
    -- Your action logic here
    if target and target.components.mycomponent then
        return target.components.mycomponent:DoSomething(doer, tool)
    end
    
    return false -- Return true for success, false for failure
end

-- Optional: Add string variation function
MYACTION.strfn = function(act)
    if act.target and act.target:HasTag("special") then
        return "SPECIAL"
    end
    return nil
end

-- Register the action
ACTIONS.MYACTION = MYACTION
AddActionHandler("MYACTION", "My Action")
```

### 2. Add Component Actions

```lua
-- Make objects actionable
local function MyComponent_GetActions(inst, doer, target, actions, right)
    if target and target:HasTag("my_actionable_tag") then
        table.insert(actions, ACTIONS.MYACTION)
    end
end

AddComponentAction("SCENE", "mycomponent", MyComponent_GetActions)
```

### 3. Add Localization

```lua
-- Add action strings
STRINGS.ACTIONS.MYACTION = "My Action"
STRINGS.ACTIONS.MYACTION.SPECIAL = "My Special Action"
```

## Action System Integration

### With State Graphs

Actions integrate with the state graph system to control animations:

```lua
-- In a state graph
EventHandler("doaction", function(inst, data)
    if data.action == ACTIONS.MYACTION then
        return "my_action_state"
    end
end)
```

### With Components

Components can define what actions are available:

```lua
-- In a component
function MyComponent:GetActionHandlers()
    return {
        [ACTIONS.MYACTION] = function(inst, action)
            return self:HandleMyAction(action.doer, action.invobject)
        end
    }
end
```

### With UI System

The action system integrates with UI to show available interactions and progress:

```lua
-- Actions can show progress meters
local myAction = Action({
    actionmeter = true,
    theme_music = "working"
})
```

## Best Practices

### Priority Management

- Use negative priorities (-1 to -4) for background actions like `WALKTO` and `LOOKAT`
- Use 0 priority for standard interactions
- Use positive priorities (1-3) for important actions
- Use `HIGH_ACTION_PRIORITY` (10) only for actions that should always dominate

### Distance and Range

- Set appropriate `distance` values for natural feeling interactions
- Use `extra_arrive_dist` functions for dynamic distance calculation
- Consider `mindistance` for actions that shouldn't work when too close
- Use custom `rangecheckfn` for complex range requirements

### Validation Flags

- Set `mount_valid = true` for actions that should work while riding
- Use `ghost_valid = true` for actions ghosts can perform
- Set `encumbered_valid = true` for actions possible while carrying heavy items
- Use `paused_valid = true` for actions that work during pause

### Performance Considerations

- Keep action functions lightweight as they may be called frequently
- Use `instant = true` for actions that don't require animation
- Set `silent_fail = true` to reduce spam from frequently failing actions
- Use `do_not_locomote = true` to prevent unnecessary movement

### Error Handling

```lua
MYACTION.fn = function(act)
    -- Always validate inputs
    if not act.doer or not act.target then
        return false
    end
    
    -- Check for required components
    if not act.target.components.mycomponent then
        return false
    end
    
    -- Perform action logic
    local success = act.target.components.mycomponent:DoAction(act.doer)
    
    -- Return boolean result
    return success
end
```

## Debugging Actions

### Console Commands

```lua
-- Get the current mouse action
ThePlayer.components.playercontroller:GetActionButtonAction()

-- Get all available actions at mouse position
ThePlayer.components.playeractionpicker:DoGetMouseActions()

-- Force an action
local buffered_action = BufferedAction(ThePlayer, target, ACTIONS.MYACTION)
ThePlayer.components.playercontroller:DoAction(buffered_action)
```

### Debug Logging

```lua
-- Add debug logging to your action
MYACTION.fn = function(act)
    print("MYACTION called:", act.doer, act.target, act.invobject)
    
    local result = DoMyActionLogic(act)
    
    print("MYACTION result:", result)
    return result
end
```

## Related Systems

The Actions system integrates closely with several other DST systems:

- **[Components System](../components/index.md)**: Components define what actions entities can perform and receive
- **[State Graph System](../stategraphs/index.md)**: State graphs control animations and timing for action execution
- **[UI System](../../screens/index.md)**: The UI displays action hints and handles player input
- **[Networking System](../networking.md)**: Actions are synchronized between client and server
- **[Entity System](../entity.md)**: All actions operate on entities in the game world

## Troubleshooting

### Common Issues

1. **Action not appearing**: Check that component actions are properly registered and conditions are met
2. **Action not executing**: Verify the action function returns `true` and all required components exist  
3. **Wrong action priority**: Adjust priority values to ensure correct action precedence
4. **Range issues**: Check distance settings and custom range check functions
5. **Animation problems**: Ensure state graph integration is properly configured

### Performance Issues

- **Frequent action calls**: Use `silent_fail` to reduce notification spam
- **Expensive range checks**: Optimize custom `rangecheckfn` implementations
- **Heavy action functions**: Move complex logic to components or separate functions
- **Memory leaks**: Ensure proper cleanup in action success/fail callbacks
