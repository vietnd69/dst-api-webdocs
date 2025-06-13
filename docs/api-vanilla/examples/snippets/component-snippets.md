---
id: component-snippets
title: Component Snippets
sidebar_position: 6
---

# Component Snippets

This page provides reusable code snippets for creating and modifying components in Don't Starve Together mods.

## Basic Component Creation

### Simple Component Template

```lua
-- Define a simple component
local MyComponent = Class(function(self, inst)
    self.inst = inst
    
    -- Initialize component properties
    self.value = 0
    self.enabled = true
    self.cooldown = 0
    
    -- Add a periodic task
    self.task = self.inst:DoPeriodicTask(1, function() self:OnUpdate() end)
end)

-- Add a method to the component
function MyComponent:SetValue(val)
    self.value = val
    self.inst:PushEvent("valuechanged", {value = val})
end

-- Update method called by periodic task
function MyComponent:OnUpdate()
    if not self.enabled then return end
    
    if self.cooldown > 0 then
        self.cooldown = self.cooldown - 1
    end
end

-- Enable/disable the component
function MyComponent:Enable(enable)
    self.enabled = enable
end

-- Clean up when component is removed
function MyComponent:OnRemoveFromEntity()
    if self.task then
        self.task:Cancel()
        self.task = nil
    end
end

-- Save/load functionality
function MyComponent:OnSave()
    return {
        value = self.value,
        enabled = self.enabled,
        cooldown = self.cooldown
    }
end

function MyComponent:OnLoad(data)
    if data then
        self.value = data.value or self.value
        self.enabled = data.enabled ~= nil and data.enabled or self.enabled
        self.cooldown = data.cooldown or self.cooldown
    end
end

return MyComponent
```

### Adding Component to an Entity

```lua
-- In a prefab file
local function fn()
    local inst = CreateEntity()
    
    -- Add standard components
    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()
    
    -- Add custom component
    inst:AddComponent("mycomponent")
    inst.components.mycomponent:SetValue(10)
    
    return inst
end

-- In modmain.lua to register the component
local MyComponent = require "components/mycomponent"
AddComponentPostInit("mycomponent", MyComponent)

-- OR to add the component to an existing prefab
AddPrefabPostInit("wilson", function(inst)
    if not inst.components.mycomponent then
        inst:AddComponent("mycomponent")
    end
end)
```

## Advanced Component Examples

### Component with Replication

