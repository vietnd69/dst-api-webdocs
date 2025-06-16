---
id: stategraph-mod
title: State Graph Integration
sidebar_position: 6
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Working with State Graphs

This tutorial walks through working with state graphs in Don't Starve Together. We'll create a custom weapon with unique attack animations and states.

## Project Overview

We'll create a mod that adds a "Dual Blade" weapon with:
- Custom state graph for unique attack animations
- Multiple attack states with different effects
- Custom sound effects for each attack state
- Visual effects during attacks

## Step 1: Set Up the Mod Structure

Create these folders and files:

```
dualblade_mod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   ├── prefabs/
│   │   └── dualblade.lua
│   └── stategraphs/
│       └── SGdualblade.lua
├── anim/
│   ├── dualblade.zip
│   └── swap_dualblade.zip
└── images/
    └── inventoryimages/
        ├── dualblade.tex
        └── dualblade.xml
```

## Step 2: Create the modinfo.lua File

```lua
name = "Dual Blade Weapon"
description = "Adds a dual blade weapon with custom attack animations"
author = "Your Name"
version = "1.0.0"

-- Compatible with Don't Starve Together
dst_compatible = true

-- Not compatible with Don't Starve
dont_starve_compatible = false
reign_of_giants_compatible = false

-- This mod is required on clients
all_clients_require_mod = true

-- This mod is not a client-only mod
client_only_mod = false

-- Icon displayed in the server list
icon_atlas = "modicon.xml"
icon = "modicon.tex"

-- Tags that describe your mod
server_filter_tags = {
    "weapon",
    "item"
}

-- Configuration options
configuration_options = {
    {
        name = "attack_damage",
        label = "Attack Damage",
        options = {
            {description = "Low (30)", data = 30},
            {description = "Medium (45)", data = 45},
            {description = "High (60)", data = 60}
        },
        default = 45
    },
    {
        name = "enable_special_attacks",
        label = "Special Attacks",
        options = {
            {description = "Enabled", data = true},
            {description = "Disabled", data = false}
        },
        default = true
    }
}
```

## Step 3: Create the State Graph

Create `scripts/stategraphs/SGdualblade.lua`:

```lua
require("stategraphs/commonstates")

-- Define the state graph for the dual blade
local states = {
    -- Idle state
    State{
        name = "idle",
        tags = {"idle", "canrotate"},
        
        onenter = function(inst)
            inst.AnimState:PlayAnimation("idle_loop", true)
        end,
    },
    
    -- Standard attack state
    State{
        name = "attack",
        tags = {"attack", "busy"},
        
        onenter = function(inst)
            inst.components.locomotor:Stop()
            inst.AnimState:PlayAnimation("atk")
            
            -- Set the attack timing
            inst.sg:SetTimeout(inst.AnimState:GetCurrentAnimationLength())
            
            -- Play attack sound
            inst.SoundEmitter:PlaySound("dontstarve/wilson/attack_weapon")
        end,
        
        timeline = {
            -- Attack damage happens at frame 10
            TimeEvent(10*FRAMES, function(inst)
                inst:PerformBufferedAction()
                inst.sg:RemoveStateTag("busy")
            end),
        },
        
        ontimeout = function(inst)
            inst.sg:GoToState("idle")
        end,
        
        events = {
            EventHandler("animover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
    
    -- Special spin attack state
    State{
        name = "spin_attack",
        tags = {"attack", "busy", "spinning"},
        
        onenter = function(inst)
            inst.components.locomotor:Stop()
            inst.AnimState:PlayAnimation("spin_pre")
            inst.AnimState:PushAnimation("spin_loop", false)
            inst.AnimState:PushAnimation("spin_pst", false)
            
            -- Play special attack sound
            inst.SoundEmitter:PlaySound("dontstarve/wilson/attack_nightsword")
        end,
        
        timeline = {
            -- Spin attack has multiple damage points
            TimeEvent(10*FRAMES, function(inst)
                inst:DoSpinDamage(1) -- First hit
                
                -- Spawn effect
                local fx = SpawnPrefab("cane_victorian_fx")
                if fx then
                    fx.Transform:SetPosition(inst.Transform:GetWorldPosition())
                end
            end),
            
            TimeEvent(15*FRAMES, function(inst)
                inst:DoSpinDamage(2) -- Second hit
            end),
            
            TimeEvent(20*FRAMES, function(inst)
                inst:DoSpinDamage(3) -- Third hit
                inst.sg:RemoveStateTag("busy")
            end),
        },
        
        events = {
            EventHandler("animqueueover", function(inst)
                inst.sg:GoToState("idle")
            end),
        },
    },
    
    -- Dash attack state
    State{
        name = "dash_attack",
        tags = {"attack", "busy", "dashing"},
        
        onenter = function(inst)
            inst.components.locomotor:Stop()
            inst.AnimState:PlayAnimation("dash_pre")
            inst.AnimState:PushAnimation("dash_loop", true)
            
            -- Play dash sound
            inst.SoundEmitter:PlaySound("dontstarve/wilson/attack_nightsword")
            
            -- Start dash movement
            inst.Physics:SetMotorVelOverride(12, 0, 0)
            inst.components.locomotor:EnableGroundSpeedMultiplier(false)
            
            -- Set timeout for dash duration
            inst.sg:SetTimeout(0.6)
        end,
        
        onupdate = function(inst)
            -- Apply dash damage to anything in path
            inst:DoDashDamage()
        end,
        
        ontimeout = function(inst)
            -- End the dash
            inst.Physics:ClearMotorVelOverride()
            inst.components.locomotor:EnableGroundSpeedMultiplier(true)
            inst.AnimState:PlayAnimation("dash_pst")
            
            -- Spawn end effect
            local fx = SpawnPrefab("groundpoundring_fx")
            if fx then
                fx.Transform:SetPosition(inst.Transform:GetWorldPosition())
                fx.Transform:SetScale(0.5, 0.5, 0.5)
            end
        end,
        
        events = {
            EventHandler("animover", function(inst)
                if inst.AnimState:IsCurrentAnimation("dash_pst") then
                    inst.sg:GoToState("idle")
                end
            end),
        },
        
        onexit = function(inst)
            -- Clean up if state is interrupted
            inst.Physics:ClearMotorVelOverride()
            inst.components.locomotor:EnableGroundSpeedMultiplier(true)
        end,
    },
}

-- Return the state graph
return StateGraph("dualblade", states, events, "idle", actionhandlers)
```

