---
id: custom-component
title: Custom Component
sidebar_position: 5
last_updated: 2023-07-06
---
*Last Update: 2023-07-06*
# Creating a Custom Component

This tutorial walks through creating a custom component for Don't Starve Together. We'll create a "magicuser" component that allows entities to cast spells and manage magical energy.

## Project Overview

Our custom component will:
- Track magical energy (mana)
- Provide functions for casting spells
- Include events for mana changes
- Support different spell types
- Add visual effects for spell casting

## Step 1: Set Up the Mod Structure

Create these folders and files:

```
magic_component_mod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   ├── components/
│   │   └── magicuser.lua
│   └── prefabs/
│       ├── magicrobe.lua
│       └── magicstaff.lua
└── images/
    └── inventoryimages/
        ├── magicrobe.tex
        ├── magicrobe.xml
        ├── magicstaff.tex
        └── magicstaff.xml
```

## Step 2: Create the modinfo.lua File

```lua
name = "Magic Component"
description = "Adds a custom magic component for spell casting"
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
    "magic",
    "gameplay"
}

-- Configuration options
configuration_options = {
    {
        name = "mana_regen_rate",
        label = "Mana Regeneration Rate",
        options = {
            {description = "Slow", data = 1},
            {description = "Normal", data = 2},
            {description = "Fast", data = 3}
        },
        default = 2
    },
    {
        name = "max_mana",
        label = "Maximum Mana",
        options = {
            {description = "Low (50)", data = 50},
            {description = "Medium (100)", data = 100},
            {description = "High (200)", data = 200}
        },
        default = 100
    }
}
```

## Step 3: Create the magicuser Component

Create `scripts/components/magicuser.lua`:

```lua
local MagicUser = Class(function(self, inst)
    self.inst = inst
    
    -- Initialize mana values
    self.max = 100
    self.current = self.max
    
    -- Mana regeneration rate (per second)
    self.rate = 2
    
    -- Track if the user is casting
    self.casting = false
    
    -- List of known spells
    self.known_spells = {}
    
    -- Start mana regeneration
    self:StartRegeneration()
end)

-- Set the maximum mana
function MagicUser:SetMaxMana(amount)
    self.max = amount
    self.current = math.min(self.current, self.max)
    self.inst:PushEvent("magicusermanachanged", {percent = self:GetPercent()})
end

-- Get the current mana percentage
function MagicUser:GetPercent()
    return self.current / self.max
end

-- Set the mana percentage
function MagicUser:SetPercent(percent)
    self.current = math.clamp(percent * self.max, 0, self.max)
    self.inst:PushEvent("magicusermanachanged", {percent = self:GetPercent()})
end

-- Change the mana amount
function MagicUser:DoDelta(delta)
    local old = self.current
    self.current = math.clamp(self.current + delta, 0, self.max)
    
    if old ~= self.current then
        self.inst:PushEvent("magicusermanachanged", {percent = self:GetPercent()})
    end
    
    return self.current - old
end

-- Start mana regeneration
function MagicUser:StartRegeneration()
    if self.regen_task ~= nil then
        self.regen_task:Cancel()
    end
    
    self.regen_task = self.inst:DoPeriodicTask(1, function() 
        if not self.casting and self.current < self.max then
            self:DoDelta(self.rate)
        end
    end)
end

-- Stop mana regeneration
function MagicUser:StopRegeneration()
    if self.regen_task ~= nil then
        self.regen_task:Cancel()
        self.regen_task = nil
    end
end

-- Add a spell to the known spells
function MagicUser:LearnSpell(spell_name, mana_cost, cast_fn)
    self.known_spells[spell_name] = {
        mana_cost = mana_cost,
        cast_fn = cast_fn
    }
    
    self.inst:PushEvent("magicuserlearnedspell", {spell = spell_name})
    
    return true
end

-- Check if the user knows a spell
function MagicUser:KnowsSpell(spell_name)
    return self.known_spells[spell_name] ~= nil
end

-- Cast a spell
function MagicUser:CastSpell(spell_name, target, position)
    if not self:KnowsSpell(spell_name) then
        return false, "UNKNOWN_SPELL"
    end
    
    local spell = self.known_spells[spell_name]
    
    if self.current < spell.mana_cost then
        return false, "NOT_ENOUGH_MANA"
    end
    
    -- Start casting
    self.casting = true
    
    -- Use mana
    self:DoDelta(-spell.mana_cost)
    
    -- Create visual effect
    local fx = SpawnPrefab("statue_transition_2")
    if fx then
        fx.Transform:SetPosition(self.inst.Transform:GetWorldPosition())
        fx:ListenForEvent("animover", fx.Remove)
    end
    
    -- Call the spell function
    local success = spell.cast_fn(self.inst, target, position)
    
    -- End casting after a short delay
    self.inst:DoTaskInTime(0.5, function()
        self.casting = false
    end)
    
    -- Trigger event
    self.inst:PushEvent("magicusercastspell", {
        spell = spell_name,
        success = success,
        target = target,
        position = position
    })
    
    return success
end

-- Save/Load
function MagicUser:OnSave()
    local data = {
        current = self.current,
        max = self.max,
        rate = self.rate,
        known_spells = {}
    }
    
    -- Save known spell names (not the functions)
    for spell_name, _ in pairs(self.known_spells) do
        table.insert(data.known_spells, spell_name)
    end
    
    return data
end

function MagicUser:OnLoad(data)
    if data then
        self.current = data.current or self.max
        self.max = data.max or 100
        self.rate = data.rate or 2
        
        -- Known spells will need to be re-added by the mod
    end
end

return MagicUser
```

