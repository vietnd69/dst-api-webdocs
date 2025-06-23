---
id: class
title: Class
description: Object-oriented programming system providing inheritance, property management, and instance tracking
sidebar_position: 11
slug: /api-vanilla/core-systems/class
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Class

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The **Class** system provides object-oriented programming capabilities for Don't Starve Together's Lua environment. It implements inheritance, property management with setters/getters, read-only properties, instance tracking, and hot reloading support. This system enables structured code organization and reusable component patterns throughout the game.

The Class system is compatible with Lua 5.1 and uses metatables to implement inheritance and method dispatch. It supports single inheritance, constructor functions, property validation, and optional instance tracking for memory debugging.

## Usage Example

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

-- Create instances
local player = Player("Wilson", 150)
local warrior = Warrior("Wigfrid", 200, "spear")

-- Check inheritance
print(player:is_a(Player))    -- true
print(warrior:is_a(Player))   -- true (inheritance)
print(warrior:is_a(Warrior))  -- true
```

## Functions

### Class(base, _ctor, props) {#class}

**Status:** `stable`

**Description:**
Creates a new class with optional inheritance, constructor, and property management.

**Parameters:**
- `base` (table/function, optional): Base class for inheritance, or constructor if no inheritance
- `_ctor` (function, optional): Constructor function called when creating instances  
- `props` (table, optional): Property definitions with setter functions

**Returns:**
- (table): New class object with metatable configured for inheritance

**Example:**
```lua
-- Simple class
local Animal = Class(function(self, name)
    self.name = name
    self.health = 100
end)

