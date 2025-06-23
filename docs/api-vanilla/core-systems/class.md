---
title: "Class"
description: "Object-oriented programming system providing inheritance, property management, and instance tracking"
sidebar_position: 11
slug: /api-vanilla/core-systems/class
last_updated: "2024-01-15"
build_version: "675312"
change_status: "stable"
---

# Class System

The **Class** system provides object-oriented programming capabilities for Don't Starve Together's Lua environment. It implements inheritance, property management with setters/getters, read-only properties, instance tracking, and hot reloading support. This system enables structured code organization and reusable component patterns throughout the game.

## Overview

The Class system transforms Lua's prototype-based object model into a familiar class-based system. It uses metatables to implement inheritance, method dispatch, and property access control. The system supports single inheritance, constructor functions, property validation, and optional instance tracking for memory debugging.

## Version History

| Version | Changes | Status |
|---------|---------|--------|
| 675312  | Current stable implementation | 🟢 **Stable** |
| Earlier | Initial class system implementation | - |

## Global Configuration

### Class Tracking
```lua
TrackClassInstances = false  -- Enable/disable instance tracking for debugging
ClassTrackingInterval = 100  -- Frames between tracking reports
ClassRegistry = {}           -- Registry of all defined classes
```

### Instance Tracking Tables
```lua
ClassTrackingTable = {}      -- Weak-keyed table tracking instances per class
```

## Core Function: Class()

### Class(base, _ctor, props)
Creates a new class with optional inheritance, constructor, and property management.

```lua
function Class(base, _ctor, props) -> table
```

**Parameters:**
- `base` (table/function, optional): Base class for inheritance, or constructor if no inheritance
- `_ctor` (function, optional): Constructor function called when creating instances
- `props` (table, optional): Property definitions with setter functions

**Returns:**
- `table`: New class object with metatable configured for inheritance

**Usage:**
```lua
-- Simple class with constructor
local Player = Class(function(self, name, health)
    self.name = name
    self.health = health or 100
    self.inventory = {}
end)

-- Class with inheritance
local Warrior = Class(Player, function(self, name, health, weapon)
    Player._ctor(self, name, health)  -- Call parent constructor
    self.weapon = weapon or "sword"
    self.armor = 50
end)

-- Class with property management
local Monster = Class(function(self, name)
    self.name = name
    self._health = 100
end, {
    health = function(self, value, old)
        if value < 0 then value = 0 end
        if value > self.max_health then value = self.max_health end
        self._health = value
        if value <= 0 then
            self:OnDeath()
        end
    end
})
```

## Class Instance Methods

### is_a(klass)
Checks if an instance is derived from a specific class.

```lua
function instance:is_a(klass) -> boolean
```

**Parameters:**
- `klass` (table): Class to check inheritance against

**Returns:**
- `boolean`: `true` if instance inherits from the class

**Usage:**
```lua
local player = Player("Wilson", 150)
local warrior = Warrior("Wigfrid", 200, "spear")

print(player:is_a(Player))    -- true
print(warrior:is_a(Player))   -- true (inheritance)
print(warrior:is_a(Warrior))  -- true
print(player:is_a(Warrior))   -- false
```

### is_class()
Checks if an object is a class definition rather than an instance.

```lua
function object:is_class() -> boolean
```

**Returns:**
- `boolean`: `true` if object is a class, `false` if instance

**Usage:**
```lua
print(Player:is_class())        -- true
print(player:is_class())        -- false

-- Useful for validation
local function ProcessObject(obj)
    if obj:is_class() then
        print("This is a class definition")
    else
        print("This is an instance")
    end
end
```

### is_instance(obj)
Class method to check if an object is an instance of this specific class.

```lua
function Class:is_instance(obj) -> boolean
```

**Parameters:**
- `obj` (any): Object to test

**Returns:**
- `boolean`: `true` if object is an instance of this class

**Usage:**
```lua
local player = Player("Wilson")
local number = 42

print(Player:is_instance(player))  -- true
print(Player:is_instance(number))  -- false
print(Warrior:is_instance(player)) -- false (different class)
```

## Property Management

### makereadonly(t, k)
Makes a property read-only, preventing modification after initial assignment.

```lua
function makereadonly(t, k)
```

**Parameters:**
- `t` (table): Instance to modify
- `k` (string): Property name to make read-only

