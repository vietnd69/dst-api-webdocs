---
id: complex-item
title: Complex Item with Multiple Components
sidebar_position: 3
---

# Creating a Complex Item with Multiple Components

This tutorial demonstrates how to create a more sophisticated item that uses multiple components to achieve complex behaviors. We'll create a "Soul Lantern" - a magical lantern that harvests souls from defeated enemies to power itself.

## Project Overview

Our Soul Lantern will have these features:
- Provides light when equipped
- Harvests "souls" from nearby defeated enemies
- Stores souls as fuel
- Provides sanity aura based on stored souls
- Changes appearance based on fuel level
- Can be recharged by defeating enemies

## Components We'll Use

This item will use several components working together:
- `equippable` - To allow the item to be equipped
- `inventoryitem` - To allow the item to be picked up and stored
- `fueled` - To manage the soul energy level
- `sanityaura` - To provide sanity benefits based on fuel level
- `lightsource` - To provide illumination
- `weapon` - To allow combat usage
- `finiteuses` - To manage durability when used as a weapon
- `inspectable` - To provide examination text

## Step 1: Set Up the Mod Structure

Create these folders and files:

```
soul_lantern_mod/
├── modinfo.lua
├── modmain.lua
├── scripts/
│   └── prefabs/
│       └── soul_lantern.lua
└── images/
    └── inventoryimages/
        ├── soul_lantern.png
        └── soul_lantern.xml
```

## Step 2: Create the modinfo.lua File

```lua
name = "Soul Lantern"
description = "A lantern that harvests souls from the fallen to power itself."
author = "Your Name"
version = "1.0.0"

-- Compatible with Don't Starve Together
dst_compatible = true
dont_starve_compatible = false

-- This mod is required on clients
all_clients_require_mod = true
client_only_mod = false

-- Icon displayed in the server list
icon_atlas = "modicon.xml"
icon = "modicon.tex"

-- Tags that describe your mod
server_filter_tags = {
    "item",
    "magic"
}

-- Configuration options
configuration_options = {
    {
        name = "soul_value",
        label = "Soul Energy Value",
        options = {
            {description = "Low", data = 10},
            {description = "Medium", data = 20},
            {description = "High", data = 30}
        },
        default = 20
    },
    {
        name = "max_fuel",
        label = "Maximum Soul Capacity",
        options = {
            {description = "Small", data = 100},
            {description = "Medium", data = 200},
            {description = "Large", data = 300}
        },
        default = 200
    },
    {
        name = "weapon_damage",
        label = "Weapon Damage",
        options = {
            {description = "Low", data = 17},
            {description = "Medium", data = 27},
            {description = "High", data = 37}
        },
        default = 27
    }
}
```

## Step 3: Create the modmain.lua File

```lua
-- Import globals into the environment
GLOBAL.setmetatable(env, {__index = function(t, k) return GLOBAL.rawget(GLOBAL, k) end})

-- Add asset files
Assets = {
    -- Inventory image
    Asset("IMAGE", "images/inventoryimages/soul_lantern.tex"),
    Asset("ATLAS", "images/inventoryimages/soul_lantern.xml"),
}

-- Register the prefab
PrefabFiles = {
    "soul_lantern",
}

-- Add recipe to craft the soul lantern
AddRecipe("soul_lantern", 
    {
        Ingredient("boards", 2),
        Ingredient("nightmarefuel", 3),
        Ingredient("gears", 1)
    }, 
    GLOBAL.RECIPETABS.MAGIC, 
    GLOBAL.TECH.MAGIC_TWO, 
    nil, nil, nil, nil, nil, 
    "images/inventoryimages/soul_lantern.xml", "soul_lantern.tex")

-- Add custom strings
GLOBAL.STRINGS.NAMES.SOUL_LANTERN = "Soul Lantern"
GLOBAL.STRINGS.CHARACTERS.GENERIC.DESCRIBE.SOUL_LANTERN = {
    EMPTY = "It hungers for souls.",
    LOW = "It contains a few captured souls.",
    MEDIUM = "The souls inside are quite restless.",
    FULL = "It's brimming with captured souls!"
}
GLOBAL.STRINGS.RECIPE_DESC.SOUL_LANTERN = "Harvest souls to light your way."

-- Listen for entity death to collect souls
AddPrefabPostInit("world", function(inst)
    if GLOBAL.TheWorld.ismastersim then
        inst:ListenForEvent("entity_death", function(world, data)
            if data.inst and data.inst:HasTag("monster") then
                -- Find nearby players with soul lanterns
                local x, y, z = data.inst.Transform:GetWorldPosition()
                local players = GLOBAL.TheSim:FindEntities(x, y, z, 20, {"player"})
                
                for _, player in ipairs(players) do
                    if player.components.inventory then
                        -- Check equipped items
                        local equipped = player.components.inventory:GetEquippedItem(GLOBAL.EQUIPSLOTS.HANDS)
                        if equipped and equipped.prefab == "soul_lantern" then
                            -- Add fuel to the lantern
                            if equipped.components.fueled then
                                local soul_value = GetModConfigData("soul_value")
                                equipped.components.fueled:DoDelta(soul_value)
                                
                                -- Spawn visual effect
                                local fx = GLOBAL.SpawnPrefab("statue_transition_2")
                                if fx then
                                    fx.Transform:SetPosition(data.inst.Transform:GetWorldPosition())
                                    fx.Transform:SetScale(0.5, 0.5, 0.5)
                                end
                                
                                -- Play sound
                                equipped.SoundEmitter:PlaySound("dontstarve/common/nightmareAddFuel")
                            end
                            break
                        end
                    end
                end
            end
        end)
    end
end)
```