```lua
-- Define a component with client-side replication
local MyReplicatedComponent = Class(function(self, inst)
    self.inst = inst
    
    -- Server-side properties
    self.max_value = 100
    self.current_value = 100
    self.regen_rate = 1
    
    -- Network variables
    self.net_value = net_float(inst.GUID, "myreplicatedcomponent.value", "valuedirty")
    self.net_max = net_float(inst.GUID, "myreplicatedcomponent.max", "maxdirty")
    
    -- Initialize network values
    if TheWorld.ismastersim then
        self.net_value:set(self.current_value)
        self.net_max:set(self.max_value)
    else
        -- Client-side event handlers
        inst:ListenForEvent("valuedirty", function() self:OnValueDirty() end)
        inst:ListenForEvent("maxdirty", function() self:OnMaxDirty() end)
    end
    
    -- Start regeneration task on server
    if TheWorld.ismastersim then
        self.regen_task = inst:DoPeriodicTask(1, function() self:OnRegenTick() end)
    end
end)

-- Server-side methods
function MyReplicatedComponent:SetValue(val)
    if not TheWorld.ismastersim then return end
    
    self.current_value = math.clamp(val, 0, self.max_value)
    self.net_value:set(self.current_value)
    
    self.inst:PushEvent("valuechanged", {value = self.current_value})
end

function MyReplicatedComponent:SetMax(val)
    if not TheWorld.ismastersim then return end
    
    self.max_value = val
    self.net_max:set(val)
    
    -- Clamp current value to new max
    if self.current_value > self.max_value then
        self:SetValue(self.max_value)
    end
    
    self.inst:PushEvent("maxchanged", {max = self.max_value})
end

function MyReplicatedComponent:DoDelta(delta)
    if not TheWorld.ismastersim then return end
    
    self:SetValue(self.current_value + delta)
end

function MyReplicatedComponent:OnRegenTick()
    if not TheWorld.ismastersim then return end
    
    if self.current_value < self.max_value then
        self:DoDelta(self.regen_rate)
    end
end

-- Client-side methods
function MyReplicatedComponent:OnValueDirty()
    if TheWorld.ismastersim then return end
    
    local old_value = self.current_value
    self.current_value = self.net_value:value()
    
    -- Trigger client-side event
    self.inst:PushEvent("valuechanged_client", {
        old_value = old_value,
        new_value = self.current_value
    })
end

function MyReplicatedComponent:OnMaxDirty()
    if TheWorld.ismastersim then return end
    
    local old_max = self.max_value
    self.max_value = self.net_max:value()
    
    -- Trigger client-side event
    self.inst:PushEvent("maxchanged_client", {
        old_max = old_max,
        new_max = self.max_value
    })
end

-- Methods that work on both client and server
function MyReplicatedComponent:GetPercent()
    return self.current_value / self.max_value
end

function MyReplicatedComponent:GetValue()
    return self.current_value
end

function MyReplicatedComponent:GetMax()
    return self.max_value
end

-- Clean up
function MyReplicatedComponent:OnRemoveFromEntity()
    if self.regen_task then
        self.regen_task:Cancel()
        self.regen_task = nil
    end
end

-- Save/load
function MyReplicatedComponent:OnSave()
    if not TheWorld.ismastersim then return end
    
    return {
        current_value = self.current_value,
        max_value = self.max_value,
        regen_rate = self.regen_rate
    }
end

function MyReplicatedComponent:OnLoad(data)
    if not TheWorld.ismastersim then return end
    
    if data then
        self.max_value = data.max_value or self.max_value
        self.regen_rate = data.regen_rate or self.regen_rate
        
        -- Set value last to ensure it's clamped to the loaded max
        if data.current_value then
            self:SetValue(data.current_value)
        end
        
        -- Update network values
        self.net_max:set(self.max_value)
    end
end

return MyReplicatedComponent
```

### Component with Action Integration

```lua
-- Define a component that adds a custom action
local MyActionComponent = Class(function(self, inst)
    self.inst = inst
    
    -- Component properties
    self.uses_remaining = 10
    self.use_fn = nil
    self.can_use_test = nil
    
    -- Add action tag to entity
    inst:AddTag("myactionable")
end)

-- Set the function to call when used
function MyActionComponent:SetOnUseFn(fn)
    self.use_fn = fn
end

-- Set a test function to determine if the action can be performed
function MyActionComponent:SetCanUseTest(fn)
    self.can_use_test = fn
end

-- Called when the action is performed
function MyActionComponent:Use(doer)
    if self.uses_remaining <= 0 then
        return false
    end
    
    -- Run custom test if provided
    if self.can_use_test and not self.can_use_test(self.inst, doer) then
        return false
    end
    
    -- Decrease uses
    self.uses_remaining = self.uses_remaining - 1
    
    -- Call custom use function if provided
    if self.use_fn then
        self.use_fn(self.inst, doer)
    end
    
    -- Trigger events
    self.inst:PushEvent("used", {doer = doer})
    
    -- Remove component when uses are depleted
    if self.uses_remaining <= 0 then
        self.inst:RemoveComponent("myactioncomponent")
    end
    
    return true
end

-- Save/load
function MyActionComponent:OnSave()
    return {
        uses_remaining = self.uses_remaining
    }
end

function MyActionComponent:OnLoad(data)
    if data then
        self.uses_remaining = data.uses_remaining or self.uses_remaining
    end
end

-- Define the action in modmain.lua
--[[
local MYACTION = Action({priority=10, mount_valid=true})
MYACTION.str = "Use"
MYACTION.id = "MYACTION"
MYACTION.fn = function(act)
    if act.target and act.target.components.myactioncomponent then
        return act.target.components.myactioncomponent:Use(act.doer)
    end
    return false
end

-- Add the action to the component action handler
AddComponentAction("SCENE", "myactioncomponent", function(inst, doer, actions, right)
    if right and inst:HasTag("myactionable") then
        table.insert(actions, ACTIONS.MYACTION)
    end
end)
]]--

return MyActionComponent
```