## Step 4: Create the modmain.lua File

```lua
-- Import globals into the environment
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Add asset files
Assets = {
    -- Inventory images
    Asset("IMAGE", "images/inventoryimages/magicrobe.tex"),
    Asset("ATLAS", "images/inventoryimages/magicrobe.xml"),
    Asset("IMAGE", "images/inventoryimages/magicstaff.tex"),
    Asset("ATLAS", "images/inventoryimages/magicstaff.xml"),
}

-- Register prefabs
PrefabFiles = {
    "magicrobe",
    "magicstaff",
}

-- Add custom strings
STRINGS.NAMES.MAGICROBE = "Magic Robe"
STRINGS.RECIPE_DESC.MAGICROBE = "Increases mana regeneration."
STRINGS.CHARACTERS.GENERIC.DESCRIBE.MAGICROBE = "I feel more magical already."

STRINGS.NAMES.MAGICSTAFF = "Magic Staff"
STRINGS.RECIPE_DESC.MAGICSTAFF = "Cast powerful spells."
STRINGS.CHARACTERS.GENERIC.DESCRIBE.MAGICSTAFF = "It's crackling with arcane energy."

-- Get configuration options
local mana_regen_rate = GetModConfigData("mana_regen_rate")
local max_mana = GetModConfigData("max_mana")

-- Register the custom component
AddComponentPostInit("playercontroller", function(self)
    -- Add a helper function to the player controller to cast spells
    self.CastSpell = function(self, spell_name, target, pos)
        if self.inst.components.magicuser then
            return self.inst.components.magicuser:CastSpell(spell_name, target, pos)
        end
        return false, "NO_MAGIC_USER"
    end
end)

-- Add the magic component to players
AddPlayerPostInit(function(inst)
    -- Add the magicuser component
    if not inst.components.magicuser then
        inst:AddComponent("magicuser")
        
        -- Apply configuration options
        inst.components.magicuser:SetMaxMana(max_mana)
        inst.components.magicuser.rate = mana_regen_rate
        
        -- Add basic spells
        inst.components.magicuser:LearnSpell("light", 10, function(caster, target, pos)
            -- Create a light source
            local light = SpawnPrefab("campfirefire")
            light.Transform:SetPosition(pos:Get())
            light:DoTaskInTime(30, light.Remove)
            return true
        end)
        
        inst.components.magicuser:LearnSpell("heal", 30, function(caster, target, pos)
            -- Heal the caster
            if caster.components.health then
                caster.components.health:DoDelta(20)
                return true
            end
            return false
        end)
    end
    
    -- Add a mana badge to the HUD
    if not inst.HUD then return end
    
    inst:ListenForEvent("magicusermanachanged", function(inst, data)
        if inst.HUD.controls.status.mana then
            inst.HUD.controls.status.mana:SetPercent(data.percent, inst.components.magicuser.max)
        end
    end)
end)

-- Add a mana badge to the status displays
AddClassPostConstruct("widgets/statusdisplays", function(self)
    -- Create a mana badge
    local ManaBadge = require "widgets/badge"
    self.mana = self:AddChild(ManaBadge(nil, nil, nil, "mana"))
    self.mana:SetPosition(0, -40, 0)
    self.mana:SetPercent(1, 100)
    self.mana:SetBG("status_meter_bg.tex")
    self.mana:SetScale(1, 1, 1)
    self.mana:SetImageNormalColour(0, 0.5, 1, 1)  -- Blue color for mana
    
    -- Position the badge
    self.mana:SetPosition(-100, -40, 0)
    
    -- Update the OnUpdate function to include mana
    local oldOnUpdate = self.OnUpdate
    self.OnUpdate = function(self, dt)
        oldOnUpdate(self, dt)
        
        -- Update mana display
        if self.owner and self.owner.components.magicuser then
            self.mana:SetPercent(self.owner.components.magicuser:GetPercent(), self.owner.components.magicuser.max)
        end
    end
end)

-- Add crafting recipes for magic items
AddRecipe("magicrobe", 
    {Ingredient("silk", 6), Ingredient("bluegem", 2)}, 
    GLOBAL.RECIPETABS.DRESS,  -- Add to Dress tab
    GLOBAL.TECH.SCIENCE_TWO,  -- Requires Alchemy Engine
    nil, nil, nil, nil, nil,  
    "images/inventoryimages/magicrobe.xml")
    
AddRecipe("magicstaff", 
    {Ingredient("twigs", 2), Ingredient("bluegem", 1), Ingredient("purplegem", 1)}, 
    GLOBAL.RECIPETABS.MAGIC,  -- Add to Magic tab
    GLOBAL.TECH.MAGIC_TWO,    -- Requires Prestihatitator
    nil, nil, nil, nil, nil,  
    "images/inventoryimages/magicstaff.xml")
```