## Step 4: Create the Prefab File

Create `scripts/prefabs/soul_lantern.lua`:

```lua
local assets = {
    Asset("ANIM", "anim/lantern.zip"),
    Asset("ANIM", "anim/swap_lantern.zip"),
    
    -- Inventory image
    Asset("IMAGE", "images/inventoryimages/soul_lantern.tex"),
    Asset("ATLAS", "images/inventoryimages/soul_lantern.xml"),
}

local prefabs = {
    "lanternlight",
}

-- Light radius and intensity based on fuel level
local function GetLightRadius(inst)
    local fueled = inst.components.fueled
    if fueled then
        local percent = fueled:GetPercent()
        return Lerp(1.5, 3.5, percent)
    end
    return 2.0
end

local function GetLightIntensity(inst)
    local fueled = inst.components.fueled
    if fueled then
        local percent = fueled:GetPercent()
        return Lerp(0.4, 0.8, percent)
    end
    return 0.6
end

-- Update light color based on fuel level
local function UpdateLightColor(inst)
    local fueled = inst.components.fueled
    if fueled and inst.light then
        local percent = fueled:GetPercent()
        
        -- Shift from blue (low) to purple (full)
        local r = Lerp(0.1, 0.6, percent)
        local g = Lerp(0.1, 0.0, percent)
        local b = Lerp(0.7, 0.8, percent)
        
        inst.Light:SetColour(r, g, b)
        
        -- Update light radius and intensity
        inst.Light:SetRadius(GetLightRadius(inst))
        inst.Light:SetIntensity(GetLightIntensity(inst))
    end
end

-- Function to update the appearance based on fuel level
local function UpdateAppearance(inst)
    if not inst.components.fueled then return end
    
    local percent = inst.components.fueled:GetPercent()
    
    -- Update animation based on fuel level
    if percent <= 0.25 then
        inst.AnimState:OverrideSymbol("lantern_overlay", "lantern", "lantern_overlay_low")
        inst.components.inspectable.nameoverride = "SOUL_LANTERN_EMPTY"
    elseif percent <= 0.5 then
        inst.AnimState:OverrideSymbol("lantern_overlay", "lantern", "lantern_overlay_med")
        inst.components.inspectable.nameoverride = "SOUL_LANTERN_LOW"
    elseif percent <= 0.75 then
        inst.AnimState:OverrideSymbol("lantern_overlay", "lantern", "lantern_overlay_high")
        inst.components.inspectable.nameoverride = "SOUL_LANTERN_MEDIUM"
    else
        inst.AnimState:OverrideSymbol("lantern_overlay", "lantern", "lantern_overlay_full")
        inst.components.inspectable.nameoverride = "SOUL_LANTERN_FULL"
    end
    
    -- Update sanity aura based on fuel level
    if inst.components.equippable and inst.components.equippable:IsEquipped() then
        local sanity_bonus = Lerp(0.1, 1.0, percent)
        inst.components.equippable.dapperness = sanity_bonus / TUNING.TOTAL_DAY_TIME
    end
    
    -- Update light color
    UpdateLightColor(inst)
end

-- Function called when the lantern is turned on
local function OnTurnOn(inst)
    if inst.components.fueled then
        inst.components.fueled:StartConsuming()
    end
    
    -- Create light
    if inst.light == nil then
        inst.light = SpawnPrefab("lanternlight")
        inst.light.entity:SetParent(inst.entity)
    end
    
    -- Update light properties
    UpdateLightColor(inst)
    
    -- Update animation
    inst.AnimState:PlayAnimation("idle_on")
    
    -- Add minimap icon
    inst.MiniMapEntity:SetIcon("soul_lantern.tex")
    
    -- Add tag for light source
    inst:AddTag("lightsource")
end

-- Function called when the lantern is turned off
local function OnTurnOff(inst)
    if inst.components.fueled then
        inst.components.fueled:StopConsuming()
    end
    
    -- Remove light
    if inst.light ~= nil then
        inst.light:Remove()
        inst.light = nil
    end
    
    -- Update animation
    inst.AnimState:PlayAnimation("idle_off")
    
    -- Remove minimap icon
    inst.MiniMapEntity:SetIcon(nil)
    
    -- Remove light source tag
    inst:RemoveTag("lightsource")
end

-- Function called when the lantern is equipped
local function OnEquip(inst, owner)
    -- Use the regular lantern animation for now
    owner.AnimState:OverrideSymbol("swap_object", "swap_lantern", "swap_lantern")
    owner.AnimState:Show("ARM_carry")
    owner.AnimState:Hide("ARM_normal")
    
    -- Apply a purple tint to the lantern when equipped
    owner.AnimState:SetMultColour(0.9, 0.8, 1, 1)
    
    -- Turn on the lantern when equipped
    if inst.components.fueled:GetPercent() > 0 then
        OnTurnOn(inst)
    end
    
    -- Update sanity aura
    local percent = inst.components.fueled:GetPercent()
    local sanity_bonus = Lerp(0.1, 1.0, percent)
    inst.components.equippable.dapperness = sanity_bonus / TUNING.TOTAL_DAY_TIME
end

-- Function called when the lantern is unequipped
local function OnUnequip(inst, owner)
    owner.AnimState:Hide("ARM_carry")
    owner.AnimState:Show("ARM_normal")
    owner.AnimState:SetMultColour(1, 1, 1, 1)
    
    -- Turn off the lantern when unequipped
    OnTurnOff(inst)
    
    -- Reset sanity aura
    inst.components.equippable.dapperness = 0
end

-- Function called when attacking with the lantern
local function OnAttack(inst, owner, target)
    if target and target:HasTag("ghost") then
        -- Extra damage to ghosts
        return inst.components.weapon.damage * 1.5
    end
    
    -- Chance to steal soul on hit
    if target and target:HasTag("monster") and math.random() < 0.2 then  -- 20% chance
        if inst.components.fueled then
            local soul_value = GetModConfigData("soul_value") / 2
            inst.components.fueled:DoDelta(soul_value)
            
            -- Visual effect
            local fx = SpawnPrefab("statue_transition")
            if fx then
                fx.Transform:SetPosition(target.Transform:GetWorldPosition())
                fx.Transform:SetScale(0.3, 0.3, 0.3)
            end
        end
    end
end

-- Function called when fuel is depleted
local function OnOutOfFuel(inst)
    if inst.components.equippable and inst.components.equippable:IsEquipped() then
        OnTurnOff(inst)
    end
    
    -- Update appearance
    UpdateAppearance(inst)
end

-- Function called when fuel level changes
local function OnFuelChanged(inst, data)
    -- Update appearance based on new fuel level
    UpdateAppearance(inst)
    
    -- If equipped and turned off but now has fuel, turn it on
    if inst.components.equippable and 
       inst.components.equippable:IsEquipped() and
       not inst:HasTag("lightsource") and
       inst.components.fueled:GetPercent() > 0 then
        OnTurnOn(inst)
    end
end

-- Main function to create the soul lantern
local function fn()
    -- Create the entity
    local inst = CreateEntity()

    -- Add required components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddSoundEmitter()
    inst.entity:AddMiniMapEntity()
    inst.entity:AddNetwork()
    
    -- Set up minimap icon
    inst.MiniMapEntity:SetIcon("lantern.tex")

    -- Set up physics
    MakeInventoryPhysics(inst)

    -- Set up animation
    inst.AnimState:SetBank("lantern")
    inst.AnimState:SetBuild("lantern")
    inst.AnimState:PlayAnimation("idle_off")
    
    -- Apply a purple tint to the lantern
    inst.AnimState:SetMultColour(0.9, 0.8, 1, 1)
    
    -- Add light component
    inst.entity:AddLight()
    inst.Light:SetFalloff(0.7)
    inst.Light:SetIntensity(0.6)
    inst.Light:SetRadius(2.0)
    inst.Light:SetColour(0.4, 0.0, 0.8)
    inst.Light:Enable(false)

    -- Add tags
    inst:AddTag("light")
    inst:AddTag("soulharvester")

    -- Make the entity pristine for networking
    inst.entity:SetPristine()
    if not TheWorld.ismastersim then
        return inst
    end

    -- Add components
    inst:AddComponent("inventoryitem")
    inst.components.inventoryitem.imagename = "soul_lantern"
    inst.components.inventoryitem.atlasname = "images/inventoryimages/soul_lantern.xml"

    -- Add fueled component to manage soul energy
    inst:AddComponent("fueled")
    inst.components.fueled.fueltype = FUELTYPE.NIGHTMARE
    inst.components.fueled:InitializeFuelLevel(0)
    inst.components.fueled:SetDepletedFn(OnOutOfFuel)
    inst.components.fueled:SetUpdateFn(UpdateLightColor)
    inst.components.fueled:SetSections(4)
    inst.components.fueled.accepting = true
    inst.components.fueled:SetSectionCallback(UpdateAppearance)
    inst.components.fueled.maxfuel = GetModConfigData("max_fuel")
    inst.components.fueled.currentfuel = 0
    
    -- Listen for fuel changes
    inst:ListenForEvent("percentusedchange", OnFuelChanged)

    -- Add weapon component
    inst:AddComponent("weapon")
    inst.components.weapon:SetDamage(GetModConfigData("weapon_damage"))
    inst.components.weapon:SetOnAttack(OnAttack)

    -- Add durability for weapon usage
    inst:AddComponent("finiteuses")
    inst.components.finiteuses:SetMaxUses(150)
    inst.components.finiteuses:SetUses(150)
    inst.components.finiteuses:SetOnFinished(function(inst) inst:Remove() end)
    inst.components.finiteuses:SetConsumption(ACTIONS.ATTACK, 1)

    -- Make it inspectable with dynamic descriptions
    inst:AddComponent("inspectable")
    inst.components.inspectable.nameoverride = "SOUL_LANTERN_EMPTY"

    -- Make it equippable
    inst:AddComponent("equippable")
    inst.components.equippable:SetOnEquip(OnEquip)
    inst.components.equippable:SetOnUnequip(OnUnequip)
    
    -- Add a special effect when near ghosts
    inst:DoPeriodicTask(1, function()
        if inst.components.equippable and inst.components.equippable:IsEquipped() then
            local owner = inst.components.inventoryitem.owner
            if owner then
                local x, y, z = owner.Transform:GetWorldPosition()
                local ghosts = TheSim:FindEntities(x, y, z, 10, {"ghost"})
                
                if #ghosts > 0 then
                    -- Make the light flicker when ghosts are nearby
                    if inst.light then
                        local intensity = GetLightIntensity(inst) * (0.8 + 0.4 * math.random())
                        inst.Light:SetIntensity(intensity)
                        
                        -- Play a subtle sound occasionally
                        if math.random() < 0.1 then  -- 10% chance each second
                            inst.SoundEmitter:PlaySound("dontstarve/common/haunted_1", nil, 0.3)
                        end
                    end
                end
            end
        end
    end)

    return inst
end

-- Register the prefab
return Prefab("soul_lantern", fn, assets, prefabs)
```