## Component Integration Examples

### Component that Integrates with Health

```lua
-- Define a component that integrates with the health component
local HealthModifier = Class(function(self, inst)
    self.inst = inst
    
    -- Component properties
    self.health_bonus = 0
    self.regen_amount = 0
    self.damage_reduction = 0
    
    -- Apply effects when added
    self:ApplyEffects()
    
    -- Listen for health events
    inst:ListenForEvent("healthdelta", function(inst, data) self:OnHealthDelta(data) end)
end)

-- Apply health modifiers
function HealthModifier:ApplyEffects()
    local health = self.inst.components.health
    if not health then return end
    
    -- Store original max health if not already stored
    if not self.original_max_health then
        self.original_max_health = health.maxhealth
    end
    
    -- Apply max health bonus
    if self.health_bonus ~= 0 then
        health:SetMaxHealth(self.original_max_health + self.health_bonus)
    end
end

-- Set health bonus
function HealthModifier:SetHealthBonus(bonus)
    self.health_bonus = bonus
    self:ApplyEffects()
end

-- Set damage reduction (0-1 range, where 1 is 100% reduction)
function HealthModifier:SetDamageReduction(reduction)
    self.damage_reduction = math.clamp(reduction, 0, 1)
end

-- Set health regeneration amount per second
function HealthModifier:SetRegeneration(amount)
    self.regen_amount = amount
    
    -- Cancel existing regen task if any
    if self.regen_task then
        self.regen_task:Cancel()
        self.regen_task = nil
    end
    
    -- Start new regen task if amount is positive
    if amount > 0 then
        self.regen_task = self.inst:DoPeriodicTask(1, function() self:DoRegeneration() end)
    end
end

-- Apply regeneration
function HealthModifier:DoRegeneration()
    local health = self.inst.components.health
    if not health or health:IsDead() then return end
    
    health:DoDelta(self.regen_amount, true, "healthmodifier")
end

-- Handle health delta events
function HealthModifier:OnHealthDelta(data)
    -- Skip if not damage or if caused by this component
    if data.amount >= 0 or data.cause == "healthmodifier" then return end
    
    -- Apply damage reduction
    if self.damage_reduction > 0 and data.amount < 0 then
        local health = self.inst.components.health
        local reduction_amount = -data.amount * self.damage_reduction
        
        -- Apply healing to counteract some of the damage
        health:DoDelta(reduction_amount, true, "healthmodifier")
    end
end

-- Clean up when removed
function HealthModifier:OnRemoveFromEntity()
    -- Restore original max health
    if self.original_max_health and self.inst.components.health then
        self.inst.components.health:SetMaxHealth(self.original_max_health)
    end
    
    -- Cancel regen task
    if self.regen_task then
        self.regen_task:Cancel()
        self.regen_task = nil
    end
end

-- Save/load
function HealthModifier:OnSave()
    return {
        health_bonus = self.health_bonus,
        regen_amount = self.regen_amount,
        damage_reduction = self.damage_reduction,
        original_max_health = self.original_max_health
    }
end

function HealthModifier:OnLoad(data)
    if data then
        self.health_bonus = data.health_bonus or self.health_bonus
        self.damage_reduction = data.damage_reduction or self.damage_reduction
        self.original_max_health = data.original_max_health
        
        -- Apply effects
        self:ApplyEffects()
        
        -- Set regeneration last to start the task if needed
        self:SetRegeneration(data.regen_amount or self.regen_amount)
    end
end

return HealthModifier
```

### Component that Integrates with Inventory