## Step 5: Create the Magic Robe Prefab

Create `scripts/prefabs/magicrobe.lua`:

```lua
local assets = {
    Asset("ANIM", "anim/armor_onemanband.zip"),  -- Reuse onemanband animation
    
    Asset("IMAGE", "images/inventoryimages/magicrobe.tex"),
    Asset("ATLAS", "images/inventoryimages/magicrobe.xml"),
}

-- Function called when the robe is equipped
local function onequip(inst, owner)
    owner.AnimState:OverrideSymbol("swap_body", "armor_onemanband", "swap_body")
    
    -- Apply a blue tint to the robe
    owner.AnimState:SetMultColour(0.8, 0.8, 1, 1)
    
    -- Increase mana regeneration when equipped
    if owner.components.magicuser then
        owner.components.magicuser.rate = owner.components.magicuser.rate * 2
    end
    
    -- Add a magical effect
    if not inst.fx_task then
        inst.fx_task = inst:DoPeriodicTask(3, function()
            local fx = SpawnPrefab("sparklefx")
            if fx then
                fx.Transform:SetPosition(owner.Transform:GetWorldPosition())
                fx.Transform:SetScale(0.5, 0.5, 0.5)
            end
        end)
    end
end

-- Function called when the robe is unequipped
local function onunequip(inst, owner)
    owner.AnimState:ClearOverrideSymbol("swap_body")
    owner.AnimState:SetMultColour(1, 1, 1, 1)
    
    -- Reset mana regeneration
    if owner.components.magicuser then
        owner.components.magicuser.rate = owner.components.magicuser.rate / 2
    end
    
    -- Remove magical effect
    if inst.fx_task then
        inst.fx_task:Cancel()
        inst.fx_task = nil
    end
end

-- Main function to create the magic robe
local function fn()
    -- Create the entity
    local inst = CreateEntity()

    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    -- Set up physics
    MakeInventoryPhysics(inst)

    -- Set up animation
    inst.AnimState:SetBank("armor_onemanband")
    inst.AnimState:SetBuild("armor_onemanband")
    inst.AnimState:PlayAnimation("anim")
    
    -- Apply a blue tint to the robe
    inst.AnimState:SetMultColour(0.8, 0.8, 1, 1)

    -- Add tags
    inst:AddTag("magical")

    -- Make the entity pristine for networking
    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end

    -- Add components
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.imagename = "magicrobe"
    inst.components.inventoryitem.atlasname = "images/inventoryimages/magicrobe.xml"

    -- Make it inspectable
    inst:AddComponent("inspectable")

    -- Make it equippable
    inst:AddComponent("equippable")
    inst.components.equippable.equipslot = EQUIPSLOTS.BODY
    inst.components.equippable:SetOnEquip(onequip)
    inst.components.equippable:SetOnUnequip(onunequip)

    return inst
end

-- Register the prefab
return Prefab("magicrobe", fn, assets)
```

