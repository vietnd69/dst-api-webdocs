---
id: commonstates
title: Common States
sidebar_position: 5
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Common States

The `CommonStates` module provides a collection of pre-defined states that can be reused across different entity stategraphs. This helps maintain consistency in entity behaviors while reducing code duplication.

## Using CommonStates

To use CommonStates, you first need to require the module at the top of your stategraph file:

```lua
require("stategraphs/commonstates")
```

Then you can add common states to your states table:

```lua
local states = {
    -- Add the idle state
    CommonStates.AddIdle(),
    
    -- Add walk states with parameters
    CommonStates.AddWalk(),
    
    -- Add run states
    CommonStates.AddRun(),
    
    -- Custom states specific to your entity
    State{
        name = "special_ability",
        -- state definition...
    },
}
```

## Available Common States

### Basic States

#### AddIdle

Adds a standard idle state:

```lua
CommonStates.AddIdle(states, anim_override, timeline)
```

- `states`: The states table to add to
- `anim_override`: Optional animation name to use instead of "idle"
- `timeline`: Optional timeline to add to the idle state

#### AddFrozen

Adds a frozen state for entities that can be frozen:

```lua
CommonStates.AddFrozen(states)
```

### Movement States

#### AddWalk

Adds states for walking:

```lua
CommonStates.AddWalk(
    states,              -- States table
    timing_override,     -- Optional custom timing 
    anim_override,       -- Optional animation name override
    loop_override,       -- Optional loop setting
    pre_move_fn,         -- Optional function to call before moving
    postwalk_fn,         -- Optional function to call after walking
    start_fn,            -- Optional function to call at start
    stop_fn              -- Optional function to call at stop
)
```

#### AddRun

Adds states for running:

```lua
CommonStates.AddRun(
    states,             -- States table
    timing_override,    -- Optional custom timing
    anim_override,      -- Optional animation name override
    loop_override,      -- Optional loop setting
    pre_move_fn,        -- Optional function to call before moving
    postrun_fn,         -- Optional function to call after running
    start_fn,           -- Optional function to call at start
    stop_fn             -- Optional function to call at stop
)
```

### Combat States

#### AddFightStates

Adds basic combat states:

```lua
CommonStates.AddFightStates(
    states,              -- States table
    attack_timing,       -- Time when attack happens
    hit_recovery,        -- Hit recovery time
    anim_override_fn,    -- Function to override animations
    attack_sound_fn,     -- Function to play attack sounds
    loop_attack_fn       -- Function to handle attack looping
)
```

#### AddCombatStates

Adds detailed combat states with more configuration options:

```lua
CommonStates.AddCombatStates(
    states,              -- States table
    config               -- Configuration table
)
```

The `config` table can include various options for animations, timings, and callbacks.

### Health and Status States

#### AddSleepStates

Adds states for sleeping:

```lua
CommonStates.AddSleepStates(
    states,              -- States table
    sleeptimeline,       -- Timeline for the sleep state
    sleepstart_timeline, -- Timeline for the sleep start state
    sleeploop_timeline   -- Timeline for the sleep loop state
)
```

#### AddHitState

Adds a state for taking damage:

```lua
CommonStates.AddHitState(states, anim_override)
```

#### AddDeathState

Adds a state for death:

```lua
CommonStates.AddDeathState(
    states,           -- States table
    anim_override,    -- Optional animation override
    sound_override    -- Optional sound override
)
```

## Example Usage

Here's an example of creating a stategraph with common states:

```lua
require("stategraphs/commonstates")

local states = {
    -- Add standard states
    CommonStates.AddIdle(),
    CommonStates.AddWalk(),
    CommonStates.AddRun(),
    CommonStates.AddSleepStates(),
    CommonStates.AddFrozen(),
    
    -- Add combat states with custom configuration
    CommonStates.AddCombatStates(states, {
        attackanimfn = function() return "attack" end,
        timing = 10*FRAMES,
        hittimeline = {
            TimeEvent(0, function(inst) inst.SoundEmitter:PlaySound("dontstarve/creatures/spider/hit_response") end)
        },
    }),
    
    -- Custom states specific to this entity
    State{
        name = "special_ability",
        tags = {"busy", "canrotate"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("special")
        end,
        
        events = {
            EventHandler("animover", function(inst) 
                inst.sg:GoToState("idle")
            end),
        },
    },
}

local events = {
    CommonHandlers.OnLocomote(true, true),
    CommonHandlers.OnSleep(),
    CommonHandlers.OnFreeze(),
    CommonHandlers.OnAttack(),
    CommonHandlers.OnAttacked(),
    CommonHandlers.OnDeath(),
}

return StateGraph("myentity", states, events, "idle")
```

## Common Event Handlers

In addition to common states, there are also common event handlers in the `CommonHandlers` table:

```lua
local events = {
    CommonHandlers.OnLocomote(true, true), -- can_run, can_walk
    CommonHandlers.OnSleep(),
    CommonHandlers.OnFreeze(),
    CommonHandlers.OnAttack(),
    CommonHandlers.OnAttacked(),
    CommonHandlers.OnDeath(),
}
```

## Customizing Common States

You can customize common states by providing parameters to the Add functions:

```lua
-- Custom animation for idle state
CommonStates.AddIdle(states, "my_custom_idle"),

-- Custom walk states with special functions
CommonStates.AddWalk(
    states,
    nil,  -- use default timing
    nil,  -- use default animation
    nil,  -- use default loop
    function(inst)  -- pre-move function
        inst.SoundEmitter:PlaySound("dontstarve/creatures/spider/walk_dirt")
    end
)
```

This allows you to reuse the structure of common states while adapting them to your specific entity's needs. 