## Step 4: Create the Dual Blade Prefab

Create `scripts/prefabs/dualblade.lua`:

```lua
local assets = {
    Asset("ANIM", "anim/dualblade.zip"),
    Asset("ANIM", "anim/swap_dualblade.zip"),
    
    Asset("IMAGE", "images/inventoryimages/dualblade.tex"),
    Asset("ATLAS", "images/inventoryimages/dualblade.xml"),
}

-- Function to do spin attack damage
local function DoSpinDamage(inst, hitnum)
    local x, y, z = inst.Transform:GetWorldPosition()
    local radius = 2 -- Attack radius
    
    -- Find entities in range
    local ents = TheSim:FindEntities(x, y, z, radius, {"_combat"}, {"player", "companion", "INLIMBO"})
    
    -- Apply damage to each entity
    for _, ent in ipairs(ents) do
        if ent.components.combat and ent ~= inst then
            local damage = inst.components.weapon.damage * 0.5 -- Spin attacks do 50% damage
            ent.components.combat:GetAttacked(inst, damage)
            
            -- Spawn hit effect
            local fx = SpawnPrefab("sparks")
            if fx then
                fx.Transform:SetPosition(ent.Transform:GetWorldPosition())
            end
        end
    end
end

-- Function to do dash attack damage
local function DoDashDamage(inst)
    local x, y, z = inst.Transform:GetWorldPosition()
    local radius = 1.5 -- Dash hit radius
    local angle = inst.Transform:GetRotation() * DEGREES
    
    -- Calculate forward position based on facing angle
    local offset_x = math.cos(angle) * 1.5
    local offset_z = -math.sin(angle) * 1.5
    
    -- Find entities in front of player
    local ents = TheSim:FindEntities(x + offset_x, y, z + offset_z, radius, {"_combat"}, {"player", "companion", "INLIMBO"})
    
    -- Apply damage to each entity
    for _, ent in ipairs(ents) do
        if ent.components.combat and ent ~= inst and not inst.dash_hit_targets[ent] then
            local damage = inst.components.weapon.damage * 0.8 -- Dash attacks do 80% damage
            ent.components.combat:GetAttacked(inst, damage)
            
            -- Mark as hit to prevent multiple hits
            inst.dash_hit_targets[ent] = true
            
            -- Spawn hit effect
            local fx = SpawnPrefab("sparks")
            if fx then
                fx.Transform:SetPosition(ent.Transform:GetWorldPosition())
            end
        end
    end
end

-- Function called when the weapon is equipped
local function onequip(inst, owner)
    owner.AnimState:OverrideSymbol("swap_object", "swap_dualblade", "swap_dualblade")
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
    
    -- Add the spin and dash attack functions to the owner
    owner.DoSpinDamage = DoSpinDamage
    owner.DoDashDamage = DoDashDamage
    
    -- Initialize dash hit tracking
    owner.dash_hit_targets = {}
    
    -- Add special attack state handlers if enabled
    if inst.enable_special_attacks then
        -- Add the state graph to the player
        if owner.sg and owner.sg.sg.states.spin_attack == nil then
            -- Add spin attack state
            owner.sg.sg.states.spin_attack = require("stategraphs/SGdualblade").states.spin_attack
            
            -- Add dash attack state
            owner.sg.sg.states.dash_attack = require("stategraphs/SGdualblade").states.dash_attack
        end
    end
end

-- Function called when the weapon is unequipped
local function onunequip(inst, owner)
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
    
    -- Remove the special attack functions
    owner.DoSpinDamage = nil
    owner.DoDashDamage = nil
    owner.dash_hit_targets = nil
    
    -- We don't remove the states as they might be in use by other weapons
end

-- Main function to create the dual blade
local function fn()
    -- Create the entity
    local inst = CreateEntity()

    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddNetwork()

    -- Set up physics
    MakeInventoryPhysics(inst)

    -- Set up animation
    inst.AnimState:SetBank("dualblade")
    inst.AnimState:SetBuild("dualblade")
    inst.AnimState:PlayAnimation("idle")

    -- Add tags
    inst:AddTag("sharp")
    inst:AddTag("weapon")
    inst:AddTag("dualblade")

    -- Make the entity pristine for networking
    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end

    -- Get configuration options
    inst.attack_damage = GetModConfigData("attack_damage")
    inst.enable_special_attacks = GetModConfigData("enable_special_attacks")

    -- Add components
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.imagename = "dualblade"
    inst.components.inventoryitem.atlasname = "images/inventoryimages/dualblade.xml"

    -- Make it work as a weapon
    inst:AddComponent("weapon")
    inst.components.weapon:SetDamage(inst.attack_damage)
    
    -- Add durability
    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(200)
    inst.components.finiteuses:SetUses(200)
    inst.components.finiteuses:SetOnFinished(inst.Remove)
    
    -- Make it inspectable
    inst:AddComponent("inspectable")

    -- Make it equippable
    inst:AddComponent("equippable")
    inst.components.equippable:SetOnEquip(onequip)
    inst.components.equippable:SetOnUnequip(onunequip)

    return inst
end

-- Register the prefab
return Prefab("dualblade", fn, assets)
```

