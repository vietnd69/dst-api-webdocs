---
id: class
title: Class
description: Provides an object-oriented class system with inheritance, property setters, and instance tracking for Lua in DST.
tags: [utility, oop, core]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: 54cf8ca7
system_scope: world
---

# Class

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`class.lua` implements a foundational object-oriented programming system for Don't Starve Together. It provides class creation with inheritance support, property getter/setter mechanisms, read-only property protection, and optional instance tracking for debugging. This utility is used throughout the codebase to define structured data types, components, stategraphs, and other systems that benefit from encapsulation and inheritance.

## Usage example
```lua
local Class = require("class")

local MyClass = Class(function(self, name, value)
    self.name = name
    self.value = value
end)

local instance = MyClass("test", 42)
print(instance.name) -- "test"
print(instance.value) -- 42

-- With property setters
local MyPropClass = Class(nil, function(self) self._count = 0 end, {
    count = function(self, val, old)
        print("Count changed from "..tostring(old).." to "..tostring(val))
    end
})
```

## Dependencies & tags
**Components used:** None identified
**Tags:** None identified

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_base` | table | `nil` | Reference to parent class when using inheritance. |
| `_ctor` | function | `nil` | Constructor function called on instance creation. |
| `is_a` | function | `_is_a` | Method to check if instance is descendant of a class. |
| `is_class` | function | `_is_class` | Method to check if table is a class definition. |
| `is_instance` | function | function | Method to check if object is an instance of this class. |

## Main functions
### `Class(base, _ctor, props)`
*   **Description:** Creates a new class with optional inheritance, constructor, and property handlers. This is the primary entry point for defining classes in DST.
*   **Parameters:** 
    *   `base` (table or function) - Parent class to inherit from, or constructor function if no inheritance.
    *   `_ctor` (function) - Constructor called with `self` as first argument when creating instances.
    *   `props` (table) - Optional table of property names mapped to setter functions for reactive property changes.
*   **Returns:** A class table that can be called to create instances.
*   **Error states:** If `props` is provided but the class system is not properly initialized, property setters may fail.

### `makereadonly(t, k)`
*   **Description:** Converts an existing property into a read-only property that cannot be modified after initialization.
*   **Parameters:** 
    *   `t` (table) - The class or instance table.
    *   `k` (string) - The property key to make read-only.
*   **Returns:** Nothing.
*   **Error states:** Asserts if the class does not support read-only properties (no `props` table was defined).

### `addsetter(t, k, fn)`
*   **Description:** Adds or updates a setter function for a property, enabling reactive behavior when the property value changes.
*   **Parameters:** 
    *   `t` (table) - The class or instance table.
    *   `k` (string) - The property key.
    *   `fn` (function) - Setter function called with `(table, new_value, old_value)` when property changes.
*   **Returns:** Nothing.
*   **Error states:** Asserts if the class does not support property setters.

### `removesetter(t, k)`
*   **Description:** Removes a setter function from a property, converting it back to a regular field.
*   **Parameters:** 
    *   `t` (table) - The class or instance table.
    *   `k` (string) - The property key to remove the setter from.
*   **Returns:** Nothing.

### `_is_a(self, klass)`
*   **Description:** Internal function to check if an object is a descendant of a given class through the inheritance chain.
*   **Parameters:** 
    *   `self` (table) - The instance to check.
    *   `klass` (table) - The class to test against.
*   **Returns:** `true` if `self` inherits from `klass`, `false` otherwise.

### `_is_class(self)`
*   **Description:** Internal function to determine if a table is a class definition rather than an instance.
*   **Parameters:** 
    *   `self` (table) - The table to check.
*   **Returns:** `true` if the table is a class, `false` if it is an instance.

### `ReloadedClass(mt)`
*   **Description:** Removes a class from the `ClassRegistry` when hot-reloading code, preventing memory leaks from stale references.
*   **Parameters:** 
    *   `mt` (table) - The metatable of the class to remove.
*   **Returns:** Nothing.

### `HandleClassInstanceTracking()`
*   **Description:** Debug function that periodically prints the top 10 most instantiated classes when `TrackClassInstances` is enabled. Used for memory profiling and leak detection.
*   **Parameters:** None.
*   **Returns:** Nothing.
*   **Error states:** Only functions when `TrackClassInstances` is set to `true` and `CWD` is defined.

## Events & listeners
Not applicable