## Step 5: Component Interactions

Let's examine how the different components interact in our Soul Lantern:

### Fueled + Equippable Interaction

The `fueled` component manages the soul energy level, while the `equippable` component handles when the item is worn. These interact in several ways:

1. When equipped, the lantern checks fuel level and turns on if fuel is available
2. When unequipped, the lantern turns off to conserve fuel
3. The sanity aura (dapperness) of the equipped lantern scales with fuel level

```lua
-- When equipped, check fuel and turn on if possible
local function OnEquip(inst, owner)
    -- ... other equip code ...
    
    -- Turn on the lantern when equipped if it has fuel
    if inst.components.fueled:GetPercent() > 0 then
        OnTurnOn(inst)
    end
    
    -- Update sanity aura based on fuel level
    local percent = inst.components.fueled:GetPercent()
    local sanity_bonus = Lerp(0.1, 1.0, percent)
    inst.components.equippable.dapperness = sanity_bonus / TUNING.TOTAL_DAY_TIME
end
```

### Fueled + Light Interaction

The light properties (radius, intensity, color) change based on the fuel level:

```lua
-- Update light color based on fuel level
local function UpdateLightColor(inst)
    local fueled = inst.components.fueled
    if fueled and inst.light then
        local percent = fueled:GetPercent()
        
        -- Shift from blue (low) to purple (full)
        local r = Lerp(0.1, 0.6, percent)
        local g = Lerp(0.1, 0.0, percent)
        local b = Lerp(0.7, 0.8, percent)
        
        inst.Light:SetColour(r, g, b)
        
        -- Update light radius and intensity
        inst.Light:SetRadius(GetLightRadius(inst))
        inst.Light:SetIntensity(GetLightIntensity(inst))
    end
end
```