## Step 6: Create the Magic Staff Prefab

Create `scripts/prefabs/magicstaff.lua`:

```lua
local assets = {
    Asset("ANIM", "anim/staffs.zip"),  -- Reuse staff animation
    Asset("ANIM", "anim/swap_staffs.zip"),
    
    Asset("IMAGE", "images/inventoryimages/magicstaff.tex"),
    Asset("ATLAS", "images/inventoryimages/magicstaff.xml"),
}

-- Function to cast a spell when the staff is used
local function onuse(inst, target, pos)
    local owner = inst.components.inventoryitem.owner
    if not owner or not owner.components.magicuser then
        return false
    end
    
    -- Cast the selected spell
    local spell = inst.selected_spell or "light"
    return owner.components.magicuser:CastSpell(spell, target, pos)
end

-- Function called when the staff is equipped
local function onequip(inst, owner)
    owner.AnimState:OverrideSymbol("swap_object", "swap_staffs", "bluestaff")
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
    
    -- Add a light when equipped
    if inst.components.lighttweener == nil then
        inst:AddComponent("lighttweener")
        inst.components.lighttweener:StartTween(inst.entity:AddLight(), 0, 0.5, 0.5, {80/255, 120/255, 255/255}, 0, function() end)
    end
    
    -- Add a custom action for cycling spells
    if owner.components.playeractionpicker then
        local old_DoGetMouseActions = owner.components.playeractionpicker.DoGetMouseActions
        owner.components.playeractionpicker.DoGetMouseActions = function(self, ...)
            local actions = old_DoGetMouseActions(self, ...)
            
            -- Add the cycle spell action when targeting self
            if owner:HasTag("player") and owner.components.magicuser then
                table.insert(actions, ACTIONS.CYCLESPELL)
            end
            
            return actions
        end
    end
end

-- Function called when the staff is unequipped
local function onunequip(inst, owner)
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
    
    -- Remove the light when unequipped
    if inst.components.lighttweener then
        inst:RemoveComponent("lighttweener")
        inst.entity:RemoveLight()
    end
    
    -- Restore original action picker
    if owner.components.playeractionpicker then
        owner.components.playeractionpicker.DoGetMouseActions = nil
    end
end

-- Main function to create the magic staff
local function fn()
    -- Create the entity
    local inst = CreateEntity()

    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    -- Set up physics
    MakeInventoryPhysics(inst)

    -- Set up animation
    inst.AnimState:SetBank("staffs")
    inst.AnimState:SetBuild("staffs")
    inst.AnimState:PlayAnimation("bluestaff")
    
    -- Add tags
    inst:AddTag("magicstaff")
    inst:AddTag("allow_action_on_impassable")

    -- Make the entity pristine for networking
    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end

    -- Add components
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.imagename = "magicstaff"
    inst.components.inventoryitem.atlasname = "images/inventoryimages/magicstaff.xml"

    -- Make it usable
    inst:AddComponent("spellcaster")
    inst.components.spellcaster:SetSpellFn(onuse)
    inst.components.spellcaster.canuseonpoint = true
    inst.components.spellcaster.canuseonpoint_water = true
    
    -- Default spell
    inst.selected_spell = "light"
    
    -- Add a function to cycle through spells
    inst.CycleSpell = function(inst)
        local spells = {"light", "heal"}
        local current_index = 1
        
        for i, spell in ipairs(spells) do
            if spell == inst.selected_spell then
                current_index = i
                break
            end
        end
        
        -- Move to next spell
        current_index = current_index % #spells + 1
        inst.selected_spell = spells[current_index]
        
        -- Announce the selected spell
        if inst.components.inventoryitem.owner then
            inst.components.inventoryitem.owner:PushEvent("onhighlight", {
                text = "Selected spell: " .. inst.selected_spell,
                time = 2
            })
        end
        
        return true
    end
    
    -- Make it inspectable
    inst:AddComponent("inspectable")

    -- Make it equippable
    inst:AddComponent("equippable")
    inst.components.equippable:SetOnEquip(onequip)
    inst.components.equippable:SetOnUnequip(onunequip)

    return inst
end

-- Register the prefab
return Prefab("magicstaff", fn, assets)
```

