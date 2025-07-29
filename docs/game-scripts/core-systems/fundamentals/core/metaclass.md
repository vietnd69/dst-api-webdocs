---
id: metaclass
title: MetaClass
description: Advanced class creation system using userdata objects for enhanced garbage collection control
sidebar_position: 2
slug: gams-scripts/core-systems/metaclass
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# MetaClass

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `MetaClass` module provides an advanced class creation system that uses userdata objects instead of tables as the base for instances. This approach allows for enhanced control over garbage collection and enables replacement of metamethods like `__gc` and `__len` that are normally restricted when using tables.

The system is designed to solve garbage collection quirks where metatables could be collected before userdata, potentially causing crashes.

## Key Features

- **Userdata-based Objects**: Uses `newproxy(true)` to create userdata objects instead of tables
- **Complete Metamethod Support**: Full support for all Lua metamethods including `__gc`
- **Garbage Collection Safety**: Built-in protection against premature metatable collection
- **Inheritance Support**: Supports class inheritance with `is_a` method
- **Constructor Flexibility**: Supports both base class extension and standalone constructors

## Functions

### MetaClass(base, _ctor) {#metaclass-constructor}

**Status:** `stable`

**Description:**
Creates a new MetaClass definition. Like the standard `Class` function but uses userdata objects as the base, allowing replacement of `__gc` and `__len` functions.

**Parameters:**
- `base` (table|function): Either a base class to inherit from, or a constructor function if no inheritance is needed
- `_ctor` (function, optional): Constructor function when `base` is a table

**Returns:**
- (table): The class definition that can be called to create instances

**Example:**
```lua
-- Create a simple MetaClass with constructor
local MyClass = MetaClass(function(self, name)
    self.name = name
    self.created_time = GetTime()
end)

-- Create instance
local instance = MyClass("TestObject")
print(instance.name) -- "TestObject"

-- Create MetaClass with inheritance
local BaseClass = MetaClass(function(self, value)
    self.base_value = value
end)

local DerivedClass = MetaClass(BaseClass, function(self, value, extra)
    BaseClass._ctor(self, value)
    self.extra_data = extra
end)

local derived = DerivedClass(10, "additional")
print(derived.base_value) -- 10
print(derived.extra_data) -- "additional"
```

## Built-in Methods

### instance:is_a(klass) {#is-a-method}

**Status:** `stable`

**Description:**
Checks if an instance is of a specific class or inherits from it. Traverses the inheritance chain to find matches.

**Parameters:**
- `klass` (table): The class to check against

**Returns:**
- (boolean): `true` if the instance is of the specified class or inherits from it

**Example:**
```lua
local BaseClass = MetaClass(function(self) end)
local DerivedClass = MetaClass(BaseClass, function(self) end)

local instance = DerivedClass()
print(instance:is_a(DerivedClass)) -- true
print(instance:is_a(BaseClass))    -- true
```

## Metamethods

The MetaClass system provides comprehensive metamethod support through internal `metafunctions`:

### Object Access Metamethods

| Metamethod | Description | Usage |
|------------|-------------|--------|
| `__index` | Property/method access | `obj.property` or `obj[key]` |
| `__newindex` | Property assignment | `obj.property = value` |
| `__len` | Length operator | `#obj` |
| `__pairs` | Iteration with pairs | `for k,v in pairs(obj)` |
| `__ipairs` | Iteration with ipairs | `for i,v in ipairs(obj)` |
| `__next` | Next function override | `next(obj, key)` |

### Lifecycle Metamethods

| Metamethod | Description | Usage |
|------------|-------------|--------|
| `__gc` | Garbage collection | Automatic cleanup |
| `__eq` | Equality comparison | `obj1 == obj2` |

### Arithmetic Metamethods

| Metamethod | Description | Usage |
|------------|-------------|--------|
| `__add` | Addition | `obj + other` |
| `__sub` | Subtraction | `obj - other` |
| `__mul` | Multiplication | `obj * other` |
| `__div` | Division | `obj / other` |
| `__mod` | Modulo | `obj % other` |
| `__pow` | Exponentiation | `obj ^ other` |
| `__unm` | Unary minus | `-obj` |
| `__concat` | Concatenation | `obj .. other` |
| `__call` | Function call | `obj(args)` |
| `__lt` | Less than | `obj < other` |
| `__le` | Less than or equal | `obj <= other` |

## Implementation Details

### Garbage Collection Protection

The module uses a weak reference table to prevent premature collection of metatables:

```lua
local metatable_refs = setmetatable({}, {__mode = "k"})
```

When creating instances, the metatable is stored in this weak table to ensure it remains accessible until the userdata is collected.

### Metamethod Resolution

Each metamethod first checks for custom implementations in the instance's metatable (`mt._`), then falls back to the class definition (`mt.c`). This allows both instance-specific and class-level metamethod customization.

### Length Operator Protection

The `__len` metamethod includes recursion protection to prevent infinite loops:

```lua
if __len and not mt._insidelen then
    mt._insidelen = true
    local result = __len(t)
    mt._insidelen = false
    return result
```

## Usage Guidelines

### When to Use MetaClass

Use MetaClass instead of regular Class when you need:

- Custom garbage collection behavior (`__gc` metamethod)
- Precise control over object lifecycle
- Override length operator (`__len`) behavior
- Enhanced metamethod functionality

### Required Helper Functions

When working with MetaClass instances, use the meta* versions of standard functions:

- `metapairs()` instead of `pairs()`
- `metanext()` instead of `next()`
- `metaipairs()` instead of `ipairs()`
- `metarawget()` instead of `rawget()`
- `metarawset()` instead of `rawset()`

### Performance Considerations

MetaClass instances have slightly more overhead than regular tables due to:

- Userdata object creation
- Metatable reference management
- Metamethod resolution chain

Use MetaClass only when the advanced features are necessary.

## Common Patterns

### Custom Garbage Collection

```lua
local ResourceClass = MetaClass(function(self, resource_id)
    self.resource_id = resource_id
    self._cleanup_needed = true
end)

-- Define custom cleanup
ResourceClass.__gc = function(self)
    if self._cleanup_needed then
        -- Custom cleanup logic
        CleanupResource(self.resource_id)
    end
end
```

### Custom Length Behavior

```lua
local ContainerClass = MetaClass(function(self)
    self.items = {}
    self.capacity = 10
end)

ContainerClass.__len = function(self)
    return #self.items
end

local container = ContainerClass()
print(#container) -- Uses custom __len
```

## Related Modules

- [Class](./class.md): Standard table-based class system
- [EntityScript](./entityscript.md): Uses MetaClass for entity objects
- [ComponentUtil](./componentutil.md): Component system utilities

## Technical Notes

- MetaClass instances are userdata objects, not tables
- All data is stored in the metatable's `_` field
- Class definition is stored in the metatable's `c` field
- Supports full inheritance chain traversal
- Thread-safe for read operations