### Weapon + Fueled Interaction

Using the lantern as a weapon can generate additional fuel when hitting monsters:

```lua
-- Function called when attacking with the lantern
local function OnAttack(inst, owner, target)
    -- ... other attack code ...
    
    -- Chance to steal soul on hit
    if target and target:HasTag("monster") and math.random() < 0.2 then  -- 20% chance
        if inst.components.fueled then
            local soul_value = GetModConfigData("soul_value") / 2
            inst.components.fueled:DoDelta(soul_value)
            
            -- Visual effect
            local fx = SpawnPrefab("statue_transition")
            if fx then
                fx.Transform:SetPosition(target.Transform:GetWorldPosition())
                fx.Transform:SetScale(0.3, 0.3, 0.3)
            end
        end
    end
end
```

### Inspectable + Fueled Interaction

The inspection text changes based on the fuel level:

```lua
-- Function to update the appearance based on fuel level
local function UpdateAppearance(inst)
    if not inst.components.fueled then return end
    
    local percent = inst.components.fueled:GetPercent()
    
    -- Update inspection text based on fuel level
    if percent <= 0.25 then
        inst.components.inspectable.nameoverride = "SOUL_LANTERN_EMPTY"
    elseif percent <= 0.5 then
        inst.components.inspectable.nameoverride = "SOUL_LANTERN_LOW"
    elseif percent <= 0.75 then
        inst.components.inspectable.nameoverride = "SOUL_LANTERN_MEDIUM"
    else
        inst.components.inspectable.nameoverride = "SOUL_LANTERN_FULL"
    end
    
    -- ... other appearance updates ...
}
```