**Usage:**
```lua
local Config = Class(function(self, version)
    self.version = version
    self.debug_mode = false
    
    -- Make version read-only after creation
    makereadonly(self, "version")
end)

local config = Config("1.0.0")
print(config.version)  -- "1.0.0"

-- This will throw an error:
-- config.version = "2.0.0"  -- Error: Cannot change read only property
```

### addsetter(t, k, fn)
Adds a setter function that validates or transforms property assignments.

```lua
function addsetter(t, k, fn)
```

**Parameters:**
- `t` (table): Instance to modify
- `k` (string): Property name
- `fn` (function): Setter function `(self, new_value, old_value)`

**Usage:**
```lua
local Character = Class(function(self, name)
    self.name = name
    self._health = 100
    self.max_health = 100
    
    -- Add health validation
    addsetter(self, "health", function(self, value, old)
        -- Clamp value between 0 and max_health
        value = math.max(0, math.min(value, self.max_health))
        self._health = value
        
        -- Trigger events
        if value <= 0 and old > 0 then
            self:OnDeath()
        elseif value > old then
            self:OnHeal(value - old)
        end
    end)
end)

local player = Character("Wilson")
player.health = 150  -- Automatically clamped to 100
player.health = -10  -- Automatically clamped to 0, triggers OnDeath
```

### removesetter(t, k)
Removes a property setter, restoring direct property access.

```lua
function removesetter(t, k)
```

**Parameters:**
- `t` (table): Instance to modify
- `k` (string): Property name

**Usage:**
```lua
-- Remove the health setter for direct access
removesetter(player, "health")
player.health = 75  -- Now sets directly without validation
```

## Advanced Usage Examples

### Complex Inheritance Hierarchy
```lua
-- Base entity class
local Entity = Class(function(self, x, y)
    self.x = x or 0
    self.y = y or 0
    self.components = {}
end)

function Entity:AddComponent(name, component)
    self.components[name] = component
    component.inst = self
end

function Entity:GetComponent(name)
    return self.components[name]
end

-- Living entity with health
local Living = Class(Entity, function(self, x, y, health)
    Entity._ctor(self, x, y)
    self.health = health or 100
    self.max_health = health or 100
end)

function Living:TakeDamage(amount)
    self.health = self.health - amount
    if self.health <= 0 then
        self:Die()
    end
end

function Living:Die()
    print(self.name .. " has died!")
end

-- Player character
local Player = Class(Living, function(self, name, x, y)
    Living._ctor(self, x, y, 150)  -- Players start with 150 health
    self.name = name
    self.inventory = {}
    self.experience = 0
end)

function Player:AddExperience(amount)
    self.experience = self.experience + amount
    print(self.name .. " gained " .. amount .. " experience!")
end

-- Monster
local Monster = Class(Living, function(self, type, x, y, health, damage)
    Living._ctor(self, x, y, health)
    self.type = type
    self.damage = damage or 10
    self.aggro_range = 5
end)

function Monster:Attack(target)
    if target:is_a(Living) then
        target:TakeDamage(self.damage)
        print(self.type .. " attacks " .. (target.name or "target"))
    end
end
```

### Property Validation System
```lua
local ValidatedCharacter = Class(function(self, name)
    self.name = name
    self._level = 1
    self._health = 100
    self._mana = 50
    
    -- Level validation (1-100)
    addsetter(self, "level", function(self, value, old)
        if type(value) ~= "number" then
            error("Level must be a number")
        end
        value = math.max(1, math.min(100, math.floor(value)))
        self._level = value
        
        -- Scale health and mana with level
        self.max_health = 100 + (value * 10)
        self.max_mana = 50 + (value * 5)
    end)
    
    -- Health validation
    addsetter(self, "health", function(self, value, old)
        value = math.max(0, math.min(value, self.max_health))
        self._health = value
        
        if value <= 0 then
            self:OnDeath()
        end
    end)
    
    -- Mana validation
    addsetter(self, "mana", function(self, value, old)
        value = math.max(0, math.min(value, self.max_mana))
        self._mana = value
    end)
end)

-- Custom getter methods
function ValidatedCharacter:GetLevel()
    return self._level
end

function ValidatedCharacter:GetHealth()
    return self._health
end

function ValidatedCharacter:GetMana()
    return self._mana
end
```

