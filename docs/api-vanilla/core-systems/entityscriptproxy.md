---
id: entityscriptproxy
title: EntityScript Proxy System
description: Proxy wrapper system for EntityScript instances providing transparent access control and memory management
sidebar_position: 17
slug: api-vanilla/core-systems/entityscriptproxy
last_updated: 2025-01-27
build_version: 676042
change_status: stable
---

# EntityScript Proxy System

## Version History
| Build Version | Change Date | Change Type | Description |
|---|---|---|---|
| 676042 | 2025-01-27 | stable | Current version |

## Overview

The EntityScript Proxy system provides a transparent wrapper mechanism for EntityScript instances, enabling controlled access to entity data while maintaining proper memory management and reference handling. This system is particularly useful for creating safe interfaces between different parts of the codebase and handling entity lifecycle management.

## Usage Example

```lua
-- Create a proxy for an entity
local entity = CreateEntity()
local proxy = EntityScriptProxy(entity)

-- Access works transparently through the proxy
proxy:AddComponent("health")
proxy.components.health:SetMaxHealth(100)

-- Proxy maintains proper references
local health_component = proxy.components.health
print("Max health:", health_component:GetMaxHealth())
```

## Core Functions

### ProxyClass(class, ctor) {#proxy-class}

**Status:** `stable`

**Description:**
Creates a proxy class for the specified base class with optional custom constructor logic.

**Parameters:**
- `class` (Class): The base class to create a proxy for
- `ctor` (function, optional): Custom constructor function for the proxy

**Returns:**
- (ProxyClass): The created proxy class

**Example:**
```lua
-- Create a custom proxy class
local MyProxy = ProxyClass(MyClass, function(self)
    print("Custom proxy created for", self._)
end)

-- Use the proxy class
local obj = MyClass()
local proxy = MyProxy(obj)
```

**Implementation Details:**
- Maintains reference counting for proxy instances
- Overrides metamethods for transparent access
- Handles garbage collection properly
- Caches proxy classes to avoid recreation

### ProxyInstance(obj) {#proxy-instance}

**Status:** `stable`

**Description:**
Creates a proxy instance for an existing object using its metatable.

**Parameters:**
- `obj` (object): The object to create a proxy for

**Returns:**
- (ProxyInstance): A proxy instance wrapping the object

**Example:**
```lua
-- Create proxy for existing object
local entity = CreateEntity()
local proxy = ProxyInstance(entity)

-- Access original object through proxy
proxy:AddTag("proxied")
print("Original object:", proxy._)
```

### EntityScriptProxy {#entity-script-proxy}

**Type:** `ProxyClass`

**Status:** `stable`

**Description:**
Specialized proxy class for EntityScript instances that provides enhanced component and replica access.

**Features:**
- Transparent access to all EntityScript methods and properties
- Enhanced component proxy system with automatic `.inst` reference management
- Replica proxy system with proper reference handling
- Memory-efficient caching of proxy components

**Example:**
```lua
-- Create EntityScript proxy
local entity = CreateEntity()
local proxy = EntityScriptProxy(entity)

-- Components automatically get proxy treatment
proxy:AddComponent("health")
local health_proxy = proxy.components.health
-- health_proxy.inst points to the proxy, not the original entity

-- Replica components work the same way
local health_replica = proxy.replica.health
-- Maintains proper reference chain
```

## Proxy Metamethods

### __index {#metamethod-index}

**Status:** `stable`

**Description:**
Handles property access on proxy objects, falling back to the wrapped object if property doesn't exist on proxy.

**Behavior:**
1. Check proxy's metatable for the property
2. Fall back to the wrapped object's property
3. Return nil if property doesn't exist

### __newindex {#metamethod-newindex}

**Status:** `stable`

**Description:**
Handles property assignment on proxy objects, directing assignments to the wrapped object.

**Behavior:**
- All property assignments are directed to the wrapped object
- Proxy itself remains unchanged except for special proxy properties

### __eq {#metamethod-eq}