## Step 6: Testing Your Mod

1. Launch Don't Starve Together
2. Enable your mod in the Mods menu
3. Start a new game
4. Craft your Soul Lantern (requires boards, nightmare fuel, and gears)
5. Test the lantern by:
   - Equipping it to see the light effect
   - Killing monsters to collect souls
   - Watching the appearance change as it fills with souls
   - Using it as a weapon and observing the special effects
   - Checking the sanity boost as the lantern fills

## Customization Options

Here are some ways to enhance your Soul Lantern:

### Add Custom Animations

For a fully custom appearance, create your own animation files:

1. Create `anim/soul_lantern.zip` with custom animations
2. Update the prefab file:

```lua
local assets = {
    Asset("ANIM", "anim/soul_lantern.zip"),
    Asset("ANIM", "anim/swap_soul_lantern.zip"),
    -- Other assets...
}

-- Then in the fn() function:
inst.AnimState:SetBank("soul_lantern")
inst.AnimState:SetBuild("soul_lantern")
```

### Add More Soul Collection Methods

Expand the ways to collect souls:

```lua
-- In modmain.lua, add this to collect souls from ghosts being caught
AddPrefabPostInit("ghostlyelixir_slowregen", function(inst)
    if inst.components.ghostlyelixir then
        local old_apply = inst.components.ghostlyelixir.onconsumedfn
        inst.components.ghostlyelixir.onconsumedfn = function(inst, ghost, doer)
            if old_apply then
                old_apply(inst, ghost, doer)
            end
            
            -- Check if the catcher has a soul lantern
            if doer and doer.components.inventory then
                local lantern = doer.components.inventory:FindItem(function(item)
                    return item.prefab == "soul_lantern"
                end)
                
                if lantern and lantern.components.fueled then
                    -- Add extra souls when catching a ghost
                    lantern.components.fueled:DoDelta(GetModConfigData("soul_value") * 2)
                    
                    -- Visual effect
                    local fx = SpawnPrefab("statue_transition_2")
                    if fx then
                        fx.Transform:SetPosition(ghost.Transform:GetWorldPosition())
                    end
                end
            end
        end
    end
end)
```