### Component System Implementation
```lua
-- Base component class
local Component = Class(function(self)
    self.inst = nil  -- Will be set when added to entity
end)

-- Health component
local Health = Class(Component, function(self, max_health)
    Component._ctor(self)
    self.max_health = max_health or 100
    self.current_health = self.max_health
end)

function Health:TakeDamage(amount)
    self.current_health = math.max(0, self.current_health - amount)
    if self.current_health <= 0 then
        self.inst:PushEvent("death")
    end
    self.inst:PushEvent("healthdelta", {old = self.current_health + amount, new = self.current_health})
end

-- Movement component
local Movement = Class(Component, function(self, speed)
    Component._ctor(self)
    self.speed = speed or 1
    self.x = 0
    self.y = 0
end)

function Movement:MoveTo(x, y)
    self.x = x
    self.y = y
    self.inst:PushEvent("moved", {x = x, y = y})
end

-- Entity using components
local GameObject = Class(function(self)
    self.components = {}
    self.event_listeners = {}
end)

function GameObject:AddComponent(name, component)
    self.components[name] = component
    component.inst = self
    return component
end

function GameObject:GetComponent(name)
    return self.components[name]
end

function GameObject:PushEvent(event, data)
    local listeners = self.event_listeners[event]
    if listeners then
        for _, fn in ipairs(listeners) do
            fn(self, data)
        end
    end
end

-- Usage
local player = GameObject()
local health = player:AddComponent("health", Health(150))
local movement = player:AddComponent("movement", Movement(3))

-- Listen for events
player.event_listeners["death"] = {
    function(inst, data)
        print("Player died!")
    end
}
```

### Factory Pattern with Classes
```lua
-- Abstract factory
local EntityFactory = Class(function(self)
    self.blueprints = {}
end)

function EntityFactory:RegisterBlueprint(name, class_type, default_params)
    self.blueprints[name] = {
        class_type = class_type,
        params = default_params or {}
    }
end

function EntityFactory:Create(blueprint_name, custom_params)
    local blueprint = self.blueprints[blueprint_name]
    if not blueprint then
        error("Unknown blueprint: " .. blueprint_name)
    end
    
    -- Merge default and custom parameters
    local params = {}
    for k, v in pairs(blueprint.params) do
        params[k] = v
    end
    if custom_params then
        for k, v in pairs(custom_params) do
            params[k] = v
        end
    end
    
    return blueprint.class_type(unpack(params))
end

-- Usage with previous classes
local factory = EntityFactory()
factory:RegisterBlueprint("basic_player", Player, {"DefaultPlayer", 0, 0})
factory:RegisterBlueprint("strong_warrior", Warrior, {"DefaultWarrior", 200, "battleaxe"})
factory:RegisterBlueprint("spider", Monster, {"Spider", 0, 0, 50, 15})

-- Create instances
local player1 = factory:Create("basic_player", {"Wilson"})
local warrior1 = factory:Create("strong_warrior", {"Wigfrid", 250})
local spider1 = factory:Create("spider")
```

## Instance Tracking and Debugging

### HandleClassInstanceTracking()
Provides periodic reports on class instance counts for memory debugging.

```lua
function HandleClassInstanceTracking()
```

**Usage:**
```lua
-- Enable tracking (set at top of class.lua)
TrackClassInstances = true
ClassTrackingInterval = 60  -- Report every 60 frames

-- In main game loop
function Update(dt)
    HandleClassInstanceTracking()
    -- ... other update logic
end

-- Output will show top 10 classes by instance count:
-- 1 : Monster - 1500
-- 2 : Component - 800  
-- 3 : Player - 4
```

### ReloadedClass(mt)
Cleans up class registry during hot reloading.

```lua
function ReloadedClass(mt)
```

**Usage:**
```lua
-- Called automatically during mod hot reload
-- Removes old class definitions from registry
```

## Best Practices

### Constructor Patterns
```lua
-- Good: Clear parameter validation
local Character = Class(function(self, name, health, level)
    assert(type(name) == "string", "Name must be a string")
    assert(type(health) == "number", "Health must be a number")
    
    self.name = name
    self.health = math.max(1, health)
    self.level = level or 1
end)

-- Good: Default parameter handling
local Monster = Class(function(self, config)
    config = config or {}
    self.health = config.health or 100
    self.damage = config.damage or 10
    self.speed = config.speed or 1
end)
```