## Step 5: Create the modmain.lua File

```lua
-- Import globals into the environment
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Add asset files
Assets = {
    -- Animations
    Asset("ANIM", "anim/dualblade.zip"),
    Asset("ANIM", "anim/swap_dualblade.zip"),
    
    -- Inventory images
    Asset("IMAGE", "images/inventoryimages/dualblade.tex"),
    Asset("ATLAS", "images/inventoryimages/dualblade.xml"),
}

-- Register prefabs
PrefabFiles = {
    "dualblade",
}

-- Add custom strings
STRINGS.NAMES.DUALBLADE = "Dual Blade"
STRINGS.RECIPE_DESC.DUALBLADE = "A swift weapon with special attacks."
STRINGS.CHARACTERS.GENERIC.DESCRIBE.DUALBLADE = "Two blades are better than one."

-- Add crafting recipe for the dual blade
AddRecipe("dualblade", 
    {Ingredient("goldnugget", 4), Ingredient("flint", 2), Ingredient("twigs", 2)}, 
    GLOBAL.RECIPETABS.WAR,  -- Add to War tab
    GLOBAL.TECH.SCIENCE_TWO,  -- Requires Alchemy Engine
    nil, nil, nil, nil, nil,  
    "images/inventoryimages/dualblade.xml")

-- Add custom actions for special attacks
local SPIN_ATTACK = Action({priority=10})
SPIN_ATTACK.id = "SPIN_ATTACK"
SPIN_ATTACK.str = "Spin Attack"
SPIN_ATTACK.fn = function(act)
    if act.doer and act.doer.sg and act.doer.sg.GoToState then
        -- Check if the player has a dual blade equipped
        local equipped = act.doer.components.inventory:GetEquippedItem(GLOBAL.EQUIPSLOTS.HANDS)
        if equipped and equipped:HasTag("dualblade") then
            act.doer.sg:GoToState("spin_attack")
            return true
        end
    end
    return false
end

local DASH_ATTACK = Action({priority=10})
DASH_ATTACK.id = "DASH_ATTACK"
DASH_ATTACK.str = "Dash Attack"
DASH_ATTACK.fn = function(act)
    if act.doer and act.doer.sg and act.doer.sg.GoToState then
        -- Check if the player has a dual blade equipped
        local equipped = act.doer.components.inventory:GetEquippedItem(GLOBAL.EQUIPSLOTS.HANDS)
        if equipped and equipped:HasTag("dualblade") then
            -- Clear dash hit targets
            act.doer.dash_hit_targets = {}
            act.doer.sg:GoToState("dash_attack")
            return true
        end
    end
    return false
end

-- Register the actions
AddAction(SPIN_ATTACK)
AddAction(DASH_ATTACK)

-- Add key bindings for special attacks
local KEY_R = 114 -- R key for spin attack
local KEY_F = 102 -- F key for dash attack

-- Add key handlers
TheInput:AddKeyDownHandler(KEY_R, function()
    if ThePlayer and ThePlayer:HasTag("player") then
        local equipped = ThePlayer.components.inventory:GetEquippedItem(GLOBAL.EQUIPSLOTS.HANDS)
        if equipped and equipped:HasTag("dualblade") then
            SendRPCToServer(RPC.DoAction, ACTIONS.SPIN_ATTACK.code)
        end
    end
end)

TheInput:AddKeyDownHandler(KEY_F, function()
    if ThePlayer and ThePlayer:HasTag("player") then
        local equipped = ThePlayer.components.inventory:GetEquippedItem(GLOBAL.EQUIPSLOTS.HANDS)
        if equipped and equipped:HasTag("dualblade") then
            SendRPCToServer(RPC.DoAction, ACTIONS.DASH_ATTACK.code)
        end
    end
end)

-- Add the actions to the player action component
AddComponentAction("SCENE", "playeractionpicker", function(inst, doer, actions, right)
    if doer:HasTag("player") and right and doer.components.inventory then
        local equipped = doer.components.inventory:GetEquippedItem(GLOBAL.EQUIPSLOTS.HANDS)
        if equipped and equipped:HasTag("dualblade") then
            table.insert(actions, ACTIONS.SPIN_ATTACK)
            table.insert(actions, ACTIONS.DASH_ATTACK)
        end
    end
end)
```