### Add Special Powers Based on Fuel Level

Give the lantern additional abilities when fully charged:

```lua
-- In the OnEquip function, add:
inst:DoPeriodicTask(1, function()
    if inst.components.fueled:GetPercent() > 0.9 then  -- When nearly full
        local owner = inst.components.inventoryitem.owner
        if owner then
            -- Create a protective aura
            local x, y, z = owner.Transform:GetWorldPosition()
            local ents = TheSim:FindEntities(x, y, z, 5, {"ghost", "monster"})
            
            for _, ent in ipairs(ents) do
                if ent.components.combat and ent.components.combat:TargetIs(owner) then
                    -- Chance to make monsters flee
                    if math.random() < 0.1 then  -- 10% chance each second
                        if ent.components.combat then
                            ent.components.combat:DropTarget()
                        end
                        
                        if ent.components.locomotor then
                            ent.components.locomotor:RunAway(owner, 10, 10)
                        end
                        
                        -- Visual effect
                        local fx = SpawnPrefab("statue_transition")
                        if fx then
                            fx.Transform:SetPosition(ent.Transform:GetWorldPosition())
                        end
                    end
                end
            end
        end
    end
end)
```

## Common Issues and Solutions

### Problem: Components not interacting correctly
**Solution**: Make sure you're updating component properties in the right order and checking if components exist before using them

### Problem: Fuel not being consumed or added correctly
**Solution**: Verify that you're using the correct fuel type and that the fueled component is properly initialized

### Problem: Visual effects not appearing
**Solution**: Check that you're spawning the effects at the correct position and that the prefabs exist in the game

### Problem: Sanity aura not working
**Solution**: Make sure you're setting the dapperness value correctly and updating it when fuel changes

## Advanced Component Integration

For even more complex items, consider these advanced techniques:

### Creating Custom Components

If existing components don't provide the functionality you need, you can create custom components:

```lua
-- In scripts/components/soulcollector.lua
local SoulCollector = Class(function(self, inst)
    self.inst = inst
    self.souls_collected = 0
    self.max_souls = 100
    self.soul_power = 1
    self.on_collect_fn = nil
end)

function SoulCollector:CollectSoul(value)
    value = value or self.soul_power
    self.souls_collected = math.min(self.souls_collected + value, self.max_souls)
    
    if self.on_collect_fn then
        self.on_collect_fn(self.inst, self.souls_collected)
    end
    
    return true
end

function SoulCollector:SetOnCollectFn(fn)
    self.on_collect_fn = fn
end

return SoulCollector
```

### Component Communication Through Events

Components can communicate through events for more complex interactions:

```lua
-- When fuel changes, trigger a custom event
inst:ListenForEvent("percentusedchange", function(inst, data)
    inst:PushEvent("soulschanged", {percent = data.percent})
end)

-- Listen for the custom event in another component
inst:ListenForEvent("soulschanged", function(inst, data)
    -- Update other components based on soul level
    if inst.components.weapon then
        local base_damage = GetModConfigData("weapon_damage")
        local bonus = math.floor(base_damage * data.percent * 0.5)
        inst.components.weapon:SetDamage(base_damage + bonus)
    end
end)
```

## Next Steps

Now that you've created a complex item with multiple interacting components, you can:

1. **Add More Component Interactions**: Create even more complex behaviors through component communication
2. **Create a Set of Related Items**: Design items that work together or share resources
3. **Add Character-Specific Behaviors**: Make the item behave differently based on who's using it
4. **Expand with Custom Components**: Create entirely new components for unique behaviors

For more advanced modding techniques, check out the [Custom Component](custom-component.md) and [Stategraph Mod](stategraph-mod.md) tutorials.