## Step 7: Add a Custom Action for Cycling Spells

Add this to the end of your `modmain.lua`:

```lua
-- Add a custom action for cycling spells
local CYCLESPELL = Action({priority=10})
CYCLESPELL.id = "CYCLESPELL"
CYCLESPELL.str = "Cycle Spell"
CYCLESPELL.fn = function(act)
    local staff = act.doer.components.inventory:FindItem(function(item)
        return item:HasTag("magicstaff") and item.components.equippable and item.components.equippable:IsEquipped()
    end)
    
    if staff and staff.CycleSpell then
        return staff:CycleSpell()
    end
    
    return false
end

AddAction(CYCLESPELL)

-- Add the action handler
AddComponentAction("INVENTORY", "inventory", function(inst, doer, actions, right)
    if doer:HasTag("player") and right and inst == doer then
        local staff = doer.components.inventory:FindItem(function(item)
            return item:HasTag("magicstaff") and item.components.equippable and item.components.equippable:IsEquipped()
        end)
        
        if staff then
            table.insert(actions, ACTIONS.CYCLESPELL)
        end
    end
end)

-- Add the action to the controls
AddModRPCHandler("MagicComponent", "CycleSpell", function(player)
    local staff = player.components.inventory:FindItem(function(item)
        return item:HasTag("magicstaff") and item.components.equippable and item.components.equippable:IsEquipped()
    end)
    
    if staff and staff.CycleSpell then
        staff:CycleSpell()
    end
end)

-- Add the key binding
local KEY_C = 99
TheInput:AddKeyDownHandler(KEY_C, function()
    if ThePlayer and ThePlayer:HasTag("player") then
        SendModRPCToServer(MOD_RPC["MagicComponent"]["CycleSpell"])
    end
end)
```

## Step 8: Testing Your Component

1. Launch Don't Starve Together
2. Enable your mod in the Mods menu
3. Start a new game
4. Test the component by:
   - Crafting and equipping the Magic Robe to increase mana regeneration
   - Crafting and equipping the Magic Staff to cast spells
   - Using the "C" key to cycle between spells
   - Casting spells with the staff
   - Watching your mana bar decrease and regenerate

## Extending the Component

Here are some ways to enhance your magic component:

### Add More Spell Types

```lua
-- Add a teleport spell
inst.components.magicuser:LearnSpell("teleport", 50, function(caster, target, pos)
    if caster.Physics and pos then
        -- Create teleport effect at start position
        local fx1 = SpawnPrefab("collapse_small")
        fx1.Transform:SetPosition(caster.Transform:GetWorldPosition())
        
        -- Teleport the player
        caster.Physics:Teleport(pos.x, pos.y, pos.z)
        
        -- Create teleport effect at end position
        local fx2 = SpawnPrefab("collapse_small")
        fx2.Transform:SetPosition(pos:Get())
        
        return true
    end
    return false
end)
```