## Step 6: Create the Animations

For a complete mod, you'll need to create these animation files:

1. **Weapon Animation**: `anim/dualblade.zip`
   - This contains the weapon's animations when not equipped
   - Include idle, attack, and special attack animations

2. **Equipped Animation**: `anim/swap_dualblade.zip`
   - This contains the animations for when the weapon is equipped
   - Should include the "swap_dualblade" symbol

3. **Inventory Image**: `images/inventoryimages/dualblade.tex` and `dualblade.xml`
   - 64x64 pixel image for the inventory

## Step 7: Testing Your State Graph

1. Launch Don't Starve Together
2. Enable your mod in the Mods menu
3. Start a new game
4. Craft the Dual Blade (requires gold nuggets, flint, and twigs)
5. Test the state graph by:
   - Attacking normally with the weapon
   - Using the R key to perform a spin attack
   - Using the F key to perform a dash attack
   - Observing the different animations and effects

## Understanding State Graphs

State graphs in Don't Starve Together control entity behavior through a series of states and transitions:

### State Components

Each state typically includes:

- **Name**: Unique identifier for the state
- **Tags**: Metadata used to query state properties (e.g., "busy", "attack")
- **onenter**: Function called when entering the state
- **onexit**: Function called when exiting the state
- **onupdate**: Function called each frame while in the state
- **timeline**: Sequence of timed events during the state
- **events**: Event handlers that can trigger state transitions

### Common State Tags