```lua
-- Define a component that integrates with the inventory component
local InventoryExtension = Class(function(self, inst)
    self.inst = inst
    
    -- Component properties
    self.extra_slots = 0
    self.item_use_bonus = {}
    self.drop_on_death = true
    
    -- Apply effects when added
    self:ApplyEffects()
    
    -- Listen for inventory events
    inst:ListenForEvent("itemget", function(inst, data) self:OnItemGet(data) end)
    inst:ListenForEvent("itemlose", function(inst, data) self:OnItemLose(data) end)
    inst:ListenForEvent("death", function(inst) self:OnDeath() end)
end)

-- Apply inventory modifications
function InventoryExtension:ApplyEffects()
    local inventory = self.inst.components.inventory
    if not inventory then return end
    
    -- Store original max slots if not already stored
    if not self.original_max_slots then
        self.original_max_slots = inventory.maxslots
    end
    
    -- Apply extra slots
    if self.extra_slots > 0 then
        inventory.maxslots = self.original_max_slots + self.extra_slots
    end
end

-- Set extra inventory slots
function InventoryExtension:SetExtraSlots(slots)
    self.extra_slots = math.max(0, slots)
    self:ApplyEffects()
end

-- Add item use bonus
function InventoryExtension:AddItemUseBonus(item_type, bonus)
    self.item_use_bonus[item_type] = bonus
end

-- Remove item use bonus
function InventoryExtension:RemoveItemUseBonus(item_type)
    self.item_use_bonus[item_type] = nil
end

-- Get item use bonus for a specific item
function InventoryExtension:GetItemUseBonus(item)
    if not item or not item.prefab then return 0 end
    return self.item_use_bonus[item.prefab] or 0
end

-- Handle item acquisition
function InventoryExtension:OnItemGet(data)
    local item = data.item
    if not item then return end
    
    -- Apply any special effects when getting an item
    if item.components.finiteuses and self.item_use_bonus[item.prefab] then
        -- Store original max uses if not already stored
        if not item.original_max_uses then
            item.original_max_uses = item.components.finiteuses.total
        end
        
        -- Apply bonus
        local bonus = self.item_use_bonus[item.prefab]
        item.components.finiteuses.total = item.original_max_uses * (1 + bonus)
    end
end

-- Handle item loss
function InventoryExtension:OnItemLose(data)
    local item = data.item
    if not item then return end
    
    -- Restore original values when losing an item
    if item.components.finiteuses and item.original_max_uses then
        item.components.finiteuses.total = item.original_max_uses
        item.original_max_uses = nil
    end
end

-- Handle death
function InventoryExtension:OnDeath()
    if not self.drop_on_death then return end
    
    -- Drop special items instead of destroying them
    local inventory = self.inst.components.inventory
    if not inventory then return end
    
    -- Find special items to drop
    local items_to_drop = {}
    for i = 1, inventory:NumItems() do
        local item = inventory:GetItemInSlot(i)
        if item and self.item_use_bonus[item.prefab] then
            table.insert(items_to_drop, item)
        end
    end
    
    -- Drop the special items
    for _, item in ipairs(items_to_drop) do
        inventory:DropItem(item)
    end
end

-- Clean up when removed
function InventoryExtension:OnRemoveFromEntity()
    -- Restore original inventory size
    local inventory = self.inst.components.inventory
    if inventory and self.original_max_slots then
        inventory.maxslots = self.original_max_slots
    end
    
    -- Restore original item values
    if inventory then
        for i = 1, inventory:NumItems() do
            local item = inventory:GetItemInSlot(i)
            if item and item.components.finiteuses and item.original_max_uses then
                item.components.finiteuses.total = item.original_max_uses
                item.original_max_uses = nil
            end
        end
    end
end

-- Save/load
function InventoryExtension:OnSave()
    return {
        extra_slots = self.extra_slots,
        item_use_bonus = self.item_use_bonus,
        drop_on_death = self.drop_on_death,
        original_max_slots = self.original_max_slots
    }
end

function InventoryExtension:OnLoad(data)
    if data then
        self.extra_slots = data.extra_slots or self.extra_slots
        self.item_use_bonus = data.item_use_bonus or self.item_use_bonus
        self.drop_on_death = data.drop_on_death ~= nil and data.drop_on_death or self.drop_on_death
        self.original_max_slots = data.original_max_slots
        
        -- Apply effects
        self:ApplyEffects()
    end
end

return InventoryExtension
``` 