**Status:** `stable`

**Description:**
Handles equality comparison between proxy objects and their wrapped objects.

**Behavior:**
- Compares the wrapped objects, not the proxy wrappers
- Allows transparent equality checking between proxies and original objects

### __gc {#metamethod-gc}

**Status:** `stable`

**Description:**
Handles garbage collection and reference counting for proxy objects.

**Behavior:**
- Decrements reference count when proxy is collected
- Removes equality override when no more proxies exist
- Ensures proper cleanup of proxy resources

## Component Proxy System

### Component Access

```lua
-- Component proxies are created on-demand
local entity = CreateEntity()
local proxy = EntityScriptProxy(entity)

proxy:AddComponent("health")

-- First access creates component proxy
local health_component = proxy.components.health
-- Subsequent accesses return cached proxy
local same_component = proxy.components.health
-- health_component == same_component is true
```

### Automatic Reference Management

```lua
-- Component proxies automatically get correct .inst reference
local proxy = EntityScriptProxy(entity)
proxy:AddComponent("inventory")

local inventory = proxy.components.inventory
-- inventory.inst points to the proxy, not the original entity
assert(inventory.inst == proxy)
```

## Memory Management

### Reference Counting

The proxy system maintains automatic reference counting to optimize memory usage:

```lua
-- Creating multiple proxies increments count
local proxy1 = EntityScriptProxy(entity)
local proxy2 = EntityScriptProxy(entity)
-- Reference count is now 2

-- When proxies are garbage collected, count decrements
proxy1 = nil
collectgarbage()
-- Reference count is now 1

-- When count reaches 0, cleanup occurs
proxy2 = nil
collectgarbage()
-- All proxy metadata is cleaned up
```

### Garbage Collection

```lua
-- Proxy cleanup is automatic
local function CreateTempProxy(entity)
    local proxy = EntityScriptProxy(entity)
    proxy:AddComponent("temporary")
    return proxy.components.temporary
    -- proxy goes out of scope here
end

local temp_component = CreateTempProxy(entity)
collectgarbage()
-- Proxy is automatically cleaned up
-- Component proxy remains valid because it's still referenced
```

## Advanced Usage Patterns

### Safe Entity Interfaces

```lua
-- Create safe interface for entity access
local function CreateSafeEntityInterface(entity)
    local proxy = EntityScriptProxy(entity)
    
    -- Add safety checks
    proxy.SafeAddComponent = function(self, name)
        if not self:IsValid() then
            print("Cannot add component to invalid entity")
            return nil
        end
        return self:AddComponent(name)
    end
    
    return proxy
end

-- Usage
local safe_entity = CreateSafeEntityInterface(entity)
safe_entity:SafeAddComponent("health")
```

### Component Wrapper System

```lua
-- Create specialized component access
local function CreateInventoryInterface(entity)
    local proxy = EntityScriptProxy(entity)
    
    -- Ensure inventory component exists
    if not proxy.components.inventory then
        proxy:AddComponent("inventory")
    end
    
    -- Create specialized interface
    proxy.GetItemCount = function(self, prefab)
        return self.components.inventory:GetItemCount(prefab)
    end
    
    proxy.GiveItem = function(self, item)
        return self.components.inventory:GiveItem(item)
    end
    
    return proxy
end
```

### Temporary Entity Modifications

```lua
-- Make temporary changes safely
local function WithTemporaryModifications(entity, modifications, callback)
    local proxy = EntityScriptProxy(entity)
    local original_values = {}
    
    -- Apply modifications
    for property, value in pairs(modifications) do
        original_values[property] = proxy[property]
        proxy[property] = value
    end
    
    -- Execute callback
    local result = callback(proxy)
    
    -- Restore original values
    for property, value in pairs(original_values) do
        proxy[property] = value
    end
    
    return result
end

-- Usage
local result = WithTemporaryModifications(entity, {
    name = "Temporary Name",
    custom_flag = true
}, function(temp_entity)
    return temp_entity:DoSomething()
end)
```