-- Class with inheritance
local Dog = Class(Animal, function(self, name, breed)
    Animal._ctor(self, name)
    self.breed = breed
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

**Version History:**
- Added in initial implementation
- Supports Lua 5.1 compatibility

### makereadonly(t, k) {#makereadonly}

**Status:** `stable`

**Description:**
Makes a property read-only, preventing modification after initial assignment.

**Parameters:**
- `t` (table): Instance to modify
- `k` (string): Property name to make read-only

**Returns:**
- (void): No return value

**Example:**
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

**Version History:**
- Added in initial implementation

### addsetter(t, k, fn) {#addsetter}

**Status:** `stable`

**Description:**
Adds a setter function that validates or transforms property assignments.

**Parameters:**
- `t` (table): Instance to modify
- `k` (string): Property name
- `fn` (function): Setter function with signature `(self, new_value, old_value)`

**Returns:**
- (void): No return value

**Example:**
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

**Version History:**
- Added in initial implementation

### removesetter(t, k) {#removesetter}

**Status:** `stable`

**Description:**
Removes a property setter, restoring direct property access.

**Parameters:**
- `t` (table): Instance to modify
- `k` (string): Property name

**Returns:**
- (void): No return value

**Example:**
```lua
-- Remove the health setter for direct access
removesetter(player, "health")
player.health = 75  -- Now sets directly without validation
```

**Version History:**
- Added in initial implementation

## Instance Methods

### inst:is_a(klass) {#is-a}

**Status:** `stable`

**Description:**
Checks if an instance is derived from a specific class.

**Parameters:**
- `klass` (table): Class to check inheritance against

**Returns:**
- (boolean): `true` if instance inherits from the class

**Example:**
```lua
local player = Player("Wilson", 150)
local warrior = Warrior("Wigfrid", 200, "spear")

print(player:is_a(Player))    -- true
print(warrior:is_a(Player))   -- true (inheritance)
print(warrior:is_a(Warrior))  -- true
print(player:is_a(Warrior))   -- false
```

**Version History:**
- Added in initial implementation

### inst:is_class() {#is-class}

**Status:** `stable`

**Description:**
Checks if an object is a class definition rather than an instance.

**Parameters:**
- None

**Returns:**
- (boolean): `true` if object is a class, `false` if instance

**Example:**
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

**Version History:**
- Added in initial implementation

### Class:is_instance(obj) {#is-instance}

**Status:** `stable`

**Description:**
Class method to check if an object is an instance of this specific class.

**Parameters:**
- `obj` (any): Object to test

**Returns:**
- (boolean): `true` if object is an instance of this class

**Example:**
```lua
local player = Player("Wilson")
local number = 42

print(Player:is_instance(player))  -- true
print(Player:is_instance(number))  -- false
print(Warrior:is_instance(player)) -- false (different class)
```

**Version History:**
- Added in initial implementation

## Global Configuration

### TrackClassInstances

**Value:** `false`

**Status:** `stable`

**Description:** Enable/disable instance tracking for debugging purposes.

**Example:**
```lua
-- Enable in class.lua for development
local TrackClassInstances = true
```

**Version History:**
- Added in initial implementation

### ClassRegistry

**Type:** `table`

**Status:** `stable`

**Description:** Registry of all defined classes for hot reloading support.

**Version History:**
- Added in initial implementation

### ClassTrackingTable

**Type:** `table`

**Status:** `stable`

**Description:** Weak-keyed table tracking instances per class when tracking is enabled.

**Version History:**
- Added in initial implementation

### ClassTrackingInterval

**Value:** `100`

**Status:** `stable`

**Description:** Frames between tracking reports when instance tracking is enabled.

**Version History:**
- Added in initial implementation

## Advanced Functions

### HandleClassInstanceTracking() {#handle-class-instance-tracking}

**Status:** `stable`

**Description:**
Provides periodic reports on class instance counts for memory debugging. Must be called from main game loop when tracking is enabled.

**Parameters:**
- None

**Returns:**
- (void): No return value

**Example:**
```lua
-- Enable tracking (set at top of class.lua)
local TrackClassInstances = true
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

**Version History:**
- Added in initial implementation

### ReloadedClass(mt) {#reloaded-class}

**Status:** `stable`

**Description:**
Cleans up class registry during hot reloading to prevent memory leaks.

**Parameters:**
- `mt` (table): Class metatable to remove from registry

**Returns:**
- (void): No return value

**Example:**
```lua
-- Called automatically during mod hot reload
-- Removes old class definitions from registry
```

**Version History:**
- Added in initial implementation

## Common Usage Patterns

### Basic Inheritance
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
```

### Property Validation
```lua
local ValidatedCharacter = Class(function(self, name)
    self.name = name
    self._level = 1
    self._health = 100
    
    -- Level validation (1-100)
    addsetter(self, "level", function(self, value, old)
        if type(value) ~= "number" then
            error("Level must be a number")
        end
        value = math.max(1, math.min(100, math.floor(value)))
        self._level = value
        
        -- Scale health with level
        self.max_health = 100 + (value * 10)
    end)
    
    -- Health validation
    addsetter(self, "health", function(self, value, old)
        value = math.max(0, math.min(value, self.max_health))
        self._health = value
        
        if value <= 0 then
            self:OnDeath()
        end
    end)
end)
```

### Component System
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
```

## Implementation Details

The Class system uses several Lua metatable features:

- **`__index`**: For method lookup and property getters
- **`__newindex`**: For property setters and validation
- **`__call`**: For constructor invocation
- **Weak references**: For memory-safe instance tracking

### Metatable Structure
```lua
-- Class metatable provides inheritance chain
local c = {}  -- Class table
c._base = base_class  -- Parent class reference
c.__index = c  -- Method lookup
c._ctor = constructor  -- Constructor function

-- Instance tracking (when enabled)
ClassTrackingTable[mt] = {}  -- Weak-keyed instance table
```

## Related Modules

- **[Components](../components/)**: Component-based entity architecture built on Class system
- **[Prefabs](../prefabs.md)**: Entity creation using Class-based components
- **[EntityScript](../entityscript.md)**: Core entity functionality using Class inheritance
- **[Mod System](../mods.md)**: Hot reloading support for class modifications

## Technical Notes

- **Lua Version**: Compatible with Lua 5.1, not compatible with Lua 5.0
- **Memory Management**: Uses weak references for instance tracking to prevent memory leaks
- **Performance**: Minimal overhead for method dispatch through metatable chains
- **Inheritance**: Single inheritance only, no multiple inheritance support
- **Hot Reloading**: Full support for class redefinition during development

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

### Inheritance Guidelines
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