- **idle**: Entity is not performing any action
- **busy**: Entity cannot perform other actions
- **attack**: Entity is attacking
- **moving**: Entity is moving
- **canrotate**: Entity can change facing direction

### Animation Integration

States are tightly coupled with animations:

- `PlayAnimation(name, [loop])`: Play a specific animation
- `PushAnimation(name, [loop])`: Queue an animation to play after the current one
- `GetCurrentAnimationLength()`: Get the duration of the current animation
- `IsCurrentAnimation(name)`: Check if a specific animation is playing

### Timeline Events

Timeline events execute at specific frames during an animation:

```lua
timeline = {
    TimeEvent(10*FRAMES, function(inst)
        -- Do something at frame 10
    end),
    TimeEvent(20*FRAMES, function(inst)
        -- Do something at frame 20
    end),
}
```

### Event Handlers

Event handlers respond to events like animation completion:

```lua
events = {
    EventHandler("animover", function(inst)
        -- Do something when the animation ends
    end),
    EventHandler("attacked", function(inst)
        -- Do something when attacked
    end),
}
```

## Customization Options

Here are some ways to enhance your state graph:

### Add Combo Attacks

```lua
-- In your state graph, add a combo system
State{
    name = "attack1",
    tags = {"attack", "busy"},
    
    onenter = function(inst)
        inst.AnimState:PlayAnimation("atk1")
        inst.sg.statemem.combo = true
    end,
    
    timeline = {
        TimeEvent(10*FRAMES, function(inst)
            inst:PerformBufferedAction()
        end),
    },
    
    events = {
        EventHandler("animover", function(inst)
            if inst.sg.statemem.combo and 
               inst:IsActionValid(ACTIONS.ATTACK) then
                inst.sg:GoToState("attack2")
            else
                inst.sg:GoToState("idle")
            end
        end),
    },
},

State{
    name = "attack2",
    tags = {"attack", "busy"},
    
    onenter = function(inst)
        inst.AnimState:PlayAnimation("atk2")
        inst.sg.statemem.combo = true
    end,
    
    timeline = {
        TimeEvent(10*FRAMES, function(inst)
            inst:PerformBufferedAction()
        end),
    },
    
    events = {
        EventHandler("animover", function(inst)
            if inst.sg.statemem.combo and 
               inst:IsActionValid(ACTIONS.ATTACK) then
                inst.sg:GoToState("attack3")
            else
                inst.sg:GoToState("idle")
            end
        end),
    },
},

State{
    name = "attack3",
    tags = {"attack", "busy"},
    
    onenter = function(inst)
        inst.AnimState:PlayAnimation("atk3")
    end,
    
    timeline = {
        TimeEvent(10*FRAMES, function(inst)
            inst:PerformBufferedAction()
        end),
    },
    
    events = {
        EventHandler("animover", function(inst)
            inst.sg:GoToState("idle")
        end),
    },
},
```

### Add Status Effects to Attacks

```lua
-- In your attack timeline, add status effects
TimeEvent(10*FRAMES, function(inst)
    inst:PerformBufferedAction()
    
    -- Apply status effect to target
    local target = inst.components.combat.target
    if target and target.components.health and not target.components.health:IsDead() then
        if target.components.freezable then
            target.components.freezable:AddColdness(1)
        end
        
        if target.components.locomotor then
            target.components.locomotor:SetExternalSpeedMultiplier(inst, "dualblade_slow", 0.7)
            
            -- Remove slow after 3 seconds
            target:DoTaskInTime(3, function()
                if target.components.locomotor then
                    target.components.locomotor:RemoveExternalSpeedMultiplier(inst, "dualblade_slow")
                end
            end)
        end
    end
end),
```

### Add Charged Attacks