### Inheritance Best Practices
```lua
-- Good: Always call parent constructor
local Derived = Class(Base, function(self, ...)
    Base._ctor(self, ...)  -- Call parent first
    -- Then initialize derived-specific properties
end)

-- Good: Override methods properly
function Derived:SomeMethod(...)
    -- Call parent method if needed
    local result = Base.SomeMethod(self, ...)
    
    -- Add derived behavior
    -- ... additional logic
    
    return result
end
```

### Property Management
```lua
-- Good: Use setters for validation
local ValidatedClass = Class(function(self)
    self._private_value = 0
    
    addsetter(self, "value", function(self, new_val, old_val)
        if type(new_val) ~= "number" then
            error("Value must be a number")
        end
        self._private_value = math.max(0, new_val)
    end)
end)

-- Good: Provide getter methods for computed properties
function ValidatedClass:GetValue()
    return self._private_value
end

function ValidatedClass:GetDisplayValue()
    return string.format("%.2f", self._private_value)
end
```

## Common Patterns

### Singleton Pattern
```lua
local Singleton = Class(function(self)
    if Singleton._instance then
        error("Singleton already exists")
    end
    Singleton._instance = self
    self.data = {}
end)

function Singleton:GetInstance()
    if not Singleton._instance then
        Singleton._instance = Singleton()
    end
    return Singleton._instance
end
```

### Observer Pattern
```lua
local Observable = Class(function(self)
    self.observers = {}
end)

function Observable:AddObserver(observer)
    table.insert(self.observers, observer)
end

function Observable:RemoveObserver(observer)
    for i, obs in ipairs(self.observers) do
        if obs == observer then
            table.remove(self.observers, i)
            break
        end
    end
end

function Observable:NotifyObservers(event, data)
    for _, observer in ipairs(self.observers) do
        if observer.OnNotify then
            observer:OnNotify(event, data)
        end
    end
end
```

### State Machine Pattern
```lua
local StateMachine = Class(function(self, initial_state)
    self.current_state = initial_state
    self.states = {}
end)

function StateMachine:AddState(name, state_object)
    self.states[name] = state_object
    state_object.machine = self
end

function StateMachine:ChangeState(new_state)
    local old_state = self.states[self.current_state]
    local next_state = self.states[new_state]
    
    if old_state and old_state.OnExit then
        old_state:OnExit()
    end
    
    self.current_state = new_state
    
    if next_state and next_state.OnEnter then
        next_state:OnEnter()
    end
end
```

## Related Systems

- **[Components](../components/)**: Component-based entity architecture
- **[Prefabs](../prefabs.md)**: Entity creation and management
- **[Mod System](../mod-system/)**: Hot reloading and class modifications
- **[Memory Management](../memory.md)**: Instance tracking and garbage collection
- **[Event System](../events.md)**: Object communication patterns

## Technical Notes

- **Lua Compatibility**: Designed for Lua 5.1, not compatible with Lua 5.0
- **Metatable Usage**: Heavily relies on metatables for inheritance and property management
- **Memory Management**: Optional instance tracking helps identify memory leaks
- **Hot Reloading**: Supports mod development with class reloading capabilities
- **Single Inheritance**: Only supports single inheritance, not multiple inheritance
- **Performance**: Minimal overhead for method dispatch through metatable chains

## Troubleshooting

### Class Creation Issues
- **Constructor Not Called**: Ensure constructor function is properly passed to Class()
- **Inheritance Problems**: Always call parent constructor in derived classes
- **Property Access Errors**: Check if property setters are properly configured

### Memory Leaks
- **Enable Tracking**: Set `TrackClassInstances = true` to monitor instance counts
- **Check References**: Look for circular references preventing garbage collection
- **Component Cleanup**: Ensure components are properly removed when entities are destroyed

### Property Management
- **Setter Errors**: Validate that setter functions handle all edge cases
- **Read-only Issues**: Verify read-only properties are set after makereadonly() call
- **Type Validation**: Add proper type checking in property setters

### Performance Issues
- **Deep Inheritance**: Avoid excessively deep inheritance chains
- **Property Overhead**: Use direct access for frequently accessed properties
- **Instance Creation**: Pool objects when creating many short-lived instances