## Performance Considerations

### Caching Strategy

The proxy system uses intelligent caching to minimize overhead:

- Proxy classes are cached and reused
- Component proxies are created once and cached
- Metadata is shared between proxy instances of the same class

### Access Patterns

```lua
-- Efficient: Cache proxy references
local proxy = EntityScriptProxy(entity)
local health = proxy.components.health
for i = 1, 1000 do
    health:DoDelta(-1) -- Fast access
end

-- Less efficient: Repeated proxy creation
for i = 1, 1000 do
    local proxy = EntityScriptProxy(entity) -- Creates new proxy each time
    proxy.components.health:DoDelta(-1)
end
```

### Memory Usage

```lua
-- Monitor proxy memory usage
local function GetProxyCount()
    local count = 0
    for class, proxy_class in pairs(ProxyClasses) do
        count = count + 1
    end
    return count
end

print("Active proxy classes:", GetProxyCount())
```

## Common Usage Patterns

### Plugin System Interface

```lua
-- Create plugin-safe entity interface
local function CreatePluginInterface(entity)
    local proxy = EntityScriptProxy(entity)
    
    -- Restrict access to safe methods only
    local safe_interface = {
        GetPosition = function() return proxy:GetPosition() end,
        GetDisplayName = function() return proxy:GetDisplayName() end,
        HasTag = function(tag) return proxy:HasTag(tag) end,
        IsValid = function() return proxy:IsValid() end,
    }
    
    return safe_interface
end
```

### Debugging and Inspection

```lua
-- Create debug proxy with logging
local function CreateDebugProxy(entity, log_access)
    local proxy = EntityScriptProxy(entity)
    
    if log_access then
        -- Override component access to log
        local original_components = proxy.components
        proxy.components = setmetatable({}, {
            __index = function(t, k)
                print("Accessing component:", k)
                return original_components[k]
            end
        })
    end
    
    return proxy
end

-- Usage
local debug_entity = CreateDebugProxy(entity, true)
debug_entity.components.health -- Logs: "Accessing component: health"
```

### Validation Wrapper

```lua
-- Add validation to entity operations
local function CreateValidatedProxy(entity)
    local proxy = EntityScriptProxy(entity)
    
    -- Override methods with validation
    local original_AddComponent = proxy.AddComponent
    proxy.AddComponent = function(self, name)
        if not name or type(name) ~= "string" then
            error("Invalid component name: " .. tostring(name))
        end
        return original_AddComponent(self, name)
    end
    
    return proxy
end
```

## Troubleshooting

### Common Issues

**Proxy reference loops:**
```lua
-- Avoid circular references
local proxy = EntityScriptProxy(entity)
-- Don't do this:
-- entity.my_proxy = proxy -- Creates circular reference

-- Instead, use weak references or temporary storage
local proxy_registry = setmetatable({}, {__mode = "v"})
proxy_registry[entity] = proxy
```

**Memory leaks:**
```lua
-- Ensure proxies are properly cleaned up
local function CleanupProxy(proxy)
    -- Clear any custom properties
    for k, v in pairs(proxy) do
        if type(k) == "string" and not k:match("^_") then
            proxy[k] = nil
        end
    end
end
```

### Debugging

```lua
-- Check proxy state
local function DebugProxy(proxy)
    print("Proxy type:", type(proxy))
    print("Wrapped object:", proxy._)
    print("Is EntityScript proxy:", proxy:is_a(EntityScriptProxy))
    
    -- Check component proxies
    if proxy.components then
        for name, component in pairs(proxy.components._) do
            print("Component proxy:", name, component.inst == proxy)
        end
    end
end
```

## Related Modules

- [EntityScript](./entityscript.md): Core entity functionality that proxies wrap
- [Entity Replica System](./entityreplica.md): Network replication system that works with proxies
- [Class](./class.md): Base class system used for proxy creation
- [Components Overview](./index.md): Component system that benefits from proxy interfaces