```lua
-- Add a charged attack state
State{
    name = "charge_attack",
    tags = {"attack", "busy", "charging"},
    
    onenter = function(inst)
        inst.components.locomotor:Stop()
        inst.AnimState:PlayAnimation("charge")
        
        -- Start charge timer
        inst.sg.statemem.charge_time = 0
        inst.sg.statemem.max_charge = 3 -- Max 3 seconds charge
    end,
    
    onupdate = function(inst, dt)
        -- Increase charge time
        inst.sg.statemem.charge_time = inst.sg.statemem.charge_time + dt
        
        -- Visual feedback based on charge level
        local charge_level = math.min(inst.sg.statemem.charge_time / inst.sg.statemem.max_charge, 1)
        
        -- Spawn particles based on charge level
        if math.random() < charge_level * 0.3 then
            local fx = SpawnPrefab("sparks")
            if fx then
                local x, y, z = inst.Transform:GetWorldPosition()
                local angle = math.random() * 2 * PI
                local range = 0.5 + math.random() * 0.5
                fx.Transform:SetPosition(x + math.cos(angle) * range, y, z + math.sin(angle) * range)
            end
        end
    end,
    
    events = {
        -- Release charge when button is released
        EventHandler("unequip", function(inst)
            inst.sg:GoToState("idle")
        end),
        
        EventHandler("charge_released", function(inst)
            -- Calculate damage multiplier based on charge time
            local charge_level = math.min(inst.sg.statemem.charge_time / inst.sg.statemem.max_charge, 1)
            inst.sg.statemem.charge_level = charge_level
            
            -- Go to release state
            inst.sg:GoToState("charge_release", {charge_level = charge_level})
        end),
    },
},

State{
    name = "charge_release",
    tags = {"attack", "busy"},
    
    onenter = function(inst, data)
        inst.components.locomotor:Stop()
        inst.AnimState:PlayAnimation("charge_release")
        
        -- Get charge level from previous state
        local charge_level = data and data.charge_level or 0.5
        
        -- Play sound with volume based on charge
        inst.SoundEmitter:PlaySound("dontstarve/wilson/attack_nightsword", nil, charge_level)
        
        -- Do damage based on charge level
        local damage_mult = 1 + charge_level * 2 -- 1x to 3x damage
        local base_damage = inst.components.combat:GetWeaponDamage()
        
        -- Find targets in front of player
        local x, y, z = inst.Transform:GetWorldPosition()
        local angle = inst.Transform:GetRotation() * DEGREES
        local reach = 3 + charge_level * 2 -- Longer reach with higher charge
        
        -- Calculate forward position
        local offset_x = math.cos(angle) * reach
        local offset_z = -math.sin(angle) * reach
        
        -- Spawn charge effect
        local fx = SpawnPrefab("cane_victorian_fx")
        if fx then
            fx.Transform:SetPosition(x + offset_x * 0.5, y, z + offset_z * 0.5)
            fx.Transform:SetScale(charge_level, charge_level, charge_level)
        end
        
        -- Find and damage entities
        local targets = TheSim:FindEntities(x + offset_x, y, z + offset_z, 2 + charge_level, {"_combat"}, {"player", "companion", "INLIMBO"})
        for _, target in ipairs(targets) do
            if target.components.combat then
                target.components.combat:GetAttacked(inst, base_damage * damage_mult)
            end
        end
    end,
    
    events = {
        EventHandler("animover", function(inst)
            inst.sg:GoToState("idle")
        end),
    },
},
```

## Common Issues and Solutions

### Problem: State not transitioning correctly
**Solution**: Check your event handlers and ensure animations are playing properly

### Problem: Animations not playing
**Solution**: Verify animation names match exactly what's in your animation files

### Problem: Actions not triggering states
**Solution**: Make sure action handlers are properly connected to your state graph

### Problem: Visual effects not appearing
**Solution**: Check that prefabs for effects exist and positions are calculated correctly

### Problem: Collision detection issues
**Solution**: Use debug visualization to see attack ranges and adjust as needed:

```lua
-- Add this to your attack function for debugging
if CHEATS_ENABLED then
    local x, y, z = inst.Transform:GetWorldPosition()
    local radius = 2 -- Attack radius
    
    -- Draw debug circle
    for i = 1, 16 do
        local angle = i * (2 * PI / 16)
        local fx = SpawnPrefab("minimap_firefly_marker")
        if fx then
            fx.Transform:SetPosition(
                x + radius * math.cos(angle),
                y,
                z + radius * math.sin(angle)
            )
            fx:DoTaskInTime(1, fx.Remove)
        end
    end
end
```

## Next Steps

Now that you've created a custom state graph, you can:

1. **Add More States**: Create additional attack patterns and special moves
2. **Improve Visual Effects**: Add particle effects and screen shakes
3. **Add Sound Effects**: Create custom sounds for each state
4. **Create Unique Animations**: Design completely custom animations for your weapon

For more advanced state graph usage, check out the [State Graph System](../stategraphs/index.md) documentation to learn about the full capabilities of the system. 