### Add Spell Cooldowns

Modify the magicuser component to track cooldowns:

```lua
-- Add to the component initialization
self.cooldowns = {}

-- Modify LearnSpell to include cooldown
function MagicUser:LearnSpell(spell_name, mana_cost, cast_fn, cooldown)
    self.known_spells[spell_name] = {
        mana_cost = mana_cost,
        cast_fn = cast_fn,
        cooldown = cooldown or 0
    }
    
    self.cooldowns[spell_name] = 0
    
    self.inst:PushEvent("magicuserlearnedspell", {spell = spell_name})
    
    return true
end

-- Modify CastSpell to check cooldowns
function MagicUser:CastSpell(spell_name, target, position)
    if not self:KnowsSpell(spell_name) then
        return false, "UNKNOWN_SPELL"
    end
    
    local spell = self.known_spells[spell_name]
    
    if self.cooldowns[spell_name] > 0 then
        return false, "ON_COOLDOWN"
    end
    
    if self.current < spell.mana_cost then
        return false, "NOT_ENOUGH_MANA"
    end
    
    -- Start casting
    self.casting = true
    
    -- Use mana
    self:DoDelta(-spell.mana_cost)
    
    -- Set cooldown
    if spell.cooldown > 0 then
        self.cooldowns[spell_name] = spell.cooldown
        
        -- Start cooldown timer
        self.inst:DoTaskInTime(1, function()
            self:UpdateCooldowns()
        end)
    end
    
    -- Rest of the function...
end

-- Add cooldown update function
function MagicUser:UpdateCooldowns()
    local any_active = false
    
    for spell_name, time in pairs(self.cooldowns) do
        if time > 0 then
            self.cooldowns[spell_name] = time - 1
            any_active = true
        end
    end
    
    if any_active then
        self.inst:DoTaskInTime(1, function()
            self:UpdateCooldowns()
        end)
    end
end
```

### Add Spell Experience and Leveling

```lua
-- Add to component initialization
self.spell_experience = {}
self.spell_levels = {}

-- Add after successful spell cast
if success then
    -- Add experience for the spell
    if not self.spell_experience[spell_name] then
        self.spell_experience[spell_name] = 0
        self.spell_levels[spell_name] = 1
    end
    
    self.spell_experience[spell_name] = self.spell_experience[spell_name] + 1
    
    -- Check for level up
    local xp_needed = self.spell_levels[spell_name] * 5
    if self.spell_experience[spell_name] >= xp_needed then
        self.spell_levels[spell_name] = self.spell_levels[spell_name] + 1
        self.spell_experience[spell_name] = 0
        
        -- Spell got more powerful
        self.inst:PushEvent("magicuserspelllevelup", {
            spell = spell_name,
            level = self.spell_levels[spell_name]
        })
    end
end
```

## Common Issues and Solutions

### Problem: Component not being added to players
**Solution**: Make sure you're using AddPlayerPostInit correctly and check for errors in the component initialization

### Problem: Mana bar not showing up
**Solution**: Check that you've properly added the badge to the status displays and connected it to the component

### Problem: Spells not casting
**Solution**: Verify that the spell functions are set up correctly and the conditions for casting are met

### Problem: Errors when equipping/unequipping items
**Solution**: Add error checking to your equip/unequip functions:

```lua
local function onequip(inst, owner)
    if not owner or not owner.AnimState then
        return
    end
    
    -- Rest of the function...
end
```

## Next Steps

Now that you've created a custom component, you can:

1. **Create More Spells**: Add a variety of spell effects for different situations
2. **Add Magic Classes**: Create different magic specializations with unique spells
3. **Create Magic Monsters**: Add enemies that use your magic component
4. **Add Magic Structures**: Create buildings that interact with the magic system
5. **Create a Magic Skill Tree**: Develop a progression system for learning new spells

For more advanced component creation, check out the [Component System](../core/component-system.md) documentation to learn about the component lifecycle and networking. 
